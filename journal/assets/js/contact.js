/* =========================================================
   Yuosant Journal — contact.js
   Validasi formulir kontak + kondisi sukses
   ========================================================= */
(function () {
  'use strict';
  var YJ = window.YJ;
  var qs = YJ.qs, qsa = YJ.qsa;

  var form = qs('#contact-form');
  if (!form) return;

  var fields = {
    nama:   { el: qs('#cf-nama'),   test: function (v) { return v.trim().length >= 3; }, msg: 'Nama minimal 3 karakter.' },
    email:  { el: qs('#cf-email'),  test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }, msg: 'Alamat email tidak valid — contoh: nama@email.com' },
    topik:  { el: qs('#cf-topik'),  test: function (v) { return v !== ''; }, msg: 'Pilih salah satu topik.' },
    pesan:  { el: qs('#cf-pesan'),  test: function (v) { return v.trim().length >= 20; }, msg: 'Pesan minimal 20 karakter agar kami paham konteksnya.' }
  };

  var counter = qs('#cf-counter');
  if (counter && fields.pesan.el) {
    fields.pesan.el.addEventListener('input', function () {
      var len = fields.pesan.el.value.trim().length;
      counter.textContent = len + ' / 20 karakter minimum';
      counter.classList.toggle('text-emerald-600', len >= 20);
      counter.classList.toggle('dark:text-emerald-400', len >= 20);
    });
  }

  function validateField(key, showError) {
    var f = fields[key];
    var wrap = f.el.closest('.field');
    var ok = f.test(f.el.value);
    if (wrap) wrap.classList.toggle('is-invalid', !ok && showError !== false);
    f.el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  Object.keys(fields).forEach(function (key) {
    var f = fields[key];
    f.el.addEventListener('blur', function () {
      if (f.el.value !== '') validateField(key, true);
    });
    f.el.addEventListener('input', function () {
      var wrap = f.el.closest('.field');
      if (wrap && wrap.classList.contains('is-invalid')) validateField(key, true);
    });
    if (f.el.tagName === 'SELECT') {
      f.el.addEventListener('change', function () { validateField(key, true); });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(fields).forEach(function (key) {
      var ok = validateField(key, true);
      if (!ok && !firstInvalid) firstInvalid = fields[key].el;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      YJ.toast('Periksa kembali kolom yang ditandai.');
      return;
    }
    /* Sukses: tukar form dengan panel konfirmasi */
    var nama = fields.nama.el.value.trim();
    var topikSel = fields.topik.el;
    var topikLabel = topikSel.options[topikSel.selectedIndex].text;
    var panel = qs('#contact-success');
    qs('#cs-nama').textContent = nama;
    qs('#cs-topik').textContent = topikLabel;
    form.classList.add('hidden');
    if (panel) {
      panel.classList.remove('hidden');
      panel.setAttribute('tabindex', '-1');
      panel.focus();
    }
    YJ.toast('Pesan terkirim. Terima kasih, ' + nama + '!');
  });

  var againBtn = qs('#contact-again');
  if (againBtn) {
    againBtn.addEventListener('click', function () {
      form.reset();
      qsa('.field', form).forEach(function (w) { w.classList.remove('is-invalid'); });
      var panel = qs('#contact-success');
      if (panel) panel.classList.add('hidden');
      form.classList.remove('hidden');
      if (counter) counter.textContent = '0 / 20 karakter minimum';
      fields.nama.el.focus();
    });
  }
})();
