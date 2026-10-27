# Arquitectura

Sitio estático (HTML, CSS y JS vanilla, sin build) servido por GitHub Pages. La única pieza de servidor es un flujo de Power Automate que recibe el formulario. Mismo enfoque que CiiSA Beyond (`docs/referencia-beyond/ARQUITECTURA-beyond.md`) y que `ciisa-lenovo`.

## Front

| Pieza | Detalle |
|---|---|
| `index.html` | Una página. Secciones con id: `inicio`, `soluciones`, `gobierno`, `por-que-ciisa`, `proceso`, `cotiza`. El `<nav>` y los CTAs enlazan a esos ids |
| `styles.css` | Tokens en `:root`, componentes y responsive. Ajustes nuevos **al final** |
| `site.js` | Agrega la clase `js` a `<html>` y revela los `.reveal` al entrar en pantalla |
| `adobe-form.js` | Todo el formulario (abajo) |
| `assets/` | `types/` Source Sans 3 (latin y latin-ext); `img/` logotipos de CiiSA y de Adobe en blanco, negro y rojo |
| Rutas | Todas **relativas**, para que funcione igual en `…github.io/ciisa-adobe/` y en `adobe.ciisa.com` |

## Formulario `[data-adobe-form]`

| Campo (`name`) | Tipo | Regla |
|---|---|---|
| `nombre` | texto | Letras, espacios, apóstrofo, punto y guion; al menos dos palabras |
| `empresa`, `puesto` | texto | Mínimo 2 caracteres |
| `correo` | email | Formato `x@y.zz` |
| `telefono` | tel | 10 a 13 dígitos |
| `sector` | select | Obligatorio: Empresa privada, Gobierno, Educación, Otra |
| `interes` | select | Obligatorio: Creative Cloud, Acrobat y firma electrónica, Firefly, Experience Cloud, Varias, No sé |
| `cantidad` | select | Obligatorio: rangos de usuarios |
| `mensaje` | textarea | Opcional, máx. 600 |
| `privacidad` | checkbox | Obligatoria |
| `website` | texto oculto | **Campo trampa**: si viene lleno se finge éxito y no se envía |

El botón queda apagado hasta que todo es válido. Al enviar bien se muestra el agradecimiento y se dispara `adobe:lead` en `document` (sin datos personales).

### Payload (POST JSON al flujo)

```json
{
  "nombre": "", "empresa": "", "puesto": "", "correo": "en minúsculas", "telefono": "",
  "sector": "Gobierno", "interes": "Acrobat y firma electrónica", "cantidad": "11 a 50", "mensaje": "",
  "privacidad": "Aceptado", "fecha": "ISO 8601 (UTC)", "origen": "landing-adobe",
  "pagina": "https://…/ruta", "utm_source": "", "utm_medium": "", "utm_campaign": "", "utm_content": "", "utm_term": ""
}
```

- Las UTM se toman de la URL y se guardan en `sessionStorage` (`adobe:utm`); sin campaña viajan vacías.
- **No cambies los `name`, el payload ni `origen` sin avisar a Automatización.**

### Respuesta esperada del flujo

- `200` con `{"ok":true}` si guardó; `403` si `origen` no es `landing-adobe`.
- **Todas las respuestas con los mismos encabezados CORS**, o el navegador las bloquea aunque el flujo funcione.
- Si falla o no hay red, el front muestra un aviso con el teléfono de respaldo (811 257 8000) y no pierde lo escrito.

### `ENDPOINT` vacío

Mientras `ENDPOINT` esté vacío en `adobe-form.js`, el formulario valida pero **no envía nada**: muestra "El envío en línea aún no está activo. Llámanos…". Es el estado actual, a propósito.

## Flujo de Power Automate (por crear)

Pasos y lecciones: `docs/HANDOFF.md`, sección 7. Columnas sugeridas para la tabla `CotizacionesAdobe`: `ID`, `Fecha`, `Nombre`, `Empresa`, `Puesto`, `Correo`, `Teléfono`, `Sector`, `Interés`, `Cantidad`, `Mensaje`, `UTM source/medium/campaign/content/term`, `Página`, `Atendido por`, `Estatus`.

## Analítica

Sin tracking incluido. Ver `docs/HANDOFF.md`, sección 8.
