import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { defineArrayMember, defineField, defineType } from "sanity";
import { galleryField, imageField, slugField, videoUrlField, yearField } from "./fields";

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  icon: ProjectsIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "credits", title: "Créditos" },
    { name: "media", title: "Imágenes y vídeo" },
  ],
  fields: [
    orderRankField({ type: "project" }),
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    { ...slugField(), group: "content" },
    { ...yearField, group: "content" },
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Comercial", value: "comercial" },
          { title: "Personal", value: "personal" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 6,
      group: "content",
    }),
    defineField({ name: "role", title: "Mi papel", type: "string", group: "credits" }),
    defineField({ name: "client", title: "Cliente", type: "string", group: "credits" }),
    defineField({ name: "agency", title: "Agencia", type: "string", group: "credits" }),
    defineField({
      name: "team",
      title: "Equipo",
      type: "array",
      group: "credits",
      of: [
        defineArrayMember({
          type: "object",
          name: "member",
          title: "Miembro",
          fields: [
            defineField({
              name: "role",
              title: "Rol",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        }),
      ],
    }),
    { ...imageField("coverImage", "Portada", { required: true }), group: "media" },
    { ...videoUrlField(), group: "media" },
    { ...galleryField(), group: "media" },
  ],
  preview: {
    select: { title: "name", year: "year", type: "type", media: "coverImage" },
    prepare: ({ title, year, type, media }) => ({
      title,
      subtitle: [year, type].filter(Boolean).join(" · "),
      media,
    }),
  },
});
