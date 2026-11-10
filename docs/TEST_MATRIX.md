# TEST_MATRIX.md — Quality Assurance & Definition of Done

Dokumen ini adalah matriks verifikasi pengujian (**Test Matrix & QA Checklist**) untuk memastikan seluruh fitur platform **HargaKu** berfungsi dengan akurat, bebas regresi, dan siap dinilai dalam kompetisi Web In Action 2026.

---

## 1. Matriks Pengujian Logika Inti: Cek Harga Wajar

Fungsi kalkulator kewajaran harga (`/api/v1/price-check`) wajib lulus skenario uji batas (*boundary condition*) berikut:

| ID Test | Kasus Uji | Input (Acuan = Rp 60.000) | Expected Deviasi | Expected Status | Expected Badge Color |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CW-01** | Harga sama persis dengan acuan | Rp 60.000 | 0.00% | `FAIR` (Wajar) | Emerald Green |
| **TC-CW-02** | Batas atas toleransi wajar (+10%) | Rp 66.000 | +10.00% | `FAIR` (Wajar) | Emerald Green |
| **TC-CW-03** | Batas bawah toleransi wajar (-10%) | Rp 54.000 | -10.00% | `FAIR` (Wajar) | Emerald Green |
| **TC-CW-04** | Sedikit di atas batas wajar | Rp 66.500 | +10.83% | `SLIGHTLY_EXPENSIVE` | Amber / Yellow |
| **TC-CW-05** | Batas atas agak mahal (+25%) | Rp 75.000 | +25.00% | `SLIGHTLY_EXPENSIVE` | Amber / Yellow |
| **TC-CW-06** | Di atas ambang wajar ekstrem | Rp 76.000 | +26.67% | `OVERPRICED` | Rose / Red |
| **TC-CW-07** | Jauh lebih murah dari acuan (<-15%) | Rp 50.000 | -16.67% | `MUCH_CHEAPER` | Blue (Cek mutu) |
| **TC-CW-08** | Input harga nol atau negatif | Rp 0 / -5000 | - | HTTP 400 Bad Request | Error validation |

---

## 2. Matriks Pengujian Fitur Lapor Harga Warga

| ID Test | Kasus Uji | Skenario Aksi | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **TC-LR-01** | Kirim laporan valid lengkap dengan foto | Upload foto JPG < 5MB, input harga valid | Laporan tersimpan dengan status `PENDING`, EXIF distrip. |
| **TC-LR-02** | Kirim laporan tanpa foto | Hanya input pasar, komoditas, & harga | Tetap berhasil terkirim (*optional photo*). |
| **TC-LR-03** | Upload file bukan gambar (misal `.pdf` atau `.exe`) | Pilih file ekstensi dilarang | Form menolak sebelum upload, HTTP 422 jika bypass. |
| **TC-LR-04** | Spam laporan beruntun dari IP yang sama | Mengirim > 10 laporan dalam 1 menit | Terkena rate limit: HTTP 429 Too Many Requests. |
| **TC-LR-05** | Harga tidak masuk akal (Outlier ekstrem) | Melaporkan beras Rp 1 / kg atau Rp 10.000.000 | Validasi form memblokir: *"Harga di luar rentang wajar"*. |
| **TC-LR-06** | Pedagang lapor kelangkaan komoditas | Memilih mode Pedagang, pasar & komoditas, status `LANGKA` / `TERBATAS` | Tersimpan dengan `reportType = 'SHORTAGE'`, `reporterRole = 'PEDAGANG'`, siap dimoderasi & tampil anonim di info pasar setelah `APPROVED`. |
| **TC-MI-01** | Agregasi laporan pasar dekat Stasiun Bogor | Memilih/klik Pasar Kebon Kembang (Pasar Anyar) / Devries / Merdeka | Info pasar menampilkan komoditas yang sedang mahal menurut laporan warga terverifikasi & peringatan kelangkaan pedagang di pasar tersebut. |

---

## 3. Matriks Pengujian Responsif & Aksesibilitas (UI/UX)

| ID Test | Aspek yang Diuji | Layar Uji | Kriteria Sukses |
| :--- | :--- | :--- | :--- |
| **TC-UI-01** | Mobile Viewport Ringan | 360 x 800 (HP Android Budget) | Tidak ada horizontal scrollbar liar; tombol CTA mudah disentuh dengan satu jempol. |
| **TC-UI-02** | Tabular Numbers & CLS | Desktop & Mobile | Angka nominal Rupiah tidak bergeser saat live updating. |
| **TC-UI-03** | Skeleton Loading | Jaringan Slow 3G | Skeleton placeholder merefleksikan grid kartu komoditas dengan rapi sebelum data muncul. |
| **TC-UI-04** | Kontras Warna Badge | Daylight Mode | Badge teks status wajar memiliki kontras rasio minimal 4.5:1 terhadap background. |

---

## 4. Checklist Definition of Done (DoD) Sebelum Menyatakan Selesai

Setiap siklus pengerjaan atau task besar wajib lulus 5 gerbang checklist ini:
- [ ] **Kesesuaian Spesifikasi**: Fungsionalitas berjalan persis sesuai kontrak di [`docs/PRD.md`](PRD.md) dan [`docs/API_SPEC.md`](API_SPEC.md).
- [ ] **Sinkronisasi Dokumen**: Jika ada perubahan token warna, font, atau schema, file `.md` terkait di `docs/` telah diperbarui otomatis.
- [ ] **Typecheck**: Perintah `npm run typecheck` (atau `tsc --noEmit`) lulus 100% tanpa kompromi tipe `any`.
- [ ] **Build Check**: Perintah `npm run build` berhasil menghasilkan bundle produksi tanpa runtime/compiler warning kritis.
- [ ] **Update Memory**: File [`STATE.md`](../STATE.md) telah diperbarui dengan status terkini dan langkah selanjutnya.
