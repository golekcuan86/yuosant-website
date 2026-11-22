(() => {
  'use strict';

  const section = document.getElementById('user-stories');
  if (!section) return;
  const track = section.querySelector('.story-track');
  const cards = [...track.children];
  const controls = section.querySelector('.story-controls');
  const previous = controls.querySelector('[data-story-step="-1"]');
  const next = controls.querySelector('[data-story-step="1"]');
  const position = controls.querySelector('.story-position');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let firstIndex = 0;

  function update() {
    frame = 0;
    const left = track.scrollLeft;
    const right = left + track.clientWidth;
    const origin = cards[0].offsetLeft;
    const offsets = cards.map(card => card.offsetLeft - origin);
    firstIndex = offsets.reduce((nearest, offset, index) =>
      Math.abs(offset - left) < Math.abs(offsets[nearest] - left) ? index : nearest, 0);
    const lastIndex = offsets.findLastIndex(offset => offset < right - 2);
    const range = lastIndex > firstIndex ? (firstIndex + 1) + '–' + (lastIndex + 1) : String(firstIndex + 1);
    const label = range + ' / ' + cards.length;
    if (position.textContent !== label) position.textContent = label;
    previous.disabled = left <= 2;
    next.disabled = right >= track.scrollWidth - 2;
  }

  function move(direction) {
    update();
    const index = Math.max(0, Math.min(cards.length - 1, firstIndex + direction));
    track.scrollTo({left: cards[index].offsetLeft - cards[0].offsetLeft,
      behavior: reduced.matches ? 'instant' : 'smooth'});
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));

  function queueUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  track.addEventListener('scroll', queueUpdate, {passive: true});
  window.addEventListener('resize', queueUpdate, {passive: true});
  controls.hidden = false;
  update();
})();
