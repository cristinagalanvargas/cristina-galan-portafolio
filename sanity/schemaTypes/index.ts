import type { SchemaTypeDefinition } from "sanity";
import { expo } from "./expo";
import { about, achievement, category, clients, contact, siteSettings } from "./misc";
import { project } from "./project";

export const singletonTypes = new Set(["about", "clients", "contact", "siteSettings"]);

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  category,
  expo,
  achievement,
  about,
  clients,
  contact,
  siteSettings,
];
