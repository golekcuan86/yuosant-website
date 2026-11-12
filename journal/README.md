# Yuosant Journal

**Learn something. Make it useful.** — Majalah digital independen berbahasa Indonesia: tips & trik, panduan teknologi, AI, produktivitas, pendidikan, bisnis digital, dan berita terkini — ditulis dengan bahasa yang mudah dipahami.

Dibangun dengan **HTML + Tailwind CSS (terkompilasi) + vanilla JavaScript** — tanpa framework, tanpa backend. Statis, cepat, dan bisa langsung di-deploy ke hosting statis mana pun (Netlify, Vercel, GitHub Pages, Nginx, dll.).

## Struktur

```
yuosant-journal/
├── index.html            # Beranda: hero carousel, sorotan, terbaru, rubrik, pilihan editor, testimoni
├── articles.html         # Arsip 36 artikel: filter rubrik, pencarian, sortir (URL-aware)
├── article.html          # Halaman baca dinamis (?id=slug-artikel) + Mode Baca
├── about.html            # Tentang: manifesto, nilai, statistik, tim
├── contact.html          # Kontak: form tervalidasi, info redaksi, FAQ, peta
├── 404.html              # Halaman tidak ditemukan (kustom, monokrom)
├── assets/
│   ├── css/app.css       # Tailwind v4 terkompilasi (hasil build, terminifikasi)
│   ├── css/style.css     # Gaya kustom: animasi, carousel, tipografi artikel, Mode Baca
│   ├── img/articles/     # 20 ilustrasi editorial monokrom (gambar tinta + halftone)
│   └── js/
│       ├── data.js       # Seluruh konten: 36 artikel, penulis, rubrik, testimoni
│       ├── main.js       # Mesin UI bersama (tema, nav, parallax, reveal, fallback gambar, dsb.)
│       ├── home.js  articles.js  article.js  contact.js
└── src/input.css         # Sumber Tailwind (@theme: font, warna brand)
└── build-css.sh          # Skrip rebuild CSS (unduh Tailwind CLI bila perlu)
```

## Menjalankan

Tidak perlu build untuk dipakai — semua berkas sudah terkompilasi. Sajikan
folder ini lewat server statis apa pun:

```bash
python3 -m http.server 8080        # lalu buka http://localhost:8080
```

## Mengubah konten

Semua artikel dan data ada di `assets/js/data.js`. Tambahkan entri baru ke
array `articles` — beranda, arsip, ticker, dan artikel terkait ikut ter-update
otomatis.

**Gambar artikel** ditentukan lewat properti `img`:

```js
img: 'assets/img/articles/slug-anda.jpg',   // ilustrasi lokal
imgAlt: 'Deskripsi gambar untuk screen reader',
```

Bila `img` dihilangkan, sistem otomatis memakai placeholder
`picsum.photos/seed/<seed>` bernuansa abu-abu; dan bila berkas lokal tidak
ditemukan, gambar jatuh ke placeholder yang sama secara mulus (fallback
otomatis di `main.js`).

## Re-build CSS (setelah mengubah class Tailwind)

```bash
./build-css.sh    # mengompilasi src/input.css → assets/css/app.css --minify
```

## Fitur utama

- **36 artikel** berbahasa Indonesia di 7 rubrik (teknologi, tips, AI, produktivitas, pendidikan, bisnis, terkini)
- **20 ilustrasi editorial monokrom** khusus untuk artikel teknologi
- Hero carousel autoplay (jeda saat hover/fokus, geser-sentuh, keyboard ←/→, bilah progres)
- **Mode Baca** di halaman artikel: menyembunyikan distraksi, huruf lebih besar, pilihan tersimpan
- Mode gelap/terang (tersimpan di `localStorage`, mengikuti preferensi sistem)
- Parallax multi-lapisan + reveal saat scroll (menghormati `prefers-reduced-motion`)
- Menu mobile hamburger, tombol kembali-ke-atas dengan cincin progres
- Form kontak & newsletter dengan validasi inline + state sukses
- Filter arsip + pencarian + sortir real-time, tautan `?cat=` yang bisa dibagikan
- Halaman artikel: bilah progres baca, share (X/Facebook/WhatsApp/salin), artikel terkait, prev/next
- Ticker berita, akordeon FAQ, penghitung statistik animasi
- Halaman 404 kustom
- Aksesibilitas: skip link, ARIA lengkap, fokus terlihat, HTML semantik

## Kualitas

Seluruh halaman diverifikasi dengan rangkaian smoke test end-to-end
(Playwright, headless Chromium): **51 pemeriksaan fungsional & visual** —
navigasi, tema, carousel, filter arsip, validasi form, Mode Baca, fallback
gambar, dan halaman 404 — semuanya lulus tanpa error konsol.
