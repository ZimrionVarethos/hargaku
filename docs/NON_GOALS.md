# NON_GOALS.md — Batasan Ruang Lingkup & Anti-Scope Creep

Dokumen ini adalah pagar pembatas (**guardrail**) proyek **HargaKu** untuk kompetisi Web In Action (MIA 2026). Semua hal yang tertulis di sini secara sadar diputuskan untuk **TIDAK DIKERJAKAN** pada fase MVP / Fase Lomba saat ini.

AI Agent dilarang keras mengimplementasikan, menyarankan dependensi, atau membuat abstraksi kode untuk item yang terdaftar di dokumen ini tanpa persetujuan eksplisit dari tim.

---

## 1. Filosofi Dokumen Ini

Membangun aplikasi perlombaan sering gagal bukan karena kekurangan ide, melainkan karena *scope creep* (melebarkan fitur di tengah jalan sehingga tidak ada fitur yang selesai dengan kualitas matang). Dokumen ini melindungi codebase tetap ramping, bebas bug, dan fokus pada fitur inti yang dinilai juri.

---

## 2. Fitur & Kapabilitas yang Dilarang (Out of Scope MVP)

| Fitur / Kapabilitas | Mengapa Ditolak / Ditunda? | Kapan Dipertimbangkan? |
| :--- | :--- | :--- |
| **Klaim "Real-Time" Palsu** | Data resmi pemerintah (PIHPS/Bapanas) diperbarui secara harian, bukan per detik. Mengklaim "real-time" adalah misinformasi publik. | Tidak akan pernah (gunakan "harga harian / diperbarui harian"). |
| **Penyebutan Nama Pedagang / Kios Perorangan** | Menghindari konflik horizontal, fitnah persaingan usaha, dan menjaga privasi pedagang pasar. | Tidak akan diterapkan (data diagregasi per pasar). |
| **E-Commerce, Keranjang Belanja, & Transaksi Jual-Beli Online** | HargaKu adalah platform cek harga dan pendukung keputusan multi-sumber (*decision support*), bukan toko atau simulasi keranjang belanja. Fitur keranjang belanja digantikan oleh **Rekomendasi AI Multi-Sumber & Tanya Jawab**. | Tidak akan diterapkan. |
| **Scraping Liar / Agresif Tanpa Izin** | Rentan terblokir IP, melanggar ToS sumber resmi, dan tidak etis. Lebih baik gunakan ekspor resmi atau data simulasi berlabel. | Jika ada API resmi terbuka dari Bapanas/Disperindag. |
| **Bot WhatsApp / Telegram Otomatis** | Memerlukan infrastruktur webhook, token berbayar Meta, dan pemeliharaan server tersendiri yang memecah fokus frontend/backend. | Roadmap Pitch (Konsep Masa Depan). |
| **Ekspansi Kota Liar Tanpa Acuan Bapanas** | Penambahan klaster rollout 4 fase (Kota Bogor, Jabodetabek, Jawa Barat, dan 21 provinsi dalam 6 koridor pulau) wajib berakar pada zonasi logistik resmi Bapanas RI. | Sesuai rilis koridor zonasi pangan nasional. |
| **AI Prediksi Harga / Machine Learning Kompleks** | Dataset historis singkat tidak cukup untuk melatih model time-series yang akurat. Fokus pada penyajian data riil & kalkulasi deviasi. | Roadmap Riset Lanjutan. |
| **Sistem Akun User Publik yang Rumit (OAuth Google/Apple)** | Laporan warga cukup menggunakan verifikasi ringan (rate limit hash IP + captcha). Warga pasar enggan repot membuat akun untuk melapor. | Fase 2 jika ada sistem gamifikasi poin. |

---

## 3. Teknologi & Library yang Dilarang Digunakan

| Kategori | Dilarang Digunakan | Gunakan Alternatif Ini | Alasan Larangan |
| :--- | :--- | :--- | :--- |
| **State Management** | Redux / MobX | Zustand / React Context bawaan | Redux terlalu berbelit (*boilerplate bloat*) untuk skala aplikasi HargaKu. |
| **Styling Library** | Styled Components / Emotion | Tailwind CSS | Runtime CSS overhead dan sering konflik dengan Next.js Server Components. |
| **UI Component Bloat** | Ant Design / MUI | Tailwind CSS + `@phosphor-icons/react` | Styling bawaan AntD/MUI sulit di-override dan membuat bundle membengkak tanpa membawa dua paket ikon ganda. |
| **Database ORM** | Query SQL tak terstruktur tanpa helper koneksi aman | Parameterized SQL (`pg` Pool) ke PostgreSQL Supabase | Kompatibel langsung dengan Supabase Supavisor Pooler & RLS tanpa overhead migration lock serverless maupun SDK duplikat. |
| **Geospatial Library** | Google Maps API berbayar | **Leaflet.js** (untuk `/peta` nasional) + **Mapbox GL JS v3 & Three.js Custom Layer** (khusus Peta 3D 13 Unit Pasar Bogor) | Leaflet tetap ringan untuk peta 64 sentra nasional, sedangkan Mapbox GL JS v3 dipakai dengan token dinamis di DB Supabase khusus visualisasi bangunan pasar 3D di landing page. |
| **Setup Library Liar** | Instalasi paket tanpa verifikasi Context7 | **Context7 MCP** (`resolve-library-id` & `query-docs`) | Menghindari API deprecated atau breaking changes antar versi paket. |

---

## 4. Premature Optimization yang Dilarang

1. **Redis Caching Prematur**:
   * Dilarang memasang cache Redis di awal. Database PostgreSQL dengan indeks pada `commodity_id`, `market_id`, dan `recorded_date` sudah lebih dari cukup untuk menangani ribuan query per detik.
2. **Microservices Architecture**:
   * Dilarang memecah backend menjadi microservices terpisah. Arsitektur **Next.js Fullstack (Modular Monolith)** adalah pendekatan paling efisien untuk proyek tim 1–3 orang.
3. **Database Sharding / Multi-Region Clusters**:
   * Cukup satu instance PostgreSQL lokal / cloud (misal Neon / Supabase).
4. **Custom AI ML Infrastructure**:
   * Tidak perlu membangun worker Python terpisah hanya untuk formula selisih persentase dan median statistik dasar. Logika statistik dapat langsung dihitung di TypeScript/Prisma service.

---

## 5. Prosedur Jika Ingin Memindahkan Fitur ke In-Scope
Jika tim sepakat ingin menambahkan fitur baru di luar kesepakatan:
1. Pastikan seluruh fitur **Fase A** telah 100% lulus uji build dan Definition of Done.
2. Diskusikan implikasinya terhadap batas waktu pengumpulan lomba (1 Nov 2026).
3. Hapus item dari dokumen ini dan perbarui [`docs/PRD.md`](PRD.md) serta [`STATE.md`](../STATE.md).
