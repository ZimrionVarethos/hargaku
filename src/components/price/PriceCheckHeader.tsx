'use client';

export function PriceCheckHeader() {
  return (
    <div className="flex flex-col gap-1.5 pb-1">
      <h1 className="text-[28px] sm:text-[38px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
        Kemahalan Gak Ya? Cek Harga Disini
      </h1>
      <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[680px] leading-[1.55]">
        Pilih barang, takaran belanja, lalu tulis harga dari penjual. Langsung ketahuan harga pas atau perlu ditawar.
      </p>
    </div>
  );
}
