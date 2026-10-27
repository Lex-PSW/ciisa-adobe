# CLAUDE.md

Guía para Claude Code en este repositorio.

# CiiSA + Adobe · landing de soluciones

Landing de **Adobe para empresas y gobierno** operada por CiiSA, con formulario de cotización al final. Producto y tono: `PRODUCT.md`. Traspaso, pendientes y responsables: `docs/HANDOFF.md`. Sistema visual: `docs/DESIGN.md`. Origen de cada dato: `docs/CONTENIDO.md`.

**Este repo es público y este archivo se sube a git.** No pongas aquí URLs firmadas, tokens, contraseñas, correos ni datos de personas. Lo privado va en `privada/` (en `.gitignore`) y lo de cada máquina en `CLAUDE.local.md` (también ignorado).

## Reglas

- **Sin framework ni build.** HTML, CSS y JS vanilla. No agregues nada de eso sin preguntar.
- **No existe archivo `CNAME` y no se crea** hasta que TI confirme el registro DNS de `adobe.ciisa.com` y Adobe autorice el uso (ver `docs/HANDOFF.md`).
- **Se mimetiza el lenguaje de Adobe, no su sitio.** No copies composición, imágenes, íconos de aplicación ni textos de adobe.com. El lockup siempre lleva **CiiSA primero** y el pie dice que el sitio lo opera CiiSA.
- **Tipografía:** Source Sans 3 (en `assets/types`). No uses *Adobe Clean* ni la alojes: es propietaria.
- **Color:** rojo Adobe `#eb1000` solo como acento puntual. Degradado de CiiSA en orden fijo `#bcf200 → #01fbce → #00ccff`, solo como acento; nunca texto en degradado sobre fondo blanco.
- **No inventes** precios, planes, promociones, certificaciones, alianzas ni casos de éxito. Cada dato sale de `docs/CONTENIDO.md`; si falta, déjalo como pendiente.
- **No cambies el contrato del formulario** (`name` de los campos, payload, `origen`) sin avisar: el flujo de Power Automate depende de él (`docs/ARQUITECTURA.md`).
- Los ajustes de CSS se agregan **al final** de `styles.css`, en bloques con un comentario que explica el cambio.
- Hay hooks de Impeccable. Se aceptan a propósito: texto en degradado sobre fondo oscuro (hero y formulario) y resplandores suaves.

## Estructura

| Archivo | Qué hace |
|---|---|
| `index.html` | Página única, secciones con ids `inicio`, `soluciones`, `gobierno`, `por-que-ciisa`, `proceso`, `cotiza` |
| `styles.css` | CSS completo con tokens en `:root` |
| `site.js` | Aparición al hacer scroll |
| `adobe-form.js` | Validación y envío al flujo (`ENDPOINT` vacío = no envía) |
| `docs/referencia-beyond/` | Copia de la documentación y estilos de CiiSA Beyond; solo lectura |

## Probar en local

- No hay pruebas automatizadas, linter ni build: se verifica en el navegador (`py -m http.server 8768`).
- Revisa 1280, 800 y 375 px. El navegador integrado cachea CSS y JS: usa `?bust=<n>`.
- Con `ENDPOINT` vacío el formulario no envía nada; para probar el envío real usa una URL de prueba y no la dejes en el commit.

## Publicación

- GitHub Pages desde `main` / raíz. No hagas commit ni push sin que te lo pidan.
