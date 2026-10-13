"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { SanityImage } from "@/components/sanity-image";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Project } from "@/sanity/lib/data";

type GalleryImage = NonNullable<Project["gallery"]>[number];

const pad = (n: number) => String(n).padStart(2, "0");

export function GalleryLightbox({ images, title }: { images: GalleryImage[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const open = index !== null;
  const current = index !== null ? images[index] : null;

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setIndex((i) => (i === null ? i : (i + step + images.length) % images.length));
    },
    [images.length],
  );

  return (
    <>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-12">
        {images.map((image, i) => {
          // Editorial rhythm: every fifth plate spans wide.
          const wide = i % 5 === 0;
          return (
            <li
              key={image._key}
              className={cn(
                "col-span-1 md:col-span-4",
                wide && "col-span-2 md:col-span-8",
                i % 5 === 1 && "md:mt-24",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setDirection(1);
                  setIndex(i);
                }}
                data-cursor="view"
                data-cursor-label="Ampliar"
                aria-label={`Ampliar imagen ${i + 1} de ${images.length}${image.alt ? `: ${image.alt}` : ""}`}
                className="group block w-full text-left outline-none"
              >
                <span
                  className="relative block overflow-hidden bg-muted ring-(--a-accent) ring-offset-4 ring-offset-background group-focus-visible:ring-2"
                  style={{ aspectRatio: image.dimensions?.aspectRatio ?? 4 / 5 }}
                >
                  <SanityImage
                    image={image}
                    fill
                    sizes={
                      wide ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"
                    }
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(.76,0,.18,1)] group-hover:scale-[1.03]"
                  />
                </span>
                <span className="mt-2 flex justify-between text-[10px] tracking-[0.22em] text-muted-foreground uppercase tabular-nums">
                  <span>Lám. {pad(i + 1)}</span>
                  <span className="truncate pl-4">{image.alt}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <Dialog open={open} onOpenChange={(next) => !next && setIndex(null)}>
        <DialogContent
          showCloseButton={false}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(-1);
            }
          }}
          className="top-0 left-0 flex h-dvh w-screen max-w-none! translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-background p-0 ring-0 sm:max-w-none"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-foreground px-5 md:px-10">
            <DialogTitle className="font-heading text-2xl leading-none font-normal uppercase">
              {title}
            </DialogTitle>
            <p
              className="text-[11px] tracking-[0.22em] tabular-nums"
              aria-live="polite"
              aria-atomic
            >
              {index !== null ? `${pad(index + 1)} / ${pad(images.length)}` : null}
            </p>
            <DialogClose className="text-[11px] font-medium tracking-[0.22em] uppercase outline-none hover:text-(--a-accent) focus-visible:text-(--a-accent)">
              Cerrar <span aria-hidden>✕</span>
            </DialogClose>
          </div>

          <div className="relative min-h-0 flex-1">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {current ? (
                <motion.div
                  key={current._key}
                  custom={direction}
                  className="absolute inset-6 md:inset-10"
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.18, 1] }}
                >
                  <SanityImage image={current} fill sizes="100vw" className="object-contain" />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagen anterior"
              className="group absolute inset-y-0 left-0 flex w-1/3 items-center justify-start px-5 outline-none md:px-10"
            >
              <span className="font-heading text-4xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:text-(--a-accent) group-focus-visible:opacity-100">
                ←
              </span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Imagen siguiente"
              className="group absolute inset-y-0 right-0 flex w-1/3 items-center justify-end px-5 outline-none md:px-10"
            >
              <span className="font-heading text-4xl opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:text-(--a-accent) group-focus-visible:opacity-100">
                →
              </span>
            </button>
          </div>

          <p className="shrink-0 px-5 pb-5 text-[10px] tracking-[0.22em] text-muted-foreground uppercase md:px-10">
            ← → para navegar · Esc para cerrar
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
