"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { SanityImage } from "@/components/sanity-image";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Project } from "@/sanity/lib/data";
import { GreaseLoop } from "./marks";
import { frameNo } from "./utils";

type GalleryImage = NonNullable<Project["gallery"]>[number];

/** Gallery as a contact sheet; clicking a frame opens it on the "lightbox". */
export function LightboxGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const open = index !== null;
  const total = images.length;

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((i) => (i === null ? i : (i + delta + total) % total));
    },
    [total],
  );

  // Arrow keys while the lightbox is open (Esc is handled by the Dialog).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <ol className="grid grid-cols-2 border-t border-l border-(--c-hair) sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {images.map((image, i) => (
          <li key={image._key} className="border-r border-b border-(--c-hair) p-2 sm:p-3">
            <button
              type="button"
              onClick={() => {
                setDirection(1);
                setIndex(i);
              }}
              data-cursor="view"
              data-cursor-label="Ampliar"
              aria-label={`Ampliar fotograma ${frameNo(i + 1)} de ${frameNo(total)}${image.alt ? `: ${image.alt}` : ""}`}
              className="group relative block w-full text-left outline-none"
            >
              <div className="c-rebate flex items-center justify-between px-1.5 py-1 font-mono text-[9px] tracking-[0.12em]">
                <span>▸ {frameNo(i + 1)}</span>
                <span>{frameNo(i + 1)}A</span>
              </div>
              <div className="relative aspect-[4/3] bg-(--c-film)">
                <SanityImage
                  image={image}
                  fill
                  sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain p-1"
                />
              </div>
              <div className="c-rebate h-2" />
              <GreaseLoop className="-top-1.5 -left-1.5 size-[calc(100%+12px)]" variant={i} />
            </button>
          </li>
        ))}
      </ol>

      <Dialog open={open} onOpenChange={(next) => !next && setIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="proto-c dark top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-(--c-film) p-0 text-(--c-ink) ring-0 sm:max-w-none"
        >
          <div className="flex h-12 items-stretch border-b border-white/10 text-[11px] text-white/70 uppercase">
            <DialogTitle className="flex flex-1 items-center gap-3 px-4 font-sans text-[11px] font-normal text-white/70 uppercase">
              <span className="text-(--c-edge) tabular-nums">
                {index !== null ? frameNo(index + 1) : "--"} / {frameNo(total)}
              </span>
              <span className="truncate">{title}</span>
            </DialogTitle>
            <span className="hidden items-center px-4 sm:flex">
              ← → para navegar · Esc para cerrar
            </span>
            <DialogClose className="flex items-center border-l border-white/10 px-5 text-white uppercase outline-none hover:text-(--c-mark) focus-visible:bg-white focus-visible:text-black">
              Cerrar
            </DialogClose>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {current ? (
                <motion.div
                  key={current._key}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute inset-4 sm:inset-10"
                >
                  <SanityImage
                    image={current}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Fotograma anterior"
              className="absolute inset-y-0 left-0 flex w-1/4 items-center justify-start px-4 text-3xl text-white/0 outline-none hover:text-white/80 focus-visible:text-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Fotograma siguiente"
              className="absolute inset-y-0 right-0 flex w-1/4 items-center justify-end px-4 text-3xl text-white/0 outline-none hover:text-white/80 focus-visible:text-white"
            >
              →
            </button>
          </div>

          <ol className="flex h-16 shrink-0 gap-1 overflow-x-auto border-t border-white/10 p-2">
            {images.map((image, i) => (
              <li key={image._key} className="h-full shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setDirection(i > (index ?? 0) ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Ir al fotograma ${frameNo(i + 1)}`}
                  aria-current={i === index ? "true" : undefined}
                  className="relative block aspect-[4/3] h-full opacity-40 outline-none hover:opacity-80 focus-visible:opacity-100 aria-[current]:opacity-100 aria-[current]:ring-1 aria-[current]:ring-(--c-mark)"
                >
                  <SanityImage image={image} fill sizes="64px" className="object-cover" />
                </button>
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
}
