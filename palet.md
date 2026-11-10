# Sistem Palet Warna PasarKu Kota Bogor (`palet.md`)

Dokumen ini menetapkan standar warna resmi untuk seluruh halaman aplikasi web **PasarKu Kota Bogor** (pemantau harga komoditas [Perumda Pasar Pakuan Jaya Kota Bogor](https://pasarpakuanjaya.co.id/komoditas/index/view-all) dan direktori [13 Unit Pasar Rakyat Kota Bogor](https://www.pasarpakuanjaya.co.id/pasar)). Sesuai aturan **R-21**, **R-25**, **R-29**, dan **R-34** pada kerangka kerja [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop), sistem warna dibatasi secara ketat pada **3 warna inti (Core Colors) + 1 warna aksen tunggal (Deliberate Accent)** beserta permukaan netral bertekstur hangat yang memenuhi standar kontras aksesibilitas [WCAG 2.1 Level AA dan AAA](https://www.w3.org/TR/WCAG21/).

## 1. Prinsip Utama Palet Warna

1. **Keselarasan Ilustrasi Pasar Realistis**: Warna latar utama menggunakan krem gading hangat (`#F9F3EE`) yang diambil langsung dari sampel piksel latar gambar utama **PasarKu (Harga Pasar, Lebih Dekat)** sehingga perpaduan antara foto lorong pasar di sisi kiri/kanan dan ruang tipografi [Google Fonts Ubuntu](https://fonts.google.com/specimen/Ubuntu) di bagian tengah menyatu tanpa garis batas kasar.
2. **Disiplin Batas Warna (Aturan R-29)**: Dilarang menambahkan warna pelangi, *neon*, atau gradien ungu-biru. Seluruh halaman hanya boleh menggunakan:
   - **Core 1 (Permukaan Kertas Pasar)**: Krem Gading Hangat (`#F9F3EE`) dan Pasir Karung (`#EFE4D4`).
   - **Core 2 (Tinta Utama & Struktur Botani)**: Hijau Hutan Gelap PasarKu (`#132E20`) dan Hijau Daun Sayur (`#245034`).
   - **Core 3 (Kontur Tanah Liat & Rotan)**: Cokelat Keemasan Gelombang (`#B39C7A`) dan Cokelat Karung Beras (`#B47B38`).
   - **Deliberate Accent (Aksen Tunggal)**: Merah Bata Cabai PasarKu (`#A92717`) khusus untuk tombol aksi utama (CTA), lencana pantauan utama, jarum timbangan, dan indikator fokus papan ketik.
3. **Dukungan Dua Tema Penuh (Aturan R-21 & R-34)**: Setiap halaman baru wajib mendukung **Mode Siang (`data-theme="light"`)** dan **Mode Subuh (`data-theme="dark"`)** menggunakan variabel CSS (*Custom Properties*) yang sama tanpa merusak keterbacaan teks atau grafik.

## 2. Tabel Token Warna Inti (Mode Siang & Mode Subuh)

Gunakan variabel CSS berikut pada blok `:root` di setiap halaman atau komponen agar pergantian tema bekerja otomatis:

| Token Variabel CSS | Peran Visual & Komponen | Mode Siang (`light`) | Mode Subuh (`dark`) | Rasio Kontras Teks (WCAG 2.1) |
| :--- | :--- | :--- | :--- | :--- |
| `--bg-paper` | Latar belakang utama halaman & Hero Section | `#F9F3EE` (`rgb(249, 243, 238)`) | `#0F1914` (`rgb(15, 25, 20)`) | 14.1:1 terhadap `--text-primary` (AAA) |
| `--bg-card` | Permukaan dalam kartu komoditas, tabel, & modal | `#FFFFFF` (`rgb(255, 255, 255)`) | `#16241D` (`rgb(22, 36, 29)`) | 15.3:1 terhadap `--text-primary` (AAA) |
| `--bg-muted` | Latar bagian sekunder, *header* tabel, & *footer* | `#EFE4D4` (`rgb(239, 228, 212)`) | `#1E3127` (`rgb(30, 49, 39)`) | 11.8:1 terhadap `--text-primary` (AAA) |
| `--bg-stage` | Latar dalam panggung Meja Timbangan & kanvas vektor | `#132A1E` (`rgb(19, 42, 30)`) | `#0A120E` (`rgb(10, 18, 14)`) | 13.9:1 terhadap teks `#F9F3EE` (AAA) |
| `--text-primary` | Judul utama (`h1`-`h3`), nama komoditas, & garis tepi | `#132E20` (`rgb(19, 46, 32)`) | `#F9F3EE` (`rgb(249, 243, 238)`) | Standar AAA pada seluruh permukaan |
| `--text-secondary` | Subjudul, alamat pasar, & deskripsi informasi | `#263E30` (`rgb(38, 62, 48)`) | `#D0DDD4` (`rgb(208, 221, 212)`) | 9.6:1 pada `--bg-paper` (AAA) |
| `--text-muted` | Keterangan satuan (`/kg`, `/ikat`), nomor indeks (`#16`) | `#566B5D` (`rgb(86, 107, 93)`) | `#9AB0A1` (`rgb(154, 176, 161)`) | 5.2:1 pada `--bg-paper` (AA+) |
| `--forest-ink` | Angka nominal harga Rupiah (`Rp 35.000`) & tautan | `#245034` (`rgb(36, 80, 52)`) | `#6EE7A0` (`rgb(110, 231, 160)`) | 8.4:1 pada `--bg-card` (AAA) |
| `--forest-surface` | Latar kotak ikon SVG sayuran di dalam kartu | `#E2EFE6` (`rgb(226, 239, 230)`) | `#1E3829` (`rgb(30, 56, 41)`) | Kontras ikon tegas dengan garis `#132E20` |
| `--accent-chili` | Tombol CTA `Mulai Sekarang`, `+ Keranjang`, & aksen `Ku` | `#A92717` (`rgb(169, 39, 23)`) | `#E54D37` (`rgb(229, 77, 55)`) | 5.8:1 terhadap teks putih `#FFFFFF` (AA+) |
| `--accent-chili-hover` | Warna tombol utama saat kursor diarahkan (*hover*) | `#8C1E10` (`rgb(140, 30, 16)`) | `#FF6650` (`rgb(255, 102, 80)`) | 7.1:1 terhadap teks putih `#FFFFFF` (AAA) |
| `--border-ink` | Garis tepi kartu (`2px solid`), tombol, & *input* | `#132E20` (`rgb(19, 46, 32)`) | `#4E6B59` (`rgb(78, 107, 89)`) | Pembatas struktural tegas |
| `--border-subtle` | Garis pemisah baris tabel & garis titik-titik papan harga | `#D8C8B0` (`rgb(216, 200, 176)`) | `#2A3F33` (`rgb(42, 63, 51)`) | Pemisah halus non-intrusif |
| `--wave-line-gold` | Garis kontur gelombang lapis dalam pada Hero Section | `#B39C7A` (`rgb(179, 156, 122)`) | `#9E8866` (`rgb(158, 136, 102)`) | Elemen dekoratif bermakna (R-07) |
| `--wave-line-dark` | Garis kontur gelombang lapis luar pada Hero Section | `#132E20` (`rgb(19, 46, 32)`) | `#6EE7A0` (`rgb(110, 231, 160)`) | Pembatas organik antara pasar & teks |

## 3. Palet Ilustrasi Komoditas & Efek Atmosfer Pasar

Untuk menjaga keseragaman visual antara ilustrasi vektor SVG, grafik [Chart.js](https://www.chartjs.org/), dan foto pasar realistis di Hero Section, gunakan kode warna spesifik berikut:

| Kategori / Elemen Visual | Warna Isi Utama (Fill) | Warna Sorotan / Aksen | Warna Garis Tepi (Stroke) | Penggunaan Spesifik |
| :--- | :--- | :--- | :--- | :--- |
| **Cabai Merah & Tomat** | `#A92717` / `#C8321E` | `#FCA5A5` | `#132E20` (`2.2px`) | Ilustrasi Cabai Rawit Merah, Tomat, dan titik pin komoditas pedas |
| **Sayuran Daun & Cabai Hijau** | `#245034` | `#A7F3D0` / `#E2EFE6` | `#132E20` (`2.2px`) | Ilustrasi Bayam, Kangkung, Sawi, Kol, dan batang tanaman |
| **Wortel & Buah Segar** | `#D9531E` / `#EA580C` | `#FDE68A` | `#132E20` (`2.2px`) | Ilustrasi Wortel Bogor, Jeruk, Pepaya, dan titik pin umbi |
| **Bawang Merah** | `#881337` | `#FBCFE8` | `#132E20` (`2.2px`) | Ilustrasi Bawang Merah dan Jengkol |
| **Beras & Pangan Pokok** | `#B47B38` | `#F9F3EE` | `#132E20` (`2.2px`) | Ilustrasi Karung Beras, Kedelai, Jagung, dan Tepung |
| **Minyak, Telur & Gula** | `#D97706` / `#EAB308` | `#FDE68A` | `#132E20` (`2.2px`) | Ilustrasi Telur Ayam Ras, Minyak Goreng, dan Mentega |
| **Daging Sapi & Ayam** | `#9F1239` | `#FECDD3` | `#132E20` (`2.2px`) | Ilustrasi Daging Sapi Murni dan Daging Ayam |
| **Ikan Segar** | `#1D4ED8` | `#BFDBFE` | `#132E20` (`2.2px`) | Ilustrasi Ikan Kembung, Ikan Tuna, dan Ikan Tongkol |
| **Cahaya Lampu Kios Pasar** | `rgba(255, 210, 115, 0.65)` | `rgba(255, 180, 60, 0)` | Tanpa garis tepi | Pendar *radial-gradient* di atas lampu gantung kios pasar realistis |
| **Partikel Cahaya Pagi** | `rgba(217, 155, 65, 0.45)` | `rgba(217, 155, 65, 0.15)` | Tanpa garis tepi | Partikel debu cahaya matahari pagi pada kanvas atmosfer Hero |

## 4. Cuplikan Implementasi CSS Wajib

Salin blok deklarasi variabel CSS berikut ke bagian atas lembar gaya (`styles/tokens.css` atau blok `<style>`) pada setiap halaman baru yang dibangun:

```css
:root,
html[data-theme="light"] {
  --bg-paper: #F9F3EE;
  --bg-card: #FFFFFF;
  --bg-muted: #EFE4D4;
  --bg-stage: #132A1E;
  --text-primary: #132E20;
  --text-secondary: #263E30;
  --text-muted: #566B5D;
  --forest-ink: #245034;
  --forest-surface: #E2EFE6;
  --accent-chili: #A92717;
  --accent-chili-hover: #8C1E10;
  --border-ink: #132E20;
  --border-subtle: #D8C8B0;
  --wave-line-gold: #B39C7A;
  --wave-line-dark: #132E20;
  --shadow-hard: 3px 3px 0px #132E20;
  --shadow-hard-sm: 2px 2px 0px #132E20;
}

html[data-theme="dark"] {
  --bg-paper: #0F1914;
  --bg-card: #16241D;
  --bg-muted: #1E3127;
  --bg-stage: #0A120E;
  --text-primary: #F9F3EE;
  --text-secondary: #D0DDD4;
  --text-muted: #9AB0A1;
  --forest-ink: #6EE7A0;
  --forest-surface: #1E3829;
  --accent-chili: #E54D37;
  --accent-chili-hover: #FF6650;
  --border-ink: #4E6B59;
  --border-subtle: #2A3F33;
  --wave-line-gold: #9E8866;
  --wave-line-dark: #6EE7A0;
  --shadow-hard: 3px 3px 0px #060B08;
  --shadow-hard-sm: 2px 2px 0px #060B08;
}
```

## 5. Larangan Warna & Efek Visual (Anti-Slop Color Gate)

- **Dilarang menggunakan efek *Glassmorphism* berlebihan (R-10)**: Jangan menerapkan `backdrop-filter: blur()` secara bersamaan pada kartu komoditas, *modal*, *sidebar*, dan tombol. Gunakan permukaan solid `--bg-card` dengan garis tepi tegas `2px solid var(--border-ink)`.
- **Dilarang menggunakan teks bergradien (R-01)**: Jangan menggunakan `bg-clip-text text-transparent bg-gradient-to-r` pada judul halaman. Gunakan warna solid `#132E20` untuk kata `Pasar` dan `#A92717` untuk kata `Ku`.
- **Dilarang menggunakan bayangan kabur (*soft floating shadows*) pada kartu biasa (R-12)**: Gunakan bayangan struktural tegas (`--shadow-hard: 3px 3px 0px #132E20`) pada seluruh kartu komoditas dan unit pasar. Bayangan lembut berwarna merah hangat (`0 10px 24px -4px rgba(169, 39, 23, 0.42)`) hanya diizinkan pada satu tombol aksi utama (`.pasarku-cta-btn`) di Hero Section.
