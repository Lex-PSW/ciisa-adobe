// Formulario de cotización de Adobe: validación por campo, botón apagado hasta que todo es válido y POST JSON a un flujo de Power Automate.
// Contrato completo en docs/ARQUITECTURA.md. Mientras ENDPOINT esté vacío, el formulario valida pero NO envía: muestra el aviso de respaldo (WhatsApp).
// La URL del flujo es una URL firmada: no la copies a documentos ni chats (queda en este archivo, como en Beyond).
(function () {
  'use strict';
  var ENDPOINT = 'https://default4699fbe477a74846ad709ce4e38413.35.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/20/workflows/c4ab6d8f8dca4b4caaaa131307ec9665/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3e0HarCJSmclaW2mlUvUqZjesuqElZ16nlsJzK1eJhM';   // URL firmada del disparador HTTP de AD-1. Si hay abuso, se regenera en Power Automate y se actualiza aquí
  var ORIGEN = 'landing-adobe';

  // Filtros estáticos contra datos de relleno (form-filtros.js, se carga antes). Sin ese archivo el formulario valida solo lo básico
  var F = window.AdobeFiltros || {};
  function filtro(campo, v, form) { return F[campo] ? F[campo](v, form) : ''; }

  var RULES = {
    nombre: function (v) {
      if (!v) return 'Escribe tu nombre y apellido.';
      if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(v)) return 'Usa solo letras.';
      if (v.split(/\s+/).filter(function (p) { return p.length >= 2; }).length < 2) return 'Incluye nombre y apellido.';
      return filtro('nombre', v);
    },
    empresa: function (v, el) { return v.length >= 2 ? filtro('empresa', v, el && el.form) : 'Escribe el nombre de tu empresa.'; },
    puesto: function (v, el) { return v.length >= 2 ? filtro('puesto', v, el && el.form) : 'Escribe tu puesto.'; },
    correo: function (v) {
      if (!v) return 'Escribe tu correo.';
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) return 'Revisa el formato: nombre@empresa.com';
      return filtro('correo', v);
    },
    telefono: function (v) {
      if (!v) return 'Escribe tu teléfono.';
      if (!/^[+\d\s().-]+$/.test(v)) return 'Usa solo números.';
      var d = v.replace(/\D/g, '');
      if (d.length < 10) return 'Debe tener al menos 10 dígitos.';
      if (d.length > 13) return 'Tiene demasiados dígitos.';
      return filtro('telefono', v);
    },
    mensaje: function (v) { return filtro('mensaje', v); },
    sector: function (v) { return v ? '' : 'Elige el tipo de organización.'; },
    interes: function (v) { return v ? '' : 'Elige qué te interesa.'; },
    cantidad: function (v) { return v ? '' : 'Elige una opción.'; },
    privacidad: function (v, el) { return el.checked ? '' : 'Debes aceptar el Aviso de Privacidad.'; }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-adobe-form]');
    if (!form) return;
    var button = form.querySelector('[data-adobe-submit]'), label = form.querySelector('[data-adobe-label]');
    var status = form.querySelector('[data-adobe-status]'), thanks = document.querySelector('[data-adobe-thanks]');
    var base = label ? label.textContent : '', sending = false, names = Object.keys(RULES);
    form.setAttribute('novalidate', '');

    // Tiempo mínimo de llenado: un bot completa el formulario en menos de un segundo. Se cuenta desde la primera interacción; si se envía antes de
    // MIN_LLENADO_MS se pide revisar y reintentar (no se descarta en silencio, por si el navegador autocompletó todo de golpe)
    var MIN_LLENADO_MS = 3500, t0 = 0;
    ['focusin', 'input', 'change'].forEach(function (ev) { form.addEventListener(ev, function () { if (!t0) t0 = Date.now(); }); });

    function wrap(el) { return el.closest('.field'); }
    function check(name, show) {
      var el = form.elements[name], msg = RULES[name](el.type === 'checkbox' ? '' : String(el.value || '').trim(), el), err = document.getElementById('e-' + name);
      if (show) {
        el.setAttribute('aria-invalid', msg ? 'true' : 'false');
        wrap(el).classList.toggle('is-invalid', !!msg); wrap(el).classList.toggle('is-valid', !msg);
        if (err) err.textContent = msg;
      }
      return !msg;
    }
    function refresh() { var ok = names.every(function (n) { return check(n, false); }); button.disabled = !ok || sending; return ok; }
    names.forEach(function (n) {
      var el = form.elements[n], touched = false;
      el.addEventListener('blur', function () { touched = true; check(n, true); refresh(); });
      el.addEventListener('input', function () { if (touched) check(n, true); refresh(); });
      el.addEventListener('change', function () { touched = true; check(n, true); refresh(); });
    });
    function setStatus(msg, err) { status.textContent = msg || ''; status.classList.toggle('is-error', !!err); }
    function busy(b) { sending = b; if (label) label.textContent = b ? 'Enviando…' : base; refresh(); }

    // Campaña de origen: la captura tracking.js (UTM, identificadores de clic, fuente y procedencia). Sin ese archivo, todo viaja vacío
    function campana() {
      var t = window.AdobeTracking, u = t ? t.getUtm() : {}, out = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'li_fat_id', 'fbclid', 'ttclid'].forEach(function (k) { out[k] = u[k] || ''; });
      out.fuente = t ? t.getFuente() : 'Directo';
      out.procedencia = t ? t.getReferrer() : '';
      return out;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); setStatus('');
      var ok = names.map(function (n) { return check(n, true); }).every(Boolean);
      if (!ok || sending) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
      if (form.website && form.website.value) { show(form.nombre.value); return; }          // campo trampa lleno = bot: se finge éxito
      if (!t0 || Date.now() - t0 < MIN_LLENADO_MS) { setStatus('Un momento: revisa tus datos y vuelve a enviar.'); return; }
      var data = {
        nombre: form.nombre.value.trim(), empresa: form.empresa.value.trim(), puesto: form.puesto.value.trim(),
        correo: form.correo.value.trim().toLowerCase(), telefono: form.telefono.value.trim(),
        sector: form.sector.value, interes: form.interes.value, cantidad: form.cantidad.value, mensaje: (form.mensaje.value || '').trim(),
        privacidad: 'Aceptado', marketing: form.marketing && form.marketing.checked ? 'Sí' : 'No', fecha: new Date().toISOString(), origen: ORIGEN, pagina: location.origin + location.pathname
      };
      var u = campana(); for (var k in u) data[k] = u[k];
      if (!ENDPOINT) { setStatus('El envío en línea aún no está activo. Escríbenos por WhatsApp y te atendemos de inmediato.', true); return; }
      busy(true);
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (res) { if (!res.ok) { var err = new Error('HTTP ' + res.status); err.status = res.status; throw err; } show(data.nombre); document.dispatchEvent(new CustomEvent('adobe:lead')); })
        .catch(function (err) {
          // 429: el flujo llegó a su límite de envíos por hora; se pide esperar o escribir por WhatsApp en vez del error genérico
          setStatus(err && err.status === 429 ? 'Estamos recibiendo muchas solicitudes en este momento. Inténtalo de nuevo en unos minutos o escríbenos por WhatsApp.' : 'No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.', true);
        })
        .then(function () { busy(false); });
    });

    function show(nombre) {
      var first = String(nombre || '').trim().split(/\s+/)[0] || '', slot = thanks.querySelector('[data-adobe-name]');
      if (slot) slot.textContent = first;
      // El agradecimiento es mucho más bajo que el formulario: se fija el alto de la caja antes del cambio para que la sección no se
      // encoja ni la página salte, y el mensaje queda centrado dentro. Sin scroll forzado: solo si la caja quedó fuera de la vista
      var box = form.parentNode, r = box.getBoundingClientRect();
      box.style.minHeight = Math.ceil(r.height) + 'px'; box.classList.add('is-done');
      form.hidden = true; thanks.hidden = false; thanks.focus({ preventScroll: true });
      if (r.top < 0 || r.bottom > window.innerHeight) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    refresh();
  });
})();
