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

### 2.3. `GET /api/v1/markets` & `GET /api/v1/markets/insights`
Mengambil daftar pasar tradisional aktif pada wilayah terpilih dari Supabase `markets`, beserta ringkasan intelijen per pasar (`/api/v1/markets/insights`): komoditas yang dilaporkan mahal oleh warga (`APPROVED`), laporan kelangkaan komoditas dari pedagang (`APPROVED`), serta komparasi harga pasar vs acuan nasional.

### 2.4. `POST /api/v1/price-check`
Mengevaluasi penawaran harga pedagang (menerima `commodityId`, `marketId`, `regionSlug`, dan `offeredPrice` maupun kombinasi `quantity`, `unitId`, `offeredTotalPrice`) terhadap Lapis 1 (`lapis1NationalHap` & `lapis1RegionalHap`), Lapis 2 (Survei harian pasar terpilih / PIHPS BI & PPJ), dan Lapis 3 (Laporan warga terverifikasi di pasar terpilih terlebih dahulu sebelum fallback kota). Mengembalikan pula `marketContext` (informasi pasar setempat, barang yang lagi mahal menurut laporan warga di pasar tersebut, serta peringatan kelangkaan pedagang) dan `positioningNote` bahwa HargaKu melengkapi PIHPS.
* Status evaluasi: `FAIR`, `SLIGHTLY_EXPENSIVE` (`Agak Mahal`), `OVERPRICED` (`Terlalu Mahal`), `MUCH_CHEAPER`.

### 2.5. `GET /api/v1/reports` & `POST /api/v1/reports`
* **`GET`**: Mengambil laporan terverifikasi (`APPROVED`) teranonimkan (opsi filter `marketId`, `commodity`, `reportType`) untuk widget modal pasar, `/peta`, dan `/komoditas/[slug]`.
* **`POST`**: Menyimpan laporan baru ke `citizen_reports` di Supabase untuk dua jalur pelaporan:
  * **`PRICE` (`reporterRole: 'WARGA'`)**: Pelaporan harga riil atau harga tidak wajar beserta jumlah, satuan, normalisasi `/kg`, dan deteksi anomali MAD (`> 25%`).
  * **`SHORTAGE` (`reporterRole: 'PEDAGANG'`)**: Pelaporan kelangkaan / keterbatasan pasokan komoditas di suatu pasar (`stockStatus: 'TERBATAS' | 'LANGKA' | 'PULIH'`) secara anonim tanpa mengekspos nama kios.

### 2.6. `POST /api/v1/assistant/chat` (PUNTEN: Asisten AI Harga Multi-Sumber)
Mengirimkan pertanyaan pengguna ke persona asisten **PUNTEN** berbasis **Google Gemini API** (kunci & model dibaca dinamis dari tabel `system_settings` Supabase) dengan respons berformat **Markdown**, konteks live multi-sumber (`PIHPS BI`, `Bapanas`, `Perumda PPJ`, `Laporan Warga`), dan daftar komoditas di wilayah aktif.
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

### 2.7. `GET /api/v1/map/config`
Mengambil konfigurasi token publik **Mapbox GL JS** (`mapbox_access_token`) dari tabel `system_settings` Supabase secara dinamis untuk merender Peta 3D 13 Unit Pasar Bogor tanpa hardcode token di frontend.
* **Response `data`**: `{ "mapboxToken": string, "source": "supabase-db" | "env-fallback" | "unconfigured" }`

---

## 3. Daftar Endpoint Admin (Supabase CRUD & Dynamic API Config)

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
Mengelola kredensial AI, token Mapbox, dan sumber pembanding di tabel `system_settings` Supabase secara dinamis:
* **`GET`**: Mengembalikan status kunci Gemini tersamar (`maskedApiKey`: `AIzaSy......abcd`), `hasApiKey`, `geminiModel`, `systemInstruction`, `enabledSources`, status token Mapbox (`hasMapboxToken`, `maskedMapboxToken`), `dbConnected`, dan `updatedAt`. Kunci sensitif server-only tidak pernah dikirim mentah ke browser.
* **`PUT`**: Menyimpan pembaruan `geminiApiKey`, `geminiModel`, `systemInstruction`, `enabledSources`, atau `mapboxAccessToken` ke Supabase.
* **`POST /api/v1/admin/settings` (`{ action: "test", geminiApiKey?: string, geminiModel?: string }`)**: Menguji koneksi langsung ke endpoint Google Gemini dan mengembalikan status & latensi respons.
