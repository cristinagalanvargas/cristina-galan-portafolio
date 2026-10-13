import type { Metadata } from "next";
import { Cursor } from "@/components/cursor";
import { getContact } from "@/sanity/lib/data";
import { SiteHeader } from "./_components/site-header";
import "./a.css";

export const metadata: Metadata = {
  title: { default: "Cristina Galán — Índice", template: "%s — Cristina Galán" },
};

function prettyUrl(url: string) {
  return url
    .replace(/^mailto:/, "")
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/?(\?.*)?$/, "");
}

async function SiteFooter() {
  const contact = (await getContact()) ?? [];

  return (
    <footer className="mx-auto mt-32 w-full max-w-[1600px] px-5 pb-10 md:px-10">
      <div className="grid grid-cols-12 gap-x-4 border-t-2 border-foreground pt-4">
        <p className="col-span-12 text-[11px] font-medium tracking-[0.22em] uppercase md:col-span-3">
          Contacto
        </p>
        <ul className="col-span-12 mt-6 md:col-span-9 md:mt-0">
          {contact.map((link, i) =>
            link.url ? (
              <li
                key={link._key}
                className="border-b border-border first:border-t md:first:border-t-0"
              >
                <a
                  href={link.url}
                  target={link.kind === "email" ? undefined : "_blank"}
                  rel={link.kind === "email" ? undefined : "noreferrer"}
                  className="group grid grid-cols-12 items-baseline gap-x-4 py-3 outline-none focus-visible:text-(--a-accent)"
                >
                  <span className="col-span-2 text-[11px] tracking-[0.2em] text-muted-foreground tabular-nums md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 font-heading text-4xl leading-[0.9] uppercase transition-transform duration-500 group-hover:translate-x-2 md:col-span-5 md:text-5xl">
                    {link.name}
                  </span>
                  <span className="col-span-10 col-start-3 truncate text-sm text-muted-foreground group-hover:text-foreground md:col-span-5 md:col-start-auto">
                    {prettyUrl(link.url)}
                  </span>
                  <span
                    aria-hidden
                    className="col-span-1 hidden text-right transition-colors group-hover:text-(--a-accent) md:block"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ) : null,
          )}
        </ul>
      </div>
      <div className="mt-20 flex flex-col justify-between gap-2 text-[11px] tracking-[0.22em] text-muted-foreground uppercase md:flex-row">
        <span>© 2026 Cristina Galán</span>
        <span>Índice editorial — prototipo A</span>
        <span>Madrid · 40°25′N 3°42′O</span>
      </div>
    </footer>
  );
}

export default function DirectionALayout({ children }: LayoutProps<"/proto/a">) {
  return (
    <div className="proto-a relative flex min-h-dvh flex-col bg-background font-sans text-foreground">
      <a
        href="#contenido"
        className="sr-only z-50 bg-foreground px-3 py-2 text-background focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <div id="contenido" className="flex-1">
        {children}
      </div>
      <SiteFooter />
      <Cursor
        className="size-2.5 bg-(--a-accent)"
        stateClassNames={{
          hover: "size-9 border border-foreground bg-transparent",
          view: "h-7! w-auto! rounded-none bg-(--a-accent) px-3 text-background [&>span]:text-[10px] [&>span]:tracking-[0.22em]",
          play: "size-20 bg-(--a-accent) text-background",
        }}
      />
    </div>
  );
}
