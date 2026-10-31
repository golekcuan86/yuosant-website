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
   cards.forEach((card, i) => {
     card.classList.toggle('is-active', i === active);
     card.classList.toggle('is-prev', i === (active - 1 + cards.length) % cards.length);
     card.classList.toggle('is-next', i === (active + 1) % cards.length);
   });
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


// Ecosystem dropdown: click/tap toggle with outside-click and Escape support.
(() => {
  const dropdown = document.querySelector('.nav-dropdown');
  const button = document.querySelector('.nav-dropdown-toggle');
  if (!dropdown || !button) return;
  const setOpen = (open) => {
    dropdown.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
  };
  button.addEventListener('click', (event) => {
    event.preventDefault();
    setOpen(!dropdown.classList.contains('open'));
  });
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      button.focus();
    }
  });
  dropdown.querySelectorAll('.nav-submenu a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
})();


// Living Crystal: subtle desktop parallax for the background artwork and its light field.
// The supplied image remains unchanged; motion is deliberately small and disabled for reduced-motion users.
(() => {
  const hero = document.querySelector('.hero');
  if (!hero || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let frame = 0;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  const onMove = (event) => {
    const bounds = hero.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * -12;
    targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const tick = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    hero.style.setProperty('--crystal-parallax-x', currentX.toFixed(2) + 'px');
    hero.style.setProperty('--crystal-parallax-y', currentY.toFixed(2) + 'px');
    if (Math.abs(targetX-currentX) > 0.08 || Math.abs(targetY-currentY) > 0.08) {
      frame = requestAnimationFrame(tick);
    } else {
      frame = 0;
    }
  };
  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', () => {
    targetX = 0; targetY = 0;
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });
})();
