import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAbout } from "@/sanity/lib/data";
import { RegMark } from "../_components/marks";
import { frameNo } from "../_components/utils";

export const metadata: Metadata = { title: "Hola — C" };

const bioComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-(--c-mark) decoration-1 underline-offset-4 hover:text-(--c-mark)"
      >
        {children}
      </a>
    ),
  },
};

export default async function AboutPage() {
  const { about, achievements, clients } = await getAbout();
  const eventsTotal = achievements.reduce((sum, a) => sum + (a.events?.length ?? 0), 0);

  return (
    <ViewTransition enter="c-fade" exit="c-fade" default="none">
      <main className="flex flex-col">
        <section className="grid grid-cols-12 gap-x-4 gap-y-10 px-4 pt-10 pb-16 md:pt-16">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <div className="c-crop">
              <div className="c-rebate flex items-center justify-between px-2 py-1 font-mono text-[9px] tracking-[0.12em] uppercase">
                <span>▸ 00</span>
                <span>Autorretrato</span>
                <span>00A</span>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-(--c-film)">
                <SanityImage
                  image={about?.profilePicture}
                  alt={about?.profilePicture?.alt || "Retrato de Cristina Galán"}
                  fill
                  priority
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 42vw, 100vw"
                  className="object-cover grayscale-[0.15]"
                />
              </div>
              <div className="c-rebate h-3" />
            </div>
          </div>

          <div className="col-span-12 flex flex-col md:col-span-7 lg:col-span-7 lg:col-start-6">
            <p className="mb-4 flex items-center gap-2 text-[11px] text-muted-foreground uppercase">
              <RegMark className="size-3.5 text-(--c-mark)" /> Hola
            </p>
            <h1 className="font-heading text-[clamp(3.5rem,9vw,8rem)] leading-[0.8] uppercase">
              Cristina Galán Vargas
            </h1>
            <dl className="mt-8 grid grid-cols-3 border-t border-(--c-hair)">
              {[
                ["Oficio", "Fotografía · Dirección"],
                ["Base", "Madrid"],
                ["Registros", frameNo(eventsTotal)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-(--c-hair) py-2 pr-3 not-first:pl-3 not-last:border-r"
                >
                  <dt className="text-[11px] text-muted-foreground uppercase">{label}</dt>
                  <dd className="text-sm tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            {about?.bio ? (
              <div className="mt-8 max-w-2xl space-y-4 text-lg leading-snug text-pretty md:text-xl">
                <PortableText value={about.bio} components={bioComponents} />
              </div>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="c-registro" className="border-t border-(--c-hair) px-4 py-14">
          <div className="mb-8 grid grid-cols-12 items-end gap-4">
            <p className="col-span-12 text-[11px] text-muted-foreground uppercase md:col-span-3">
              Hoja nº 03 — Registro
            </p>
            <h2
              id="c-registro"
              className="col-span-12 font-heading text-6xl leading-[0.85] uppercase md:col-span-9 md:text-8xl"
            >
              Trayectoria
            </h2>
          </div>

          <Accordion
            multiple
            defaultValue={achievements[0] ? [achievements[0]._id] : []}
            className="border-t border-(--c-hair)"
          >
            {achievements.map((group, gi) => (
              <AccordionItem
                key={group._id}
                value={group._id}
                className="border-b border-(--c-hair)"
              >
                <AccordionTrigger className="items-center rounded-none py-4 hover:no-underline focus-visible:ring-(--c-mark) [&_[data-slot=accordion-trigger-icon]]:size-5 [&_[data-slot=accordion-trigger-icon]]:text-foreground">
                  <span className="flex flex-1 items-baseline gap-4">
                    <span className="w-8 text-[11px] text-(--c-mark) tabular-nums">
                      {frameNo(gi + 1)}
                    </span>
                    <span className="font-heading text-3xl leading-none uppercase md:text-5xl">
                      {group.name}
                    </span>
                    <span className="ml-auto pr-4 text-[11px] text-muted-foreground uppercase tabular-nums">
                      {frameNo(group.events?.length ?? 0)} entradas
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <Table className="text-sm">
                    <TableHeader>
                      <TableRow className="border-(--c-hair) hover:bg-transparent">
                        {["Año", "Descripción", "Institución", "Lugar", "Enlace"].map((h) => (
                          <TableHead
                            key={h}
                            className="h-8 px-2 text-[11px] font-normal text-muted-foreground uppercase first:pl-0"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.events?.map((event) => (
                        <TableRow
                          key={event._key}
                          className="border-(--c-hair) align-top hover:bg-(--c-mark)/5"
                        >
                          <TableCell className="w-16 pl-0 align-top tabular-nums">
                            {event.year}
                          </TableCell>
                          <TableCell className="min-w-[18rem] align-top whitespace-normal">
                            {event.description}
                          </TableCell>
                          <TableCell className="min-w-[12rem] align-top whitespace-normal text-muted-foreground">
                            {event.institution}
                          </TableCell>
                          <TableCell className="align-top text-muted-foreground">
                            {event.location}
                          </TableCell>
                          <TableCell className="align-top">
                            {event.link ? (
                              <a
                                href={event.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] uppercase underline decoration-(--c-hair) underline-offset-4 hover:text-(--c-mark) hover:decoration-(--c-mark)"
                              >
                                Ver ↗<span className="sr-only">: {event.description}</span>
                              </a>
                            ) : (
                              <span className="text-muted-foreground" aria-hidden>
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {clients?.length ? (
          <section aria-labelledby="c-clientes" className="border-t border-(--c-hair) px-4 py-14">
            <div className="mb-8 grid grid-cols-12 items-end gap-4">
              <p className="col-span-12 text-[11px] text-muted-foreground uppercase md:col-span-3">
                Hoja nº 04 — Clientes
              </p>
              <h2
                id="c-clientes"
                className="col-span-12 font-heading text-6xl leading-[0.85] uppercase md:col-span-9 md:text-8xl"
              >
                Han confiado
              </h2>
            </div>
            <ul className="grid grid-cols-2 border-t border-l border-(--c-hair) sm:grid-cols-4 lg:grid-cols-7">
              {clients.map((client, i) => (
                <li
                  key={client._key}
                  className="group relative flex aspect-[3/2] items-center justify-center border-r border-b border-(--c-hair) p-6"
                >
                  <span className="absolute top-2 left-2 text-[10px] text-muted-foreground tabular-nums">
                    {frameNo(i + 1)}
                  </span>
                  <div className="relative size-full">
                    <SanityImage
                      image={client.logo}
                      alt={client.name ?? ""}
                      fill
                      sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 50vw"
                      className="object-contain opacity-80 grayscale transition-opacity group-hover:opacity-100 dark:invert"
                    />
                  </div>
                  <span className="absolute right-2 bottom-2 text-[10px] text-muted-foreground uppercase opacity-0 transition-opacity group-hover:opacity-100">
                    {client.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </ViewTransition>
  );
}
