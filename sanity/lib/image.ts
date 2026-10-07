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
