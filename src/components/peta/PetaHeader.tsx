'use client';

import { useRegion } from '@/lib/store/region-store';

export function PetaHeader() {
  const { selectedRegion } = useRegion();

  return (
    <div className="flex flex-col gap-2 pb-2">
      <h1 className="text-[32px] sm:text-[40px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
        Peta Harga Pasar Tradisional
      </h1>

      <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[680px] leading-[1.5]">
        Bandingkan pasar mana yang paling hemat dan periksa disparitas harga riil
        komoditas pilihanmu di {selectedRegion.name} sebelum berangkat berbelanja.
      </p>
    </div>
  );
}
