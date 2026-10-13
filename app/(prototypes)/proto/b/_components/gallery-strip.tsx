"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SanityImage } from "@/components/sanity-image";
import { Dialog, DialogClose, DialogTitle } from "@/components/ui/dialog";
import type { Project } from "@/sanity/lib/data";
import { pad } from "./format";
import { ProjectionContent } from "./projection";

type Still = NonNullable<Project["gallery"]>[number];

const ratio = (image: Still) => image.dimensions?.aspectRatio ?? 1.5;

/**
 * Horizontal strip of stills between sprocket rows. Vertical wheel pans the
 * strip until it reaches either end, then hands scrolling back to the page.
 * Each still opens a lightbox (arrows to step, Esc to close).
 */
export function GalleryStrip({ images, title }: { images: Still[]; title: string }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;
  const widest = Math.max(...images.map(ratio));

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onScroll = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      setProgress(max > 0 ? strip.scrollLeft / max : 0);
    };
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const max = strip.scrollWidth - strip.clientWidth;
      const atStart = strip.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = strip.scrollLeft >= max - 1 && event.deltaY > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      strip.scrollLeft += event.deltaY;
    };
    onScroll();
    strip.addEventListener("scroll", onScroll, { passive: true });
    strip.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      strip.removeEventListener("scroll", onScroll);
      strip.removeEventListener("wheel", onWheel);
    };
  }, []);

  const pan = (direction: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollBy({
      left: direction * strip.clientWidth * 0.75,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const step = (direction: 1 | -1) => setActive((current) => (current + direction + total) % total);

  const current = images[active];

  return (
    <section aria-labelledby="b-stills" className="py-20 md:py-32">
      <div className="flex items-end justify-between gap-6 px-5 pb-8 md:px-10">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-muted-foreground uppercase tabular-nums">
            {pad(total)} fotogramas
          </p>
          <h2
            id="b-stills"
            className="mt-3 font-heading text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.8] uppercase"
          >
            Fotogramas
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {(
            [
              [-1, "Anteriores", "←"],
              [1, "Siguientes", "→"],
            ] as const
          ).map(([direction, label, glyph]) => (
            <button
              key={label}
              type="button"
              onClick={() => pan(direction)}
              aria-label={`Desplazar fotogramas: ${label.toLowerCase()}`}
              className="flex size-11 items-center justify-center rounded-full border text-lg transition-colors outline-none hover:border-foreground focus-visible:ring-2 focus-visible:ring-(--b-red)"
            >
              <span aria-hidden>{glyph}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-black py-3 text-white">
        <div aria-hidden className="b-sprockets mx-2" />
        <div
          ref={stripRef}
          role="region"
          aria-label={`Fotogramas de ${title}, desplazamiento horizontal`}
          tabIndex={0}
          className="b-strip flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-2 py-3 outline-none focus-visible:ring-2 focus-visible:ring-(--b-red) focus-visible:ring-inset"
        >
          {images.map((image, index) => (
            <button
              key={image._key}
              type="button"
              onClick={() => {
                setActive(index);
                setOpen(true);
              }}
              data-cursor="view"
              data-cursor-label="Ampliar"
              aria-label={`Ampliar fotograma ${index + 1} de ${total}${image.alt ? `: ${image.alt}` : ""}`}
              className="group relative shrink-0 snap-center overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-(--b-red)"
              style={{
                aspectRatio: ratio(image),
                // One height for the whole strip: the widest still fits a phone, capped at 64svh.
                height: `min(64svh, calc((100vw - 2.5rem) / ${widest}))`,
              }}
            >
              <SanityImage
                image={image}
                fill
                sizes="(min-width: 768px) 75vw, 90vw"
                className="object-cover transition-[transform,filter] duration-1000 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span className="absolute bottom-2 left-3 text-[10px] tracking-[0.3em] text-white/80 tabular-nums">
                {pad(index + 1)}
              </span>
            </button>
          ))}
        </div>
        <div aria-hidden className="b-sprockets mx-2" />
      </div>

      <div aria-hidden className="mx-5 mt-6 h-px bg-border md:mx-10">
        <div
          className="h-px origin-left bg-foreground"
          style={{ transform: `scaleX(${Math.max(progress, 0.02)})` }}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <ProjectionContent
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-[11px] tracking-[0.32em] uppercase md:px-10">
            <DialogTitle className="tabular-nums">
              {title}{" "}
              <span className="text-white/60">
                — {pad(active + 1)} / {pad(total)}
              </span>
            </DialogTitle>
            <DialogClose className="outline-none hover:text-(--b-red) focus-visible:underline">
              Cerrar <span aria-hidden>✕</span>
            </DialogClose>
          </div>

          <div className="relative flex-1">
            <AnimatePresence initial={false} mode="popLayout">
              {current ? (
                <motion.div
                  key={current._key}
                  className="absolute inset-0 mx-4 md:mx-24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
                >
                  <SanityImage image={current} fill sizes="100vw" className="object-contain" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-5 py-4 text-[11px] tracking-[0.32em] uppercase md:px-10">
            <button
              type="button"
              onClick={() => step(-1)}
              className="py-2 outline-none hover:text-(--b-red) focus-visible:underline"
            >
              <span aria-hidden>← </span>Anterior
            </button>
            <p className="hidden max-w-[50ch] truncate text-center tracking-normal text-white/60 normal-case md:block">
              {current?.alt}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              className="py-2 outline-none hover:text-(--b-red) focus-visible:underline"
            >
              Siguiente<span aria-hidden> →</span>
            </button>
          </div>
        </ProjectionContent>
      </Dialog>
    </section>
  );
}
