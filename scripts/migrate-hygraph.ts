/**
 * One-off migration Hygraph → Sanity. Idempotent: documents get stable ids
 * derived from the Hygraph id and are written with createOrReplace, and
 * uploaded assets are remembered in scripts/.asset-map.<dataset>.json so a
 * rerun neither duplicates documents nor re-uploads images.
 *
 * Env (.env.local): HYGRAPH_URL, HYGRAPH_TOKEN (optional),
 * NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET.
 *
 * Writes use the token of the user logged in with `sanity login` (no API
 * token needed), or SANITY_WRITE_TOKEN when set.
 *
 *   pnpm migrate -- --dry-run
 *   pnpm migrate -- --dataset development
 */
import {
  createClient,
  type IdentifiedSanityDocumentStub as SanityDocumentStub,
} from "@sanity/client";
import { LexoRank } from "lexorank";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import pLimit from "p-limit";
import { getCliClient } from "sanity/cli";

if (fs.existsSync(".env.local")) process.loadEnvFile(".env.local");

const { values: args } = parseArgs({
  strict: false,
  args: process.argv.slice(process.argv.indexOf("--") + 1),
  options: {
    "dry-run": { type: "boolean", default: false },
    dataset: { type: "string" },
  },
});

const env = (name: string, required = true) => {
  const value = process.env[name];
  if (required && !value) throw new Error(`Missing env var ${name}`);
  return value ?? "";
};

const dryRun = args["dry-run"] === true;
const dataset = typeof args.dataset === "string" ? args.dataset : env("NEXT_PUBLIC_SANITY_DATASET");
const clientConfig = {
  projectId: env("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset,
  apiVersion: "2026-10-01",
  useCdn: false,
};
const sanity = process.env.SANITY_WRITE_TOKEN
  ? createClient({ ...clientConfig, token: process.env.SANITY_WRITE_TOKEN })
  : getCliClient(clientConfig);

// ---------------------------------------------------------------------------
// Hygraph

type HyAsset = { id: string; url: string; fileName?: string | null } | null;
type HyGallery = { images: NonNullable<HyAsset>[] } | null;

type HyData = {
  projects: {
    id: string;
    name: string;
    slug: string;
    year: number | null;
    agency: string | null;
    client: string | null;
    description: string | null;
    type: string | null;
    role: string | null;
    video: string | null;
    category: { id: string; name: string } | null;
    coverImage: HyAsset;
    team: { id: string; role: string; name: string }[];
    gallery: HyGallery;
  }[];
  expos: {
    id: string;
    slug: string;
    name: string;
    location: string | null;
    year: number | null;
    description: string | null;
    video: string | null;
    color: { hex: string } | null;
    cover: HyAsset;
    gallery: HyGallery;
  }[];
  achievements: {
    id: string;
    name: string;
    event: {
      id: string;
      institution: string | null;
      link: string | null;
      location: string | null;
      year: number | null;
      description: string | null;
    }[];
  }[];
  abouts: { bio: string | null; reel: string | null; profilePicture: HyAsset }[];
  clientPortfolios: { client: { id: string; name: string; logo: HyAsset }[] }[];
  contacts: { info: { __typename: string; id: string; name: string; link: string }[] }[];
};

const asset = `{ id url fileName }`;
const hygraphQuery = /* GraphQL */ `
  query Migration {
    projects(first: 1000, stage: PUBLISHED, orderBy: year_DESC) {
      id name slug year agency client description type role video
      category { id name }
      coverImage ${asset}
      team { id role name }
      gallery { images ${asset} }
    }
    expos(first: 1000, stage: PUBLISHED) {
      id slug name location year description video
      color { hex }
      cover ${asset}
      gallery { images ${asset} }
    }
    achievements(first: 1000, stage: PUBLISHED) {
      id name
      event { id institution link location year description }
    }
    abouts(first: 1, stage: PUBLISHED) { bio reel profilePicture ${asset} }
    clientPortfolios(first: 1, stage: PUBLISHED) { client { id name logo ${asset} } }
    contacts(first: 1, stage: PUBLISHED) {
      info {
        __typename
        ... on Email { id name link }
        ... on Social { id name link }
      }
    }
  }
`;

async function fetchHygraph(): Promise<HyData> {
  const token = env("HYGRAPH_TOKEN", false);
  const res = await fetch(env("HYGRAPH_URL"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query: hygraphQuery }),
  });
  const json = (await res.json()) as { data?: HyData; errors?: { message: string }[] };
  if (!res.ok || json.errors?.length || !json.data) {
    throw new Error(
      `Hygraph request failed (${res.status}): ${json.errors?.map((e) => e.message).join("; ")}`,
    );
  }
  return json.data;
}

