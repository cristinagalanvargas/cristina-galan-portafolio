import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, Suspense, ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { VideoEmbed } from "@/components/video-embed";
import { getProject, getProjects, getProjectSlugs } from "@/sanity/lib/data";
import { pad, typeLabel } from "../../_components/format";
import { GalleryStrip } from "../../_components/gallery-strip";

type Props = PageProps<"/proto/b/projects/[slug]">;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.filter((slug): slug is string => Boolean(slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project?.name ?? "Proyecto" };
}

export default function ProjectPage({ params }: Props) {
  return (
    <ViewTransition enter="b-page-enter" exit="b-page-exit" default="none">
      <main>
        <Suspense fallback={<HeroFallback />}>
          <ProjectView params={params} />
        </Suspense>
      </main>
    </ViewTransition>
  );
}

function HeroFallback() {
  return (
    <section aria-busy className="flex h-svh items-end bg-black px-5 pb-10 text-white md:px-10">
      <p className="flex items-center gap-2 text-[11px] tracking-[0.32em] uppercase">
        <span className="b-rec size-1.5 rounded-full bg-(--b-red)" aria-hidden />
        Cargando bobina…
      </p>
    </section>
  );
}

const label = "text-[11px] tracking-[0.32em] uppercase";

async function ProjectView({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  const name = project.name ?? "Sin título";

  const slate = [
    ["Año", project.year],
    ["Categoría", project.category],
    ["Tipo", typeLabel(project.type)],
    ["Cliente", project.client],
    ["Agencia", project.agency],
    ["Rol", project.role?.trim()],
  ].filter((entry): entry is [string, string | number] => Boolean(entry[1]));

  const credits = [
    ...(project.role ? [{ _key: "cg", role: project.role.trim(), name: "Cristina Galán" }] : []),
    ...(project.team ?? []),
  ].filter((member) => member.name);

  return (
    <article>
      {/* Hero: the cover from the home reel lands here full-bleed (shared element). */}
      <header className="relative h-svh min-h-[34rem] overflow-hidden bg-black text-white">
        <ViewTransition name={`project-cover-b-${project.slug}`} share="b-morph" default="none">
          <div className="absolute inset-0">
            <SanityImage
              image={project.coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </ViewTransition>
        <div className="b-vignette absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-black/50 to-transparent" />

        <Link
          href="/proto/b"
          className={`${label} b-title-in absolute top-20 left-5 text-white/85 outline-none hover:text-white focus-visible:underline md:top-24 md:left-10`}
          style={{ "--b-delay": "0.9s" } as React.CSSProperties}
        >
          <span aria-hidden>← </span>Proyectos
        </Link>

        <div className="b-credit absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-12">
          <p
            className={`${label} b-title-in flex flex-wrap gap-x-4 gap-y-1 text-white/80 tabular-nums`}
            style={{ "--b-delay": "0.6s" } as React.CSSProperties}
          >
            <span>N.º {pad(index + 1)}</span>
            {project.category ? <span>{project.category}</span> : null}
            {project.year ? <span>{project.year}</span> : null}
          </p>
          <h1
            className="b-title-in mt-4 max-w-[14ch] font-heading text-[clamp(3.5rem,13vw,15rem)] leading-[0.78] font-medium text-balance uppercase"
            style={{ "--b-delay": "0.75s" } as React.CSSProperties}
          >
            {name}
          </h1>
          <div
            className={`${label} b-title-in mt-8 flex items-end justify-between gap-6 border-t border-white/25 pt-4`}
            style={{ "--b-delay": "0.95s" } as React.CSSProperties}
          >
            {project.role ? (
              <p>
                <span className="text-white/60">{project.role.trim()}</span>
                <span className="mx-3 text-white/40" aria-hidden>
                  —
                </span>
                Cristina Galán
              </p>
            ) : (
              <span />
            )}
            <span aria-hidden className="hidden md:inline">
              Desplaza ↓
            </span>
          </div>
        </div>
      </header>

      {/* Slate: synopsis + clapperboard metadata. */}
      <section
        aria-label="Ficha"
        className="grid gap-14 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36"
      >
        <div className="md:col-span-7">
          <p className={`${label} text-muted-foreground`}>Sinopsis</p>
          {project.description ? (
            <p className="mt-6 text-2xl leading-[1.2] text-pretty whitespace-pre-line md:text-[2.4rem]">
              {project.description}
            </p>
          ) : null}
        </div>
        <dl className="grid grid-cols-2 self-start border-t border-l md:col-span-4 md:col-start-9">
          {slate.map(([term, value]) => (
            <div
              key={term}
              className={`border-r border-b p-4 ${term === "Rol" || String(value).length > 18 ? "col-span-2" : ""}`}
            >
              <dt className="text-[10px] tracking-[0.32em] text-muted-foreground uppercase">
                {term}
              </dt>
              <dd className="mt-2 font-heading text-2xl leading-none uppercase">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {project.videoUrl ? (
        <section aria-label={`Vídeo: ${name}`} className="bg-black py-[5vw]">
          <div className="mx-auto max-w-[min(1600px,calc(100svh*16/9))] md:px-10">
            <VideoEmbed
              url={project.videoUrl}
              title={name}
              poster={
                <SanityImage
                  image={project.coverImage}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover opacity-70"
                />
              }
            />
          </div>
        </section>
      ) : null}

      {project.gallery?.length ? <GalleryStrip images={project.gallery} title={name} /> : null}

      {credits.length ? (
        <section aria-labelledby="b-credits" className="px-5 py-24 text-center md:py-36">
          <h2 id="b-credits" className={`${label} text-muted-foreground`}>
            Créditos
          </h2>
          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-5 md:gap-x-10">
            {credits.map((member) => (
              <Fragment key={member._key}>
                <dt className="pt-1.5 text-right text-[10px] tracking-[0.32em] text-muted-foreground uppercase md:text-[11px]">
                  {member.role}
                </dt>
                <dd className="text-left font-heading text-2xl leading-none uppercase md:text-3xl">
                  {member.name}
                </dd>
              </Fragment>
            ))}
          </dl>
        </section>
      ) : null}

      {next ? (
        <Link
          href={`/proto/b/projects/${next.slug}`}
          data-cursor="view"
          data-cursor-label="Siguiente"
          className="group relative block h-[75svh] overflow-hidden bg-black text-white outline-none"
        >
          <ViewTransition name={`project-cover-b-${next.slug}`} share="b-morph" default="none">
            <div className="absolute inset-0">
              <SanityImage
                image={next.coverImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
          </ViewTransition>
          <div className="absolute inset-0 bg-black/55 transition-colors duration-700 group-hover:bg-black/35" />
          <div className="b-credit relative flex h-full flex-col items-center justify-center gap-5 px-5 text-center">
            <span className={`${label} text-white/80 tabular-nums`}>
              Siguiente — N.º {pad(((index + 1) % projects.length) + 1)}
            </span>
            <span className="max-w-[14ch] font-heading text-[clamp(3rem,11vw,12rem)] leading-[0.8] font-medium text-balance uppercase group-focus-visible:underline">
              {next.name}
            </span>
            <span className={`${label} text-white/80`}>
              {[next.category, next.year].filter(Boolean).join(" — ")}
            </span>
          </div>
        </Link>
      ) : null}
    </article>
  );
}
