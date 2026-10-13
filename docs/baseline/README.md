# Baseline (sitio legacy, 2026-10-07)

Código: tag `v1-legacy` (Next 12 Pages Router + Hygraph). Producción: https://www.cristinagalan.com (el apex redirige 307 a `www`).

- `urls.txt`: 24 rutas públicas (5 estáticas, 13 proyectos, 6 expos). El rebuild debe mantenerlas todas.
- `screenshots/`: captura de viewport de cada ruta en escritorio (1440×900) y móvil (390×844), tema claro.

## Lighthouse (móvil, Chrome headless)

| Ruta | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 93 | 94 | 96 | 92 | 2.9 s | 0 |
| `/projects/paul` | 94 | 87 | 96 | 83 | 2.8 s | 0 |
| `/about` | 92 | 94 | 96 | 92 | 2.8 s | 0 |

## Problemas observados en producción

- La imagen de portada de los proyectos no carga (se ve el `alt` roto arriba a la izquierda). Los assets se sirven desde `eu-central-1.graphassets.com`.
- Ninguna página publica meta description (errata `metaDesription` en `PageContainer`).
