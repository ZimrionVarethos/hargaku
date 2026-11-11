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

* **Hero Section Diorama Pasar (`#heroSection`)**: Panggung sticky menyesuaikan tinggi aman di bawah Navbar (`calc(100dvh - navbar)`, polos tanpa tegel maupun garis batas `border-b-2` bawah agar bebas garis ganda di bawah Navbar), sayap pasar kiri (`990x487`) dan sayap pasar kanan terpotong rapi (`829x362`, bebas artefak gambar tepi) proporsional tanpa distorsi, dilengkapi pendar lampu kios (`animate-lamp-glow`), kontur gelombang SVG pojok kanan atas proporsional (`viewBox="0 0 640 340"`, `non-scaling-stroke`) yang tersambung bersih dari tepi atas ke tepi kanan di seluruh lebar layar, dan kanvas partikel pagi. Wadah tengah (`max-w-3xl`) memuat judul satu baris adaptif `Cek Harga Sebelum ke Pasar` (`clamp(1.375rem, 0.75rem + 3.1vw, 3rem)`), subheadline pembanding harga lintas sumber (`max-w-md sm:max-w-xl`), tombol `Masuk Lorong` tanpa panah, serta penanda panah scroll SVG ke bawah beranimasi kontinu (`scrollCueNudge` pada `.animate-scroll-cue`, dapat diklik langsung untuk masuk lorong) di bawah tombol.
* **Papan Pokok & Sorotan Pangan (`#sorotanSection`)**: Berlatar `--bg-paper` dengan lapisan tegel batik (`BatikMeshBackground`), dipisahkan dari Hero oleh pita `KawungBand` (`size="md"`, `variant="scallop"`) dan menuju `#analitikSection` menggunakan pemisah gelombang organik `CacingWaveDivider`. Memuat pembagian asimetris 5:7 antara metrik pangan utama dan papan harga cepat 10 komoditas harian (`.market-card` solid `var(--bg-card)`) dengan aksi langsung **`Tanya PUNTEN`**.
* **Grafik Kategori (`#analitikSection`, `AnalitikBarChart`)**: Berlatar `--bg-muted` polos tanpa tegel untuk menjaga keterbacaan angka dan grid grafik, diapit simetris oleh `CacingWaveDivider` di tepi atas (transisi `--bg-paper -> --bg-muted`) maupun tepi bawah (transisi `--bg-muted -> --bg-paper`). Pembagian asimetris 4:8 antara 3 metrik kelompok dan grafik batang interaktif. Bagian atas kartu menampilkan **bilah inspeksi harga aktif** di luar area scroll agar nominal Rupiah komoditas tersorot/terpilih tidak pernah terpotong. Area plot memiliki ruang *headroom* atas (`pt-16`) dengan tooltip bertengger di atas masing-masing bilah (`bottom-full`, rata kiri/kanan pada indeks tepi), garis X-axis & garis batas rerata `100%` selebar trek scroll (`min-w-full w-max`), kontrol gulir horizontal, serta label 2 baris singkat dengan tombol bilah aksesibel (hover, ketuk layar sentuh, dan `Tab`).
* **Navbar & Logo Plakat Mode Subuh (`.pasarku-logo-plaque`)**: Menu utama Navbar diringkas menjadi 4 tautan inti (`Beranda`, `Cek Harga`, `Peta`, `Lapor`) karena **Komparasi AI** telah disatukan langsung ke halaman `/cek-harga`, sehingga navigasi tetap ringkas dan lapang di atas layar. Pengalih tema di Navbar tampil ringkas berupa tombol ikon tunggal (`Sun` saat Mode Subuh untuk kembali ke siang, `Moon` saat Mode Siang) dengan tinggi sejajar kontrol aksi (`40px`). Pada Mode Subuh (`data-theme="dark"`), logo `PasarKu` dibingkai oleh lapisan plakat kertas hangat (`#F9F3EE`) berbingkai ganda (`2px solid var(--border-ink)` + lis dalam `#E6D5B8` + `--shadow-hard-sm`) serta dirender tanpa kompresi ulang agresif agar tepi huruf hijau `#132E20` dan atap kios tampil tajam bebas artefak tepi gelap.
* **Peta 3D & Modal Detail 13 Unit Pasar (`#unitPasarSection`, `BogorMarketDetailModal`)**: Dipisahkan dari `#analitikSection` oleh `CacingWaveDivider` (`flip`, tanpa `KawungBand` di atas peta agar komposisi lapang), berlatar `--bg-paper` dengan lapisan tegel batik (`BatikMeshBackground`, sementara `BogorMarketDetailModal` dirender di luar wadah `isolate` agar lapisan modal `z-50` selalu berada di atas Navbar) dan tanpa garis bawah tambahan supaya tidak menumpuk dengan pita puncak `Footer`. Panggung interaktif **Mapbox GL JS v3** (gaya *Standard* sinkron Mode Siang `'day'` / Mode Subuh `'dusk'`, koridor jalur pasar GeoJSON, halo zona pasar, dan **Custom Layer 3D Three.js** 13 paviliun pendopo via `MercatorCoordinate.fromLngLat`), dilengkapi kamera terbang `flyTo`, bilah indeks ringkas 13 unit di bawah peta, serta **Modal Detail Pasar Taktil (`.market-card`)** yang muncul saat pengguna mengklik pin, bangunan 3D, atau tombol unit (memuat lokasi resmi, profil luas/kios, baris spesifikasi `.ledger-leader` koordinat GPS, navigasi antar-unit, fokus 3D, tautan Perumda PPJ, dan aksi **`Tanya PUNTEN`** adaptif Mode Siang & Subuh).
* **Maskot 3D PUNTEN AI, Drawer Tanya PUNTEN, & Cek Harga Terpadu (`/cek-harga`)**: Menggabungkan halaman Cek Harga dan Komparasi AI ke `/cek-harga` bersama panel **`PuntenIntegratedPanel`**, memperbarui avatar PUNTEN menjadi karakter **Maskot 3D PUNTEN AI** (`PuntenMascot3D` WebGL Three.js + `PuntenMascotAvatar` vektor `#123B2B`, `#B52D19`, `#F8F2EB`, `#D9C9B3`, mata visor `#6EE7A0` dengan ekspresi `normal`, `happy`, `curious`, `thinking`, `surprised`), dan memunculkan **`PuntenScrollMascot`** interaktif di pojok kanan bawah ketika pengguna scroll eksplorasi dalam/lama (*"Lagi cari harga apa nih?"*) yang langsung mengarahkan ke `/cek-harga` saat diklik. Memakai parser **Markdown (`md`)** responsif dan palet penuh Mode Siang serta Mode Subuh.
* **Footer Panorama Pasar, Latar Scenic 3 Aset, & Corak Ornamen (`Footer.tsx`, `FooterMarketPanorama.tsx`, `FooterScenicBackdrop.tsx`)**: Bagian **atas** footer menampilkan pita `KawungBand` (`size="md"`, `variant="scallop"`) tanpa `border-t-2` ganda di `<footer>`, bingkai sayap lengkung kontur Cacing PasarKu berlatar `BatikMeshBackground` (`opacity={0.35}`, `fadeEdges={false}`, `adaptiveScale={false}`), foto panorama realistis **Pasar Rakyat Kota Bogor** (`public/images/pasarku/footer-market-real.jpg`) berukuran proporsional (`md:max-w-[720px] lg:max-w-[820px]`, `h-[205px]` hingga `lg:h-[340px]`, posisi fokus `object-[50%_90%]` agar lantai ubin paving, peti komoditas sayur, dan bakul bawang duduk solid menapak tanah) yang membaur halus di sisi kiri/kanan (`md+` lewat `.footer-market-mask` `0%->10%` / `90%->100%`) serta tepi atas langit (`.footer-market-vertical-mask` `7%` atas menuju transparan) tanpa memudarkan bagian bawah gambar, garis lengkung aksen `z-0` di sayap tepi agar memudar sebelum menyentuh foto, serta penutup bawah `CacingWaveDivider` (`topColor="transparent"`, `bottomColor="transparent"`, `flip`, merapat naik `-mt-[18px] sm:-mt-[24px]`) yang langsung mendekap alas lantai pasar dan mengalir menyatu ke langit backdrop scenic di bawahnya tanpa celah kosong mengambang maupun garis potong tajam. Bagian **bawah** footer (3 kolom informasi `PasarKu Kota Bogor`, `Kantor Pusat Perumda PPJ`, dan `Referensi Data Terverifikasi`) mempertahankan latar scenic 3 aset secara utuh tanpa diubah: bentang tengah bermotif batik + perbukitan (`pasarku-footer-tengah.webp` / `pasarku-footer-tengah-subuh.webp`), ilustrasi Tugu Kujang di sudut kiri bawah (`pasarku-footer-kiri.webp` / `pasarku-footer-kiri-subuh.webp`), dan kios pasar di sudut kanan bawah (`pasarku-footer-kanan.webp` / `pasarku-footer-kanan-subuh.webp`), dengan ruang atas aman di bawah gelombang Cacing serta padding bawah ponsel/tablet (`pb-28` hingga `pb-36`) agar teks tidak bertabrakan dengan ilustrasi pada Mode Siang maupun Mode Subuh.

