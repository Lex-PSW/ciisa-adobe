# CiiSA + Adobe · landing de soluciones

Landing de **Adobe para empresas, gobierno y educación** operada por CiiSA: Creative Cloud, Firefly, Acrobat y firma electrónica, Adobe Express, sector público, soluciones de CiiSA, por qué CiiSA, cómo trabajamos y **formulario de cotización al final**. Mimetiza el lenguaje visual de Adobe (tema claro, titulares pesados, botones en píldora) con el sello de CiiSA.

- **Dominio previsto:** `adobe.ciisa.com` (CNAME en solicitud; ver `docs/HANDOFF.md`). **No hay archivo `CNAME` en este repo todavía, a propósito.**
- **Stack:** HTML, CSS y JavaScript sin framework ni paso de build (igual que CiiSA Beyond y CiiSA + Lenovo). No agregues un framework ni un bundler sin acordarlo antes.
- **Única pieza de servidor:** un flujo de Power Automate que recibe el formulario (por crear; contrato en `docs/ARQUITECTURA.md`).
- **Métrica que manda:** solicitudes de cotización enviadas.

> **El repositorio es público.** No guardes aquí tokens, contraseñas, URLs firmadas (la del flujo va en `adobe-form.js`, como en Beyond, pero no la copies a documentos ni chats), correos ni datos de personas. Lo que no deba ser público va en `privada/` (en `.gitignore`; se comparte por zip).

> **Bloqueo de publicación:** el estilo mimetizado y el logotipo de Adobe necesitan visto bueno de Adobe. Léelo en `docs/HANDOFF.md`, secciones 5 y 6, antes de difundir el sitio.

## Empieza aquí

1. [`docs/HANDOFF.md`](docs/HANDOFF.md) · protocolo de traspaso: estado, pendientes que bloquean, riesgos, roles y checklists.
2. [`docs/DESIGN.md`](docs/DESIGN.md) · sistema visual y cómo se mimetiza Adobe.
3. [`docs/CONTENIDO.md`](docs/CONTENIDO.md) · de dónde sale cada dato y qué validar.
4. [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) · estructura del front y contrato del formulario.
5. [`docs/referencia-beyond/`](docs/referencia-beyond/) · documentación y estilos de CiiSA Beyond (referencia; no se edita).

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Página única: nav, hero, cifras, soluciones, sectores, por qué CiiSA, soluciones de CiiSA, proceso, formulario, pie |
| `styles.css` | Todo el CSS. Los ajustes nuevos van **al final**, en bloques con un comentario |
| `site.js` | Aparición al hacer scroll, parallax, cielo animado, loop de las ilustraciones y panel de apps (todo respeta `prefers-reduced-motion`) |
| `adobe-form.js` | Validación, botón apagado hasta que todo es válido, UTM y POST JSON al flujo (`ENDPOINT` vacío = no envía) |
| `assets/` | Poppins y logotipos de CiiSA y de Adobe (blanco, negro y rojo) |

## Probar en local

```bash
py -m http.server 8768
```

Abre `http://localhost:8768/`. Revisa en 1280, 800 y 375 px. Si el navegador cachea CSS o JS, agrega `?bust=1`. Con `ENDPOINT` vacío, al enviar el formulario se ve el aviso de respaldo y no se manda nada.

## Publicar

GitHub Pages desde `main` / raíz. **No publiques con dominio propio hasta cerrar la lista "Antes de publicar" de `docs/HANDOFF.md`.**
