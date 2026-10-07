"use client";

import { colorInput } from "@sanity/color-input";
import { esESLocale } from "@sanity/locale-es-es";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: "/studio",
  title: "Cristina Galán",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons are reached from the structure only, never created from "New document".
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
  plugins: [
    structureTool({ structure }),
    colorInput(),
    esESLocale(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
