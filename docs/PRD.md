# Product Requirements Document (PRD) — HargaKu

Dokumen ini mendefinisikan visi produk, persona pengguna, arsitektur modul fitur, dan kriteria sukses fungsional platform **HargaKu** untuk kompetisi **Web In Action (Multimedia In Action 2026, UPN Veteran Jakarta)**.

---

## 1. Executive Summary & Problem Statement

### 1.1. Latar Belakang Masalah
* **Asimetri Informasi & Buta Harga**: Warga sering mengeluhkan harga bahan pokok yang terasa mahal, namun tidak memiliki cara mudah untuk mengetahui apakah harga komoditas tersebut memang sedang naik atau turun secara riil tanpa harus datang langsung ke pasar atau ke lapangan.
* **Kerentanan Terhadap Disparitas Harga Pedagang**: Ketika berbelanja di pasar tradisional, pembeli tidak memiliki patokan acuan objektif. Akibatnya, pembeli rentan dipatok harga sepihak yang berlebihan oleh pedagang tanpa mereka sadari.
* **Format Data Pemerintah Sulit Dipahami**: Informasi harga pangan resmi dari pemerintah (PIHPS Bank Indonesia dan Panel Harga Bapanas) tersedia di internet, namun disajikan dalam format tabel agregat makro/analis ekonomi yang kaku dan membingungkan orang awam.
* **Keterbatasan Cakupan Survei**: PIHPS hanya menyurvei 2 pasar utama per kota/kabupaten dengan 2 pedagang per komoditas, tanpa melibatkan partisipasi warga lokal secara langsung.

### 1.2. Solusi: Standarisasi Nasional Terkalibrasi Provinsi per Pulau & Tiga Lapis Harga
HargaKu hadir sebagai **pendamping belanja pangan cerdas** yang memberikan acuan harga terstandarisasi nasional dan disesuaikan dengan realitas supply-demand tingkat **Provinsi (dikelompokkan dalam 6 Koridor Pulau)**:
1. **Lapis 1 — Standarisasi Acuan Nasional Berbasis Provinsi & Koridor Pulau (HAP & HET Bapanas)**: Batas patokan harga dasar resmi dari Badan Pangan Nasional yang dikalibrasi berdasarkan provinsi dan koridor logistik pulau:
   - **Pulau Jawa**: Jawa Barat, DKI Jakarta, Jawa Tengah, Jawa Timur, Banten, DI Yogyakarta (Baseline sentra pangan `1.00x` / +0%).
   - **Pulau Sumatera**: Sumatera Utara, Sumatera Barat, Sumatera Selatan, Riau, Lampung (Logistik lintas selat `1.04x` – `1.06x`).
   - **Pulau Kalimantan**: Kalimantan Timur, Kalimantan Barat, Kalimantan Selatan (Logistik kargo laut `1.10x` – `1.12x`).
   - **Pulau Sulawesi**: Sulawesi Selatan, Sulawesi Utara (Lumbung beras & jagung KTI `1.08x`).
   - **Kepulauan Bali & Nusa Tenggara**: Bali, Nusa Tenggara Barat, Nusa Tenggara Timur (`1.06x` – `1.12x`).
   - **Kepulauan Maluku & Papua**: Maluku, Papua (Ketergantungan tol laut `1.20x` – `1.25x`).
   *Keuntungan Utama*: Warga di seluruh pelosok provinsi terwakili dengan adil tanpa dibatasi hanya segelintir kota, serta mencegah pedagang nakal mengkambinghitamkan "ongkos kapal" untuk mematok harga spekulatif.
2. **Lapis 2 — Rata-Rata Pasar Daerah (PIHPS BI & Bapanas)**: Survei harian resmi di pasar-pasar tradisional sentra pada provinsi yang dipilih pengguna.
3. **Lapis 3 — Laporan Partisipatif Warga (Crowdsourcing)**: Harga riil di level lapak pasar lokal yang dilaporkan langsung oleh warga dengan bukti foto nota/timbangan terverifikasi.

#### Dua Momen Kunci Penggunaan (*The Two Critical Moments*)
* **Momen 1: Dari Rumah (Pra-Belanja)**: Sebelum berangkat ke pasar, warga mengecek apakah komoditas tertentu sedang naik atau turun hari ini di provinsinya, meminta rekomendasi multi-sumber kepada **AI HargaKu**, dan memilih pasar tradisional yang paling wajar.
* **Momen 2: Di Depan Lapak (Saat Belanja)**: Saat pedagang menawarkan harga ("Cabai Rp 80.000/kg"), warga langsung memasukkan nominal tersebut ke fitur **Cek Harga Wajar** di HP -> dalam hitungan detik sistem mendeteksi apakah harga tersebut wajar atau melampaui acuan provinsi, dan warga bisa langsung berkonsultasi ke **AI HargaKu** untuk saran tawar dan perbandingan sumber.

