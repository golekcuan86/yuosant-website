/* =========================================================
   Yuosant Journal — main.js
   Mesin UI bersama: tema, navigasi, reveal, parallax,
   ticker, kartu artikel, newsletter, toast, dsb.
   ========================================================= */
(function () {
  'use strict';

  var YJ = window.YJ = window.YJ || {};
  var data = YJ.data;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Util ---------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  YJ.qs = qs; YJ.qsa = qsa;

  var ICONS = {
    arrow: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>',
    arrowUpRight: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>',
    arrowUp: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>',
    chevronL: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    chevronR: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    sun: '<svg class="w-4.5 h-4.5 w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    clock: '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    quote: '<svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.2 5.6C7 7.3 5 10 5 13.6c0 3 1.9 4.8 4 4.8 1.9 0 3.4-1.4 3.4-3.3 0-1.8-1.3-3-3-3-.3 0-.8.1-.9.1.3-1.9 2.3-4 3.8-4.9l-2.1-1.7zm9 0C16 7.3 14 10 14 13.6c0 3 1.9 4.8 4 4.8 1.9 0 3.4-1.4 3.4-3.3 0-1.8-1.3-3-3-3-.3 0-.8.1-.9.1.3-1.9 2.3-4 3.8-4.9l-2.1-1.7z"/></svg>',
    check: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    close: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    search: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    copy: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    mail: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    pin: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>'
  };
  YJ.icon = function (name) { return ICONS[name] || ''; };

  /* ---------- Format ---------- */
  var dtf = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  YJ.formatDate = function (iso) { return dtf.format(new Date(iso + 'T00:00:00')); };

  YJ.catLabel = function (key) { return (data.categories[key] || {}).label || key; };
  YJ.author = function (key) { return data.authors[key] || { name: 'Redaksi', role: 'Tim Yuosant', avatar: '' }; };
  YJ.articleUrl = function (a) { return 'article.html?id=' + encodeURIComponent(a.slug); };
  YJ.img = function (seed, w, h) { return 'https://picsum.photos/seed/' + seed + '/' + w + '/' + h + '?grayscale'; };
  /* Gambar artikel: pakai ilustrasi lokal bila tersedia, jika tidak fallback ke picsum */
  YJ.imgFor = function (a, w, h) { return a.img ? a.img : YJ.img(a.seed, w, h); };
  /* Atribut <img> lengkap dengan cadangan picsum bila berkas lokal belum ada */
  YJ.fimg = function (a, w, h) {
    return 'src="' + (a.img || YJ.img(a.seed, w, h)) + '"' + (a.img ? ' data-fb="' + YJ.img(a.seed, w, h) + '"' : '');
  };
  /* Delegasi penanganan error gambar (error <img> tidak menggelembung → capture) */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset.fb && !t.dataset.fbDone) {
      t.dataset.fbDone = '1';
      t.src = t.dataset.fb;
    }
  }, true);

  /* ---------- Toast ---------- */
  var toastTimer = null;
  YJ.toast = function (msg) {
    var el = qs('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.setAttribute('role', 'status');
      el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-ink text-white dark:bg-white dark:text-ink font-mono text-xs tracking-wide px-5 py-3 shadow-editorial opacity-0 pointer-events-none';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    el.style.transform = 'translate(-50%, -4px)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, 0)';
    }, 2600);
  };

  /* ---------- Tema gelap/terang ---------- */
  function applyThemeIcon() {
    var dark = document.documentElement.classList.contains('dark');
    qsa('[data-theme-icon]').forEach(function (el) {
      el.innerHTML = dark ? YJ.icon('sun') : YJ.icon('moon');
    });
    qsa('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    });
  }
  qsa('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var html = document.documentElement;
      html.classList.toggle('dark');
      try { localStorage.setItem('yj-theme', html.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
      applyThemeIcon();
    });
  });
  applyThemeIcon();

  /* ---------- Header: state scroll & menu mobile ---------- */
  var header = qs('#site-header');
  function onScrollHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  var menuToggle = qs('#menu-toggle');
  var mobileMenu = qs('#mobile-menu');
  function setMenu(open) {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.toggle('is-open', open);
    menuToggle.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      setMenu(!mobileMenu.classList.contains('is-open'));
    });
  }
  qsa('#mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Penanda tautan aktif ---------- */
  var page = (location.pathname.split('/').pop() || 'index.html');
  qsa('[data-nav]').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.split('#')[0] === page && page !== 'article.html') {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Tanggal hari ini di utility bar ---------- */
  var todayEl = qs('#today-date');
  if (todayEl) {
    var full = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    todayEl.textContent = full;
  }

  /* ---------- Ticker berita ---------- */
  var ticker = qs('#ticker');
  if (ticker && data && data.articles.length) {
    var items = data.articles.slice(0, 6).map(function (a) {
      return '<a href="' + YJ.articleUrl(a) + '" class="group inline-flex items-center gap-3 shrink-0 hover:text-ink dark:hover:text-white transition-colors">' +
        '<span class="text-slate-400 dark:text-slate-600">◆</span>' +
        '<span class="group-hover:underline underline-offset-4 decoration-slate-400">' + a.title + '</span>' +
        '</a>';
    }).join('');
    ticker.innerHTML =
      '<div class="marquee border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">' +
        '<div class="flex items-stretch">' +
          '<span class="shrink-0 z-10 flex items-center px-3 sm:px-4 bg-ink dark:bg-white text-white dark:text-ink font-mono text-[10px] tracking-[0.25em] uppercase">Terkini</span>' +
          '<div class="relative flex-1 overflow-hidden py-2.5">' +
            '<div class="marquee-track font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">' +
              '<div class="flex items-center gap-10 pr-10">' + items + '</div>' +
              '<div class="flex items-center gap-10 pr-10" aria-hidden="true">' + items + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Reveal saat scroll (rAF scroll check — tahan scroll cepat) ---------- */
  var revealPending = [];
  var revealQueued = false;
  function revealRun() {
    revealQueued = false;
    var vh = window.innerHeight;
    revealPending = revealPending.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) {
        if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
        el.classList.add('is-visible');
        return false;
      }
      return true;
    });
  }
  function revealSchedule() {
    if (!revealQueued) { revealQueued = true; requestAnimationFrame(revealRun); }
  }
  /* Pindai ulang elemen [data-reveal]; dipanggil lagi oleh script halaman
     setelah menyuntikkan konten dinamis. */
  YJ.initReveals = function (root) {
    qsa('[data-reveal]', root || document).forEach(function (el) {
      if (el.dataset.revealInit) return;
      el.dataset.revealInit = '1';
      if (reducedMotion) el.classList.add('is-visible');
      else revealPending.push(el);
    });
    if (!reducedMotion) revealSchedule();
  };
  window.addEventListener('scroll', revealSchedule, { passive: true });
  window.addEventListener('resize', revealSchedule);
  window.addEventListener('load', function () { YJ.initReveals(document); revealRun(); });

  /* ---------- Parallax ---------- */
  var pxEls = qsa('[data-parallax]');
  if (pxEls.length && !reducedMotion) {
    var ticking = false;
    var lastY = window.scrollY;
    function updateParallax() {
      ticking = false;
      var vh = window.innerHeight;
      pxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) return;
        var speed = parseFloat(el.dataset.parallax || '0.12');
        var center = r.top + r.height / 2;
        var delta = (center - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + (-delta).toFixed(2) + 'px,0)';
      });
    }
    function onScrollPx() {
      if (!ticking && Math.abs(window.scrollY - lastY) > 0.5) {
        lastY = window.scrollY;
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    }
    window.addEventListener('scroll', onScrollPx, { passive: true });
    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  /* ---------- Tombol kembali ke atas + cincin progres ---------- */
  var btt = qs('#back-to-top');
  if (btt) {
    var ring = qs('#back-to-top .ring');
    var R = 25, CIRC = 2 * Math.PI * R;
    if (ring) {
      ring.setAttribute('r', R);
      ring.style.strokeDasharray = CIRC;
      ring.style.strokeDashoffset = CIRC;
    }
    function updateBtt() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var frac = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      btt.classList.toggle('is-visible', window.scrollY > 600);
      if (ring) ring.style.strokeDashoffset = CIRC * (1 - frac);
    }
    window.addEventListener('scroll', updateBtt, { passive: true });
    updateBtt();
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Penghitung angka (data-count) ---------- */
  var counters = qsa('[data-count]');
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseInt(el.dataset.count, 10) || 0;
        var suffix = el.dataset.suffix || '';
        if (reducedMotion) { el.textContent = target + suffix; return; }
        var start = null, dur = 1500;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Akordeon generik ---------- */
  qsa('[data-accordion]').forEach(function (btn) {
    var panel = qs('#' + btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.style.maxHeight = open ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Tautan "segera hadir" ---------- */
  qsa('[data-soon]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      YJ.toast('Halaman ini segera hadir — terima kasih atas kesabarannya.');
    });
  });

  /* ---------- Form newsletter ---------- */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  qsa('form[data-newsletter]').forEach(function (form) {
    var input = qs('input[type="email"]', form);
    var errEl = qs('[data-error]', form);
    var okEl = qs('[data-success]', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim();
      if (!emailRe.test(val)) {
        if (errEl) { errEl.textContent = 'Masukkan alamat email yang valid, mis. nama@email.com'; errEl.hidden = false; }
        form.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      form.classList.remove('has-error');
      if (errEl) errEl.hidden = true;
      input.removeAttribute('aria-invalid');
      try { localStorage.setItem('yj-newsletter', val); } catch (err) {}
      var name = val.split('@')[0];
      if (okEl) {
        okEl.innerHTML = '<span class="inline-flex items-center gap-2 text-neutral-900 dark:text-white"><span class="text-slate-500">' + YJ.icon('check') + '</span><span><strong class="font-semibold">Berhasil!</strong> Konfirmasi terkirim ke <span class="underline underline-offset-4">' + val + '</span>. Sampai jumpa hari Selasa' + (name ? ', ' + name : '') + '.</span></span>';
        okEl.hidden = false;
        okEl.classList.remove('hidden');
      }
      form.reset();
      YJ.toast('Terima kasih sudah berlangganan!');
    });
    input.addEventListener('input', function () {
      if (form.classList.contains('has-error') && emailRe.test(input.value.trim())) {
        form.classList.remove('has-error');
        if (errEl) errEl.hidden = true;
        input.removeAttribute('aria-invalid');
      }
    });
  });

  /* ---------- Tahun footer ---------- */
  qsa('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* =========================================================
     Renderer kartu artikel (dipakai halaman beranda & arsip)
     ========================================================= */
  function kickerRow(a, extraClass) {
    return '<div class="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] ' + (extraClass || '') + '">' +
      '<span class="text-slate-500 dark:text-slate-400">' + YJ.catLabel(a.category) + '</span>' +
      '<span class="kicker-rule"></span>' +
      '<span class="text-slate-400 dark:text-slate-500 inline-flex items-center gap-1.5">' + YJ.icon('clock') + a.readTime + ' mnt baca</span>' +
      '</div>';
  }

  function metaRow(a, avatarSize) {
    var au = YJ.author(a.author);
    var s = avatarSize || 28;
    return '<div class="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">' +
      '<img src="' + au.avatar + '" alt="Foto ' + au.name + '" width="' + s + '" height="' + s + '" loading="lazy" class="rounded-full object-cover" style="width:' + s + 'px;height:' + s + 'px">' +
      '<span class="font-medium text-neutral-700 dark:text-neutral-300">' + au.name + '</span>' +
      '<span aria-hidden="true" class="text-slate-300 dark:text-slate-600">/</span>' +
      '<span>' + YJ.formatDate(a.date) + '</span>' +
      '</div>';
  }
  YJ.metaRow = metaRow;

  YJ.cardGrid = function (a) {
    return '<article class="group flex flex-col" data-cat="' + a.category + '">' +
      '<a href="' + YJ.articleUrl(a) + '" class="block focus-visible:outline-offset-4">' +
        '<figure class="card-img relative overflow-hidden border border-neutral-200 dark:border-neutral-800 aspect-[4/3] bg-neutral-100 dark:bg-neutral-900">' +
          '<img ' + YJ.fimg(a, 800, 600) + ' alt="' + a.imgAlt + '" loading="lazy" class="w-full h-full object-cover">' +
          '<span class="absolute top-3 left-3 bg-white/95 dark:bg-ink/95 text-ink dark:text-white font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1">' + YJ.catLabel(a.category) + '</span>' +
        '</figure>' +
        '<div class="pt-4 flex flex-col gap-2.5">' +
          kickerRow(a) +
          '<h3 class="font-display font-bold text-xl leading-snug tracking-tight group-hover:underline underline-offset-4 decoration-slate-400 decoration-1">' + a.title + '</h3>' +
          '<p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">' + a.excerpt + '</p>' +
          '<div class="pt-1">' + metaRow(a) + '</div>' +
        '</div>' +
      '</a>' +
    '</article>';
  };

  YJ.cardWide = function (a, idx) {
    return '<article class="group grid grid-cols-[96px_1fr] sm:grid-cols-[180px_1fr] gap-4 sm:gap-6 py-5 border-t border-neutral-200 dark:border-neutral-800 first:border-t-0" data-reveal="up">' +
      '<a href="' + YJ.articleUrl(a) + '" class="card-img relative block aspect-[4/3] overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">' +
        '<img ' + YJ.fimg(a, 480, 360) + ' alt="' + a.imgAlt + '" loading="lazy" class="w-full h-full object-cover">' +
      '</a>' +
      '<div class="flex flex-col justify-center gap-1.5 min-w-0">' +
        (typeof idx === 'number' ? '<span class="font-mono text-[10px] tracking-[0.25em] text-slate-400 dark:text-slate-500">' + String(idx + 1).padStart(2, '0') + '</span>' : '') +
        kickerRow(a) +
        '<a href="' + YJ.articleUrl(a) + '"><h3 class="font-display font-bold text-lg sm:text-xl leading-snug tracking-tight group-hover:underline underline-offset-4 decoration-slate-400 decoration-1">' + a.title + '</h3></a>' +
        '<p class="hidden sm:block text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2 max-w-2xl">' + a.excerpt + '</p>' +
        '<div class="pt-1 hidden sm:block">' + metaRow(a, 24) + '</div>' +
        '<div class="sm:hidden text-xs text-slate-500 dark:text-slate-400">' + YJ.formatDate(a.date) + '</div>' +
      '</div>' +
    '</article>';
  };

  YJ.pickItem = function (a, n) {
    return '<a href="' + YJ.articleUrl(a) + '" class="group flex gap-5 items-baseline py-5 border-t border-neutral-200 dark:border-neutral-800" data-reveal="up">' +
      '<span class="font-display font-black text-3xl sm:text-4xl leading-none text-outline shrink-0 w-12">' + String(n).padStart(2, '0') + '</span>' +
      '<span class="min-w-0">' +
        '<span class="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1.5">' + YJ.catLabel(a.category) + ' — ' + a.readTime + ' mnt</span>' +
        '<span class="block font-display font-bold text-lg sm:text-xl leading-snug tracking-tight group-hover:underline underline-offset-4 decoration-slate-400 decoration-1">' + a.title + '</span>' +
        '<span class="block mt-1.5 text-xs text-slate-500 dark:text-slate-400">' + YJ.author(a.author).name + ' · ' + YJ.formatDate(a.date) + '</span>' +
      '</span>' +
      '<span class="ml-auto self-center text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">' + YJ.icon('arrowUpRight') + '</span>' +
    '</a>';
  };

  document.dispatchEvent(new CustomEvent('yj:ready'));
})();
