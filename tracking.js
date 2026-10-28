// Seguimiento de campañas de CiiSA + Adobe. Adaptado de tracking.js de CiiSA Beyond.
// - Píxeles de Meta (Facebook/Instagram), LinkedIn Insight Tag y TikTok: se cargan solo si su ID
//   está configurado abajo. Sin ID no se carga nada de ese proveedor (estado actual: ninguno).
// - Google (GA4 / Google Ads) irá por Google Tag Manager: este archivo empuja eventos al dataLayer
//   para crear ahí las etiquetas. El contenedor de GTM no está instalado en index.html: falta el ID (docs/HANDOFF.md).
// - Captura UTM e identificadores de clic de la URL para que la cotización guarde de qué campaña vino.
// A los píxeles nunca se les envían datos personales (nombre, correo, teléfono).
(function () {
  var CONFIG = {
    META_PIXEL_ID: '',                // Administrador de eventos de Meta → ID del píxel (solo números)
    LINKEDIN_PARTNER_ID: '',          // Campaign Manager → Insight Tag → Partner ID
    LINKEDIN_LEAD_CONVERSION_ID: '',  // Campaign Manager → Conversiones → ID de la conversión de cotización
    TIKTOK_PIXEL_ID: ''               // TikTok Ads Manager → Eventos → ID del píxel
  };

  window.dataLayer = window.dataLayer || [];

  /* ---------- UTM / identificadores de clic ---------- */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'li_fat_id', 'fbclid', 'ttclid'];
  var STORE_KEY = 'adobe:utm';

  function readStore() {
    try { return JSON.parse(sessionStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function captureUtm() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    UTM_KEYS.forEach(function (k) { var v = params.get(k); if (v) found[k] = v.slice(0, 200); });
    // Solo se reemplaza lo guardado si esta visita trae parámetros nuevos (conserva la campaña
    // aunque la persona navegue a una sección con #ancla y pierda la query).
    if (Object.keys(found).length) {
      try { sessionStorage.setItem(STORE_KEY, JSON.stringify(found)); } catch (e) {}
      return found;
    }
    return readStore();
  }
  var utm = captureUtm();

  /* ---------- Procedencia y fuente de la cotización ---------- */
  // Página de la que venía la persona al entrar (solo el dominio, sin la ruta). Se guarda la
  // primera de la sesión: al navegar por anclas o recargar ya no es externa.
  var REF_KEY = 'adobe:ref';
  function captureReferrer() {
    var host = '';
    try { host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
    var stored = '';
    try { stored = sessionStorage.getItem(REF_KEY) || ''; } catch (e) {}
    if (host && host !== location.hostname.replace(/^www\./, '') && !stored) {
      try { sessionStorage.setItem(REF_KEY, host); } catch (e) {}
      return host;
    }
    return stored;
  }
  var referrer = captureReferrer();

  // Fuente legible para el Excel maestro: primero los identificadores de anuncio, luego los UTM,
  // luego la página de procedencia; sin nada de eso, "Directo". Mismas etiquetas que Beyond
  // (más TikTok) para poder comparar las dos landings.
  function computeFuente() {
    var src = (utm.utm_source || '').toLowerCase();
    var med = (utm.utm_medium || '').toLowerCase();
    var paid = /cpc|ppc|paid|ads?$|display|sponsored/.test(med);
    if (utm.gclid || (src.indexOf('google') > -1 && paid)) return 'Google Ads';
    if (utm.li_fat_id || (src.indexOf('linkedin') > -1 && paid)) return 'LinkedIn Ads';
    if (utm.ttclid || (src.indexOf('tiktok') > -1 && paid)) return 'TikTok Ads';
    if (utm.fbclid || /facebook|instagram|meta|^(fb|ig)$/.test(src)) return paid ? 'Meta Ads' : 'Meta';
    if (/e-?mail|correo|newsletter/.test(med)) return 'Correo';
    if (src.indexOf('linkedin') > -1) return 'LinkedIn';
    if (src.indexOf('tiktok') > -1) return 'TikTok';
    if (src.indexOf('google') > -1) return 'Google';
    if (src) return utm.utm_source;
    var r = referrer;
    if (!r) return 'Directo';
    // Webmail antes que Google: mail.google.com es Gmail, no la búsqueda
    if (/(^|\.)mail\.|outlook\.|office\.com$|office365\.com$/.test(r)) return 'Correo';
    if (/(^|\.)google\./.test(r)) return 'Google (búsqueda)';
    if (/(^|\.)linkedin\.com$|^lnkd\.in$/.test(r)) return 'LinkedIn';
    if (/(^|\.)(facebook\.com|instagram\.com|fb\.me)$/.test(r)) return 'Meta';
    if (/(^|\.)tiktok\.com$/.test(r)) return 'TikTok';
    if (/^(t\.co|x\.com|twitter\.com)$/.test(r)) return 'X';
    if (/(^|\.)(bing\.com|duckduckgo\.com)$|(^|\.)yahoo\./.test(r)) return 'Otro buscador';
    return r;
  }

  /* ---------- Meta Pixel ---------- */
  if (CONFIG.META_PIXEL_ID) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', CONFIG.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* ---------- LinkedIn Insight Tag ---------- */
  if (CONFIG.LINKEDIN_PARTNER_ID) {
    window._linkedin_partner_id = CONFIG.LINKEDIN_PARTNER_ID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(CONFIG.LINKEDIN_PARTNER_ID);
    (function (l) {
      if (!l) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); }; window.lintrk.q = []; }
      var s = document.getElementsByTagName('script')[0];
      var b = document.createElement('script');
      b.type = 'text/javascript'; b.async = true;
      b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      s.parentNode.insertBefore(b, s);
    })(window.lintrk);
  }

  /* ---------- TikTok Pixel ---------- */
  if (CONFIG.TIKTOK_PIXEL_ID) {
    /* eslint-disable */
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load(CONFIG.TIKTOK_PIXEL_ID);ttq.page();
    }(window, document, 'ttq');
    /* eslint-enable */
  }

  /* ---------- Envío de eventos a todos los proveedores ---------- */
  function track(name, extra) {
    var payload = { event: 'adobe_' + name };
    Object.keys(utm).forEach(function (k) { payload[k] = utm[k]; });
    if (extra) Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });
    window.dataLayer.push(payload);

    var fbq = window.fbq, lintrk = window.lintrk, ttq = window.ttq;
    switch (name) {
      case 'cotizacion_completada':
        if (fbq) fbq('track', 'Lead', { content_name: 'CiiSA + Adobe' });
        if (lintrk && CONFIG.LINKEDIN_LEAD_CONVERSION_ID) lintrk('track', { conversion_id: Number(CONFIG.LINKEDIN_LEAD_CONVERSION_ID) });
        if (ttq && CONFIG.TIKTOK_PIXEL_ID) ttq.track('SubmitForm');
        break;
      case 'cotizacion_iniciada':
        if (fbq) fbq('trackCustom', 'InicioCotizacion');
        break;
      case 'cta_cotiza':
        if (fbq) fbq('trackCustom', 'ClicCotiza', extra || {});
        if (ttq && CONFIG.TIKTOK_PIXEL_ID) ttq.track('ClickButton');
        break;
      case 'whatsapp':
        if (fbq) fbq('track', 'Contact');
        if (ttq && CONFIG.TIKTOK_PIXEL_ID) ttq.track('Contact');
        break;
    }
  }

  // API mínima para otros scripts (adobe-form.js)
  window.AdobeTracking = {
    track: track,
    getUtm: function () { return utm; },
    getReferrer: function () { return referrer; },
    getFuente: computeFuente
  };

  document.addEventListener('DOMContentLoaded', function () {
    // Clics en los llamados a cotizar (nav, hero, "por qué CiiSA") y en WhatsApp (cualquier enlace con data-cta)
    document.querySelectorAll('a[data-cta]').forEach(function (a) {
      a.addEventListener('click', function () {
        var donde = a.getAttribute('data-cta');
        if (/^whatsapp/.test(donde) || /wa\.me/.test(a.href)) track('whatsapp', { ubicacion: donde });
        else track('cta_cotiza', { ubicacion: donde });
      });
    });

    // Primer campo del formulario que se toca = cotización iniciada (una sola vez)
    var form = document.querySelector('[data-adobe-form]');
    if (form) {
      var started = false;
      form.addEventListener('focusin', function () {
        if (started) return;
        started = true;
        track('cotizacion_iniciada');
      });
    }

    // Cotización enviada (lo emite adobe-form.js cuando Power Automate responde 200)
    document.addEventListener('adobe:lead', function () { track('cotizacion_completada'); });
  });
})();
