// Comportamiento general de la landing: aparición al hacer scroll y sombra de la barra. Sin dependencias.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Aparición escalonada al entrar en pantalla (se omite con prefers-reduced-motion; sin JS todo se ve)
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, sibs = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (c) { return c.classList.contains('reveal'); }) : [];
      el.style.transitionDelay = 200 + Math.min(sibs.indexOf(el), 5) * 140 + 'ms';
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

// Pausa la animación del hero cuando no está en pantalla (ahorra CPU/batería)
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (entries) {
    hero.classList.toggle('is-off', !entries[0].isIntersecting);
  }).observe(hero);
})();

// Parallax al hacer scroll: cada [data-parallax="v"] recibe --py (px) según su distancia al centro de la pantalla.
// v>0 se mueve más lento que el scroll (fondo); solo se calcula lo visible y se omite con prefers-reduced-motion.
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (!els.length || !('IntersectionObserver' in window)) return;
  var visible = new Set(), ticking = false;
  function update() {
    ticking = false;
    var mid = window.innerHeight / 2;
    visible.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var py = -(r.top + r.height / 2 - mid) * parseFloat(el.getAttribute('data-parallax'));
      el.style.setProperty('--py', Math.max(-140, Math.min(140, py)).toFixed(1));
    });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
    request();
  }, { rootMargin: '20% 0px' });
  els.forEach(function (el) { io.observe(el); });
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  // Si la página cambia de alto sin scroll (se abre o cierra el panel de apps, cargan fuentes), las posiciones cambian: se recalcula
  // el parallax en ese momento y se vuelve a calcular cuando termina la animación de apertura del panel
  if ('ResizeObserver' in window) new ResizeObserver(request).observe(document.body);
  var apps = document.getElementById('apps-cc');
  if (apps) apps.addEventListener('animationend', request);
})();

