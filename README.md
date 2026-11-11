<div align="center">

  # HargaKu
  ### *Tahu harga, beli tenang, jual adil.*

  [![Event](https://img.shields.io/badge/Competition-Web%20In%20Action%20(MIA%202026)-orange?style=flat)]()
  [![Scope](https://img.shields.io/badge/Cakupan-21%20Provinsi%20(64%20Pasar)-emerald?style=flat)]()
  [![Tech](https://img.shields.io/badge/Stack-Next.js%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20Prisma-blue?style=flat)]()
  [![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql)]()

</div>

---

## 📌 Sekilas Proyek

**HargaKu** adalah website indeks transparansi harga pangan dan takaran pasar tradisional yang membantu pembeli dan pedagang kecil menjawab satu pertanyaan sederhana: **"Harga ini wajar atau tidak?"**.

Data resmi pemerintah (PIHPS Bank Indonesia dan Panel Harga Badan Pangan Nasional) sering kali tersaji dalam bentuk tabel agregat makro yang kaku dan berjarak dari kebutuhan riil pembeli di pasar. HargaKu hadir sebagai lapisan penerjemah (*actionable layer*) yang menggabungkan data resmi dengan **laporan partisipatif warga (crowdsourcing level pasar)** untuk menghasilkan wawasan langsung, peta harga antar-pasar, dan kalkulasi kewajaran harga secara transparan.

### 🎯 Cakupan Wilayah & Komoditas
* **Cakupan Wilayah**: **Nasional (21 Provinsi dalam 6 Koridor Logistik Pulau)** dengan **64 sentra pasar tradisional**.
* **12–15 Komoditas Strategis**: Beras medium, beras premium, minyak goreng (curah & MinyaKita), gula pasir, telur ayam ras, daging ayam ras, daging sapi, cabai merah keriting, cabai rawit merah, bawang merah, bawang putih, tomat, dan kol.

---

## ✨ Nilai Utama / Value Proposition

1. **Cek Harga Wajar Instan & Simpan ke Keranjang**: Masukkan komoditas, pasar, dan harga yang ditawarkan. Sistem langsung menghitung deviasi terhadap acuan dan memberikan status visual: **Wajar (±10%)**, **Agak Mahal (+10% s.d. +25%)**, **Terlalu Mahal (>+25%)**, atau **Jauh Lebih Murah (<-15%)**, serta tombol satu-klik untuk menyimpan barang ke keranjang belanja mingguan.
2. **Konsep Tiga Lapis Harga**:
   * **Lapis 1 — Harga Acuan Resmi**: HAP/HET Badan Pangan Nasional terkalibrasi zonasi pulau.
   * **Lapis 2 — Rata-Rata Pasar Resmi**: Data survei harian pasar tradisional daerah (06:00 WIB).
   * **Lapis 3 — Laporan Partisipatif Warga**: Verifikasi harga riil di level lapak pasar dengan bukti foto teranonimasi (EXIF metadata GPS otomatis disanitasi di peramban).
3. **Peta Harga Spasial & Komparasi Rerata Wilayah**: Peta interaktif Mapbox GL JS v3 dengan menu drawer Hamburger (filter & peringkat pasar dari yang paling hemat ke tertinggi tanpa data stok palsu/fiktif).
4. **Keranjang Belanja Multi-Wilayah & Bagikan WhatsApp**: Menghitung paket komparasi belanja mingguan antar pasar pada provinsi aktif, lengkap dengan tombol satu-klik ekspor format catatan belanja ke WhatsApp.

---

## 🏗️ Struktur Repositori

```text
HargaKu/
├── src/                # Kode sumber aplikasi (Next.js App Router)
│   ├── app/            # Routing halaman publik & admin
│   ├── components/     # UI components & interactive widgets
│   ├── features/       # Modular features (price-check, dashboard, reports)
│   └── lib/            # Prisma client, utilities, formula kalkulator
├── prisma/             # Skema database & file migrasi
├── docs/               # Cetak Biru Spesifikasi (Single Source of Truth)
│   ├── PRD.md          # Product Requirements Document
│   ├── NON_GOALS.md    # Batasan ruang lingkup & anti-scope creep
│   ├── SCHEMA.md       # Skema database & data dictionary
│   ├── API_SPEC.md     # Spesifikasi kontrak REST API
│   ├── DESIGN_SYSTEM.md# Token warna, tipografi, & panduan UI
│   ├── ENV_SPEC.md     # Spesifikasi variabel environment
│   ├── PITFALLS.md     # Catatan bug unik & panduan mitigasi
│   ├── TEST_MATRIX.md  # Kriteria uji & Definition of Done
│   └── adr/            # Architecture Decision Records
├── fonts/              # Aset font lokal (clay.com, webflow icons)
├── AGENTS.md           # Konstitusi AI & direktori router cepat
├── STATE.md            # Memori kerja aktif sprint
└── README.md           # Dokumentasi utama proyek
```

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router, React 19.3, Server & Client Components)
* **Bahasa**: TypeScript (Strict Mode, Zero `any`)
* **Styling**: Tailwind CSS
* **Database & ORM**: PostgreSQL via Prisma ORM
* **Map Engine**: Mapbox GL JS v3 + Three.js Custom Layer
* **Icons & UI**: Phosphor Icons (`@phosphor-icons/react`)
* **Dokumentasi & Standar**: Context7 MCP untuk verifikasi dokumentasi paket terkini

---

## 🚀 Panduan Memulai di Komputer Lokal

### 1. Prasyarat Sistem
* Node.js >= 20.x
* PostgreSQL aktif lokal atau cloud (misal Neon / Supabase)

### 2. Instalasi & Setup Database
```bash
# Clone dan masuk ke folder proyek
cd /Users/admin/code/HargaKu

# Install dependencies (selalu verifikasi via Context7)
npm install

# Setup environment
cp .env.example .env

# Jalankan migrasi dan seeder data awal
npx prisma db push
npm run db:seed
```

### 3. Menjalankan Aplikasi
```bash
npm run dev
```
Buka browser di: `http://localhost:3000`

> ⚠️ **Catatan Penting Integritas Data**: Seluruh data simulasi yang digunakan untuk pengujian demo ditandai dengan label resmi *"Data simulasi untuk demo"* sesuai standar transparansi Web In Action.

---

## 📚 Dokumen Spesifikasi Resmi

* [Product Requirements Document (PRD)](docs/PRD.md)
* [Batasan Produk (NON_GOALS)](docs/NON_GOALS.md)
* [Skema & Relasi Database](docs/SCHEMA.md)
* [Spesifikasi Kontrak API](docs/API_SPEC.md)
* [Design System & UI Tokens](docs/DESIGN_SYSTEM.md)
* [Spesifikasi Environment Variables](docs/ENV_SPEC.md)
* [Catatan Jebakan Bug (PITFALLS)](docs/PITFALLS.md)
* [Kriteria Uji & Definition of Done](docs/TEST_MATRIX.md)
* [Konstitusi AI (AGENTS.md)](AGENTS.md)
