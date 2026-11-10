'use client';

import { Info } from '@phosphor-icons/react';

export function StatusLegendCard() {
  return (
    <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[13px] font-bold text-[var(--text-primary)]">
          Indikator Status Harga Terhadap Acuan Resmi:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
            Wajar (Sesuai HAP &plusmn;5%)
          </span>

          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            Agak Mahal (+5% s.d. +15%)
          </span>

          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded bg-[#FBE9E6] text-[var(--accent-chili)] border border-[var(--accent-chili)]">
            Terlalu Mahal (&gt; +15%)
          </span>

          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded bg-[#E2EFE6] text-[#245034] border border-[#245034]">
            Hemat (&gt; -10% Rerata)
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-start gap-2.5">
        <Info size={16} weight="bold" className="text-[var(--text-muted)] shrink-0 mt-0.5" />
        <p className="text-[12px] text-[var(--text-secondary)] leading-[18px]">
          Status dihitung berjenjang: <span className="font-bold text-[var(--text-primary)]">Laporan Warga Lapak &rarr; PIHPS Wilayah Terkalibrasi &rarr; Panel Harga Bapanas</span>.
          Indikator ini merupakan alat bantu keputusan belanja warga, bukan instrumen penentu harga lapak pedagang.
          Klik kartu komoditas untuk rincian tren historis dan perbandingan antar pasar.
        </p>
      </div>
    </div>
  );
}