### 1.3. Cakupan Wilayah & Penempatan UI Selector
* **Cakupan Wilayah**: **Standarisasi Tingkat Provinsi Berbasis 6 Koridor Pulau**. Pengguna dapat memilih provinsi dengan acuan resmi Bapanas.
* **Prinsip Bebas Redundansi UI (Top Navbar Only)**: Pemilih wilayah (Region Selector) diletakkan secara terpusat **eksklusif di Top Navbar (Desktop & Mobile)**. Header section halaman internal tidak lagi menampilkan duplikat tombol selector agar antarmuka bersih dan tidak menampilkan dua informasi ganda secara bersamaan.
* **12–15 Komoditas Strategis**:
  1. Beras Medium
  2. Beras Premium
  3. Minyak Goreng Curah
  4. Minyak Goreng Kemasan (MinyaKita)
  5. Gula Pasir
  6. Telur Ayam Ras
  7. Daging Ayam Ras
  8. Daging Sapi Murni
  9. Cabai Merah Keriting
  10. Cabai Rawit Merah
  11. Bawang Merah
  12. Bawang Putih Honan / Kating
  13. Tomat Sayur
  14. Kol / Kubis

---

## 2. Target Personas & User Journeys

### Persona 1: Bu Retno (Ibu Rumah Tangga / Pembeli Cerdas)
* **Profil**: Berusia 38 tahun, rutin belanja kebutuhan dapur ke pasar tradisional 2–3 kali seminggu menggunakan smartphone.
* **Goals**: Mengetahui apakah bahan pokok lagi naik atau turun sebelum berangkat belanja dari rumah, membandingkan pasar mana yang lebih murah di daerahnya, dan mendeteksi apakah harga yang ditawarkan pedagang di lapak terkena *mark-up* tidak wajar.
* **Key Flow**:
  1. **Sebelum Berangkat (Dari Rumah)**: Membuka HargaKu, memilih daerahnya (misal: "Kota Bogor"), melihat grafik tren harian di Dashboard apakah cabai atau telur sedang naik atau turun minggu ini.
  2. **Saat di Pasar (Depan Lapak)**: Ditawari cabai rawit Rp 75.000/kg oleh pedagang. Bu Retno membuka **Cek Harga Wajar**, memilih komoditas dan pasar tempat ia belanja, lalu memasukkan harga Rp 75.000.
  3. **Hasil Instan**: Sistem menampilkan status: **"▲ Agak Mahal (+15% di atas acuan wajar daerah)"** dengan acuan HAP terkalibrasi Rp 65.000, serta tombol instan untuk menanyakan rekomendasi lintas sumber ke AI HargaKu.
  4. Bu Retno dapat menawar dengan percaya diri menggunakan acuan resmi atau beralih ke lapak/pasar lain.

### Persona 2: Pak Jajang (Pedagang Sayur Keliling / Warung)
* **Profil**: Pedagang sayur berusia 45 tahun yang kulakan setiap subuh dan berjualan keliling perumahan.
* **Goals**: Mengetahui tren kenaikan harga cabai/bawang 7–30 hari ke depan, memantau harga di pasar-pasar induk di wilayahnya, serta menentukan harga jual eceran yang kompetitif namun tetap untung.
* **Key Flow**:
  1. Membuka **Dashboard Harga**, memfilter wilayah operasionalnya.
  2. Memeriksa komoditas yang sedang bergejolak (alert kenaikan >10% minggu ini).
  3. Membuka **Peta Harga** untuk mengecek perbandingan harga kulakan antar pasar di kotanya.

### Persona 3: Tim Admin / Moderator HargaKu
* **Profil**: Administrator platform & tim pemantau harga pangan.
* **Goals**: Memoderasi kiriman laporan harga dari warga agar data tetap kredibel dan bebas dari manipulasi/spam.
* **Key Flow**:
  1. Login ke panel `/admin`.
  2. Meninjau antrean laporan warga: memvalidasi bukti foto struk/nota/papan harga.
  3. Mengubah status laporan menjadi `APPROVED` atau `REJECTED`.

---

## 3. Scope & Modul Fitur

