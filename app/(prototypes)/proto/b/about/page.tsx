import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAbout } from "@/sanity/lib/data";
import { pad } from "../_components/format";

export const metadata: Metadata = { title: "Hola" };

const label = "text-[11px] tracking-[0.32em] uppercase";

export default async function AboutPage() {
  const { about, achievements, clients } = await getAbout();
  const clientList = (clients ?? []).filter((client) => client.logo?.asset);

  return (
    <ViewTransition enter="b-page-enter" exit="b-page-exit" default="none">
      <main>
        {/* Opening: oversized greeting, portrait framed like a vertical still. */}
        <section className="grid gap-12 px-5 pt-28 pb-20 md:grid-cols-12 md:gap-10 md:px-10 md:pt-36 md:pb-32">
          <div className="flex flex-col gap-12 md:col-span-7 md:justify-between">
            <h1
              className="b-title-in font-heading text-[clamp(7rem,27vw,28rem)] leading-[0.72] font-medium tracking-[-0.01em] uppercase"
              style={{ "--b-delay": "0.2s" } as React.CSSProperties}
            >
              Hola
            </h1>
            {about?.bio ? (
              <div className="max-w-2xl space-y-6 text-xl leading-[1.35] text-pretty md:text-[1.7rem] [&_a]:underline [&_a]:decoration-(--b-red) [&_a]:underline-offset-4 [&_strong]:font-medium">
                {/* Editors typed soft line breaks for an old layout; let the text reflow. */}
                <PortableText value={about.bio} components={{ hardBreak: false }} />
              </div>
            ) : null}
          </div>

          {about?.profilePicture ? (
            <figure className="self-end md:col-span-4 md:col-start-9">
              <div className="relative aspect-[2/3] overflow-hidden bg-black">
                <SanityImage
                  image={about.profilePicture}
                  alt={about.profilePicture.alt || "Retrato de Cristina Galán"}
                  fill
                  priority
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="b-vignette pointer-events-none absolute inset-0 opacity-60" />
                <span className="absolute top-4 left-4 flex items-center gap-2 text-[10px] tracking-[0.32em] text-white/85 uppercase">
                  <span className="b-rec size-1.5 rounded-full bg-(--b-red)" aria-hidden />
                  Retrato
                </span>
              </div>
              <figcaption className={`${label} mt-3 flex justify-between text-muted-foreground`}>
                <span>Cristina Galán</span>
                <span>Madrid</span>
              </figcaption>
            </figure>
          ) : null}
        </section>

        {achievements.length ? (
          <section
            aria-labelledby="b-trayectoria"
            className="border-t px-5 py-20 md:px-10 md:py-32"
          >
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-3">
                <h2 id="b-trayectoria" className={`${label} text-muted-foreground`}>
                  Trayectoria
                </h2>
              </div>
              <Accordion
                multiple
                defaultValue={achievements[0] ? [achievements[0]._id] : []}
                className="border-t md:col-span-9"
              >
                {achievements.map((group) => (
                  <AccordionItem key={group._id} value={group._id} className="border-b">
                    <AccordionTrigger className="items-center rounded-none py-6 font-heading text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.85] font-normal uppercase hover:no-underline focus-visible:ring-(--b-red)/50 **:data-[slot=accordion-trigger-icon]:size-6 **:data-[slot=accordion-trigger-icon]:text-foreground">
                      <span className="flex items-baseline gap-4">
                        {group.name}
                        <span className="font-sans text-[11px] tracking-[0.3em] text-muted-foreground tabular-nums">
                          {pad(group.events?.length ?? 0)}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8">
                      <ol className="divide-y border-t">
                        {(group.events ?? []).map((event) => (
                          <li
                            key={event._key}
                            className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-1 py-4 md:grid-cols-[6rem_1fr_auto] md:gap-x-8"
                          >
                            <span className="text-sm text-(--b-red) tabular-nums md:text-base">
                              {event.year}
                            </span>
                            <div className="text-base leading-snug md:text-lg">
                              <p className="text-pretty">{event.description}</p>
                              <p className="mt-1 text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
                                {[event.institution, event.location].filter(Boolean).join(" — ")}
                              </p>
                            </div>
                            {event.link ? (
                              <a
                                href={event.link}
                                target="_blank"
                                rel="noreferrer"
                                className="col-start-2 self-start text-[11px] tracking-[0.3em] uppercase no-underline! hover:text-(--b-red) md:col-start-3"
                              >
                                Ver <span aria-hidden>↗</span>
                                <span className="sr-only">
                                  {" "}
                                  {event.description} (se abre en una pestaña nueva)
                                </span>
                              </a>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        ) : null}

        {clientList.length ? (
          <section aria-labelledby="b-clientes" className="border-t py-20 md:py-28">
            <h2 id="b-clientes" className={`${label} px-5 text-muted-foreground md:px-10`}>
              Han confiado en mí
            </h2>
            <div className="b-marquee-wrap mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
              <ul className="b-marquee flex w-max items-center gap-14 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center md:gap-24">
                {[...clientList, ...clientList].map((client, i) => {
                  const duplicate = i >= clientList.length;
                  return (
                    <li
                      key={`${client._key}-${i}`}
                      aria-hidden={duplicate || undefined}
                      className={`relative h-16 w-28 shrink-0 md:h-24 md:w-40 ${duplicate ? "motion-reduce:hidden" : ""}`}
                    >
                      <SanityImage
                        image={client.logo}
                        alt={duplicate ? "" : (client.name ?? "")}
                        fill
                        sizes="160px"
                        className="object-contain opacity-80 mix-blend-multiply grayscale dark:mix-blend-screen dark:invert"
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
    </ViewTransition>
  );
}
