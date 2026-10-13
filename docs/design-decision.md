# Decisión de diseño

Fecha: 2026-10-13 · Elegida por Luis (Brother Sailor) tras revisar los tres prototipos (fase 3).

**Dirección: B · Cinemático**, con dos préstamos de A · Índice editorial.

## Por qué B

- El grueso del trabajo de Cristina es audiovisual (fashion film, publicidad, documental) y tiene reel: la web se abre como una película y la presenta como realizadora.
- Sus portadas son fuertes; B es la única dirección que las muestra a sangre.
- Funciona igual de bien en móvil (no depende del hover).

## Qué se toma de A

- **Vista Índice** en la portada (`?vista=indice`): filas tipográficas con la portada siguiendo al cursor, para ver los 13 proyectos de un vistazo.
- **Página Hola** con el tratamiento editorial de A (bio, trayectoria en acordeón con tabla, clientes), en la paleta de B.

## Ajustes sobre B

- Tema oscuro por defecto en la primera visita (el interruptor recuerda la elección).
- Sección **Exposiciones** propia: cada sala se ilumina con el color de la expo.
- Rutas legacy intactas: `/`, `/projects/[slug]`, `/about`, `/reel`, `/expos`, `/expos/[slug]`, `/contact`.

## Tokens

Definidos en `app/(site)/cinema.css`: claro = "mesa de luz" (papel cálido, tinta), oscuro = "sala de proyección" (negro cálido, hueso); un único acento rojo de luz de seguridad (`--cine-red`). Tipografía: PP Formula Condensed 500 para titulares, PP Formula para texto y créditos (10–11 px, tracking 0.32em).

Las capturas de los tres prototipos están en `docs/prototypes/`; el código, en el historial (commit `e68a63e`).