### Modul 1: Landing Page & Edukasi Publik (Fase A)
* Hero section dengan slogan *"Tahu harga, beli tenang, jual adil."*
* Widget interaktif cuplikan komoditas teratas & status harga hari ini.
* Penjelasan 3 lapis harga secara visual dan bersahabat.
* Call-to-action cepat ke fitur Cek Harga Wajar.

### Modul 2: Dashboard Harga & Tren Pasar (Fase A)
* **Selector Daerah Dinamis**: Pilihan wilayah (kabupaten/kota) aktif di bagian header yang menyesuaikan data harga pasar lokal dengan acuan nasional.
* Grid kartu komoditas dengan indikator tren pergerakan harian (naik/turun/stabil), sparkline 14 hari, tanggal pembaruan (*"Diperbarui: DD MMM YYYY"*), dan selisih terhadap HAP/HET acuan nasional terkalibrasi daerah.
* Grafik tren pergerakan harga 7–30 hari terakhir untuk memantau siklus inflasi pangan.
* Filter berdasarkan kategori pangan (Beras, Cabai/Bawang, Daging/Telur, Minyak/Gula).

### Modul 3: Cek Harga Wajar & Evaluasi Disparitas (Fase A — Fitur Inti)
* Form input sederhana: Pilih Komoditas ➔ Pilih Wilayah/Pasar ➔ Masukkan Harga Penawaran di Lapak.
* **Logika Kalkulasi & Indikator Status Kewajaran**:
  1. **Harga Pembanding**:
     * Prioritas 1: Median laporan warga terverifikasi di pasar tersebut (7 hari terakhir, min. 3 laporan) ➔ Tingkat Kepercayaan: **Tinggi**.
     * Prioritas 2: Rata-rata survei resmi pasar harian (PIHPS/Bapanas daerah) ➔ Tingkat Kepercayaan: **Sedang**.
     * Prioritas 3: Standarisasi Nasional HAP/HET Bapanas terkalibrasi Zonasi Wilayah ➔ Tingkat Kepercayaan: **Dasar/Regulasi**.
  2. **Klasifikasi Status**:
     * Deviasi dalam rentang `[-10% s.d. +10%]`: **Wajar** (Badge Hijau/Lime — Harga sesuai standar pasar).
     * Deviasi `[+10% s.d. +25%]`: **Agak Mahal** (Badge Oranye/Amber — Terindikasi di atas harga rata-rata).
     * Deviasi `> +25%`: **Terlalu Mahal** (Badge Merah — Peringatan harga terlalu tinggi).
     * Deviasi `< -15%`: **Jauh Lebih Murah** (Badge Biru — Peringatan cek kesegaran atau akurasi timbangan pedagang).
  3. **Konsultasi AI Multi-Sumber**: Tombol instan `[Tanya Rekomendasi AI Multi-Sumber]` untuk meminta Gemini AI membandingkan acuan PIHPS, Bapanas, Perumda PPJ, dan laporan warga.

### Modul 4: Halaman Tentang & Sumber Data (Fase A)
* Pernyataan transparansi metodologi data.
* Sumber resmi yang dirujuk (tautan ke PIHPS BI dan Badan Pangan Nasional).
* Label penegasan data simulasi demo bila diperlukan.

### Modul 5: Lapor Harga Warga / Crowdsourcing (Fase B)
* Form pelaporan harga warga di kios pasar tertentu.
* Unggah foto bukti (nota/kios/papan harga).
* **Keamanan & Privasi**: Penghapusan metadata EXIF dan lokasi presisi perangkat secara otomatis di browser sebelum upload; enkripsi hash IP untuk pencegahan spam (*rate limiting*).
* Status moderasi: `PENDING`, `APPROVED`, `REJECTED`.

### Modul 6: Peta Harga Antar-Pasar & Peta 3D 13 Unit Pasar (Fase B & Fase C)
* Halaman `/peta` menggunakan Leaflet untuk titik-titik pasar nasional (64 sentra) dan tabel peringkat harga lapak vs rerata wilayah.
* Halaman utama (`#unitPasarSection`) menghadirkan **Peta 3D Interaktif 13 Unit Pasar Kota Bogor** berbasis **Mapbox GL JS v3** + **Three.js 3D Building Custom Layer** (token Mapbox dibaca dinamis dari Supabase `system_settings`) lengkap dengan jalur koridor pasar, bangunan paviliun 3D pada koordinat asli Perumda PPJ, navigasi kamera `flyTo`, serta penyaring kecamatan.