// Cielo del hero y del formulario: estrellas, constelaciones (líneas entre estrellas cercanas y hacia el cursor),
// destellos de cuatro puntas en verde CiiSA y rojo Adobe, y adornos (círculo, cuadrado, cruz) que recuerdan el logo de CiiSA.
// Un canvas por sección; se pausa fuera de pantalla o con la pestaña oculta; con prefers-reduced-motion dibuja un solo cuadro.
(function () {
  var skies = [].slice.call(document.querySelectorAll('.sky'));
  if (!skies.length || !window.HTMLCanvasElement) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GREEN = '188,242,0', RED = '248,105,86', WHITE = '255,255,255', MIST = '165,181,212';

  skies.forEach(function (sky) {
    var cv = sky.querySelector('canvas'), host = sky.parentNode, ctx = cv.getContext('2d');
    if (!ctx) return;
    var w = 0, h = 0, stars = [], sparks = [], orns = [], ptr = null, raf = 0, last = 0, visible = true, link = 110;

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

    function seed() {
      var n = Math.round(Math.min(95, Math.max(26, (w * h) / 15000)));
      link = w < 640 ? 84 : 112;
      stars = []; sparks = []; orns = [];
      for (var i = 0; i < n; i++) {
        stars.push({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-6, 6), vy: rnd(-5, 5), r: rnd(0.9, 2.1), ph: rnd(0, 6.28), sp: rnd(0.6, 1.8),
          c: Math.random() < 0.7 ? WHITE : (Math.random() < 0.5 ? MIST : (Math.random() < 0.5 ? GREEN : RED)) });
      }
      for (var s = 0; s < (w < 640 ? 6 : 11); s++) {
        sparks.push({ x: rnd(0.04 * w, 0.96 * w), y: rnd(0.06 * h, 0.94 * h), s: rnd(9, 18), ph: rnd(0, 6.28), sp: rnd(0.5, 1.1), c: s % 2 ? GREEN : RED });
      }
      for (var o = 0; o < (w < 640 ? 4 : 8); o++) {
        orns.push({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-4, 4), vy: rnd(-4, 4), s: rnd(9, 22), rot: rnd(0, 6.28), vr: rnd(-0.12, 0.12),
          t: pick(['circle', 'square', 'plus', 'circle', 'square']), c: o % 2 ? GREEN : RED });
      }
    }

    function size() {
      var r = host.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(); draw(0);
    }

    function star4(x, y, s, a, c) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, s * 2.4);
      g.addColorStop(0, 'rgba(' + c + ',' + (0.35 * a) + ')'); g.addColorStop(1, 'rgba(' + c + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 2.4, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(' + c + ',' + a + ')'; ctx.beginPath();
      ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s * 0.7, y); ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s * 0.7, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
    }

    function orn(o, a) {
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot);
      ctx.strokeStyle = 'rgba(' + o.c + ',' + a + ')'; ctx.lineWidth = 1.4; ctx.beginPath();
      if (o.t === 'circle') ctx.arc(0, 0, o.s / 2, 0, 6.2832);
      else if (o.t === 'square') ctx.rect(-o.s / 2, -o.s / 2, o.s, o.s);
      else { ctx.moveTo(-o.s / 2, 0); ctx.lineTo(o.s / 2, 0); ctx.moveTo(0, -o.s / 2); ctx.lineTo(0, o.s / 2); }
      ctx.stroke(); ctx.restore();
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      var i, j, a, b, d, al;
      ctx.lineWidth = 1;
      for (i = 0; i < stars.length; i++) {
        a = stars[i];
        for (j = i + 1; j < stars.length; j++) {
          b = stars[j]; d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) { al = (1 - d / link) * 0.36; ctx.strokeStyle = 'rgba(' + MIST + ',' + al + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        if (ptr) {
          d = Math.hypot(a.x - ptr.x, a.y - ptr.y);
          if (d < link * 1.4) { al = (1 - d / (link * 1.4)) * 0.4; ctx.strokeStyle = 'rgba(' + GREEN + ',' + al + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ptr.x, ptr.y); ctx.stroke(); }
        }
      }
      for (i = 0; i < stars.length; i++) {
        a = stars[i]; al = 0.55 + 0.4 * Math.sin(t * a.sp + a.ph);
        ctx.fillStyle = 'rgba(' + a.c + ',' + al + ')'; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }
      for (i = 0; i < orns.length; i++) orn(orns[i], 0.6);
      for (i = 0; i < sparks.length; i++) {
        a = sparks[i]; al = Math.max(0, Math.sin(t * a.sp + a.ph)); star4(a.x, a.y, a.s * (0.45 + 0.55 * al), 0.25 + 0.7 * al, a.c);
      }
    }

    function step(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
      var i, p;
      for (i = 0; i < stars.length; i++) { p = stars[i]; p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < -4) p.x = w + 4; else if (p.x > w + 4) p.x = -4; if (p.y < -4) p.y = h + 4; else if (p.y > h + 4) p.y = -4; }
      for (i = 0; i < orns.length; i++) { p = orns[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; if (p.x < -30) p.x = w + 30; else if (p.x > w + 30) p.x = -30; if (p.y < -30) p.y = h + 30; else if (p.y > h + 30) p.y = -30; }
      draw(now / 1000);
      raf = requestAnimationFrame(step);
    }
    function start() { if (!reduce && !raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(step); } }

    size();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(host); else window.addEventListener('resize', size);
    if (reduce) return;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; host.classList.toggle('is-off', !visible); if (visible) start(); }).observe(host);
    }
    document.addEventListener('visibilitychange', start);
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      host.addEventListener('mousemove', function (e) { var r = host.getBoundingClientRect(); ptr = { x: e.clientX - r.left, y: e.clientY - r.top }; });
      host.addEventListener('mouseleave', function () { ptr = null; });
    }
    start();
  });
})();

