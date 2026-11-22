(() => {
  'use strict';

  const grid = document.querySelector('#audiences .audience-grid');
  if (!grid) return;

  const cards = [...grid.children];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealed = new Set();
  const cardAt = target => target instanceof Element ? target.closest('.audience-grid > article') : null;
  let pointerCard;
  let touchCard;
  let latestPointer;
  let pointerFrame = 0;
  let touchTimer = 0;

  function positionSpotlight(card, event) {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--aurora-x', (event.clientX - bounds.left - bounds.width / 2) + 'px');
    card.style.setProperty('--aurora-y', (event.clientY - bounds.top - bounds.height / 2) + 'px');
  }

  function clearPointer() {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    latestPointer = undefined;
    pointerCard?.classList.remove('aurora-pointer');
    pointerCard = undefined;
  }

  function clearTouch() {
    clearTimeout(touchTimer);
    touchCard?.classList.remove('aurora-touch');
    touchCard = undefined;
  }

  grid.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType !== 'mouse') return;
    const card = cardAt(event.target);
    if (!card) return;
    if (pointerCard !== card) {
      clearPointer();
      pointerCard = card;
    }
    latestPointer = event;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      positionSpotlight(pointerCard, latestPointer);
      pointerCard.classList.add('aurora-pointer');
    });
  }, {passive: true});

  grid.addEventListener('pointerout', event => {
    if (event.pointerType === 'mouse' && pointerCard && cardAt(event.relatedTarget) !== pointerCard) {
      clearPointer();
    }
  }, {passive: true});

  grid.addEventListener('pointerdown', event => {
    if (motion.matches || event.pointerType === 'mouse' || !event.isPrimary) return;
    const card = cardAt(event.target);
    if (!card) return;
    clearTouch();
    touchCard = card;
    positionSpotlight(card, event);
    card.classList.add('aurora-touch');
    touchTimer = setTimeout(clearTouch, 580);
  }, {passive: true});

  grid.addEventListener('pointercancel', event => {
    if (event.isPrimary && event.pointerType !== 'mouse') clearTouch();
  }, {passive: true});

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    if (motion.matches) return;
    let order = 0;
    for (const entry of entries) {
      if (entry.intersectionRatio < .5 || revealed.has(entry.target)) continue;
      const card = entry.target;
      card.style.setProperty('--aurora-delay', order * 120 + 'ms');
      card.classList.add('aurora-drawn');
      revealed.add(card);
      observer.unobserve(card);
      order += 1;
    }
  }, {threshold: .5}) : null;

  function updateMotion() {
    if (motion.matches) {
      clearPointer();
      clearTouch();
      observer?.disconnect();
      return;
    }
    for (const card of cards) {
      if (!revealed.has(card)) observer?.observe(card);
    }
  }

  motion.addEventListener('change', updateMotion);
  updateMotion();
})();
