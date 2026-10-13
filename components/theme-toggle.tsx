"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

/** Accessible light/dark switch. Renders children (or a default dot) as the visual. */
export function ThemeToggle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid a hydration mismatch: the theme is only known on the client.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={isDark}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {children ?? <span className="block size-3 rounded-full bg-current" />}
    </button>
  );
}
