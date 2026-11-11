# PITFALLS.md — Known Framework Quirks, Anti-Patterns & Verified Fixes

Dokumen ini adalah buku catatan "Jebakan Batman" (**Pitfall Vault**) proyek **HargaKu**. Semua bug aneh, keanehan framework (*framework quirks*), dan solusi terverifikasi wajib dicatat di sini agar AI dan tim tidak mengulangi kesalahan yang sama dua kali.

---

## 1. Context7 & Versioning Quirks

### 1.1. Menginstal Dependensi Tanpa Mengecek Context7 MCP
- **Gejala**: Import error, sintaks konfigurasi tidak terbaca (misal konfigurasi `tailwind.config.js` vs `@theme` di Tailwind v4, atau breaking change `cookies()` di Next.js 15/16).
- **Penyebab**: Menggunakan pola kode lama dari ingatan training data AI tanpa mencocokkan rilis library versi terbaru.
- **Solusi Terverifikasi**:
  * AI **WAJIB** memanggil tool Context7 MCP (`resolve-library-id` dan `query-docs`) sebelum menulis file konfigurasi atau memasang package baru.

---

## 2. Logika Crowdsourcing & Statistik Pangan

### 2.1. Manipulasi Harga Ekstrem / Outlier pada Laporan Warga
- **Gejala**: Harga rata-rata komoditas tiba-tiba melonjak gila-gilaan karena ada 1 pengguna iseng memasukkan harga cabai Rp 1.000.000 / kg.
- **Penyebab**: Menggunakan fungsi rata-rata aritmatika biasa (`MEAN`), yang sangat rapuh terhadap angka ekstrem.
- **Solusi Terverifikasi**:
  1. Selalu gunakan **MEDIAN** (nilai tengah) dari laporan warga terverifikasi dalam rentang 7 hari terakhir.
  2. Terapkan filter **Median Absolute Deviation (MAD)** atau buang otomatis laporan yang deviasinya > 300% dari harga acuan HAP/HET saat input form.

### 2.2. Kebocoran Lokasi Presisi & Privasi Foto Laporan Warga
- **Gejala**: Foto laporan nota belanja warga yang diunggah menyimpan koordinat GPS rumah pelapor di dalam metadata EXIF file JPEG.
- **Penyebab**: Mengunggah raw image file langsung ke direktori publik tanpa sanitasi metadata.
- **Solusi Terverifikasi**:
  * Gunakan library pemroses gambar (misal `sharp`) di server-side sebelum file disimpan:
  ```typescript
  // Otomatis buang seluruh metadata EXIF dan re-encode ke WebP/JPEG bersih
  await sharp(fileBuffer).rotate().strip().toFile(destinationPath);
  ```

---

## 3. Database, Prisma & Timezone Quirks

### 3.1. Kesalahan Pergeseran Tanggal Harian (*Timezone Offset UTC vs WIB*)
- **Gejala**: Harga yang dicatat untuk tanggal hari ini muncul di tanggal kemarin atau dua data muncul di hari yang sama saat query grafik.
- **Penyebab**: JavaScript `new Date()` menggunakan UTC secara default, sedangkan pergantian hari pasar di Indonesia mengacu pada WIB (`UTC+7`).
- **Solusi Terverifikasi**:
  * Gunakan tipe data `DATE` murni (tanpa time component) untuk `recorded_date`, atau normalize string tanggal menjadi format `YYYY-MM-DD` berzona waktu `Asia/Jakarta` sebelum query ke database.

### 3.2. Prisma Client Connection Exhaustion pada Next.js Hot Reload
- **Gejala**: Error `PrismaClientInitializationError: Can't reach database server` setelah beberapa kali edit file di mode dev.
- **Penyebab**: Setiap file Next.js di-reload oleh bundler, instance `new PrismaClient()` baru dibuat tanpa mendaur ulang instance lama.
- **Solusi Terverifikasi**:
  * Buat singleton global Prisma di `src/lib/prisma.ts`:
  ```typescript
  import { PrismaClient } from '@prisma/client';

  const globalForPrisma = global as unknown as { prisma: PrismaClient };

  export const prisma = globalForPrisma.prisma || new PrismaClient();

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  ```

---

## 5. UI Layout, Overflow Clipping & State Persistence

### 5.1. Overflow Clipping, Tooltip Grafik Terpotong, & Stroke Tabel Responsif
- **Gejala**:
  1. Angka lingkaran nomor peringkat atau tombol aksi di tabel terpotong sebagian di sisi kiri atau kanan saat dibungkus kontainer `overflow-x-auto`.
  2. Tooltip harga `-top-12` pada bilah tertinggi grafik komparasi terpotong di batas atas dan sisi kiri/kanan karena dibungkus wadah `overflow-x-auto`.
