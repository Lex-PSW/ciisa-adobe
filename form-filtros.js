// Filtros estáticos del formulario: reglas fijas, sin servicios externos, para frenar datos de relleno (teclazos, placeholders, números de ejemplo,
// correos temporales, insultos). Devuelven '' si el valor pasa o un mensaje cortés si no. Son una primera barrera del lado del navegador: se
// pueden saltar, así que la validación real vive en el flujo de Power Automate (docs/ARQUITECTURA.md). Se usan desde adobe-form.js.
(function (root) {
  'use strict';

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function palabras(s) { return norm(s).split(/[^a-z0-9]+/).filter(Boolean); }
  function letras(s) { return norm(s).replace(/[^a-z]/g, ''); }

  // Secuencias de teclado que casi nunca aparecen en palabras reales
  var TECLADO = ['qwer', 'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'zxcv', 'xcvb', 'cvbn', 'vbnm', 'qazw', 'poiu', 'lkjh', 'mnbv'];
  // Palabras sueltas de relleno (se comparan palabra por palabra, no por fragmentos, para no castigar apellidos reales)
  var RELLENO = ['test', 'tests', 'testing', 'prueba', 'pruebas', 'asdf', 'qwerty', 'xxx', 'fulano', 'mengano', 'zutano', 'perengano', 'anonimo', 'anonymous',
    'ninguno', 'ninguna', 'nombre', 'apellido', 'usuario', 'ejemplo', 'example', 'lorem', 'ipsum'];
  // Valores completos que no son un nombre real de empresa o puesto
  var VALOR_RELLENO = ['na', 'n a', 'no aplica', 'ninguna', 'ninguno', 'nada', 'sin empresa', 'no tengo', 'x', 'xx', 'xxx', 'empresa', 'mi empresa', 'puesto',
    'mi puesto', 'nombre', 'nombre apellido', 'nombre y apellido', 'tu nombre', 'tu empresa', 'asdf', 'test', 'prueba', 'abc', 'abcd'];
  // Insultos inequívocos, solo como palabra completa
  var INSULTOS = ['puto', 'puta', 'putos', 'putas', 'pendejo', 'pendeja', 'pendejos', 'cabron', 'cabrona', 'chinga', 'chingada', 'chingado', 'verga', 'culero',
    'culera', 'mierda', 'mamon', 'idiota', 'imbecil', 'estupido', 'estupida', 'marica', 'hijueputa'];
  var CORREO_LOCAL = ['test', 'tests', 'prueba', 'pruebas', 'asdf', 'asd', 'qwerty', 'xxx', 'aaa', 'abc', 'correo', 'email', 'mail', 'nombre', 'fake', 'example',
    'ejemplo', 'nadie', 'ninguno', 'usuario', 'user', 'noreply', 'no-reply'];
  var CORREO_DOMINIO = ['example.com', 'example.org', 'example.net', 'ejemplo.com', 'test.com', 'test.test', 'asdf.com', 'correo.com', 'email.com', 'mailinator.com',
    'yopmail.com', 'guerrillamail.com', 'sharklasers.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'trashmail.com', 'throwawaymail.com',
    'dispostable.com', 'getnada.com', 'maildrop.cc', 'fakeinbox.com', 'mailnesia.com'];

  function teclado(s) { var l = letras(s); return TECLADO.some(function (t) { return l.indexOf(t) > -1; }); }
  function repetido(s) { return /([a-z0-9])\1{3,}/.test(norm(s).replace(/\s+/g, '')); }
  function contiene(lista, s) { return palabras(s).some(function (w) { return lista.indexOf(w) > -1; }); }
  function valorRelleno(s) { return VALOR_RELLENO.indexOf(norm(s).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()) > -1; }

  var F = {
    nombre: function (v) {
      var msg = 'Escribe tu nombre y apellido reales para que podamos atenderte.', ws = palabras(v);
      if (valorRelleno(v) || contiene(RELLENO, v) || contiene(INSULTOS, v)) return msg;
      if (teclado(v) || repetido(v)) return msg;
      if (ws.length > 1 && ws[0] === ws[ws.length - 1]) return msg;
      // Una palabra de 3 letras o más sin vocales, o con 6 consonantes seguidas, casi siempre es un teclazo
      if (ws.some(function (w) { return w.length >= 3 && !/[aeiouy]/.test(w); })) return msg;
      if (ws.some(function (w) { return /[bcdfghjklmnpqrstvwxz]{6,}/.test(w); })) return msg;
      return '';
    },
    empresa: function (v) {
      var msg = 'Escribe el nombre real de tu empresa o institución.';
      if ((norm(v).match(/[a-z]/g) || []).length < 2) return msg;
      if (valorRelleno(v) || contiene(RELLENO, v) || contiene(INSULTOS, v) || teclado(v) || repetido(v)) return msg;
      return '';
    },
    puesto: function (v) {
      var msg = 'Escribe tu puesto real.';
      if ((norm(v).match(/[a-z]/g) || []).length < 2) return msg;
      if (valorRelleno(v) || contiene(RELLENO, v) || contiene(INSULTOS, v) || teclado(v) || repetido(v)) return msg;
      return '';
    },
    correo: function (v) {
      var msg = 'Usa tu correo real de trabajo, no uno temporal ni de ejemplo.', c = norm(v), i = c.lastIndexOf('@');
      if (i < 1) return '';
      var local = c.slice(0, i), dominio = c.slice(i + 1);
      if (CORREO_DOMINIO.indexOf(dominio) > -1 || CORREO_LOCAL.indexOf(local) > -1) return msg;
      if (repetido(local) || teclado(local)) return msg;
      return '';
    },
    telefono: function (v) {
      var msg = 'Revisa tu teléfono: parece incompleto o de ejemplo.', d = String(v || '').replace(/\D/g, ''), n = d.slice(-10), k, i;
      if (n.length < 10) return '';
      if (n[0] === '0' || n[0] === '1') return msg;
      for (k = 1; k <= 5; k++) { if (n === n.slice(0, k).repeat(Math.ceil(10 / k)).slice(0, 10)) return msg; }
      var sube = 0, baja = 0;
      for (i = 0; i < 9; i++) {
        var paso = (Number(n[i + 1]) - Number(n[i]) + 10) % 10;
        if (paso === 1) sube++; else if (paso === 9) baja++;
      }
      if (sube >= 7 || baja >= 7) return msg;
      return '';
    },
    mensaje: function (v) {
      if (!v) return '';
      var msg = 'Escribe un mensaje claro, sin enlaces ni texto repetido, o déjalo en blanco.';
      if (contiene(INSULTOS, v) || teclado(v) || repetido(v)) return msg;
      if ((String(v).match(/(https?:\/\/|www\.)/gi) || []).length > 1) return msg;
      return '';
    }
  };

  root.AdobeFiltros = F;
  if (typeof module !== 'undefined' && module.exports) module.exports = F;
})(typeof window !== 'undefined' ? window : this);
