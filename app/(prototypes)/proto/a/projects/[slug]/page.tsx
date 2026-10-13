import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { VideoEmbed } from "@/components/video-embed";
import { getProject, getProjects, getProjectSlugs } from "@/sanity/lib/data";
import { GalleryLightbox } from "../../_components/gallery-lightbox";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.filter((slug): slug is string => Boolean(slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/proto/a/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project?.name ?? "Proyecto" };
}

const label = "text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase";

function Fact({ term, value }: { term: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-x-4 border-b border-border py-2.5 md:grid-cols-4">
      <dt className={label}>{term}</dt>
      <dd className="col-span-2 text-sm md:col-span-3">{value}</dd>
    </div>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/proto/a/projects/[slug]">, "params">) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const position = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(position + 1) % projects.length];
  const name = project.name ?? "Sin título";
  const gallery = project.gallery ?? [];
  const team = project.team ?? [];
  const aspect = project.coverImage?.dimensions?.aspectRatio ?? 16 / 9;

  return (
    <article>
      {/* Folio line */}
      <div className="grid grid-cols-12 gap-x-4 pt-8 text-[11px] font-medium tracking-[0.22em] uppercase md:pt-12">
        <Link
          href="/proto/a"
          className="col-span-6 outline-none hover:text-(--a-accent) focus-visible:text-(--a-accent) md:col-span-3"
        >
          ← Índice
        </Link>
        <span className="col-span-6 text-right text-muted-foreground tabular-nums md:col-span-3 md:text-left">
          Nº {String(position + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <span className="hidden text-muted-foreground md:col-span-3 md:block">
          {project.category}
        </span>
        <span className="hidden text-right text-(--a-accent) tabular-nums md:col-span-3 md:block">
          {project.year}
        </span>
      </div>

      <h1 className="mt-6 font-heading text-[clamp(3.75rem,13vw,15rem)] leading-[0.8] tracking-[-0.015em] text-balance uppercase">
        {name}
      </h1>

      {/* Hero cover: shared element with the index preview. */}
      <div className="mt-8 md:mt-12">
        <ViewTransition name={`project-cover-a-${project.slug}`} share="a-morph" default="none">
          <div
            className="relative w-full overflow-hidden bg-muted"
            style={{ aspectRatio: Math.max(aspect, 4 / 3) }}
          >
            <SanityImage
              image={project.coverImage}
              fill
              priority
              sizes="(min-width: 1600px) 1520px, 100vw"
              className="object-cover"
            />
          </div>
        </ViewTransition>
        <p className="mt-2 flex justify-between text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
          <span>Portada</span>
          <span>{project.coverImage?.alt}</span>
        </p>
      </div>

      {/* Ficha + texto */}
      <div className="mt-20 grid grid-cols-12 gap-x-4 gap-y-14 md:mt-28">
        <dl className="col-span-12 border-t-2 border-foreground md:col-span-5 lg:col-span-4">
          <Fact term="Año" value={project.year} />
          <Fact term="Disciplina" value={project.category} />
          <Fact term="Tipo" value={<span className="capitalize">{project.type}</span>} />
          <Fact term="Rol" value={project.role?.trim()} />
          <Fact term="Cliente" value={project.client} />
          <Fact term="Agencia" value={project.agency} />
        </dl>

        <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          {project.description ? (
            <p className="text-2xl leading-[1.2] text-pretty whitespace-pre-line md:text-[1.75rem]">
              {project.description}
            </p>
          ) : null}

          {team.length > 0 ? (
            <section aria-labelledby="creditos" className="mt-14">
              <h2 id="creditos" className={`${label} border-b border-foreground pb-2`}>
                Créditos
              </h2>
              <ul>
                {team.map((member) => (
                  <li
                    key={member._key}
                    className="flex items-baseline gap-3 border-b border-border py-2 text-sm"
                  >
                    <span className="shrink-0 text-muted-foreground">{member.role}</span>
                    <span
                      aria-hidden
                      className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-foreground/30"
                    />
                    <span className="shrink-0 text-right">{member.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      {project.videoUrl ? (
        <section aria-labelledby="pieza" className="mt-24 md:mt-32">
          <div className="mb-4 flex items-baseline justify-between border-t-2 border-foreground pt-2">
            <h2 id="pieza" className={label}>
              Pieza
            </h2>
            <span className={label}>Vimeo</span>
          </div>
          <VideoEmbed
            url={project.videoUrl}
            title={name}
            playLabel="Reproducir"
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

      {gallery.length > 0 ? (
        <section aria-labelledby="laminas" className="mt-24 md:mt-32">
          <div className="mb-8 flex items-baseline justify-between border-t-2 border-foreground pt-2">
            <h2 id="laminas" className={label}>
              Láminas
            </h2>
            <span className={`${label} tabular-nums`}>{gallery.length} imágenes</span>
          </div>
          <GalleryLightbox images={gallery} title={name} />
        </section>
      ) : null}

      {next && next.slug !== project.slug ? (
        <nav aria-label="Siguiente proyecto" className="mt-32">
          <Link
            href={`/proto/a/projects/${next.slug}`}
            prefetch
            data-cursor="view"
            data-cursor-label="Siguiente"
            className="group block border-t-2 border-foreground pt-3 outline-none"
          >
            <span className={label}>Siguiente — {next.year}</span>
            <span className="mt-3 block font-heading text-[clamp(3rem,10vw,11rem)] leading-[0.8] uppercase transition-[color,transform] duration-500 group-hover:translate-x-4 group-hover:text-(--a-accent) group-focus-visible:text-(--a-accent)">
              {next.name} →
            </span>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}

function ProjectSkeleton() {
  return (
    <div aria-busy className="animate-pulse pt-12">
      <div className="h-3 w-40 bg-muted" />
      <div className="mt-8 h-[12vw] w-3/4 bg-muted" />
      <div className="mt-12 aspect-video w-full bg-muted" />
    </div>
  );
}

export default function ProjectPage({ params }: PageProps<"/proto/a/projects/[slug]">) {
  return (
    <ViewTransition enter="a-page" exit="a-page" default="none">
      <main className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectContent params={params} />
        </Suspense>
      </main>
    </ViewTransition>
  );
}
