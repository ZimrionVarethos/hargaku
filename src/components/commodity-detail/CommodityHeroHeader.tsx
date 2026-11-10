'use client';

import Link from 'next/link';
import { CommodityDetail } from '@/types';
import { Check, MegaphoneSimple } from '@phosphor-icons/react';
import { useRegion } from '@/lib/store/region-store';

interface Props {
  detail: CommodityDetail;
  changePercentage?: number;
}

export function CommodityHeroHeader({ detail, changePercentage = 8.5 }: Props) {
  const { selectedRegion } = useRegion();
  const isRising = changePercentage > 0;
  const isDropping = changePercentage < 0;

  let statusBadgeStyle = 'bg-[var(--bg-muted)] text-[var(--text-primary)] border-[var(--border-subtle)]';
  let statusLabel = 'Wajar';

  if (changePercentage > 10) {
    statusBadgeStyle = 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]';
    statusLabel = `Terlalu Mahal (+${changePercentage}%)`;
  } else if (changePercentage > 3) {
    statusBadgeStyle = 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    statusLabel = `Agak Mahal (+${changePercentage}%)`;
  } else if (changePercentage < -2) {
    statusBadgeStyle = 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]';
    statusLabel = `Murah (${changePercentage}%)`;
  }

  const pricePerOns = Math.round(detail.currentPriceStats.cityAverage / 10);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[32px] sm:text-[38px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
              {detail.name}
            </h1>
            <span
              className={`text-[12px] font-bold px-3 py-1 rounded-[6px] border ${statusBadgeStyle}`}
            >
              {statusLabel}
            </span>
          </div>

          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
            {selectedRegion.name} · Acuan {selectedRegion.islandName} (Bapanas) · Diperbarui: 22 Okt 2026, 06:00 WIB
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/cek-harga?commodity=${detail.slug}`}
            className="market-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold no-underline"
          >
            <Check size={14} weight="bold" />
            <span>Cek Harga yang Kamu Terima</span>
          </Link>

          <Link
            href={`/lapor?commodity=${detail.slug}`}
            className="market-btn-secondary inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold no-underline"
          >
            <MegaphoneSimple size={14} weight="bold" />
            <span>Lapor Harga Lapak</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
        <span className="text-[38px] sm:text-[44px] font-extrabold text-[var(--text-primary)] tracking-tight tabular-nums font-mono-num">
          Rp {detail.currentPriceStats.cityAverage.toLocaleString('id-ID')}
        </span>

        <span className="text-[15px] font-medium text-[var(--text-muted)]">
          / {detail.unit} (Rp {pricePerOns.toLocaleString('id-ID')}/ons)
        </span>

        <div className="flex items-center gap-1.5 text-[12px] sm:ml-2">
          <span
            className={`font-bold tabular-nums px-2 py-0.5 rounded-[4px] ${
              isRising
                ? 'bg-[#FEF3C7] text-[#92400E]'
                : isDropping
                ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]'
                : 'bg-[var(--bg-muted)] text-[var(--text-primary)]'
            }`}
          >
            {isRising ? `▲ +${changePercentage}%` : isDropping ? `▼ ${changePercentage}%` : '~ 0.0% Stabil'}
          </span>
          <span className="text-[var(--text-secondary)]">dibanding 7 hari lalu di {selectedRegion.name}</span>
        </div>
      </div>
    </div>
  );
}