### Modul 7: PUNTEN, Asisten AI Multi-Sumber & Tanya Jawab Harga (Menggantikan Keranjang)
* Karena HargaKu berfokus penuh pada transparansi & pengecekan harga (bukan e-commerce), fitur keranjang belanja dihapus dan digantikan oleh **PUNTEN** (`/rekomendasi-ai` & Drawer **Tanya PUNTEN**).
* Seluruh tombol pemicu konsultasi AI di aplikasi memakai label seragam **`Tanya PUNTEN`**.
* **PUNTEN** (didukung Google Gemini API dengan kunci dinamis dari Supabase `system_settings`) membandingkan harga dari **beberapa sumber resmi dan warga** (`PIHPS Bank Indonesia`, `Panel Harga Bapanas`, `Perumda Pasar Pakuan Jaya / Pasar Rakyat`, dan `Laporan Warga Terverifikasi`) sesuai wilayah aktif (`selectedRegion`), serta merender jawaban berformat **Markdown (`md`)** lengkap (tabel komparasi, heading, daftar poin, dan penekanan nominal).
* Pengguna dapat langsung **bertanya secara bebas** kepada PUNTEN (contoh: *"Lebih hemat beli Cabai Rawit berdasarkan acuan mana?"*, *"Ayam 45rb/kg di pasar wajar gak?"*, atau *"Bandingkan sumber harga beras & minyak minggu ini"*).

### Modul 8: Portal Admin Moderasi, Supabase CRUD, & Pengaturan AI + Peta Dinamis
* **Integrasi Supabase PostgreSQL**: Seluruh CRUD komoditas, pasar tradisional, entri harga harian (`daily_prices`), moderasi laporan warga (`citizen_reports`), dan konfigurasi API tersimpan langsung di database Supabase.
* **Modul Pengaturan & Integrasi AI + Peta Dinamis (`system_settings`)**: Admin dapat mengganti **Gemini API Key**, **Mapbox Access Token**, memilih model aktif, mengatur instruksi dasar, serta menguji koneksi API Gemini langsung dari Dashboard Admin tanpa mengubah kode sumber atau deploy ulang.
* **Tata Letak Sidebar SaaS**: Konsol kerja terpadu bagi administrator & tim pemantau pasar.
* **Modul Moderasi Laporan Warga**: Peninjauan antrean laporan warga, pendeteksian anomali statistik MAD, dan aksi persetujuan/penolakan.
* **CRUD Master Komoditas & Pasar Tradisional**: Pengelolaan lengkap komoditas dan pasar di seluruh koridor wilayah.
* **Fast-Entry Entri Harga Resmi Harian**: Matriks input cepat harga survei harian per pasar yang langsung memperbarui data publik dan harga lapak 3D.

### Modul 9: Slide-Over Drawer Konsultasi Harga PUNTEN (`/api/v1/assistant/chat`)
* Menggantikan tombol Keranjang di Top Navbar dan CTA halaman dengan tombol seragam **`[ Tanya PUNTEN ]`** yang membuka **Slide-over Drawer** interaktif maupun halaman penuh `/rekomendasi-ai`.
* Mendukung penuh rendering **Markdown** untuk tabel pembanding sumber, ringkasan poin, dan sorotan angka Rupiah. Grounded 100% pada data Supabase (`commodities`, `daily_prices`, `citizen_reports`).

---

## 4. Pembagian Fase Pengerjaan (Milestones Lomba)

| Fase | Target Tanggal | Deliverables Utama |
| :--- | :--- | :--- |
| **Fase A (Draft Wajib)** | 19 Okt – 1 Nov 2026 | Landing Page, Dashboard Harga, Cek Harga Wajar, Halaman Tentang/Sumber Data, README & first draft PDF. |
| **Fase B (Revisi Mentor)** | 8 – 10 Nov 2026 | Fitur Lapor Harga, Peta Harga Pasar, Keranjang Belanja, Portal Moderasi, polesan UI mobile. |
| **Roadmap (Masa Depan)** | Pasca Lomba | Integrasi Bot WhatsApp Cek Harga, notifikasi lonjakan harga kulakan pedagang, kemitraan Disperindag. |

---

## 5. Non-Functional Requirements (NFR)
1. **Mobile First & Low Latency**: Loading awal < 1.5 detik pada jaringan 4G smartphone standar.
2. **Kejujuran Data**: Dilarang menggunakan istilah "real-time" untuk data survei harian; wajib menyertakan label sumber dan tanggal.
3. **Data Anonymity**: Tidak mempublikasikan identitas pelapor warga dan tidak mempublikasikan nama kios pedagang individual.
