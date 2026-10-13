"use client";

import Link from "next/link";
import { Children, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SHOT_MS = 5000;

export type MontageShot = { key: string; href: string; name: string; number: string };

/**
 * Cuts between project covers like a montage. The covers are rendered on the
 * server and passed as children (one per shot); this only decides which one is
 * on screen. The steps jump to a shot and restart its timer. It pauses while the
 * credit or the steps are hovered or focused and while the tab is hidden (not
 * on hovering the image itself: the hero fills the screen, so the pointer is
 * almost always over it). With reduced motion it only changes on click.
 */
export function HeroMontage({
  shots,
  overlay,
  children,
}: {
  shots: MontageShot[];
  /** Painted over every shot (vignette), under the credit. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  const layers = Children.toArray(children);
  const total = layers.length;
  const [active, setActive] = useState(0);
  // Bumped on every manual jump so the timer and the progress bar restart.
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const paused = hovered || focused || hidden;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduced(query.matches);
    const onVisibility = () => setHidden(document.visibilityState !== "visible");
    onMotion();
    onVisibility();
    query.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      query.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // One timeout per shot: the progress bar (CSS, same duration) and the cut stay in sync.
  // While paused the timeout is cleared; on resume the shot gets its full length again.
  useEffect(() => {
    if (paused || reduced || total < 2) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % total), SHOT_MS);
    return () => window.clearTimeout(id);
  }, [active, cycle, paused, reduced, total]);

  const goTo = (i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  };

  const shot = shots[active];
  const controls = {
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    // Keyboard focus pauses; a mouse click on a step must not leave it paused.
    onFocus: (e: React.FocusEvent) => setFocused((e.target as Element).matches(":focus-visible")),
    onBlur: (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
    },
  };

  return (
    <div
      className="absolute inset-0"
      data-paused={paused}
      style={{ "--cine-shot": `${SHOT_MS}ms` } as React.CSSProperties}
    >
      {layers.map((layer, i) => (
        <div
          key={shots[i]?.key ?? i}
          aria-hidden={i !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.7,0,0.15,1)] motion-reduce:transition-none",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          {layer}
        </div>
      ))}
      {overlay}

      {shot ? (
        <Link
          href={shot.href}
          data-cursor="view"
          data-cursor-label="Ver"
          {...controls}
          className="cine-credit group absolute bottom-4 left-4 z-10 flex max-w-[calc(100%-2rem)] items-center gap-3 text-[11px] tracking-[0.32em] text-white/85 uppercase outline-none hover:text-white focus-visible:underline md:bottom-6 md:left-10 md:max-w-[55%]"
        >
          <span className="shrink-0 tabular-nums">N.º {shot.number}</span>
          <span aria-hidden className="h-px w-6 shrink-0 bg-current" />
          <span className="truncate">{shot.name}</span>
          <span
            aria-hidden
            className="shrink-0 transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      ) : null}

      {total > 1 ? (
        <div
          role="group"
          aria-label="Proyectos de la portada"
          {...controls}
          className="absolute top-1 left-1 z-10 flex md:top-auto md:right-8 md:bottom-3 md:left-auto"
        >
          {shots.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver N.º ${s.number}: ${s.name}`}
              aria-current={i === active ? "true" : undefined}
              data-cursor="hover"
              className="group/step flex h-9 w-9 items-center justify-center outline-none md:w-10"
            >
              <span className="relative block h-0.5 w-6 overflow-hidden bg-white/35 transition-colors group-hover/step:bg-white/70 group-focus-visible/step:bg-white md:w-7">
                {i === active ? (
                  <span
                    // Remount per shot so the fill restarts from zero.
                    key={`${active}-${cycle}`}
                    className="cine-progress absolute inset-0 bg-(--cine-red)"
                  />
                ) : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
