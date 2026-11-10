'use client';

import { useRegion } from '@/lib/store/region-store';

export function LaporHeader() {
  const { selectedRegion } = useRegion();

  return (
    <div className="flex flex-col gap-2 pb-2">
      <h1 className="text-[32px] sm:text-[40px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
        Kirim Laporan Harga Lapak Pasar
      </h1>

      <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[680px] leading-[1.5]">
        Bantu sesama warga {selectedRegion.name} mendapatkan transparansi harga riil di lapak tradisional.
        Bukti nota atau foto timbanganmu diverifikasi otomatis dan aman tanpa mengekspos identitas.
      </p>
    </div>
  );
}
