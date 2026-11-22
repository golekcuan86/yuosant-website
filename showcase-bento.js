(() => {
  const section = document.getElementById('ecosystem');
  const stage = section?.querySelector('#showcase-stage');
  if (!stage) return;
  const feature = stage.querySelector('.showcase-feature');
  const thumbs = stage.querySelector('.showcase-thumbs');
  const count = stage.querySelector('#carousel-count');
  const status = stage.querySelector('#showcase-status');
  const products = Array.from(section.querySelectorAll('.bento-card'), card => ({
    name: card.querySelector('h4').textContent.replace(/\.$/, ''),
    image: card.querySelector('.bento-art'),
    content: card.querySelector('.bento-content'),
    button: card.querySelector('.bento-select'),
  }));
  if (!products.length) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const wrap = index => (index + products.length) % products.length;
  const format = index => String(index).padStart(2, '0');
  let active = -1;

  // Reuse the product markup so the grid and spotlight always share the same destinations.
  function select(index, direction = 1) {
    const position = wrap(index);
    if (position === active) return;
    active = position;
    const product = products[active];
    const visual = document.createElement('div');
    visual.className = 'spotlight-visual';
    visual.setAttribute('aria-hidden', 'true');
    const scene = document.createElement('img');
    scene.className = 'spotlight-scene';
    scene.alt = '';
    scene.src = '/assets/showcase/cinematic-bento/' + format(active + 1) + '.webp';
    scene.decoding = 'async';
    const image = product.image.cloneNode();
    image.loading = 'eager';
    visual.append(scene, image);

    const copy = product.content.cloneNode(true);
    copy.classList.add('spotlight-copy');
    const label = document.createElement('h3');
    label.append(...copy.querySelector('h4').childNodes);
    copy.querySelector('h4').replaceWith(label);
    feature.style.setProperty('--slide-direction', direction);
    feature.replaceChildren(visual, copy);
    count.textContent = format(active + 1) + ' / ' + format(products.length);
    status.textContent = product.name + ', produk ' + (active + 1) + ' dari ' + products.length;
    products.forEach(({button}, i) => button.setAttribute('aria-pressed', String(i === active)));
    thumbnailButtons.forEach((button, i) => {
      const target = wrap(active + i + 1);
      button.dataset.index = target;
      button.setAttribute('aria-label', 'Tampilkan ' + products[target].name);
      const art = products[target].image.cloneNode();
      art.loading = 'lazy';
      button.replaceChildren(art);
    });
  }

  const thumbnailButtons = [0, 1].map(() => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-controls', feature.id);
    button.addEventListener('click', () => select(Number(button.dataset.index)));
    thumbs.append(button);
    return button;
  });
  products.forEach(({name, button}, index) => {
    button.setAttribute('aria-label', 'Tampilkan ' + name + ' di spotlight');
    button.hidden = false;
    button.addEventListener('click', () => {
      select(index);
      stage.focus({preventScroll: true});
      stage.scrollIntoView({block: 'start', behavior: motion.matches ? 'instant' : 'smooth'});
    });
  });

  const move = direction => select(active + direction, direction);
  stage.querySelector('#carousel-prev').addEventListener('click', () => move(-1));
  stage.querySelector('#carousel-next').addEventListener('click', () => move(1));
  stage.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    switch (event.key) {
      case 'ArrowLeft': move(-1); break;
      case 'ArrowRight': move(1); break;
      case 'Home': select(0, -1); break;
      case 'End': select(products.length - 1); break;
      default: return;
    }
    event.preventDefault();
  });

  let gesture;
  feature.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || !event.isPrimary || event.target.closest('a,button')) return;
    gesture = {id: event.pointerId, x: event.clientX, y: event.clientY};
    feature.setPointerCapture(event.pointerId);
  });
  feature.addEventListener('pointercancel', () => { gesture = undefined; });
  feature.addEventListener('pointerup', event => {
    if (gesture?.id !== event.pointerId) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.abs(x) >= 48 && Math.abs(x) > Math.abs(y) * 1.25) move(x < 0 ? 1 : -1);
  });

  select(0);
  stage.hidden = false;
})();
