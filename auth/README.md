# Menjalankan Yuosant ID di lingkungan pengembangan

## Pilihan backend
Implementasi ini menggunakan Supabase Auth untuk email/kata sandi, verifikasi email, sesi, dan pemulihan akun. PostgreSQL menyimpan profil dan permintaan akses per layanan. Ini dipilih karena mendukung alur tersebut tanpa membangun penyimpanan kata sandi sendiri.

## Prasyarat
1. Buat proyek Supabase **khusus Yuosant ID**. Jangan gunakan proyek Ruang Belajar Mr. Wahyu karena itu milik aplikasi lain.
2. Di Supabase, aktifkan konfirmasi email dan atur URL redirect untuk lingkungan lokal/preview, termasuk `/auth/index.html` dan `/auth/reset.html`.
3. Terapkan `schema.supabase.sql` hanya pada proyek Yuosant ID yang baru.
4. Salin Project URL dan publishable key dari pengaturan API proyek, lalu isi `config.js`. Publishable key aman untuk frontend jika RLS dikonfigurasi dengan benar. Jangan pernah memasukkan `service_role` key ke frontend.
5. Jalankan dari server lokal atau preview hosting, bukan membuka file HTML dengan `file://`.

## Fitur yang ada pada branch ini
- Form pendaftaran dengan nama, email, dan kata sandi.
- Verifikasi email melalui Supabase Auth.
- Login email/kata sandi.
- Permintaan tautan pemulihan dan halaman penggantian kata sandi.
- Dashboard dasar untuk status akses Yuosant AI dan Yuosant FinLab.
- Permintaan akses per layanan, dengan status awal pending.
- RLS yang membatasi pembacaan permintaan pada pemilik akun; browser tidak diberi izin untuk menyetujui/menolak/mencabut akses.

## Yang belum selesai dan tidak boleh dianggap aktif
- Belum ada proyek backend Supabase khusus yang terhubung ke kode ini.
- Belum ada dashboard admin untuk memutuskan permintaan. Persetujuan harus dibuat sebagai server-side Edge Function dengan pemeriksaan admin yang tepercaya dan audit log.
- Belum ada proteksi akses di backend Yuosant AI/FinLab. Tombol dan status portal tidak cukup untuk keamanan layanan.
- Belum diuji end-to-end karena kredensial proyek khusus belum tersedia.

## Checklist sebelum disebut berfungsi
- [ ] Proyek Supabase khusus dibuat dan biaya/organisasi disetujui.
- [ ] URL dan publishable key diisi di lingkungan development.
- [ ] Email SMTP dan URL redirect dikonfigurasi; email verifikasi dan reset benar-benar diterima.
- [ ] RLS dan policy diperiksa melalui Security Advisor.
- [ ] Uji pendaftaran, verifikasi, login, logout, reset kata sandi, dan akun yang belum diverifikasi.
- [ ] Bangun admin Edge Function dengan otorisasi server-side.
- [ ] Uji bahwa pengguna tidak bisa mengubah status akses sendiri.
- [ ] Baru kemudian integrasikan dan uji backend tiap layanan secara terpisah.
