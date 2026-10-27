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
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 80 + 'ms';
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
