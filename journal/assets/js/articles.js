/* =========================================================
   Yuosant Journal — articles.js
   Arsip artikel: filter rubrik, pencarian, sortir
   ========================================================= */
(function () {
  'use strict';
  var YJ = window.YJ, data = YJ.data;
  var qs = YJ.qs, qsa = YJ.qsa;

  var listRoot = qs('#articles-list');
  if (!listRoot) return;

  var chipsRoot = qs('#cat-chips');
  var searchInput = qs('#search-input');
  var sortSelect = qs('#sort-select');
  var countEl = qs('#result-count');
  var emptyEl = qs('#empty-state');
  var resetBtn = qs('#reset-filters');

  var state = { cat: 'semua', q: '', sort: 'terbaru' };

  /* Parameter URL: ?cat= & ?q= */
  try {
    var params = new URLSearchParams(location.search);
    if (params.get('cat')) state.cat = params.get('cat');
    if (params.get('q')) state.q = params.get('q');
  } catch (e) {}

  /* ---------- Chips kategori ---------- */
  function renderChips() {
    var all = [{ key: 'semua', label: 'Semua' }].concat(
      Object.keys(data.categories).map(function (k) { return { key: k, label: data.categories[k].label }; })
    );
    chipsRoot.innerHTML = all.map(function (c) {
      var active = state.cat === c.key;
      return '<button type="button" data-chip="' + c.key + '" aria-pressed="' + active + '" class="shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] px-4 py-2 border transition-colors ' +
        (active
          ? 'bg-ink text-white border-ink dark:bg-white dark:text-ink dark:border-white'
          : 'bg-transparent text-slate-600 dark:text-slate-400 border-neutral-300 dark:border-neutral-700 hover:border-ink dark:hover:border-neutral-300 hover:text-ink dark:hover:text-white') +
        '">' + c.label + '</button>';
    }).join('');
    qsa('[data-chip]', chipsRoot).forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.cat = btn.dataset.chip;
        renderChips();
        render();
        syncUrl();
      });
    });
  }

  /* ---------- Ambil hasil ---------- */
  function getResults() {
    var out = data.articles.slice();
    if (state.cat !== 'semua') {
      out = out.filter(function (a) { return a.category === state.cat; });
    }
    if (state.q) {
      var q = state.q.toLowerCase();
      out = out.filter(function (a) {
        return (a.title + ' ' + a.excerpt + ' ' + YJ.catLabel(a.category) + ' ' + YJ.author(a.author).name + ' ' + a.tags.join(' ')).toLowerCase().indexOf(q) !== -1;
      });
    }
    if (state.sort === 'terlama') out.reverse();
    if (state.sort === 'az') out.sort(function (a, b) { return a.title.localeCompare(b.title, 'id'); });
    if (state.sort === 'tercepat') out.sort(function (a, b) { return a.readTime - b.readTime; });
    return out;
  }

  /* ---------- Render ---------- */
  function render() {
    var results = getResults();
    if (countEl) {
      countEl.innerHTML = 'Menampilkan <strong class="font-semibold text-ink dark:text-white">' + results.length + '</strong> dari ' + data.articles.length + ' artikel';
    }
    if (results.length === 0) {
      listRoot.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
    } else {
      if (emptyEl) emptyEl.classList.add('hidden');
      listRoot.innerHTML = results.map(function (a, i) { return YJ.cardWide(a, i); }).join('');
      if (YJ.initReveals) YJ.initReveals(listRoot);
    }
  }

  function syncUrl() {
    try {
      var p = new URLSearchParams();
      if (state.cat !== 'semua') p.set('cat', state.cat);
      if (state.q) p.set('q', state.q);
      var query = p.toString();
      history.replaceState(null, '', location.pathname + (query ? '?' + query : ''));
    } catch (e) {}
  }

  /* ---------- Event ---------- */
  var debounceT;
  if (searchInput) {
    searchInput.value = state.q;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceT);
      debounceT = setTimeout(function () {
        state.q = searchInput.value.trim();
        render();
        syncUrl();
      }, 220);
    });
    if (new URLSearchParams(location.search).get('focus') === 'search' || state.q) {
      searchInput.focus();
    }
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', function () { state.sort = sortSelect.value; render(); });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      state.cat = 'semua'; state.q = ''; state.sort = 'terbaru';
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'terbaru';
      renderChips(); render(); syncUrl();
    });
  }

  renderChips();
  render();
})();
