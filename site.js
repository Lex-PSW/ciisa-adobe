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
})();
