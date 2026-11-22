(() => {
  'use strict';
  const header = document.getElementById('header');
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const heroLead = document.querySelector('.hero-lead');
  if (heroLead && !motionReduced.matches) {
    const original = document.createElement('span');
    const preview = document.createElement('span');
    const typed = document.createElement('span');
    const caret = document.createElement('span');
    const remaining = document.createElement('span');
    const text = heroLead.textContent;
    original.textContent = text;
    preview.setAttribute('aria-hidden', 'true');
    caret.className = 'hero-lead-caret';
    remaining.className = 'hero-lead-remaining';
    remaining.textContent = text;
    preview.append(typed, caret, remaining);
    heroLead.replaceChildren(original, preview);
    heroLead.classList.add('is-typing');

    const started = performance.now();
    let shown = 0;
    function typeHeroLead(now) {
      const next = Math.floor((now - started) / 28);
      if (motionReduced.matches || next >= text.length) {
        heroLead.replaceChildren(text);
        heroLead.classList.remove('is-typing');
        return;
      }
      if (shown !== next) {
        shown = next;
        typed.textContent = text.slice(0, shown);
        remaining.textContent = text.slice(shown);
      }
      requestAnimationFrame(typeHeroLead);
    }
    requestAnimationFrame(typeHeroLead);
  }

  const overview = document.querySelector('.overview-grid');
  if (overview && 'IntersectionObserver' in window && !motionReduced.matches) {
    const counters = Array.from(overview.querySelectorAll('[data-count]'), node => {
      const label = node.textContent;
      return {node, target: Number(label), decimals: (label.split('.')[1] ?? '').length};
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (motionReduced.matches) return;
      const started = performance.now();
      function render(now) {
        const progress = motionReduced.matches ? 1 : Math.min(1, (now - started) / 1350);
        const eased = 1 - (1 - progress) ** 2;
        for (const {node, target, decimals} of counters) {
          node.textContent = (target * eased).toFixed(decimals);
        }
        if (progress < 1) requestAnimationFrame(render);
      }
      render(started);
    }, {threshold: .25});
    observer.observe(overview);
  }

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

})();
