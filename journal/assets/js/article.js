/* =========================================================
   Yuosant Journal — article.js
   Memuat artikel berdasar ?id= dan merender halaman baca
   ========================================================= */
(function () {
  'use strict';
  var YJ = window.YJ, data = YJ.data;
  var qs = YJ.qs;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var root = qs('#article-root');
  if (!root) return;

  var slug = null;
  try { slug = new URLSearchParams(location.search).get('id'); } catch (e) {}

  var idx = -1;
  data.articles.forEach(function (a, i) { if (a.slug === slug) idx = i; });
  var a = idx >= 0 ? data.articles[idx] : null;

  /* ---------- Artikel tidak ditemukan ---------- */
  if (!a) {
    document.title = 'Artikel tidak ditemukan — Yuosant Journal';
    root.innerHTML =
      '<div class="max-w-xl mx-auto px-4 py-24 text-center">' +
        '<p class="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">Kesalahan 404</p>' +
        '<h1 class="mt-4 font-display font-black text-4xl tracking-tight">Artikel tidak ditemukan</h1>' +
        '<p class="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">Tautan mungkin keliru atau artikel sudah dipindahkan ke arsip. Silakan jelajahi arsip lengkap kami.</p>' +
        '<a href="articles.html" class="mt-8 inline-flex items-center gap-2.5 bg-ink text-white dark:bg-white dark:text-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">Buka Arsip ' + YJ.icon('arrow') + '</a>' +
      '</div>';
    return;
  }

  var au = YJ.author(a.author);

  /* ---------- Meta dokumen ---------- */
  document.title = a.title + ' — Yuosant Journal';
  var md = qs('meta[name="description"]');
  if (md) md.setAttribute('content', a.excerpt);

  /* ---------- Render blok isi ---------- */
  function renderBlock(b) {
    if (b.t === 'h2') return '<h2>' + b.x + '</h2>';
    if (b.t === 'quote') return '<blockquote><p>“' + b.x + '”</p>' + (b.cite ? '<footer>— ' + b.cite + '</footer>' : '') + '</blockquote>';
    if (b.t === 'list') return '<ul>' + b.items.map(function (it) { return '<li>' + it + '</li>'; }).join('') + '</ul>';
    if (b.t === 'img') return '<figure><img src="' + b.src + '" alt="' + (b.alt || '') + '" loading="lazy"><figcaption>' + (b.caption || '') + '</figcaption></figure>';
    return '<p>' + b.x + '</p>';
  }

  var prevA = idx > 0 ? data.articles[idx - 1] : null;
  var nextA = idx < data.articles.length - 1 ? data.articles[idx + 1] : null;

  var related = data.articles.filter(function (x) { return x.slug !== a.slug && x.category === a.category; });
  data.articles.forEach(function (x) {
    if (related.length < 3 && x.slug !== a.slug && related.indexOf(x) === -1) related.push(x);
  });
  related = related.slice(0, 3);

  var shareUrl = encodeURIComponent(location.href);
  var shareText = encodeURIComponent(a.title + ' — Yuosant Journal');

  root.innerHTML =
    '<article class="pb-16">' +
      /* ---- Kepala artikel ---- */
      '<header class="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">' +
        '<nav aria-label="Breadcrumb" class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">' +
          '<a class="hover:text-ink dark:hover:text-white transition-colors" href="index.html">Beranda</a><span aria-hidden="true">/</span>' +
          '<a class="hover:text-ink dark:hover:text-white transition-colors" href="articles.html">Artikel</a><span aria-hidden="true">/</span>' +
          '<a class="hover:text-ink dark:hover:text-white transition-colors" href="articles.html?cat=' + a.category + '">' + YJ.catLabel(a.category) + '</a>' +
        '</nav>' +
        '<h1 class="mt-6 font-display font-black tracking-tight leading-[1.06] text-3xl sm:text-4xl lg:text-5xl" data-reveal="up">' + a.title + '</h1>' +
        '<p class="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400" data-reveal="up" data-delay="90">' + a.excerpt + '</p>' +
        '<div class="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 dark:border-neutral-800 py-4" data-reveal="up" data-delay="160">' +
          '<div class="flex items-center gap-3">' +
            '<img src="' + au.avatar + '" alt="Foto ' + au.name + '" width="44" height="44" class="rounded-full object-cover border border-neutral-200 dark:border-neutral-700" style="width:44px;height:44px">' +
            '<div class="text-sm">' +
              '<p class="font-semibold text-neutral-900 dark:text-white">' + au.name + '</p>' +
              '<p class="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mt-0.5">' + au.role + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 flex items-center gap-4">' +
            '<span>' + YJ.formatDate(a.date) + '</span>' +
            '<span class="inline-flex items-center gap-1.5">' + YJ.icon('clock') + a.readTime + ' mnt baca</span>' +
            '<button type="button" data-focus-toggle class="inline-flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 hover:bg-ink hover:text-white hover:border-ink dark:hover:bg-white dark:hover:text-ink dark:hover:border-white transition-colors" aria-pressed="false"><span data-focus-label>Mode Baca</span></button>' +
          '</div>' +
        '</div>' +
      '</header>' +

      /* ---- Gambar utama ---- */
      '<figure class="max-w-5xl mx-auto px-4 sm:px-6 mt-8" data-reveal="zoom">' +
        '<div class="overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">' +
          '<img ' + YJ.fimg(a, 1600, 900) + ' alt="' + a.imgAlt + '" fetchpriority="high" class="w-full aspect-[16/9] object-cover">' +
        '</div>' +
        '<figcaption class="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">' + a.imgAlt + ' — ' + 'Ilustrasi: Studio Yuosant' + '</figcaption>' +
      '</figure>' +

      /* ---- Isi ---- */
      '<div id="article-body" class="article-body max-w-3xl mx-auto px-4 sm:px-6 mt-10">' +
        a.content.map(renderBlock).join('') +
      '</div>' +

      /* ---- Tag & bagikan ---- */
      '<div class="max-w-3xl mx-auto px-4 sm:px-6 mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">' +
        '<div class="flex flex-wrap gap-2">' +
          a.tags.map(function (t) { return '<span class="font-mono text-[10px] uppercase tracking-[0.18em] border border-neutral-300 dark:border-neutral-700 text-slate-600 dark:text-slate-400 px-3 py-1.5">' + t + '</span>'; }).join('') +
        '</div>' +
        '<div class="flex items-center gap-2">' +
          '<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mr-1">Bagikan</span>' +
          '<button type="button" data-copy class="p-2.5 border border-neutral-300 dark:border-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-ink hover:text-white hover:border-ink dark:hover:bg-white dark:hover:text-ink dark:hover:border-white transition-colors" aria-label="Salin tautan">' + YJ.icon('copy') + '</button>' +
          '<a target="_blank" rel="noopener" class="p-2.5 border border-neutral-300 dark:border-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-ink hover:text-white hover:border-ink dark:hover:bg-white dark:hover:text-ink dark:hover:border-white transition-colors" aria-label="Bagikan ke X" href="https://twitter.com/intent/tweet?text=' + shareText + '&url=' + shareUrl + '">' +
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.6 8.7L23.2 22h-6.9l-5.4-7-6.2 7H1.5l8.1-9.3L1 2h7.1l4.9 6.4L18.9 2zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20z"/></svg></a>' +
          '<a target="_blank" rel="noopener" class="p-2.5 border border-neutral-300 dark:border-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-ink hover:text-white hover:border-ink dark:hover:bg-white dark:hover:text-ink dark:hover:border-white transition-colors" aria-label="Bagikan ke Facebook" href="https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '">' +
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V22h3.4z"/></svg></a>' +
          '<a target="_blank" rel="noopener" class="p-2.5 border border-neutral-300 dark:border-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-ink hover:text-white hover:border-ink dark:hover:bg-white dark:hover:text-ink dark:hover:border-white transition-colors" aria-label="Bagikan ke WhatsApp" href="https://wa.me/?text=' + shareText + '%20' + shareUrl + '">' +
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a9.9 9.9 0 0 0-8.5 15.1L2 22l5-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3a8.2 8.2 0 1 1 7 3.8zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.6-1.3.1-.2 0-.4 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.9a11.6 11.6 0 0 0 4.5 4.2c1.7.8 2.3.8 3.1.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg></a>' +
        '</div>' +
      '</div>' +

      /* ---- Profil penulis ---- */
      '<aside class="max-w-3xl mx-auto px-4 sm:px-6 mt-10" data-reveal="up">' +
        '<div class="flex gap-5 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 bg-neutral-50 dark:bg-neutral-900/50">' +
          '<img src="' + au.avatar + '" alt="Foto ' + au.name + '" loading="lazy" class="rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-700" style="width:72px;height:72px">' +
          '<div>' +
            '<p class="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Ditulis oleh</p>' +
            '<p class="mt-1.5 font-display font-bold text-xl tracking-tight">' + au.name + '</p>' +
            '<p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">' + au.bio + '</p>' +
          '</div>' +
        '</div>' +
      '</aside>' +

      /* ---- Prev / Next ---- */
      '<nav aria-label="Navigasi artikel" class="focus-hide max-w-3xl mx-auto px-4 sm:px-6 mt-10 grid sm:grid-cols-2 gap-4">' +
        (prevA
          ? '<a href="' + YJ.articleUrl(prevA) + '" class="group border border-neutral-200 dark:border-neutral-800 p-5 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors">' +
            '<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">← Terbit lebih baru</span>' +
            '<span class="mt-2 block font-display font-bold leading-snug tracking-tight group-hover:underline underline-offset-4 decoration-slate-400">' + prevA.title + '</span></a>'
          : '<span></span>') +
        (nextA
          ? '<a href="' + YJ.articleUrl(nextA) + '" class="group border border-neutral-200 dark:border-neutral-800 p-5 text-right hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors">' +
            '<span class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Terbit lebih lama →</span>' +
            '<span class="mt-2 block font-display font-bold leading-snug tracking-tight group-hover:underline underline-offset-4 decoration-slate-400">' + nextA.title + '</span></a>'
          : '') +
      '</nav>' +
    '</article>' +

    /* ---- Artikel terkait ---- */
    '<section class="focus-hide border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 mt-16">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">' +
        '<div class="flex items-end justify-between gap-6 mb-8" data-reveal="up">' +
          '<div>' +
            '<p class="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Lanjutkan Membaca</p>' +
            '<h2 class="mt-2 font-display font-black text-3xl tracking-tight">Artikel terkait</h2>' +
          '</div>' +
          '<a class="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 hover:text-ink dark:hover:text-white transition-colors" href="articles.html">Semua artikel ' + YJ.icon('arrowUpRight') + '</a>' +
        '</div>' +
        '<div class="grid gap-8 md:grid-cols-3">' +
          related.map(function (r) { return '<div data-reveal="up">' + YJ.cardGrid(r) + '</div>'; }).join('') +
        '</div>' +
      '</div>' +
    '</section>';

  /* ---------- Salin tautan ---------- */
  var copyBtn = qs('[data-copy]', root);
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = location.href;
      function done() { YJ.toast('Tautan artikel disalin.'); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallback(); });
      } else fallback();
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = url; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { window.prompt('Salin tautan:', url); }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- Bilah progres membaca ---------- */
  var bar = qs('#read-progress');
  var body = qs('#article-body');
  if (bar && body) {
    function update() {
      var r = body.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var done = Math.min(Math.max(-r.top + window.innerHeight * 0.2, 0), Math.max(total, 1));
      bar.style.transform = 'scaleX(' + (done / Math.max(total, 1)) + ')';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Mode Baca (focus mode) ---------- */
  var focusBtn = qs('[data-focus-toggle]', root);
  function setFocus(on) {
    document.body.classList.toggle('focus-mode', on);
    if (focusBtn) {
      focusBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var lbl = qs('[data-focus-label]', focusBtn);
      if (lbl) lbl.textContent = on ? 'Mode Normal' : 'Mode Baca';
    }
    try { localStorage.setItem('yj-focus', on ? '1' : '0'); } catch (e) {}
  }
  if (focusBtn) {
    focusBtn.addEventListener('click', function () {
      setFocus(!document.body.classList.contains('focus-mode'));
      if (document.body.classList.contains('focus-mode')) {
        YJ.toast('Mode baca aktif — selamat membaca tanpa distraksi.');
      }
    });
    try { if (localStorage.getItem('yj-focus') === '1') setFocus(true); } catch (e) {}
  }

  if (YJ.initReveals) YJ.initReveals(document);
  if (reducedMotion) document.documentElement.classList.add('reduced-motion');
})();
