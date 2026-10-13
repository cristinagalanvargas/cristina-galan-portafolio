import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { VideoEmbed } from "@/components/video-embed";
import { getProject, getProjects, getProjectSlugs } from "@/sanity/lib/data";
import { LightboxGallery } from "../../_components/lightbox-gallery";
import { GreaseLoop, RegMark } from "../../_components/marks";
import { frameNo, tipoLabel } from "../../_components/utils";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.filter((slug): slug is string => Boolean(slug)).map((slug) => ({ slug }));
}

export default function ProjectPage(props: PageProps<"/proto/c/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent params={props.params} />
    </Suspense>
  );
}

function ProjectSkeleton() {
  return (
    <main aria-busy className="flex flex-col gap-6 px-4 pt-10">
      <div className="h-4 w-40 bg-muted" />
      <div className="h-24 w-2/3 bg-muted" />
      <div className="aspect-video w-full bg-(--c-film) opacity-80" />
    </main>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/proto/c/projects/[slug]">, "params">) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const total = projects.length;
  const n = frameNo(index + 1);
  const prev = projects[(index - 1 + total) % total];
  const next = projects[(index + 1) % total];
  const title = project.name ?? "Proyecto";

  const specs = [
    ["Año", project.year],
    ["Categoría", project.category],
    ["Tipo", project.type ? tipoLabel[project.type] : null],
    ["Rol", project.role?.trim()],
    ["Cliente", project.client],
    ["Agencia", project.agency],
  ] as const;

  const paragraphs = (project.description ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const ratio = project.coverImage?.dimensions?.aspectRatio ?? 16 / 9;

  return (
    <ViewTransition enter="c-fade" exit="c-fade" default="none">
      <main className="flex flex-col">
        {/* Header strip */}
        <div className="flex items-stretch border-b border-(--c-hair) text-[11px] uppercase">
          <Link
            href="/proto/c"
            className="flex items-center gap-2 border-r border-(--c-hair) px-4 py-3 outline-none hover:text-(--c-mark) focus-visible:bg-foreground focus-visible:text-background"
          >
            ← Hoja de contactos
          </Link>
          <span className="flex items-center px-4 text-muted-foreground tabular-nums">
            Fotograma <span className="mx-1 text-foreground">{n}</span> / {frameNo(total)}
          </span>
        </div>

        <section className="grid grid-cols-12 gap-x-4 gap-y-6 px-4 pt-8 pb-6 md:pt-12">
          <p className="col-span-12 flex items-center gap-2 text-[11px] text-muted-foreground uppercase md:col-span-2">
            <RegMark className="size-3.5 text-(--c-mark)" />
            <span className="tabular-nums">Nº {n}</span>
          </p>
          <h1 className="col-span-12 font-heading text-[clamp(3.5rem,11vw,10rem)] leading-[0.8] text-balance uppercase md:col-span-10">
            {title}
          </h1>
        </section>

        {/* Hero: the frame from the sheet, enlarged */}
        <div className="px-4">
          <div className="c-rebate">
            <div className="c-sprockets" />
            <div className="flex items-center justify-between px-3 pb-1 font-mono text-[10px] tracking-[0.14em] uppercase">
              <span>▸ {n}</span>
              <span className="opacity-70">
                CG {project.year} · {project.category}
              </span>
              <span>{n}A</span>
            </div>
          </div>
          <div className="bg-(--c-film) px-2 sm:px-3">
            <ViewTransition name={`project-cover-c-${slug}`} share="c-morph" default="none">
              <div
                className="relative mx-auto max-h-[78vh] w-full overflow-hidden"
                style={{ aspectRatio: ratio }}
              >
                <SanityImage
                  image={project.coverImage}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </ViewTransition>
          </div>
          <div className="c-rebate">
            <div className="flex items-center justify-between px-3 pt-1 font-mono text-[10px] tracking-[0.14em] uppercase opacity-80">
              <span>{project.type === "personal" ? "Personal" : "Comercial"}</span>
              <span>{n}</span>
            </div>
            <div className="c-sprockets" />
          </div>
        </div>

        {/* Spec table + description */}
        <section className="grid grid-cols-12 gap-x-4 gap-y-10 px-4 py-14">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="mb-3 text-[11px] text-muted-foreground uppercase">Ficha técnica</h2>
            <dl className="border-t border-(--c-hair)">
              {specs.map(([label, value]) =>
                value ? (
                  <div
                    key={label}
                    className="grid grid-cols-[8rem_1fr] gap-4 border-b border-(--c-hair) py-2"
                  >
                    <dt className="text-[11px] text-muted-foreground uppercase">{label}</dt>
                    <dd className="text-sm tabular-nums">{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>

            {project.team?.length ? (
              <>
                <h2 className="mt-10 mb-3 text-[11px] text-muted-foreground uppercase">
                  Equipo · {frameNo(project.team.length)}
                </h2>
                <ol className="border-t border-(--c-hair)">
                  {project.team.map((member, i) => (
                    <li
                      key={member._key}
                      className="grid grid-cols-[2rem_8rem_1fr] gap-4 border-b border-(--c-hair) py-2 text-sm"
                    >
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {frameNo(i + 1)}
                      </span>
                      <span className="text-[11px] text-muted-foreground uppercase">
                        {member.role}
                      </span>
                      <span>{member.name}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <h2 className="mb-3 text-[11px] text-muted-foreground uppercase">Notas</h2>
            <div className="space-y-4 border-t border-(--c-hair) pt-4 text-lg leading-snug text-pretty md:text-xl">
              {paragraphs.length ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p className="text-muted-foreground">Sin notas.</p>
              )}
            </div>
          </div>
        </section>

        {project.videoUrl ? (
          <section aria-labelledby="c-video" className="border-t border-(--c-hair) px-4 py-10">
            <h2 id="c-video" className="mb-4 flex justify-between text-[11px] uppercase">
              <span className="text-muted-foreground">Película</span>
              <span className="tabular-nums">Rollo {n}</span>
            </h2>
            <VideoEmbed
              url={project.videoUrl}
              title={title}
              poster={
                <SanityImage
                  image={project.coverImage}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-80"
                />
              }
            />
          </section>
        ) : null}

        {project.gallery?.length ? (
          <section aria-labelledby="c-galeria" className="border-t border-(--c-hair) px-4 py-10">
            <h2 id="c-galeria" className="mb-4 flex justify-between text-[11px] uppercase">
              <span className="text-muted-foreground">Hoja de contactos</span>
              <span className="tabular-nums">{frameNo(project.gallery.length)} fotogramas</span>
            </h2>
            <LightboxGallery images={project.gallery} title={title} />
          </section>
        ) : null}

        {/* Prev / next */}
        <nav aria-label="Otros proyectos" className="grid grid-cols-2 border-t border-(--c-hair)">
          {[
            { label: "Anterior", item: prev, i: (index - 1 + total) % total },
            { label: "Siguiente", item: next, i: (index + 1) % total },
          ].map(({ label, item, i }) =>
            item?.slug ? (
              <Link
                key={label}
                href={`/proto/c/projects/${item.slug}`}
                prefetch
                data-cursor="view"
                data-cursor-label={label === "Anterior" ? "←" : "→"}
                className="group relative flex flex-col gap-4 p-4 outline-none not-last:border-r not-last:border-(--c-hair) focus-visible:bg-foreground focus-visible:text-background sm:flex-row sm:items-end"
              >
                <div className="relative w-full sm:w-1/2">
                  <ViewTransition
                    name={`project-cover-c-${item.slug}`}
                    share="c-morph"
                    default="none"
                  >
                    <div className="relative aspect-video overflow-hidden bg-(--c-film)">
                      <SanityImage
                        image={item.coverImage}
                        fill
                        sizes="(min-width: 640px) 25vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </ViewTransition>
                  <GreaseLoop className="-top-2 -left-2 size-[calc(100%+16px)]" variant={i} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground uppercase tabular-nums group-focus-visible:text-background">
                    {label === "Anterior" ? "←" : "→"} {label} · {frameNo(i + 1)}
                  </span>
                  <span className="font-heading text-3xl leading-none uppercase md:text-5xl">
                    {item.name}
                  </span>
                </div>
              </Link>
            ) : null,
          )}
        </nav>
      </main>
    </ViewTransition>
  );
}
