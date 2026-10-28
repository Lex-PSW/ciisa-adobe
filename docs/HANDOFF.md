# Protocolo de handoff · landing CiiSA + Adobe

Versión 1 · 27 de octubre de 2026 · Prepara: Diseño (con Claude Code) · Recibe: quien continúe el sitio (Diseño, Automatización, TI, Legal/Marca).

Punto de entrada para continuar el proyecto sin depender de quien lo empezó. Léelo completo antes de tocar nada. Es el sitio hermano de `ciisa-lenovo` y comparte su estructura y su protocolo; cambia la identidad visual (aquí se mimetiza el lenguaje de Adobe) y el contenido.

## 1. Qué es y en qué estado está

Landing de **soluciones Adobe para empresas y gobierno** operada por CiiSA: Creative Cloud, Firefly, Acrobat y firma electrónica, Adobe Express, sector público, soluciones de CiiSA, por qué CiiSA, proceso y **formulario de cotización al final**. Sitio nuevo e independiente de CiiSA Beyond y de CiiSA + Lenovo, en su propio repositorio.

| Pieza | Estado |
|---|---|
| Estructura y copy | ✅ Listo (borrador a validar) |
| Diseño y responsive (1440, 1024, 390 px) | ✅ Listo |
| Formulario (validación, UTM, payload) | ✅ Listo en el front; **sin endpoint** |
| Flujo de Power Automate que recibe el formulario | ⬜ Por crear (sección 6) |
| Autorización de uso de marca, logotipo y estilo de Adobe | ⬜ **Por validar con Adobe (sección 5, bloqueo)** |
| Leyenda legal | ⬜ Por validar |
| Solicitud de CNAME `adobe.ciisa.com` a TI | ⬜ Correo listo (`privada/correo-solicitud-cname.md`); falta enviarlo |
| Analítica | ⬜ Por decidir (sección 7) |
| `og:image`, favicon definitivo, URL canónica | ⬜ Por hacer |

## 2. Qué contiene el kit

| Ruta | Contenido |
|---|---|
| `index.html`, `styles.css`, `site.js`, `adobe-form.js`, `assets/` | El sitio (HTML/CSS/JS vanilla, sin build) |
| `README.md`, `PRODUCT.md`, `.claude/CLAUDE.md` | Visión, producto y reglas de trabajo |
| `docs/DESIGN.md` | Sistema visual: cómo se mimetiza Adobe y cómo entra CiiSA; tokens y componentes |
| `docs/CONTENIDO.md` | De dónde sale cada dato y qué validar |
| `docs/ARQUITECTURA.md` | Estructura del front y contrato del formulario |
| `docs/referencia-beyond/` | Copia de la documentación y los estilos de CiiSA Beyond (solo lectura) |
| `privada/` (fuera de git; se comparte por zip) | `correo-solicitud-cname.md` |

## 3. Orden de lectura para quien recibe

1. `README.md` y `PRODUCT.md` (10 min).
2. `.claude/CLAUDE.md`: reglas no negociables.
3. `docs/DESIGN.md`: antes de cambiar cualquier estilo. **Léelo con la sección 6 de este documento (riesgo de marca)**.
4. `docs/CONTENIDO.md`: antes de cambiar cualquier texto o dato.
5. `docs/ARQUITECTURA.md`: antes de tocar el formulario o crear el flujo.
6. `docs/referencia-beyond/`: solo si necesitas el "por qué" (lecciones de Power Automate en `CLAUDE-beyond.md`, flujos en `FLUJOS-beyond.md`).

## 4. Decisiones ya tomadas (no se reabren sin avisar)

- **Sitio nuevo, repo nuevo**, hermano de `ciisa-beyond` y `ciisa-lenovo`. Mismo stack: HTML, CSS y JS vanilla, **sin framework ni build**.
- **Estilo:** se mimetiza el *lenguaje* visual de Adobe (tema claro, titulares en peso 900, botones en píldora, tarjetas de 16 px, rojo Adobe como acento) con el sello de CiiSA (degradado verde → menta → cian como acento, hero oscuro). **No es una copia de adobe.com**: ni su composición, ni sus imágenes, ni sus textos, ni sus íconos de aplicación.
- **Tipografía:** *Adobe Clean* es propietaria y no se puede alojar ni usar fuera de las propiedades de Adobe. Se usa **Poppins**, la tipografía oficial de CiiSA (código abierto, SIL OFL), alojada en `assets/types`. La pila de fuentes ya nombra `Adobe Clean` primero: solo se verá si el usuario la tiene instalada.
- **Dominio previsto `adobe.ciisa.com` por CNAME.** El archivo `CNAME` **no está en el repo** hasta que TI confirme el registro.
- **Contenido propio:** redactado con palabras propias a partir de ciisa.com y del sitio oficial de Adobe. Sin precios, promociones ni planes concretos.
- **Un CTA principal:** cotizar. El formulario va al final y todos los botones llevan a él.
- **Repositorio público:** nada de secretos ni datos personales en git.

