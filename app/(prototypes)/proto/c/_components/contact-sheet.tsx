"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ViewTransition, useState } from "react";
import { SanityImage } from "@/components/sanity-image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { Projects } from "@/sanity/lib/data";
import { GreaseLoop } from "./marks";
import { TIPOS, frameNo, parseTipo, tipoLabel, type Tipo } from "./utils";

type Project = Projects[number];

/** Contact sheet driven by `?tipo=`. Needs a <Suspense> boundary (useSearchParams). */
export function ContactSheet({ projects }: { projects: Projects }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [tipo, setTipo] = useState<Tipo>(() => parseTipo(searchParams.get("tipo")));

  const onChange = (next: Tipo) => {
    setTipo(next);
    const url = next === "todos" ? pathname : `${pathname}?tipo=${next}`;
    window.history.replaceState(null, "", url);
  };

  return <Sheet projects={projects} tipo={tipo} onChange={onChange} named />;
}

/** Prerendered fallback: same sheet, unfiltered, filters inert until hydrated. */
export function ContactSheetFallback({ projects }: { projects: Projects }) {
  return <Sheet projects={projects} tipo="todos" />;
}

function Sheet({
  projects,
  tipo,
  onChange,
  named = false,
}: {
  projects: Projects;
  tipo: Tipo;
  onChange?: (tipo: Tipo) => void;
  /** Only the hydrated sheet carries view-transition names (the fallback must not duplicate them). */
  named?: boolean;
}) {
  const numbered = projects.map((p, i) => ({ ...p, frame: i + 1 }));
  const visible = tipo === "todos" ? numbered : numbered.filter((p) => p.type === tipo);
  const counts: Record<Tipo, number> = {
    todos: projects.length,
    comercial: projects.filter((p) => p.type === "comercial").length,
    personal: projects.filter((p) => p.type === "personal").length,
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="sticky top-14 z-30 flex flex-wrap items-stretch border-y border-(--c-hair) bg-background/90 backdrop-blur-md">
        <div className="hidden items-center border-r border-(--c-hair) px-4 text-[11px] text-muted-foreground uppercase sm:flex">
          Filtro
        </div>
        <ToggleGroup
          aria-label="Filtrar proyectos por tipo"
          spacing={0}
          value={[tipo]}
          onValueChange={(value) => {
            const next = value[0];
            if (next && onChange) onChange(parseTipo(String(next)));
          }}
          className="h-11 w-auto rounded-none"
        >
          {TIPOS.map((t) => (
            <ToggleGroupItem
              key={t}
              value={t}
              disabled={!onChange}
              className="h-11 rounded-none border-r border-(--c-hair) px-4 text-sm uppercase hover:bg-transparent hover:text-(--c-mark) disabled:opacity-100 aria-pressed:bg-foreground aria-pressed:text-background data-[pressed]:bg-foreground data-[pressed]:text-background sm:px-5"
            >
              {tipoLabel[t]}
              <sup className="ml-0.5 text-[10px] tabular-nums opacity-70">{frameNo(counts[t])}</sup>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p
          className="ml-auto flex items-center gap-2 px-4 text-[11px] text-muted-foreground uppercase tabular-nums"
          aria-live="polite"
        >
          <span className="text-foreground">{frameNo(visible.length)}</span>/
          {frameNo(projects.length)} fotogramas
        </p>
      </div>

      <motion.ol
        layout
        className="grid grid-cols-1 border-l border-(--c-hair) min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [&:has(li:hover)>li:not(:hover)>a]:opacity-45"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <Frame key={project._id} project={project} frame={project.frame} named={named} />
          ))}
        </AnimatePresence>
      </motion.ol>
    </MotionConfig>
  );
}

function Frame({ project, frame, named }: { project: Project; frame: number; named: boolean }) {
  const n = frameNo(frame);
  const href = `/proto/c/projects/${project.slug}`;
  const cover = (
    <div className="absolute inset-0 overflow-hidden">
      <SanityImage
        image={project.coverImage}
        fill
        sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
      className="group relative border-r border-b border-(--c-hair) p-3 focus-within:z-20 hover:z-20 sm:p-4"
    >
      <Link
        href={href}
        prefetch
        data-cursor="view"
        data-cursor-label="Ver"
        className="block transition-opacity duration-300 outline-none"
      >
        <span className="sr-only">
          {`Fotograma ${n}: ${project.name}, ${project.year ?? ""}, ${project.category ?? ""}, ${project.type ?? ""}`}
        </span>
        <div aria-hidden className="relative">
          <div className="c-rebate">
            <div className="c-sprockets" />
            <div className="flex items-center justify-between px-2 pb-0.5 font-mono text-[9px] tracking-[0.12em] uppercase">
              <span>▸ {n}</span>
              <span className="opacity-70">CG {project.year ?? "—"} · 16:9</span>
              <span>{n}A</span>
            </div>
          </div>
          <div className="relative aspect-video bg-(--c-film) px-1.5">
            {named ? (
              <ViewTransition
                name={`project-cover-c-${project.slug}`}
                share="c-morph"
                default="none"
              >
                {cover}
              </ViewTransition>
            ) : (
              cover
            )}
          </div>
          <div className="c-rebate">
            <div className="flex items-center justify-between px-2 pt-0.5 font-mono text-[9px] tracking-[0.12em] uppercase opacity-80">
              <span>{project.type === "personal" ? "P" : "C"}</span>
              <span>{n}</span>
            </div>
            <div className="c-sprockets" />
          </div>
          <GreaseLoop className="-inset-2.5 size-[calc(100%+20px)]" variant={frame} />
        </div>

        <div aria-hidden className="mt-3 flex items-baseline justify-between gap-3">
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="text-[11px] text-(--c-mark) tabular-nums">{n}</span>
            <span className="truncate font-heading text-2xl leading-none uppercase">
              {project.name}
            </span>
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">{project.year}</span>
        </div>
      </Link>

      <IndexCard project={project} n={n} />
    </motion.li>
  );
}

function IndexCard({ project, n }: { project: Project; n: string }) {
  const rows = [
    ["Título", project.name],
    ["Año", project.year],
    ["Categoría", project.category],
    ["Tipo", project.type ? tipoLabel[project.type] : null],
  ] as const;

  return (
    <div
      aria-hidden
      className={cn(
        "c-index-card pointer-events-none absolute right-3 bottom-12 left-[22%] hidden origin-bottom-left px-3 pb-2 sm:right-5 [@media(hover:hover)]:block",
        "translate-y-3 -rotate-[2.5deg] opacity-0 transition-[opacity,translate,rotate] duration-300 ease-out",
        "group-focus-within:translate-y-0 group-focus-within:-rotate-[1.5deg] group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:-rotate-[1.5deg] group-hover:opacity-100",
        "motion-reduce:rotate-0 motion-reduce:transition-none",
      )}
    >
      <div className="flex h-[26px] items-center justify-between text-[10px] uppercase">
        <span>Ficha nº {n}</span>
        <span className="flex items-center gap-1">
          C<span className="inline-block size-1.5 rounded-full bg-(--c-mark)" />G
        </span>
      </div>
      <dl className="pt-px text-[11px] leading-[18px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-[10px] uppercase opacity-55">{label}</dt>
            <dd className="truncate text-right uppercase tabular-nums">{value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
