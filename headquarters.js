(() => {
  'use strict';
  const header = document.getElementById('header');
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const carousel = document.getElementById('product-carousel');
  const cards = carousel ? [...carousel.querySelectorAll('.product-card')] : [];
  const counter = document.getElementById('carousel-count');
  const rail = document.getElementById('carousel-progress');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => motionReduced.matches ? 'instant' : 'smooth';

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  setHeader();
  window.addEventListener('scroll', setHeader, {passive: true});

  function closeMenu() {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Buka navigasi');
  }
  menu?.addEventListener('click', () => {
    const opened = nav?.classList.toggle('open') ?? false;
    menu.setAttribute('aria-expanded', String(opened));
    menu.setAttribute('aria-label', opened ? 'Tutup navigasi' : 'Buka navigasi');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      closeMenu();
      menu?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (nav?.classList.contains('open') && !header?.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); }, {passive: true});

  function selectedCardIndex() {
    if (!carousel || !cards.length) return 0;
    const left = carousel.scrollLeft;
    return cards.reduce((closest, card, index) =>
      Math.abs(card.offsetLeft - cards[closest].offsetLeft - left) <
      Math.abs(cards[closest].offsetLeft - cards[closest].offsetLeft - left)
        ? index : closest, 0);
  }
  // Track the nearest scroll-snap card using its offset within the carousel.
  function nearestIndex() {
    if (!carousel || !cards.length) return 0;
    const origin = cards[0].offsetLeft;
    const left = carousel.scrollLeft;
    return cards.reduce((best, card, index) => (
      Math.abs(card.offsetLeft - origin - left) <
      Math.abs(cards[best].offsetLeft - origin - left) ? index : best
    ), 0);
  }
  function updateCarousel() {
    if (!cards.length) return;
    const i = nearestIndex();
    if (counter) counter.textContent = String(i + 1).padStart(2,'0') + ' / ' + String(cards.length).padStart(2,'0');
    if (rail) rail.style.width = ((i + 1) / cards.length * 100) + '%';
  }
  function move(step) {
    if (!carousel || !cards.length) return;
    const origin = cards[0].offsetLeft;
    const index = Math.min(cards.length - 1, Math.max(0, nearestIndex() + step));
    carousel.scrollTo({ left: cards[index].offsetLeft - origin, behavior: scrollBehavior() });
  }
  document.getElementById('carousel-prev')?.addEventListener('click', () => move(-1));
  document.getElementById('carousel-next')?.addEventListener('click', () => move(1));
  carousel?.addEventListener('scroll', updateCarousel, {passive:true});
  carousel?.addEventListener('keydown', event => {
    if (event.target !== carousel) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  updateCarousel();
})();