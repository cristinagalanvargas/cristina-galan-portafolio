"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const FPS = 24;
const pad = (n: number) => String(n).padStart(2, "0");

/** SMPTE-style running timecode (24 fps). Writes to the DOM directly: no re-renders. */
export function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const frames = Math.floor(((now - start) / 1000) * FPS);
      const f = frames % FPS;
      const s = Math.floor(frames / FPS) % 60;
      const m = Math.floor(frames / (FPS * 60)) % 60;
      const h = Math.floor(frames / (FPS * 3600));
      if (ref.current) ref.current.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span ref={ref} aria-hidden className={cn("tabular-nums", className)}>
      00:00:00:00
    </span>
  );
}