// ---------------------------------------------------------------------------
// Assets

const mapFile = path.join(import.meta.dirname, `.asset-map.${dataset}.json`);
const assetMap: Record<string, string> = fs.existsSync(mapFile)
  ? JSON.parse(fs.readFileSync(mapFile, "utf8"))
  : {};
const limit = pLimit(4);

async function uploadAsset(a: NonNullable<HyAsset>, attempt = 1): Promise<string> {
  if (assetMap[a.id]) return assetMap[a.id];
  if (dryRun) return `image-dryrun-${a.id}`;
  try {
    const res = await fetch(a.url);
    if (!res.ok) throw new Error(`GET ${a.url} → ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const doc = await sanity.assets.upload("image", buffer, {
      filename: a.fileName ?? a.id,
      source: { name: "hygraph", id: a.id, url: a.url },
    });
    assetMap[a.id] = doc._id;
    fs.writeFileSync(mapFile, JSON.stringify(assetMap, null, 2));
    return doc._id;
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((r) => setTimeout(r, 1000 * attempt));
    return uploadAsset(a, attempt + 1);
  }
}

async function uploadAll(assets: HyAsset[]) {
  const unique = new Map(assets.filter(Boolean).map((a) => [a!.id, a!]));
  let done = 0;
  await Promise.all(
    [...unique.values()].map((a) =>
      limit(async () => {
        await uploadAsset(a);
        process.stdout.write(`\r  imágenes: ${++done}/${unique.size}`);
      }),
    ),
  );
  process.stdout.write("\n");
}

const image = (a: HyAsset, alt?: string | null) =>
  a && {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetMap[a.id] ?? `image-dryrun-${a.id}` },
    ...(alt ? { alt } : {}),
  };

const gallery = (g: HyGallery, alt: string) =>
  (g?.images ?? []).map((a) => ({ _key: a.id, ...image(a, alt)! }));

// ---------------------------------------------------------------------------
// Mapping

const orderRanks = (n: number) => {
  let rank = LexoRank.min();
  return Array.from({ length: n }, () => (rank = rank.genNext().genNext()).toString());
};

const textToBlocks = (text: string | null) =>
  (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => ({
      _type: "block",
      _key: `p${i}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `p${i}s`, text: p, marks: [] }],
    }));

