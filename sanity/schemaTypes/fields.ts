import { defineArrayMember, defineField } from "sanity";

/** Image with hotspot and a required alt text, shared by every image field. */
export function imageField(name: string, title: string, options: { required?: boolean } = {}) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Texto alternativo",
        description: "Describe la imagen para lectores de pantalla y buscadores.",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
    validation: options.required ? (rule) => rule.required() : undefined,
  });
}

export function galleryField(name = "gallery", title = "Galería") {
  return defineField({
    name,
    title,
    type: "array",
    options: { layout: "grid" },
    of: [
      defineArrayMember({
        type: "image",
        options: { hotspot: true },
        fields: [defineField({ name: "alt", title: "Texto alternativo", type: "string" })],
      }),
    ],
  });
}

export function slugField(source = "name") {
  return defineField({
    name: "slug",
    title: "URL",
    description: "Se genera a partir del nombre. No la cambies si la página ya está publicada.",
    type: "slug",
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  });
}

export function videoUrlField(name = "videoUrl", title = "Vídeo") {
  return defineField({
    name,
    title,
    description: "Enlace de Vimeo o YouTube.",
    type: "url",
    validation: (rule) => rule.uri({ scheme: ["https"] }),
  });
}

export const yearField = defineField({
  name: "year",
  title: "Año",
  type: "number",
  validation: (rule) => rule.required().integer().min(1990).max(2100),
});
