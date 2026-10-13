"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";
import { useState, ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { cn } from "@/lib/utils";
import type { Projects } from "@/sanity/lib/data";
import { pad, typeLabel } from "./format";

const EASE = [0.76, 0, 0.18, 1] as const;
const PREVIEW_MAX = 416;

/**
 * Compact view of the reel: one typographic row per project. On pointer devices
 * the cover follows the cursor and morphs into the project hero on click.
 */
export function ProjectIndex({ projects, visible }: { projects: Projects; visible: Projects }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 32, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 260, damping: 32, mass: 0.7 });
  const activeProject = visible.find((p) => p.slug === active) ?? null;

  function place(clientX: number, clientY: number) {
    const width = Math.min(window.innerWidth * 0.26, PREVIEW_MAX);
    const flip = clientX > window.innerWidth * 0.55;
    x.set(flip ? clientX - width - 28 : clientX + 28);
    y.set(clientY);
  }

  return (
    <div className="px-5 md:px-10">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 hidden md:block"
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
                name={`project-cover-${activeProject.slug}`}
                share="cine-morph"
                default="none"
              >
                <motion.div
                  className="relative aspect-video overflow-hidden bg-black"
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <div
        aria-hidden
        className="hidden grid-cols-12 gap-x-4 border-b pb-3 text-[10px] tracking-[0.32em] text-muted-foreground uppercase md:grid"
      >
        <span className="col-span-1">N.º</span>
        <span className="col-span-7">Título</span>
        <span className="col-span-2">Categoría</span>
        <span className="col-span-1">Tipo</span>
        <span className="col-span-1 text-right">Año</span>
      </div>

      <ul
        className="group/list"
        onPointerMove={(e) => e.pointerType === "mouse" && place(e.clientX, e.clientY)}
        onPointerLeave={() => setActive(null)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => {
            const isActive = active === project.slug;
            return (
              <motion.li
                key={project._id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                transition={{ duration: 0.55, ease: EASE }}
                className="border-b"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  data-cursor="view"
                  data-cursor-label="Ver"
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(project.slug)}
                  onFocus={(e) => {
                    if (!e.currentTarget.matches(":focus-visible")) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const width = Math.min(window.innerWidth * 0.26, PREVIEW_MAX);
                    setActive(project.slug);
                    x.jump(rect.right - width - 16);
                    y.jump(rect.top + rect.height / 2);
                  }}
                  onBlur={(e) => !e.currentTarget.matches(":hover") && setActive(null)}
                  className={cn(
                    "group/row grid grid-cols-12 items-baseline gap-x-4 py-4 transition-opacity duration-300 outline-none md:py-3",
                    "md:group-hover/list:opacity-25 md:hover:opacity-100!",
                    isActive && "md:opacity-100!",
                    "focus-visible:opacity-100!",
                  )}
                >
                  <span
                    className={cn(
                      "col-span-2 text-[11px] tracking-[0.32em] text-muted-foreground tabular-nums md:col-span-1",
                      isActive && "text-(--cine-red)",
                    )}
                  >
                    {pad(projects.indexOf(project) + 1)}
                  </span>
                  <span
                    className={cn(
                      "col-span-10 font-heading text-[clamp(2.4rem,6.5vw,6.5rem)] leading-[0.86] font-medium uppercase transition-transform duration-500 ease-[cubic-bezier(.76,0,.18,1)] md:col-span-7",
                      "group-focus-visible/row:underline group-focus-visible/row:decoration-(--cine-red) group-focus-visible/row:decoration-2 group-focus-visible/row:underline-offset-8",
                      isActive && "md:translate-x-4 md:text-white md:mix-blend-difference",
                    )}
                  >
                    {project.name}
                  </span>
                  <span className="col-span-10 col-start-3 mt-2 text-[11px] tracking-[0.32em] text-muted-foreground uppercase md:col-span-2 md:col-start-auto md:mt-0">
                    {project.category}
                    <span className="md:hidden">
                      {" "}
                      · {typeLabel(project.type)} · {project.year}
                    </span>
                  </span>
                  <span className="hidden text-[11px] tracking-[0.32em] text-muted-foreground uppercase md:col-span-1 md:block">
                    {typeLabel(project.type)}
                  </span>
                  <span className="hidden text-right text-[11px] tracking-[0.32em] tabular-nums md:col-span-1 md:block">
                    {project.year}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
