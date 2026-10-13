"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/proto/b",
    label: "Proyectos",
    isActive: (p: string) => !p.startsWith("/proto/b/about"),
  },
  {
    href: "/proto/b/about",
    label: "Hola",
    isActive: (p: string) => p.startsWith("/proto/b/about"),
  },
] as const;

/** "C ● G" that opens up to the full name on hover, like a title card resolving. */
function Logo() {
  const reveal =
    "grid grid-cols-[0fr] transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.7,0,0.15,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]";
  return (
    <Link
      href="/proto/b"
      aria-label="Cristina Galán — inicio"
      className="group flex items-center font-heading text-2xl leading-none font-medium tracking-[0.04em] uppercase outline-none"
    >
      <span aria-hidden>C</span>
      <span aria-hidden className={reveal}>
        <span className="overflow-hidden">ristina</span>
      </span>
      <span aria-hidden className="b-rec mx-2 inline-block size-2 rounded-full bg-current" />
      <span aria-hidden>G</span>
      <span aria-hidden className={reveal}>
        <span className="overflow-hidden">alán</span>
      </span>
    </Link>
  );
}

function ThemeGlyph() {
  // Half-exposed disc: rotates with the theme.
  return (
    <span className="relative block size-3.5 overflow-hidden rounded-full border border-current transition-transform duration-700 dark:rotate-180">
      <span className="absolute inset-y-0 left-0 w-1/2 bg-current" />
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass =
    "relative py-1 text-[11px] tracking-[0.32em] uppercase outline-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=page]:after:scale-x-100";

  return (
    // Difference blending keeps the chrome legible over stills and paper alike.
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="flex items-center justify-between px-5 py-5 md:px-10 md:py-6">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.isActive(pathname) ? "page" : undefined}
              className={linkClass}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle className="size-8 rounded-full outline-none focus-visible:ring-1 focus-visible:ring-white">
            <ThemeGlyph />
          </ThemeToggle>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle className="size-8 rounded-full outline-none focus-visible:ring-1 focus-visible:ring-white">
            <ThemeGlyph />
          </ThemeToggle>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="py-2 text-[11px] tracking-[0.32em] uppercase outline-none focus-visible:underline">
              Menú
            </SheetTrigger>
            <SheetContent
              side="top"
              className="gap-0 border-b-0 bg-background px-5 pt-20 pb-10 text-foreground"
            >
              <SheetTitle className="mb-6 text-[11px] font-normal tracking-[0.32em] text-muted-foreground uppercase">
                Navegación
              </SheetTitle>
              <nav aria-label="Principal (móvil)" className="flex flex-col">
                {links.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={link.isActive(pathname) ? "page" : undefined}
                    className={cn(
                      "flex items-baseline justify-between border-t py-4 font-heading text-6xl leading-none uppercase outline-none focus-visible:text-(--b-red)",
                      "aria-[current=page]:text-(--b-red)",
                    )}
                  >
                    {link.label}
                    <span className="font-sans text-[11px] tracking-[0.3em] text-muted-foreground tabular-nums">
                      0{i + 1}
                    </span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
