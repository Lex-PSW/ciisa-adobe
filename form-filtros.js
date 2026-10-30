// Filtros estáticos del formulario: reglas fijas, sin servicios externos, para frenar datos de relleno (teclazos, placeholders, números de ejemplo,
// correos temporales, insultos). Devuelven '' si el valor pasa o un mensaje cortés si no. Son una primera barrera del lado del navegador: se
// pueden saltar, así que la validación real vive en el flujo de Power Automate (docs/ARQUITECTURA.md). Se usan desde adobe-form.js.
(function (root) {
  'use strict';

  // Los correos personales (Gmail, Hotmail, etc.) se aceptan a propósito: quien cotiza puede escribir desde uno. Lo que se frena es el NOMBRE del
  // correo cuando es relleno, burla o insulto (pendejo123@, troll.master@, tuputamadre@), no el proveedor.

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
  // Palabras de burla o relleno que, como palabra suelta del nombre del correo, delatan un correo falso
  var CORREO_TROLL = ['troll', 'trolo', 'fake', 'falso', 'falsa', 'mentira', 'spam', 'spammer', 'basura', 'nadie', 'noexiste', 'anonimo', 'jajaja', 'jejeje', 'jijiji',
    'hitler', 'nazi', 'sinnombre', 'nombrefalso', 'correofalso', 'mailfalso', 'nosequeponer'];
  // Frases pegadas (tuputamadre, correofalso): se buscan como fragmento, pero solo cadenas largas para no confundir con palabras normales (computadora, disputa)
  var CORREO_PEGADOS = ['putamadre', 'hijodeputa', 'chingatumadre', 'chingatu', 'vetealamierda', 'hijueputa', 'pendejadas', 'noexiste', 'nosequeponer', 'sinnombre',
    'correofalso', 'mailfalso', 'nombrefalso', 'correofake', 'mailfake', 'fakemail', 'fakecorreo'];
  // Errores de dominio al teclear (no son trolls: son personas reales). Se sugiere el correcto en vez de dejar que el correo rebote
  var DOMINIO_ERRADO = { 'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmil.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com',
    'gamil.com': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cmo': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com', 'hotnail.com': 'hotmail.com', 'hormail.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com', 'outlook.con': 'outlook.com', 'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
    'iclod.com': 'icloud.com', 'icloud.con': 'icloud.com', 'live.con': 'live.com' };
  // Terminaciones que no existen y casi siempre son un .com mal tecleado
  var TLD_ERRADO = ['con', 'cmo', 'ocm', 'vom', 'comm', 'coom'];
  var CORREO_DOMINIO = ['example.com', 'example.org', 'example.net', 'ejemplo.com', 'test.com', 'test.test', 'asdf.com', 'correo.com', 'email.com', 'mailinator.com',
    'yopmail.com', 'guerrillamail.com', 'sharklasers.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'trashmail.com', 'throwawaymail.com',
    'dispostable.com', 'getnada.com', 'maildrop.cc', 'fakeinbox.com', 'mailnesia.com', 'guerrillamail.net', 'guerrillamail.org', 'grr.la', 'spam4.me', 'tempmailo.com',
    'tempail.com', 'emailondeck.com', 'mohmal.com', 'mintemail.com', 'fakemail.net', 'burnermail.io', 'mail.tm', 'moakt.com', 'tmpmail.org', 'discard.email',
    'trashmail.net', 'yopmail.net', 'yopmail.fr', 'jetable.org', 'nada.email', 'inboxkitten.com', 'mytemp.email', 'mailcatch.com', 'spambox.us', 'temp-mail.io',
    'tempr.email', 'dropmail.me', 'emltmp.com'];

  function teclado(s) { var l = letras(s); return TECLADO.some(function (t) { return l.indexOf(t) > -1; }); }
  // Sílaba de 2 o 3 letras repetida 3 veces seguidas (jajaja, lololo, asasas): en un nombre, empresa o puesto casi siempre es relleno
  function silabas(s) { return /(.{2,3})\1{2,}/.test(letras(s)); }
  function repetido(s) { return /([a-z0-9])\1{3,}/.test(norm(s).replace(/\s+/g, '')); }
  function contiene(lista, s) { return palabras(s).some(function (w) { return lista.indexOf(w) > -1; }); }
  // Cinco dígitos seguidos que suben o bajan de uno en uno (12345, 98765)
  function escalera(d) {
    var sube = 1, baja = 1, i, p;
    for (i = 1; i < d.length; i++) {
      p = Number(d[i]) - Number(d[i - 1]);
      sube = p === 1 ? sube + 1 : 1;
      baja = p === -1 ? baja + 1 : 1;
      if (sube >= 5 || baja >= 5) return true;
    }
    return false;
  }
  function valorRelleno(s) { return VALOR_RELLENO.indexOf(norm(s).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()) > -1; }

  var F = {
    nombre: function (v) {
      var msg = 'Escribe tu nombre y apellido reales para que podamos atenderte.', ws = palabras(v);
      if (valorRelleno(v) || contiene(RELLENO, v) || contiene(INSULTOS, v)) return msg;
      if (teclado(v) || repetido(v) || silabas(v)) return msg;
      if (letras(v).length < 4) return msg;
      if (ws.length > 1 && ws[0] === ws[ws.length - 1]) return msg;
      // Una palabra de 3 letras o más sin vocales, o con 6 consonantes seguidas, casi siempre es un teclazo
      if (ws.some(function (w) { return w.length >= 3 && !/[aeiouy]/.test(w); })) return msg;
      if (ws.some(function (w) { return /[bcdfghjklmnpqrstvwxz]{6,}/.test(w); })) return msg;
      return '';
    },
    empresa: function (v, form) {
      var msg = 'Escribe el nombre real de tu empresa o institución.';
      if ((norm(v).match(/[a-z]/g) || []).length < 2) return msg;
      if (valorRelleno(v) || contiene(RELLENO, v) || contiene(INSULTOS, v) || teclado(v) || repetido(v) || silabas(v)) return msg;
      var p = form && form.elements && form.elements.puesto;
      if (p && norm(p.value).trim() && norm(p.value).trim() === norm(v).trim()) return msg;
      return '';
    },
    puesto: function (v, form) {
      var msg = 'Escribe tu puesto real.';
      if ((norm(v).match(/[a-z]/g) || []).length < 2) return msg;
      if (valorRelleno(v) || contiene(RELLENO, v) || contiene(INSULTOS, v) || teclado(v) || repetido(v) || silabas(v)) return msg;
      var e = form && form.elements && form.elements.empresa;
      if (e && norm(e.value).trim() && norm(e.value).trim() === norm(v).trim()) return msg;
      return '';
    },
    correo: function (v) {
      var msg = 'Usa tu correo real: ese correo parece de relleno, de ejemplo o temporal.', c = norm(v), i = c.lastIndexOf('@');
      if (i < 1) return '';
      // Se ignora la etiqueta tras "+" (nombre+loquesea@dominio): la elige la persona y no dice nada de su nombre real
      var local = c.slice(0, i).split('+')[0], dominio = c.slice(i + 1);
      var tld = dominio.slice(dominio.lastIndexOf('.') + 1), sug = DOMINIO_ERRADO[dominio] || (TLD_ERRADO.indexOf(tld) > -1 ? dominio.slice(0, dominio.lastIndexOf('.')) + '.com' : '');
      if (sug) return '¿Quisiste decir ' + String(v).trim().slice(0, String(v).trim().lastIndexOf('@')) + '@' + sug + '? Revisa el dominio de tu correo.';
      if (CORREO_DOMINIO.indexOf(dominio) > -1 || CORREO_LOCAL.indexOf(local) > -1) return msg;
      if (repetido(local) || teclado(local) || silabas(local)) return msg;
      // Palabras sueltas del nombre del correo (separadas por punto, guion, guion bajo o números): insultos, relleno y burlas
      var partes = local.replace(/[^a-z]+/g, ' ').trim().split(' ').filter(Boolean), plano = partes.join('');
      if (partes.some(function (p) { return INSULTOS.indexOf(p) > -1 || RELLENO.indexOf(p) > -1 || CORREO_TROLL.indexOf(p) > -1; })) return msg;
      if (CORREO_PEGADOS.some(function (p) { return plano.indexOf(p) > -1; })) return msg;
      if (plano.length >= 6 && !/[aeiouy]/.test(plano)) return msg;
      // Solo números: se rechaza si es una escalera (12345) o un dígito repetido (111111)
      var solo = local.replace(/[^a-z0-9]/g, '');
      if (/^\d{5,}$/.test(solo) && (escalera(solo) || /(\d)\1{3,}/.test(solo))) return msg;
      return '';
    },
    telefono: function (v) {
      var msg = 'Revisa tu teléfono: parece incompleto o de ejemplo.', d = String(v || '').replace(/\D/g, ''), n = d.slice(-10), k, i;
      if (n.length < 10) return '';
      if (n[0] === '0' || n[0] === '1') return msg;
      if (/(\d)\1{5}/.test(n)) return msg;
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
