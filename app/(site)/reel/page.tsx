import type { Metadata } from "next";
import { ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { VideoEmbed } from "@/components/video-embed";
import { getProjects, getReel } from "@/sanity/lib/data";

export const metadata: Metadata = {
  title: "Reel",
  description: "Reel de Cristina Galán: fotografía y dirección.",
};

const label = "text-[11px] tracking-[0.32em] uppercase";

export default async function ReelPage() {
  const [reel, projects] = await Promise.all([getReel(), getProjects()]);
  const poster = projects[0]?.coverImage;

  return (
    <ViewTransition enter="cine-page-enter" exit="cine-page-exit" default="none">
      <main className="flex min-h-svh flex-col bg-black px-4 pt-24 pb-10 text-white md:px-10 md:pt-28">
        <div className={`${label} flex items-center justify-between pb-4`}>
          <h1 className="flex items-center gap-2">
            <span className="cine-rec size-1.5 rounded-full bg-(--cine-red)" aria-hidden />
            Reel — Cristina Galán
          </h1>
          <span className="text-white/60">Fotografía & dirección</span>
        </div>
        <div className="mx-auto w-full max-w-[min(1600px,calc((100svh-12rem)*16/9))]">
          {reel ? (
            <VideoEmbed
              url={reel}
              title="Reel de Cristina Galán"
              poster={
                poster ? (
                  <SanityImage
                    image={poster}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-60"
                  />
                ) : undefined
              }
            />
          ) : (
            <p className={`${label} py-24 text-center text-white/60`}>Reel no disponible.</p>
          )}
        </div>
      </main>
    </ViewTransition>
  );
}