### 5.1. Ornamen Kawung, Kontur Cacing, & Tekstur Tegel Batik (`src/components/ornament/`)

1. **`KawungBand` (`KawungBand.tsx`)**:
   * Pita motif Kawung SVG (`36x30` pada varian default `scallop` atau `36x20` pada `flat`, latar `--ochre-surface`, elips `--earth-ochre` berisikan sapuan halus `fillOpacity=0.22` dengan kontur `--border-ink`, belah ketupat `--accent-chili`, titik tepi, lengkung renda bawah + bintik chili, serta garis atas `--border-ink`). Memakai `useId()` untuk `<pattern>` agar bebas tabrakan ID antar-instansi dalam satu halaman.
   * Varian ukuran & bentuk: `size?: 'sm' | 'md'`, `variant?: 'scallop' | 'flat'` (default `'scallop'`, mobile `<640px` `h-6` skala `0.8`, desktop `sm+` `h-[30px]` skala `1:1` pada `size="md"` agar renda lengkung tetap utuh tanpa terpotong).
   * **Aturan Batas Pita**: **Maksimal 2 pita `KawungBand`** pada halaman utama (`Hero -> Sorotan` dan puncak `Footer`). Pita di atas `#unitPasarSection` (Peta 3D) dihapus agar ritme halaman lapang; dilarang menumpuk dua pita berdekatan dan dilarang menambah pita pada `Navbar` atau modal.
