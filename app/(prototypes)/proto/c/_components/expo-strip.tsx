import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import type { Expos } from "@/sanity/lib/data";
import { frameNo, inkOn } from "./utils";

/** Exposiciones as 35mm slide mounts, each mount printed in the expo's colour. */
export function ExpoStrip({ expos }: { expos: Expos }) {
  return (
    <section aria-labelledby="c-expos" className="border-t border-(--c-hair)">
      <div className="grid grid-cols-12 items-end gap-4 px-4 pt-14 pb-6">
        <p className="col-span-12 text-[11px] text-muted-foreground uppercase tabular-nums md:col-span-3">
          Hoja nº 02 — Diapositivas
        </p>
        <h2
          id="c-expos"
          className="col-span-12 font-heading text-6xl leading-[0.85] uppercase md:col-span-6 md:text-8xl"
        >
          Exposiciones
        </h2>
        <ol
          aria-hidden
          className="col-span-12 flex h-4 border border-(--c-hair) md:col-span-3"
          title="Carta de color"
        >
          {expos.map((e) => (
            <li key={e._id} className="flex-1" style={{ backgroundColor: e.color ?? undefined }} />
          ))}
        </ol>
      </div>

      <ul className="flex snap-x snap-mandatory [scrollbar-width:thin] gap-4 overflow-x-auto px-4 pb-14 md:grid md:grid-cols-3 md:overflow-visible xl:grid-cols-6">
        {expos.map((expo, i) => {
          const ink = inkOn(expo.color);
          return (
            <li key={expo._id} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-auto">
              <Link
                href="#"
                data-cursor="view"
                data-cursor-label="Ver"
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-(--c-mark) focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div
                  className="relative aspect-square rounded-[6px] p-[13%] shadow-[0_1px_0_rgb(0_0_0/0.08),0_18px_30px_-20px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-1 motion-reduce:transition-none"
                  style={{ backgroundColor: expo.color ?? "#ccc", color: ink }}
                >
                  <span className="absolute top-[4%] left-[6%] text-[10px] uppercase tabular-nums">
                    {frameNo(i + 1)}
                  </span>
                  <span className="absolute top-[4%] right-[6%] text-[10px] uppercase tabular-nums">
                    {expo.year}
                  </span>
                  <div className="relative size-full overflow-hidden rounded-[2px] bg-black shadow-[inset_0_0_0_1px_rgb(0_0_0/0.35)]">
                    <SanityImage
                      image={expo.cover}
                      fill
                      sizes="(min-width: 1280px) 16vw, (min-width: 768px) 33vw, 72vw"
                      className="object-cover transition-[filter] duration-500 group-hover:saturate-[1.15]"
                    />
                  </div>
                  <span className="absolute inset-x-[6%] bottom-[3%] truncate text-center text-[10px] uppercase">
                    {expo.location}
                  </span>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-1 size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: expo.color ?? undefined }}
                  />
                  <span className="text-sm leading-tight uppercase transition-colors group-hover:text-(--c-mark)">
                    {expo.name}
                    <span className="block text-[11px] text-muted-foreground tabular-nums">
                      {expo.location} · {expo.year}
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
