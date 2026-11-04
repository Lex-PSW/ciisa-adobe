// Aviso y preferencias de cookies de CiiSA + Adobe.
// - Dos categorías opcionales, ambas apagadas hasta que la persona elija: medición (analytics_storage de Google) y publicidad
//   (ad_storage, ad_user_data, ad_personalization y los píxeles de Meta, LinkedIn y TikTok que carga tracking.js).
// - La elección se guarda en localStorage ('adobe:cookies', 12 meses). El valor inicial de Google ya lo fija el <head> de index.html
//   (Consent Mode v2); aquí solo se actualiza cuando la persona decide.
// - Avisa a los demás scripts con el evento 'adobe:consent' y expone window.AdobeConsent.get().
(function () {
  'use strict';
  var KEY = 'adobe:cookies', VIGENCIA = 365 * 24 * 60 * 60 * 1000, OCULTO = 'adobe:cookies-oculto';

  function leer() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    return s && s.v === 1 && Date.now() - s.t < VIGENCIA ? s : null;
  }
  function guardar(m, p) { try { localStorage.setItem(KEY, JSON.stringify({ v: 1, m: !!m, p: !!p, t: Date.now() })); } catch (e) {} }
  function estado() { var s = leer(); return { decidido: !!s, medicion: !!(s && s.m), publicidad: !!(s && s.p) }; }
  window.AdobeConsent = { get: estado };

  function avisar() {
    var e = estado(), m = e.medicion ? 'granted' : 'denied', p = e.publicidad ? 'granted' : 'denied';
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: m, ad_storage: p, ad_user_data: p, ad_personalization: p });
    document.dispatchEvent(new CustomEvent('adobe:consent', { detail: e }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    var box = document.querySelector('[data-cookies]'), tab = document.querySelector('[data-cookies-tab]');
    if (!box || !tab) return;
    var vistas = {}, sMed = box.querySelector('[data-ck-medicion]'), sPub = box.querySelector('[data-ck-publicidad]'), cierre = 0, origen = null;
    box.querySelectorAll('[data-ck-vista]').forEach(function (v) { vistas[v.getAttribute('data-ck-vista')] = v; });
    var elegir = box.querySelector('[data-ck="elegir"]');

    function ver(nombre, enfocar) {
      Object.keys(vistas).forEach(function (k) { vistas[k].hidden = k !== nombre; });
      if (elegir) elegir.setAttribute('aria-expanded', nombre === 'detalle' ? 'true' : 'false');
      if (enfocar) { var t = vistas[nombre].querySelector('.ck__t'); if (t) t.focus({ preventScroll: true }); }
    }
    function abrir(desdePersona) {
      clearTimeout(cierre);
      var e = estado();
      sMed.checked = e.medicion; sPub.checked = e.publicidad;
      box.hidden = false; tab.hidden = true;   // primero visible: un elemento oculto no puede recibir el foco
      ver(e.decidido ? 'detalle' : 'resumen', desdePersona);
      try { sessionStorage.removeItem(OCULTO); } catch (x) {}
    }
    function cerrar(devolverFoco) {
      box.hidden = true;
      tab.hidden = estado().decidido;
      if (devolverFoco) { var el = origen && document.contains(origen) && !origen.hidden ? origen : (tab.hidden ? document.querySelector('.foot__cookies') : tab); if (el) el.focus({ preventScroll: true }); }
    }
    function decidir(m, p) {
      guardar(m, p); avisar();
      ver('listo');
      cierre = setTimeout(function () { cerrar(false); }, 3800);
    }

    box.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-ck]'); if (!b) return;
      var a = b.getAttribute('data-ck');
      if (a === 'todo') decidir(true, true);
      else if (a === 'rechazar') decidir(false, false);
      else if (a === 'guardar') decidir(sMed.checked, sPub.checked);
      else if (a === 'elegir') { var e = estado(); sMed.checked = e.medicion; sPub.checked = e.publicidad; ver('detalle', true); }
      else if (a === 'volver') { if (estado().decidido) cerrar(true); else ver('resumen', true); }
      else if (a === 'ocultar') {
        try { if (!estado().decidido) sessionStorage.setItem(OCULTO, '1'); } catch (x) {}
        clearTimeout(cierre); cerrar(true);
      }
    });
    box.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { clearTimeout(cierre); cerrar(true); } });

    // Los dos puntos de entrada fuera de la tarjeta: la pestaña "Cookies" y el enlace del pie
    document.querySelectorAll('[data-ck="abrir"]').forEach(function (b) {
      b.addEventListener('click', function () { origen = b; abrir(true); });
    });

    // Primera visita: la tarjeta aparece sola, sin robar el foco, cuando ya pasó la pantalla de carga. Si la persona la ocultó antes en
    // esta sesión sin decidir, solo queda la pestaña
    if (!estado().decidido) {
      var oculto = false; try { oculto = sessionStorage.getItem(OCULTO) === '1'; } catch (x) {}
      if (oculto) tab.hidden = false; else setTimeout(function () { abrir(false); }, 1400);
    }
  });
})();