## 5. Antes de publicar (lista de bloqueo)

| # | Pendiente | Responsable | Detalle |
|---|---|---|---|
| 1 | **Autorización de Adobe para el estilo y el logotipo** | Marca / Legal | Es el bloqueo principal. Adobe tiene una guía de marca y programas de socios con reglas de co-branding. Confirmar: (a) que CiiSA puede usar el logotipo de Adobe en un sitio propio y en qué versión; (b) si exigen aprobación previa de materiales; (c) el nivel de partnership que se puede declarar; (d) que el parecido visual con su sitio es aceptable o qué ajustes piden. Hasta tener respuesta **no se publica con dominio propio ni se difunde** |
| 2 | **Logotipo de Adobe** | Marca | Hoy se usa la versión de Adobe que CiiSA ya tiene en sus materiales de socios (`assets/img/adobe-logo-*.svg`), recoloreada a rojo, negro y blanco (las versiones de una tinta que la guía de Adobe admite; **confirmarlo**). Sustituir por el archivo oficial si Adobe lo entrega. No deformar, animar ni rodear de efectos |
| 3 | **Leyenda legal** | Legal | El pie lleva un texto genérico de marcas (Adobe, Creative Cloud, Acrobat, Photoshop, Illustrator, Premiere, InDesign, Firefly, Adobe Express). **Validarlo** con Legal y con Adobe |
| 4 | **Nombres de producto vigentes** | Comercial | Adobe renombra con frecuencia (por ejemplo, *Adobe Sign* → *Acrobat Sign*). El sitio usa los nombres de ciisa.com. Confirmar contra el catálogo vigente |
| 5 | **Imágenes de producto** | Marca / Adobe | El sitio usa una ilustración abstracta propia. Si se quieren capturas o fotografía de Adobe, solo con activos oficiales y su licencia. No descargar imágenes de adobe.com |
| 6 | **Validación de contenido** | Comercial CiiSA | Revisar `docs/CONTENIDO.md` completo, sobre todo "Adobe para gobierno" (afirmaciones de cumplimiento y de validez legal de la firma) |
| 7 | **Flujo del formulario** | Automatización | Crear el flujo (sección 6), pegar la URL en `ENDPOINT` de `adobe-form.js` y probar de punta a punta |
| 8 | **Destino de las solicitudes** | Comercial CiiSA | Quién recibe cada cotización, tiempo de respuesta prometido y a qué CRM o Excel van |
| 9 | **DNS** | TI | Enviar `privada/correo-solicitud-cname.md`; con la confirmación, crear `CNAME` en el repo y activar HTTPS forzado |
| 10 | **Aviso de privacidad** | Legal | El formulario enlaza `https://ciisa.com/aviso-de-privacidad/`. Confirmar que cubre este uso |
| 11 | **Analítica** | Marketing | Decidir GTM/GA4 y la conversión (sección 7) |
| 12 | **Metadatos** | Diseño | `og:image` 1200×630, favicon definitivo (hoy usa el logotipo de Adobe en rojo, **cambiarlo por uno de CiiSA** si Adobe no autoriza el uso), canónica, `robots`/`sitemap` |

## 6. Riesgo de marca: por qué el estilo "tipo Adobe" necesita visto bueno

Imitar el aspecto de un sitio de otra marca puede confundir sobre quién lo opera y, si es demasiado fiel, ser tratado como uso indebido de la marca. Mitigaciones ya aplicadas: el lockup siempre muestra **CiiSA primero**; el pie declara que el sitio **es operado por CiiSA**; el hero y el cierre llevan el sello de CiiSA (fondo oscuro con resplandor y degradado); no hay imágenes, íconos de aplicación ni textos de Adobe. Si Adobe pide menos parecido, el sistema de `docs/DESIGN.md` permite pasar a la identidad de CiiSA (como en Beyond) cambiando solo tokens: tema oscuro, Poppins y botones con degradado.

## 7. Formulario y flujo de Power Automate

Igual que en `ciisa-lenovo` (ver su `docs/HANDOFF.md`, sección 6). Resumen para Automatización:

