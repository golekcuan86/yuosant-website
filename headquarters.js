(() => {
  'use strict';
  const header = document.getElementById('header');
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const carousel = document.getElementById('product-carousel');
  const cards = carousel ? [...carousel.querySelectorAll('.product-card')] : [];
  const selector = document.getElementById('product-selector');
  const productButtons = cards.map((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = card.dataset.productName;
    button.setAttribute('aria-controls', carousel.id);
    button.addEventListener('click', () => goTo(index));
    selector?.append(button);
    return button;
  });
  if (selector) selector.hidden = !productButtons.length;
  const previous = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');
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
  let activeIndex = -1;
  function updateCarousel() {
    if (!cards.length) return;
    const i = nearestIndex();
    if (i === activeIndex) return;
    activeIndex = i;
    productButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(i === index)));
    if (selector && selector.scrollWidth > selector.clientWidth) {
      const bounds = selector.getBoundingClientRect();
      const active = productButtons[i].getBoundingClientRect();
      const overflow = active.left < bounds.left
        ? active.left - bounds.left - 7
        : Math.max(0, active.right - bounds.right + 7);
      if (overflow) selector.scrollBy({left: overflow, behavior: 'instant'});
    }
    previous?.setAttribute('aria-disabled', String(i === 0));
    next?.setAttribute('aria-disabled', String(i === cards.length - 1));
    if (counter) counter.textContent = String(i + 1).padStart(2,'0') + ' / ' + String(cards.length).padStart(2,'0');
    if (rail) rail.style.width = ((i + 1) / cards.length * 100) + '%';
  }
  function goTo(index, behavior = scrollBehavior()) {
    if (!carousel || !cards.length) return;
    const origin = cards[0].offsetLeft;
    index = Math.min(cards.length - 1, Math.max(0, index));
    carousel.scrollTo({ left: cards[index].offsetLeft - origin, behavior });
  }
  const move = step => goTo(nearestIndex() + step);
  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));
  carousel?.addEventListener('scroll', updateCarousel, {passive:true});
  // Keep the chosen panel aligned when rotating a phone or resizing the window.
  if (carousel && 'ResizeObserver' in window) {
    let width = carousel.clientWidth;
    new ResizeObserver(() => {
      if (width === carousel.clientWidth) return;
      width = carousel.clientWidth;
      goTo(activeIndex, 'instant');
    }).observe(carousel);
  }
  carousel?.addEventListener('keydown', event => {
    if (event.target !== carousel || event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case 'ArrowLeft': move(-1); break;
      case 'ArrowRight': move(1); break;
      case 'Home': goTo(0); break;
      case 'End': goTo(cards.length - 1); break;
      default: return;
    }
    event.preventDefault();
  });
  updateCarousel();
})();
