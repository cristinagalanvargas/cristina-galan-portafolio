import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { ImagesIcon } from "@sanity/icons/Images";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { TagIcon } from "@sanity/icons/Tag";
import { StarIcon } from "@sanity/icons/Star";
import { UserIcon } from "@sanity/icons/User";
import { UsersIcon } from "@sanity/icons/Users";
import type { StructureResolver } from "sanity/structure";

const singleton = (
  S: Parameters<StructureResolver>[0],
  type: string,
  title: string,
  icon: React.ComponentType,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Contenido")
    .items([
      orderableDocumentListDeskItem({
        type: "project",
        title: "Proyectos",
        icon: ProjectsIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "expo",
        title: "Exposiciones",
        icon: ImagesIcon,
        S,
        context,
      }),
      S.divider(),
      singleton(S, "about", "Sobre mí", UserIcon),
      orderableDocumentListDeskItem({
        type: "achievement",
        title: "Logros",
        icon: StarIcon,
        S,
        context,
      }),
      singleton(S, "clients", "Clientes", UsersIcon),
      singleton(S, "contact", "Contacto", EnvelopeIcon),
      S.divider(),
      S.documentTypeListItem("category").title("Categorías").icon(TagIcon),
      singleton(S, "siteSettings", "Ajustes de la web", CogIcon),
    ]);
