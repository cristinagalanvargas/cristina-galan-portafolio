"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom cursor. Position lives in motion values so mouse moves never re-render.
 * Elements opt into a cursor state with `data-cursor="<state>"` (and optionally
 * `data-cursor-label="Ver"`); links and buttons get "hover" automatically.
 * Disabled on touch / coarse pointers and with reduced motion.
 */
export function Cursor({
  className,
  stateClassNames = {},
}: {
  className?: string;
  /** Extra classes per cursor state, e.g. { hover: "scale-[2.5]", view: "..." } */
  stateClassNames?: Record<string, string>;
}) {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<string>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button'], label",
      );
      setState(target?.dataset.cursor ?? (target ? "hover" : "default"));
      setLabel(target?.dataset.cursorLabel ?? null);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      data-state={state}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,opacity,background-color] duration-300",
        visible ? "opacity-100" : "opacity-0",
        className,
        stateClassNames[state],
      )}
      style={{ x: springX, y: springY }}
    >
      {label ? <span className="text-xs font-medium tracking-wide uppercase">{label}</span> : null}
    </motion.div>
  );
}
