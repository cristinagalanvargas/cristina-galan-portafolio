import { cn } from "@/lib/utils";

/** Printer's registration mark (circle + crosshair). */
export function RegMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      <path d="M12 0v24M0 12h24" />
    </svg>
  );
}

/**
 * Hand-drawn grease-pencil loop. Draws itself on hover of the closest `.group`
 * (styles in c.css). Overshoots the corner like a real china marker would.
 */
export function GreaseLoop({
  className,
  variant = 0,
  drawn = false,
}: {
  className?: string;
  variant?: number;
  /** Always visible instead of drawing on hover. */
  drawn?: boolean;
}) {
  const paths = [
    "M3 6 C 30 2, 70 3, 97 5 C 98.5 35, 98 70, 96 95 C 65 97.5, 30 97, 4 95 C 2 65, 2.5 30, 4.5 4 L 14 3.5",
    "M5 4 C 35 3, 68 2.5, 96 4.5 C 97.5 38, 98.5 66, 97 96 C 62 98, 33 96.5, 3 96 C 3.5 60, 1.5 34, 3 7 L 12 6",
    "M4 5 C 28 3.5, 72 4, 96.5 3 C 98 30, 97 72, 97.5 94 C 70 96.5, 28 98, 3.5 96.5 C 2 70, 3 28, 2 6 L 18 4",
  ];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      data-drawn={drawn || undefined}
      className={cn("c-grease pointer-events-none absolute overflow-visible", className)}
      fill="none"
    >
      <path
        d={paths[variant % paths.length]}
        pathLength={1}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "C ● G" logotype. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.35em] font-heading uppercase", className)}>
      C<span className="inline-block size-[0.42em] rounded-full bg-(--c-mark)" aria-hidden />G
    </span>
  );
}