1. **Disparador:** "Cuando se recibe una solicitud HTTP" (conector Premium). La URL firmada va en `ENDPOINT` (`adobe-form.js`); no la copies a documentos ni chats.
2. **Guardar** cada solicitud en una tabla de Excel (por ejemplo `CotizacionesAdobe`, ID tipo `ADO-aammddhhmmss-xxxx`) y **evitar duplicados por correo**.
3. **Avisar** al responsable comercial y **confirmar** a la persona por correo.
4. **Responder `200`** con `{"ok":true}`; `403` si `origen` no es `landing-adobe`. **Todas las respuestas con los mismos encabezados CORS.**
5. **Lecciones de Beyond** (`docs/referencia-beyond/CLAUDE-beyond.md`): caché de *Enumerar filas*, marca con *Actualizar una fila* antes de actuar, simultaneidad 1, nombres de acciones sin corchetes, `@{` en HTML.
6. **Probar:** envío válido, correo repetido, `origen` incorrecto, campo trampa lleno, falla de red.

Datos de este formulario respecto al de Lenovo: agrega **`sector`** (Empresa privada, Gobierno, Educación, Otra) y `interes` cambia de opciones. `origen` = `landing-adobe`.

## 8. Analítica

No hay tracking todavía. El formulario dispara el evento `adobe:lead` en `document` y guarda las UTM en `sessionStorage` (`adobe:utm`) y en el payload. Para activarla: GTM o `tracking.js` de Beyond adaptado. Pedir el ID de contenedor a Marketing; no lo inventes.

## 9. Arranque técnico

1. Crear el repositorio en GitHub bajo la misma organización que `ciisa-beyond` (nombre sugerido: `ciisa-adobe`), público, y subir `main`.
2. Settings → Pages → *Deploy from a branch* → `main` / raíz (queda en `…github.io/ciisa-adobe/`; las rutas son relativas).
3. **Solo después del visto bueno de Adobe (punto 1):** enviar el correo de DNS.
4. Con el CNAME confirmado: agregar `CNAME` (una línea: `adobe.ciisa.com`), esperar la validación y activar *Enforce HTTPS*.
5. Pegar el `ENDPOINT`, probar, y recién entonces compartir la URL.

## 10. Checklist de aceptación

- [ ] 1440, 1024, 768 y 390 px sin desborde horizontal.
- [ ] Anclas y CTAs llevan a la sección correcta; "Cotiza" siempre llega al formulario.
- [ ] Formulario: botón apagado hasta que todo es válido; mensajes por campo; privacidad obligatoria; campo trampa invisible.
- [ ] Envío real llega al Excel, avisa al comercial y confirma al usuario; correo repetido no duplica.
- [ ] Con el flujo caído se ve el aviso con el teléfono de respaldo.
- [ ] Contraste AA, foco visible, `prefers-reduced-motion` respetado, el sitio se lee sin JavaScript.
- [ ] Autorización de Adobe por escrito archivada; leyenda legal validada.
- [ ] `og:image`, favicon, canónica y metadatos finales.
- [ ] Sin secretos ni datos personales en el historial de git.

## 11. Roles

| Rol | Responsabilidad |
|---|---|
| Diseño / front | Mantener el sitio, el sistema visual y este kit |
| Automatización | Flujo del formulario, Excel, correos |
| TI | CNAME y vigilancia del dominio |
| Marca / Legal | **Autorización de Adobe**, logotipo, leyenda, aviso de privacidad |
| Comercial | Validar contenido y atender las solicitudes |

## 12. Riesgos conocidos

- **Marca de terceros** (sección 6): es el principal. Por eso el punto 1 bloquea.
- **Tipografía:** el sitio usa Poppins de CiiSA, como pide la guía de Adobe para socios. No hay forma legítima de usar Adobe Clean aquí.
- **Contenido que envejece:** nombres de producto y planes de Adobe cambian. El sitio no lista planes ni precios; revisar el copy cada trimestre.
- **Afirmaciones para el sector público** (cumplimiento, validez legal de la firma, seguridad): vienen de ciisa.com y deben validarse por Legal antes de difundirse.
- **URL firmada en un repo público:** es el diseño de Beyond; el flujo debe validar `origen`, evitar duplicados y poder regenerar la URL.
- **Dependencia de una persona:** por eso existe este kit.

## 13. Cómo actualizar este kit

Cada cambio relevante (pendiente cerrado, decisión nueva, cambio del contrato del formulario) se refleja aquí y en `docs/`. Fechar los cambios. Si algo de este repo cambia el formulario, avisar a Automatización.
