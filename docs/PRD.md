# Product Requirements Document (PRD) — HargaKu

Dokumen ini mendefinisikan visi produk, persona pengguna, arsitektur modul fitur, dan kriteria sukses fungsional platform **HargaKu** untuk kompetisi **Web In Action (Multimedia In Action 2026, UPN Veteran Jakarta)**.

---

## 1. Executive Summary & Problem Statement

### 1.1. Latar Belakang Masalah
* **Asimetri Informasi & Buta Harga**: Warga sering mengeluhkan harga bahan pokok yang terasa mahal, namun tidak memiliki cara mudah untuk mengetahui apakah harga komoditas tersebut memang sedang naik atau turun secara riil tanpa harus datang langsung ke pasar atau ke lapangan.
* **Kerentanan Terhadap Disparitas Harga Pedagang**: Ketika berbelanja di pasar tradisional, pembeli tidak memiliki patokan acuan objektif. Akibatnya, pembeli rentan dipatok harga sepihak yang berlebihan oleh pedagang tanpa mereka sadari.
* **Format Data Pemerintah Sulit Dipahami**: Informasi harga pangan resmi dari pemerintah (PIHPS Bank Indonesia dan Panel Harga Bapanas) tersedia di internet, namun disajikan dalam format tabel agregat makro/analis ekonomi yang kaku dan membingungkan orang awam.
* **Keterbatasan Cakupan Survei**: PIHPS hanya menyurvei 2 pasar utama per kota/kabupaten dengan 2 pedagang per komoditas, tanpa melibatkan partisipasi warga lokal secara langsung.

### 1.2. Positioning & Solusi: Alat Bantu Keputusan Belanja (Melengkapi PIHPS) + Tiga Lapis Harga
HargaKu / **PasarKu** diposisikan sebagai **alat bantu keputusan saat berbelanja**: pengguna memasukkan **jumlah**, **satuan**, dan **harga yang ditawarkan**, lalu melihat perbandingannya dengan **acuan nasional**, **acuan daerah setempat (Kota Bogor)**, dan **informasi pasar setempat**. Direktori pasar, laporan warga (harga tidak wajar), laporan pedagang (kelangkaan komoditas), dan **Tanya PUNTEN** saling terintegrasi melengkapi alur keputusan pembeli. **PasarKu melengkapi PIHPS Bank Indonesia dan Panel Harga Bapanas** dengan alur yang lebih dekat ke keputusan pembeli, **bukan menggantikan data atau fungsi pemantauan PIHPS**.

Tiga lapis pembanding harga yang digunakan:
1. **Lapis 1 — Acuan Nasional & Kalibrasi Wilayah (HAP & HET Bapanas)**: Batas patokan harga dasar nasional dari Badan Pangan Nasional beserta penyesuaian logistik wilayah:
   - **Pulau Jawa**: Kota Bogor (Fase 1 Pilot `1.00x`), Jabodetabek (Fase 2), Jawa Barat (Fase 3), DKI Jakarta, Jawa Tengah, Jawa Timur, Banten, DI Yogyakarta (`1.00x` – `1.02x`).
   - **Pulau Sumatera**: Sumatera Utara, Sumatera Barat, Sumatera Selatan, Riau, Lampung (Logistik lintas selat `1.04x` – `1.07x`).
   - **Pulau Kalimantan**: Kalimantan Timur, Kalimantan Barat, Kalimantan Selatan (Logistik kargo laut `1.09x` – `1.12x`).
   - **Pulau Sulawesi**: Sulawesi Selatan, Sulawesi Utara, Sulawesi Tengah (`1.07x` – `1.11x`).
   - **Kepulauan Bali & Nusa Tenggara**: Bali, Nusa Tenggara Barat (`1.06x` – `1.08x`).
   - **Kepulauan Maluku & Papua**: Maluku, Papua (Ketergantungan tol laut `1.22x` – `1.28x`).
