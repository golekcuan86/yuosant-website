/* =========================================================
   Yuosant Journal — Konten & Data
   Semua halaman membaca data dari objek global YJ.data
   ========================================================= */
window.YJ = window.YJ || {};

YJ.data = {
  site: {
    name: 'Yuosant Journal',
    tagline: 'Learn something. Make it useful.',
    city: 'Indonesia',
    edition: 128
  },

  categories: {
    'tips':          { label: 'Tips & Trik',       desc: 'Perbaikan kecil dengan dampak besar — dari folder berantakan sampai baterai boros.' },
    'teknologi':     { label: 'Teknologi',         desc: 'Perangkat, aplikasi, dan sistem — diulas jujur, dijelaskan dengan tenang.' },
    'ai':            { label: 'AI',                desc: 'Kecerdasan buatan yang benar-benar berguna: pola kerja, alat, dan batasannya.' },
    'produktivitas': { label: 'Produktivitas',     desc: 'Sistem kerja dan belajar yang bisa Anda tiru mulai hari ini.' },
    'pendidikan':    { label: 'Pendidikan',        desc: 'Cara belajar yang efektif dan teknologi yang membantu, bukan mengganggu.' },
    'bisnis':        { label: 'Bisnis Digital',    desc: 'Strategi, studi kasus, dan pelajaran dari ekonomi digital Indonesia.' },
    'terkini':       { label: 'Terkini',           desc: 'Kabar terbaru yang sudah kami saring — pentingnya saja, tanpa gaduh.' }
  },

  authors: {
    'sinta': { name: 'Sinta Maharani',  role: 'Editor AI & Teknologi',     avatar: 'assets/img/people/yj-sinta.jpg', bio: 'Delapan tahun menulis tentang teknologi konsumen dan AI. Percaya alat terbaik adalah yang tidak membuat Anda pusing.' },
    'bimo':  { name: 'Bimo Aditama',    role: 'Penulis Produktivitas',     avatar: 'assets/img/people/yj-bimo.jpg',  bio: 'Menguji sistem kerja dan kebiasaan belajar, lalu melaporkan yang benar-benar bertahan setelah sebulan.' },
    'laras': { name: 'Laras Wulandari', role: 'Redaktur Pendidikan',       avatar: 'assets/img/people/yj-laras.jpg', bio: 'Mantan guru yang kini menulis tentang cara belajar — untuk siswa, guru, dan orang tua.' },
    'dafa':  { name: 'Dafa Alghifari',  role: 'Analis Bisnis Digital',     avatar: 'assets/img/people/yj-dafa.jpg',  bio: 'Mendampingi UMKM go online sejak 2019. Suka angka kecil yang jujur daripada janji besar yang samar.' },
    'nadia': { name: 'Nadia Kusuma',    role: 'Jurnalis Berita',           avatar: 'assets/img/people/yj-nadia.jpg', bio: 'Menyaring kabar teknologi harian menjadi yang penting saja. Anti-gaduh sejak lama.' },
    'pandu': { name: 'Pandu Wirawan',   role: 'Pendiri & Pemimpin Redaksi', avatar: 'assets/img/people/yj-pandu.jpg', bio: 'Mendirikan Yuosant Journal pada 2024 dengan satu keyakinan: informasi berguna tidak harus rumit.' }
  },

  articles: [
    {
      slug: 'prompt-ai-pekerja-kantoran',
      title: '7 Prompt AI yang Benar-Benar Berguna untuk Pekerja Kantoran',
      excerpt: 'Lupakan daftar “100 prompt terbaik” yang viral. Ini tujuh pola prompt yang kami pakai setiap hari untuk merangkum rapat, menyusun email sulit, dan membaca dokumen panjang.',
      category: 'ai', author: 'sinta', date: '2026-11-10', readTime: 7,
      hero: true, editorsPick: true,
      seed: 'yj-prompt-ai', img: 'assets/img/articles/prompt-ai-pekerja-kantoran.jpg', imgAlt: 'Ilustrasi meja kerja dengan laptop dan catatan prompt',
      tags: ['AI', 'Prompting', 'Produktivitas Kerja'],
      content: [
        { t: 'p', x: 'Setiap minggu ada saja daftar “100 prompt AI terbaik” yang beredar di media sosial. Kebanyakan tidak pernah dipakai dua kali. Dari ratusan pola yang kami coba di redaksi, hanya tujuh yang bertahan — karena benar-benar menghemat waktu, bukan sekadar terlihat pintar.' },
        { t: 'h2', x: 'Prinsipnya: brief yang jelas, bukan mantra' },
        { t: 'p', x: 'AI generatif bekerja seperti asisten baru yang cerdas tetapi tidak tahu konteks pekerjaan Anda. Semakin jelas situasi, peran, dan format hasil yang Anda minta, semakin jarang Anda kecewa. Satu kalimat konteks sering kali lebih berharga daripada lima baris perintah.' },
        { t: 'quote', x: 'Prompt yang baik adalah brief yang baik. AI hanya sejelas instruksi yang Anda berikan.', cite: 'Sinta Maharani' },
        { t: 'h2', x: 'Tujuh pola yang kami pakai hampir setiap hari' },
        { t: 'list', items: [
          'Rangkum rapat — “Berikut transkrip rapat 45 menit. Tulis 5 keputusan utama, 3 tindak lanjut beserta penanggung jawabnya, dan 1 hal yang masih menggantung.”',
          'Email sulit — “Saya perlu menolak penawaran ini tanpa merusak hubungan. Buatkan draf yang tegas tapi hangat, maksimal 120 kata.”',
          'Baca dokumen panjang — “Baca laporan berikut. Sebutkan 5 hal terpenting untuk seorang manajer operasional, lalu satu risiko yang mungkin terlewat.”',
          'Kritik draf saya — “Jangan perbaiki dulu. Sebutkan 3 kelemahan terbesar proposal ini dan mengapa.”',
          'Ubah nada — “Tulis ulang pesan ini agar santai untuk grup WhatsApp, tanpa mengubah pokoknya.”',
          'Tabel perbandingan — “Bandingkan opsi A dan B: biaya, waktu implementasi, risiko, dan untuk siapa masing-masing cocok.”',
          'Rencanakan minggu saya — “Berikut daftar tugas dan tenggat saya. Susun jadwal realistis Senin–Jumat dengan blok fokus maksimal 90 menit.”'
        ]},
        { t: 'h2', x: 'Batas yang perlu Anda jaga' },
        { t: 'p', x: 'Jangan pernah memasukkan data rahasia perusahaan atau data pribadi klien ke layanan AI publik. Dan selalu verifikasi fakta, angka, dan kutipan — AI mahir menyusun kalimat, bukan menjamin kebenaran.' },
        { t: 'p', x: 'Mulailah dari satu pola minggu ini. Begitu terasa hematnya, Anda tidak akan mau kembali ke cara lama.' }
      ]
    },
    {
      slug: 'aturan-ai-indonesia-kreator-umkm',
      title: 'Aturan Baru Tata Kelola AI: Apa Artinya bagi Kreator dan UMKM',
      excerpt: 'Pemerintah menyiapkan kerangka aturan kecerdasan buatan pertama di Indonesia. Kami rangkum tiga hal utama dan langkah praktis yang bisa Anda siapkan mulai sekarang.',
      category: 'terkini', author: 'nadia', date: '2026-11-11', readTime: 5,
      hero: true, editorsPick: false,
      seed: 'yj-aturan-ai', img: 'assets/img/articles/aturan-ai-indonesia-kreator-umkm.jpg', imgAlt: 'Gedung pemerintahan yang mengilustrasikan regulasi teknologi',
      tags: ['Regulasi', 'AI', 'Kreator', 'UMKM'],
      content: [
        { t: 'p', x: 'Pemerintah Indonesia tengah memfinalisasi kerangka tata kelola kecerdasan buatan yang akan menjadi acuan pertama bagi industri kreatif dan pelaku usaha. Dari draf yang beredar, aturan ini mengatur tiga hal utama: transparansi konten buatan AI, perlindungan data pribadi, dan tanggung jawab platform.' },
        { t: 'h2', x: 'Untuk kreator konten' },
        { t: 'p', x: 'Bila aturan ini disahkan, konten yang sebagian besar dibuat AI perlu diberi label yang jelas. Bagi kreator yang selama ini terbuka soal proses kerjanya, ini justru kabar baik — kepercayaan audiens menjadi keunggulan. Yang perlu disiapkan: dokumentasi alur kerja dan kebijakan penggunaan AI yang tertulis.' },
        { t: 'h2', x: 'Untuk UMKM' },
        { t: 'p', x: 'Pengusaha kecil yang memakai AI untuk deskripsi produk atau layanan pelanggan tidak dilarang. Namun Anda wajib memastikan data pelanggan tidak dipakai untuk melatih model tanpa izin. Praktik amannya sederhana: gunakan data agregat, anonimkan nama, dan simpan bukti persetujuan pelanggan.' },
        { t: 'quote', x: 'Regulasi yang baik tidak membunuh inovasi; ia membuat inovasi bisa dipercaya.', cite: 'Pengamat kebijakan digital yang kami hubungi' },
        { t: 'h2', x: 'Apa yang bisa Anda lakukan sekarang' },
        { t: 'list', items: [
          'Audit alat AI yang Anda pakai dan catat ke mana data Anda dikirim.',
          'Buat satu halaman kebijakan penggunaan AI di situs atau lapak Anda.',
          'Ikuti perkembangan dari sumber resmi, bukan rumor di grup chat.',
          'Biasakan memberi label konten AI sebelum diwajibkan — jadi Anda tidak panik nanti.'
        ]},
        { t: 'p', x: 'Catatan redaksi: artikel ini akan kami perbarui begitu naskah final aturan diterbitkan. Simpan tautannya dan cek kembali pekan depan.' }
      ]
    },
    {
      slug: 'deep-work-ritual-fokus-90-menit',
      title: 'Deep Work di Era Notifikasi: 5 Ritual untuk Fokus 90 Menit',
      excerpt: 'Masalahnya bukan niat — lingkungan kita memang dirancang untuk memecah perhatian. Lima ritual ini membantu redaksi kami menjaga jam kerja paling dalam sepanjang hari.',
      category: 'produktivitas', author: 'bimo', date: '2026-11-09', readTime: 6,
      hero: true, editorsPick: false,
      seed: 'yj-deepwork', img: 'assets/img/articles/deep-work-ritual-fokus-90-menit.jpg', imgAlt: 'Ruang kerja tenang tanpa notifikasi untuk kerja mendalam',
      tags: ['Deep Work', 'Fokus', 'Kebiasaan'],
      content: [
        { t: 'p', x: 'Kita semua tahu rasanya: baru lima belas menit bekerja, tangan sudah meraih ponsel. Masalahnya bukan niat Anda yang lemah — melainkan lingkungan kerja yang memang dirancang untuk memecah perhatian menjadi potongan-potongan kecil.' },
        { t: 'h2', x: 'Kenapa 90 menit?' },
        { t: 'p', x: 'Riset tentang ritme kerja otak menunjukkan siklus fokus alami berkisar 90 menit. Lebih pendek dari itu, Anda belum sempat masuk ke pekerjaan yang dalam; lebih panjang tanpa istirahat, kualitasnya menurun. Satu sesi 90 menit yang benar-benar fokus sering mengalahkan setengah hari kerja yang terputus-putus.' },
        { t: 'h2', x: 'Lima ritual yang terbukti di redaksi kami' },
        { t: 'list', items: [
          'Mulai dengan kalimat, bukan aplikasi — tulis satu kalimat tentang apa yang akan Anda selesaikan sebelum membuka apa pun.',
          'Satu layar, satu tugas — tutup semua tab yang tidak berhubungan; notifikasi dimatikan, bukan dikecilkan.',
          'Timer yang terlihat — pasang penghitung waktu di meja, bukan di ponsel yang bisa Anda utak-atik.',
          'Tanda “jangan ganggu” — di kantor kami, headphone besar berarti sedang menyelam. Buat kesepakatan serupa dengan tim Anda.',
          'Tutup dengan catatan untuk besok — sebelum berhenti, tulis langkah pertama untuk melanjutkan. Otak benci halaman kosong.'
        ]},
        { t: 'quote', x: 'Fokus bukan bakat. Ia adalah keputusan desain — tentang ruang, waktu, dan apa yang Anda izinkan masuk.' },
        { t: 'p', x: 'Coba satu sesi 90 menit besok pagi, sebelum membuka email. Banyak pembaca menyebut jam-jam itu sebagai jam paling mahal dalam hari mereka.' }
      ]
    },
    {
      slug: 'roadmap-belajar-coding-2026',
      title: 'Roadmap Belajar Coding 2026 yang Realistis untuk Pemula',
      excerpt: 'Sumber belajar melimpah justru bikin bingung mulai dari mana. Roadmap enam bulan ini disusun bersama dua mentor bootcamp dan satu engineering manager — dengan satu prinsip: bangun sesuatu sejak minggu pertama.',
      category: 'pendidikan', author: 'laras', date: '2026-11-08', readTime: 9,
      hero: true, editorsPick: false,
      seed: 'yj-coding-2026', img: 'assets/img/articles/roadmap-belajar-coding-2026.jpg', imgAlt: 'Layar laptop dengan kode dan buku catatan belajar',
      tags: ['Coding', 'Karier', 'Belajar Mandiri'],
      content: [
        { t: 'p', x: 'Belajar coding di 2026 terasa paradoks: sumber belajar melimpah ruah, tapi justru makin sulit tahu harus mulai dari mana. Roadmap ini kami susun dengan satu prinsip utama — Anda harus membangun sesuatu sejak minggu pertama, bukan sekadar menonton.' },
        { t: 'h2', x: 'Bulan 1–2: fondasi yang terlihat' },
        { t: 'p', x: 'Mulai dari HTML, CSS, dan JavaScript dasar. Targetnya bukan hafal sintaks, melainkan menyelesaikan tiga halaman kecil: profil diri, kalkulator sederhana, dan daftar tugas. Rasa “saya bisa membuat sesuatu” adalah bahan bakar terpenting di fase ini.' },
        { t: 'h2', x: 'Bulan 3–4: JavaScript sungguhan' },
        { t: 'p', x: 'Fokus pada logika: array, objek, fungsi, dan mengambil data dari API publik. Buat aplikasi cuaca atau katalog resep yang menarik data nyata. Di sinilah banyak pemula menyerah — jadwalkan 45 menit per hari, bukan maraton akhir pekan yang melelahkan.' },
        { t: 'h2', x: 'Bulan 5–6: pilih jalur, bangun portofolio' },
        { t: 'p', x: 'Pilih satu arah: web (React atau Vue), data (Python), atau mobile (Flutter). Jangan belajar ketiganya sekaligus. Tutup semester pertama dengan dua proyek yang bisa Anda ceritakan di wawancara — kualitas cerita lebih penting daripada jumlah repositori.' },
        { t: 'quote', x: 'Kurikulum terbaik adalah proyek yang Anda selesaikan, bukan kursus yang Anda koleksi.' },
        { t: 'h2', x: 'Kesalahan yang paling sering kami lihat' },
        { t: 'list', items: [
          'Terjebak menonton tutorial tanpa pernah membangun sendiri.',
          'Gonta-ganti bahasa pemrograman setiap dua minggu.',
          'Belajar sendirian tanpa komunitas atau mentor.',
          'Menunda melamar kerja sampai merasa “siap 100 persen” — hari itu tidak pernah datang.'
        ]},
        { t: 'p', x: 'Enam bulan dari sekarang, Anda bisa saja masih membanding-bandingkan kursus — atau sudah punya dua proyek yang membuat Anda dipercaya. Mulai minggu ini.' }
      ]
    },
    {
      slug: 'modal-500-ribu-bisnis-digital',
      title: 'Modal Rp500 Ribu: Memulai Bisnis Digital dari Nol',
      excerpt: 'Rp500 ribu tidak akan membelikan gudang atau karyawan. Tapi cukup untuk satu hal yang paling menentukan: memvalidasi bahwa ada orang yang mau membayar Anda.',
      category: 'bisnis', author: 'dafa', date: '2026-11-07', readTime: 8,
      hero: false, editorsPick: true,
      seed: 'yj-modal-500', img: 'assets/img/articles/modal-500-ribu-bisnis-digital.jpg', imgAlt: 'Meja kasir sederhana UMKM dengan kemasan produk',
      tags: ['Bisnis Digital', 'UMKM', 'Validasi'],
      content: [
        { t: 'p', x: 'Rp500 ribu tidak akan membelikan Anda gudang atau karyawan. Tapi jumlah itu cukup untuk satu hal yang menentukan hidup-mati bisnis: memvalidasi bahwa ada orang sungguhan yang mau membayar untuk keahlian atau produk Anda. Begini caranya, langkah demi langkah.' },
        { t: 'h2', x: 'Minggu 1: jual dulu, buat belakangan' },
        { t: 'p', x: 'Buka pre-order sederhana lewat WhatsApp Business (gratis) lengkap dengan katalog dan jam balasan. Tujuannya bukan omzet, melainkan bukti: adakah tiga orang di luar lingkaran keluarga Anda yang benar-benar memesan?' },
        { t: 'h2', x: 'Ke mana uangnya pergi' },
        { t: 'list', items: [
          'Rp150 ribu — domain .id untuk satu tahun, agar terlihat serius.',
          'Rp100 ribu — kuota khusus admin selama sebulan.',
          'Rp150 ribu — bahan atau contoh produk pertama.',
          'Rp100 ribu — cadangan iklan kecil untuk menguji pesan, bukan mengejar viral.'
        ]},
        { t: 'h2', x: 'Tiga model yang cocok untuk modal kecil' },
        { t: 'list', items: [
          'Jasa digital — desain slide, edit video pendek, atau menulis artikel. Modalnya waktu dan keahlian.',
          'Produk digital — template, panduan PDF, preset. Buat sekali, jual berkali-kali.',
          'Reseller terseleksi — pilih satu produk yang Anda pahami benar, bukan etalase acak.'
        ]},
        { t: 'quote', x: 'Bisnis kecil yang bertahan bukan yang paling inovatif, melainkan yang paling cepat mendengar pelanggan pertamanya.' },
        { t: 'p', x: 'Catat setiap pembeli pertama Anda. Sepuluh percakapan jujur dengan mereka lebih berharga daripada survei seribu orang.' }
      ]
    },
    {
      slug: 'notion-vs-obsidian',
      title: 'Notion vs Obsidian: Panduan Memilih “Otak Kedua” Anda',
      excerpt: 'Pertanyaan paling sering masuk ke redaksi. Jawaban singkatnya: tergantung apakah Anda butuh meja kerja bersama atau lemari arsip pribadi. Ini perbandingan jujur setelah setahun memakai keduanya.',
      category: 'produktivitas', author: 'bimo', date: '2026-11-05', readTime: 7,
      hero: false, editorsPick: true,
      seed: 'yj-notion-obsidian', img: 'assets/img/articles/notion-vs-obsidian.jpg', imgAlt: 'Perbandingan dua aplikasi catatan di layar',
      tags: ['Aplikasi', 'Catatan', 'PKM'],
      content: [
        { t: 'p', x: 'Pertanyaan yang paling sering masuk ke redaksi kami: “Harus pilih Notion atau Obsidian?” Jawaban singkatnya — tergantung apakah Anda lebih membutuhkan meja kerja bersama atau lemari arsip pribadi.' },
        { t: 'h2', x: 'Dua filosofi yang berbeda' },
        { t: 'p', x: 'Notion adalah basis data yang ramah: cocok untuk proyek tim, kalender konten, dan dokumen bersama. Obsidian adalah kumpulan catatan lokal yang saling terhubung: cocok untuk menulis, meneliti, dan berpikir jangka panjang tanpa bergantung pada server orang lain.' },
        { t: 'h2', x: 'Perbandingan cepat' },
        { t: 'list', items: [
          'Akses — Notion lebih bergantung internet; Obsidian sepenuhnya offline.',
          'Kolaborasi — Notion menang telak: komentar, tugas, dan izin sudah bawaan.',
          'Kepemilikan data — Obsidian menyimpan berkas teks biasa di perangkat Anda; Notion menyimpan di cloud mereka.',
          'Kurva belajar — Notion lebih cepat terasa masuk akal; Obsidian lebih cepat setelah Anda punya sistem.',
          'Ekosistem — Obsidian kaya plugin komunitas; Notion unggul di integrasi dan AI bawaan.'
        ]},
        { t: 'h2', x: 'Rekomendasi kami' },
        { t: 'p', x: 'Untuk tim kecil dan manajemen proyek: Notion. Untuk penulis, peneliti, dan siapa pun yang membangun “otak kedua” pribadi: Obsidian. Tidak ada aturan melarang memakai keduanya untuk fungsi berbeda — yang penting, jangan memindahkan catatan Anda setiap bulan.' },
        { t: 'p', x: 'Dan satu kebenaran yang tidak nyaman: alat tidak pernah menyelamatkan orang yang tidak punya kebiasaan mencatat. Mulai dari sepuluh menit menulis setiap malam, di aplikasi mana pun.' }
      ]
    },
    {
      slug: 'aturan-backup-3-2-1',
      title: 'Aturan Backup 3-2-1, Dijelaskan dengan Sederhana',
      excerpt: 'Cerita kehilangan data selalu dimulai dengan kalimat yang sama: “Saya kira sudah aman.” Aturan 3-2-1 adalah asuransi termurah yang pernah ada — begini penerapannya.',
      category: 'teknologi', author: 'sinta', date: '2026-11-04', readTime: 6,
      hero: false, editorsPick: true,
      seed: 'yj-backup-321', img: 'assets/img/articles/aturan-backup-3-2-1.jpg', imgAlt: 'Hard disk eksternal dan laptop sebagai simbol cadangan data',
      tags: ['Backup', 'Data', 'Keamanan'],
      content: [
        { t: 'p', x: 'Foto pernikahan di laptop yang dicuri. Skripsi di flashdisk yang tiba-tiba tidak terbaca. Arsip pelanggan di ponsel yang tercebur. Cerita kehilangan data selalu dimulai dengan kalimat yang sama: “Saya kira sudah aman.”' },
        { t: 'h2', x: 'Apa itu 3-2-1?' },
        { t: 'list', items: [
          '3 salinan data — satu berkas asli, dua cadangan.',
          '2 media berbeda — misalnya laptop plus hard disk eksternal.',
          '1 di luar rumah — di cloud atau disimpan di lokasi lain.'
        ]},
        { t: 'p', x: 'Kenapa harus serepot itu? Karena kegagalan jarang datang sendirian. Rumah kebanjiran bisa merenggut laptop dan hard disk sekaligus — kecuali salinan ketiga Anda ada di tempat lain.' },
        { t: 'h2', x: 'Rencana 30 menit untuk keluarga Anda' },
        { t: 'list', items: [
          'Hari ini — aktifkan pencadangan foto otomatis ke layanan cloud.',
          'Minggu ini — beli hard disk eksternal 1–2 TB dan salin seluruh dokumen penting.',
          'Tiap tiga bulan — pasang pengingat kalender untuk memperbarui cadangan dan mengecek berkas bisa dibuka.'
        ]},
        { t: 'quote', x: 'Cadangan yang tidak pernah diuji sama saja dengan harapan.' },
        { t: 'p', x: 'Sesekali, buka satu berkas acak dari cadangan Anda. Sepuluh detik itu memastikan sistemnya benar-benar bekerja — bukan cuma terasa bekerja.' }
      ]
    },
    {
      slug: 'keamanan-digital-keluarga',
      title: 'Keamanan Digital Keluarga: Checklist 15 Menit Malam Ini',
      excerpt: 'Anda tidak perlu jadi ahli keamanan siber untuk melindungi keluarga. Lima langkah ini menutup sebagian besar risiko umum — selesai sebelum teh Anda dingin.',
      category: 'teknologi', author: 'sinta', date: '2026-11-03', readTime: 5,
      hero: false, editorsPick: false,
      seed: 'yj-keamanan', img: 'assets/img/articles/keamanan-digital-keluarga.jpg', imgAlt: 'Ilustrasi kunci dan perangkat rumah tangga',
      tags: ['Keamanan', 'Keluarga', 'Privasi'],
      content: [
        { t: 'p', x: 'Sebagian besar pembobolan akun bukanlah operasi film Hollywood, melainkan pintu yang dibiarkan tidak terkunci. Lima langkah berikut menutup risiko yang paling umum — dan semuanya selesai dalam kurang lebih 15 menit.' },
        { t: 'h2', x: 'Checklist 15 menit' },
        { t: 'list', items: [
          'Aktifkan verifikasi dua langkah di email utama — email adalah kunci dari segala kunci Anda.',
          'Ganti kata sandi WiFi rumah dan akun admin router bawaan pabrik.',
          'Perbarui sistem operasi semua perangkat malam ini — jangan “besok”.',
          'Pasang pengelola kata sandi, lalu pindahkan lima akun terpenting Anda.',
          'Sepakati satu aturan keluarga: tautan hadiah dan “cek pemenang” selalu dicurigai.'
        ]},
        { t: 'h2', x: 'Untuk orang tua dan anak' },
        { t: 'p', x: 'Komunikasi mengalahkan penyadapan. Sepakati bahwa anak boleh bertanya apa pun soal pesan aneh tanpa dimarahi. Sebagian besar penipuan berhasil bukan karena teknologinya canggih, melainkan karena korban sungkan bertanya.' },
        { t: 'p', x: 'Keamanan digital bukan proyek sekali jadi — ia cuci tangan versi internet: sederhana, berulang, dan menyelamatkan.' }
      ]
    },
    {
      slug: 'ai-mengubah-guru-menilai-tugas',
      title: 'Bagaimana AI Mengubah Cara Guru Menilai Tugas',
      excerpt: 'Sekolah mulai bergeser dari “mendeteksi AI” ke “mendesain ulang tugas”. Begini bentuk penilaian yang muncul — dan apa yang bisa ditiru orang tua di rumah.',
      category: 'pendidikan', author: 'laras', date: '2026-11-02', readTime: 7,
      hero: false, editorsPick: false,
      seed: 'yj-guru-ai', img: 'assets/img/articles/ai-mengubah-guru-menilai-tugas.jpg', imgAlt: 'Ruang kelas modern dengan papan tulis dan laptop',
      tags: ['Pendidikan', 'AI', 'Guru'],
      content: [
        { t: 'p', x: 'Di sebuah SMA di Yogyakarta, guru Bahasa Indonesia kini membaca esai siswa dua kali: sekali untuk menilai isi, sekali untuk menebak mana yang dibuat AI. Skenario ini terjadi di mana-mana — dan sekolah mulai meresponsnya dengan cara yang lebih menarik daripada sekadar melarang.' },
        { t: 'h2', x: 'Dari deteksi ke desain ulang' },
        { t: 'p', x: 'Aplikasi pendeteksi AI terbukti kerap salah tebak, terutama pada tulisan siswa yang memang rapi. Karena itu, sekolah-sekolah progresif mengubah bentuk tugasnya: lebih banyak presentasi lisan, portofolio proses, dan refleksi yang ditulis langsung di kelas.' },
        { t: 'h2', x: 'AI sebagai asisten, bukan penulis bayangan' },
        { t: 'p', x: 'Sebagian guru justru mengajarkan penggunaan AI yang benar: meminta umpan balik atas draf, membuat kuis latihan dari catatan sendiri, atau meminta konsep dijelaskan dalam tiga tingkat kesulitan. Kuncinya satu — siswa wajib melampirkan riwayat percakapan AI-nya.' },
        { t: 'quote', x: 'Pertanyaannya bukan lagi “apakah siswa memakai AI”, melainkan “apakah siswa masih berpikir saat memakainya”.' },
        { t: 'h2', x: 'Yang bisa ditiru orang tua' },
        { t: 'list', items: [
          'Minta anak menjelaskan tugasnya dengan kata sendiri sebelum menyalin jawaban.',
          'Sediakan sesi belajar tanpa layar untuk materi yang butuh hafalan.',
          'Diskusikan satu berita tentang AI setiap minggu — literasi tumbuh dari percakapan.'
        ]},
        { t: 'p', x: 'Teknologi akan terus berubah. Kemampuan bertanya, menilai, dan menjelaskan — itulah kurikulum yang tidak akan kedaluwarsa.' }
      ]
    },
    {
      slug: 'studi-kasus-umkm-kopi-online',
      title: 'Dari Warung Kopi ke Marketplace: Studi Kasus UMKM Go Online',
      excerpt: 'Omzet warung kopi kecil di Semarang ini mentok di pelanggan itu-itu lagi. Dua tahun kemudian, 40 persen pendapatannya datang dari luar kota — lewat tiga keputusan sederhana.',
      category: 'bisnis', author: 'dafa', date: '2026-10-30', readTime: 8,
      hero: false, editorsPick: true,
      seed: 'yj-umkm-kopi', img: 'assets/img/articles/studi-kasus-umkm-kopi-online.jpg', imgAlt: 'Barista menyeduh kopi di warung kecil',
      tags: ['UMKM', 'Studi Kasus', 'Marketplace'],
      content: [
        { t: 'p', x: 'Kopi Kelana — nama samaran — adalah warung kopi kecil di gang dekat Simpang Lima, Semarang. Pada 2024, omzetnya mentok: pelanggan itu-itu lagi, harga bahan naik. Dua tahun kemudian, 40 persen pendapatannya datang dari pesanan luar kota. Perubahannya bukan aplikasi canggih, melainkan tiga keputusan sederhana.' },
        { t: 'h2', x: 'Satu: jual cerita, bukan kopi sachet' },
        { t: 'p', x: 'Alih-alih ikut perang harga di marketplace, warung ini menjual paket “Kopi Pagi Semarang” lengkap dengan kartu berisi cerita petani dan cara seduh yang benar. Produknya sama — nilainya berbeda.' },
        { t: 'h2', x: 'Dua: kuasai satu kanal dulu' },
        { t: 'p', x: 'Mereka tidak langsung hadir di semua platform. Enam bulan pertama hanya WhatsApp dan satu marketplace, dengan balasan cepat dan foto yang konsisten. Setelah ritme operasional terbentuk, barulah menambah kanal kedua dan ketiga.' },
        { t: 'h2', x: 'Tiga: data pelanggan adalah aset' },
        { t: 'p', x: 'Setiap pembeli dicatat — dengan izin — dan dikabari saat ada panen baru. Dari 800 kontak, peluncuran varian baru hampir selalu habis dalam seminggu, tanpa iklan.' },
        { t: 'quote', x: 'Digital tidak mengubah produk kami. Ia mengubah seberapa jauh cerita kami bisa berjalan.', cite: 'Pemilik Kopi Kelana' },
        { t: 'h2', x: 'Bisa ditiru minggu ini' },
        { t: 'list', items: [
          'Daftarkan usaha Anda ke profil bisnis di peta digital, unggah foto suasana, dan minta sepuluh ulasan jujur.',
          'Buat satu paket bundel dengan cerita — bukan sekadar diskon.',
          'Catat dua puluh pelanggan terbaik Anda dan sapa mereka bulan ini.'
        ]}
      ]
    },
    {
      slug: 'hemat-kuota-baterai-bekerja-mobile',
      title: 'Hemat Kuota dan Baterai Saat Bekerja dari Mana Saja',
      excerpt: 'Sepuluh pengaturan kecil yang membuat kuota dan baterai Anda bertahan sampai pekerjaan selesai — bukan sebaliknya.',
      category: 'tips', author: 'bimo', date: '2026-10-29', readTime: 4,
      hero: false, editorsPick: false,
      seed: 'yj-hemat', img: 'assets/img/articles/hemat-kuota-baterai-bekerja-mobile.jpg', imgAlt: 'Ponsel dan power bank di meja kafe',
      tags: ['Tips', 'Mobile', 'Hemat'],
      content: [
        { t: 'p', x: 'Bekerja dari kafe, kereta, atau bandara punya dua musuh yang sama: kuota yang menipis dan baterai yang merah sebelum presentasi dimulai. Kabar baiknya, keduanya lebih banyak soal pengaturan daripada soal membeli perangkat baru.' },
        { t: 'h2', x: 'Lima penyelamat kuota' },
        { t: 'list', items: [
          'Unduh peta offline untuk kota tujuan sebelum berangkat.',
          'Matikan autoplay video di media sosial — penyedot kuota nomor satu.',
          'Aktifkan mode hemat data saat tethering ke laptop.',
          'Unduh dokumen dan lampiran penting saat masih di WiFi.',
          'Batasi sinkronisasi foto cloud ke jaringan WiFi saja.'
        ]},
        { t: 'h2', x: 'Lima penyelamat baterai' },
        { t: 'list', items: [
          'Turunkan kecerahan layar — layar adalah konsumen daya terbesar.',
          'Gunakan mode gelap pada layar OLED; piksel hitam benar-benar padam.',
          'Matikan 5G saat sinyal lemah — ponsel bekerja ekstra keras mencarinya.',
          'Tutup aplikasi peta dan kamera begitu selesai dipakai.',
          'Bawa kabel sendiri; colokan umum lebih lambat dari dugaan Anda.'
        ]},
        { t: 'p', x: 'Tidak ada yang heroik di sini. Tapi pekerjaan yang selesai tepat waktu sering kali ditentukan oleh persiapan sepuluh menit semacam ini.' }
      ]
    },
    {
      slug: 'iphone-vs-android-produktivitas',
      title: 'iPhone vs Android untuk Produktivitas: Perbandingan Jujur 2026',
      excerpt: 'Tanpa fanatisme, tanpa gengsi. Kami memakai keduanya sebulan penuh untuk bekerja — ini temuan yang sebenarnya penting.',
      category: 'teknologi', author: 'sinta', date: '2026-10-27', readTime: 8,
      hero: false, editorsPick: false,
      seed: 'yj-iphone-android', img: 'assets/img/articles/iphone-vs-android-produktivitas.jpg', imgAlt: 'Dua ponsel berdampingan di atas meja kerja',
      tags: ['Ponsel', 'Perbandingan', 'Kerja Mobile'],
      content: [
        { t: 'p', x: 'Debat iPhone versus Android biasanya berakhir di gengsi, bukan fakta. Kami mencoba pendekatan lain: dua anggota redaksi bertukar ekosistem selama sebulan dan mencatat apa yang benar-benar berpengaruh pada pekerjaan.' },
        { t: 'h2', x: 'Yang iPhone lakukan lebih baik' },
        { t: 'list', items: [
          'Konsistensi aplikasi kerja — pembaruan dan tampilan lebih seragam antar aplikasi.',
          'Ekosistem lintas perangkat — menyalin teks di ponsel lalu menempelnya di laptop terasa sulap.',
          'Umur dukungan — pembaruan sistem lima sampai enam tahun membuat ponsel tetap layak jual.'
        ]},
        { t: 'h2', x: 'Yang Android lakukan lebih baik' },
        { t: 'list', items: [
          'Fleksibilitas berkas — mengelola dokumen seperti di komputer, tanpa perantara.',
          'Pilihan harga — ponsel Rp3 jutaan hari ini sudah sangat layak untuk kerja berat.',
          'Kustomisasi notifikasi — lebih mudah membuat ponsel diam saat Anda perlu fokus.',
          'Dual SIM dan penyimpanan tambahan — praktis untuk yang memisahkan nomor kerja.'
        ]},
        { t: 'quote', x: 'Ponsel terbaik untuk produktivitas adalah yang tidak Anda pikirkan saat sedang bekerja.' },
        { t: 'h2', x: 'Jadi pilih yang mana?' },
        { t: 'p', x: 'Jika Anda sudah memakai laptop Apple, iPhone memangkas banyak gesekan. Jika Anda butuh fleksibilitas dan ponsel yang tulus pada dompet, Android kelas menengah 2026 sudah lebih dari cukup. Yang jelas: keduanya kalah penting dibanding kebiasaan kerja Anda sendiri.' }
      ]
    },
    {
      slug: 'newsletter-aset-audiens',
      title: 'Newsletter sebagai Aset: Membangun Audiens yang Anda Miliki Sendiri',
      excerpt: 'Algoritma bisa berubah semalam dan jangkauan Anda ikut amblas. Daftar email tidak. Begini cara memulai dari 100 nama pertama.',
      category: 'bisnis', author: 'dafa', date: '2026-10-25', readTime: 7,
      hero: false, editorsPick: false,
      seed: 'yj-newsletter-aset', img: 'assets/img/articles/newsletter-aset-audiens.jpg', imgAlt: 'Amplop dan surat kabar sebagai simbol newsletter',
      tags: ['Newsletter', 'Kreator', 'Strategi'],
      content: [
        { t: 'p', x: 'Jangkauan organik media sosial kerap di bawah lima persen — dan bisa berubah semalam karena keputusan yang tidak Anda kendalikan. Daftar email bekerja sebaliknya: setiap nama di dalamnya adalah orang yang benar-benar meminta Anda hadir.' },
        { t: 'h2', x: 'Hitungan yang jarang disadari' },
        { t: 'p', x: 'Newsletter yang sehat memiliki open rate 35–45 persen. Dengan 2.000 pelanggan, setiap terbit menjangkau sekitar 800 pembaca nyata. Bandingkan dengan 10.000 pengikut yang mungkin hanya melihat 300 pasang mata — dan itupun jika algoritma sedang baik hati.' },
        { t: 'h2', x: 'Mulai dari 100 nama' },
        { t: 'list', items: [
          'Tentukan satu janji isi — misalnya “satu tips bisnis digital setiap Selasa, bisa dibaca tiga menit”.',
          'Pasang form langganan di semua titik: bio, situs, dan akhir setiap konten.',
          'Tulis seolah untuk satu orang yang Anda kenal, bukan untuk “para pembaca”.',
          'Konsisten enam bulan sebelum menilai hasil — newsletter adalah bunga majemuk dari kepercayaan.'
        ]},
        { t: 'quote', x: 'Media sosial meminjamkan Anda audiens; email membuat Anda memilikinya.' },
        { t: 'p', x: 'Dan ketika suatu hari Anda punya sesuatu untuk dijual — buku, kelas, atau jasa — 800 orang itu adalah yang pertama mendengarnya.' }
      ]
    },
    {
      slug: 'metode-feynman-belajar-dengan-ai',
      title: 'Belajar Apa Pun Lebih Cepat: Metode Feynman Ditambah AI',
      excerpt: 'Richard Feynman punya cara brutal menguji pemahaman: jelaskan seolah kepada anak 12 tahun. Di 2026, pasangan latihan terbaiknya adalah chatbot.',
      category: 'pendidikan', author: 'laras', date: '2026-10-23', readTime: 6,
      hero: false, editorsPick: false,
      seed: 'yj-feynman', img: 'assets/img/articles/metode-feynman-belajar-dengan-ai.jpg', imgAlt: 'Papan tulis dengan diagram penjelasan sederhana',
      tags: ['Belajar', 'Metode Feynman', 'AI'],
      content: [
        { t: 'p', x: 'Richard Feynman, fisikawan peraih Nobel, punya cara brutal untuk menguji pemahaman: jelaskan konsep itu seolah kepada anak berusia 12 tahun. Bagian yang Anda tutup-tutupi dengan jargon — di situlah Anda sebenarnya belum paham.' },
        { t: 'h2', x: 'Protokol empat langkah' },
        { t: 'list', items: [
          'Pilih satu konsep dan tulis penjelasan polos tanpa membuka buku atau catatan.',
          'Minta AI berperan sebagai pendengar kritis: “Ajukan 5 pertanyaan yang akan ditanyakan orang awam yang skeptis.”',
          'Perbaiki bagian yang goyah, lalu ulangi sampai penjelasan Anda sederhana dan tetap akurat.',
          'Uji di dunia nyata: jelaskan ke teman, atau tulis sebagai postingan pendek.'
        ]},
        { t: 'quote', x: 'Kalau Anda tidak bisa menjelaskannya dengan sederhana, Anda belum benar-benar memahaminya.' },
        { t: 'h2', x: 'Contoh: memahami inflasi dalam 25 menit' },
        { t: 'p', x: 'Pembaca kami mencoba protokol ini untuk topik inflasi. Draf pertamanya penuh istilah seperti “agregat permintaan”. Setelah dua putaran pertanyaan kritis dari chatbot, versi finalnya begini: “Inflasi itu keadaan ketika uangmu tahun depan bisa membeli lebih sedikit daripada hari ini.” Jauh lebih jujur pada diri sendiri.' },
        { t: 'p', x: 'Metode ini berhasil untuk biologi, akuntansi, sampai memahami kontrak kerja. Syaratnya cuma satu: jangan berbohong pada langkah pertama.' }
      ]
    },
    {
      slug: 'sistem-folder-30-menit',
      title: 'Sistem Folder 30 Menit untuk Merapikan Desktop Digital Anda',
      excerpt: 'Bukan aplikasi baru yang Anda butuhkan — melainkan empat folder dan satu ritual Jumat. Selesaikan malam ini, rasakan bedanya Senin pagi.',
      category: 'tips', author: 'bimo', date: '2026-10-21', readTime: 5,
      hero: false, editorsPick: false,
      seed: 'yj-folder', img: 'assets/img/articles/sistem-folder-30-menit.jpg', imgAlt: 'Layar komputer dengan susunan folder rapi',
      tags: ['Tips', 'Organisasi', 'Digital Minimalism'],
      content: [
        { t: 'p', x: 'Desktop yang penuh ikon bukan tanda sibuk — ia tanda tidak ada sistem. Kabar baiknya: Anda tidak butuh aplikasi baru. Anda butuh empat folder dan satu ritual sepuluh menit.' },
        { t: 'h2', x: 'Aturan satu-satunya: setiap berkas punya rumah' },
        { t: 'list', items: [
          '00–Masuk — semua unduhan baru mendarat di sini, dikosongkan setiap Jumat.',
          '10–Proyek Aktif — satu folder per pekerjaan yang sedang berjalan. Selesai? Pindah.',
          '20–Arsip — proyek selesai, dikelompokkan per tahun. Jarang dibuka, selalu ada.',
          '30–Referensi — template, panduan, dan hal-hal yang Anda pakai berulang.'
        ]},
        { t: 'h2', x: 'Ritual Jumat sepuluh menit' },
        { t: 'p', x: 'Setiap Jumat sore, kosongkan folder Masuk: simpan yang penting ke rumahnya, hapus sisanya tanpa drama. Sepuluh menit ini adalah harga dari Senin pagi yang tenang.' },
        { t: 'p', x: 'Angka di depan nama folder bukan hiasan — ia memaksa urutan yang sama di setiap komputer dan layanan cloud. Setelah dua minggu, tangan Anda mencari berkas tanpa berpikir.' }
      ]
    },
    {
      slug: 'rekap-teknologi-pekan-ini',
      title: 'Rekap Pekan Ini: 3 Kabar Penting, 1 Tren, 1 yang Bisa Diabaikan',
      excerpt: 'Rubrik mingguan kami: kabar teknologi yang sudah disaring sampai tinggal yang berdampak untuk pembaca Indonesia.',
      category: 'terkini', author: 'nadia', date: '2026-11-09', readTime: 4,
      hero: false, editorsPick: false,
      seed: 'yj-rekap', img: 'assets/img/articles/rekap-teknologi-pekan-ini.jpg', imgAlt: 'Meja redaksi dengan tumpukan koran dan kopi',
      tags: ['Rekap', 'Berita', 'Mingguan'],
      content: [
        { t: 'p', x: 'Setiap pekan, ratusan kabar teknologi bersaing merebut perhatian Anda. Rubrik ini melakukan bagian yang membosankan — membaca semuanya — supaya Anda tinggal menyimak yang penting. Catatan: ini edisi contoh dari format rekap mingguan kami.' },
        { t: 'h2', x: 'Tiga kabar yang berdampak' },
        { t: 'list', items: [
          'Internet makin merata — perluasan jaringan terus menyasar desa; artinya pasar digital Anda makin luas, dan makin ramai.',
          'Fitur anti-penipuan jadi standar — aplikasi perbankan dan dompet digital berlomba menambah deteksi transaksi mencurigakan secara otomatis.',
          'AI masuk ruang kerja kecil — alat otomasi yang dulu mahal kini terjangkau UMKM; pembeda bukan lagi punya atau tidak, melainkan pakai dengan benar atau asal.'
        ]},
        { t: 'h2', x: 'Satu tren yang layak dipantau' },
        { t: 'p', x: 'Pencarian suara dan jawaban instan mengubah cara orang menemukan informasi. Untuk pemilik bisnis: konten yang menjawab pertanyaan dengan jelas akan semakin berharga dibanding konten yang sekadar ramai kata kunci.' },
        { t: 'h2', x: 'Dan yang bisa Anda abaikan' },
        { t: 'p', x: 'Gosip peluncuran gawai tanpa sumber resmi. Minggu depan akan ada lagi — dan lagi. Simpan perhatian Anda untuk hal yang bisa Anda tindaklanjuti.' }
      ]
    }
  ],

  testimonials: [
    {
      quote: 'Newsletter Selasa-nya selalu saya tunggu. Penjelasannya runtut, tidak bertele-tele, dan langsung bisa dipraktikkan di pekerjaan saya.',
      name: 'Anisa Rahma', role: 'Mahasiswa Pascasarjana, Yogyakarta', seed: 'yj-r-anisa'
    },
    {
      quote: 'Sebagai pemilik UMKM, panduan bisnis digital di sini terasa membumi. Studi kasusnya mirip dengan kondisi usaha saya.',
      name: 'Fajar Nugroho', role: 'Pemilik Kopi Kelana, Semarang', seed: 'yj-r-fajar'
    },
    {
      quote: 'Saya pakai artikel tentang AI di kelas untuk bahan diskusi. Bahasanya mudah dipahami tanpa mengorbankan substansi.',
      name: 'Reni Wijaya', role: 'Guru SMA, Surabaya', seed: 'yj-r-reni'
    },
    {
      quote: 'Banyak situs teknologi menulis untuk mesin pencari. Yuosant Journal jelas menulis untuk manusia.',
      name: 'Kevin Halim', role: 'Software Engineer, Bandung', seed: 'yj-r-kevin'
    },
    {
      quote: 'Rutinitas deep work dari artikel Bimo mengubah cara saya bekerja. Tiga bulan konsisten, tesis saya akhirnya kelar.',
      name: 'Yoga Saputra', role: 'Peneliti, Jakarta', seed: 'yj-r-yoga'
    }
  ]
};

