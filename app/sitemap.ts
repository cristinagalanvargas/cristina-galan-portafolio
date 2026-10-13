import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/sanity/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cristinagalan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  const pages = ["", "/about", "/reel", "/expos", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));
  const documents = entries.map((entry) => ({
    url: `${siteUrl}/${entry._type === "project" ? "projects" : "expos"}/${entry.slug}`,
    lastModified: entry._updatedAt,
  }));
  return [...pages, ...documents];
}
