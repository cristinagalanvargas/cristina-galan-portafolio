import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

/** CSS object-position from the editor's hotspot, so `fill` images crop around the focal point. */
export function hotspotPosition(image?: { hotspot?: { x?: number; y?: number } | null } | null) {
  const { x = 0.5, y = 0.5 } = image?.hotspot ?? {};
  return `${x * 100}% ${y * 100}%`;
}

/**
 * Share image for Open Graph / WhatsApp: 1200×630 crop around the hotspot, as
 * JPEG (crawlers don't negotiate formats, so no auto=format here).
 */
export function ogImageUrl(source: SanityImageSource) {
  return builder.image(source).width(1200).height(630).fit("crop").format("jpg").quality(80).url();
}
