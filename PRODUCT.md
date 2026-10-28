# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Responsables de comunicación, marketing, diseño, TI, compras y administración de empresas y de entidades de gobierno (principalmente en Nuevo León y Coahuila) que evalúan **Adobe**: aplicaciones creativas, documentos y firma electrónica, IA generativa y experiencia de cliente. Llegan por campañas, por la fuerza comercial de CiiSA o desde ciisa.com. Conocen a CiiSA o la están evaluando; el sitio la presenta brevemente.

## Product Purpose

Landing de soluciones **CiiSA + Adobe** en un subdominio propio (`adobe.ciisa.com`, por confirmar). Explica qué ofrece CiiSA en Adobe (cuatro soluciones de Adobe, tres sectores —empresas, gobierno y educación— y los servicios de CiiSA) y **lleva al formulario de cotización**. **Éxito = solicitudes de cotización enviadas.**

## Positioning

CiiSA acompaña la **adopción** de Adobe: asesoría gratuita en licenciamiento, adaptación a empresas, gobierno y educación, implementación y soporte. El sitio mimetiza la claridad visual de Adobe (tema claro, titulares muy pesados, botones en píldora) y firma como CiiSA (hero oscuro con resplandor, degradado de acento, lockup con CiiSA primero), sin copiar adobe.com.

## Operating Context

- Una sola página con scroll: hero → cifras → `#soluciones` → `#sectores` → `#por-que-ciisa` → `#soluciones-ciisa` → `#proceso` → `#cotiza` (formulario) → pie.
- Hero: en escritorio la animación de mosaicos va a la derecha del texto; en tablet y móvil (≤ 1024 px) va arriba del texto y del CTA, en tamaño compacto. Se pausa fuera de pantalla y con `prefers-reduced-motion` solo hace un fundido. Cada mosaico lleva una ilustración (verdes: ideas de CiiSA; rojos: ideas de Adobe).
- Ilustraciones propias en las tarjetas (SVG con loop seamless al verse y al hover). La tarjeta de Creative Cloud muestra el top 4 de apps y un botón que despliega las 12; el panel va debajo de las cuatro columnas en escritorio y debajo de la tarjeta en tablet y móvil.
- El formulario manda JSON a un flujo de Power Automate (`origen: "landing-adobe"` + UTM). Sin endpoint, valida pero no envía y muestra el teléfono de respaldo.
- Sin backend propio; sitio estático en GitHub Pages.

## Capabilities and Constraints

- HTML/CSS/JS vanilla, sin build ni framework (no agregar sin preguntar).
- Tipografía **Poppins**, la oficial de CiiSA (código abierto, como en CiiSA Beyond). No usar *Adobe Clean* (propietaria).
- Sin imágenes ni capturas de Adobe sin licencia; ilustración propia. Los íconos de app de producto solo en su archivo oficial de socio, sin modificar ni recolorear, junto al nombre del producto (ver `docs/DESIGN.md`).
- No inventar precios, planes, promociones, certificaciones, testimonios ni casos de éxito. Todo dato sale de `docs/CONTENIDO.md`.

## Brand Commitments

- Marca que opera el sitio: **CiiSA**. Solo como acento (nunca texto en degradado sobre blanco).
- **Paleta de acento decidida por el equipo (27 oct 2026):** solo **verde CiiSA `#bcf200` y rojo Adobe `#eb1000`**. Se quitan el menta de PSW (`#01fbce`) y el azul (`#00ccff`) de todos los degradados y ornamentos: texto `.grad`, subrayados, barras, puntos, mosaicos y resplandores. Degradado: `#bcf200 → #eb1000 → #bcf200`. Sustituye al orden `#bcf200 → #01fbce → #00ccff` de CiiSA Beyond.
- **Mapa tonal (28 oct 2026):** el único negro es el navy del logo (`#001c71`); verde y rojo tienen rampas hacia el navy y el tope claro es blanco. Detalle en `docs/DESIGN.md`.
- Rojo Adobe (`#eb1000`) como acento: el punto del kicker, los mosaicos rojos, los resplandores y el degradado. No se usa en botones.
- El ícono "A" de Adobe **no se usa** como adorno ni como favicon (la guía de marca de socios lo prohíbe); el favicon es el isotipo de CiiSA.
- Los logotipos de Adobe no se alteran, animan ni rodean de efectos; solo versiones de una tinta.
- Adobe **autorizó por escrito** el uso de su marca, logotipo y estilo, según confirmó el equipo. Las condiciones exactas de uso y la leyenda legal siguen las indicaciones de esa autorización (`docs/HANDOFF.md` aún lo marca como pendiente: actualizarlo y archivar el documento).
- CiiSA tiene un **nivel de partner con Adobe confirmado**. El nombre del nivel no está registrado aquí: no se nombra en el sitio hasta asentarlo, con el documento que lo respalde, en `docs/CONTENIDO.md`.

## Product Principles

1. Cada decisión de arriba del pliegue y de CTA optimiza la solicitud de cotización.
2. Hablar de resultados (menos papel, trámites más ágiles, contenido más rápido), no de fichas técnicas.
3. Un solo CTA principal; el resto de enlaces solo lleva al formulario o a una solución.
4. Lo que no se puede afirmar con evidencia (nombre del nivel de partner, cumplimiento normativo, validez legal) se redacta de forma neutral y se valida antes de publicar.

## Evidence on Hand

- Cifras de CiiSA y contenido de cada sección: `docs/CONTENIDO.md` (origen de cada dato).
- Autorización de uso de marca y nivel de partner de Adobe: confirmados por el equipo; falta archivar el documento y registrar el nombre del nivel.
- Ausentes, no fabricar: casos de éxito, testimonios, logotipos de clientes, precios, planes y promociones.

## Accessibility & Inclusion

Cumplir **WCAG 2.2 AA**: contraste mínimo 4.5:1 en texto, foco visible, uso completo con teclado y respeto a `prefers-reduced-motion` (aplica a toda animación). Parte del público es de entidades de gobierno que pueden exigirlo.
