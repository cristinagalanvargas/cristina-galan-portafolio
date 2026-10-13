import { Suspense, ViewTransition } from "react";
import { getProjects } from "@/sanity/lib/data";
import { ProjectIndex, ProjectIndexFromParams } from "./_components/project-index";

export default async function DirectionAHome() {
  const projects = await getProjects();
  const years = projects.map((p) => p.year).filter((y): y is number => typeof y === "number");
  const from = Math.min(...years);
  const to = Math.max(...years);
  const disciplines = [...new Set(projects.map((p) => p.category).filter(Boolean))];

  return (
    <ViewTransition enter="a-page" exit="a-page" default="none">
      <main className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
        {/* Masthead */}
        <section aria-labelledby="titular" className="pt-10 md:pt-16">
          <div className="grid grid-cols-12 gap-x-4 text-[11px] tracking-[0.22em] uppercase">
            <span className="col-span-6 md:col-span-3">Catálogo de obra</span>
            <span className="col-span-6 text-right text-muted-foreground tabular-nums md:col-span-3 md:text-left">
              {from}—{to}
            </span>
            <span className="hidden text-muted-foreground md:col-span-3 md:block">
              {projects.length} proyectos
            </span>
            <span className="hidden text-right text-muted-foreground md:col-span-3 md:block">
              Edición digital
            </span>
          </div>

          <h1
            id="titular"
            className="mt-6 font-heading text-[clamp(4.5rem,19.5vw,22rem)] leading-[0.86] font-medium tracking-[-0.02em] uppercase"
          >
            <span className="block">Cristina</span>
            <span className="mt-[0.14em] block md:pl-[16.66%]">
              Galán<span className="text-(--a-accent)">.</span>
            </span>
          </h1>

          <div className="mt-10 grid grid-cols-12 gap-x-4 gap-y-6 border-t border-foreground pt-4 md:mt-14">
            <p className="col-span-12 text-[11px] font-medium tracking-[0.22em] uppercase md:col-span-3">
              Fotógrafa y realizadora
            </p>
            <p className="col-span-12 max-w-[34ch] text-2xl leading-[1.15] md:col-span-6 md:text-[2rem]">
              Fotografía y vídeo sobre la identidad y lo siniestro bajo la superficie pulida de la
              realidad.
            </p>
            <ul className="col-span-12 space-y-1 text-[11px] tracking-[0.22em] text-muted-foreground uppercase md:col-span-3 md:text-right">
              {disciplines.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </section>

        <Suspense fallback={<ProjectIndex projects={projects} tipo="todos" />}>
          <ProjectIndexFromParams projects={projects} />
        </Suspense>
      </main>
    </ViewTransition>
  );
}
