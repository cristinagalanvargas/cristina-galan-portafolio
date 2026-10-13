import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Cursor } from "@/components/cursor";
import { ThemeToggle } from "@/components/theme-toggle";
import { getContact } from "@/sanity/lib/data";
import { Monogram, RegMark } from "./_components/marks";
import { MobileNav, NavLinks, NavLinksFallback } from "./_components/nav";
import "./c.css";

export const metadata: Metadata = {
  title: "C — Hoja de contactos",
};

function PosNegToggle() {
  return (
    <ThemeToggle className="group flex h-full items-center gap-1.5 border-l border-(--c-hair) px-4 text-[11px] uppercase outline-none focus-visible:bg-foreground focus-visible:text-background">
      <span className="text-muted-foreground">Copia</span>
      <span className="flex items-center border border-current">
        <span className="bg-foreground px-1.5 py-0.5 text-background dark:bg-transparent dark:text-muted-foreground">
          Pos
        </span>
        <span className="px-1.5 py-0.5 text-muted-foreground dark:bg-foreground dark:text-background">
          Neg
        </span>
      </span>
    </ThemeToggle>
  );
}

export default async function DirectionCLayout({ children }: LayoutProps<"/proto/c">) {
  const contact = (await getContact()) ?? [];

  return (
    <div className="proto-c relative flex min-h-dvh flex-1 flex-col font-sans">
      <a
        href="#contenido"
        className="sr-only z-[200] bg-(--c-mark) px-3 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>

      <header
        style={{ viewTransitionName: "c-header" }}
        className="sticky top-0 z-40 border-b border-(--c-hair) bg-background/90 backdrop-blur-md"
      >
        <div className="flex h-14 items-stretch">
          <Link
            href="/proto/c"
            className="flex items-center gap-3 px-4 outline-none focus-visible:bg-foreground focus-visible:text-background"
            aria-label="Cristina Galán — inicio"
          >
            <Monogram className="text-[28px] leading-none" />
            <span className="hidden flex-col text-[11px] leading-tight uppercase sm:flex">
              <span>Cristina Galán</span>
              <span className="text-muted-foreground">Fotografía · Dirección</span>
            </span>
          </Link>

          <div className="hidden flex-1 items-center gap-3 border-l border-(--c-hair) px-4 text-[11px] text-muted-foreground uppercase lg:flex">
            <RegMark className="size-4 text-foreground" />
            <span className="tabular-nums">Archivo 2017—2023</span>
            <span aria-hidden>/</span>
            <span>Madrid, ES</span>
          </div>
          <div className="flex-1 lg:hidden" />

          <nav aria-label="Principal" className="hidden md:flex">
            <Suspense fallback={<NavLinksFallback />}>
              <NavLinks />
            </Suspense>
          </nav>
          <PosNegToggle />
          <div className="md:hidden">
            <Suspense
              fallback={
                <span className="flex h-full items-center border-l border-(--c-hair) px-4 text-sm uppercase">
                  Índice
                </span>
              }
            >
              <MobileNav contact={contact} />
            </Suspense>
          </div>
        </div>
      </header>

      <div id="contenido" className="flex flex-1 flex-col">
        {children}
      </div>

      <footer className="border-t border-(--c-hair)">
        <div className="grid md:grid-cols-12">
          <div className="flex flex-col justify-between gap-10 border-b border-(--c-hair) p-4 md:col-span-5 md:border-r md:border-b-0">
            <p className="text-[11px] text-muted-foreground uppercase">Contacto / Encargos</p>
            <p className="font-heading text-5xl leading-[0.9] uppercase md:text-7xl">
              Escríbeme,
              <br />
              revelamos juntas.
            </p>
          </div>
          <ul className="grid grid-cols-2 md:col-span-7 md:grid-cols-1">
            {contact.map((link, i) =>
              link.url ? (
                <li
                  key={link._key}
                  className="border-b border-(--c-hair) even:border-l md:even:border-l-0"
                >
                  <a
                    href={link.url}
                    target={link.kind === "email" ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group flex h-full min-h-28 flex-col justify-between gap-2 p-4 outline-none focus-visible:bg-foreground focus-visible:text-background md:min-h-0 md:flex-row md:items-baseline"
                  >
                    <span className="text-[11px] text-muted-foreground uppercase tabular-nums group-focus-visible:text-background">
                      {String(i + 1).padStart(2, "0")} —{" "}
                      {link.kind === "email" ? "Correo" : "Red social"}
                    </span>
                    <span className="font-heading text-3xl uppercase transition-colors group-hover:text-(--c-mark) md:text-4xl">
                      {link.name} <span aria-hidden>↗</span>
                    </span>
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3 text-[11px] text-muted-foreground uppercase">
          <span className="flex items-center gap-2">
            <RegMark className="size-3.5" /> Hoja de contactos — C
          </span>
          <span className="tabular-nums">Cristina Galán · Madrid</span>
        </div>
      </footer>

      <div className="c-grain" aria-hidden />
      <Cursor className="c-cursor" />
    </div>
  );
}
