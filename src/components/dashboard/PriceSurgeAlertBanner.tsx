'use client';

import Link from 'next/link';
import { WarningCircle, ArrowRight } from '@phosphor-icons/react';

export function PriceSurgeAlertBanner() {
  return (
    <div className="w-full rounded-[16px] bg-[var(--accent-chili-soft)] border border-[var(--accent-chili)] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-[var(--accent-chili)]/15 text-[var(--accent-chili)]">
          <WarningCircle size={20} weight="fill" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[var(--accent-chili)] text-white text-[11px] font-bold w-fit">
            Lonjakan Harga
          </span>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[13px]">
            <span className="font-bold text-[var(--text-primary)]">
              Cabai Merah Keriting melonjak +14.2% dalam 7 hari di lapak pasar (Rp 51.200/kg).
            </span>
            <span className="hidden sm:inline text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-secondary)]">
              Rekomendasi: alternatif di Pasar Sukasari lebih hemat 8.2% (Rp 47.000/kg).
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/komoditas/cabai-merah-keriting"
        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent-chili)] hover:underline transition-colors shrink-0"
      >
        <span>Bandingkan Pasar</span>
        <ArrowRight size={13} weight="bold" />
      </Link>
    </div>
  );
}
