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
| `--ink` | `#000000` | Texto, botones primarios |
| `--paper` | `#ffffff` | Fondo de secciones claras |
| `--gray-50/100/300/600/700` | `#f8f8f8 / #f1f1f1 / #d5d5d5 / #4b4b4b / #2c2c2c` | Fondos alternos, bordes, texto secundario |
| `--night` | `#0b0b0d` | Hero, formulario y pie (secciones oscuras) |
| `--adobe-red` | `#eb1000` | **Único** color de Adobe: punto del kicker, etiqueta de cada solución, logotipo en rojo. Verificar el valor contra la guía de marca de Adobe |
| `--ciisa-green` `#bcf200` · `--psw-mint` `#01fbce` · `--electric-pyx` `#00ccff` | Identidad CiiSA | Degradado de acento |
| `--navy-deep` | `#001c71` | Palomitas sobre el degradado |
| `--focus` | `#0265dc` | Foco de teclado y de campos |
| `--danger` / `--ok` | `#d31510` / `#268e6c` | Error y campo válido |

**Reglas**
1. El degradado de CiiSA sigue siempre **`#bcf200 → #01fbce → #00ccff`, en ese orden**.
2. **El degradado solo va como acento** (franja superior de las tarjetas, subrayado de palabras clave, círculos de las palomitas, palabras del hero y del formulario sobre fondo oscuro). **Nunca como texto sobre fondo blanco** (no pasa el contraste: por eso en las secciones claras es un subrayado `.underline`, no texto).
3. El rojo de Adobe no se mezcla con el degradado ni se usa en botones.

## 3. Tipografía

| | Valor |
|---|---|
| Familia | **Source Sans 3** (SIL OFL; archivos `assets/types/SourceSans3-latin*.woff2`, variable 200 a 900). Pila: `'Source Sans 3', 'Adobe Clean', 'Trebuchet MS', system-ui, …` |
| Por qué | *Adobe Clean* es propietaria y solo se licencia para productos de Adobe; Source Sans 3 es la familia de código abierto de Adobe y se parece lo suficiente (humanista, limpia) |
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
4. **Sin íconos de aplicación de Adobe** ni capturas de producto sin licencia.
5. **Si Adobe pide menos parecido**, cambiar solo tokens: fondo `--night` en todo el sitio, Poppins (`assets/types` de Beyond) en lugar de Source Sans 3, botones con el degradado de CiiSA, y quitar el rojo (ver `styles-beyond.css`).

## 8. Accesibilidad

Contraste AA (texto negro sobre blanco; texto blanco sobre `--night`; texto gris `#4b4b4b` sobre blanco y `--gray-50`). Foco visible azul de 3 px, enlace "Ir al formulario" al inicio, un solo `h1`, `aria-live` en errores, `inputmode` y `autocomplete`, inputs de 17 px (evita el zoom de iOS) y el error no depende solo del color.

## 9. Cómo agregar algo nuevo

Usa los tokens. Agrega el CSS **al final** de `styles.css` en un bloque con comentario; documenta los componentes nuevos en la tabla de la sección 5 y revisa 1280, 800 y 375 px.
