import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { pad } from "@/components/site/format";
import { getDefaultShareImage, getExpos } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    path: "/expos",
    title: "Exposiciones",
    description: "Exposiciones y festivales en los que se ha mostrado la obra de Cristina Galán.",
    image: await getDefaultShareImage(),
  });
}

const label = "text-[11px] tracking-[0.32em] uppercase";

export default async function ExposPage() {
  const expos = await getExpos();

  return (
    <ViewTransition enter="cine-page-enter" exit="cine-page-exit" default="none">
      <main className="pt-28 pb-24 md:pt-36">
        <div className="flex items-end justify-between gap-6 px-5 md:px-10">
          <h1 className="font-heading text-[clamp(3.5rem,12vw,13rem)] leading-[0.8] font-medium uppercase">
            Exposiciones
          </h1>
          <p className={`${label} pb-2 text-muted-foreground tabular-nums`}>
            {pad(expos.length)} salas
          </p>
        </div>

        <ol className="mt-16 grid gap-x-3 gap-y-12 px-3 sm:grid-cols-2 md:mt-24 md:gap-x-6 md:px-6">
          {expos.map((expo, i) => (
            <li key={expo._id}>
              <Link
                href={`/expos/${expo.slug}`}
                data-cursor="view"
                data-cursor-label="Ver"
                className="group block outline-none"
                // Each room is lit by the expo's own colour.
                style={{ "--sala": expo.color ?? "var(--cine-red)" } as React.CSSProperties}
              >
                <div
                  aria-hidden
                  className="mb-2 flex items-center justify-between px-2 text-[10px] tracking-[0.35em] text-muted-foreground uppercase tabular-nums"
                >
                  <span>Sala {pad(i + 1)}</span>
                  <span>{expo.year}</span>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden bg-black ring-(--sala) ring-offset-4 ring-offset-background group-focus-visible:ring-2">
                  <ViewTransition
                    name={`expo-cover-${expo.slug}`}
                    share="cine-morph"
                    default="none"
                  >
                    <div className="absolute inset-0">
                      <SanityImage
                        image={expo.cover}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.045] motion-reduce:transition-none"
                      />
                    </div>
                  </ViewTransition>
                  {/* Coloured light washes in on hover, like the room lights coming up. */}
                  <div className="absolute inset-0 bg-(--sala) opacity-0 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-60 group-focus-visible:opacity-60" />
                  <div className="cine-vignette absolute inset-0" />
                  <div className="cine-credit absolute inset-x-0 bottom-0 p-4 text-white md:p-8">
                    <p className={`${label} text-white/80`}>{expo.location}</p>
                    <h2 className="mt-2 max-w-[14ch] font-heading text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[0.85] font-medium text-balance uppercase">
                      {expo.name}
                    </h2>
                  </div>
                  <span
                    aria-hidden
                    className="absolute top-4 right-4 size-3 rounded-full bg-(--sala) ring-1 ring-white/40 md:top-6 md:right-6"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </ViewTransition>
  );
}
