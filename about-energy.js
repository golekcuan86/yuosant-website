(() => {
  'use strict';
  const about = document.getElementById('about');
  if (!about || !('IntersectionObserver' in window)) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(([entry]) => {
    const visible = !motion.matches && entry.intersectionRatio >= .18;
    if (visible) about.classList.add('about-energy-seen');
    about.classList.toggle('about-energy-in-view', visible);
  }, {threshold: .18});

  function updateMotion() {
    if (motion.matches) {
      observer.disconnect();
      about.classList.remove('about-energy-in-view', 'about-energy-seen');
    } else {
      observer.observe(about);
    }
  }

  motion.addEventListener('change', updateMotion);
  updateMotion();
})();