2. **Lapis 2 — Rata-Rata Pasar Daerah & Survei Harian (PIHPS BI, Bapanas, & Perumda PPJ)**: Survei harian resmi di pasar tradisional aktif (termasuk 13 unit pasar Perumda PPJ Kota Bogor).
3. **Lapis 3 — Laporan Partisipatif Dua Sisi (Warga & Pedagang)**:
   - **Laporan Warga (Harga Lapak)**: Harga riil dan laporan harga mahal tidak wajar per unit pasar yang diagregasi menjadi sinyal komoditas apa yang sedang mahal di pasar tertentu (misal pasar dekat Stasiun Bogor: Pasar Kebon Kembang/Anyar, Pasar Devries, Pasar Merdeka).
   - **Laporan Pedagang (Kelangkaan Komoditas)**: Sinyal pasokan terbatas atau langka di lapak/pasar (tetap anonim per pasar tanpa menyebut nama pedagang) agar pembeli memahami penyebab lonjakan harga di lapangan.

#### Dua Momen Kunci Penggunaan (*The Two Critical Moments*)
* **Momen 1: Dari Rumah (Pra-Belanja)**: Sebelum berangkat ke pasar, warga mengecek apakah komoditas tertentu sedang naik atau turun hari ini di provinsinya, meminta rekomendasi multi-sumber kepada **AI HargaKu**, dan memilih pasar tradisional yang paling wajar.
* **Momen 2: Di Depan Lapak (Saat Belanja)**: Saat pedagang menawarkan harga ("Cabai Rp 80.000/kg"), warga langsung memasukkan nominal tersebut ke fitur **Cek Harga Wajar** di HP -> dalam hitungan detik sistem mendeteksi apakah harga tersebut wajar atau melampaui acuan provinsi, dan warga bisa langsung berkonsultasi ke **AI HargaKu** untuk saran tawar dan perbandingan sumber.

### 1.3. Cakupan Wilayah 4 Fase & Penempatan UI Selector
* **Skala Cakupan Berjenjang (4 Fase)**:
  1. **Fase 1 — Kota Bogor (Pilot Aktif)**: 13 unit pasar rakyat Perumda Pasar Pakuan Jaya (`reg_bogor`, termasuk koridor pasar dekat Stasiun Bogor: Kebon Kembang/Anyar, Devries, Merdeka).
  2. **Fase 2 — Jabodetabek (Penyangga)**: DKI Jakarta, Bodetabek (`reg_bodebek`, `reg_jakarta`, `reg_banten`).
  3. **Fase 3 — Jawa Barat**: Cakupan penuh Jawa Barat (`reg_jabar`: Bogor, Bandung, sentra pasok Jabar).
  4. **Fase 4 — Nasional**: 21 provinsi dalam 6 koridor pulau dengan kalibrasi logistik resmi Bapanas RI.
* **Prinsip Bebas Redundansi UI (Top Navbar Only)**: Pemilih wilayah & fase (4-Phase Region Selector) diletakkan secara terpusat di **Top Navbar**. Halaman internal mengikuti wilayah aktif secara otomatis tanpa tombol duplikat.
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

### Modul 3: Cek Harga Wajar & Keputusan Belanja (Fitur Inti — Pelengkap PIHPS)
* Form input belanja di depan lapak: Pilih Komoditas ➔ Masukkan **Jumlah & Satuan** (`ons`, `1/4 kg`, `1/2 kg`, `kg`, `liter`, `ikat`, `butir`) ➔ Pilih **Pasar Tradisional** ➔ Masukkan **Harga Penawaran Pedagang**.
* **Pembanding Berbasis Konteks Lokal & Nasional**:
  * **Acuan Nasional (HAP/HET Bapanas)** & **Acuan Daerah Setempat (Kota Bogor / Wilayah Aktif)** ditampilkan berdampingan agar pembeli melihat perbandingan skala nasional dan lokal sekaligus.
  * Prioritas 1: **Median laporan warga terverifikasi** di pasar terpilih (`>= 2` laporan harga `APPROVED`), atau fallback median wilayah ➔ Tingkat Kepercayaan: **Tinggi**.
  * Prioritas 2: **Survei harian pasar terpilih** / rerata resmi PIHPS & Perumda PPJ ➔ Tingkat Kepercayaan: **Sedang**.
  * Prioritas 3: **Standarisasi Nasional HAP/HET Bapanas** terkalibrasi zonasi logistik ➔ Tingkat Kepercayaan: **Dasar/Regulasi**.
