"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ViewTransition, useState } from "react";
import { SanityImage } from "@/components/sanity-image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { Projects } from "@/sanity/lib/data";

type Tipo = "todos" | "comercial" | "personal";
type Project = Projects[number];

const filters: { value: Tipo; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "comercial", label: "Comercial" },
  { value: "personal", label: "Personal" },
];

const EASE = [0.76, 0, 0.18, 1] as const;
const PREVIEW_MAX = 416;

function parseTipo(value: string | null): Tipo {
  return value === "comercial" || value === "personal" ? value : "todos";
}

/** Reads `?tipo=` (needs a Suspense boundary above it). */
export function ProjectIndexFromParams({ projects }: { projects: Projects }) {
  const params = useSearchParams();
  return <ProjectIndex projects={projects} tipo={parseTipo(params.get("tipo"))} />;
}

export function ProjectIndex({ projects, tipo }: { projects: Projects; tipo: Tipo }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 32, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 260, damping: 32, mass: 0.7 });

  const counts: Record<Tipo, number> = {
    todos: projects.length,
    comercial: projects.filter((p) => p.type === "comercial").length,
    personal: projects.filter((p) => p.type === "personal").length,
  };
  const visible = tipo === "todos" ? projects : projects.filter((p) => p.type === tipo);
  const activeProject = visible.find((p) => p.slug === active) ?? null;

  function place(clientX: number, clientY: number) {
    const width = Math.min(window.innerWidth * 0.26, PREVIEW_MAX);
    const flip = clientX > window.innerWidth * 0.55;
    x.set(flip ? clientX - width - 28 : clientX + 28);
    y.set(clientY);
  }

  function setTipo(next: Tipo) {
    // Native history keeps useSearchParams in sync without a server round trip.
    const url = new URL(window.location.href);
    if (next === "todos") url.searchParams.delete("tipo");
    else url.searchParams.set("tipo", next);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* Floating cover preview: follows the pointer and morphs into the project hero.
          Painted before the index so the titles sit on top of it (see mix-blend below). */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 hidden md:block"
        style={{ x: reduced ? x : springX, y: reduced ? y : springY }}
      >
        <AnimatePresence>
          {activeProject?.coverImage ? (
            <motion.div
              key="preview"
              className="w-[min(26vw,26rem)] -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <ViewTransition
                key={activeProject.slug}
                name={`project-cover-a-${activeProject.slug}`}
                share="a-morph"
                default="none"
              >
                <motion.div
                  className="relative overflow-hidden bg-muted"
                  style={{
                    aspectRatio: activeProject.coverImage.dimensions?.aspectRatio ?? 4 / 3,
                  }}
                  initial={{ clipPath: "inset(0 0 100% 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <SanityImage
                    image={activeProject.coverImage}
                    fill
                    sizes="(min-width: 768px) 26vw, 1px"
                    className="object-cover"
                  />
                </motion.div>
              </ViewTransition>
              <p className="mt-2 flex justify-between text-[10px] tracking-[0.22em] uppercase">
                <span>{activeProject.category}</span>
                <span className="text-(--a-accent)">{activeProject.year}</span>
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
      <section aria-labelledby="indice-titulo" className="mt-24 md:mt-40">
        {/* Index masthead: title + filter */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            id="indice-titulo"
            className="font-heading text-[clamp(3rem,8vw,7rem)] leading-[0.8] tracking-tight uppercase"
          >
            Índice
            <span className="ml-3 align-top font-sans text-[11px] tracking-[0.22em] text-muted-foreground">
              ({String(visible.length).padStart(2, "0")})
            </span>
          </h2>

          <ToggleGroup
            aria-label="Filtrar proyectos por tipo"
            value={[tipo]}
            onValueChange={(value) => {
              const next = value[0] as Tipo | undefined;
              if (next && next !== tipo) setTipo(next);
            }}
            spacing={0}
            className="gap-6 rounded-none md:gap-8"
          >
            {filters.map((f) => (
              <ToggleGroupItem
                key={f.value}
                value={f.value}
                className={cn(
                  "group/filter relative h-auto! rounded-none! bg-transparent! px-0! py-1 text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase hover:bg-transparent hover:text-foreground focus-visible:ring-0 focus-visible:outline-none",
                  "aria-pressed:text-foreground",
                  "focus-visible:text-(--a-accent)",
                )}
              >
                {f.label}
                <sup className="ml-0.5 text-[9px] tracking-normal tabular-nums group-aria-pressed/filter:text-(--a-accent)">
                  {counts[f.value]}
                </sup>
                <span
                  aria-hidden
                  className="absolute right-0 -bottom-0.5 left-0 h-px origin-left scale-x-0 bg-foreground transition-transform duration-300 group-aria-pressed/filter:scale-x-100"
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Column heads */}
        <div
          aria-hidden
          className="mt-8 hidden grid-cols-12 gap-x-4 border-t-2 border-foreground pt-2 pb-3 text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase md:grid"
        >
          <span className="col-span-1">Año</span>
          <span className="col-span-7">Título</span>
          <span className="col-span-2">Disciplina</span>
          <span className="col-span-1">Tipo</span>
          <span className="col-span-1 text-right">Nº</span>
        </div>

        <ul
          className="group/list mt-6 border-t-2 border-foreground md:mt-0 md:border-t md:border-border"
          onPointerMove={(e) => e.pointerType === "mouse" && place(e.clientX, e.clientY)}
          onPointerLeave={() => setActive(null)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <IndexRow
                key={project._id}
                project={project}
                number={projects.indexOf(project) + 1}
                total={projects.length}
                active={active === project.slug}
                onActivate={(e) => {
                  if ("pointerType" in e && e.pointerType !== "mouse") return;
                  setActive(project.slug);
                }}
                onFocusRow={(rect) => {
                  setActive(project.slug);
                  const width = Math.min(window.innerWidth * 0.26, PREVIEW_MAX);
                  x.jump(rect.right - width - 16);
                  y.jump(rect.top + rect.height / 2);
                }}
                onBlurRow={() => setActive(null)}
              />
            ))}
          </AnimatePresence>
        </ul>

        {visible.length === 0 ? (
          <p className="py-10 text-muted-foreground">No hay proyectos en esta sección.</p>
        ) : null}
      </section>
    </MotionConfig>
  );
}

function IndexRow({
  project,
  number,
  total,
  active,
  onActivate,
  onFocusRow,
  onBlurRow,
}: {
  project: Project;
  number: number;
  total: number;
  active: boolean;
  onActivate: (e: React.PointerEvent) => void;
  onFocusRow: (rect: DOMRect) => void;
  onBlurRow: () => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.55, ease: EASE }}
      className="border-b border-border"
    >
      <Link
        href={`/proto/a/projects/${project.slug}`}
        prefetch
        data-cursor="view"
        data-cursor-label="Ver"
        onPointerEnter={onActivate}
        onFocus={(e) => {
          // Only keyboard focus repositions the preview; a click keeps it under the pointer.
          if (e.currentTarget.matches(":focus-visible")) {
            onFocusRow(e.currentTarget.getBoundingClientRect());
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.matches(":hover")) onBlurRow();
        }}
        className={cn(
          "group/row relative grid grid-cols-12 items-baseline gap-x-4 py-4 transition-opacity duration-300 outline-none md:py-3",
          "md:group-hover/list:opacity-20 md:hover:opacity-100!",
          active && "md:opacity-100!",
          "focus-visible:opacity-100!",
        )}
      >
        <span
          className={cn(
            "order-1 col-span-4 text-[11px] font-medium tracking-[0.2em] tabular-nums transition-colors md:order-none md:col-span-1",
            active && "text-(--a-accent)",
          )}
        >
          {project.year}
        </span>

        <span className="order-3 col-span-9 mt-2 md:order-none md:col-span-7 md:mt-0">
          <span
            className={cn(
              "block font-heading text-[clamp(2.6rem,7vw,7.25rem)] leading-[0.84] tracking-[-0.005em] uppercase transition-transform duration-500 ease-[cubic-bezier(.76,0,.18,1)]",
              "group-focus-visible/row:underline group-focus-visible/row:decoration-(--a-accent) group-focus-visible/row:decoration-2 group-focus-visible/row:underline-offset-8",
              active && "md:translate-x-4 md:text-white md:mix-blend-difference",
            )}
          >
            {project.name}
          </span>
        </span>

        <span className="order-2 col-span-8 text-right text-[11px] tracking-[0.2em] text-muted-foreground uppercase md:order-none md:col-span-2 md:text-left">
          {project.category}
          <span className="md:hidden"> · {project.type}</span>
        </span>

        <span className="hidden text-[11px] tracking-[0.2em] text-muted-foreground uppercase md:col-span-1 md:block">
          {project.type}
        </span>

        <span className="order-4 col-span-3 flex justify-end md:order-none md:col-span-1 md:block md:text-right">
          <span className="hidden text-[11px] tracking-[0.2em] text-muted-foreground tabular-nums md:inline">
            {String(number).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          {/* Small cover on touch layouts, where there is no hover preview. */}
          <span className="relative mt-2 block aspect-[4/5] w-16 overflow-hidden bg-muted md:hidden">
            <SanityImage image={project.coverImage} fill sizes="64px" className="object-cover" />
          </span>
        </span>
      </Link>
    </motion.li>
  );
}