/* =========================================================
   20 artikel teknologi tambahan — masing-masing dengan
   ilustrasi monokrom lokal di assets/img/articles/
   ========================================================= */
YJ.data.articles = YJ.data.articles.concat([
  {
    slug: '5g-vs-wifi-rumahan',
    title: '5G Makin Merata: Kapan Waktunya Berhenti Langganan WiFi Rumahan?',
    excerpt: 'Paket data besar makin murah dan 5G makin stabil. Kami hitung titik impasnya: siapa yang sudah bisa hidup tanpa WiFi rumahan, dan siapa yang belum.',
    category: 'teknologi', author: 'sinta', date: '2026-11-10', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-5g', img: 'assets/img/articles/5g-vs-wifi-rumahan.jpg',
    imgAlt: 'Ilustrasi menara 5G dan router WiFi rumahan',
    tags: ['5G', 'Internet Rumah', 'WiFi'],
    content: [
      { t: 'p', x: 'Lima tahun lalu pertanyaan ini terdengar konyol. Hari ini tidak: jangkauan 5G sudah menutupi sebagian besar kota kecil, dan paket data ratusan gigabyte dijual seharga satu kali makan keluarga. Wajar jika banyak yang bertanya — masih perlukah WiFi rumahan?' },
      { t: 'h2', x: 'Hitung dulu pemakaian Anda' },
      { t: 'p', x: 'Patokan cepat: streaming 4K menyedot sekitar 7 GB per jam, meeting video 1–2 GB per jam, dan unduhan game gampang menembus 100 GB sekali jalan. Keluarga empat orang yang aktif bisa menghabiskan 500 GB sebulan tanpa terasa. Sebagian besar paket “tanpa batas” seluler tetap punya batas pemakaian wajar (FUP) — baca huruf kecilnya.' },
      { t: 'h2', x: 'Kapan 5G cukup, kapan tetap WiFi' },
      { t: 'list', items: [
        '5G saja cukup bila — Anda tinggal sendiri, kerja dominan dokumen dan meeting, dan jarang mengunduh berkas raksasa.',
        'Tetap pasang WiFi bila — ada TV 4K yang menyala tiap malam, konsol game, perangkat smart home, atau lebih dari dua pengguna berat.',
        'Kombinasi paling tangguh — WiFi sebagai jalur utama, 5G sebagai cadangan tethering saat listrik atau kabel optik bermasalah.'
      ]},
      { t: 'quote', x: 'Internet yang konsisten 50 Mbps lebih produktif daripada 500 Mbps yang naik-turun. Stabilitas mengalahkan angka di brosur.' },
      { t: 'p', x: 'Sebelum memutuskan kontrak, uji sebulan penuh: tethering dari ponsel untuk semua pekerjaan, sambil mencatat pemakaian dan seberapa sering koneksi kedap-kedip di jam sibuk. Data Anda sendiri lebih jujur daripada peta cakupan mana pun.' }
    ]
  },
  {
    slug: 'wifi-7-untuk-rumah',
    title: 'WiFi 7 untuk Rumah: Kebutuhan atau Gengsi?',
    excerpt: 'Router WiFi 7 sudah turun ke harga Rp1,5 jutaan. Kami bedah fitur yang benar-benar terasa di rumah biasa — dan syarat agar tidak mubazir.',
    category: 'teknologi', author: 'sinta', date: '2026-11-08', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-wifi7', img: 'assets/img/articles/wifi-7-untuk-rumah.jpg',
    imgAlt: 'Ilustrasi router WiFi dengan gelombang sinyal',
    tags: ['WiFi 7', 'Router', 'Jaringan'],
    content: [
      { t: 'p', x: 'Setiap generasi WiFi datang dengan janji angka yang memabukkan: WiFi 7 mengklaim empat kali lebih cepat dari WiFi 6. Tapi angka laboratorium jarang selamat sampai ruang tamu. Begini terjemahannya untuk rumah biasa.' },
      { t: 'h2', x: 'Fitur yang benar-benar terasa' },
      { t: 'p', x: 'Bintang utamanya bukan kecepatan mentah, melainkan Multi-Link Operation (MLO): perangkat bisa menyambung ke beberapa pita frekuensi sekaligus dan berpindah tanpa jeda. Efeknya? Meeting video yang tidak lagi patah-patah saat tetangga menyalakan microwave, dan cloud gaming yang latensinya konsisten.' },
      { t: 'h2', x: 'Syarat agar uangnya tidak hangus' },
      { t: 'list', items: [
        'Internet Anda memang di atas 300 Mbps — kalau paket 100 Mbps, router mahal hanya mempercepat antrean yang tetap sempit.',
        'Ponsel dan laptop Anda sudah mendukung WiFi 6E/7 — perangkat lama tidak ikut merasakan apa-apa.',
        'Rumah banyak sekat beton atau lebih dari 15 perangkat tersambung bersamaan.'
      ]},
      { t: 'quote', x: 'Router adalah satu-satunya perangkat yang Anda salahkan setiap hari tapi tidak pernah Anda ganti.' },
      { t: 'p', x: 'Kesimpulan kami sederhana: kalau router Anda sudah berusia lima tahun, naik ke WiFi 7 adalah loncatan yang pantas. Kalau router WiFi 6 Anda masih sehat, uangnya lebih berdampak dipakai menambah titik akses atau menaikkan paket internet.' }
    ]
  },
  {
    slug: 'era-baterai-8000mah',
    title: 'Era Baterai 8.000 mAh: Apa yang Berubah dari Ponsel 2026',
    excerpt: 'Ponsel yang hidup dua hari bukan lagi barang aneh. Kunci perubahannya ada pada baterai silicon-carbon — ini penjelasan dan dampaknya pada kebiasaan mengecas Anda.',
    category: 'teknologi', author: 'nadia', date: '2026-11-06', readTime: 5,
    hero: false, editorsPick: false,
    seed: 'yj-baterai', img: 'assets/img/articles/era-baterai-8000mah.jpg',
    imgAlt: 'Ilustrasi penampang baterai ponsel berkapasitas besar',
    tags: ['Baterai', 'Ponsel', 'Tren 2026'],
    content: [
      { t: 'p', x: 'Diam-diam, salah satu lompatan terbesar ponsel tahun ini bukan kamera atau AI — melainkan baterai. Ponsel kelas menengah 2026 banyak yang mengusung 7.000 sampai 8.000 mAh dalam bodi yang tetap ramping. Rahasianya: baterai silicon-carbon.' },
      { t: 'h2', x: 'Apa itu silicon-carbon, dengan bahasa dapur' },
      { t: 'p', x: 'Baterai lithium-ion tradisional memakai anoda grafit. Mengganti sebagian grafit dengan silikon membuat anoda mampu menampung jauh lebih banyak ion lithium per gram. Hasilnya: kapasitas naik 20–30 persen tanpa ponsel harus menebal seperti batu bata.' },
      { t: 'h2', x: 'Yang berubah dalam kehidupan sehari-hari' },
      { t: 'list', items: [
        'Ponsel “dua hari” menjadi normal — pola pikir berubah dari “ngecas tiap malam” menjadi “ngecas kalau ingat”.',
        'Power bank turun dari kewajiban menjadi barang darurat.',
        'Cas pelan semalaman kembali masuk akal, dan lebih ramah umur baterai daripada cas kilat 100W tiap hari.',
        'Siklus pakai makin panjang: tiga tahun pemakaian tidak lagi identik dengan baterai ngos-ngosan.'
      ]},
      { t: 'p', x: 'Satu kebiasaan tetap abadi: usahakan baterai bermain di rentang 20–80 persen. Teknologi boleh berubah, kimia baterai punya aturan sendiri.' }
    ]
  },
  {
    slug: 'browser-ai-ringkas-halaman',
    title: 'Browser Ber-AI: Merangkum Halaman Web Sekali Klik, Kami Uji Seminggu',
    excerpt: 'Fitur “ringkas halaman ini” kini ada di hampir semua browser besar. Berguna sampai mana? Kami pakai untuk kerja redaksi selama seminggu penuh.',
    category: 'ai', author: 'sinta', date: '2026-11-05', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-browser-ai', img: 'assets/img/articles/browser-ai-ringkas-halaman.jpg',
    imgAlt: 'Ilustrasi jendela browser dengan panel rangkuman AI',
    tags: ['Browser', 'AI', 'Riset'],
    content: [
      { t: 'p', x: 'Dulu merangkum artikel panjang butuh disiplin: baca, sorot, catat. Sekarang hampir semua browser besar menyediakan tombol “ringkas halaman ini”. Kami memakainya untuk pekerjaan riset redaksi selama seminggu — hasilnya campuran.' },
      { t: 'h2', x: 'Yang ternyata benar-benar berguna' },
      { t: 'list', items: [
        'Menyaring sebelum membaca — lima detik untuk tahu artikel 4.000 kata layak dibaca penuh atau tidak.',
        'Membedah halaman produk — “apa saja yang tidak termasuk garansi?” dijawab tanpa scroll maraton.',
        'Membandingkan dua tab — minta ringkasan dua halaman spesifikasi lalu bandingkan titik bedanya.',
        'Tanya-jawab ke halaman — “bagian mana yang membahas harga?” langsung melompat ke paragraf yang tepat.'
      ]},
      { t: 'h2', x: 'Yang perlu diwaspadai' },
      { t: 'p', x: 'Ringkasan AI cenderung menghaluskan nuansa dan sesekali salah menangkap angka — misalnya menukar “naik 3 persen” dengan “naik 3 kali”. Untuk keputusan penting, ringkasan adalah peta, bukan wilayahnya. Selalu klik sumber aslinya.' },
      { t: 'quote', x: 'Ringkasan yang baik membuat Anda tahu mana yang layak dibaca lengkap — bukan menggantikan membaca itu sendiri.' },
      { t: 'p', x: 'Terakhir, soal privasi: cek pengaturan browser Anda. Sebagian fitur mengirim isi halaman ke server untuk diproses. Untuk dokumen internal kantor, matikan dulu tombol ajaibnya.' }
    ]
  },
  {
    slug: 'panel-surya-atap-rumah-tipe-36',
    title: 'Panel Surya Atap untuk Rumah Tipe 36: Hitungan Jujur Sebelum Telepon Pemasang',
    excerpt: 'Harga panel terus turun dan tagihan listrik terus naik. Kami hitung skenario rumah kecil: berapa biaya, berapa hemat, dan kapan benar-benar balik modal.',
    category: 'teknologi', author: 'dafa', date: '2026-11-03', readTime: 8,
    hero: false, editorsPick: false,
    seed: 'yj-solar', img: 'assets/img/articles/panel-surya-atap-rumah-tipe-36.jpg',
    imgAlt: 'Ilustrasi atap rumah dengan panel surya di bawah matahari',
    tags: ['Energi', 'Panel Surya', 'Rumah'],
    content: [
      { t: 'p', x: 'Pertanyaan “perlu pasang panel surya atau tidak” akhirnya bisa dijawab dengan matematika, bukan iming-iming brosur. Kami pakai contoh nyata: rumah tipe 36 di pinggir Semarang dengan daya listrik 1.300 VA.' },
      { t: 'h2', x: 'Hitungan kasarnya' },
      { t: 'p', x: 'Rumah seperti itu umumnya memakai 180–220 kWh per bulan. Sistem atap 2 kWp di Jawa Tengah menghasilkan sekitar 220 kWh per bulan saat cerah normal — artinya hampir seluruh kebutuhan siang bisa ditanggung matahari. Biaya pasang saat ini berkisar Rp18–25 juta tergantung merek inverter dan komponen.' },
      { t: 'h2', x: 'Lalu kapan balik modal?' },
      { t: 'p', x: 'Dengan penghematan tagihan sekitar Rp250–350 ribu per bulan, titik impas jatuh di tahun ke-7 sampai ke-9. Setelah itu, panel yang umurnya 25 tahun bekerja seperti pohon uang yang tumbuh pelan tapi pasti.' },
      { t: 'h2', x: 'Ceklis sebelum menelepon pemasang' },
      { t: 'list', items: [
        'Arah dan kemiringan atap — menghadap timur–barat masih oke, atap teduh penuh tidak.',
        'Bayangan — satu pohon besar bisa memangkas produksi 20 persen; pangkas dulu, pasang kemudian.',
        'Urus mekanisme ekspor-impor listrik ke PLN sejak awal — jangan setelah alat terpasang.',
        'Minta simulasi produksi tertulis, bukan janji lisan.'
      ]},
      { t: 'quote', x: 'Panel surya adalah instrumen kesabaran finansial — untungnya terasa di tahun kelima, bukan bulan kelima.' }
    ]
  },
  {
    slug: 'nas-rumahan-perpustakaan-keluarga',
    title: 'NAS Rumahan: Membangun Perpustakaan Digital Keluarga Sendiri',
    excerpt: 'Sepuluh tahun foto keluarga berceceran di tiga ponsel dan dua hard disk. Satu kotak kecil bernama NAS bisa merapikan semuanya — begini resep hematnya.',
    category: 'teknologi', author: 'sinta', date: '2026-10-30', readTime: 7,
    hero: false, editorsPick: false,
    seed: 'yj-nas', img: 'assets/img/articles/nas-rumahan-perpustakaan-keluarga.jpg',
    imgAlt: 'Ilustrasi kotak NAS dengan berkas foto mengalir masuk',
    tags: ['NAS', 'Penyimpanan', 'Foto'],
    content: [
      { t: 'p', x: 'Di banyak keluarga, arsip foto hidup seperti dapur tanpa lemari: ada di mana-mana dan hilang saat dicari. NAS — Network Attached Storage — adalah lemarinya.' },
      { t: 'h2', x: 'Apa itu NAS, tanpa jargon' },
      { t: 'p', x: 'Bayangkan komputer kecil tanpa layar yang tugasnya satu: menyimpan berkas dan menyalakannya 24 jam. Semua ponsel, laptop, dan TV di rumah bisa membaca dan mengisi kotak ini lewat WiFi. Foto dari ponsel anak, dokumen dari laptop Anda — semua mendarat di satu alamat.' },
      { t: 'h2', x: 'Resep hemat yang bisa ditiru' },
      { t: 'list', items: [
        'Mini PC bekas kantoran (Rp1,5–2 juta) sering lebih tangguh daripada NAS siap beli dua kali harganya.',
        'Pasang dua hard disk dan setel mode mirror — satu rusak, data tetap utuh.',
        'Pakai perangkat lunak gratis seperti OpenMediaVault atau TrueNAS; keduanya punya aplikasi ponsel untuk unggah foto otomatis.',
        'Letakkan di dekat router dan colokkan kabel LAN, bukan WiFi — arsip keluarga pantas dapat jalur tol sendiri.'
      ]},
      { t: 'quote', x: 'Arsip keluarga bukan soal kapasitas, melainkan soal disiplin: satu rumah untuk semua berkas, dan rutinitas yang tidak pernah bolos.' },
      { t: 'p', x: 'Dan ingat pelajaran dari artikel backup kami: NAS adalah salinan nomor dua. Salinan ketiga tetap di luar rumah atau di cloud.' }
    ]
  },
  {
    slug: 'aman-wifi-publik-vpn',
    title: 'WiFi Kafe dan VPN: Panduan Aman Bekerja dari Ruang Publik',
    excerpt: 'WiFi gratis itu nyaman dan berbahaya dalam paket yang sama. Ceklis lima langkah ini menutup risiko terbesar tanpa perlu jadi ahli keamanan.',
    category: 'tips', author: 'bimo', date: '2026-10-28', readTime: 5,
    hero: false, editorsPick: false,
    seed: 'yj-wifi-publik', img: 'assets/img/articles/aman-wifi-publik-vpn.jpg',
    imgAlt: 'Ilustrasi laptop di kafe dengan perisai melindungi gelombang WiFi',
    tags: ['VPN', 'WiFi Publik', 'Keamanan'],
    content: [
      { t: 'p', x: 'Kopi Rp25 ribu, meja dekat colokan, WiFi gratis — kafe adalah kantor kedua bagi banyak dari kita. Masalahnya, jaringan publik juga panggung favorit pencuri data: siapa pun bisa membuat hotspot bernama persis “WiFi_Kafe_Gratis”.' },
      { t: 'h2', x: 'Ceklis lima langkah sebelum membuka laptop' },
      { t: 'list', items: [
        'Tethering ke ponsel dulu bila kuota memungkinkan — jalur pribadi selalu menang dari jalur umum.',
        'Kalau harus WiFi publik, nyalakan VPN tepercaya sebelum membuka apa pun.',
        'Pastikan situs penting memakai HTTPS (ikon gembok); browser modern akan menandai yang tidak.',
        'Matikan fitur auto-join WiFi agar laptop tidak menyambung diam-diam ke jaringan sembarangan.',
        'Tunda transaksi perbankan sampai berada di jaringan yang Anda percaya.'
      ]},
      { t: 'h2', x: 'VPN gratis vs berbayar' },
      { t: 'p', x: 'VPN gratis tetap harus membayar server — kalau tidak dari dompet Anda, dari data Anda. Pilih layanan dengan kebijakan tanpa-log yang pernah diaudit pihak ketiga. Harga wajar yang sehat berkisar Rp50–100 ribu per bulan.' },
      { t: 'quote', x: 'Di WiFi publik, pertanyaannya bukan “apakah ada yang mengintip”, melainkan “apakah ada yang melindungi”.' }
    ]
  },
  {
    slug: 'keyboard-mekanikal-300-ribuan',
    title: 'Keyboard Mekanikal Rp300 Ribuan: Layak untuk Menulis Setiap Hari?',
    excerpt: 'Sebulan penuh kami ganti keyboard kantor dengan mekanikal murah. Jawabannya mengejutkan untuk harga yang tidak masuk akal ini.',
    category: 'teknologi', author: 'bimo', date: '2026-10-26', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-keyboard', img: 'assets/img/articles/keyboard-mekanikal-300-ribuan.jpg',
    imgAlt: 'Ilustrasi close-up tuts keyboard mekanikal',
    tags: ['Keyboard', 'Meja Kerja', 'Ulasan'],
    content: [
      { t: 'p', x: 'Keyboard mekanikal dulu barang hobiis mahal. Hari ini, model hot-swappable bermerek lokal dan Tiongkok mulai Rp300 ribuan. Kalau Anda menulis sepanjang hari, apakah pantas mengganti keyboard bawaan?' },
      { t: 'h2', x: 'Laporan setelah sebulan' },
      { t: 'p', x: 'Kecepatan mengetik praktis sama. Yang berubah justru hal yang tidak terduga: rasa pegal di jari berkurang, dan ada “ritme” yang membuat sesi menulis panjang terasa lebih ringan. Umpan balik taktil membuat Anda tidak perlu menekan sampai mentok — kebiasaan kecil yang menabung tenaga ribuan ketukan per hari.' },
      { t: 'h2', x: 'Pilih switch sesuai konteks ruangan' },
      { t: 'list', items: [
        'Linear (red) — halus tanpa klik, paling sopan untuk ruang bersama.',
        'Tactile (brown) — ada benjolan halus untuk umpan balik, aman untuk rumah dan kantor tenang.',
        'Clicky (blue) — suara legendaris dan legendaris berisiknya; hanya untuk ruangan pribadi.'
      ]},
      { t: 'quote', x: 'Alat yang Anda sentuh delapan jam sehari pantas diperlakukan seperti sepatu: bukan yang paling mahal, tapi yang paling pas.' },
      { t: 'p', x: 'Satu fitur yang kini wajib di harga Rp300 ribuan: hot-swap. Saat bosan atau tuts rusak, switch tinggal dicabut dan diganti — tanpa solder, tanpa drama.' }
    ]
  },
  {
    slug: 'ereader-vs-tablet-membaca',
    title: 'E-Reader vs Tablet untuk Membaca: Mata Anda yang Menjawab',
    excerpt: 'Spesifikasi tablet menang telak di kertas. Tapi setelah dua jam membaca, mata Anda akan memilih pemenang yang berbeda.',
    category: 'teknologi', author: 'laras', date: '2026-10-24', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-ereader', img: 'assets/img/articles/ereader-vs-tablet-membaca.jpg',
    imgAlt: 'Ilustrasi e-reader di samping tablet di atas meja',
    tags: ['E-Reader', 'Tablet', 'Membaca'],
    content: [
      { t: 'p', x: 'Pertanyaan klasik pembaca kami: “Mending beli tablet murah yang bisa segalanya, atau e-reader yang cuma bisa membaca?” Jawabannya berubah kalau Anda tahu satu fakta tentang layar.' },
      { t: 'h2', x: 'E-ink memantulkan, tablet memancarkan' },
      { t: 'p', x: 'Layar e-reader bekerja seperti kertas: ia memantulkan cahaya ruangan, bukan menembakkan cahaya ke mata Anda. Membaca dua jam terasa seperti membaca buku. Tablet — sejempolan apa pun mode bacanya — tetap layar yang menyala. Bedanya baru terasa setelah jam pertama: mata kering, fokus gampang kabur.' },
      { t: 'h2', x: 'Tablet menang di wilayah lain' },
      { t: 'list', items: [
        'PDF teknis penuh diagram dan warna — e-ink masih terseok.',
        'Kursus video dan materi interaktif — jelas bukan wilayah e-reader.',
        'Anotasi cepat dengan pena dan melayang antar aplikasi.',
        'Harga: tablet Android murah lebih terjangkau dari e-reader selevel.'
      ]},
      { t: 'quote', x: 'Pertanyaannya bukan perangkat mana yang lebih baik, melainkan kebiasaan mana yang ingin Anda lindungi.' },
      { t: 'p', x: 'Kalau tujuannya menamatkan buku 300 halaman tanpa mata perih: e-reader. Kalau bacaan Anda mayoritas artikel pendek, PDF kerja, dan video: tablet. Dan kalau bingung — pinjam dulu keduanya seminggu. Mata Anda jujur dan tidak bisa disuap spesifikasi.' }
    ]
  },
  {
    slug: 'cloud-vs-harddisk-foto-keluarga',
    title: 'Menyimpan Foto Keluarga: Cloud, Hard Disk, atau Keduanya?',
    excerpt: 'Jawaban singkatnya: keduanya, untuk peran yang berbeda. Ini formula penyimpanan foto keluarga yang kami pakai sendiri di redaksi.',
    category: 'teknologi', author: 'sinta', date: '2026-10-22', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-foto', img: 'assets/img/articles/cloud-vs-harddisk-foto-keluarga.jpg',
    imgAlt: 'Ilustrasi aliran foto menuju awan dan hard disk',
    tags: ['Foto', 'Cloud', 'Penyimpanan'],
    content: [
      { t: 'p', x: 'Perdebatan cloud versus hard disk biasanya berakhir dengan jawaban politik “tergantung”. Kami akan jawab lebih tegas: keduanya, tapi dengan pembagian tugas yang jelas.' },
      { t: 'h2', x: 'Peran cloud: tahun berjalan' },
      { t: 'p', x: 'Kelebihan cloud bukan kapasitas, melainkan otomatisasi: setiap foto dari ponsel terunggah tanpa pikir panjang, dan bisa dibuka dari mana pun. Simpan tahun berjalan dan koleksi favorit di sini. Siapkan langganan 100–200 GB; di atas itu, biayanya mulai terasa tahunan.' },
      { t: 'h2', x: 'Peran hard disk: arsip abadi' },
      { t: 'p', x: 'Untuk arsip sepuluh tahun ke belakang — ratusan ribu berkas — hard disk 2–4 TB jauh lebih ekonomis daripada cloud. Wujudnya offline, tidak ada tagihan bulanan, dan kecepatan salin sepuas kabel.' },
      { t: 'h2', x: 'Formula keluarga kami' },
      { t: 'list', items: [
        'Cloud — foto dua tahun terakhir plus album favorit keluarga.',
        'Hard disk utama — seluruh arsip, diperbarui tiap awal bulan lewat pengingat kalender.',
        'Salinan kedua — hard disk lain yang disimpan di rumah mertua atau di cloud berbeda, untuk peristiwa yang tidak bisa diulang: pernikahan, kelahiran, wisuda.'
      ]},
      { t: 'quote', x: 'Foto keluarga adalah satu-satunya berkas yang Anda buat hari ini tapi nilainya baru terasa dua puluh tahun lagi.' },
      { t: 'p', x: 'Apa pun sistemnya, aturan emasnya tetap: berjalan otomatis. Sistem yang bergantung pada ingatan adalah sistem yang menunggu gagal.' }
    ]
  },
  {
    slug: 'smart-home-tiga-perangkat-pertama',
    title: 'Smart Home Hemat: 3 Perangkat Pertama yang Benar-Benar Terpakai',
    excerpt: 'Jangan mulai dari lampu warna-warni. Mulai dari masalah yang mengganggu tiap hari — ini tiga perangkat pembuka yang tidak akan jadi penghuni laci.',
    category: 'teknologi', author: 'dafa', date: '2026-10-20', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-smarthome', img: 'assets/img/articles/smart-home-tiga-perangkat-pertama.jpg',
    imgAlt: 'Ilustrasi steker pintar, IR blaster, dan speaker pintar di rak',
    tags: ['Smart Home', 'IoT', 'Rumah'],
    content: [
      { t: 'p', x: 'Jebakan smart home klasik: mulai dari lampu RGB karena keren di video, lalu tiga bulan kemudian kontrolnya tetap lewat saklar karena aplikasinya lemot. Urutan yang benar bukan dari yang keren — melainkan dari yang menyebalkan.' },
      { t: 'h2', x: 'Tiga pembuka yang lolos uji dua bulan' },
      { t: 'list', items: [
        'Steker pintar (Rp80–150 ribu) — dispenser mati sendiri jam 23.00, kipas menyala sebelum Anda pulang. Masalah “kok masih nyala?” selesai.',
        'IR blaster universal (Rp100–200 ribu) — AC dan TV tua mendadak pintar: bisa dijadwalkan, dimatikan dari kantor, dan dirias jadi satu tombol “mode tidur”.',
        'Sensor pintu (Rp50–100 ribu) — notifikasi saat pintu utama terbuka, atau pengingat kalau lemari es tidak rapat.'
      ]},
      { t: 'h2', x: 'Aturan main sebelum checkout' },
      { t: 'p', x: 'Pilih satu ekosistem dulu dan setia padanya — mencampur tiga aplikasi merek berbeda adalah resep remote digital yang tercecer. Cek juga apakah perangkat butuh hub tambahan atau langsung ke WiFi, dan prioritaskan yang tetap bekerja saat internet padam.' },
      { t: 'quote', x: 'Rumah pintar yang baik tidak terasa pintar. Ia terasa seperti rumah yang kebetulan selalu selangkah lebih dulu.' }
    ]
  },
  {
    slug: 'fitur-kamera-ai-nyata-atau-sulap',
    title: 'Fitur Kamera AI di Ponsel: Mana yang Nyata, Mana yang Sulap HDR?',
    excerpt: '“Foto malam sejelas siang” terdengar mustahil — karena memang bukan apa yang dilihat mata Anda. Begini cara kerja kamera komputasi dan kapan harus mewaspadainya.',
    category: 'ai', author: 'nadia', date: '2026-10-18', readTime: 7,
    hero: false, editorsPick: false,
    seed: 'yj-kamera-ai', img: 'assets/img/articles/fitur-kamera-ai-nyata-atau-sulap.jpg',
    imgAlt: 'Ilustrasi lensa kamera dengan lapisan-lapisan digital',
    tags: ['Kamera', 'AI', 'Fotografi Ponsel'],
    content: [
      { t: 'p', x: 'Saat ponsel iklannya berteriak “mode malam ajaib”, yang sebenarnya bekerja bukan lensa yang lebih besar — melainkan algoritma. Kamera ponsel modern adalah mesin komputasi yang kebetulan punya lensa.' },
      { t: 'h2', x: 'Trik utamanya: multi-frame stacking' },
      { t: 'p', x: 'Sekali Anda menekan tombol, kamera sebenarnya mengambil selusin foto dengan eksposur berbeda dalam hitungan milidetik. AI lalu memilih bagian terbaik tiap frame — wajah dari frame yang tajam, langit dari frame yang gelap, bayangan dari frame terang — dan menjahitnya jadi satu foto. Hasilnya memukau, tapi secara teknis itu rekonstruksi, bukan rekaman.' },
      { t: 'h2', x: 'Kapan “sulap” ini jadi masalah' },
      { t: 'list', items: [
        'Foto untuk bukti atau dokumentasi kerja — detail hasil jahitan bisa tidak sesuai kenyataan.',
        'Tekstur kulit yang terlalu halus — beautify halus sering menyala diam-diam.',
        'Langit malam dengan bintang “bonus” — sebagian ponsel pernah ketahuan menambahkan detail bulan.',
        'Warna produk untuk jualan online — pembeli komplain foto tidak mirip barang aslinya.'
      ]},
      { t: 'quote', x: 'Kamera ponsel tidak lagi merekam cahaya; ia menegosiasikannya dengan selera mesin.' },
      { t: 'p', x: 'Untuk momen keluarga, biarkan AI bekerja — fotonya memang jadi lebih indah. Untuk bukti dan dagangan, matikan mode beautify dan HDR agresif: yang Anda butuhkan adalah kejujuran piksel.' }
    ]
  },
  {
    slug: 'satu-kabel-usb-c',
    title: 'Satu Kabel untuk Semua: Menata Ulang Meja di Era USB-C',
    excerpt: 'Hampir semua perangkat 2026 berbicara USB-C. Artinya laci penuh kabel warisan bisa dipensiunkan — begini rencana rapi 30 menitnya.',
    category: 'tips', author: 'bimo', date: '2026-10-16', readTime: 5,
    hero: false, editorsPick: false,
    seed: 'yj-usbc', img: 'assets/img/articles/satu-kabel-usb-c.jpg',
    imgAlt: 'Ilustrasi satu kabel USB-C menghubungkan laptop dan ponsel',
    tags: ['USB-C', 'Meja Kerja', 'Tips'],
    content: [
      { t: 'p', x: 'Ada masa setiap meja punya koleksi kabel seperti toko elektronik gagal: micro-USB, lightning, kabel kipas, kabel entah untuk apa. Era USB-C akhirnya memberi kesempatan untuk satu standar — dan satu laci kosong.' },
      { t: 'h2', x: 'Audit 30 menit' },
      { t: 'list', items: [
        'Satu charger GaN 65W menggantikan tiga bata: laptop, ponsel, dan earbuds bisa bergiliran.',
        'Investasikan satu kabel 100W ber-chip e-marker untuk laptop — watt penuh, kabel standar memotong daya tanpa Anda sadari.',
        'Labeli kabel dengan selotip kertas: “cas cepat”, “data saja”, “jadul”. USB-C yang sama bisa berbeda kemampuan.',
        'Satu kotak kecil untuk kabel langka — jangan campur dengan yang harian.'
      ]},
      { t: 'h2', x: 'Yang tetap layak dibawa bepergian' },
      { t: 'p', x: 'Kabel cadangan pendek dan satu adapter USB-C ke USB-A. Dunia sudah berpindah standar, tapi colokan di bandara dan komputer rental sering belum membaca berita.' },
      { t: 'quote', x: 'Kabel yang baik adalah kabel yang tidak Anda pikirkan.' }
    ]
  },
  {
    slug: 'monitor-portable-ulasan-3-bulan',
    title: 'Monitor Portable untuk Kerja Mobile: Ulasan Jujur Setelah 3 Bulan',
    excerpt: 'Layar kedua 16 inci yang masuk tas laptop terdengar gimmick — sampai Anda mencoba menulis laporan dengan tabel sebelah di kafe. Ini plus-minusnya.',
    category: 'teknologi', author: 'sinta', date: '2026-10-14', readTime: 7,
    hero: false, editorsPick: false,
    seed: 'yj-monitor', img: 'assets/img/articles/monitor-portable-ulasan-3-bulan.jpg',
    imgAlt: 'Ilustrasi monitor portable di atas meja kafe',
    tags: ['Monitor', 'Kerja Mobile', 'Ulasan'],
    content: [
      { t: 'p', x: 'Tiga bulan lalu kami menambahkan monitor portable ke tas kerja redaksi. Hipotesisnya: layar kedua akan mengubah produktivitas kerja lapangan. Hasilnya: benar, dengan catatan.' },
      { t: 'h2', x: 'Yang melebihi ekspektasi' },
      { t: 'list', items: [
        'Dual-screen di mana pun adalah perubahan nyata — riset di kiri, tulisan di kanan, tanpa alt-tab vertigo.',
        'Satu kabel USB-C untuk daya sekaligus gambar; tidak ada bata charger tambahan.',
        'Berat sekitar satu kilogram: terasa di tas, tidak terasa dalam keputusan membawa.',
        'Bisa jadi layar kedua ponsel untuk edit thumbnail atau presentasi dadakan.'
      ]},
      { t: 'h2', x: 'Yang perlu Anda terima' },
      { t: 'p', x: 'Kecerahan panel kelas menengah kalah oleh cahaya kafe dekat jendela — pilih 400 nit ke atas. Kaki lipat bawaan sering goyah di meja gyret; stand kecil terpisah layak dibeli. Dan saat disambung ke ponsel, ia menyedot daya seperti tamu yang tidak disuruh tapi tahu di mana kulkas.' },
      { t: 'quote', x: 'Produktivitas mobile bukan soal membawa kantor, melainkan membawa dua meter persegi dari kantor Anda.' },
      { t: 'p', x: 'Untuk penulis, analis, dan siapa pun yang bekerja dengan dua jendela: worth it. Untuk yang alurnya satu aplikasi penuh layar: simpan uangnya untuk headphone yang baik.' }
    ]
  },
  {
    slug: 'mesh-wifi-apartemen-2-kamar',
    title: 'Mesh WiFi di Apartemen 2 Kamar: Overkill atau Penyelamat Sinyal?',
    excerpt: 'Beton bertulang memangkas sinyal WiFi seperti pisau. Tapi sebelum checkout sistem mesh tiga titik, ada dua langkah gratis yang wajib dicoba.',
    category: 'teknologi', author: 'sinta', date: '2026-10-12', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-mesh', img: 'assets/img/articles/mesh-wifi-apartemen-2-kamar.jpg',
    imgAlt: 'Ilustrasi denah apartemen dengan dua titik mesh WiFi',
    tags: ['WiFi', 'Mesh', 'Apartemen'],
    content: [
      { t: 'p', x: 'Apartemen kecil bukan berarti sinyal mudah — justru sebaliknya. Dinding beton bertulang dan kolom besi memangkas WiFi jauh lebih kejam daripada jarak. Wajar jika kamar belakang jadi zona mati.' },
      { t: 'h2', x: 'Dua langkah gratis sebelum belanja' },
      { t: 'list', items: [
        'Pindahkan router ke titik tengah unit — bukan melongo di pojok dekat panel listrik tempat teknisi meninggalkannya.',
        'Naikkan posisinya: rak setinggi dada bekerja lebih baik daripada lantai atau balik TV.'
      ]},
      { t: 'p', x: 'Kalau setelah itu kamar belakang masih memelas, barulah mesh masuk hitungan. Dua titik mesh sekarang mulai dari Rp1 jutaan dan membuat perangkat berpindah node tanpa putus saat Anda berjalan dari kamar ke dapur sambil meeting.' },
      { t: 'h2', x: 'Kapan mesh benar-benar masuk akal' },
      { t: 'list', items: [
        'Ada dua dinding beton atau lebih antara router dan ruang kerja Anda.',
        'Paket internet Anda di atas 200 Mbps — sayang kalau menguap di lorong.',
        'Banyak perangkat yang tersebar: TV di ruang tamu, laptop di kamar, CCTV di pintu.'
      ]},
      { t: 'quote', x: 'Masalah WiFi jarang soal router kurang mahal — lebih sering soal router kurang strategis.' }
    ]
  },
  {
    slug: 'waspada-quishing-qr-palsu',
    title: 'Waspada “Quishing”: Penipuan Lewat QR Code yang Makin Halus',
    excerpt: 'Stiker QR palsu menempel di atas QR asli pembayaran parkir dalam hitungan detik. Kenali polanya dan lindungi dompet Anda dengan empat kebiasaan kecil.',
    category: 'teknologi', author: 'nadia', date: '2026-10-10', readTime: 5,
    hero: false, editorsPick: false,
    seed: 'yj-qr', img: 'assets/img/articles/waspada-quishing-qr-palsu.jpg',
    imgAlt: 'Ilustrasi kode QR dengan kail pancing tersembunyi',
    tags: ['Keamanan', 'QRIS', 'Penipuan'],
    content: [
      { t: 'p', x: 'QRIS membuat membayar semudah memindai — dan penipu mencatat itu dengan tekun. Modus terbaru yang disebut quishing: stiker QR palsu ditempel di atas QR asli di mesin parkir, kafe, atau papan pengumuman. Anda scan dengan percaya, situs tiruan menyambut dengan sopan.' },
      { t: 'h2', x: 'Alur tipikalnya' },
      { t: 'p', x: 'QR palsu membuka halaman mirip pembayaran resmi, lalu meminta nomor kartu, PIN, atau kode OTP dengan dalih “verifikasi”. Begitu data masuk, dompet digital atau rekening Anda dikuras dalam hitungan menit — sering lewat pola transaksi kecil berulang agar tidak memicu alarm.' },
      { t: 'h2', x: 'Empat kebiasaan pelindung' },
      { t: 'list', items: [
        'Raba dan lihat dulu — stiker menempel di atas cetakan asli biasanya terasa di tepinya.',
        'Periksa pratinjau tautan sebelum membuka; domain aneh seperti “qris-parkir-murah.top” adalah bendera merah.',
        'Pembayaran resmi seperti QRIS tidak pernah meminta PIN atau OTP di halaman web.',
        'Kalau ragu, bayar lewat aplikasi resmi langsung — bukan lewat tautan hasil scan.'
      ]},
      { t: 'quote', x: 'QR code hanyalah tautan yang berpakaian kotak-kotak. Perlakukan seperti tautan dari orang asing: baca dulu, klik kemudian.' }
    ]
  },
  {
    slug: 'npu-laptop-40-tops-untuk-apa',
    title: 'NPU 40 TOPS di Laptop Baru: Untuk Apa Sebenarnya Chip AI Lokal Ini?',
    excerpt: 'Semua laptop baru pamer NPU. Kami terjemahkan klaim pemasarannya menjadi daftar fitur nyata — dan jawaban jujur apakah Anda perlu sekarang.',
    category: 'teknologi', author: 'sinta', date: '2026-10-08', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-npu', img: 'assets/img/articles/npu-laptop-40-tops-untuk-apa.jpg',
    imgAlt: 'Ilustrasi chip laptop dengan pola jaringan saraf',
    tags: ['NPU', 'Laptop', 'AI PC'],
    content: [
      { t: 'p', x: 'Laptop 2026 ramai-ramai memasang badge “NPU 40+ TOPS”. NPU — Neural Processing Unit — adalah chip khusus menjalankan tugas AI irit daya. TOPS mengukur triliunan operasi per detik. Angkanya besar; pertanyaannya, buat apa?' },
      { t: 'h2', x: 'Yang dikerjakan NPU hari ini' },
      { t: 'list', items: [
        'Blur latar dan pembingkaian otomatis saat meeting — halus tanpa CPU menganga dan kipas meraung.',
        'Transkripsi dan subtitle lokal — rapat terekam menjadi teks tanpa keluar dari laptop.',
        'Asisten AI lokal untuk tugas ringan — merangkum dokumen yang tidak boleh meninggalkan perangkat.',
        'Penghematan baterai: tugas AI dipindah dari prosesor utama, laptop tetap dingin lebih lama.'
      ]},
      { t: 'h2', x: 'Apakah Anda perlu sekarang?' },
      { t: 'p', x: 'Jujur: untuk mayoritas, NPU hari ini adalah fitur bonus yang kebetulan datang dengan laptop baru — bukan alasan ganti laptop. Yang berubah drastis akan datang saat lebih banyak aplikasi memindahkan AI ke lokal; membeli laptop dengan NPU berarti membeli tiket untuk itu.' },
      { t: 'quote', x: 'NPU hari ini seperti seatbelt di 1990-an: belum semua orang sadar perlu, sampai semua mobil memasangnya.' }
    ]
  },
  {
    slug: 'ssd-eksternal-untuk-kreator',
    title: 'SSD Eksternal untuk Kreator: Pilih Kapasitas atau Kecepatan Dulu?',
    excerpt: 'Salah beli SSD eksternal bisa berarti editing lag atau arsip penuh dalam sebulan. Rumus singkatnya: kecepatan untuk produksi, kapasitas untuk arsip.',
    category: 'teknologi', author: 'dafa', date: '2026-10-06', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-ssd', img: 'assets/img/articles/ssd-eksternal-untuk-kreator.jpg',
    imgAlt: 'Ilustrasi SSD eksternal dengan bingkai video mengalir',
    tags: ['SSD', 'Penyimpanan', 'Kreator'],
    content: [
      { t: 'p', x: 'Kreator video punya dilema klasik di keranjang checkout: SSD 1TB super cepat, atau 2TB yang setengah lajunya dengan harga mirip? Jawaban benar bergantung pada berkas itu akan “dikerjakan” atau “disimpan”.' },
      { t: 'h2', x: 'Kecepatan untuk produksi, kapasitas untuk arsip' },
      { t: 'p', x: 'Editing 4K langsung dari drive eksternal butuh bandwidth besar — pilih NVMe dengan kecepatan tulis nyata 1.000 MB/s ke atas, dan lupakan angka “hingga” di kemasan; cari hasil uji independen. Untuk arsip proyek selesai, hard disk konvensional masih raja harga-per-GB.' },
      { t: 'h2', x: 'Ceklis sebelum membeli' },
      { t: 'list', items: [
        'Port Anda — kecepatan 2.000 MB/s percuma di port USB lama; cek dukungan USB 3.2 Gen 2x2 di laptop.',
        'Kabel bawaan — banyak SSD kencang dipasangkan kabel lambat; satu hal yang tidak masuk akal di 2026 tapi masih terjadi.',
        'Pendinginan — editing lama membuat SSD murah drop kecepatan (throttling); bodi metal dan heatsink penting.',
        'Garansi dan TBW (total byte tertulis) — makin tinggi, makin tahan disiksa render.'
      ]},
      { t: 'quote', x: 'Berkas yang sedang dikerjakan butuh jalan tol; berkas yang sudah selesai butuh gudang. Jangan tukar keduanya.' }
    ]
  },
  {
    slug: 'diet-layar-realistis',
    title: 'Detoks Digital Gagal Terus? Coba Diet Layar yang Realistis',
    excerpt: 'Puasa ponsel seminggu hampir selalu berakhir balas dendam scrolling. Empat aturan kecil ini justru bertahan — karena tidak heroik.',
    category: 'produktivitas', author: 'bimo', date: '2026-10-04', readTime: 5,
    hero: false, editorsPick: false,
    seed: 'yj-detox', img: 'assets/img/articles/diet-layar-realistis.jpg',
    imgAlt: 'Ilustrasi ponsel tersimpan di laci dengan tanaman di atasnya',
    tags: ['Detoks Digital', 'Kebiasaan', 'Fokus'],
    content: [
      { t: 'p', x: 'Detoks digital ala influencer — matikan ponsel seminggu, pergi ke alam — kedengarannya indah sampai Anda ingat punya grup kerja, orang tua yang was-was, dan GoPay yang perlu di-scan. Yang kami butuhkan bukan puasa, melainkan diet.' },
      { t: 'h2', x: 'Empat aturan yang selamat dua bulan uji redaksi' },
      { t: 'list', items: [
        'Tidak ada layar satu jam setelah bangun dan satu jam sebelum tidur — dua tepi hari ini menentukan isi tengahnya.',
        'Mode grayscale setelah pukul 21.00 — tanpa warna, media sosial kehilangan sihirnya dalam hitungan menit.',
        'Charger ponsel pindah ke luar kamar — alarm pagi boleh berisik dari seberang pintu.',
        'Sabtu pagi bebas-notifikasi: mode fokus menyala otomatis sampai jam 12.00.'
      ]},
      { t: 'quote', x: 'Tujuannya bukan membenci ponsel, melainkan membuat layar kembali menjadi alat — bukan jagal waktu.' },
      { t: 'p', x: 'Ukur dengan laporan screen time mingguan, bukan perasaan. Dua minggu biasanya cukup untuk melihat angka turun 30–40 persen — tanpa pindah ke hutan, tanpa pamit dari grup keluarga.' }
    ]
  },
  {
    slug: 'passkey-menggantikan-password',
    title: 'Passkey Mulai Menggantikan Password: Panduan Transisi untuk Keluarga',
    excerpt: 'Login tanpa mengetik apa-apa, dan tidak bisa di-phishing karena tidak ada rahasia untuk dicuri. Begini cara migrasi keluarga Anda tanpa drama.',
    category: 'teknologi', author: 'nadia', date: '2026-10-02', readTime: 6,
    hero: false, editorsPick: false,
    seed: 'yj-passkey', img: 'assets/img/articles/passkey-menggantikan-password.jpg',
    imgAlt: 'Ilustrasi kunci yang berubah menjadi sidik jari digital',
    tags: ['Passkey', 'Keamanan', 'Login'],
    content: [
      { t: 'p', x: 'Setelah puluhan tahun, industri teknologi akhirnya sepakat soal satu hal: password adalah ide buruk. Penggantinya bernama passkey — dan tahun ini dukungannya sudah ada di hampir semua layanan besar yang Anda pakai tiap hari.' },
      { t: 'h2', x: 'Apa itu passkey tanpa jargon' },
      { t: 'p', x: 'Passkey adalah sepasang kunci kriptografi: separuh tinggal terkunci di ponsel atau laptop Anda, separuh lagi di server layanan. Login cukup dengan sidik jari atau wajah. Karena tidak ada kata yang diketik, tidak ada yang bisa dicuri situs palsu — phishing kehilangan senyapannya.' },
      { t: 'h2', x: 'Urutan migrasi yang aman untuk keluarga' },
      { t: 'list', items: [
        'Mulai dari email utama — ia adalah kunci pintu segala reset password.',
        'Lanjutkan ke akun perbankan dan dompet digital begitu opsinya tersedia.',
        'Simpan kode pemulihan (recovery codes) di tempat fisik yang aman — amplop di laci, bukan foto di galeri.',
        'Biarkan pengelola password menyimpan passkey; ia menjaga sinkronisasi antar perangkat keluarga Anda.'
      ]},
      { t: 'quote', x: 'Keamanan terbaik adalah yang tidak bergantung pada disiplin manusia di hari sibuk.' },
      { t: 'p', x: 'Tidak perlu revolusi besar-besaran: tiap kali layanan menawarkan “buat passkey”, klik ya. Dalam dua bulan, akun-akun terpenting Anda sudah pindah tanpa terasa.' }
    ]
  }
]);

/* Artikel diurutkan terbaru dulu */
YJ.data.articles.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