* **Kartu Intelijen Pasar Setempat (`marketContext`)**: Menampilkan komoditas apa saja yang sedang dilaporkan mahal oleh warga (`> +10%`) dan peringatan kelangkaan komoditas dari pedagang pada pasar terpilih (misal pasar dekat Stasiun Bogor).
* **Klasifikasi Status**:
  * Deviasi dalam rentang `[-10% s.d. +10%]`: **Wajar** (Hijau/Forest — sesuai acuan).
  * Deviasi `[+10% s.d. +25%]`: **Agak Mahal** (Amber — di atas acuan wajar).
  * Deviasi `> +25%`: **Terlalu Mahal** (Merah Chili — melampaui toleransi wajar).
  * Deviasi `< -15%`: **Jauh Lebih Murah** (Lime/Biru — cek kesegaran mutu & timbangan).
* **Konsultasi AI Multi-Sumber**: Tombol **`Tanya PUNTEN`** dan tautan langsung **`Lapor Harga / Kelangkaan di Pasar Ini`**.

### Modul 4: Halaman Tentang & Sumber Data (Fase A)
* Pernyataan transparansi metodologi data dan penegasan posisi bahwa **PasarKu melengkapi PIHPS BI dan Panel Harga Bapanas**, bukan menggantikan fungsi pemantauannya.
* Tautan ke PIHPS BI, Bapanas, serta label penegasan data simulasi demo bila digunakan.

### Modul 5: Lapor Warga & Pedagang (Crowdsourcing Dua Sisi)
* **Jalur Warga (`WARGA · PRICE`)**: Melaporkan harga riil maupun harga tidak wajar di pasar tertentu beserta jumlah, satuan, konversi standar `/kg`, dan foto bukti (nota/papan harga) dengan penghapusan metadata EXIF otomatis di browser.
* **Jalur Pedagang (`PEDAGANG · SHORTAGE`)**: Pedagang dapat melaporkan kelangkaan atau keterbatasan pasokan komoditas (`TERBATAS`, `LANGKA`, `PULIH`) di pasar tertentu **secara anonim** (tanpa mengekspos nama kios atau pedagang perorangan) beserta catatan penyebab pasokan agar pembeli memahami dinamika stok.
* Deteksi anomali MAD (`> 25%`) dan moderasi status `PENDING` / `ANOMALY` / `APPROVED` / `REJECTED` di `/admin`.

### Modul 6: Peta Harga Antar-Pasar, Peta 3D 13 Unit Pasar, & Intelijen Lokasi
* Halaman `/peta` menggunakan Leaflet untuk titik pasar sesuai fase & wilayah aktif (`Bogor` -> `Jabodetabek` -> `Jabar` -> `Nasional`), menampakkan jumlah laporan warga terverifikasi riil dan sinyal kelangkaan pedagang per pasar, beserta tautan cepat ke `/cek-harga?market=...` dan `Tanya PUNTEN`.
* Halaman utama (`#unitPasarSection`) menghadirkan **Peta 3D 13 Unit Pasar Kota Bogor** berbasis **Mapbox GL JS v3** + **Three.js 3D Building Custom Layer**. Modal rincian pasar menampilkan penanda **Dekat Stasiun Bogor** (Kebon Kembang/Anyar, Devries, Merdeka), ringkasan **"Sedang Mahal Menurut Laporan Warga"**, dan **"Info Kelangkaan Pedagang"** lengkap dengan tombol **`Cek Harga di Pasar Ini`** dan **`Lapor Harga/Kelangkaan`**.

### Modul 7: PUNTEN, Asisten AI Multi-Sumber & Tanya Jawab Harga
* Seluruh tombol pemicu konsultasi AI di aplikasi memakai label seragam **`Tanya PUNTEN`**.
* **PUNTEN** membandingkan **Acuan Nasional (HAP/HET Bapanas)**, **Acuan Daerah / Kota Bogor**, **Survei PIHPS / PPJ**, serta **Laporan Warga & Sinyal Kelangkaan Pedagang per pasar** (termasuk menjawab pertanyaan seperti *"Di pasar dekat Stasiun Bogor lagi mahal apa?"*), serta merender jawaban berformat **Markdown (`md`)** lengkap tanpa menggantikan fungsi pemantauan PIHPS.

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
