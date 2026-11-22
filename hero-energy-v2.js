(() => {
  'use strict';
  const hero = document.getElementById('home');
  if (!hero || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(([entry]) => {
    hero.classList.toggle('hero-energy-running', entry.isIntersecting);
  });
  observer.observe(hero);
})();
