'use client';

export function PriceCheckHeader() {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <h1 className="text-[30px] sm:text-[40px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
        Cek Kewajaran Harga Lapak
      </h1>

      <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[740px] leading-[1.55]">
        Masukkan jumlah, satuan, dan harga yang ditawarkan di lapak untuk membandingkan langsung dengan acuan nasional Bapanas, acuan daerah, dan laporan warga serta info kelangkaan pedagang di pasar tujuan.
      </p>
    </div>
  );
}
