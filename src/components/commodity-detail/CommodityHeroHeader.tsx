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

  let statusBadgeStyle = 'bg-[#F4F3F0] text-[#1B1A18] outline-[#E5E3DE]';
  let statusLabel = 'Wajar';

  if (changePercentage > 10) {
    statusBadgeStyle = 'bg-[#FEE2E2] text-[#991B1B] outline-[#FECACA]';
    statusLabel = `Terlalu Mahal (+${changePercentage}%)`;
  } else if (changePercentage > 3) {
    statusBadgeStyle = 'bg-[#FEF3C7] text-[#92400E] outline-[#FDE68A]';
    statusLabel = `Agak Mahal (+${changePercentage}%)`;
  } else if (changePercentage < -2) {
    statusBadgeStyle = 'bg-[#EEF773] text-[#1B1A18] outline-[#1B1A18]';
    statusLabel = `Murah (${changePercentage}%)`;
  }

  const pricePerOns = Math.round(detail.currentPriceStats.cityAverage / 10);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-[#E5E3DE]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[32px] sm:text-[38px] font-medium text-[#1B1A18] leading-[1.12] tracking-tight">
              {detail.name}
            </h1>
            <span
              className={`text-[12px] font-bold px-3 py-1 rounded-[6px] outline outline-1 ${statusBadgeStyle}`}
            >
              {statusLabel}
            </span>
          </div>

          <p className="text-[13px] sm:text-[14px] text-[#6E6D67]">
            {selectedRegion.name} · Acuan {selectedRegion.islandName} (Bapanas) · Diperbarui: 22 Okt 2026, 06:00 WIB
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/cek-harga?commodity=${detail.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#1B1A18] text-white text-[13px] font-semibold hover:bg-black active:translate-y-[1px] shadow-xs transition-all"
          >
            <Check size={14} weight="bold" />
            <span>Cek Harga yang Kamu Terima</span>
          </Link>

          <Link
            href={`/lapor?commodity=${detail.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white text-[#1B1A18] outline outline-1 outline-[#E5E3DE] hover:bg-[#F4F3F0] text-[13px] font-medium transition-colors"
          >
            <MegaphoneSimple size={14} weight="bold" />
            <span>Lapor Harga Lapak</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
        <span className="text-[38px] sm:text-[44px] font-bold text-[#1B1A18] tracking-tight tabular-nums">
          Rp {detail.currentPriceStats.cityAverage.toLocaleString('id-ID')}
        </span>

        <span className="text-[15px] font-medium text-[#78716C]">
          / {detail.unit} (Rp {pricePerOns.toLocaleString('id-ID')}/ons)
        </span>

        <div className="flex items-center gap-1.5 text-[12px] sm:ml-2">
          <span
            className={`font-bold tabular-nums px-2 py-0.5 rounded-[4px] ${
              isRising
                ? 'bg-[#FEF3C7] text-[#92400E]'
                : isDropping
                ? 'bg-[#EEF773] text-[#1B1A18]'
                : 'bg-[#F4F3F0] text-[#1B1A18]'
            }`}
          >
            {isRising ? `▲ +${changePercentage}%` : isDropping ? `▼ ${changePercentage}%` : '~ 0.0% Stabil'}
          </span>
          <span className="text-[#78716C]">dibanding 7 hari lalu di {selectedRegion.name}</span>
        </div>
      </div>
    </div>
  );
}
