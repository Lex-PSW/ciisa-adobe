# Sistema visual · CiiSA + Adobe

Este sitio **mimetiza el lenguaje visual de Adobe** (tema claro, titulares muy pesados, botones en píldora, tarjetas redondeadas) y le agrega el **sello de CiiSA** (hero oscuro con resplandor, degradado verde → menta → cian como acento). La identidad completa de CiiSA vive en `docs/referencia-beyond/` (`styles-beyond.css`, `PRODUCT-beyond.md`). Todo está en `styles.css`, con valores en variables de `:root`.

> **Qué se imita y qué no.** Se imitan *principios*: tipografía grande y pesada, mucho aire, botones píldora, colores sobrios con un rojo de acento, mosaicos redondeados. **No** se copian la composición de adobe.com, sus imágenes, sus íconos de aplicación (los cuadrados con dos letras) ni sus textos. Ver riesgos en `HANDOFF.md`, sección 6.

## 1. Observaciones de adobe.com (27 oct 2026, medidas en el navegador)

| Elemento | Valor observado |
|---|---|
| Cuerpo | `"Adobe Clean"`, 16 px, 400, texto `#000`, fondo `#fff` |
| Titulares | `"Adobe Clean Display Black"`, peso **900**; h1 40 px y h2 32 px en la vista móvil medida |
| Botones | Píldora (`border-radius: 999px`), 40 px de alto, Adobe Clean 700; sobre imagen oscura van blancos con texto negro |
| Tarjetas / mosaicos | Esquinas de 16 px |
| Fondo | Blanco con secciones de imagen o video oscuras |
| Navegación | Barra limpia con el logotipo "A" a la izquierda, botón "Iniciar sesión" en píldora blanca |

## 2. Color

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#001c71` (navy 900) | Texto y botones primarios: el navy del logo es el único "negro" |
| `--paper` | `#ffffff` | Fondo de secciones claras |
| `--gray-50/100/300/600/700` | navy 50 / 100 / 200 / 600 / 800 (`#f3f6fa / #e8ecf4 / #ccd5e7 / #2b4b8f / #062777`) | Fondos alternos, bordes y texto secundario, como tintes de navy |
| `--night` | `#001c71` (navy 900) | Hero, formulario y pie (secciones oscuras) |
| `--adobe-red` | `#eb1000` | **Único** color de Adobe: punto del kicker, etiqueta de cada solución, logotipo en rojo. Verificar el valor contra la guía de marca de Adobe |
| `--ciisa-green` `#bcf200` · `--adobe-red` `#eb1000` | Acentos | Degradado verde → rojo (el menta y el azul ya no se usan) |
| `--navy-deep` | `#001c71` | Palomitas sobre el degradado |
| `--focus` | `#143580` (navy 700) | Foco de teclado y de campos; sobre navy va en verde |
| `--danger` / `--ok` | `#d31510` / `#268e6c` | Error y campo válido |

### Mapa tonal

El **único color que llega a negro es el navy** `#001c71` y el **tope claro es el blanco**. El verde de CiiSA y el rojo de Adobe tienen cada uno su rampa (del blanco hacia el color y del color hacia el navy); los grises neutros son tintes de navy. Rampas calculadas en oklab; tokens `--navy-*`, `--green-*` y `--red-*` (50 a 900) al final de `styles.css`. Verde: ancla 300; rojo: ancla 500; el paso 900 de las tres es el navy. Sombras con `rgba(0, 28, 113, a)`. Los degradados entre tonos se arman con pasos de una misma rampa.

**El navy es el único color que baja hacia el negro:** `--navy-950` `#000b3c`, `--navy-1000` `#00051f` y `--navy-1100` `#00030f` son sus pasos más profundos (el pie usa el 950). Verde y rojo nunca pasan de su paso 900 (= navy 900).

### Experimento `exp` (28 oct 2026)

Clase `exp` en `<html>` (quitarla revierte todo; el bloque está al final de `styles.css`). Sobre fondo blanco, titulares en el negro de Adobe (`#000`) y el resto del texto en navy de CiiSA; las 4 tarjetas navy de beneficios, el pie y los botones `.btn--dark` en degradado navy → negro (ángulo distinto por tarjeta y desplazamiento al pasar el cursor); las demás tarjetas siguen en claro. Es la única excepción donde se usa negro puro; a evaluar tras verlo en pantalla.

