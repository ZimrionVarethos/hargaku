# DESIGN_SYSTEM.md: PasarKu Kota Bogor Tactile Market Design System

Dokumen ini adalah acuan resmi (**Design System & UI Guidelines**) untuk seluruh antarmuka proyek **PasarKu Kota Bogor**, disinkronkan secara ketat dengan `rule.md`, `design.md`, dan `palet.md` serta standar anti-slop publikasi resmi [Perumda Pasar Pakuan Jaya Kota Bogor](https://pasarpakuanjaya.co.id/komoditas/index/view-all).

---

## 1. Brand Identity & Karakter Visual

* **Design Read**: `Platform Digital Eksplorasi & Pantauan Harga Komoditas Pasar Rakyat for Warga, Pedagang, dan Pemantau Pangan Kota Bogor, in a Warm Realistic Market Diorama & Tactile Broadsheet Card style, dial ENERGY 3 / RHYTHM 3 / MOTION 3.`
* **Warm Paper Canvas (`#F9F3EE`)**: Latar belakang gading hangat yang menyatu alami dengan karya seni lorong pasar realistis Kota Bogor.
* **Tinta Hutan Gelap (`#132E20`)**: Warna struktural tipografi utama, garis bingkai kartu tegas 2px, dan teks judul tebal.
* **Aksen Merah Cabai PasarKu (`#A92717`)**: Aksen tunggal untuk tombol aksi utama (CTA `Masuk Lorong`), lencana pantauan utama, markah pasar 3D aktif, dan fokus papan ketik.
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
5. **Tombol CTA Hero (`.pasarku-cta-btn`)**: `rounded-[16px]`, latar merah bata `#A92717`, teks putih tebal (`Masuk Lorong` tanpa ikon panah tombol, dengan penunjuk panah scroll ke bawah `.animate-scroll-cue` yang menganimasi ajakan scroll secara kontinu di bawah tombol dan patuh `prefers-reduced-motion`), bayangan lembut `0 10px 24px -4px rgba(169, 39, 23, 0.42)`.
6. **Tombol Aksi Kartu (`.market-btn-primary` & `.market-btn-secondary`)**: `rounded-[10px]`, `border: 2px solid var(--border-ink)`, `box-shadow: 2px 2px 0px var(--border-ink)`.
7. **Pemilih Dropdown Taktil (`<select>`)**: Seluruh `<select>` wajib memakai `appearance-none`, tinggi `min-h-[40px]`, padding kanan aman (`pr-9`), bayangan `--shadow-hard-sm`, fokus papan ketik `:focus-visible` (dilarang menonaktifkan outline aksesibel dengan `focus:outline-none`), dan ikon [`CaretDown`](https://phosphoricons.com/) (`14px` bold) absolut di `right-3` agar panah tidak menabrak kurva sudut `rounded-xl`.
8. **Pola Titik Buku Besar (`.ledger-leader`)**: Garis bertitik `1.5px dotted var(--border-subtle)` yang menghubungkan nama komoditas dan nominal harga pada papan cepat.

---

## 5. Tata Letak Panggung Halaman Utama PasarKu

* **Hero Section Diorama Pasar (`#heroSection`)**: Panggung sticky menyesuaikan tinggi aman di bawah Navbar (`calc(100dvh - navbar)`), sayap pasar kiri (`990x487`) dan sayap pasar kanan terpotong rapi (`829x362`, bebas artefak gambar tepi) proporsional tanpa distorsi, dilengkapi pendar lampu kios (`animate-lamp-glow`), kontur gelombang SVG pojok kanan atas proporsional (`viewBox="0 0 640 340"`, `non-scaling-stroke`) yang tersambung bersih dari tepi atas ke tepi kanan di seluruh lebar layar, dan kanvas partikel pagi. Wadah tengah (`max-w-3xl`) memuat judul satu baris adaptif `Cek Harga Sebelum ke Pasar` (`clamp(1.375rem, 0.75rem + 3.1vw, 3rem)`), subheadline pembanding harga lintas sumber (`max-w-md sm:max-w-xl`), tombol `Masuk Lorong` tanpa panah, serta penanda panah scroll SVG ke bawah beranimasi kontinu (`scrollCueNudge` pada `.animate-scroll-cue`, dapat diklik langsung untuk masuk lorong) di bawah tombol.
* **Papan Pokok & Sorotan Pangan (`#sorotanSection`)**: Pembagian asimetris 5:7 antara metrik pangan utama dan papan harga cepat 10 komoditas harian dengan aksi langsung **`Tanya PUNTEN`** (bagian timbangan mekanis dihilangkan agar alur fokus ke data pokok dan peta 3D).
* **Grafik Kategori (`#analitikSection`, `AnalitikBarChart`)**: Pembagian asimetris 4:8 antara 3 metrik kelompok dan grafik batang interaktif. Bagian atas kartu menampilkan **bilah inspeksi harga aktif** di luar area scroll agar nominal Rupiah komoditas tersorot/terpilih tidak pernah terpotong. Area plot memiliki ruang *headroom* atas (`pt-16`) dengan tooltip bertengger di atas masing-masing bilah (`bottom-full`, rata kiri/kanan pada indeks tepi), garis X-axis & garis batas rerata `100%` selebar trek scroll (`min-w-full w-max`), kontrol gulir horizontal, serta label 2 baris singkat dengan tombol bilah aksesibel (hover, ketuk layar sentuh, dan `Tab`).
* **Navbar & Logo Plakat Mode Subuh (`.pasarku-logo-plaque`)**: Menu utama Navbar diringkas menjadi 5 tautan inti (`Beranda`, `Cek Harga`, `Peta`, `Lapor`, `Komparasi AI`) agar lapang dan tidak memanjang di atas layar. Pengalih tema di Navbar tampil ringkas berupa tombol ikon tunggal (`Sun` saat Mode Subuh untuk kembali ke siang, `Moon` saat Mode Siang) dengan tinggi sejajar kontrol aksi (`40px`). Pada Mode Subuh (`data-theme="dark"`), logo `PasarKu` dibingkai oleh lapisan plakat kertas hangat (`#F9F3EE`) berbingkai ganda (`2px solid var(--border-ink)` + lis dalam `#E6D5B8` + `--shadow-hard-sm`) serta dirender tanpa kompresi ulang agresif agar tepi huruf hijau `#132E20` dan atap kios tampil tajam bebas artefak tepi gelap.
* **Peta 3D & Modal Detail 13 Unit Pasar (`#unitPasarSection`, `BogorMarketDetailModal`)**: Panggung interaktif **Mapbox GL JS v3** (gaya *Standard* sinkron Mode Siang `'day'` / Mode Subuh `'dusk'`, koridor jalur pasar GeoJSON, halo zona pasar, dan **Custom Layer 3D Three.js** 13 paviliun pendopo via `MercatorCoordinate.fromLngLat`), dilengkapi kamera terbang `flyTo`, bilah indeks ringkas 13 unit di bawah peta, serta **Modal Detail Pasar Taktil (`.market-card`)** yang muncul saat pengguna mengklik pin, bangunan 3D, atau tombol unit (memuat lokasi resmi, profil luas/kios, baris spesifikasi `.ledger-leader` koordinat GPS, navigasi antar-unit, fokus 3D, tautan Perumda PPJ, dan aksi **`Tanya PUNTEN`** adaptif Mode Siang & Subuh).
* **Panel Tanya PUNTEN Multi-Sumber & Markdown (`AssistantDrawer`, `AiMessageBubble`, `MarkdownMessage`, `/rekomendasi-ai`)**: Menggantikan keranjang belanja; menghadirkan persona asisten **PUNTEN** dengan avatar monogram `P`, tombol konsisten **`Tanya PUNTEN`**, serta parser **Markdown (`md`)** responsif untuk tabel perbandingan sumber, heading, kutipan, daftar poin, dan badge harga pada Mode Siang maupun Mode Subuh.
* **Footer Panorama Pasar, Latar Scenic 3 Aset, & Corak Ornamen (`Footer.tsx`, `FooterMarketPanorama.tsx`, `FooterScenicBackdrop.tsx`)**: Bagian **atas** footer menampilkan pita **Corak Batik Kawung Nusantara**, bingkai aksen gelombang PasarKu, foto panorama realistis **Pasar Rakyat Kota Bogor** (`public/images/pasarku/footer-market-real.jpg`) yang membaur halus di sisi kiri dan kanan (`md+`) lewat `.footer-market-mask` (`0%` ke `7%` / `93%` ke `100%`) di atas wadah solid `--bg-muted` dan sayap kabut luar (`right-full` / `left-full`) sehingga foto tetap penuh opasitas bebas tembus pola tegel maupun garis batas tajam, garis lengkung aksen yang berada di belakang (`z-0`, wadah foto `z-10`) dan memudar sebelum menyentuh foto, serta pembatas **Tegel Kunci**. Bagian **bawah** footer (3 kolom informasi `PasarKu Kota Bogor`, `Kantor Pusat Perumda PPJ`, dan `Referensi Data Terverifikasi`) dilapisi latar scenic 3 aset yang tampil di seluruh ukuran layar dari ponsel hingga desktop: bentang tengah bermotif batik + perbukitan (`pasarku-footer-tengah.webp` / `pasarku-footer-tengah-subuh.webp`), ilustrasi Tugu Kujang di sudut kiri bawah (`pasarku-footer-kiri.webp` / `pasarku-footer-kiri-subuh.webp`), dan kios pasar di sudut kanan bawah (`pasarku-footer-kanan.webp` / `pasarku-footer-kanan-subuh.webp`), dengan ruang tepi desktop dan padding bawah ponsel/tablet (`pb-28`–`pb-36`) agar teks tidak bertabrakan dengan ilustrasi pada Mode Siang maupun Mode Subuh.

---

## 6. Lorong Pasar 3D Interaktif (WebGL Three.js Architecture)

* **Panggung Full-Screen & HUD Mengambang (`PasarKuLorongHero`, `LorongWalkHud`, `LorongBottomBar`)**: Kanvas WebGL Lorong Pasar 3D mengisi `100%` tinggi & lebar wadah sticky (`absolute inset-0`) tanpa celah polos di atas/bawah. Bilah HUD atas (`Gerbang Depan`, badge jarak sebaris tinggi seragam `36px`, dan kotak pencarian komoditas aktif ber-autocomplete) serta bilah kategori bawah (`Mundur`, 5 tombol kategori, `Semua 53 Komoditas`, `Maju`) mengambang secara transparan (`backdrop-blur-md`) selaras Mode Siang dan Mode Subuh. Seluruh ikon memakai **Phosphor Icons** (`@phosphor-icons/react`) dengan nol emoji dan tanpa petunjuk tombol panah redundan.
* **5 Zona Kategori Berurutan & 20 Lapak 3D (`market-stalls.ts`, `COMPARTMENT_SLOTS`)**: Lorong sepanjang `64 m` dibagi berurutan dari depan ke belakang ke dalam tepat 5 zona (`4` sekat lapak kiri-kanan per zona):
  1. **`Sayuran`** (`1-13 m`): Kol, Wortel, Kangkung, Tomat
  2. **`Cabai & Bawang`** (`13-25 m`): Bawang Merah, Cabe Merah Keriting, Bawang Putih, Cabe Rawit Merah
  3. **`Beras & Sembako`** (`25-37 m`): Beras Medium, Gula Pasir, Minyak Goreng Kemasan, Beras Premium
  4. **`Daging & Telur`** (`37-49 m`): Daging Sapi Murni, Daging Ayam, Telur Ayam Ras, Telur Ayam Kampung
  5. **`Ikan & Buah`** (`49-61 m`): Ikan Kembung, Jeruk, Ikan Tuna, Semangka (dengan target lompatan kamera `0.785` aman di bawah tirai cahaya akhir lorong).
  Seluruh 53 komoditas [`BOGOR_COMMODITIES`](src/lib/data/bogor-commodities.ts) terpetakan penuh ke 5 zona pada laci komoditas & fitur pencarian.
* **Struktur Lapak Bertingkat, Lebar Lorong Trader, & Wadah Otentik**: Lapak kayu 3 undakan (`0.58 m`, `0.82 m`, `1.06 m`) menggunakan alas gundukan padat (`mound`) dan tekstur UV prosedural (ikan, cabai, daging marmer, botol minyak, beras, semangka, krat/baskom). Dinding samping lorong diperlebar ke `±2.86 m` (`±2.79 m` poster dinding pada `y = 2.15 m`, tiang rangka `±2.82 m`) sehingga membuka ruang berdiri bersih di balik lapak tanpa menembus meja maupun poster.
* **Figur Pedagang 3D Prosedural Generik (`three-vendors.ts`)**: Pedagang rendah-poligon berbasis `InstancedMesh` berdiri di belakang meja lapak (`x = ±2.46 m`, menghadap tengah lorong) tanpa nama individu/kios dan **bukan hitbox raycast**. Variasi kulit sawo matang (4 nada), baju palet PasarKu (`#A92717`, `#245034`, `#E6D5B8`, `#132E20`) bercorak batik halus, celemek, dan 4 aksesori kepala deterministik (`caping`, `kerudung`, `peci`, `topi kain`) dengan total poligon `< 40k`. Animasi idle tidak serempak (napas lembut, lirikan ke kamera dalam radius `< 6` unit, gerakan lengan sesekali) dan beradaptasi dengan cahaya lampion pada Mode Subuh.
* **POV Pembeli & Keranjang Belanja (`three-first-person.ts`)**: Grup rig menempel ke kamera (`camera.add(rig)` + `scene.add(camera)`) pada `z = -0.45 m` (`camera.near = 0.1`, `depthTest = true`, `renderOrder = 20`) menampilkan lengan kanan & keranjang anyaman bambu (`CanvasTexture`) berisi 2–3 sayuran mini, serta tangan kiri opsional hanya pada layar lebar (`aspect > 1.2`). Ayunan keranjang tersinkron dengan langkah kamera (`sin(progress * 32π + π/2) * 0.02`, kemiringan Z `±3°`, lag `lerp 0.15`). Pada layar ponsel (`aspect < 0.8`), rig diperkecil dan digeser ke bawah agar tidak menutupi lebih dari `18%` tinggi layar.
* **Sinkronisasi Tema Tanpa Rebuild Context & Aksesibilitas Kinerja**:
  * **Zero WebGL Context Rebuild**: Perubahan tema `Mode Siang <-> Mode Subuh` memperbarui warna latar, kabut, cahaya, material kayu/lingkungan, spanduk, pakaian pedagang, dan pencahayaan rig secara in-place melalui `setTheme(isDark)` tanpa menghancurkan `WebGLRenderer`.
  * **Throttle Idle ~30fps, Visibility Pause, Reduced Motion, & Low-End Fallback**: Loop animasi idle menandai `isDirty` maksimal ~30fps hanya ketika lorong terlihat (`isInsideMarket`, `IntersectionObserver`, tab aktif) dan berhenti total saat tidak terlihat. Preferensi `prefers-reduced-motion` membekukan gerak kepala, ayunan keranjang, dan gerakan pedagang dalam pose statis, sedangkan perangkat seluler berinti rendah (`navigator.hardwareConcurrency <= 4`) menurunkan kerapatan pedagang (`step = 2`) dan menyembunyikan tangan kiri.

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

---

## 8. Pengalih Fase Wilayah, Intelijen Stasiun, & Halaman Sekunder Dual-Theme

* **Pengalih Fase & Wilayah (`RegionPhaseSwitcher.tsx`)**: Pil kapsul Navbar menampilkan nama wilayah aktif + lencana fase singkat (`F1`–`F4`), serta membuka popover pemilih 4 fase (`Kota Bogor`, `Jabodetabek`, `Jawa Barat`, `Nasional`) dengan status aktif memakai `bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]` agar tetap terbaca optimal di Mode Subuh.
* **Penanda Kedekatan Stasiun & Sinyal Kelangkaan (`MarketInsightsPanel.tsx`, `PriceMarketContextBox.tsx`)**: Lencana stasiun memakai palet `--accent-chili-soft` / `--accent-chili` dengan ikon kereta, sedangkan agregat sinyal kelangkaan (`TERBATAS`, `LANGKA`, `PULIH`) dan komoditas mahal per pasar dikelompokkan bersih tanpa menyebut nama kios atau pedagang individu.
* **Konsistensi Dual-Theme Halaman Sekunder (`/komoditas/[slug]`, `/dashboard`, `/cek-harga`, `/lapor`, `/peta`, `/rekomendasi-ai`)**: Seluruh wadah kartu, grafik fluktuasi 30 hari (`PriceFluctuationChartCard`), header detail komoditas (`CommodityHeroHeader`), breadcrumb, dan tabel riwayat memakai variabel `--bg-card`, `--bg-muted`, `--text-primary`, `--text-secondary`, `--border-subtle`, dan `--forest-ink`.
