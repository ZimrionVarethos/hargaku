# API_SPEC.md: RESTful API Contract Specification

Dokumen ini adalah kontrak resmi (**API Contract**) antara frontend dan backend Fullstack Next.js + Supabase PostgreSQL pada platform **HargaKu**.

---

## 1. Standar Global & Konvensi API
* **Base URL**: `/api/v1`
* **Protocol**: HTTPS / JSON payload (`Content-Type: application/json`)
* **Frontend Fetcher**: Seluruh pemanggilan API terisolasi di `src/lib/api/` dengan fallback graceful saat offline.

### Format Envelope Standar
```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

---

## 2. Daftar Endpoint Publik

### 2.1. `GET /api/v1/regions`
Daftar provinsi dalam 6 koridor pulau beserta zonasi Bapanas dan `logisticsCostPct`. Query opsional: `island`, `search`.

### 2.2. `GET /api/v1/commodities` & `GET /api/v1/commodities/:slug`
Mengambil daftar atau detail komoditas pangan terkini dari database Supabase (`commodities` + agregasi `daily_prices`), dengan query `region` dan `category`.

### 2.3. `GET /api/v1/markets`
Mengambil daftar pasar tradisional aktif pada wilayah terpilih dari Supabase `markets`.

### 2.4. `POST /api/v1/price-check`
Mengevaluasi penawaran harga pedagang di lapak terhadap Lapis 1 (HAP/HET Bapanas terkalibrasi), Lapis 2 (Rerata survei harian DB), dan Lapis 3 (Laporan warga terverifikasi).
* Status evaluasi: `FAIR`, `SLIGHTLY_EXPENSIVE` (`Agak Mahal`), `OVERPRICED` (`Terlalu Mahal`), `MUCH_CHEAPER`.

### 2.5. `POST /api/v1/reports`
Menyimpan laporan harga warga baru ke tabel `citizen_reports` di Supabase lengkap dengan deteksi awal deviasi anomali.

### 2.6. `POST /api/v1/assistant/chat` (AI Rekomendasi Harga Multi-Sumber & Tanya Jawab)
Mengirimkan pertanyaan pengguna ke layanan **Google Gemini API** (kunci & model dibaca dinamis dari tabel `system_settings` Supabase) dengan konteks live multi-sumber (`PIHPS BI`, `Bapanas`, `Perumda PPJ`, `Laporan Warga`) dan daftar komoditas di wilayah aktif.
* **Request Body**: `{ "message": string, "regionId": string, "commoditySlug"?: string, "conversationHistory"?: Array<{ role, content }> }`
* **Response `data`**:
```json
{
  "reply": "Berdasarkan komparasi Bapanas, PIHPS, dan Laporan Warga...",
  "intent": "PRICE_RECOMMENDATION",
  "provider": "gemini",
  "model": "gemini-3.8-flash",
  "sourceComparisons": [
    { "sourceName": "HAP/HET Bapanas", "price": 57000, "unit": "kg", "note": "Batas Acuan Nasional" },
    { "sourceName": "PIHPS & Pasar Rakyat", "price": 62000, "unit": "kg", "note": "Rerata Survei Harian" },
    { "sourceName": "Laporan Warga", "price": 60500, "unit": "kg", "note": "Median 7 Hari Terakhir" }
  ],
  "referencedCommodities": [],
  "suggestedActions": []
}
```

---

## 3. Daftar Endpoint Admin (Supabase CRUD & Dynamic AI Config)

### 3.1. `GET /api/v1/admin/bootstrap`
Memuat status lengkap admin dari Supabase: `commodities`, `markets`, `dailyPrices` (map `${marketId}_${commodityId}`), dan `reports`.

### 3.2. `POST /api/v1/admin/sync`
Endpoint mutasi terpadu (menerima header sesi admin) untuk menyinkronkan aksi CRUD ke Supabase PostgreSQL:
* `ADD_COMMODITY`, `UPDATE_COMMODITY`, `DELETE_COMMODITY`
* `ADD_MARKET`, `UPDATE_MARKET`, `DELETE_MARKET`
* `UPDATE_DAILY_PRICES` (batch upsert `daily_prices`)
* `ADD_REPORT`, `APPROVE_REPORT`, `REJECT_REPORT`, `REQUEST_REPORT_INFO`
* `RESET_DEFAULT`

### 3.3. `GET /api/v1/admin/settings` & `PUT /api/v1/admin/settings`
Mengelola kredensial AI & sumber pembanding di tabel `system_settings` Supabase secara dinamis:
* **`GET`**: Mengembalikan status kunci API tersamar (`maskedApiKey`: `AQ.Ab...CeQ`), `hasApiKey`, `geminiModel`, `systemInstruction`, `enabledSources`, `dbConnected`, dan `updatedAt`. Kunci mentah tidak pernah dikirim ke browser.
* **`PUT`**: Menyimpan pembaruan `geminiApiKey` (opsional, diisi hanya saat ingin ganti kunci), `geminiModel`, `systemInstruction`, atau `enabledSources` ke Supabase.
* **`POST /api/v1/admin/settings` (`{ action: "test", geminiApiKey?: string, geminiModel?: string }`)**: Menguji koneksi langsung ke endpoint Google Gemini dan mengembalikan status & latensi respons.
