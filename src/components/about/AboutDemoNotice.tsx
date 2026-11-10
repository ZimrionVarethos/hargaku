import { ShieldCheck } from '@phosphor-icons/react/dist/ssr';

export function AboutDemoNotice() {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-muted)] border-2 border-[var(--border-ink)] flex flex-col sm:flex-row items-start gap-4 shadow-[var(--shadow-hard-sm)]">
      <div className="w-10 h-10 rounded-full bg-[var(--accent-chili)] text-white flex items-center justify-center shrink-0 shadow-xs">
        <ShieldCheck size={22} weight="bold" />
      </div>
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[15px] font-bold text-[var(--text-primary)]">
            Pernyataan Keterbukaan Data Prototipe (WIA 2026)
          </h2>
          <span className="text-[10px] font-bold text-[var(--accent-chili)] uppercase tracking-wider bg-[var(--bg-card)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
            Fase Penjurian
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          Selama masa evaluasi dan demonstrasi penjurian lomba, angka fluktuasi harga yang ditampilkan mengacu pada struktur harga survei resmi Badan Pangan Nasional (Bapanas) dan PIHPS Bank Indonesia, dikombinasikan dengan dataset simulasi crowdsourcing terkontrol untuk pasar-pasar tradisional di 6 koridor pulau percontohan nasional (<strong>Jawa, Sumatera, Kalimantan, Sulawesi, Bali-Nusra, dan Maluku-Papua</strong>).
        </p>
      </div>
    </div>
  );
}
