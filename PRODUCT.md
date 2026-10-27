# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Responsables de comunicación, marketing, diseño, TI, compras y administración de empresas y de entidades de gobierno (principalmente en Nuevo León y Coahuila) que evalúan **Adobe**: aplicaciones creativas, documentos y firma electrónica, IA generativa y experiencia de cliente. Llegan por campañas, por la fuerza comercial de CiiSA o desde ciisa.com. Conocen a CiiSA o la están evaluando; el sitio la presenta brevemente.

## Product Purpose

Landing de soluciones **CiiSA + Adobe** en un subdominio propio (`adobe.ciisa.com`, por confirmar). Explica qué ofrece CiiSA en Adobe (cuatro soluciones, sector público, servicio) y **lleva al formulario de cotización**. **Éxito = solicitudes de cotización enviadas.**

## Positioning

CiiSA acompaña la **adopción** de Adobe: asesoría gratuita en licenciamiento, adaptación al sector público y privado, implementación y soporte. El sitio mimetiza la claridad visual de Adobe (tema claro, titulares muy pesados, botones en píldora) y firma como CiiSA (hero oscuro con resplandor, degradado de acento, lockup con CiiSA primero), sin copiar adobe.com.

## Operating Context

- Una sola página con scroll: hero → cifras → `#soluciones` → `#gobierno` → `#por-que-ciisa` → `#proceso` → `#cotiza` (formulario) → pie.
- El formulario manda JSON a un flujo de Power Automate (`origen: "landing-adobe"` + UTM). Sin endpoint, valida pero no envía y muestra el teléfono de respaldo.
- Sin backend propio; sitio estático en GitHub Pages.

## Capabilities and Constraints

- HTML/CSS/JS vanilla, sin build ni framework (no agregar sin preguntar).
- Tipografía **Source Sans 3** (código abierto). No usar *Adobe Clean* (propietaria).
- Sin imágenes, íconos de aplicación ni capturas de Adobe sin licencia; ilustración propia.
- No inventar precios, planes, promociones, certificaciones, testimonios ni casos de éxito. Todo dato sale de `docs/CONTENIDO.md`.

## Brand Commitments

- Marca que opera el sitio: **CiiSA**. Todo degradado respeta el orden fijo `#bcf200 → #01fbce → #00ccff`, y solo como acento (nunca texto sobre blanco).
- Rojo Adobe (`#eb1000`) solo como acento puntual; no se mezcla con el degradado ni se usa en botones.
- Los logotipos de Adobe no se alteran, animan ni rodean de efectos; solo versiones de una tinta.
- **El estilo y el logotipo de Adobe requieren autorización de Adobe antes de publicar** (`docs/HANDOFF.md`).

## Product Principles

1. Cada decisión de arriba del pliegue y de CTA optimiza la solicitud de cotización.
2. Hablar de resultados (menos papel, trámites más ágiles, contenido más rápido), no de fichas técnicas.
3. Un solo CTA principal; el resto de enlaces solo lleva al formulario o a una solución.
4. Lo que no se puede afirmar con evidencia (alianza, cumplimiento normativo, validez legal) se redacta de forma neutral y se valida antes de publicar.
