import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { ImagesIcon } from "@sanity/icons/Images";
import { defineField, defineType } from "sanity";
import { galleryField, imageField, slugField, videoUrlField, yearField } from "./fields";

export const expo = defineType({
  name: "expo",
  title: "Exposición",
  type: "document",
  icon: ImagesIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "expo" }),
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({ name: "location", title: "Lugar", type: "string" }),
    yearField,
    defineField({ name: "description", title: "Descripción", type: "text", rows: 6 }),
    defineField({
      name: "color",
      title: "Color",
      description: "Color de acento de la exposición.",
      type: "color",
      options: { disableAlpha: true },
    }),
    imageField("cover", "Portada", { required: true }),
    videoUrlField(),
    galleryField(),
  ],
  preview: {
    select: { title: "name", location: "location", year: "year", media: "cover" },
    prepare: ({ title, location, year, media }) => ({
      title,
      subtitle: [location, year].filter(Boolean).join(" · "),
      media,
    }),
  },
});
