# Aturan Arsitektur Kode & Standar Anti-Slop PasarKu (`rule.md`)

Dokumen ini menjadi pedoman wajib saat membangun halaman baru, komponen antarmuka, maupun modul skrip untuk ekosistem web **PasarKu Kota Bogor**. Seluruh aturan di bawah menggabungkan standar rekayasa modular (**batas maksimal 300 baris kode per file**) dengan 40 aturan kualitas dari [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) serta integritas data publik [Perumda Pasar Pakuan Jaya Kota Bogor](https://pasarpakuanjaya.co.id/komoditas/index/view-all).

## 1. Aturan Utama Modularitas: Maksimal 300 Baris Kode per File

Untuk mencegah kode monolitik yang sulit dirawat saat membangun halaman-halaman baru (seperti halaman Detail Pasar, Halaman Perbandingan Historis, atau Halaman Peta Pasar), patuhi aturan keras berikut:

1. **Batas Keras 300 Baris (Hard Cap 300 LOC)**:
   - Setiap file kode sumber (`.html`, `.css`, `.js`, `.ts`, `.jsx`, atau `.md`) **wajib memiliki maksimal 300 baris kode** (termasuk spasi dan komentar).
   - Apabila sebuah file mendekati 260 hingga 280 baris, pengembang atau agen AI wajib segera memecah (*refactor*) logika atau tampilan tersebut ke dalam modul terpisah sebelum melanjutkan penambahan fitur.
2. **Struktur Pemecahan File Multi-Halaman PasarKu**:
   Saat mengembangkan halaman baru di proyek standar, pisahkan tanggung jawab ke dalam struktur modular berikut agar setiap file tetap di bawah 300 baris:
   - `index.html` / `pasar-detail.html` (Maksimal 220 baris): Hanya memuat kerangka semantik (`<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`) tanpa menumpuk data JSON atau logika panjang di dalam HTML.
   - `styles/tokens.css` (Maksimal 120 baris): Menyimpan variabel warna dari `palet.md`, aturan dasar [Google Fonts Ubuntu](https://fonts.google.com/specimen/Ubuntu), dan aturan aksesibilitas kursor/fokus.
   - `styles/components.css` (Maksimal 200 baris): Menyimpan kelas bentuk kartu (`.market-card`), tombol (`.pasarku-cta-btn`, `.market-btn-primary`), dan `@keyframes` animasi pasar dari `design.md`.
   - `scripts/data-bogor.js` (Maksimal 240 baris): Menyimpan konstanta data 53 komoditas resmi [Perumda Pasar Pakuan Jaya](https://pasarpakuanjaya.co.id/komoditas/index/view-all) dan 13 unit pasar dari [Informasi Pasar Perumda PPJ](https://www.pasarpakuanjaya.co.id/pasar).
   - `scripts/hero-animation.js` (Maksimal 220 baris): Mengelola animasi gelombang SVG (`animatePasarKuHeroWaves`), partikel cahaya pagi, dan kanvas vektor komoditas.
   - `scripts/catalog-view.js` (Maksimal 250 baris): Mengelola pencarian, penyaringan kategori, pengurutan, status antarmuka (`ready`, `loading`, `empty`, `error`), dan grafik [Chart.js](https://www.chartjs.org/).
   - `scripts/cart-drawer.js` (Maksimal 200 baris): Mengelola simulasi keranjang belanja, jarum timbangan, perhitungan anggaran, dan penyalinan nota ke *clipboard*.

## 2. Aturan Tipografi & Struktur Halaman Wajib

1. **Kewajiban Font Ubuntu Tunggal (100% Ubuntu)**:
   - Seluruh elemen teks (`body`, `h1` s.d. `h6`, `button`, `input`, `select`, `table`, label grafik, dan angka nominal Rupiah) **wajib menggunakan keluarga huruf [Ubuntu](https://fonts.google.com/specimen/Ubuntu)** (`font-family: 'Ubuntu', sans-serif !important;`).
   - Muat bobot huruf `300`, `400`, `500`, dan `700` dari Google Fonts. Gunakan properti `font-variant-numeric: tabular-nums` pada elemen harga agar digit Rupiah sejajar vertikal.
2. **Penghapusan Pita Papan Indeks Atas**:
   - Dilarang menampilkan pita berjalan (*top ticker marquee* "PAPAN INDEKS PPJ") di bagian atas halaman di atas *navbar*. Halaman wajib langsung dibuka dengan *navbar* bersih diikuti oleh **Hero Section PasarKu**.

## 3. Aturan Hard Gate Anti-Slop (Mutlak & Tanpa Pengecualian)

Pelanggaran terhadap satu saja aturan di bawah ini menyebabkan status pengiriman halaman menjadi **FAIL** menurut [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop):

| Kode Aturan | Nama Aturan | Ketentuan Wajib pada Proyek PasarKu Kota Bogor |
| :--- | :--- | :--- |
| **R-02** | Larangan Karakter Em-Dash | Dilarang keras menggunakan karakter *em-dash* pada teks antarmuka, judul, atau deskripsi. Gunakan tanda koma (`,`), titik dua (`:`), titik (`.`), atau tanda kurung `()`. |
| **R-03** | Responsivitas Seluler | Layout wajib rapi di layar ponsel (320px ke atas) hingga desktop tanpa *horizontal overflow*. Ukuran target sentuh tombol minimal `42px` hingga `44px`. |
| **R-17 & R-38** | Keaslian Data & Angka | Dilarang mengarang statistik palsu, klaim sepihak, atau harga fiktif. Semua harga wajib bersumber dari [Tabel Index Harga Perumda PPJ](https://pasarpakuanjaya.co.id/komoditas/index/view-all). |
| **R-18 & R-36** | Larangan Testimoni & Klaim Palsu | Jangan pernah membuat bagian testimoni fiktif, avatar acak, atau klaim performa yang tidak diukur. |
| **R-24** | Kejujuran Navigasi | Setiap tautan pada `<nav>` wajib mengarah ke ID bagian (`#section`) atau halaman nyata yang benar-benar ada dan berfungsi. |
| **R-25** | Kontras Warna WCAG AA+ | Semua teks normal wajib memiliki rasio kontras minimal `4.5:1` dan teks besar minimal `3:1` di kedua mode tema (Siang & Subuh). |
| **R-26** | Kelengkapan Fungsional | Setiap tombol, *dropdown*, *tab*, pin harga pasar, dan *input* wajib memiliki fungsi nyata yang mengubah *state* dan memperbarui tampilan. |
| **R-27** | Tiga Status Data Wajib | Setiap komponen yang menampilkan daftar data wajib memiliki tampilan **Status Memuat (Loading)**, **Status Kosong (Empty)**, dan **Status Gangguan (Error)** yang dapat dipulihkan. |
| **R-32** | Aksesibilitas Papan Ketik | Seluruh kontrol wajib dapat diakses dengan tombol `Tab`, diaktifkan dengan `Enter`/`Space`, memiliki indikator `:focus-visible` merah cabai (`#A92717`), dan dialog/panel wajib dapat ditutup dengan tombol `Escape`. |
| **R-33** | Larangan Skrip Tambalan CSS | Jangan memodifikasi fitur tampilan dengan skrip penambal eksternal yang merusak struktur asli; tulis aturan gaya langsung di dalam kode sumber. |
| **R-34** | Keutuhan Kedua Tema | Tombol pengalih tema (**Mode Subuh / Mode Siang**) wajib memperbarui seluruh permukaan, teks, dan warna grafik tanpa merusak tata letak. |
| **R-39** | Semantik & Gerak Aksesibel | Gunakan elemen asli (`<button>` untuk aksi, `<a href>` untuk navigasi), berikan `<label for="...">` terlihat pada setiap *input*, atur `cursor: pointer` di lapisan CSS dasar, hormati `@media (prefers-reduced-motion: reduce)`, dan sediakan tombol **Jeda / Putar** untuk animasi yang berjalan terus-menerus. |
| **R-40** | Mekanisme Performa | Setiap elemen `<img>` wajib mencantumkan atribut `width`, `height`, dan `alt`. Gambar utama di Hero Section wajib menggunakan `fetchpriority="high"` (bukan `loading="lazy"`), dan skrip pihak ketiga di `<head>` wajib memakai `defer`. |

## 4. Aturan Purpose-Gate & Quality Locks (Kualitas Visual & Copywriting)

1. **R-04 (Ikon Bermakna)**: Dilarang memuat pustaka ikon generik berlini tipis (seperti Lucide) sebagai dekorasi standar. Gunakan ilustrasi SVG botani/pasar kustom atau ikon keranjang belanja geometris tebal yang selaras dengan gaya **PasarKu**.
2. **R-05 & R-14 (Variasi Ritme & Hirarki Kartu)**:
   - Jangan membuat setiap bagian halaman memiliki pola seragam (judul tengah + subjudul + *grid* kartu identik).
   - Berikan pembeda hirarki pada kartu komoditas: komoditas pantauan utama (seperti Beras Medium, Cabai Rawit Merah, Bawang Merah, Minyak Goreng, Daging Sapi) menggunakan kartu lebar 2 kolom (`sm:col-span-2`) dengan bilah perbandingan rata-rata kategori, sedangkan komoditas reguler menggunakan kartu 1 kolom.
3. **R-09, R-10, R-12, R-13 (Batas Dekorasi)**:
   - Dilarang meletakkan lencana kapsul berkedip (*eyebrow pill badge* dengan titik *ping*) tepat di atas judul `<h1>`.
   - Dilarang menumpuk efek *blur*, *glow*, dan pola titik-titik (*dot grid*) tanpa tujuan fungsional.
4. **R-15 & R-16 (Bahasa Spesifik & Bebas Buzzword)**:
   - Gunakan teks tombol yang menjelaskan tindakan spesifik di pasar: `Mulai Sekarang`, `Lihat Harga`, `+ Timbang ke Keranjang`, `Buka Nota Belanja`, `Salin Daftar`.
   - Hindari kata klise pemasaran AI (*seamless*, *revolutionary*, *next-generation*, *AI-powered*).

## 5. Daftar Periksa Sebelum Rilis Halaman Baru (Delivery Gate)

Sebelum menyatakan halaman baru selesai dibangun, pastikan seluruh poin berikut bernilai **PASS**:

- [ ] **Cek Baris Kode**: Jalankan `wc -l` pada setiap file modul baru dan pastikan **tidak ada file yang melebihi 300 baris kode**.
- [ ] **Cek Font & Header**: Pastikan hanya font [Ubuntu](https://fonts.google.com/specimen/Ubuntu) yang digunakan dan tidak ada pita Papan Indeks di atas *navbar*.
- [ ] **Cek Karakter Terlarang**: Jalankan pemeriksaan teks untuk memastikan jumlah karakter *em-dash* adalah `0` (**R-02**).
- [ ] **Cek Fungsional & Status UI**: Uji klik pada setiap tombol, uji filter pencarian, uji ketiga status **R-27** (*Loading*, *Empty*, *Error*), uji tombol `Escape` pada modal/keranjang, dan uji peralihan **Mode Siang / Mode Subuh**.
