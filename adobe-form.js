// Formulario de cotización de Adobe: validación por campo, botón apagado hasta que todo es válido y POST JSON a un flujo de Power Automate.
// Contrato completo en docs/ARQUITECTURA.md. Mientras ENDPOINT esté vacío, el formulario valida pero NO envía: muestra el aviso de respaldo (WhatsApp).
// La URL del flujo es una URL firmada: no la copies a documentos ni chats (queda en este archivo, como en Beyond).
(function () {
  'use strict';
  var ENDPOINT = '';   // <- pegar aquí la URL del disparador HTTP del flujo (ver docs/HANDOFF.md, sección 6)
  var ORIGEN = 'landing-adobe';

  var RULES = {
    nombre: function (v) {
      if (!v) return 'Escribe tu nombre y apellido.';
      if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(v)) return 'Usa solo letras.';
      if (v.split(/\s+/).filter(function (p) { return p.length >= 2; }).length < 2) return 'Incluye nombre y apellido.';
      return '';
    },
    empresa: function (v) { return v.length >= 2 ? '' : 'Escribe el nombre de tu empresa.'; },
    puesto: function (v) { return v.length >= 2 ? '' : 'Escribe tu puesto.'; },
    correo: function (v) {
      if (!v) return 'Escribe tu correo.';
      return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v) ? '' : 'Revisa el formato: nombre@empresa.com';
    },
    telefono: function (v) {
      if (!v) return 'Escribe tu teléfono.';
      if (!/^[+\d\s().-]+$/.test(v)) return 'Usa solo números.';
      var d = v.replace(/\D/g, '');
      if (d.length < 10) return 'Debe tener al menos 10 dígitos.';
      if (d.length > 13) return 'Tiene demasiados dígitos.';
      return '';
    },
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

    // Campaña de origen: UTM de la URL, guardadas en la sesión para no perderlas si navegan por el sitio
    function utm() {
      var out = {}, keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'], q = new URLSearchParams(location.search), saved = {};
      try { saved = JSON.parse(sessionStorage.getItem('adobe:utm') || '{}'); } catch (e) {}
      keys.forEach(function (k) { if (q.get(k)) saved[k] = q.get(k); out[k] = saved[k] || ''; });
      try { sessionStorage.setItem('adobe:utm', JSON.stringify(saved)); } catch (e) {}
      return out;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); setStatus('');
      var ok = names.map(function (n) { return check(n, true); }).every(Boolean);
      if (!ok || sending) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
      if (form.website && form.website.value) { show(form.nombre.value); return; }          // campo trampa lleno = bot: se finge éxito
      var data = {
        nombre: form.nombre.value.trim(), empresa: form.empresa.value.trim(), puesto: form.puesto.value.trim(),
        correo: form.correo.value.trim().toLowerCase(), telefono: form.telefono.value.trim(),
        sector: form.sector.value, interes: form.interes.value, cantidad: form.cantidad.value, mensaje: (form.mensaje.value || '').trim(),
        privacidad: 'Aceptado', marketing: form.marketing && form.marketing.checked ? 'Sí' : 'No', fecha: new Date().toISOString(), origen: ORIGEN, pagina: location.origin + location.pathname
      };
      var u = utm(); for (var k in u) data[k] = u[k];
      if (!ENDPOINT) { setStatus('El envío en línea aún no está activo. Escríbenos por WhatsApp y te atendemos de inmediato.', true); return; }
      busy(true);
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); show(data.nombre); document.dispatchEvent(new CustomEvent('adobe:lead')); })
        .catch(function () { setStatus('No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.', true); })
        .then(function () { busy(false); });
    });

    function show(nombre) {
      var first = String(nombre || '').trim().split(/\s+/)[0] || '', slot = thanks.querySelector('[data-adobe-name]');
      if (slot) slot.textContent = first;
      form.hidden = true; thanks.hidden = false; thanks.focus();
      thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    refresh();
  });
})();
