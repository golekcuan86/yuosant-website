/* =========================================================
   Yuosant Journal — home.js
   Hero carousel + seksi-seksi halaman beranda
   ========================================================= */
(function () {
  'use strict';
  var YJ = window.YJ, data = YJ.data;
  var qs = YJ.qs, qsa = YJ.qsa;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= HERO CAROUSEL ================= */
  var heroRoot = qs('#hero-slides');
  var heroArticles = data.articles.filter(function (a) { return a.hero; }).slice(0, 4);

  if (heroRoot && heroArticles.length) {
    var AUTOPLAY = 6500;
    var slidesHtml = heroArticles.map(function (a, i) {
      var au = YJ.author(a.author);
      return '' +
      '<article class="hero-slide" role="group" aria-roledescription="slide" aria-label="Slide ' + (i + 1) + ' dari ' + heroArticles.length + '" aria-hidden="' + (i === 0 ? 'false' : 'true') + '">' +
        '<div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 lg:py-16">' +
          '<div class="lg:col-span-7 order-2 lg:order-1 relative z-10">' +
            '<div class="rise d1 flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">' +
              '<span class="inline-block w-8 h-px bg-slate-400"></span>' +
              '<span>Sampul ' + String(i + 1).padStart(2, '0') + ' — ' + YJ.catLabel(a.category) + '</span>' +
            '</div>' +
            '<h2 class="rise d2 mt-4 font-display font-black tracking-tight leading-[1.04] text-[2.1rem] sm:text-5xl xl:text-[3.6rem] max-w-3xl">' +
              '<a href="' + YJ.articleUrl(a) + '" class="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">' + a.title + '</a>' +
            '</h2>' +
            '<p class="rise d3 mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl">' + a.excerpt + '</p>' +
            '<div class="rise d4 mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">' +
              '<a href="' + YJ.articleUrl(a) + '" class="hero-btn inline-flex items-center gap-2.5 bg-ink text-white dark:bg-white dark:text-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] font-medium">Baca Artikel ' + YJ.icon('arrow') + '</a>' +
              '<div class="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">' +
                '<img src="' + au.avatar + '" alt="Foto ' + au.name + '" width="30" height="30" class="rounded-full object-cover" style="width:30px;height:30px">' +
                '<span><span class="font-medium text-neutral-800 dark:text-neutral-200">' + au.name + '</span><br><span>' + YJ.formatDate(a.date) + ' · ' + a.readTime + ' mnt baca</span></span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="lg:col-span-5 order-1 lg:order-2 relative">' +
            '<a href="' + YJ.articleUrl(a) + '" class="block relative border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 overflow-hidden aspect-[16/10] lg:aspect-[4/3] shadow-editorial">' +
              '<img ' + YJ.fimg(a, 1200, 900) + ' alt="' + a.imgAlt + '" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' class="hero-img w-full h-full object-cover">' +
              '<span class="absolute bottom-3 left-3 bg-ink/90 dark:bg-white/95 text-white dark:text-ink font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1">' + YJ.formatDate(a.date) + '</span>' +
            '</a>' +
            '<span aria-hidden="true" class="hidden lg:block absolute -top-5 -right-3 font-mono text-xs tracking-[0.3em] text-slate-400 dark:text-slate-500">' + String(i + 1).padStart(2, '0') + ' / ' + String(heroArticles.length).padStart(2, '0') + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
    heroRoot.innerHTML = slidesHtml;

    var slides = qsa('.hero-slide', heroRoot);
    var current = 0, elapsed = 0, lastTs = null, paused = false, rafId = null;
    var fracEl = qs('#hero-fraction');
    var fill = qs('#hero-progress-fill');
    var heroSec = qs('#hero-carousel');

    function goTo(n, resetTimer) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
      if (fracEl) fracEl.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      if (resetTimer !== false) elapsed = 0;
    }

    function tick(ts) {
      rafId = requestAnimationFrame(tick);
      if (lastTs == null) lastTs = ts;
      var dt = ts - lastTs;
      lastTs = ts;
      if (paused || document.hidden) return;
      elapsed += dt;
      if (fill) fill.style.width = Math.min(elapsed / AUTOPLAY * 100, 100) + '%';
      if (elapsed >= AUTOPLAY) { goTo(current + 1); }
    }

    goTo(0, true);
    if (!reducedMotion) rafId = requestAnimationFrame(tick);
    else if (fill) fill.style.width = '100%';

    var prevBtn = qs('#hero-prev'), nextBtn = qs('#hero-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    if (heroSec) {
      heroSec.addEventListener('mouseenter', function () { paused = true; });
      heroSec.addEventListener('mouseleave', function () { paused = false; });
      heroSec.addEventListener('focusin', function () { paused = true; });
      heroSec.addEventListener('focusout', function () { paused = false; });
      heroSec.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
      });
      /* Geser untuk layar sentuh */
      var x0 = null;
      heroSec.addEventListener('pointerdown', function (e) { x0 = e.clientX; }, { passive: true });
      heroSec.addEventListener('pointerup', function (e) {
        if (x0 == null) return;
        var dx = e.clientX - x0;
        if (Math.abs(dx) > 48) goTo(current + (dx < 0 ? 1 : -1));
        x0 = null;
      }, { passive: true });
    }
  }

  /* ================= SOROTAN UTAMA ================= */
  var featureRoot = qs('#feature-grid');
  if (featureRoot) {
    var picks = data.articles.filter(function (a) { return a.editorsPick; });
    var heroSlugs = heroArticles.map(function (a) { return a.slug; });
    var pool = picks.concat(data.articles).filter(function (a) { return heroSlugs.indexOf(a.slug) === -1; });
    var seen = {};
    pool = pool.filter(function (a) { if (seen[a.slug]) return false; seen[a.slug] = true; return true; });
    var big = pool[0], s1 = pool[1], s2 = pool[2];

    function featureBig(a) {
      return '<article class="group lg:row-span-2 flex flex-col border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden" data-reveal="up">' +
        '<a href="' + YJ.articleUrl(a) + '" class="card-img relative block aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-900">' +
          '<img ' + YJ.fimg(a, 1100, 620) + ' alt="' + a.imgAlt + '" loading="lazy" class="w-full h-full object-cover">' +
          '<span class="absolute top-4 left-4 bg-ink text-white dark:bg-white dark:text-ink font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1.5">Sorotan</span>' +
        '</a>' +
        '<div class="p-6 sm:p-8 flex flex-col gap-3 grow">' +
          '<div class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">' + YJ.catLabel(a.category) + '</div>' +
          '<a href="' + YJ.articleUrl(a) + '"><h3 class="font-display font-extrabold text-2xl sm:text-3xl leading-tight tracking-tight group-hover:underline underline-offset-4 decoration-slate-400 decoration-1">' + a.title + '</h3></a>' +
          '<p class="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">' + a.excerpt + '</p>' +
          '<div class="mt-auto pt-3">' + YJ.metaRow(a) + '</div>' +
        '</div>' +
      '</article>';
    }
    function featureSmall(a) {
      return '<article class="group grid sm:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden" data-reveal="up">' +
        '<a href="' + YJ.articleUrl(a) + '" class="card-img block aspect-[4/3] sm:aspect-auto sm:h-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">' +
          '<img ' + YJ.fimg(a, 600, 450) + ' alt="' + a.imgAlt + '" loading="lazy" class="w-full h-full object-cover">' +
        '</a>' +
        '<div class="p-5 sm:p-6 flex flex-col gap-2 justify-center">' +
          '<div class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">' + YJ.catLabel(a.category) + ' · ' + a.readTime + ' mnt</div>' +
          '<a href="' + YJ.articleUrl(a) + '"><h3 class="font-display font-bold text-xl leading-snug tracking-tight group-hover:underline underline-offset-4 decoration-slate-400 decoration-1">' + a.title + '</h3></a>' +
          '<p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">' + a.excerpt + '</p>' +
          '<div class="pt-1">' + YJ.metaRow(a, 24) + '</div>' +
        '</div>' +
      '</article>';
    }
    featureRoot.innerHTML = featureBig(big) + featureSmall(s1) + featureSmall(s2);
  }

  /* ================= ARTIKEL TERBARU ================= */
  var latestRoot = qs('#latest-grid');
  if (latestRoot) {
    latestRoot.innerHTML = data.articles.slice(0, 6).map(function (a) {
      return '<div data-reveal="up" class="min-w-0">' + YJ.cardGrid(a) + '</div>';
    }).join('');
  }

  /* ================= RUBRIK ================= */
  var rubrikRoot = qs('#rubrik-grid');
  if (rubrikRoot) {
    var counts = {};
    data.articles.forEach(function (a) { counts[a.category] = (counts[a.category] || 0) + 1; });
    var keys = Object.keys(data.categories);
    var cards = keys.map(function (key, i) {
      var c = data.categories[key];
      return '<a href="articles.html?cat=' + key + '" class="group relative flex flex-col justify-between gap-8 border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors" data-reveal="up" data-delay="' + (i % 4) * 80 + '">' +
        '<div class="flex items-start justify-between">' +
          '<span class="font-display font-black text-3xl text-outline">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500">' + (counts[key] || 0) + ' artikel</span>' +
        '</div>' +
        '<div>' +
          '<h3 class="font-display font-bold text-lg tracking-tight group-hover:underline underline-offset-4 decoration-slate-400 decoration-1">' + c.label + '</h3>' +
          '<p class="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">' + c.desc + '</p>' +
        '</div>' +
        '<span class="absolute bottom-5 right-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">' + YJ.icon('arrowUpRight') + '</span>' +
      '</a>';
    });
    cards.push('<a href="articles.html" class="group relative flex flex-col justify-center gap-3 border border-neutral-900 dark:border-neutral-100 p-6 bg-ink text-white dark:bg-white dark:text-ink" data-reveal="up" data-delay="320">' +
      '<span class="font-mono text-[10px] tracking-[0.25em] uppercase opacity-70">Arsip Lengkap</span>' +
      '<span class="font-display font-black text-2xl tracking-tight">Jelajahi semua ' + data.articles.length + ' artikel</span>' +
      '<span class="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase">Buka arsip ' + YJ.icon('arrow') + '</span>' +
    '</a>');
    rubrikRoot.innerHTML = cards.join('');
  }

  /* ================= PILIHAN EDITOR ================= */
  var pickRoot = qs('#editors-picks');
  if (pickRoot) {
    var ep = data.articles.filter(function (a) { return a.editorsPick; }).slice(0, 5);
    pickRoot.innerHTML = ep.map(function (a, i) { return YJ.pickItem(a, i + 1); }).join('');
  }

  /* ================= SLIDER TESTIMONI ================= */
  var testiRoot = qs('#testi-slides');
  if (testiRoot) {
    var t = data.testimonials;
    testiRoot.innerHTML = t.map(function (item, i) {
      return '<figure class="testi-slide' + (i === 0 ? ' is-active' : '') + '" role="group" aria-roledescription="testimoni" aria-label="Testimoni ' + (i + 1) + ' dari ' + t.length + '" aria-hidden="' + (i === 0 ? 'false' : 'true') + '">' +
        '<div class="text-slate-300 dark:text-slate-700">' + YJ.icon('quote') + '</div>' +
        '<blockquote class="mt-4 font-display font-semibold italic text-xl sm:text-2xl lg:text-[1.7rem] leading-snug tracking-tight text-neutral-800 dark:text-neutral-100 max-w-3xl">“' + item.quote + '”</blockquote>' +
        '<figcaption class="mt-6 flex items-center gap-3">' +
          '<img src="' + YJ.img(item.seed, 120, 120) + '" alt="Foto ' + item.name + '" loading="lazy" class="rounded-full object-cover border border-neutral-200 dark:border-neutral-700" style="width:44px;height:44px">' +
          '<span>' +
            '<span class="block text-sm font-semibold text-neutral-900 dark:text-white">' + item.name + '</span>' +
            '<span class="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mt-0.5">' + item.role + '</span>' +
          '</span>' +
        '</figcaption>' +
      '</figure>';
    }).join('');

    var dotsWrap = qs('#testi-dots');
    if (dotsWrap) {
      dotsWrap.innerHTML = t.map(function (_, i) {
        return '<button type="button" class="testi-dot w-8 h-1 transition-colors ' + (i === 0 ? 'bg-ink dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700') + '" aria-label="Testimoni ' + (i + 1) + '"></button>';
      }).join('');
    }

    var ts = qsa('.testi-slide', testiRoot);
    var dots = qsa('.testi-dot');
    var tCur = 0, tTimer = null;
    function tGo(n) {
      ts[tCur].classList.remove('is-active');
      ts[tCur].setAttribute('aria-hidden', 'true');
      if (dots[tCur]) dots[tCur].className = dots[tCur].className.replace('bg-ink dark:bg-white', 'bg-neutral-300 dark:bg-neutral-700');
      tCur = (n + ts.length) % ts.length;
      ts[tCur].classList.add('is-active');
      ts[tCur].setAttribute('aria-hidden', 'false');
      if (dots[tCur]) dots[tCur].className = dots[tCur].className.replace('bg-neutral-300 dark:bg-neutral-700', 'bg-ink dark:bg-white');
    }
    function tAuto() {
      clearInterval(tTimer);
      if (reducedMotion) return;
      tTimer = setInterval(function () { if (!document.hidden) tGo(tCur + 1); }, 7000);
    }
    var tp = qs('#testi-prev'), tn = qs('#testi-next');
    if (tp) tp.addEventListener('click', function () { tGo(tCur - 1); tAuto(); });
    if (tn) tn.addEventListener('click', function () { tGo(tCur + 1); tAuto(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { tGo(i); tAuto(); }); });
    tAuto();
  }

  /* Daftarkan elemen data-reveal yang baru disuntikkan */
  if (YJ.initReveals) YJ.initReveals(document);
})();
