import type { Metadata } from "next";
import { ogImageUrl } from "@/sanity/lib/image";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cristinagalan.com";
export const siteName = "Cristina Galán";
export const siteDescription =
  "Cristina Galán, fotógrafa y realizadora en Madrid. Fashion film, publicidad, documental y obra personal.";

type ShareImage = Parameters<typeof ogImageUrl>[0] & { asset?: unknown; alt?: string | null };

/**
 * Metadata for one page. Next replaces the whole openGraph/twitter objects of
 * a parent when a page sets its own, so every page builds them in full here:
 * canonical URL, og:url, site name, locale, type and the 1200×630 share image.
 */
export function pageMetadata({
  path,
  title,
  description,
  image,
  imageAlt,
}: {
  path: string;
  title?: string;
  description?: string | null;
  image?: ShareImage | null;
  imageAlt?: string;
}): Metadata {
  const images = image?.asset
    ? [{ url: ogImageUrl(image), width: 1200, height: 630, alt: imageAlt ?? image.alt ?? siteName }]
    : undefined;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName,
      url: path,
      title: fullTitle,
      ...(description ? { description } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: fullTitle,
      ...(description ? { description } : {}),
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
