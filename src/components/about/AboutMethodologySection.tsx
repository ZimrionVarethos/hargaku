import {
  Scales,
  ChartBar,
} from '@phosphor-icons/react/dist/ssr';

export function AboutMethodologySection() {
  return (
    <section id="metodologi" className="space-y-6 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b-2 border-[var(--border-ink)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scales size={18} weight="bold" className="text-[var(--accent-chili)]" />
            <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
              Algoritma &amp; Statistik
            </span>
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[var(--text-primary)] tracking-tight">
            Metodologi 3 Lapis Harga &amp; Filter Anomali MAD
          </h2>
        </div>
        <div className="text-[12px] text-[var(--text-secondary)]">
          Standar evaluasi harga objektif dan tahan manipulasi
        </div>
      </div>

      <div className="market-card p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-[18px] font-bold text-[var(--text-primary)]">
            1. Hirarki Penentuan Harga Pembanding (Fallback Waterfall)
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">
            HargaKu menggunakan sistem bertingkat adaptif. Jika data tingkat lokal belum mencukupi batas minimum, sistem otomatis berpindah ke acuan lapis berikutnya tanpa halusinasi data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] bg-[var(--bg-card)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                Lapis 1 &middot; Prioritas Utama
              </span>
              <span className="text-[11px] font-bold text-[#245034]">
                Akurasi 95%
              </span>
            </div>
            <h4 className="text-[14px] font-bold text-[var(--text-primary)]">
              Median Laporan Warga Lapak
            </h4>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              Dihitung dari nilai tengah (median) minimal 3 laporan terverifikasi struk/nota di pasar spesifik dalam 7 hari terakhir.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                Lapis 2 &middot; Fallback 1
              </span>
              <span className="text-[11px] font-bold text-[var(--text-primary)]">
                Akurasi 80%
              </span>
            </div>
            <h4 className="text-[14px] font-bold text-[var(--text-primary)]">
              Rerata Wilayah PIHPS BI
            </h4>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              Digunakan jika laporan warga lapak belum mencapai kuorum 3 laporan, mengacu pada survei resmi harian pedagang pasar tradisional daerah.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                Lapis 3 &middot; Fallback 2
              </span>
              <span className="text-[11px] font-bold text-[var(--text-muted)]">
                Acuan Plafon
              </span>
            </div>
            <h4 className="text-[14px] font-bold text-[var(--text-primary)]">
              HAP Resmi Bapanas
            </h4>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              Batas plafon regulasi nasional pemerintah sebagai jangkar batas atas toleransi ketika komoditas mengalami anomali pasokan.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center gap-2">
            <ChartBar size={18} weight="bold" className="text-[var(--accent-chili)]" />
            <h4 className="text-[14px] font-bold text-[var(--text-primary)]">
              2. Mengapa Memakai Median Absolute Deviation (MAD), Bukan Rata-Rata (Mean)?
            </h4>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            Rata-rata aritmatika biasa (<code className="text-[var(--text-primary)] font-mono bg-[var(--bg-card)] px-1.5 py-0.5 rounded text-[12px]">Mean</code>) sangat rapuh terhadap angka ekstrem (contoh: jika ada pengguna jahil menginput harga cabai Rp 1.000.000, rata-rata pasar akan rusak seketika). 
            HargaKu menerapkan <strong className="text-[var(--text-primary)]">Median &amp; Deteksi MAD</strong>:
          </p>
          <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] font-mono text-[12px] text-[var(--text-primary)] overflow-x-auto">
            MAD = median(|x_i - median(X)|) &rarr; Batas Toleransi Anomali: deviasi &gt; 3 x MAD atau deviasi &gt; 300% HAP otomatis ditandai
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-[14px] font-bold text-[var(--text-primary)]">
            3. Klasifikasi Status Kewajaran Harga
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E2EFE6] text-[#245034]">
                Wajar (Fair)
              </span>
              <div className="text-[12px] font-bold text-[var(--text-primary)]">
                Rentang -10% s.d. +10%
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Harga berada dalam dinamika pasokan normal pasar harian.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#92400E]">
                Agak Mahal
              </span>
              <div className="text-[12px] font-bold text-[var(--text-primary)]">
                Rentang +10% s.d. +25%
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Harga di atas rata-rata. Warga disarankan menawar sewajarnya.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FBE9E6] text-[var(--accent-chili)]">
                Terlalu Mahal
              </span>
              <div className="text-[12px] font-bold text-[var(--text-primary)]">
                Deviasi &gt; +25%
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Potensi lonjakan drastis. Disarankan cek kios lain atau pasar sebelah.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E2EFE6] text-[#245034]">
                Hemat / Miring
              </span>
              <div className="text-[12px] font-bold text-[var(--text-primary)]">
                Deviasi &lt; -15%
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Harga sangat hemat. Disarankan periksa kesegaran &amp; akurasi timbangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