function toDocuments(data: HyData): SanityDocumentStub[] {
  const docs: SanityDocumentStub[] = [];

  const categories = new Map(
    data.projects.flatMap((p) => (p.category ? [[p.category.id, p.category.name]] : [])),
  );
  for (const [id, name] of categories) {
    docs.push({ _id: `category-${id}`, _type: "category", name });
  }

  const projectRanks = orderRanks(data.projects.length);
  data.projects.forEach((p, i) => {
    docs.push({
      _id: `project-${p.id}`,
      _type: "project",
      orderRank: projectRanks[i],
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      year: p.year,
      type: p.type,
      category: p.category && { _type: "reference", _ref: `category-${p.category.id}` },
      description: p.description,
      role: p.role,
      client: p.client,
      agency: p.agency,
      team: p.team.map((m) => ({ _key: m.id, _type: "member", role: m.role, name: m.name })),
      coverImage: image(p.coverImage, p.name),
      videoUrl: p.video,
      gallery: gallery(p.gallery, p.name),
    });
  });

  const expoRanks = orderRanks(data.expos.length);
  data.expos.forEach((e, i) => {
    docs.push({
      _id: `expo-${e.id}`,
      _type: "expo",
      orderRank: expoRanks[i],
      name: e.name,
      slug: { _type: "slug", current: e.slug },
      location: e.location,
      year: e.year,
      description: e.description,
      color: e.color && { _type: "color", hex: e.color.hex },
      cover: image(e.cover, e.name),
      videoUrl: e.video,
      gallery: gallery(e.gallery, e.name),
    });
  });

  const achievementRanks = orderRanks(data.achievements.length);
  data.achievements.forEach((a, i) => {
    docs.push({
      _id: `achievement-${a.id}`,
      _type: "achievement",
      orderRank: achievementRanks[i],
      name: a.name,
      events: a.event.map((ev) => ({ _key: ev.id, _type: "event", ...ev, id: undefined })),
    });
  });

  const about = data.abouts[0];
  if (about) {
    docs.push({
      _id: "about",
      _type: "about",
      bio: textToBlocks(about.bio),
      profilePicture: image(about.profilePicture, "Cristina Galán"),
      reelUrl: about.reel,
    });
  }

  const portfolio = data.clientPortfolios[0];
  if (portfolio) {
    docs.push({
      _id: "clients",
      _type: "clients",
      clients: portfolio.client.map((c) => ({
        _key: c.id,
        _type: "client",
        name: c.name,
        logo: image(c.logo),
      })),
    });
  }

  const contact = data.contacts[0];
  if (contact) {
    docs.push({
      _id: "contact",
      _type: "contact",
      links: contact.info.map((l) => ({
        _key: l.id,
        _type: "contactLink",
        kind: l.__typename === "Email" ? "email" : "social",
        name: l.name,
        url: l.__typename === "Email" && !l.link.includes(":") ? `mailto:${l.link}` : l.link,
      })),
    });
  }

  return docs;
}

// ---------------------------------------------------------------------------

async function main() {
  console.log(`Hygraph → Sanity (${dataset})${dryRun ? " [dry run]" : ""}`);
  const data = await fetchHygraph();

  const assets: HyAsset[] = [
    ...data.projects.flatMap((p) => [p.coverImage, ...(p.gallery?.images ?? [])]),
    ...data.expos.flatMap((e) => [e.cover, ...(e.gallery?.images ?? [])]),
    ...data.abouts.map((a) => a.profilePicture),
    ...data.clientPortfolios.flatMap((c) => c.client.map((cl) => cl.logo)),
  ];
  await uploadAll(assets);

  const docs = toDocuments(data);
  const counts = docs.reduce<Record<string, number>>((acc, d) => {
    acc[d._type] = (acc[d._type] ?? 0) + 1;
    return acc;
  }, {});
  console.log("  documentos:", counts);

  if (dryRun) {
    const out = path.join(import.meta.dirname, `.migration-preview.json`);
    fs.writeFileSync(out, JSON.stringify(docs, null, 2));
    console.log(`  dry run: vista previa en ${path.relative(process.cwd(), out)}`);
    return;
  }

  for (let i = 0; i < docs.length; i += 50) {
    const tx = sanity.transaction();
    docs.slice(i, i + 50).forEach((d) => tx.createOrReplace(d));
    await tx.commit({ visibility: "async" });
  }

  const written = await sanity.fetch<Record<string, number>>(`{
    "project": count(*[_type == "project"]),
    "expo": count(*[_type == "expo"]),
    "achievement": count(*[_type == "achievement"]),
    "category": count(*[_type == "category"])
  }`);
  console.log("  en Sanity:", written);
  const mismatch = Object.entries(written).filter(([type, n]) => n !== (counts[type] ?? 0));
  if (mismatch.length) {
    console.error("  ✗ los conteos no cuadran:", mismatch);
    process.exitCode = 1;
  } else {
    console.log("  ✓ conteos correctos");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
