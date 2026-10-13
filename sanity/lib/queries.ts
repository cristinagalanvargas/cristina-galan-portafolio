import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  ...,
  "alt": coalesce(alt, ""),
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions{width, height, aspectRatio}
`;

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  tagline,
  description,
  ogImage{${imageFields}}
}`);

export const heroQuery = defineQuery(`*[_id == "siteSettings"][0].heroProjects[]->{
  _id,
  name,
  "slug": slug.current,
  year,
  "category": category->name,
  coverImage{${imageFields}}
}`);

export const projectsQuery =
  defineQuery(`*[_type == "project" && defined(slug.current)] | order(orderRank){
  _id,
  name,
  "slug": slug.current,
  year,
  type,
  "category": category->name,
  coverImage{${imageFields}}
}`);

export const projectSlugsQuery = defineQuery(
  `*[_type == "project" && defined(slug.current)].slug.current`,
);

export const projectQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  year,
  type,
  "category": category->name,
  description,
  role,
  client,
  agency,
  team[]{_key, role, name},
  videoUrl,
  coverImage{${imageFields}},
  gallery[]{_key, ${imageFields}}
}`);

export const exposQuery =
  defineQuery(`*[_type == "expo" && defined(slug.current)] | order(orderRank){
  _id,
  name,
  "slug": slug.current,
  location,
  year,
  "color": color.hex,
  cover{${imageFields}}
}`);

export const expoSlugsQuery = defineQuery(
  `*[_type == "expo" && defined(slug.current)].slug.current`,
);

export const expoQuery = defineQuery(`*[_type == "expo" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  location,
  year,
  description,
  "color": color.hex,
  videoUrl,
  cover{${imageFields}},
  gallery[]{_key, ${imageFields}}
}`);

export const aboutQuery = defineQuery(`{
  "about": *[_id == "about"][0]{bio, profilePicture{${imageFields}}},
  "achievements": *[_type == "achievement"] | order(orderRank){
    _id,
    name,
    events[]{_key, year, description, institution, location, link}
  },
  "clients": *[_id == "clients"][0].clients[]{_key, name, logo{${imageFields}}}
}`);

export const reelQuery = defineQuery(`*[_id == "about"][0].reelUrl`);

export const contactQuery = defineQuery(`*[_id == "contact"][0].links[]{_key, kind, name, url}`);

export const sitemapQuery = defineQuery(`*[_type in ["project", "expo"] && defined(slug.current)]{
  _type,
  "slug": slug.current,
  _updatedAt
}`);
