# Yuosant ID — Konsep dan Rencana Implementasi

Status dokumen: rancangan awal, bukan implementasi autentikasi.
Tanggal keputusan: 31 Oktober 2026.

## 1. Keputusan yang disetujui

1. **Model pendaftaran: hybrid**
   - Akun pengguna umum dapat aktif setelah menyelesaikan verifikasi email.
   - Pendaftaran tidak memberikan hak administrator.
   - Administrator dan hak akses khusus harus diberikan melalui persetujuan admin yang berwenang.
2. **Metode login tahap pertama:** email dan kata sandi, dengan verifikasi email dan pemulihan akun. Google Login dapat dipertimbangkan pada tahap berikutnya.
3. **Urutan integrasi:** bangun Yuosant ID terlebih dahulu sebagai identitas/profil terpusat, lalu integrasikan Yuosant AI dan Yuosant FinLab secara bertahap setelah audit kompatibilitas.

## 2. Tujuan

Menyediakan akun dan profil terpusat untuk ekosistem Yuosant tanpa memaksa migrasi serentak, mengganti autentikasi aplikasi yang sudah berjalan tanpa rencana, atau memindahkan data layanan secara prematur.

## 3. Alur pengguna yang direncanakan

### Pengguna umum
Daftar → verifikasi email → akun aktif → login → dashboard Yuosant ID.

### Administrator atau akses khusus
Permintaan akses → pemeriksaan oleh admin → persetujuan eksplisit → hak akses khusus diberikan.

Verifikasi email hanya membuktikan penguasaan alamat email, bukan identitas hukum pengguna.

## 4. Prinsip arsitektur

- Yuosant ID mengelola profil dan status akun terpusat.
- Data domain tiap aplikasi tetap berada pada aplikasi asal sampai rencana integrasi dan migrasi disetujui.
- Jangan menganggap login terpusat/SSO sudah tersedia sebelum tiap aplikasi terbukti mendukung protokol integrasi yang aman.
- Jangan menyimpan kata sandi dalam teks biasa; gunakan penyedia autentikasi tepercaya atau implementasi standar yang ditinjau dengan benar.
- Perubahan peran dilakukan di sisi server dan tidak dapat ditentukan sendiri oleh pengguna.
- Sediakan pemulihan akun, penonaktifan akun, perlindungan sesi, dan pencatatan aktivitas administratif.
- Pertahankan login Internet Identity dan riwayat chat Yuosant AI selama audit dan transisi.
- Jangan gunakan proyek Supabase Ruang Belajar Mr. Wahyu sebagai database Yuosant ID tanpa keputusan terpisah.

## 5. Tahapan kerja

### Tahap 0 — Audit baca-saja (belum lengkap)
- Periksa mekanisme autentikasi Yuosant AI, termasuk Internet Identity dan perilaku pengguna anonim.
- Konfirmasi bagaimana principal/identitas dikaitkan dengan percakapan dan bagaimana otorisasi backend diterapkan.
- Periksa mekanisme login dan penyimpanan data Yuosant FinLab.
- Periksa pilihan autentikasi dan database yang kompatibel serta biaya operasionalnya.
- Tidak melakukan perubahan pada kode produksi, domain/DNS, database, atau konfigurasi aplikasi aktif.

### Tahap 1 — Rancangan teknis
- Tetapkan penyedia autentikasi dan database berdasarkan audit.
- Definisikan model akun, status verifikasi, peran, layanan, serta pemetaan identitas eksternal.
- Tentukan strategi transisi pengguna lama dan pencegahan akun ganda.
- Definisikan ancaman, kontrol akses, dan rencana pemulihan.

### Tahap 2 — Implementasi terisolasi
- Buat halaman daftar, login, verifikasi email, pemulihan akun, profil, dan dashboard pada lingkungan pengembangan.
- Jangan hubungkan layanan produksi sebelum pengujian dan persetujuan.

### Tahap 3 — Uji
- Uji pendaftaran, verifikasi, login/logout, reset kata sandi, akses berbasis peran, sesi, dan pembatasan akses data.
- Uji bahwa pengguna tidak dapat membaca data pengguna lain atau menaikkan hak akses sendiri.

### Tahap 4 — Integrasi bertahap
- Mulai dengan satu layanan setelah kompatibilitas dikonfirmasi.
- Pertahankan jalur login lama selama periode transisi yang disetujui.
- Siapkan rollback sebelum perubahan produksi.

## 6. Kriteria sebelum implementasi autentikasi

Implementasi belum boleh dimulai sampai:
1. Mekanisme autentikasi internal Yuosant AI dan FinLab telah diperiksa.
2. Pilihan penyedia autentikasi, database, dan perkiraan biaya disetujui.
3. Strategi pemetaan akun lama dan penanganan akun ganda terdokumentasi.
4. Rencana pengujian, backup, dan rollback tersedia.
5. Persetujuan eksplisit diberikan sebelum perubahan produksi.

## 7. Status saat ini

- Keputusan produk: disetujui pengguna.
- Audit internal Caffeine: belum lengkap; screenshot Caffeine menyatakan Code view hanya tersedia di desktop.
- Penyedia autentikasi dan database: belum diputuskan.
- Domain khusus (misalnya id.yuosant.com): usulan saja, belum diputuskan atau dikonfigurasi.
- Implementasi autentikasi: belum dimulai.
- DNS/produksi: tidak diubah oleh dokumen ini.
