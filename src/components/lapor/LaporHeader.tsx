'use client';

import { useRegion } from '@/lib/store/region-store';

export function LaporHeader() {
  const { selectedRegion } = useRegion();

  return (
    <div className="flex flex-col gap-2 pb-2">
      <h1 className="text-[30px] sm:text-[40px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
        Lapor Harga &amp; Kelangkaan Pasar
      </h1>

      <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[740px] leading-[1.55]">
        Pembeli di {selectedRegion.name} dapat melaporkan harga tidak wajar di lapak, dan pedagang dapat melaporkan kendala atau kelangkaan pasokan agar agregat tiap pasar selalu akurat tanpa menyingkap identitas kios.
      </p>
    </div>
  );
}
