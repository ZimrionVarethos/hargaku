'use client';

import Link from 'next/link';
import { CommoditySummary } from '@/types';

interface Props {
  commodity: CommoditySummary;
}

export function TactileCommodityCard({ commodity }: Props) {
  const isRising = commodity.changePercentage > 0;
  const isDropping = commodity.changePercentage < 0;

  let statusLabel = 'Wajar';
  let statusBadgeStyle = 'bg-[var(--bg-muted)] text-[var(--text-primary)] border-[var(--border-subtle)]';

  if (commodity.changePercentage > 10 || commodity.statusVsHap === 'ABOVE_HAP' && commodity.changePercentage > 5) {
    if (commodity.changePercentage > 12) {
      statusLabel = 'Terlalu Mahal';
      statusBadgeStyle = 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]';
    } else {
      statusLabel = 'Agak Mahal';
      statusBadgeStyle = 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    }
  } else if (commodity.changePercentage < -2 || commodity.statusVsHap === 'BELOW_HAP') {
    statusLabel = 'Murah';
    statusBadgeStyle = 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]';
  }

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
      className="group market-card flex flex-col justify-between p-5 gap-4 no-underline"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[15px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-chili)] transition-colors leading-[1.3]">
          {commodity.name}
        </span>
        <span
          className={`shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-[4px] border ${statusBadgeStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-extrabold text-[var(--forest-ink)] tabular-nums tracking-tight font-mono-num">
            Rp {commodity.currentAvgPrice.toLocaleString('id-ID')}
          </span>
          <span className="text-[12px] font-medium text-[var(--text-muted)]">
            /{commodity.unit}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span
            className={`font-bold tabular-nums ${
              isRising
                ? 'text-[var(--accent-chili)]'
                : isDropping
                ? 'text-[var(--forest-ink)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {isRising
              ? `▲ +${commodity.changePercentage}%`
              : isDropping
              ? `▼ ${commodity.changePercentage}%`
              : '~ 0.0% Stabil'}
          </span>
          <span className="text-[var(--text-muted)]">dibanding 7 hari lalu</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-8 flex items-end gap-[3px] p-1.5 bg-[var(--bg-muted)] rounded-[8px] border border-[var(--border-subtle)]">
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
                      ? 'var(--accent-chili)'
                      : isDropping
                      ? 'var(--forest-ink)'
                      : 'var(--text-primary)'
                    : 'var(--border-ink)',
                }}
                title={`Rp ${val.toLocaleString('id-ID')}`}
              />
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
        <span className="text-[var(--text-muted)]">
          Sumber: {commodity.source || 'PIHPS'} · 06:00
        </span>
        <span className="font-bold text-[var(--text-secondary)] tabular-nums">
          HAP: Rp {commodity.hapHetPrice.toLocaleString('id-ID')}
        </span>
      </div>
    </Link>
  );
}
