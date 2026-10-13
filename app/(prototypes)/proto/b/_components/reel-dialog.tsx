"use client";

import { VideoEmbed } from "@/components/video-embed";
import { Dialog, DialogClose, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectionContent } from "./projection";

/** "Ver reel": opens the showreel in a darkened projection room. */
export function ReelDialog({ url }: { url: string }) {
  return (
    <Dialog>
      <DialogTrigger
        data-cursor="play"
        data-cursor-label="Reel"
        className="group inline-flex items-center gap-3 text-[11px] tracking-[0.32em] uppercase outline-none focus-visible:underline"
      >
        <span className="relative flex size-9 items-center justify-center rounded-full border border-current transition-colors duration-500 group-hover:border-(--b-red) group-hover:bg-(--b-red) group-hover:text-white">
          <svg viewBox="0 0 24 24" className="ml-0.5 size-3" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        Ver reel
      </DialogTrigger>
      <ProjectionContent className="items-center justify-center px-4 md:px-10">
        <div className="w-full max-w-[min(1600px,calc((100svh-8rem)*16/9))]">
          <div className="flex items-center justify-between py-3">
            <DialogTitle className="text-[11px] tracking-[0.32em] uppercase">
              <span className="b-rec mr-2 inline-block size-1.5 rounded-full bg-(--b-red) align-middle" />
              Reel — Cristina Galán
            </DialogTitle>
            <DialogClose className="text-[11px] tracking-[0.32em] uppercase outline-none hover:text-(--b-red) focus-visible:underline">
              Cerrar <span aria-hidden>✕</span>
            </DialogClose>
          </div>
          <VideoEmbed url={url} title="Reel de Cristina Galán" />
        </div>
      </ProjectionContent>
    </Dialog>
  );
}
