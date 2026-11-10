'use client';

export function PriceCheckHeader() {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-muted)] text-[var(--accent-chili)]">
        ALAT BANTU KEPUTUSAN PEMBELI &bull; MELENGKAPI PIHPS &amp; BAPANAS
      </div>
      <h1 className="text-[30px] sm:text-[40px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
        Cek Kewajaran Harga Lapak
      </h1>

      <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[740px] leading-[1.55]">
        Masukkan jumlah, satuan, dan harga yang ditawarkan di lapak untuk membandingkan langsung dengan acuan nasional Bapanas, acuan daerah, dan laporan warga serta info kelangkaan pedagang di pasar tujuan.
      </p>
    </div>
  );
}