### CTAs en hover

**Botones oscuros (`.btn--dark`, fondo degradado navy → negro):** al hover o foco conservan el fondo y el texto entra con degradado animado verde 300 → rojo 400 (`--gradient-btn`).

**Botón blanco del hero:** al pasar el cursor (o con foco de teclado) el texto entra con degradado animado (`--gradient-btn-light`: verde 700 → rojo 600 → navy 900, 2.6 s) y el fondo sigue blanco. Excepción deliberada a "nunca texto en degradado sobre blanco": se usan tonos oscuros para cumplir contraste AA. El botón de contorno no lleva el efecto. Sin animación con `prefers-reduced-motion`.

### Pulido tipográfico

Poppins con titulares en 800 y espaciado negativo según tamaño (h1 −0.032em, h2 −0.028em, h3 −0.014em), `text-wrap: balance` en titulares y `pretty` en párrafos, interlineado 1.65 en cuerpo y 1.08–1.25 en titulares, kicker de 13 px en 600 con 0.18em, cifras tabulares en estadísticas y pasos, y suavizado antialiased.

### Ilustraciones de las tarjetas

Cuatro SVG propios en `assets/img/ill-*.svg` (320 × 160, decorativos con `alt` vacío) para las tarjetas de soluciones: diseño vectorial (Creative Cloud), destellos de IA (Firefly), documento con firma (Acrobat) y plantillas de marca (Adobe Express). Solo usan el mapa tonal; no copian ni imitan imágenes de Adobe ni usan sus logotipos. Animaciones suaves dentro del SVG, apagadas con `prefers-reduced-motion`.

### Logotipos de producto

Íconos de app oficiales de socio, **sin modificar** (`assets/img/producto/`): junto al nombre en el título de las cuatro tarjetas de Adobe (32 px) y en las apps de Creative Cloud (20 px). Conservan sus colores (excepción de paleta), sin sombra, filtro, animación ni zoom, y con espacio libre de media anchura. Nunca en ilustraciones, hero ni textos corridos. Pendiente de revisión de marca.

### Apps de Creative Cloud (pastillas, botón y panel)

La tarjeta de Creative Cloud muestra el top 4 de apps (Photoshop, Illustrator, Premiere e InDesign) como pastillas en dos filas de dos, con un botón "Ver todas las apps" que despliega `#apps-cc`: 12 apps con su ícono oficial y una descripción de máximo 8 palabras. El panel está en el DOM justo después de la tarjeta de Creative Cloud: en escritorio va debajo de las cuatro columnas (`order`, ancho completo) y en tablet y móvil debajo de la tarjeta (`grid-auto-flow: dense`). Sin animación con `prefers-reduced-motion`. Abrir o cerrar el panel cambia el alto de la página sin evento de scroll: el parallax se recalcula con un `ResizeObserver` sobre `<body>` (y al terminar la animación de apertura), para que las secciones de abajo (el formulario) no queden con un desplazamiento viejo.

### Ilustraciones de sectores, servicios y beneficios

11 SVG más en `assets/img/` (320 × 160, decorativos, mapa tonal): `sector-empresas` (panorama de rascacielos de San Pedro Garza García: siete torres con muro cortina, remates escalonados, afilados o inclinados, antena con luz roja y la Sierra Madre translúcida al fondo; evoca la zona, no reproduce un edificio en particular), `sector-gobierno` (palacio cívico simétrico con pórtico de seis columnas clásicas con capitel, fuste con estrías y base, frontón, cúpula baja, alas con ventanas y escalinata) y `sector-educacion` (educación: campus universitario contemporáneo con atrio de vidrio de techo inclinado, alas con ventanas corridas, marquesina, árboles y estudiantes; arquetipo de edificio, minimalista y en 2D: cuerpos translúcidos cuyo relleno y contorno bajan de ~50 % a 0 % de opacidad, planos que se cruzan como vidrio y un solo acento por edificio, en verde o rojo) en el encabezado de cada tarjeta de sector; `svc-asesoria`, `svc-implementacion`, `svc-adopcion` y `svc-soporte` en las tarjetas de "Más allá de la licencia"; `ben-control`, `ben-proteccion`, `ben-papel` y `ben-ciisa` en las cuatro tarjetas navy de CiiSA. Las de CiiSA (`svc-*` y `ben-*`) siguen el mismo estilo serio que los edificios: trazos finos y rellenos que bajan a 0 % de opacidad; `ben-ciisa` usa la C del logo con el círculo y el cuadrado de esquinas rectas en verde CiiSA. Entre las tarjetas de Adobe (sectores) y las de CiiSA va un sello "+" (`.plus`), con el signo en verde CiiSA dibujado con dos trazos centrados en el círculo con la frase "Y en cualquier sector, esto es lo que suma CiiSA".

