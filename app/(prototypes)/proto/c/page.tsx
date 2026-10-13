import { Suspense, ViewTransition } from "react";
import { getExpos, getProjects, getSettings } from "@/sanity/lib/data";
import { ContactSheet, ContactSheetFallback } from "./_components/contact-sheet";
import { ExpoStrip } from "./_components/expo-strip";
import { RegMark } from "./_components/marks";
import { frameNo } from "./_components/utils";

export default async function DirectionCHome() {
  const [projects, expos, settings] = await Promise.all([getProjects(), getExpos(), getSettings()]);

  const years = projects.map((p) => p.year).filter((y): y is number => typeof y === "number");
  const from = Math.min(...years);
  const to = Math.max(...years);
  const categories = new Set(projects.map((p) => p.category).filter(Boolean)).size;

  const specs = [
    ["Hoja", "01"],
    ["Fotogramas", frameNo(projects.length)],
    ["Periodo", `${from}—${to}`],
    ["Categorías", frameNo(categories)],
    ["Formato", "16:9"],
  ] as const;

  return (
    <ViewTransition enter="c-fade" exit="c-fade" default="none">
      <main className="flex flex-col">
        <section className="grid grid-cols-12 gap-x-4 gap-y-8 px-4 pt-10 pb-12 md:pt-16">
          <div className="c-crop col-span-12 lg:col-span-9">
            <p className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground uppercase">
              <RegMark className="size-3.5 text-(--c-mark)" />
              Archivo de imagen fija y en movimiento
            </p>
            <h1 className="pt-[0.1em] font-heading text-[clamp(4.5rem,17vw,15rem)] leading-[0.78] tracking-[-0.01em] uppercase">
              <span className="block">Cristina</span>
              <span className="mt-[0.16em] block">
                Galán<span className="text-(--c-mark)">.</span>
              </span>
            </h1>
          </div>
          <div className="col-span-12 flex flex-col justify-end gap-6 lg:col-span-3">
            <p className="max-w-sm text-base leading-snug text-pretty">
              {settings?.description ??
                "Fotógrafa y realizadora en Madrid. Fotografía y vídeo para marcas, moda y obra personal."}
            </p>
            <p className="text-[11px] text-muted-foreground uppercase">
              Pasa el cursor por un fotograma para leer su ficha. Haz clic para ampliarlo.
            </p>
          </div>
        </section>

        <dl className="grid grid-cols-2 border-t border-(--c-hair) sm:grid-cols-5">
          {specs.map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-2 border-b border-(--c-hair) px-4 py-2 not-last:border-r sm:border-b-0"
            >
              <dt className="text-[11px] text-muted-foreground uppercase">{label}</dt>
              <dd className="text-sm tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <section aria-label="Proyectos">
          <Suspense fallback={<ContactSheetFallback projects={projects} />}>
            <ContactSheet projects={projects} />
          </Suspense>
        </section>

        <ExpoStrip expos={expos} />
      </main>
    </ViewTransition>
  );
}
