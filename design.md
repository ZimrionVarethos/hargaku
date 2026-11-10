# Spesifikasi Bentuk Kartu, Penempatan, Corak & Pola PasarKu (`design.md`)

Dokumen ini mendefinisikan identitas visual, bentuk komponen (*card*), penempatan tata letak (*layout placement*), serta corak gelombang dan animasi pasar realistis untuk **PasarKu Kota Bogor**. Spesifikasi ini memastikan setiap halaman baru yang dibangun memiliki karakter visual yang utuh dan konsisten dengan halaman utama serta standar [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop).

## 1. Design Read & Pengaturan Liveliness Dials

- **Design Read**:
  `Reading this as: Platform Digital Eksplorasi & Pantauan Harga Komoditas Pasar Rakyat for Warga, Pedagang, dan Pemantau Pangan Kota Bogor, in a Warm Realistic Market Diorama & Tactile Broadsheet Card style, dial ENERGY 3 / RHYTHM 3 / MOTION 3.`
- **Karakter Tipografi**:
  Menggunakan [Google Fonts Ubuntu](https://fonts.google.com/specimen/Ubuntu) secara menyeluruh:
  - **Logo & Judul Hero (`<h1>`)**: `Ubuntu Bold (700)`, ukuran `30px` (ponsel) hingga `50px` (desktop), `line-height: 1.14`, `letter-spacing: -0.02em`, warna `#132E20` (dengan aksen merah `#A92717` pada suku kata `Ku`).
  - **Judul Bagian (`<h2>`)**: `Ubuntu Bold (700)`, ukuran `24px` hingga `30px`, warna `var(--text-primary)`.
  - **Judul Kartu (`<h3>`)**: `Ubuntu Bold (700)`, ukuran `16px` (kartu reguler) hingga `20px` (kartu sorotan utama).
  - **Angka Harga & Indeks (`.font-mono-num`)**: `Ubuntu Bold (700)` dengan `font-variant-numeric: tabular-nums` agar deretan angka harga Rupiah dari [Perumda Pasar Pakuan Jaya Kota Bogor](https://pasarpakuanjaya.co.id/komoditas/index/view-all) sejajar rapi.

## 2. Bentuk Kartu (Card Geometry, Borders & Elevation)

Seluruh kartu pada ekosistem **PasarKu** menggunakan gaya **Tactile Market Ticket** (kartu berbingkai tegas dengan bayangan padat tanpa kabur) untuk membedakan hirarki informasi secara jelas:

| Jenis Komponen Kartu | Radius Sudut | Garis Tepi (Border) | Bayangan (Elevation) | Perilaku Interaksi & Penempatan Isi |
| :--- | :--- | :--- | :--- | :--- |
| **Kartu Standar (`.market-card`)** | `14px` | `2px solid var(--border-ink)` | `3px 3px 0px #132E20` (Siang) / `3px 3px 0px #060B08` (Subuh) | Wadah dasar untuk kotak kontrol, filter, ringkasan analitik, dan panel informasi. |
| **Kartu Interaktif (`.market-card-interactive`)** | `14px` | `2px solid var(--border-ink)` | Naik menjadi `5px 5px 0px var(--border-ink)` saat *hover* | Bergerak `translate(-2px, -2px)` saat kursor diarahkan. Digunakan pada kartu katalog komoditas. |
| **Kartu Komoditas Utama (2 Kolom, R-14)** | `14px` | `2px solid var(--border-ink)` | `3px 3px 0px var(--border-ink)` | Mengambil lebar 2 kolom (`sm:col-span-2`), memuat lencana merah `KOMODITAS PANTAUAN UTAMA`, kotak ilustrasi SVG `64x64px` (`rounded-xl`), harga `24px`, dan bilah progres perbandingan rata-rata kategori. |
| **Kartu Komoditas Reguler (1 Kolom)** | `14px` | `2px solid var(--border-ink)` | `3px 3px 0px var(--border-ink)` | Mengambil lebar 1 kolom, memuat kotak ilustrasi SVG `48x48px` di kiri atas, nomor indeks (`INDEKS #XX`) dan subkategori di kanan atas, nama barang, harga `20px`, serta bilah aksi di bagian bawah. |
| **Kartu & Modal Detail Unit Pasar (13 Pasar)** | `14px` | `2px solid var(--border-ink)` | `3px 3px 0px var(--border-ink)` | Pop-up taktil saat pin atau bangunan 3D unit pasar diklik pada peta: memuat kode unit (`UNIT 01 • BOGOR TENGAH`), lencana tipe, alamat lengkap, deskripsi luas/kios, spesifikasi titik koordinat `.ledger-leader`, tombol `Tanya PUNTEN`, serta tautan ke [Informasi Pasar Perumda PPJ](https://www.pasarpakuanjaya.co.id/pasar). |
| **Pin Harga Pasar Realistis (`.market-hotspot-pin`)** | `9999px` (Kapsul) | `1.5px solid #132E20` | `0 4px 12px rgba(19, 46, 32, 0.22)` | Berlatar krem semi-solid `rgba(255, 253, 249, 0.94)` dengan titik warna indikator (`8x8px`) dan teks singkat (`Cabe: Rp 80.000`). Membesar `scale(1.12) translateY(-4px)` saat *hover*. |
| **Tombol Utama Hero (`.pasarku-cta-btn`)** | `16px` | Tanpa *border* luar | `0 10px 24px -4px rgba(169, 39, 23, 0.42)` | Berwarna merah bata `#A92717`, teks putih `Ubuntu Bold`, ikon keranjang belanja putih di sisi kiri, naik `translateY(-3px) scale(1.02)` saat *hover*. |
| **Tombol Aksi Kartu (`.market-btn-primary` & `secondary`)** | `10px` | `2px solid var(--border-ink)` | `2px 2px 0px var(--border-ink)` | Tinggi minimal `40px` hingga `44px`. Menekan ke dalam (`translate(1px, 1px)` tanpa bayangan) saat diklik (`:active`). |

## 3. Penempatan & Tata Letak (Layout Placement & Section Rhythm)

Sesuai dial **RHYTHM 3**, setiap bagian halaman wajib memiliki komposisi penempatan yang berbeda agar halaman terasa hidup dan tidak monoton:

### A. Penempatan Hero Section Diorama Pasar Realistis (`#heroSection`)
Untuk mengatasi masalah gambar panorama pasar yang terlalu panjang (`2149 x 732` piksel) agar proporsional di semua ukuran layar (16:9, tablet, maupun ponsel):
1. **Wadah Utama Hero**: Tinggi minimal `580px` (ponsel), `650px` (tablet), hingga `710px` (desktop), berlatar `#F9F3EE`, dengan `overflow-hidden` dan pemusatan fleksibel (`flex flex-col items-center justify-center`).
2. **Sayap Pasar Kiri (`#leftMarketWing`)**:
   - Diposisikan absolut di sudut kiri bawah (`absolute bottom-0 left-0 z-0`).
   - Lebar responsif `w-[62%] sm:w-[52%] lg:w-[46%] max-w-[760px]` dengan tinggi proporsional otomatis (`h-auto`).
   - Menampilkan lorong kios sayuran (tumpukan kol, cabai merah, wortel, sawi gantung, bawang gantung, dan lampu kios).
3. **Sayap Pasar Kanan & Kanopi Pohon Atas (`#rightMarketWing`)**:
   - Diposisikan absolut di sudut kanan bawah/atas (`absolute bottom-0 right-0 z-0`).
   - Lebar responsif `w-[60%] sm:w-[50%] lg:w-[44%] max-w-[730px]` dengan tinggi otomatis (`h-auto`).
   - Menampilkan deretan kios beratap belang merah-putih, karung beras, meja tomat, serta pepohonan hijau di balik gelombang kanan atas.
4. **Menara Konten Tengah (`z-20 max-w-xl text-center`)**:
   - Berada tepat di ruang kosong krem di antara kedua sayap pasar: memuat gambar logo **PasarKu** (`w-48 sm:w-60 lg:w-64`), judul `Harga Pasar, Lebih Dekat`, subjudul dua baris, tombol `Mulai Sekarang`, serta bilah pencarian cepat 53 komoditas di bawahnya.

### B. Penempatan Bagian Halaman Lainnya (Rhythm Variation)
1. **Bagian Panggung Timbangan & Kontrol (`#etagStageSection`)**: Pembagian asimetris **5 kolom kiri : 7 kolom kanan** (`grid-cols-1 lg:grid-cols-12`). Kolom kiri memuat kartu pengaturan mode animasi dan kecepatan; kolom kanan memuat panggung gelap `#132A1E` dengan 6 kartu spesimen melayang dan timbangan duduk mekanis di tengah.
2. **Bagian Sorotan & Papan Harga Cepat (`#sorotanSection`)**: Pembagian asimetris **5 kolom kiri : 7 kolom kanan**. Kolom kiri menampilkan kartu Sorotan Pangan Utama (rentang harga beras dan komoditas ekstrem); kolom kanan menampilkan daftar 2 kolom **Papan Harga Cepat 10 Komoditas Harian** yang dihubungkan oleh garis titik-titik (`.ledger-leader`).
3. **Bagian Katalog 53 Komoditas (`#katalogSection`)**: Bilah judul di kiri + kotak penguji 4 status UI (**R-27**) di kanan, diikuti bilah kontrol 12 kolom (5 kolom pencarian, 4 kolom pengurutan, 3 kolom pemilih tampilan Kartu/Tabel), pita *tab* kategori, dan *grid* 4 kolom (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) dengan kartu utama melebar 2 kolom.
4. **Bagian Analitik Grafik (`#analitikSection`)**: Pembagian asimetris **4 kolom kiri : 8 kolom kanan**. Kolom kiri menampilkan 3 kotak metrik kelompok (Harga Tertinggi, Terendah, dan Rata-rata Kategori); kolom kanan menampilkan grafik batang vertikal dalam wadah tinggi tetap (`h-80`).
5. **Bagian Peta 3D & Modal 13 Unit Pasar (`#unitPasarSection`)**: Panggung interaktif **Peta 3D Mapbox + Custom Three.js Layer** disertai filter dropdown Kecamatan di kanan atas dan satu baris bilah pil indeks ringkas (`UNIT 01` s.d. `UNIT 13`) di bawah peta. Rincian lengkap tiap pasar disajikan sebagai **Modal Pop-up Taktil** saat pengguna mengklik pin, bangunan 3D di peta, atau pil unit.

## 4. Corak, Pola & Animasi Pasar Realistis

Untuk menjaga tema **PasarKu** tetap hidup tanpa melanggar aturan dekorasi [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop), gunakan 5 pola dan animasi terarah berikut:

1. **Corak Pita Gelombang Kontur Berlapis (`#heroTopRightSvg`)**:
   - Mengikuti lekuk kurva S organik yang membatasi area ilustrasi pasar dan ruang teks tengah.
   - Terdiri dari 3 lapis kurva Bezier (`<path>`): lapis isi pasir transparan (`rgba(239, 228, 212, 0.18)`), garis kontur dalam cokelat keemasan (`#B39C7A`, tebal `2.2px`), dan garis kontur luar hijau hutan gelap (`#132E20`, tebal `2.8px`).
   - Titik kontrol kurva Bezier digerakkan secara halus menggunakan fungsi sinus dan kosinus (`Math.sin(waveTime)` dan `Math.cos(waveTime * 0.85)`) di dalam `requestAnimationFrame` sehingga garis gelombang tampak mengalun lembut.
2. **Animasi Hembusan Angin & Paralaks Diorama Pasar (`animate-market-left` & `right`)**:
   - Kedua sayap gambar pasar realistis diberi animasi bernapas halus (`scale(1)` ke `scale(1.018)` selama `7.5s` hingga `8.2s`) serta efek paralaks kursor (`translate(±12px, ±6px)`) sehingga lorong pasar memiliki kedalaman ruang tiga dimensi.
3. **Pendar Cahaya Lampu Gantung Kios (`animate-lamp-glow`)**:
   - Di atas titik lampu gantung pada foto pasar kiri (`top: 36% left: 6%`, `top: 48% left: 23%`, `top: 59% left: 37%`) dan pasar kanan (`bottom: 16% right: 14%`, `bottom: 14% right: 28%`), ditempatkan lingkaran `radial-gradient` kuning hangat yang berdenyut lembut (`opacity: 0.45` ke `0.85`, durasi `3.4s` dengan jeda bertahap).
4. **Partikel Cahaya Pagi Pasar (`#heroAtmosphereCanvas`)**:
   - Kanvas transparan di latar depan Hero Section menggambar 24 butir cahaya keemasan kecil (`r: 1.8px` s.d. `4.6px`) yang melayang perlahan ke atas untuk menghadirkan suasana udara pagi di pasar tradisional Bogor.
5. **Pola Garis Titik-Titik Buku Besar (`.ledger-leader`)**:
   - Pada komponen daftar harga ringkas, nama komoditas di sisi kiri dan nominal harga di sisi kanan dihubungkan oleh garis bawah bertitik (`border-bottom: 1.5px dotted var(--border-subtle)`) untuk memudahkan mata memindai baris harga secara horizontal.
