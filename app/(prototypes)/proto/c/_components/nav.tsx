"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Monogram } from "./marks";

export const NAV = [
  { href: "/proto/c", label: "Proyectos", code: "A" },
  { href: "/proto/c/about", label: "Hola", code: "B" },
] as const;

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/proto/c") return pathname === href || pathname.startsWith("/proto/c/projects");
  return pathname.startsWith(href);
}

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-stretch">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href} className="border-l border-(--c-hair)">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex h-full items-center gap-2 px-4 text-sm uppercase transition-colors outline-none focus-visible:bg-foreground focus-visible:text-background",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-4 place-items-center rounded-full border text-[9px] leading-none tabular-nums",
                  active
                    ? "border-(--c-mark) bg-(--c-mark) text-white"
                    : "border-current group-hover:border-(--c-mark)",
                )}
              >
                {item.code}
              </span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Static fallback while the pathname is not known (prerendered shell). */
export function NavLinksFallback() {
  return (
    <ul className="flex items-stretch">
      {NAV.map((item) => (
        <li key={item.href} className="border-l border-(--c-hair)">
          <Link
            href={item.href}
            className="flex h-full items-center gap-2 px-4 text-sm text-muted-foreground uppercase"
          >
            <span
              aria-hidden
              className="grid size-4 place-items-center rounded-full border border-current text-[9px] leading-none"
            >
              {item.code}
            </span>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function MobileNav({
  contact,
}: {
  contact: { _key: string; name: string | null; url: string | null }[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex h-full items-center gap-2 border-l border-(--c-hair) px-4 text-sm uppercase outline-none focus-visible:bg-foreground focus-visible:text-background">
        <span aria-hidden className="flex flex-col gap-[3px]">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-2.5 bg-current" />
        </span>
        Índice
      </SheetTrigger>
      <SheetContent
        side="right"
        className="proto-c w-full gap-0 border-l border-(--c-hair) bg-background p-0 sm:max-w-sm"
      >
        <div className="flex h-14 items-center border-b border-(--c-hair) px-4">
          <SheetTitle className="flex items-center gap-3 text-base uppercase">
            <Monogram className="text-2xl" />
            <span className="font-sans text-xs text-muted-foreground">Índice</span>
          </SheetTitle>
        </div>
        <nav aria-label="Principal">
          <ul>
            {NAV.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-(--c-hair)">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 px-4 py-5 outline-none focus-visible:bg-foreground focus-visible:text-background"
                  >
                    <span className="w-6 text-xs text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-heading text-5xl leading-none uppercase",
                        active && "text-(--c-mark)",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto border-t border-(--c-hair) p-4">
          <p className="mb-3 text-[11px] text-muted-foreground uppercase">Contacto</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {contact.map((link) =>
              link.url ? (
                <li key={link._key}>
                  <a
                    href={link.url}
                    target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="underline decoration-(--c-hair) underline-offset-4 hover:decoration-(--c-mark)"
                  >
                    {link.name}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
