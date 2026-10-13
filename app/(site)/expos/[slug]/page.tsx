import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { pad } from "@/components/site/format";
import { GalleryStrip } from "@/components/site/gallery-strip";
import { VideoEmbed } from "@/components/video-embed";
import { getExpo, getExpos, getExpoSlugs } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";

type Props = PageProps<"/expos/[slug]">;

const label = "text-[11px] tracking-[0.32em] uppercase";

export async function generateStaticParams() {
  const slugs = await getExpoSlugs();
  return slugs.filter((slug): slug is string => Boolean(slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const expo = await getExpo(slug);
  if (!expo) return {};
  return {
    title: expo.name,
    description: expo.description?.slice(0, 160) ?? undefined,
    openGraph: expo.cover?.asset
      ? {
          images: [
            { url: urlFor(expo.cover).width(1200).height(630).url(), width: 1200, height: 630 },
          ],
        }
      : undefined,
  };
}

// params awaited outside Suspense so unknown slugs answer a real 404 (see projects/[slug]).
export default async function ExpoPage({ params }: Props) {
  const { slug } = await params;
  const [expo, expos] = await Promise.all([getExpo(slug), getExpos()]);
  if (!expo) notFound();

  const index = expos.findIndex((e) => e.slug === expo.slug);
  const next = expos.length > 1 ? expos[(index + 1) % expos.length] : null;
  const name = expo.name ?? "Exposición";
  const sala = { "--sala": expo.color ?? "var(--cine-red)" } as React.CSSProperties;

  return (
    <ViewTransition enter="cine-page-enter" exit="cine-page-exit" default="none">
      <main style={sala}>
        <header className="relative h-svh min-h-[34rem] overflow-hidden bg-black text-white">
          <ViewTransition name={`expo-cover-${expo.slug}`} share="cine-morph" default="none">
            <div className="absolute inset-0">
              <SanityImage
                image={expo.cover}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </ViewTransition>
          <div className="absolute inset-0 bg-(--sala) opacity-35 mix-blend-multiply" />
          <div className="cine-vignette absolute inset-0" />

          <Link
            href="/expos"
            className={`${label} absolute top-20 left-5 text-white/85 outline-none hover:text-white focus-visible:underline md:top-24 md:left-10`}
          >
            <span aria-hidden>← </span>Exposiciones
          </Link>

          <div className="cine-credit absolute inset-x-0 bottom-0 px-5 pb-8 md:px-10 md:pb-12">
            <p
              className={`${label} flex flex-wrap items-center gap-x-4 gap-y-1 text-white/80 tabular-nums`}
            >
              <span
                aria-hidden
                className="size-2.5 rounded-full bg-(--sala) ring-1 ring-white/40"
              />
              <span>Sala {pad(index + 1)}</span>
              {expo.location ? <span>{expo.location}</span> : null}
              {expo.year ? <span>{expo.year}</span> : null}
            </p>
            <h1 className="mt-4 max-w-[14ch] font-heading text-[clamp(3.5rem,12vw,14rem)] leading-[0.8] font-medium text-balance uppercase">
              {name}
            </h1>
          </div>
        </header>

        {expo.description ? (
          <section
            aria-label="Texto de sala"
            className="grid gap-10 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36"
          >
            <p className={`${label} text-muted-foreground md:col-span-3`}>Texto de sala</p>
            <p className="text-2xl leading-[1.2] text-pretty whitespace-pre-line md:col-span-8 md:text-[2.4rem]">
              {expo.description}
            </p>
          </section>
        ) : null}

        {expo.videoUrl ? (
          <section aria-label={`Vídeo: ${name}`} className="bg-black py-[5vw]">
            <div className="mx-auto max-w-[min(1600px,calc(100svh*16/9))] md:px-10">
              <VideoEmbed
                url={expo.videoUrl}
                title={name}
                poster={
                  <SanityImage
                    image={expo.cover}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover opacity-70"
                  />
                }
              />
            </div>
          </section>
        ) : null}

        {expo.gallery?.length ? <GalleryStrip images={expo.gallery} title={name} /> : null}

        {next ? (
          <Link
            href={`/expos/${next.slug}`}
            data-cursor="view"
            data-cursor-label="Siguiente"
            className="group relative block h-[60svh] overflow-hidden bg-black text-white outline-none"
            style={{ "--sala": next.color ?? "var(--cine-red)" } as React.CSSProperties}
          >
            <ViewTransition name={`expo-cover-${next.slug}`} share="cine-morph" default="none">
              <div className="absolute inset-0">
                <SanityImage
                  image={next.cover}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1800ms] group-hover:scale-[1.04] motion-reduce:transition-none"
                />
              </div>
            </ViewTransition>
            <div className="absolute inset-0 bg-black/55 transition-colors duration-700 group-hover:bg-(--sala)/40" />
            <div className="cine-credit relative flex h-full flex-col items-center justify-center gap-5 px-5 text-center">
              <span className={`${label} text-white/80`}>Siguiente sala</span>
              <span className="max-w-[14ch] font-heading text-[clamp(3rem,9vw,10rem)] leading-[0.8] font-medium text-balance uppercase group-focus-visible:underline">
                {next.name}
              </span>
              <span className={`${label} text-white/80`}>
                {[next.location, next.year].filter(Boolean).join(" — ")}
              </span>
            </div>
          </Link>
        ) : null}
      </main>
    </ViewTransition>
  );
}
