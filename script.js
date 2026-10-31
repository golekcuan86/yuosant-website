const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

toggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open') ?? false;
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
  });
});

// Progressive reveal: content stays visible when JavaScript or motion is unavailable.
const revealTargets = document.querySelectorAll('.manifesto-main, .manifesto-aside, .ecosystem-top, .feature-copy, .feature-visual, .about-title, .about-copy');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((el) => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach((el) => observer.observe(el));
}


// Touch-friendly horizontal ecosystem coverflow.
(() => {
 const track = document.querySelector('.ecosystem-track');
 if (!track) return;
 const cards = [...track.querySelectorAll('.ecosystem-feature')];
 const prev = document.querySelector('.carousel-prev');
 const next = document.querySelector('.carousel-next');
 const current = document.querySelector('.carousel-current');
 const progress = document.querySelector('.carousel-progress i');
 let active = 0;
 const goTo = (index) => {
   active = (index + cards.length) % cards.length;
   const card = cards[active];
   track.scrollTo({left: card.offsetLeft - (track.clientWidth-card.clientWidth)/2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
   update();
 };
 const update = () => {
   const center = track.scrollLeft + track.clientWidth / 2;
   let nearest = 0, distance = Infinity;
   cards.forEach((card, i) => {
     const d = Math.abs(card.offsetLeft + card.clientWidth/2 - center);
     if (d < distance) { distance = d; nearest = i; }
   });
   active = nearest;
   cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
   if (current) current.textContent = String(active + 1).padStart(2, '0');
   if (progress) progress.style.width = ((active + 1) / cards.length * 100) + '%';
 };
 prev?.addEventListener('click', () => goTo(active - 1));
 next?.addEventListener('click', () => goTo(active + 1));
 track.addEventListener('scroll', () => requestAnimationFrame(update), {passive:true});
 track.addEventListener('keydown', (event) => {
   if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1); }
   if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1); }
 });
 window.addEventListener('resize', update, {passive:true});
 update();
})();
