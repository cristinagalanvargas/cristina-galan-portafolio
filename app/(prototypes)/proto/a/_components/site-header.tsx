"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/proto/a", label: "Proyectos", n: "I" },
  { href: "/proto/a/about", label: "Hola", n: "II" },
] as const;

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/proto/a") return pathname === href || pathname.startsWith("/proto/a/projects");
  return pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return links.map((link) => {
    const active = isActive(pathname, link.href);
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative inline-flex items-baseline gap-1.5 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors outline-none",
          "focus-visible:text-(--a-accent)",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span className="text-[9px] tracking-[0.1em] tabular-nums opacity-60">{link.n}</span>
        {link.label}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-1.5 left-0 h-px bg-current transition-[width] duration-300",
            active ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      </Link>
    );
  });
}

function ActiveNavLinks() {
  const pathname = usePathname();
  return <NavLinks pathname={pathname} />;
}

function ThemeGlyph() {
  return (
    <span className="flex items-center gap-2 text-[11px] font-medium tracking-[0.22em] uppercase">
      <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 1a7 7 0 0 1 0 14z" fill="currentColor" />
      </svg>
      <span className="hidden lg:inline">Tono</span>
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{ viewTransitionName: "a-header" }}
      className="sticky top-0 z-40 border-b border-foreground/80 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70"
    >
      <div className="mx-auto grid h-14 max-w-[1600px] grid-cols-12 items-center gap-x-4 px-5 md:px-10">
        <Link
          href="/proto/a"
          aria-label="Cristina Galán — inicio"
          className="col-span-6 flex items-center gap-3 outline-none focus-visible:text-(--a-accent) md:col-span-3"
        >
          <span className="font-heading text-2xl leading-none tracking-tight uppercase">C</span>
          <span aria-hidden className="size-2 rounded-full bg-(--a-accent)" />
          <span className="font-heading text-2xl leading-none tracking-tight uppercase">G</span>
          <span className="ml-2 hidden text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase xl:inline">
            Cristina Galán
          </span>
        </Link>

        <p className="col-span-4 hidden text-[11px] tracking-[0.22em] text-muted-foreground uppercase md:block">
          Fotografía &amp; dirección — Madrid
        </p>

        <nav aria-label="Principal" className="col-span-3 hidden items-center gap-8 md:flex">
          <Suspense fallback={<NavLinks pathname={null} />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>

        <div className="col-span-6 flex items-center justify-end gap-5 md:col-span-2">
          <ThemeToggle className="text-foreground outline-none hover:text-(--a-accent) focus-visible:text-(--a-accent)">
            <ThemeGlyph />
          </ThemeToggle>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="text-[11px] font-medium tracking-[0.22em] uppercase outline-none focus-visible:text-(--a-accent) md:hidden"
              aria-label="Abrir menú"
            >
              Menú
            </SheetTrigger>
            <SheetContent
              side="top"
              className="gap-0 rounded-none border-b border-foreground bg-background px-5 pt-5 pb-10 shadow-none"
            >
              <SheetTitle className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Índice
              </SheetTitle>
              <nav aria-label="Principal (móvil)" className="mt-8 flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-t border-foreground py-3 outline-none focus-visible:text-(--a-accent)"
                  >
                    <span className="font-heading text-6xl leading-[0.85] uppercase">
                      {link.label}
                    </span>
                    <span className="text-[11px] tracking-[0.22em] text-muted-foreground">
                      {link.n}
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
