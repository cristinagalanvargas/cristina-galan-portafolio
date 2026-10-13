import { Image } from "next-sanity/image";
import { hotspotPosition, urlFor } from "@/sanity/lib/image";

type SanityImageValue = {
  asset?: { _ref: string } | null;
  alt?: string | null;
  lqip?: string | null;
  hotspot?: { x?: number; y?: number } | null;
  crop?: unknown;
  dimensions?: { width?: number | null; height?: number | null } | null;
} | null;

type Props = {
  image: SanityImageValue | undefined;
  sizes: string;
  className?: string;
  /** Above-the-fold / LCP image: load eagerly with high fetch priority. */
  priority?: boolean;
  /** Fill the parent (which must be positioned and sized). Otherwise uses the intrinsic ratio. */
  fill?: boolean;
  alt?: string;
};

/** next/image backed by the Sanity image CDN: hotspot-aware cropping and LQIP blur placeholder. */
export function SanityImage({ image, sizes, className, priority, fill, alt }: Props) {
  if (!image?.asset) return null;
  const src = urlFor(image).url();
  const width = image.dimensions?.width ?? 1600;
  const height = image.dimensions?.height ?? 1000;
  const blur = image.lqip ? { placeholder: "blur" as const, blurDataURL: image.lqip } : {};

  return (
    <Image
      src={src}
      alt={alt ?? image.alt ?? ""}
      sizes={sizes}
      {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
      className={className}
      style={{ objectPosition: hotspotPosition(image) }}
      {...(fill ? { fill: true } : { width, height })}
      {...blur}
    />
  );
}
