"use client";

import Link from "next/link";
import { Children, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SHOT_MS = 5000;

export type MontageShot = { key: string; href: string; name: string; number: string };

/**
 * Cuts between project covers like a montage. The covers are rendered on the
 * server and passed as children (one per shot); this only decides which one is
 * on screen. Pauses on hover/focus and while the tab is hidden; with reduced
 * motion it holds the first shot.
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
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced || layers.length < 2) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setActive((i) => (i + 1) % layers.length);
    }, SHOT_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced, layers.length]);

  const shot = shots[active];

  return (
    <div
      className="absolute inset-0"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
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
          className="cine-credit group absolute bottom-4 left-4 z-10 flex items-center gap-3 text-[11px] tracking-[0.32em] text-white/85 uppercase outline-none hover:text-white focus-visible:underline md:bottom-6 md:left-10"
        >
          <span className="tabular-nums">N.º {shot.number}</span>
          <span aria-hidden className="h-px w-6 bg-current" />
          <span>{shot.name}</span>
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </Link>
      ) : null}

      {layers.length > 1 ? (
        <div
          aria-hidden
          className="absolute right-4 bottom-5 z-10 flex gap-1.5 md:right-10 md:bottom-7"
        >
          {layers.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-px w-5 bg-white/35 transition-colors duration-500",
                i === active && "bg-(--cine-red)",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
