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

  setupSolutionStory(document.querySelector('.solution-story'));

  function setupSolutionStory(story) {
    if (!story || !CSS.supports('position', 'sticky')) return;
    const stage = story.querySelector('.solution-list');
    const cards = Array.from(stage.children);
    const clamp = value => Math.max(0, Math.min(1, value));
    const smooth = value => value * value * (3 - 2 * value);
    const format = value => value.toFixed(3);
    let geometry;
    let frame = 0;
    let resizeFrame = 0;
    let lastPosition;

    function render() {
      frame = 0;
      if (!geometry) return;
      const scroll = window.scrollY - geometry.start;
      const position = Math.max(0, Math.min(cards.length - 1, scroll / geometry.step));
      const entrance = clamp(1 + scroll / 180);
      const state = position + entrance - 1;
      if (state === lastPosition) return;
      lastPosition = state;

      // The first card settles with one small overshoot. Later cards track scroll directly.
      const spring = 1 - (1 - entrance) ** 3 * Math.cos(entrance * 4.2);
      for (const [index, card] of cards.entries()) {
        const ahead = index - position;
        const arriving = clamp(ahead);
        const incoming = 1 - smooth(1 - arriving);
        const receding = smooth(clamp(-ahead));
        const firstOffset = index === 0 ? 1 - spring : 0;
        const y = incoming * (geometry.height + 18) + firstOffset * 52 - receding * 13;
        const opacity = (1 - smooth(clamp((arriving - .48) / .52)))
          * (1 - smooth(clamp((-ahead - 1.12) / .38)))
          * (index === 0 ? .5 + .5 * entrance : 1);
        const transform = 'translate3d(0,' + format(y) + 'px,' + format(-26 * receding) + 'px)'
          + ' rotateX(' + format(6 * receding) + 'deg)'
          + ' rotate(' + format(-3 * (arriving + firstOffset)) + 'deg)'
          + ' scale(' + format(1 - .045 * receding) + ')';
        card.style.transform = transform;
        card.style.opacity = format(opacity);
        card.style.setProperty('--solution-accent', format(1 - clamp(Math.abs(ahead))
          * (ahead > 0 ? 1 : 2)));
      }
    }

    function queueRender() {
      const scroll = window.scrollY - geometry.start;
      if ((lastPosition === -1 && scroll <= -180) ||
          (lastPosition === cards.length - 1 && scroll >= geometry.step * (cards.length - 1))) return;
      if (!frame) frame = requestAnimationFrame(render);
    }

    function resize() {
      resizeFrame = 0;
      const wasEnabled = Boolean(geometry);
      if (!motionReduced.matches) {
        const inset = Math.ceil(header?.getBoundingClientRect().bottom ?? 0) + 18;
        const available = Math.min(document.documentElement.clientHeight,
          window.visualViewport?.height ?? Infinity) - inset;
        story.classList.add('solution-story-stacked');
        const height = stage.offsetHeight;
        if (available >= height + 32 && height > 0) {
          const step = Math.round(Math.max(162, Math.min(270, height * .9)));
          story.style.setProperty('--solution-sticky-top', inset + 'px');
          story.style.setProperty('--solution-travel', Math.round(step * (cards.length - .65)) + 'px');
          geometry = {height, step, start: story.getBoundingClientRect().top + window.scrollY - inset};
          lastPosition = undefined;
          if (!wasEnabled) window.addEventListener('scroll', queueRender, {passive: true});
          if (frame) cancelAnimationFrame(frame);
          render();
          return;
        }
      }

      geometry = undefined;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      for (const card of cards) {
        card.style.removeProperty('transform');
        card.style.removeProperty('opacity');
        card.style.removeProperty('--solution-accent');
      }
      story.classList.remove('solution-story-stacked');
      story.style.removeProperty('--solution-travel');
      story.style.removeProperty('--solution-sticky-top');
      if (wasEnabled) window.removeEventListener('scroll', queueRender);
    }

    function queueResize() {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(resize);
    }

    window.addEventListener('resize', queueResize, {passive: true});
    window.visualViewport?.addEventListener('resize', queueResize, {passive: true});
    window.addEventListener('load', queueResize, {once: true});
    document.fonts?.ready.then(queueResize);
    motionReduced.addEventListener('change', queueResize);
    resize();
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
