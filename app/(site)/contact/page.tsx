import type { Metadata } from "next";
import { ViewTransition } from "react";
import { pad } from "@/components/site/format";
import { getContact } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribe a Cristina Galán para encargos, colaboraciones o exposiciones.",
};

const label = "text-[11px] tracking-[0.32em] uppercase";

/** Pretty, short form of a link for display: no protocol, no trailing slash or query. */
function display(url: string) {
  return decodeURIComponent(url)
    .replace(/^mailto:/, "")
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\?.*$/, "")
    .replace(/\/$/, "");
}

export default async function ContactPage() {
  const links = ((await getContact()) ?? []).filter((link) => link.url);

  return (
    <ViewTransition enter="cine-page-enter" exit="cine-page-exit" default="none">
      <main className="px-5 pt-28 pb-24 md:px-10 md:pt-36">
        <p className={`${label} text-muted-foreground`}>Contacto</p>
        <h1 className="mt-6 max-w-[12ch] font-heading text-[clamp(3.5rem,13vw,14rem)] leading-[0.8] font-medium uppercase">
          Hablemos<span className="text-(--cine-red)">.</span>
        </h1>
        <p className="mt-8 max-w-xl text-xl leading-snug text-pretty text-muted-foreground md:text-2xl">
          Encargos, colaboraciones, exposiciones o una idea por rodar.
        </p>

        <ul className="mt-20 border-t">
          {links.map((link, i) => (
            <li key={link._key} className="border-b">
              <a
                href={link.url ?? undefined}
                {...(link.kind === "social" ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group grid grid-cols-12 items-baseline gap-x-4 py-5 outline-none md:py-6"
              >
                <span
                  className={`${label} col-span-2 text-muted-foreground tabular-nums md:col-span-1`}
                >
                  {pad(i + 1)}
                </span>
                <span className="col-span-10 font-heading text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.85] font-medium uppercase transition-colors group-hover:text-(--cine-red) group-focus-visible:text-(--cine-red) md:col-span-5">
                  {link.name}
                </span>
                <span className="col-span-10 col-start-3 mt-2 truncate text-sm text-muted-foreground md:col-span-5 md:col-start-auto md:mt-0 md:text-base">
                  {display(link.url ?? "")}
                </span>
                <span
                  aria-hidden
                  className="hidden text-right text-(--cine-red) md:col-span-1 md:block"
                >
                  ↗
                </span>
                {link.kind === "social" ? (
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </ViewTransition>
  );
}