2. **`CacingWaveDivider` (`CacingWaveDivider.tsx`)**:
   * Pembatas gelombang kontur organik dua lapis (`--wave-line-gold` dan `--border-ink`, `viewBox="0 0 1440 46"`, `preserveAspectRatio="none"`, `vectorEffect="non-scaling-stroke"`) dengan prop `{ topColor?: string; bottomColor?: string; flip?: boolean; className?: string }`.
   * Mendukung transisi latar antar section (`--bg-paper <-> --bg-muted`) maupun mode masker atas transparan bawah (`bottomColor="transparent"`) pada transisi `FooterMarketPanorama` ke `FooterScenicBackdrop` agar tekstur langit batik latar bawah menyatu langsung tanpa garis warna datar.
3. **`BatikMeshBackground` (`BatikMeshBackground.tsx`)**:
   * Lapisan tekstur tegel batik SVG (`48x48` di `sm+` dan `64x64` di `<640px` via `patternTransform="scale(1.3333)"`) dengan `useId()`, ditempatkan pada `absolute inset-0 z-0 pointer-events-none select-none` di dalam wadah ber-`relative isolate overflow-hidden` sementara isi berada di `relative z-10`.
   * Opasitas adaptif default: `0.16` di `<640px` (`light`), `0.22` di `>=640px` (`light`), dan `0.14` di Mode Subuh (`html[data-theme="dark"]`), dengan fade mask tepi 15% atas/bawah (`fadeEdges = true`). Footer mengirim `{ opacity: 0.35, fadeEdges: false, adaptiveScale: false }`.
   * **Peta Latar & Transisi Landing**:
     - `#heroSection` (Hero / Lorong 3D): **polos** -> `KawungBand` (`scallop`) -> `#sorotanSection`
     - `#sorotanSection` (Papan Pokok): `--bg-paper` + `BatikMeshBackground` -> `CacingWaveDivider` -> `#analitikSection`
     - `#analitikSection` (Grafik Komparasi): `--bg-muted` **polos** -> `CacingWaveDivider` (`flip`) -> `#unitPasarSection`
     - `#unitPasarSection` (Peta 3D 13 Pasar): `--bg-paper` + `BatikMeshBackground` -> `Footer`
     - `Footer`: `KawungBand` (`scallop`) puncak + `BatikMeshBackground` (`0.35`) + sayap & batas bawah `CacingWaveDivider` menyatu ke `FooterScenicBackdrop` (Tugu Kujang tetap utuh).

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
* **Konsistensi Dual-Theme Halaman Sekunder (`/komoditas/[slug]`, `/dashboard`, `/cek-harga`, `/lapor`, `/peta`)**: Seluruh wadah kartu, grafik fluktuasi 30 hari (`PriceFluctuationChartCard`), header detail komoditas (`CommodityHeroHeader`), breadcrumb, dan tabel riwayat memakai variabel `--bg-card`, `--bg-muted`, `--text-primary`, `--text-secondary`, `--border-subtle`, dan `--forest-ink`. Halaman `/cek-harga` mengadopsi pola **"Kartu Kasir Sederhana"** (pil takaran harian `1 kg`/`1/2 kg`/`1/4 kg`/`1 ons`, putusan selisih Rupiah per takaran dibeli, rincian 4 sumber lipat-buka, serta panel obrolan Maskot 3D PUNTEN AI tanpa duplikasi kartu), sedangkan rute lama `/rekomendasi-ai` dan `/keranjang` secara otomatis diarahkan (*redirect*) ke `/cek-harga#punten-panel`.
* **Panggung Mapbox Luas & Menu Hamburger (`/peta`, `PetaSpatialStage`, `MapboxMarketMap`, `PetaHamburgerDrawer`)**: Halaman `/peta` memperluas kanvas **Mapbox GL JS v3** selebar kontainer viewport (`min-h-[560px]` hingga tinggi layar di bawah Navbar, sinkron Mode Siang `'day'` / Mode Subuh `'night'`, marker pil harga berwarna indeks relatif, `fitBounds` lintas fase wilayah, `flyTo` kamera 3D, serta kontrol `Putar 3D` & `Semua Pasar`). Seluruh bagian judul informasi, filter komoditas, legenda indeks relatif, toggle **Mode Ringan (Tabel Langsung)**, dan **Urutan Harga Pasar** diringkas masuk ke dalam laci geser **`PetaHamburgerDrawer`** yang dipicu tombol ikon **Hamburger (`☰ Menu & Filter`)** mengambang di pojok kiri atas peta sehingga navigasi filter maupun pemilihan pasar tetap ringkas pada desktop maupun ponsel.
