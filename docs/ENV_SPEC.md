# ENV_SPEC.md: Environment Variables Specification

Dokumen ini adalah spesifikasi resmi seluruh variabel lingkungan (**Environment Variables**) yang digunakan oleh aplikasi **HargaKu** di sisi frontend maupun backend.

> [!CAUTION]
> Dilarang keras melakukan commit file `.env` atau `.env.local` yang berisi nilai rahasia asli ke dalam repository git. Gunakan `.env.example` sebagai template referensi.

---

## 1. Daftar Variabel Lingkungan

| Nama Variabel | Wajib/Opsional | Scope | Deskripsi & Contoh Nilai |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Wajib** | Backend / Server | Connection string PostgreSQL / Supabase Session Pooler (`postgresql://postgres.[REF]:[PASS]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require`) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Wajib** | Universal | URL project Supabase (`https://[PROJECT-REF].supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Wajib** | Universal | Publishable / anon key Supabase untuk koneksi SDK publik |
| `NODE_ENV` | **Wajib** | Universal | `development`, `test`, atau `production` |
| `NEXT_PUBLIC_APP_URL` | **Wajib** | Universal / Client | URL root website HargaKu (contoh: `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | Opsional | Client | Base URL endpoint API backend (default: `/api/v1`) |
| `NEXT_PUBLIC_USE_MOCK` | Opsional | Client | Toggle mode mock (`false` saat Supabase aktif, `true` saat offline demo) |
| `ADMIN_SESSION_SECRET` | **Wajib** | Backend / Server | Kunci rahasia minimal 32 karakter untuk token sesi admin |
| `GEMINI_API_KEY` | Opsional | Backend / Server | Cadangan opsional jika kunci Gemini belum tersimpan di tabel `system_settings` Supabase |

---

## 2. Pengelolaan Dinamis Kunci API di Database Supabase

1. Kredensial API Gemini (`gemini_api_key`) dan konfigurasi model (`gemini_model`, misal `gemini-3.8-flash`) **wajib disimpan di tabel `system_settings` database Supabase**, tidak boleh di-hardcode di kode sumber frontend/backend.
2. Administrator dapat memperbarui kunci API Gemini dan menguji koneksi secara langsung melalui menu **Integrasi AI & DB** di Konsol Admin (`/admin`).
3. Nilai `value` bertanda `is_secret = true` selalu disamarkan (*masked*) pada respons API ke antarmuka admin dan hanya dibaca secara utuh di sisi server saat memanggil endpoint Google Gemini API.

---

## 3. Aturan Keamanan Variabel
1. Hanya variabel dengan prefix `NEXT_PUBLIC_` yang boleh terekspos ke bundle browser client.
2. Variabel sensitif seperti `DATABASE_URL`, `ADMIN_SESSION_SECRET`, dan `GEMINI_API_KEY` **dilarang keras** menggunakan prefix `NEXT_PUBLIC_`.
