"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Projects } from "@/sanity/lib/data";
import { pad, typeLabel } from "./format";

type Tipo = "todos" | "comercial" | "personal";
type Project = Projects[number];

const filters: { value: Tipo; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "comercial", label: "Comercial" },
  { value: "personal", label: "Personal" },
];

const ease = [0.7, 0, 0.15, 1] as const;

function parseTipo(value: string | null): Tipo {
  return value === "comercial" || value === "personal" ? value : "todos";
}

/** Reads ?tipo= (needs a Suspense boundary) and writes it back without a navigation. */
export function ProjectReelWithParams({ projects }: { projects: Projects }) {
  const params = useSearchParams();
  const tipo = parseTipo(params.get("tipo"));

  const setTipo = (next: Tipo) => {
    const url = new URL(window.location.href);
    if (next === "todos") url.searchParams.delete("tipo");
    else url.searchParams.set("tipo", next);
    window.history.replaceState(null, "", url);
    // The cut changes the reel's length: bring its head back into frame if we're past it.
    const section = document.getElementById("proyectos");
    if (section && section.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
  };

  return <ProjectReel projects={projects} tipo={tipo} onTipoChange={setTipo} />;
}

export function ProjectReel({
  projects,
  tipo = "todos",
  onTipoChange,
}: {
  projects: Projects;
  tipo?: Tipo;
  onTipoChange?: (tipo: Tipo) => void;
}) {
  const counts: Record<Tipo, number> = {
    todos: projects.length,
    comercial: projects.filter((p) => p.type === "comercial").length,
    personal: projects.filter((p) => p.type === "personal").length,
  };
  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => tipo === "todos" || project.type === tipo);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="proyectos"
        aria-labelledby="proyectos-title"
        className="relative flex scroll-mt-4 flex-col pb-24"
      >
        <div className="flex items-end justify-between gap-6 px-5 pt-24 pb-8 md:px-10 md:pt-36">
          <h2
            id="proyectos-title"
            className="font-heading text-[clamp(3rem,8vw,7.5rem)] leading-[0.8] uppercase"
          >
            Secuencia
          </h2>
          <p
            aria-live="polite"
            className="text-right text-[11px] tracking-[0.32em] text-muted-foreground uppercase tabular-nums"
          >
            {pad(visible.length)} planos
            <span className="hidden sm:inline">
              {" "}
              — {filters.find((f) => f.value === tipo)?.label}
            </span>
          </p>
        </div>

        {/* Floating transport bar: sticks to the bottom of the screen while the reel is on. */}
        <div className="pointer-events-none sticky bottom-5 z-40 order-last mt-10 flex justify-center px-4">
          <ToggleGroup
            aria-label="Filtrar proyectos por tipo"
            value={[tipo]}
            onValueChange={(value) => {
              const next = value[0] as Tipo | undefined;
              if (next && next !== tipo) onTipoChange?.(next);
            }}
            spacing={0}
            className="pointer-events-auto max-w-full gap-0.5 rounded-full border bg-background/80 p-1 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.45)] backdrop-blur-md"
          >
            {filters.map((filter) => (
              <ToggleGroupItem
                key={filter.value}
                value={filter.value}
                className="h-9 gap-1.5 rounded-full px-3 text-[10px] font-normal tracking-[0.14em] text-muted-foreground uppercase group-data-[spacing=0]/toggle-group:rounded-full group-data-[spacing=0]/toggle-group:px-3 hover:bg-transparent hover:text-foreground focus-visible:ring-(--b-red)/60 aria-pressed:bg-foreground aria-pressed:text-background sm:gap-2 sm:text-[11px] sm:tracking-[0.24em] sm:group-data-[spacing=0]/toggle-group:px-4"
              >
                <span
                  aria-hidden
                  className="hidden size-1.5 rounded-full bg-(--b-red) sm:group-aria-pressed/toggle:inline-block"
                />
                {filter.label}
                <span className="tabular-nums opacity-60">{counts[filter.value]}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <motion.ol layout className="flex flex-col gap-10 px-3 md:gap-14 md:px-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map(({ project, index }) => (
              <motion.li
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.7, ease }}
              >
                <Frame project={project} index={index} total={projects.length} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ol>
      </section>
    </MotionConfig>
  );
}

function Frame({ project, index, total }: { project: Project; index: number; total: number }) {
  const number = pad(index + 1);
  const meta = [project.category, project.year, typeLabel(project.type)].filter(Boolean);

  return (
    <Link
      href={`/proto/b/projects/${project.slug}`}
      data-cursor="view"
      data-cursor-label="Ver"
      className="group block outline-none"
    >
      {/* Edge print, like the latent numbers on a strip of film stock. */}
      <div
        aria-hidden
        className="mb-2 flex items-center justify-between gap-4 px-2 text-[10px] tracking-[0.35em] text-muted-foreground uppercase tabular-nums md:px-4"
      >
        <span>
          CG ▸ {number}
          <span className="hidden sm:inline"> ▸ {project.year}</span>
        </span>
        <span className="hidden truncate md:block">
          {project.name} ▸ {project.category}
        </span>
        <span>{typeLabel(project.type)}</span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-black ring-(--b-red) ring-offset-4 ring-offset-background group-focus-visible:ring-2 sm:aspect-video lg:aspect-[2.39/1]">
        <ViewTransition name={`project-cover-b-${project.slug}`} share="b-morph" default="none">
          <div className="absolute inset-0">
            <SanityImage
              image={project.coverImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.045] motion-reduce:transition-none"
            />
          </div>
        </ViewTransition>
        <div className="b-vignette pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-75" />

        <span className="b-credit absolute top-4 left-4 text-[11px] tracking-[0.32em] text-white/90 tabular-nums md:top-7 md:left-10">
          {number}
          <span className="text-white/60"> / {pad(total)}</span>
        </span>
        <span className="absolute top-4 right-4 flex items-center gap-2 text-[11px] tracking-[0.32em] text-white uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:top-7 md:right-10">
          <span className="b-rec size-1.5 rounded-full bg-(--b-red)" />
          Ver proyecto
        </span>

        <div className="b-credit absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 p-4 text-white md:p-10">
          <h3 className="max-w-[16ch] font-heading text-[clamp(2.4rem,8.5vw,10rem)] leading-[0.82] font-medium text-balance uppercase transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:-translate-y-1">
            {project.name}
          </h3>
          <p className="hidden shrink-0 flex-col items-end gap-1.5 text-[11px] tracking-[0.32em] uppercase md:flex">
            {meta.map((item) => (
              <span key={String(item)}>{item}</span>
            ))}
          </p>
        </div>
      </div>
    </Link>
  );
}
