'use client';

import Link from 'next/link';
import { CommoditySummary } from '@/types';
import { ArrowUpRight } from '@phosphor-icons/react';

interface Props {
  commodity: CommoditySummary;
}

export function TactileCommodityCard({ commodity }: Props) {
  const isRising = commodity.changePercentage > 0;
  const isDropping = commodity.changePercentage < 0;

  // Determine Semantic Status Pill according to Clay Foundations & Anti-AI-Slop rule
  let statusLabel = 'Wajar';
  let statusBadgeStyle = 'bg-[#F4F3F0] text-[#1B1A18] outline-[#E5E3DE]';

  if (commodity.changePercentage > 10 || commodity.statusVsHap === 'ABOVE_HAP' && commodity.changePercentage > 5) {
    if (commodity.changePercentage > 12) {
      statusLabel = 'Terlalu Mahal';
      statusBadgeStyle = 'bg-[#FEE2E2] text-[#991B1B] outline-[#FECACA]';
    } else {
      statusLabel = 'Agak Mahal';
      statusBadgeStyle = 'bg-[#FEF3C7] text-[#92400E] outline-[#FDE68A]';
    }
  } else if (commodity.changePercentage < -2 || commodity.statusVsHap === 'BELOW_HAP') {
    statusLabel = 'Murah';
    statusBadgeStyle = 'bg-[#EEF773] text-[#1B1A18] outline-[#1B1A18]';
  }

  // 14-day Sparkline calculations
  const sparkline = commodity.sparkline || [
    commodity.previousAvgPrice,
    commodity.previousAvgPrice,
    commodity.previousAvgPrice,
    commodity.currentAvgPrice,
  ];
  const minPrice = Math.min(...sparkline);
  const maxPrice = Math.max(...sparkline);
  const range = maxPrice - minPrice || 1;

  return (
    <Link
      href={`/komoditas/${commodity.slug}`}
      className="group flex flex-col justify-between p-5 rounded-[16px] bg-white outline outline-1 outline-[#E5E3DE] hover:outline-[#1B1A18] hover:shadow-[0_4px_16px_rgba(27,26,24,0.06)] transition-all gap-4"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[15px] font-semibold text-[#1B1A18] group-hover:text-[#FF7714] transition-colors leading-[1.3]">
          {commodity.name}
        </span>
        <span
          className={`shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-[4px] outline outline-1 ${statusBadgeStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Price & Change Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-bold text-[#1B1A18] tabular-nums tracking-tight">
            Rp {commodity.currentAvgPrice.toLocaleString('id-ID')}
          </span>
          <span className="text-[12px] font-medium text-[#78716C]">
            /{commodity.unit}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span
            className={`font-bold tabular-nums ${
              isRising
                ? 'text-[#DC2626]'
                : isDropping
                ? 'text-[#15803D]'
                : 'text-[#6E6D67]'
            }`}
          >
            {isRising
              ? `▲ +${commodity.changePercentage}%`
              : isDropping
              ? `▼ ${commodity.changePercentage}%`
              : '~ 0.0% Stabil'}
          </span>
          <span className="text-[#8C8B85]">dibanding 7 hari lalu</span>
        </div>
      </div>

      {/* 14-day Tactile Sparkline Strip */}
      <div className="flex flex-col gap-1">
        <div className="h-8 flex items-end gap-[3px] p-1.5 bg-[#FAF9F5] rounded-[8px] outline outline-1 outline-[#E5E3DE]/70">
          {sparkline.map((val, idx) => {
            const heightPercent = Math.max(
              20,
              Math.min(100, Math.round(((val - minPrice) / range) * 80 + 20))
            );
            const isLast = idx === sparkline.length - 1;
            return (
              <div
                key={idx}
                className="flex-1 rounded-[1.5px] transition-all"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: isLast
                    ? isRising
                      ? '#DC2626'
                      : isDropping
                      ? '#15803D'
                      : '#1B1A18'
                    : '#D6D4CE',
                }}
                title={`Rp ${val.toLocaleString('id-ID')}`}
              />
            );
          })}
        </div>
      </div>

      {/* Card Footer: Source & Reference */}
      <div className="pt-3 border-t border-[#E5E3DE] flex items-center justify-between text-[11px]">
        <span className="text-[#8E8D86]">
          Sumber: {commodity.source || 'PIHPS'} · 06:00
        </span>
        <span className="font-semibold text-[#6E6D67] tabular-nums">
          HAP: Rp {commodity.hapHetPrice.toLocaleString('id-ID')}
        </span>
      </div>
    </Link>
  );
}
