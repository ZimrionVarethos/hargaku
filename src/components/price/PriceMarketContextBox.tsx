'use client';

import { Package, Train, TrendUp } from '@phosphor-icons/react';
import type { PriceCheckResult } from '@/types';

export function PriceMarketContextBox({
  marketContext,
  positioningNote,
}: {
  marketContext?: PriceCheckResult['marketContext'];
  positioningNote?: string;
}) {
  if (!marketContext && !positioningNote) return null;

  return (
    <div className="space-y-2">
      {marketContext && (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-paper)] p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-[var(--text-primary)]">
              Info Lapangan: {marketContext.marketName}
            </span>
            {marketContext.nearStation && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] text-[10px] font-bold">
                <Train size={11} weight="bold" />
                <span>{marketContext.landmarkNote || 'Dekat Stasiun'}</span>
              </span>
            )}
          </div>

          {marketContext.expensiveItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-chili)]">
                <TrendUp size={12} weight="bold" />
                <span>Sedang tinggi:</span>
              </span>
              {marketContext.expensiveItems.slice(0, 3).map((item) => (
                <span
                  key={item.commodityId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)]"
                >
                  <span className="font-semibold">{item.commodityName}</span>
                  <span className="font-bold text-[var(--accent-chili)]">+{item.diffPercent}%</span>
                </span>
              ))}
            </div>
          )}

          {marketContext.shortageAlerts.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--warning-ink)]">
                <Package size={12} weight="bold" />
                <span>Stok terbatas:</span>
              </span>
              {marketContext.shortageAlerts.slice(0, 3).map((al) => (
                <span
                  key={al.commodityId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--ochre-surface)] text-[var(--warning-ink)] border border-[var(--warning-ink)]/35 text-[11px] font-semibold"
                >
                  <span>{al.commodityName}</span>
                  <span className="font-bold">({al.stockStatus})</span>
                </span>
              ))}
            </div>
          )}

          {marketContext.expensiveItems.length === 0 && marketContext.shortageAlerts.length === 0 && (
            <p className="text-[11px] text-[var(--text-muted)]">
              Belum ada laporan lonjakan harga ataupun kelangkaan aktif pada pasar ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
