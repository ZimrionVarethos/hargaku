'use client';

import { Clock } from '@phosphor-icons/react';
import { useRegion } from '@/lib/store/region-store';

interface Props {
  lastUpdatedText?: string;
}

export function DashboardHeader({
  lastUpdatedText = '22 Okt 2026, 06:00 WIB',
}: Props) {
  const { selectedRegion } = useRegion();

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] sm:text-[40px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
          Harga Pangan {selectedRegion.name}
        </h1>

        <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[620px] leading-[1.5]">
          Cek tren harga pangan sebelum melangkah belanja. Dikalibrasi dari standar acuan nasional Bapanas dan survei harian pasar lokal {selectedRegion.name}.
        </p>
      </div>

      {/* Live Update Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-ink)] text-[12px] font-bold text-[var(--text-primary)] shadow-xs w-fit shrink-0">
        <Clock size={14} weight="bold" className="text-[var(--text-muted)]" />
        <span>Pembaruan: {lastUpdatedText}</span>
      </div>
    </div>
  );
}
