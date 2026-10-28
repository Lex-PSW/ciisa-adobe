# Arquitectura

Sitio estático (HTML, CSS y JS vanilla, sin build) servido por GitHub Pages. La única pieza de servidor es un flujo de Power Automate que recibe el formulario. Mismo enfoque que CiiSA Beyond (`docs/referencia-beyond/ARQUITECTURA-beyond.md`) y que `ciisa-lenovo`.

## Front

| Pieza | Detalle |
|---|---|
| `index.html` | Una página. Secciones con id: `inicio`, `soluciones`, `sectores`, `por-que-ciisa`, `soluciones-ciisa`, `proceso`, `cotiza`. El `<nav>` y los CTAs enlazan a esos ids |
| `styles.css` | Tokens en `:root`, componentes y responsive. Ajustes nuevos **al final** |
| `site.js` | Cargador del sitio (`whenReady`) y carga diferida de las ilustraciones; clase `js` en `<html>` (también inline en el `<head>`); aparición de `.reveal`; pausa del hero; parallax (`data-parallax`, con `ResizeObserver`); cielo animado en canvas (`.sky`); incrusta y anima las ilustraciones de las tarjetas (loop seamless); botón del panel de apps |
| `tracking.js` | UTM e identificadores de clic a `sessionStorage`, `fuente` y `procedencia`, eventos al `dataLayer` (`adobe_cta_cotiza`, `adobe_whatsapp`, `adobe_cotizacion_iniciada`, `adobe_cotizacion_completada`). Píxeles de Meta, LinkedIn y TikTok solo cargan si su ID está en `CONFIG` (hoy todos vacíos). Ningún evento lleva datos personales |
| `adobe-form.js` | Todo el formulario (abajo) |
| `assets/` | `types/` Poppins (400 a 900, los de CiiSA Beyond); `img/` logotipos de CiiSA y de Adobe, favicon de CiiSA, 15 ilustraciones (`ill-`, `sector-`, `svc-`, `ben-*.svg`) y `producto/` (íconos oficiales de app, sin modificar) |
| Rutas | Todas **relativas**, para que funcione igual en `…github.io/ciisa-adobe/` y en `adobe.ciisa.com`. **Excepción:** `canonical`, `og:url`, `og:image` y `twitter:image` exigen URL absoluta y hoy apuntan a GitHub Pages: cambiarlas al activar el dominio |
| Metadatos | `<head>`: descripción, `robots`, canónica, Open Graph (`og:image` 1200×630, `assets/img/og-image.png`, y una segunda 1200×1200 `og-image-1x1.png`), Twitter Card `summary_large_image` (`twitter:image` 2:1, `og-image-2x1.png`), `apple-touch-icon` (180×180) y JSON-LD `@graph` (Organization, WebSite, WebPage y la lista de servicios de CiiSA, solo con textos ya presentes en la página), `hreflang` es-MX. La imagen se regenera con `privada/ilustraciones/og.mjs` |
| SEO y accesibilidad | `robots.txt` y `sitemap.xml` en la raíz (URLs de GitHub Pages: cambiarlas con el dominio). Cada `<section>` lleva `aria-labelledby` a su título; enlace "Saltar al contenido"; las ilustraciones llevan `alt` descriptivo (y `<title>`/`<desc>` en el SVG), salvo las del hero, que son decorativas |

## Formulario `[data-adobe-form]`

| Campo (`name`) | Tipo | Regla |
|---|---|---|
| `nombre` | texto | Letras, espacios, apóstrofo, punto y guion; al menos dos palabras |
| `empresa`, `puesto` | texto | Mínimo 2 caracteres |
| `correo` | email | Formato `x@y.zz` |
| `telefono` | tel | 10 a 13 dígitos |
| `sector` | select | Obligatorio: Empresa privada, Gobierno, Educación, Otra |
| `interes` | select | Obligatorio: Creative Cloud, Acrobat y firma electrónica, Firefly (IA creativa), Adobe Express, Varias soluciones, Todavía no lo sé (28 oct 2026: Experience Cloud sale del vocabulario y entra Adobe Express) |
| `cantidad` | select | Obligatorio: rangos de usuarios |
| `mensaje` | textarea | Opcional, máx. 600 |
| `privacidad` | checkbox | Obligatoria |
| `marketing` | checkbox | Opcional, sin marcar por defecto y fuera de la validación: no habilita ni bloquea el botón. Viaja siempre como `"Sí"` o `"No"` |
| `website` | texto oculto | **Campo trampa**: si viene lleno se finge éxito y no se envía |

El botón queda apagado hasta que todo es válido. Al enviar bien se muestra el agradecimiento y se dispara `adobe:lead` en `document` (sin datos personales).

### Payload (POST JSON al flujo)

```json
{
  "nombre": "", "empresa": "", "puesto": "", "correo": "en minúsculas", "telefono": "",
  "sector": "Gobierno", "interes": "Acrobat y firma electrónica", "cantidad": "11 a 50", "mensaje": "",
  "privacidad": "Aceptado", "marketing": "Sí | No", "fecha": "ISO 8601 (UTC)", "origen": "landing-adobe",
  "pagina": "https://…/ruta", "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_content": "", "utm_term": "",
  "gclid": "", "li_fat_id": "", "fbclid": "", "ttclid": "", "fuente": "Google Ads | LinkedIn Ads | Meta Ads | TikTok Ads | … | Directo", "procedencia": "dominio de referencia o vacío"
}
```

- `tracking.js` (adaptado del de Beyond) toma de la URL las UTM y los identificadores de clic (`gclid`, `li_fat_id`, `fbclid`, `ttclid`) y los guarda en `sessionStorage` (`adobe:utm`); sin campaña viajan vacíos.
- `fuente` la calcula `tracking.js` con las mismas etiquetas que Beyond (más TikTok): identificador de clic, luego `utm_source`, luego el dominio de procedencia, y si no hay nada, `Directo`. `procedencia` es solo el dominio del referrer (primero de la sesión).
- Si `tracking.js` no carga, esos campos viajan vacíos y `fuente` = `Directo`; el envío no se rompe.
- **No cambies los `name`, el payload ni `origen` sin avisar a Automatización.**

### Respuesta esperada del flujo

- `200` con `{"ok":true}` si guardó; `403` si `origen` no es `landing-adobe`.
- **Todas las respuestas con los mismos encabezados CORS**, o el navegador las bloquea aunque el flujo funcione.
- Si falla o no hay red, el front muestra un aviso que remite a WhatsApp y no pierde lo escrito. El WhatsApp (botón fijo y CTA del formulario, mismo número y mensaje) abre `wa.me` con un texto predefinido; el número es el de WhatsApp de CiiSA Beyond.

### `ENDPOINT` vacío

Mientras `ENDPOINT` esté vacío en `adobe-form.js`, el formulario valida pero **no envía nada**: muestra "El envío en línea aún no está activo. Llámanos…". Es el estado actual, a propósito.

## Flujo de Power Automate (por crear)

Pasos y lecciones: `docs/HANDOFF.md`, sección 7. Columnas sugeridas para la tabla `CotizacionesAdobe`: `ID`, `Fecha`, `Nombre`, `Empresa`, `Puesto`, `Correo`, `Teléfono`, `Sector`, `Interés`, `Cantidad`, `Mensaje`, `UTM source/medium/campaign/content/term`, `Página`, `Atendido por`, `Estatus`.

## Analítica

Sin tracking incluido. Ver `docs/HANDOFF.md`, sección 8.
