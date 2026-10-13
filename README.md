# Cristina Galán — portafolio

https://www.cristinagalan.com

Stack: Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Base UI) · Motion · Sanity.

## Desarrollo

Requisitos: Node 24 y pnpm 10.

```bash
pnpm install
pnpm dev
```

Copia `.env.example` a `.env.local` y rellena el project ID de Sanity (`7wqgeled`) y `SANITY_REVALIDATE_SECRET`.

| Script                                         | Qué hace                                                  |
| ---------------------------------------------- | --------------------------------------------------------- |
| `pnpm dev`                                     | Servidor de desarrollo                                    |
| `pnpm build` / `pnpm start`                    | Build y servidor de producción                            |
| `pnpm lint` · `pnpm typecheck` · `pnpm format` | Calidad                                                   |
| `pnpm typegen`                                 | Regenera `sanity.types.ts` tras cambiar schemas o queries |
| `pnpm migrate -- --dry-run`                    | Migración Hygraph → Sanity (requiere `sanity login`)      |

## Contenido (Sanity)

- Studio en `/studio` (proyecto `7wqgeled`, organización Brother Sailor; datasets `development` y `production`).
- Las páginas cachean cada consulta con etiquetas por tipo y slug (`sanity/lib/fetch.ts`). Un webhook GROQ de Sanity → `POST /api/revalidate` (proyección `{_type, "slug": slug.current}`, secreto `SANITY_REVALIDATE_SECRET`) actualiza la web al publicar.

## Diseño

Dirección "Cinemático" (ver `docs/design-decision.md`). Tokens y animaciones en `app/(site)/cinema.css`; componentes del sitio en `components/site/`; shadcn/ui (Base UI) en `components/ui/`.

La versión anterior (Next 12 + Hygraph) está en el tag `v1-legacy`.
