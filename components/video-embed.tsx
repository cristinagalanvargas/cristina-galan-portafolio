"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function toEmbedUrl(url: string) {
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&dnt=1`;
  const youtube = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1`;
  return url;
}

/**
 * Click-to-load video facade: shows a poster (or `children`) and only mounts the
 * Vimeo/YouTube iframe on demand, so player JS doesn't hit page load.
 */
export function VideoEmbed({
  url,
  title,
  poster,
  className,
  playLabel = "Reproducir",
}: {
  url: string;
  title: string;
  poster?: React.ReactNode;
  className?: string;
  playLabel?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}>
      {playing ? (
        <iframe
          src={toEmbedUrl(url)}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          data-cursor="play"
          data-cursor-label={playLabel}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 size-full"
        >
          {poster}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-white/90 text-black transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
