import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { TagIcon } from "@sanity/icons/Tag";
import { StarIcon } from "@sanity/icons/Star";
import { UserIcon } from "@sanity/icons/User";
import { UsersIcon } from "@sanity/icons/Users";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, videoUrlField } from "./fields";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required() }),
  ],
});

export const achievement = defineType({
  name: "achievement",
  title: "Logro",
  type: "document",
  icon: StarIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "achievement" }),
    defineField({
      name: "name",
      title: "Nombre",
      description: "Por ejemplo: Premios, Exposiciones, Publicaciones.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "events",
      title: "Entradas",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "event",
          title: "Entrada",
          fields: [
            defineField({ name: "year", title: "Año", type: "number" }),
            defineField({ name: "description", title: "Descripción", type: "string" }),
            defineField({ name: "institution", title: "Institución", type: "string" }),
            defineField({ name: "location", title: "Lugar", type: "string" }),
            defineField({ name: "link", title: "Enlace", type: "url" }),
          ],
          preview: {
            select: { title: "description", year: "year", institution: "institution" },
            prepare: ({ title, year, institution }) => ({
              title: title || institution,
              subtitle: [year, institution].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),
  ],
});

export const about = defineType({
  name: "about",
  title: "Sobre mí",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "bio",
      title: "Biografía",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        }),
      ],
    }),
    imageField("profilePicture", "Foto de perfil"),
    videoUrlField("reelUrl", "Reel"),
  ],
  preview: { prepare: () => ({ title: "Sobre mí" }) },
});

export const clients = defineType({
  name: "clients",
  title: "Clientes",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "clients",
      title: "Clientes",
      type: "array",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "object",
          name: "client",
          title: "Cliente",
          fields: [
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "logo", title: "Logo", type: "image" }),
          ],
          preview: { select: { title: "name", media: "logo" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Clientes" }) },
});

export const contact = defineType({
  name: "contact",
  title: "Contacto",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "links",
      title: "Enlaces",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "contactLink",
          title: "Enlace",
          fields: [
            defineField({
              name: "kind",
              title: "Tipo",
              type: "string",
              options: {
                list: [
                  { title: "Email", value: "email" },
                  { title: "Red social", value: "social" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "social",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Enlace",
              description: "Para un email, escribe mailto:nombre@dominio.com",
              type: "url",
              validation: (r) => r.required().uri({ scheme: ["https", "http", "mailto"] }),
            }),
          ],
          preview: { select: { title: "name", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Contacto" }) },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes de la web",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "heroProjects",
      title: "Portada: proyectos del montaje",
      description:
        "Proyectos cuyas portadas se van alternando en la cabecera de la home, en este orden. Si lo dejas vacío, salen los cinco primeros proyectos.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (r) => r.unique().max(8),
    }),
    defineField({
      name: "tagline",
      title: "Subtítulo",
      description: "Aparece bajo el nombre en la portada.",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Descripción para buscadores",
      type: "text",
      rows: 3,
      validation: (r) => r.max(160),
    }),
    imageField("ogImage", "Imagen para compartir en redes"),
  ],
  preview: { prepare: () => ({ title: "Ajustes de la web" }) },
});
