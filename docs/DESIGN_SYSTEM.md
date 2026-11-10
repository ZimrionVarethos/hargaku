# DESIGN_SYSTEM.md: PasarKu Kota Bogor Tactile Market Design System

Dokumen ini adalah acuan resmi (**Design System & UI Guidelines**) untuk seluruh antarmuka proyek **PasarKu Kota Bogor**, disinkronkan secara ketat dengan `rule.md`, `design.md`, dan `palet.md` serta standar anti-slop publikasi resmi [Perumda Pasar Pakuan Jaya Kota Bogor](https://pasarpakuanjaya.co.id/komoditas/index/view-all).

---

## 1. Brand Identity & Karakter Visual

* **Design Read**: `Platform Digital Eksplorasi & Pantauan Harga Komoditas Pasar Rakyat for Warga, Pedagang, dan Pemantau Pangan Kota Bogor, in a Warm Realistic Market Diorama & Tactile Broadsheet Card style, dial ENERGY 3 / RHYTHM 3 / MOTION 3.`
* **Warm Paper Canvas (`#F9F3EE`)**: Latar belakang gading hangat yang menyatu alami dengan karya seni lorong pasar realistis Kota Bogor.
* **Tinta Hutan Gelap (`#132E20`)**: Warna struktural tipografi utama, garis bingkai kartu tegas 2px, dan teks judul tebal.
* **Aksen Merah Cabai PasarKu (`#A92717`)**: Aksen tunggal untuk tombol aksi utama (CTA `Mulai`), lencana pantauan utama, markah pasar 3D aktif, dan fokus papan ketik.
* **Gaya Kartu Tiket Taktil (`Tactile Market Ticket`)**: Bingkai padat 2px solid dengan bayangan tegas tanpa kabur (`3px 3px 0px #132E20` di mode siang, `3px 3px 0px #060B08` di mode subuh).
* **Dua Tema Lengkap**: Mode Siang (`data-theme="light"`) dan Mode Subuh (`data-theme="dark"`).

---

## 2. Token Warna Resmi (`palet.md`)

| Token Variabel CSS | Mode Siang (`light`) | Mode Subuh (`dark`) | Penggunaan |
| :--- | :--- | :--- | :--- |
| `--bg-paper` | `#F9F3EE` | `#0F1914` | Latar utama halaman & Hero Section |
| `--bg-card` | `#FFFFFF` | `#16241D` | Kartu komoditas, tabel, & modal |
| `--bg-muted` | `#EFE4D4` | `#1E3127` | Latar bagian sekunder & footer |
| `--bg-stage` | `#132A1E` | `#0A120E` | Panggung kanvas 3D gelap & aksen kontras tinggi |
| `--text-primary` | `#132E20` | `#F9F3EE` | Judul `h1`-`h3`, nama komoditas |
| `--text-secondary` | `#263E30` | `#D0DDD4` | Subjudul, alamat pasar, deskripsi |
| `--text-muted` | `#566B5D` | `#9AB0A1` | Satuan `/kg`, nomor indeks `#16` |
| `--forest-ink` | `#245034` | `#6EE7A0` | Angka nominal harga Rupiah |
| `--forest-surface` | `#E2EFE6` | `#1E3829` | Latar kotak ikon SVG sayuran |
| `--earth-ochre` | `#A68F6D` | `#D8C098` | Kontur aksen rotan & bumi |
| `--ochre-surface` | `#F5E9D4` | `#2C2418` | Latar lencana peringatan & anomali |
| `--warning-ink` | `#8A5316` | `#F3D08A` | Teks & ikon lencana peringatan |
| `--accent-chili` | `#A92717` | `#E54D37` | Tombol CTA, aksen Ku, jarum |
| `--accent-chili-hover`| `#8C1E10` | `#FF6650` | Status hover tombol utama |
| `--border-ink` | `#132E20` | `#4E6B59` | Garis tepi kartu (`2px solid`) |
| `--border-subtle` | `#D8C8B0` | `#2A3F33` | Garis pemisah & titik buku besar |
| `--wave-line-gold` | `#B39C7A` | `#9E8866` | Garis kontur gelombang lapis dalam |
| `--wave-line-dark` | `#132E20` | `#6EE7A0` | Garis kontur gelombang lapis luar |
| `--shadow-hard` | `3px 3px 0px #132E20` | `3px 3px 0px #060B08` | Bayangan tegas kartu taktil |
| `--shadow-hard-sm` | `2px 2px 0px #132E20` | `2px 2px 0px #060B08` | Bayangan tegas tombol aksi |

---

## 3. Tipografi 100% Ubuntu (`rule.md`)

Seluruh elemen teks antarmuka **MANDATORI** menggunakan keluarga huruf [Google Fonts Ubuntu](https://fonts.google.com/specimen/Ubuntu):
* **Display / Hero (`<h1>`)**: `Ubuntu Bold (700)`, `30px` (ponsel) hingga `50px` (desktop), `line-height: 1.14`.
* **Judul Bagian (`<h2>`)**: `Ubuntu Bold (700)`, `24px` hingga `30px`.
* **Judul Kartu (`<h3>`)**: `Ubuntu Bold (700)`, `16px` (reguler) hingga `20px` (utama).
* **Angka Harga (`.font-mono-num`)**: `Ubuntu Bold (700)` dengan `font-variant-numeric: tabular-nums` agar sejajar vertikal.
* **Larangan Em-Dash (R-02)**: Dilarang keras menggunakan karakter em-dash (`—`). Gunakan tanda koma, titik dua, titik, atau kurung.

---

## 4. Geometri Komponen Kartu & Tombol (`design.md`)

1. **Kartu Standar (`.market-card`)**: `rounded-[14px]`, `border: 2px solid var(--border-ink)`, `box-shadow: var(--shadow-hard)`.
2. **Kartu Interaktif (`.market-card-interactive`)**: Bergerak `translate(-2px, -2px)` dan bayangan naik menjadi `5px 5px 0px var(--border-ink)` saat kursor diarahkan.
3. **Kartu Pantauan Utama (2 Kolom, R-14)**: Lebar 2 kolom (`sm:col-span-2`), lencana merah `KOMODITAS PANTAUAN UTAMA`, ilustrasi SVG `64x64px`, harga `24px`, bilah perbandingan rata-rata kategori.
4. **Kartu Komoditas Reguler (1 Kolom)**: Lebar 1 kolom, ilustrasi SVG `48x48px`, nomor indeks (`INDEKS #XX`), subkategori, harga `20px`.
5. **Tombol CTA Hero (`.pasarku-cta-btn`)**: `rounded-[16px]`, latar merah bata `#A92717`, teks putih tebal, ikon panah masuk lorong, bayangan lembut `0 10px 24px -4px rgba(169, 39, 23, 0.42)`.
6. **Tombol Aksi Kartu (`.market-btn-primary` & `.market-btn-secondary`)**: `rounded-[10px]`, `border: 2px solid var(--border-ink)`, `box-shadow: 2px 2px 0px var(--border-ink)`.
7. **Pola Titik Buku Besar (`.ledger-leader`)**: Garis bertitik `1.5px dotted var(--border-subtle)` yang menghubungkan nama komoditas dan nominal harga pada papan cepat.

---

## 5. Tata Letak Panggung Halaman Utama PasarKu

* **Hero Section Diorama Pasar (`#heroSection`)**: Panggung sticky menyesuaikan tinggi aman di bawah Navbar (`calc(100dvh - navbar)`), sayap pasar kiri (`990x487`) dan sayap pasar kanan terpotong rapi (`829x362`, bebas artefak gambar tepi) proporsional tanpa distorsi, dilengkapi pendar lampu kios (`animate-lamp-glow`), kontur gelombang SVG pojok kanan atas proporsional (`viewBox="0 0 640 340"`, `non-scaling-stroke`) yang tersambung bersih dari tepi atas ke tepi kanan di seluruh lebar layar, dan kanvas partikel pagi.
* **Papan Pokok & Sorotan Pangan (`#sorotanSection`)**: Pembagian asimetris 5:7 antara metrik pangan utama dan papan harga cepat 10 komoditas harian dengan aksi langsung **`Tanya PUNTEN`** (bagian timbangan mekanis dihilangkan agar alur fokus ke data pokok dan peta 3D).
* **Grafik Kategori (`#analitikSection`)**: Pembagian asimetris 4:8 antara 3 metrik kelompok dan grafik batang SVG taktil dengan garis batas rerata kategori.
* **Navbar & Logo Plakat Mode Subuh (`.pasarku-logo-plaque`)**: Pengalih tema di Navbar tampil ringkas berupa tombol ikon tunggal (`Sun` saat Mode Subuh untuk kembali ke siang, `Moon` saat Mode Siang) dengan tinggi sejajar kontrol aksi (`40px`). Pada Mode Subuh (`data-theme="dark"`), logo `PasarKu` dibingkai oleh lapisan plakat kertas hangat (`#F9F3EE`) berbingkai ganda (`2px solid var(--border-ink)` + lis dalam `#E6D5B8` + `--shadow-hard-sm`) serta dirender tanpa kompresi ulang agresif agar tepi huruf hijau `#132E20` dan atap kios tampil tajam bebas artefak tepi gelap.
* **Peta 3D & Modal Detail 13 Unit Pasar (`#unitPasarSection`, `BogorMarketDetailModal`)**: Panggung interaktif **Mapbox GL JS v3** (gaya *Standard* sinkron Mode Siang `'day'` / Mode Subuh `'dusk'`, koridor jalur pasar GeoJSON, halo zona pasar, dan **Custom Layer 3D Three.js** 13 paviliun pendopo via `MercatorCoordinate.fromLngLat`), dilengkapi kamera terbang `flyTo`, bilah indeks ringkas 13 unit di bawah peta, serta **Modal Detail Pasar Taktil (`.market-card`)** yang muncul saat pengguna mengklik pin, bangunan 3D, atau tombol unit (memuat lokasi resmi, profil luas/kios, baris spesifikasi `.ledger-leader` koordinat GPS, navigasi antar-unit, fokus 3D, tautan Perumda PPJ, dan aksi **`Tanya PUNTEN`** adaptif Mode Siang & Subuh).
* **Panel Tanya PUNTEN Multi-Sumber & Markdown (`AssistantDrawer`, `AiMessageBubble`, `MarkdownMessage`, `/rekomendasi-ai`)**: Menggantikan keranjang belanja; menghadirkan persona asisten **PUNTEN** dengan avatar monogram `P`, tombol konsisten **`Tanya PUNTEN`**, serta parser **Markdown (`md`)** responsif untuk tabel perbandingan sumber, heading, kutipan, daftar poin, dan badge harga pada Mode Siang maupun Mode Subuh.
* **Footer Panorama Pasar & Corak Ornamen (`Footer.tsx`, `FooterMarketPanorama.tsx`)**: Bagian dasar footer meniadakan teks hak cipta/tagline statis dan menggantinya dengan pita **Corak Batik Kawung Nusantara**, bingkai aksen gelombang PasarKu, serta foto panorama realistis **Pasar Rakyat Kota Bogor** (`public/images/pasarku/footer-market-real.jpg`) yang membaur halus di tepi atas/samping ke warna `--bg-muted` dan bertumpu pada motif dasar **Tegel Kunci**, tampil proporsional tanpa padding berlebih di ponsel maupun desktop pada Mode Siang & Mode Subuh.

---

## 6. Lorong Pasar 3D Interaktif (WebGL Three.js Architecture)

* **Struktur Lapak Bertingkat, Gema Tekstur UV Organik, & Wadah Otentik**: Lapak kayu 3 undakan (Depan 0.58m, Tengah 0.82m, Belakang 1.06m) menggunakan alas gundukan padat (`mound`) dan tekstur UV prosedural otentik: ikan kembung pipih bersirip ekor V-fork di atas es serut bak biru, cabai melengkung bertangkai hijau menggunung penuh, daging sapi marmer, minyak goreng botol keemasan, bak beras terbuka, serta krat/keranjang/baskom pasar tradisional.
* **Sinkronisasi Satu Sumber Kebenaran (`BOGOR_COMMODITIES`)**: Seluruh 18 lapak 3D mengambil ID, nama resmi, satuan (`/kg`, `/ikat`, `/liter`), kategori, dan harga resmi langsung dari `BOGOR_COMMODITIES`, memastikan konsistensi mutlak antara spanduk, objek 3D, hitbox raycast, dan popup rincian.
* **Poster Dinding & Spanduk Gantung Lapak**: Setiap sekat komoditas dilengkapi poster dinding di sisi kiri/kanan dan spanduk gantung yang hanya menampilkan ilustrasi gambar komoditas, nomor lapak, kategori, dan nama barang (bebas angka harga statis karena harga dikelola dinamis dari fetch API & Konsol Admin). Harga dinamis tetap tampil pada papan harga meja, tooltip sorotan, dan modal detail.
* **Optimasi Kinerja Ekstrem (Anti-Lag)**:
  * **Batching `THREE.InstancedMesh`**: Seluruh ribuan butir komoditas organik digambar dalam belasan draw call terpadu, menghemat draw call WebGL lebih dari 95%.
  * **Pencahayaan Terkumpul (Pooled Dynamic Lights)**: Menggunakan 2 `PointLight` dinamis yang mengikuti posisi kamera pengguna serta eliminasi render pass transmissive ganda.
  * **Render On-Demand & Pembersihan GPU**: Loop render berinterpolasi halus hanya berjalan aktif saat kamera bergerak/di-scroll, disertai pembersihan total geometri, material, dan tekstur saat unmount.

---

## 7. Konsol Admin & Portal Masuk PasarKu (`/admin` & `/admin/login`)

Seluruh halaman dan modal konsol pengawas (`/admin`, `/admin/login`) wajib mengikuti sistem desain taktil PasarKu secara penuh pada **Mode Siang (`data-theme="light"`)** maupun **Mode Subuh (`data-theme="dark"`)**:

* **Identitas & Pengalih Tema**: `AdminTopbar` dan `AdminLoginForm` menyertakan logo `PasarKu` berplakat kertas hangat (`.pasarku-logo-plaque`) beserta tombol ikon tunggal pengalih tema (`Sun` / `Moon`) yang terhubung ke `useTheme()`.
* **Permukaan & Aksi Konsisten**: Seluruh wadah memakai `.market-card`, navigasi aktif dan CTA primer memakai `.market-btn-primary` (`var(--accent-chili)`), kontrol sekunder memakai `.market-btn-secondary`, dan tombol persetujuan moderasi menggunakan warna hutan taktil (`var(--forest-ink)` / `#245034`).
* **Paritas Tabel Data dengan `PetaMarketRankTable`**: Seluruh daftar/tabel data admin (`Katalog Komoditas`, `Sentra Pasar`, `Entri Harga Harian`, dan `Antrean Moderasi Laporan`) mengikuti anatomi tabel broadsheet `PetaMarketRankTable`:
  1. Wadah luar `.market-card p-5 sm:p-6 flex flex-col gap-4`.
  2. Kepala kartu berisi judul, subjudul keterangan, dan kapsul ringkasan jumlah data (`bg-[var(--bg-muted)] border border-[var(--border-subtle)]`) dengan garis pembatas bawah tegas **`border-b-2 border-[var(--border-ink)]`**.
  3. Header kolom `<thead>` transparan bertepi bawah `border-b border-[var(--border-subtle)]` (`text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]`).
  4. Baris `<tbody>` berpemisah `divide-y divide-[var(--border-subtle)]`, bulatan nomor indeks (`1, 2, 3...`), nominal harga `.font-mono-num` tebal berwarna `var(--forest-ink)`, lencana status kapsul semantik (`--forest-surface`, `--ochre-surface`/`--warning-ink`, `--accent-chili-soft`/`--accent-chili`), dan pasangan aksi `.market-btn-secondary` + tombol ikon `border border-[var(--border-ink)]`.
