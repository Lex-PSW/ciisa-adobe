// Confirmación de correo: lee el token de la liga (?t=) y lo manda por POST al flujo AD-2 de Power Automate cuando la persona hace clic.
// Contrato completo en docs/ARQUITECTURA.md. Mientras ENDPOINT esté vacío no se envía nada y se muestra el estado de error.
// La URL del flujo es una URL firmada: no la copies a documentos ni chats (queda en este archivo, como en adobe-form.js).
(function () {
  'use strict';
  var ENDPOINT = '';   // <- pegar aquí la URL del disparador HTTP de AD-2 (no subirla al commit)
  var ORIGEN = 'landing-adobe';

  var root = document.getElementById('val');
  var estados = root.querySelectorAll('[data-estado]');
  var delUrl = (new URLSearchParams(location.search).get('t') || '').trim().toLowerCase();

  // El token sale de la barra de direcciones: no se queda en el historial ni se comparte al copiar la dirección
  if (history.replaceState) history.replaceState(null, '', location.pathname);

  // Para que recargar la página no pierda la liga, el token se guarda un rato en este navegador (localStorage) y se borra solo al vencer
  // la vigencia. Es corta a propósito: en una computadora compartida el token no debe quedarse. Cambia VIGENCIA_MIN si hace falta.
  var CLAVE = 'adobe-validar-t', VIGENCIA_MIN = 30;
  function guardar(t) { try { localStorage.setItem(CLAVE, JSON.stringify({ t: t, vence: Date.now() + VIGENCIA_MIN * 60000 })); } catch (e) { /* sin almacenamiento: solo se pierde el refresco */ } }
  function recuperar() {
    try {
      var d = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (d && typeof d.t === 'string' && d.vence > Date.now()) return d.t;
      localStorage.removeItem(CLAVE);
    } catch (e) { /* dato dañado o sin acceso: se ignora */ }
    return '';
  }
  var token = delUrl || recuperar();
  if (delUrl) guardar(delUrl);

  // Tono de la página según el estado: éxito (verde CiiSA), aviso (naranja del degradado verde → rojo) y error (rojo Adobe)
  var TONO = { listo: 'neutro', espera: 'neutro', ok: 'exito', ya: 'exito', vencido: 'aviso', invalido: 'aviso', error: 'error' };
  var barra = document.getElementById('barra');

  function mostrar(nombre) {
    document.body.setAttribute('data-tono', TONO[nombre] || 'neutro');
    if (nombre === 'espera') iniciarBarra();
    for (var i = 0; i < estados.length; i++) estados[i].hidden = estados[i].getAttribute('data-estado') !== nombre;
    root.setAttribute('aria-busy', nombre === 'espera' ? 'true' : 'false');
    var h = root.querySelector('[data-estado="' + nombre + '"] h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  // Barra de progreso: sube sola hasta el 88 % mientras el flujo responde y se llena al llegar la respuesta, justo antes de cambiar de pantalla
  function iniciarBarra() { barra.style.transition = 'none'; barra.style.width = '0'; void barra.offsetWidth; barra.style.transition = ''; barra.style.width = '88%'; }
  function llenarYMostrar(nombre) { barra.style.transition = 'width .3s ease-out'; barra.style.width = '100%'; setTimeout(function () { mostrar(nombre); }, 360); }

  function textoEspera(t, p) { document.getElementById('espera-t').textContent = t; document.getElementById('espera-p').textContent = p; }

  // Un token válido es un GUID (36 caracteres: hex y guiones); cualquier otra cosa ni se manda al flujo
  var formatoOk = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(token);
  if (!formatoOk) { mostrar('invalido'); return; }
  mostrar('listo');

  function confirmar() {
    if (!ENDPOINT) { mostrar('error'); return; }
    textoEspera('Confirmando…', 'Un momento, estamos registrando tu confirmación.');
    mostrar('espera');
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ origen: ORIGEN, token: token }) })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          // Solo un 200 con ok: true cuenta como éxito; un 200 con ok: false (error mal etiquetado por el flujo) cae en el estado de error
          if (res.status === 200 && body.ok === true) {
            // El flujo puede devolver solo el primer nombre; se pone con textContent, nunca como HTML
            var primer = String(body.nombre || '').trim().split(/\s+/)[0] || '';
            var slots = root.querySelectorAll('[data-nombre]');
            for (var i = 0; i < slots.length; i++) slots[i].textContent = primer ? ', ' + primer : '';
            return llenarYMostrar(body.estado === 'ya_validado' ? 'ya' : 'ok');
          }
          if (res.status === 410) return llenarYMostrar('vencido');
          if (res.status === 400 || res.status === 404) return llenarYMostrar('invalido');
          llenarYMostrar('error');
        });
      })
      .catch(function () { llenarYMostrar('error'); });
  }

  document.getElementById('confirmar').addEventListener('click', confirmar);
  document.getElementById('reintentar').addEventListener('click', confirmar);
})();
