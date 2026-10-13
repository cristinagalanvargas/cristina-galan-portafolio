import { Suspense, ViewTransition } from "react";
import { SanityImage } from "@/components/sanity-image";
import { getHeroProjects, getProjects, getReel } from "@/sanity/lib/data";
import { pad } from "@/components/site/format";
import { HeroMontage } from "@/components/site/hero-montage";
import { ProjectReel, ProjectReelWithParams } from "@/components/site/project-reel";
import { ReelDialog } from "@/components/site/reel-dialog";
import { Timecode } from "@/components/site/timecode";

export default async function CinematicHome() {
  const [projects, reel, picked] = await Promise.all([getProjects(), getReel(), getHeroProjects()]);
  // Montage: the projects chosen in Studio (Ajustes de la web), else the first five.
  const montage = (picked?.length ? picked : projects.slice(0, 5)).filter(
    (p): p is typeof p & { slug: string } => Boolean(p?.slug && p.coverImage?.asset),
  );
  const years = projects.map((p) => p.year).filter((y): y is number => typeof y === "number");
  const span = years.length ? `${Math.min(...years)}—${Math.max(...years)}` : null;

  return (
    <ViewTransition enter="cine-page-enter" exit="cine-page-exit" default="none">
      <main>
        {/* Opening title: the frame opens to scope (2.39:1) between letterbox bars. */}
        <section
          aria-labelledby="cine-title"
          className="grid h-svh min-h-[34rem] grid-rows-[1fr_var(--cine-frame)_1fr]"
          style={
            { "--cine-frame": "clamp(56svh, 100vw / 2.39, 100svh - 11rem)" } as React.CSSProperties
          }
        >
          <div className="flex items-end justify-between px-5 pb-3 text-[11px] tracking-[0.32em] text-muted-foreground uppercase md:px-10">
            <span>Portafolio</span>
            {span ? <span className="tabular-nums">{span}</span> : null}
          </div>

          <div className="cine-shutter relative overflow-hidden bg-black text-white">
            <HeroMontage
              shots={montage.map((p) => ({
                key: p._id,
                href: `/projects/${p.slug}`,
                name: p.name ?? "",
                number: pad(projects.findIndex((q) => q.slug === p.slug) + 1),
              }))}
              overlay={
                <div className="cine-vignette pointer-events-none absolute inset-0 bg-black/25" />
              }
            >
              {montage.map((p, i) => (
                <div key={p._id} className="cine-drift absolute inset-0">
                  <SanityImage
                    image={p.coverImage}
                    alt=""
                    fill
                    priority={i === 0}
                    loading="eager"
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </HeroMontage>

            <div className="absolute top-4 right-4 flex items-center gap-2 text-[11px] tracking-[0.32em] text-white/85 md:top-6 md:right-10">
              <span className="cine-rec size-1.5 rounded-full bg-(--cine-red)" aria-hidden />
              <Timecode />
            </div>

            <div className="cine-credit pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <p
                className="cine-title-in mb-4 text-[11px] tracking-[0.4em] text-white/80 uppercase md:mb-6"
                style={{ "--cine-delay": "0.35s" } as React.CSSProperties}
              >
                Un portafolio de
              </p>
              <h1
                id="cine-title"
                className="cine-title-in font-heading text-[clamp(3.25rem,13.5vw,16rem)] leading-[0.78] font-medium tracking-[-0.005em] uppercase"
                style={{ "--cine-delay": "0.5s" } as React.CSSProperties}
              >
                Cristina Galán
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-2 items-start gap-4 px-5 pt-4 text-[11px] tracking-[0.32em] uppercase md:grid-cols-3 md:px-10">
            <p className="leading-relaxed">
              Fotografía <span className="text-muted-foreground">&</span> dirección
              <br />
              <span className="text-muted-foreground">Madrid</span>
            </p>
            <div className="hidden justify-center md:flex">
              {reel ? <ReelDialog url={reel} /> : null}
            </div>
            <div className="flex flex-col items-end gap-3">
              <a
                href="#proyectos"
                className="group inline-flex items-center gap-2 outline-none focus-visible:underline"
              >
                {pad(projects.length)} proyectos
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-500 group-hover:translate-y-1"
                >
                  ↓
                </span>
              </a>
              {reel ? (
                <div className="md:hidden">
                  <ReelDialog url={reel} />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Static shell renders the unfiltered reel; the client swaps in ?tipo= on hydration. */}
        <Suspense fallback={<ProjectReel projects={projects} />}>
          <ProjectReelWithParams projects={projects} />
        </Suspense>
      </main>
    </ViewTransition>
  );
}