### Loop de las ilustraciones

`site.js` incrusta cada ilustración de tarjeta como SVG (si falla, queda la imagen estática) y le da un ciclo de 2.8 s **sin saltos**: empieza y termina en el estado de reposo. Se reproduce la primera vez que la ilustración se ve (55 % visible) y en cada hover o foco de su tarjeta. Capas: flotación de 4 px de todo el dibujo, respiración del resplandor, pulso escalonado de los acentos (`.tw`) y trazo que se dibuja y redibuja (`.dr`, `.sg`). Cada ilustración suma su propia animación, que resalta lo que ejemplifica (clases `k-*` y `.draw` en el SVG, estilos en `styles.css`): Creative Cloud, formas que se superponen y pluma que dibuja; Firefly, destello que gira 90° y olas que se trazan; Acrobat, firma que se dibuja y palomita; Express, plantillas en abanico; Empresas, pisos que se encienden y sierra en paralaje; Gobierno, banderín y puerta; Educación, banderín y estudiantes que cruzan; Asesoría, flujo entre planes; Implementación, interruptores que se activan; Adopción, barras que crecen; Soporte, flechas que giran como ciclo de renovación; Control, líneas que salen del centro; Protección, escaneo y candado que se cierra; Papel, hojas que pasan a la pantalla; Acompañamiento, el punto viaja hasta el cuadrado. Todas terminan como empiezan. El CSS de las animaciones base está en `styles.css` (`.ill`); los SVG ya no llevan `<style>` propio. Sin animación con `prefers-reduced-motion`.

### Fondo animado (hero y formulario)

Domina el negro: degradado en movimiento entre `--navy-1100` `#00030f`, `--navy-1000` y `--navy-950` (CSS, 34 s), con el navy del logo como islas de luz dentro de una aurora tenue en verde y rojo (CSS, 38 s) y una viñeta que oscurece los bordes y un canvas (`.sky`, en `site.js`) con estrellas, constelaciones que también se enlazan al cursor, destellos de cuatro puntas en verde CiiSA y rojo Adobe y adornos de círculo, cuadrado y cruz que recuerdan el logo. Se pausa fuera de pantalla y con la pestaña oculta; con `prefers-reduced-motion` queda un cuadro fijo.

**Reglas**
1. El degradado de CiiSA sigue siempre **`#bcf200 → #01fbce → #00ccff`, en ese orden**.
2. **El degradado solo va como acento** (franja superior de las tarjetas, subrayado de palabras clave, círculos de las palomitas, palabras del hero y del formulario sobre fondo oscuro). **Nunca como texto sobre fondo blanco** (no pasa el contraste: por eso en las secciones claras es un subrayado `.underline`, no texto).
3. El rojo de Adobe no se mezcla con el degradado ni se usa en botones.

## 3. Tipografía

| | Valor |
|---|---|
| Familia | **Poppins** (SIL OFL; la tipografía oficial de CiiSA, como en CiiSA Beyond). Archivos `assets/types/Poppins-{Regular,Medium,SemiBold,Bold,ExtraBold,Black}.woff2`. Pila: `Poppins, system-ui, …`. Titulares en 800 con interlineado 1.1 |
| Por qué | Es la tipografía de CiiSA y la guía de Adobe para socios pide usar la propia, no *Adobe Clean* (propietaria y solo de Adobe) |
| Cuerpo | 18 px (17 en móvil), peso 400, interlineado 1.5 |
| h1 | `clamp(40px, 6vw, 72px)`, peso **900**, interlineado 1.02, tracking -0.02em |
| h2 | `clamp(32px, 4.2vw, 52px)`, peso 900, interlineado 1.06 |
| h3 | 24 px, peso 800 |
| Kicker | 14 px, 700, mayúsculas, tracking 0.16em |
| Botones | 17 px, 700 |

