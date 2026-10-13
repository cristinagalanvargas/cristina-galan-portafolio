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
import { getAbout, getContact } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Hola",
  description:
    "Cristina Galán (Madrid, 1992), artista visual y realizadora. Biografía, exposiciones, premios, publicaciones y clientes.",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cristinagalan.com";

const label = "text-[10px] tracking-[0.32em] text-muted-foreground uppercase";

const bioComponents: PortableTextComponents = {
  // The migrated bio carries hard line breaks from the old CMS; let the text reflow.
  hardBreak: false,
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-2xl leading-[1.2] text-pretty first:indent-[16.66%] md:text-[2rem]">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-(--cine-red) decoration-1 underline-offset-4 hover:text-(--cine-red)"
      >
        {children}
      </a>
    ),
  },
};

export default async function AboutPage() {
  const [{ about, achievements, clients }, contact] = await Promise.all([getAbout(), getContact()]);
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Cristina Galán",
    jobTitle: "Fotógrafa y realizadora",
    birthDate: "1992",
    homeLocation: { "@type": "Place", name: "Madrid, España" },
    url: siteUrl,
    image: about?.profilePicture?.asset ? urlFor(about.profilePicture).width(800).url() : undefined,
    sameAs: (contact ?? []).filter((link) => link.kind === "social").map((link) => link.url),
  };

  return (
    <ViewTransition enter="cine-page-enter" exit="cine-page-exit" default="none">
      <main className="mx-auto w-full max-w-[1600px] px-5 pb-32 md:px-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <div className="grid grid-cols-12 gap-x-4 pt-28 text-[11px] tracking-[0.32em] uppercase md:pt-36">
          <span className="col-span-6 md:col-span-3">Sobre mí</span>
          <span className="col-span-6 text-right text-muted-foreground md:col-span-3 md:text-left">
            Madrid, 1992
          </span>
        </div>

        <h1 className="mt-10 font-heading text-[clamp(6rem,30vw,30rem)] leading-[0.8] tracking-[-0.02em] uppercase">
          Hola<span className="text-(--cine-red)">.</span>
        </h1>

        {/* Retrato + bio */}
        <section
          aria-label="Biografía"
          className="mt-12 grid grid-cols-12 gap-x-4 gap-y-10 border-t border-foreground pt-4 md:mt-16"
        >
          <figure className="col-span-12 md:col-span-4">
            <div
              className="group relative overflow-hidden bg-muted"
              style={{ aspectRatio: about?.profilePicture?.dimensions?.aspectRatio ?? 4 / 5 }}
            >
              <SanityImage
                image={about?.profilePicture}
                alt={about?.profilePicture?.alt || "Retrato de Cristina Galán"}
                fill
                priority
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
              />
            </div>
            <figcaption className={`${label} mt-2 flex justify-between`}>
              <span>Fig. 1</span>
              <span>Cristina Galán</span>
            </figcaption>
          </figure>

          <div className="col-span-12 md:col-span-7 md:col-start-6">
            {about?.bio ? <PortableText value={about.bio} components={bioComponents} /> : null}
          </div>
        </section>

        {/* Trayectoria */}
        {achievements.length > 0 ? (
          <section aria-labelledby="trayectoria" className="mt-28 md:mt-40">
            <div className="flex items-baseline justify-between border-t-2 border-foreground pt-2">
              <h2 id="trayectoria" className={label}>
                Trayectoria
              </h2>
              <span className={`${label} tabular-nums`}>
                {achievements.reduce((n, a) => n + (a.events?.length ?? 0), 0)} entradas
              </span>
            </div>

            <Accordion multiple defaultValue={[achievements[0]._id]} className="mt-2">
              {achievements.map((group, i) => {
                const events = [...(group.events ?? [])].sort(
                  (a, b) => (b.year ?? 0) - (a.year ?? 0),
                );
                return (
                  <AccordionItem
                    key={group._id}
                    value={group._id}
                    className="border-b border-border not-last:border-b"
                  >
                    <AccordionTrigger className="items-baseline rounded-none border-0 py-4 hover:no-underline focus-visible:ring-0 **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-foreground focus-visible:[&_.cine-acc-title]:text-(--cine-red)">
                      <span className="flex items-baseline gap-4 md:gap-8">
                        <span className="w-8 text-[11px] font-medium tracking-[0.2em] text-muted-foreground tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="cine-acc-title font-heading text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.85] font-normal uppercase">
                          {group.name}
                        </span>
                        <sup className="text-[11px] tracking-normal text-muted-foreground tabular-nums">
                          {events.length}
                        </sup>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8">
                      <div
                        aria-hidden
                        className="hidden grid-cols-12 gap-x-4 border-b border-foreground pb-2 md:grid"
                      >
                        <span className={`${label} col-span-1`}>Año</span>
                        <span className={`${label} col-span-5`}>Descripción</span>
                        <span className={`${label} col-span-3`}>Institución</span>
                        <span className={`${label} col-span-2`}>Lugar</span>
                        <span className={`${label} col-span-1 text-right`}>Enlace</span>
                      </div>
                      <ul>
                        {events.map((event) => (
                          <li
                            key={event._key}
                            className="grid grid-cols-12 gap-x-4 gap-y-1 border-b border-border py-3 text-sm last:border-b-0"
                          >
                            <span className="col-span-3 text-[11px] font-medium tracking-[0.2em] text-(--cine-red) tabular-nums md:col-span-1">
                              {event.year}
                            </span>
                            <span className="col-span-9 md:col-span-5">{event.description}</span>
                            <span className="col-span-9 col-start-4 text-muted-foreground md:col-span-3 md:col-start-auto md:text-foreground">
                              {event.institution}
                            </span>
                            <span className="col-span-9 col-start-4 text-muted-foreground md:col-span-2 md:col-start-auto">
                              {event.location}
                            </span>
                            <span className="col-span-9 col-start-4 md:col-span-1 md:col-start-auto md:text-right">
                              {event.link ? (
                                <a
                                  href={event.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={`Abrir enlace: ${event.institution ?? event.description ?? ""}`}
                                  className="no-underline! hover:text-(--cine-red)"
                                >
                                  ↗
                                </a>
                              ) : (
                                <span aria-hidden className="text-muted-foreground">
                                  —
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </section>
        ) : null}

        {/* Clientes */}
        {clients && clients.length > 0 ? (
          <section aria-labelledby="clientes" className="mt-28 md:mt-40">
            <div className="flex items-baseline justify-between border-t-2 border-foreground pt-2">
              <h2 id="clientes" className={label}>
                Han confiado
              </h2>
              <span className={`${label} tabular-nums`}>{clients.length} clientes</span>
            </div>
            <ul className="mt-6 grid grid-cols-2 border-t border-l border-border sm:grid-cols-3 lg:grid-cols-4">
              {clients.map((client) => (
                <li
                  key={client._key}
                  className="flex aspect-[3/2] flex-col justify-between border-r border-b border-border p-4"
                >
                  <span className="flex flex-1 items-center justify-center">
                    {client.logo?.asset ? (
                      <SanityImage
                        image={client.logo}
                        alt={client.name ?? ""}
                        sizes="200px"
                        className="max-h-24 w-auto max-w-[80%] object-contain opacity-85 grayscale invert dark:invert-0"
                      />
                    ) : (
                      <span className="font-heading text-3xl uppercase">{client.name}</span>
                    )}
                  </span>
                  <span className={label}>{client.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </ViewTransition>
  );
}