// Ilustraciones de las tarjetas: se incrustan como SVG para poder animarlas. Cada una hace un ciclo completo y sin saltos
// (empieza y termina en el mismo estado) la primera vez que se ve y cada vez que se pasa el cursor o se enfoca su tarjeta.
// Si algo falla (sin fetch, abierto como archivo), se queda la imagen normal.
(function () {
  var imgs = [].slice.call(document.querySelectorAll('img.soln__art, img.sector__art, img.benef__art'));
  if (!imgs.length || !window.fetch) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var n = 0;

  function play(svg) {
    if (reduce) return;
    svg.classList.remove('is-playing');
    void svg.getBoundingClientRect(); // reinicia la animación aunque ya estuviera corriendo
    svg.classList.add('is-playing');
    clearTimeout(svg._t);
    svg._t = setTimeout(function () { svg.classList.remove('is-playing'); }, 3400); // todas las animaciones duran menos que esto
  }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.55 }) : null;

  imgs.forEach(function (img) {
    fetch(img.getAttribute('src')).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (txt) {
      var i = ++n;
      txt = txt.replace(/<\?xml[^>]*\?>/, '').replace(/<style[\s\S]*?<\/style>/g, '');
      // ids únicos por ilustración, para que los degradados y recortes de una no pisen a otra
      var ids = (txt.match(/\sid="[^"]+"/g) || []).map(function (s) { return s.slice(5, -1); });
      ids.forEach(function (id) { txt = txt.split('id="' + id + '"').join('id="' + id + '-i' + i + '"').split('url(#' + id + ')').join('url(#' + id + '-i' + i + ')'); });
      var host = document.createElement('div');
      host.innerHTML = txt.trim();
      var svg = host.firstElementChild;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg') return;
      svg.setAttribute('class', (img.getAttribute('class') || '') + ' ill');
      svg.setAttribute('data-ill', (img.getAttribute('src') || '').split('/').pop().replace('.svg', ''));
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      // capa móvil: todo menos defs, fondo y resplandor; el resplandor respira aparte
      var layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      layer.setAttribute('class', 'ill__layer');
      [].slice.call(svg.children).forEach(function (el) {
        var fill = el.getAttribute('fill') || '';
        if (el.nodeName.toLowerCase() === 'defs') return;
        if (fill.indexOf('url(#bg') === 0) return;
        if (fill.indexOf('url(#gl') === 0 || fill.indexOf('url(#h') === 0 && el.nodeName.toLowerCase() !== 'path' && !el.getAttribute('class')) { el.setAttribute('class', 'ill__glow'); return; }
        layer.appendChild(el);
      });
      svg.appendChild(layer);
      // escalonado: cada grupo de elementos entra con su propio ritmo (todo cabe dentro del ciclo de 2.8 s)
      function stagger(sel, step, mod) { [].slice.call(svg.querySelectorAll(sel)).forEach(function (el, k) { el.style.setProperty('--ad', ((mod ? k % mod : k) * step).toFixed(2) + 's'); }); }
      stagger('.tw', 0.15, 6); stagger('.k-pop', 0.12, 6); stagger('.draw', 0.1, 5); stagger('.k-bar', 0.09, 5); stagger('.k-sheet', 0.18, 3);
      [].slice.call(svg.querySelectorAll('.k-trk, .k-knob')).forEach(function (el, k) { el.style.setProperty('--ad', (Math.floor(k / 2) * 0.5).toFixed(2) + 's'); });
      img.replaceWith(svg);
      var card = svg.closest('.soln, .gov__col, .benef li');
      if (card) {
        card.addEventListener('mouseenter', function () { play(svg); });
        card.addEventListener('focusin', function () { play(svg); });
      }
      if (io) io.observe(svg);
    }).catch(function () { /* se queda la imagen */ });
  });
})();

// Botón "Ver todas las apps" de la tarjeta de Creative Cloud: muestra u oculta el panel con todas las apps
(function () {
  var btn = document.querySelector('[data-apps-toggle]');
  var panel = btn && document.getElementById(btn.getAttribute('aria-controls'));
  if (!btn || !panel) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var label = btn.querySelector('span');
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    label.textContent = open ? 'Ver todas las apps' : 'Ocultar las apps';
    panel.hidden = open;
    if (!open && panel.scrollIntoView) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  });
})();