## 4. Layout

- Contenedor `.wrap`: `min(1200px, 100% - 48px)` (móvil: `100% - 32px`).
- Secciones: padding vertical `clamp(72px, 9vw, 128px)`; fondos alternos `--paper` y `--gray-50`; hero y formulario oscuros.
- Breakpoints (los mismos de Beyond): **móvil ≤ 640**, **tablet 641 a 1024**, **escritorio ≥ 1025**.
- Rejillas: soluciones 4 columnas (2 en tablet, 1 en móvil); sector público 4 y beneficios 4 (igual); proceso 3 (1 en tablet y móvil); "por qué" y formulario 2 (1 en tablet y móvil).
- Barra fija de 64 px, clara, con lockup y botón "Cotiza". En ≤1024 px se ocultan los enlaces.

## 5. Componentes

| Componente | Clase | Descripción |
|---|---|---|
| Botón oscuro | `.btn--dark` | Píldora negra con texto blanco (acción principal sobre claro) |
| Botón blanco | `.btn--white` | Píldora blanca con texto negro (acción principal sobre oscuro, como en el hero de Adobe) |
| Botón fantasma | `.btn--ghost` | Píldora con borde blanco sobre oscuro |
| Lockup | `.lockup` | Logotipo CiiSA (26 px) · separador · logotipo Adobe (24 px). **CiiSA va primero** |
| Tarjeta de solución | `.soln` | Fondo `--gray-50`, radio 16 px, franja superior de degradado de 5 px, etiqueta roja de Adobe, texto y píldoras de producto |
| Columna de sector público | `.gov__col` | Tarjeta blanca con borde y lista de palomitas con degradado |
| Beneficios | `.benef li` | Barras negras con borde izquierdo menta |
| Lista "por qué" | `.checks li` | Tarjeta gris con círculo de degradado y palomita azul marino |
| Paso | `.steps li` | Número grande 900 con una raya de degradado |
| Campos | `.field` | Fondo blanco, borde de 2 px, radio 8 px, 48 px de alto; foco azul con halo; error rojo y válido verde |
| Ilustración del hero | `.stack .tile` | Cuatro mosaicos redondeados en degradado y vidrio, abstractos. **No son íconos de Adobe** |

## 6. Movimiento

Aparición al hacer scroll (`.reveal`) con `IntersectionObserver`, escalonada. El degradado de las palabras del hero fluye lento (18 s). Todo se apaga con `prefers-reduced-motion`, y sin JavaScript el contenido es visible.

## 7. Co-branding con Adobe

1. **Dueño del sitio: CiiSA.** El lockup muestra primero a CiiSA y el pie dice que el sitio es operado por CiiSA.
2. **Logotipo de Adobe:** versiones de una tinta (rojo, negro o blanco) según el fondo; sin deformar, animar ni añadir efectos; espacio libre mínimo igual a la altura de la "A" a cada lado. **Validar con la guía de marca de Adobe.**
3. **Nombres de producto** en texto normal, con la leyenda de marcas en el pie.
4. **Íconos de aplicación de Adobe solo los oficiales de socio, sin modificar** (ver "Logotipos de producto"); sin capturas de producto sin licencia.
5. **Si Adobe pide menos parecido**, cambiar solo tokens: fondo `--night` en todo el sitio, botones con el degradado de CiiSA, y quitar el rojo (ver `styles-beyond.css`).

## 8. Accesibilidad

Contraste AA (texto negro sobre blanco; texto blanco sobre `--night`; texto gris `#4b4b4b` sobre blanco y `--gray-50`). Foco visible azul de 3 px, enlace "Ir al formulario" al inicio, un solo `h1`, `aria-live` en errores, `inputmode` y `autocomplete`, inputs de 17 px (evita el zoom de iOS) y el error no depende solo del color.

## 9. Cómo agregar algo nuevo

Usa los tokens. Agrega el CSS **al final** de `styles.css` en un bloque con comentario; documenta los componentes nuevos en la tabla de la sección 5 y revisa 1280, 800 y 375 px.
