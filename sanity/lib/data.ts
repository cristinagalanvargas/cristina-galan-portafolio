import "server-only";

import { sanityFetch } from "./fetch";
import {
  aboutQuery,
  contactQuery,
  expoQuery,
  exposQuery,
  expoSlugsQuery,
  heroQuery,
  projectQuery,
  projectSlugsQuery,
  projectsQuery,
  reelQuery,
  settingsQuery,
  sitemapQuery,
} from "./queries";

// One function per page need, each declaring the cache tags the webhook revalidates.

export const getSettings = () => sanityFetch({ query: settingsQuery, tags: ["siteSettings"] });

export const getHeroProjects = () =>
  sanityFetch({ query: heroQuery, tags: ["siteSettings", "project", "category"] });

export const getProjects = () =>
  sanityFetch({ query: projectsQuery, tags: ["project", "category"] });

export const getProjectSlugs = () => sanityFetch({ query: projectSlugsQuery, tags: ["project"] });

export const getProject = (slug: string) =>
  sanityFetch({
    query: projectQuery,
    params: { slug },
    tags: [`project:${slug}`, "category"],
  });

export const getExpos = () => sanityFetch({ query: exposQuery, tags: ["expo"] });

export const getExpoSlugs = () => sanityFetch({ query: expoSlugsQuery, tags: ["expo"] });

export const getExpo = (slug: string) =>
  sanityFetch({ query: expoQuery, params: { slug }, tags: [`expo:${slug}`] });

export const getAbout = () =>
  sanityFetch({ query: aboutQuery, tags: ["about", "achievement", "clients"] });

export const getReel = () => sanityFetch({ query: reelQuery, tags: ["about"] });

export const getContact = () => sanityFetch({ query: contactQuery, tags: ["contact"] });

export const getSitemapEntries = () =>
  sanityFetch({ query: sitemapQuery, tags: ["project", "expo"] });

export type Projects = Awaited<ReturnType<typeof getProjects>>;
export type Project = NonNullable<Awaited<ReturnType<typeof getProject>>>;
export type Expos = Awaited<ReturnType<typeof getExpos>>;
export type Expo = NonNullable<Awaited<ReturnType<typeof getExpo>>>;
export type About = Awaited<ReturnType<typeof getAbout>>;
export type ContactLinks = Awaited<ReturnType<typeof getContact>>;