- **Penyebab**:
  1. Penggunaan `outline outline-1` bersudut lengkung yang digambar di luar bounding box, serta ketiadaan padding tepi (`pr` / `pl`).
  2. Dalam spesifikasi CSS, menyetel `overflow-x: auto` otomatis memaksa `overflow-y` menjadi `auto`/`hidden` (tidak bisa tetap `visible`), sehingga elemen anak dengan koordinat negatif di luar box atas atau kiri terpotong habis.
- **Solusi Terverifikasi**:
  * Gunakan `border border-[#...]` alih-alih `outline`, dan berikan padding horizontal yang cukup (`pl-3.5 sm:pl-4` dan `pr-6`).
  * Untuk grafik bilah interaktif: tampilkan ringkasan komoditas & harga aktif di **luar** wadah `overflow-x-auto`, sisakan ruang *headroom* eksplisit (`pt-16`) di atas area tinggi bilah, pasang tooltip tepat di atas bilah aktif (`bottom-full mb-2`) dengan perataan tepi (`left-0` untuk indeks awal, `right-0` untuk indeks akhir), dan gunakan trek `min-w-full w-max` agar garis `Rerata` ikut merentang penuh saat digulir.

### 5.2. Persistensi Konsultasi AI & Kompatibilitas SSR Next.js + Supabase Pooler
- **Gejala A (State AI Terputus)**: Riwayat tanya jawab AI hilang saat pengguna berpindah antara `/cek-harga#punten-panel` (termasuk pengalihan dari `/rekomendasi-ai`) atau membuka laci `AssistantDrawer`.
  * *Solusi*: Pusatkan state di `AssistantProvider` (`src/lib/store/assistant-store.tsx`) pada `PublicLayoutWrapper` agar sinkron lintas halaman.
- **Gejala B (`auto-scroll` Chat Menarik Halaman ke Bawah saat Buka `/cek-harga`)**: Memanggil `scrollIntoView` di luar kontainer chat memicu browser menggulir jendela utama melewati kalkulator Cek Harga ke `#punten-panel` saat mount.
  * *Solusi*: Gunakan ref wadah chat (`chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight`) yang hanya aktif sesudah mount (`mountedRef`).
- **Gejala B (`Failed to parse URL` saat `next build`)**: Ketika `NEXT_PUBLIC_USE_MOCK="false"`, Server Components di Node SSR mengeksekusi `fetch('/api/v1/...')` relatif saat build time.
  * *Solusi*: Di `src/lib/api/*.api.ts`, gunakan fallback baseline saat `IS_MOCK || typeof window === 'undefined'` serta `try/catch` defensif saat offline.
- **Gejala C (`MaxClientsInSessionMode` Supabase di Production)**: Membuat instance `new Pool()` baru di setiap request produksi menghabiskan batas koneksi Session Pooler Supabase.
  * *Solusi*: Simpan singleton pool di `globalForPg.hargakuPgPool` secara persisten baik di dev maupun production dengan `max: 3` di `src/lib/server/db.ts`.


### 4.1. Layout Shift (CLS) saat Angka Harga Beranimasi
- **Gejala**: Card komoditas bergetar atau teks bergoyang saat harga berubah atau saat rendering client-side.
- **Penyebab**: Font proporsional default memiliki lebar digit angka berbeda-beda (angka `1` lebih sempit dari angka `8`).
- **Solusi Terverifikasi**:
  * Selalu pasang utility class `tabular-nums` dari Tailwind pada elemen yang menampilkan nominal mata uang Rupiah.

### 4.2. Error Module Not Found pada Arbitrary Tailwind Background Image di Turbopack/Webpack
- **Gejala**: `Error: Module not found: Can't resolve '...'` di dalam `globals.css` saat `next dev` atau `next build`.
- **Penyebab**: Class Tailwind arbitrer untuk background image diekstrak ke dalam CSS oleh Tailwind v4 compiler (yang secara agresif men-scan file markdown dokumentasi), sehingga memicu CSS loader Webpack/Turbopack mencoba mencari path tersebut sebagai modul lokal JavaScript relatif terhadap file `globals.css`.
- **Solusi Terverifikasi**:
  * Hindari class arbitrer Tailwind background image untuk aset di folder `public/`.
  * Gunakan inline style langsung:
  ```tsx
  style={{ backgroundImage: "url('/images/hero-backdrop.jpg')" }}
  ```
  * Batasi jangkauan scan Tailwind v4 di `src/app/globals.css` dengan `source(none)` dan `@source "../"` agar hanya men-scan folder `src/`.
  * Bersihkan cache `.next` (`rm -rf .next`).

