(() => {
  'use strict';
  const header = document.getElementById('header');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  setupSolutionStory(document.querySelector('.solution-story'));

  function setupSolutionStory(story) {
    if (!story || !CSS.supports('position', 'sticky')) return;
    const stage = story.querySelector('.solution-list');
    const toggle = story.querySelector('.solution-motion-toggle');
    let optedIn = false;

    function updateToggle() {
      toggle.hidden = !motionReduced.matches;
      toggle.textContent = optedIn ? 'Matikan animasi kartu' : 'Aktifkan animasi kartu';
    }
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
      updateToggle();
      if (!motionReduced.matches || optedIn) {
        const inset = Math.ceil(header?.getBoundingClientRect().bottom ?? 0) + 18;
        const available = document.documentElement.clientHeight - inset;
        story.classList.add('solution-story-stacked');
        const height = Math.max(...cards.map(card => card.offsetHeight));
        if (available >= height + 12 && height > 0) {
          const step = Math.round(Math.max(162, Math.min(270, height * .9)));
          story.style.setProperty('--solution-sticky-top', inset + 'px');
          story.style.setProperty('--solution-travel', Math.round(step * (cards.length - .65)) + 'px');
          geometry = {height, step, start: story.getBoundingClientRect().top + window.scrollY + (toggle.hidden ? 0 : toggle.offsetHeight + 16) - inset};
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
    window.addEventListener('load', queueResize, {once: true});
    document.fonts?.ready.then(queueResize);
    toggle.addEventListener('click', () => {
      optedIn = !optedIn;
      resize();
    });
    motionReduced.addEventListener('change', () => {
      optedIn = false;
      resize();
    });
    resize();
  }
})();
