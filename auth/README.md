# Menjalankan Yuosant ID di lingkungan pengembangan

## Backend aktif
- Proyek Supabase khusus: **Yuosant ID** (aaprcsapvaacghuajfns), region Singapore.
- Project URL: https://aaprcsapvaacghuajfns.supabase.co.
- Backend terpisah dari proyek Ruang Belajar Mr. Wahyu.
- Frontend memakai publishable key saja melalui auth/config.js. Jangan pernah menaruh secret/service-role key di browser atau repository.

## Fitur frontend
- Pendaftaran dengan nama, email, dan kata sandi.
- Verifikasi email melalui Supabase Auth.
- Login, logout, dan pemulihan kata sandi.
- Dashboard dasar yang menampilkan status permintaan akses Yuosant AI dan Yuosant FinLab.
- Pengajuan akses per layanan. Pendaftaran tidak otomatis memberi akses.

## Database dan keamanan
- yuosant_profiles: profil akun dan status active/suspended/disabled.
- yuosant_service_access: satu permintaan per akun dan layanan.
- yuosant_admin_audit_log: jejak keputusan admin.
- RLS aktif pada ketiga tabel. Pengguna hanya dapat membaca profil/permintaan miliknya dan membuat permintaan pending.
- Trigger database membuat profil otomatis saat akun Auth dibuat.
- Tidak ada policy browser untuk mengubah status profil, menyetujui akses, atau menulis audit.
- Migrasi sumber ada di supabase/migrations/202611010001_yuosant_id_core_auth.sql.

## Edge Functions yang sudah di-deploy
- manage-service-access: menyetujui, menolak, mencabut akses, menangguhkan, dan mengaktifkan kembali akun. Memerlukan JWT admin dengan app_metadata.role = super_admin.
- check-service-access: memeriksa status akun dan persetujuan akses. Setiap backend layanan harus memanggil pemeriksaan ini dengan access token pengguna sebelum memberikan akses.
- Sumber fungsi ada di supabase/functions/.
- Fungsi memakai secret bawaan environment Supabase di server. Jangan pernah menyalin service-role key ke frontend.
- Audit log sengaja tidak memiliki policy untuk browser; hanya operasi server tepercaya yang dapat menulisnya.

## Belum selesai sebelum uji pengguna
1. Tetapkan akun pertama sebagai super admin melalui proses tepercaya setelah email admin ditentukan dan akun dibuat. Jangan pernah memberi role admin dari metadata pendaftaran pengguna.
2. Atur Auth Site URL dan Redirect URLs untuk URL preview/development yang benar, termasuk halaman /auth/index.html dan /auth/reset.html.
3. Pastikan SMTP pengiriman email terkonfigurasi dan uji email verifikasi serta reset. Email layanan bawaan Supabase memiliki batas pengiriman.
4. Uji end-to-end: daftar, verifikasi, login, logout, reset password, pengajuan akses, keputusan admin, penolakan pengguna non-admin, dan pemeriksaan entitlement.
5. Integrasikan check-service-access ke backend Yuosant AI dan FinLab. Sampai integrasi itu selesai, portal ini belum menjadi gerbang keamanan layanan.

## Cara cek akses
Panggil Edge Function check-service-access dengan bearer access token pengguna dan service_key=yuosant_ai atau yuosant_finlab. Backend layanan harus menolak akses jika hasil allowed bukan true.

## Batas lingkungan
Semua perubahan berada di branch feature/yuosant-id-auth-foundation dan proyek Supabase khusus. Jangan merge ke production, ubah DNS, atau ubah aplikasi AI/FinLab yang sedang berjalan tanpa persetujuan terpisah.
