'use client';

import { Package, TrendUp } from '@phosphor-icons/react';
import type { MarketInsightsSummary } from '@/types';

export function MarketInsightsPanel({ insight }: { insight: MarketInsightsSummary }) {
  return (
    <div className="space-y-3">
      <div className="rounded-[14px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--accent-chili)]">
            <TrendUp size={14} weight="bold" />
            <span>Sedang Mahal Menurut Laporan Warga</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-secondary)]">
            {insight.approvedPriceReportCount} lap. terverifikasi
          </span>
        </div>

        {insight.expensiveItems.length > 0 ? (
          <div className="space-y-2">
            {insight.expensiveItems.slice(0, 3).map((item) => (
              <div
                key={item.commodityId}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[var(--text-primary)] truncate">
                    {item.commodityName}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Acuan pasar Rp {item.officialPrice.toLocaleString('id-ID')} &bull; {item.reportCount} laporan
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-[var(--accent-chili)] font-mono-num">
                    Rp {item.reportedMedianPrice.toLocaleString('id-ID')}/{item.unit}
                  </div>
                  <span className="inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)]">
                    +{item.diffPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Belum ada laporan warga di pasar ini yang melampaui +10% dari acuan harian.
          </p>
        )}
      </div>

      <div className="rounded-[14px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--earth-ochre)]">
            <Package size={14} weight="bold" />
            <span>Info Kelangkaan Pasokan (Laporan Pedagang)</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-secondary)]">
            Agregat Pasar
          </span>
        </div>

        {insight.shortageAlerts.length > 0 ? (
          <div className="space-y-2">
            {insight.shortageAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.commodityId}
                className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[var(--text-primary)]">{alert.commodityName}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      alert.stockStatus === 'LANGKA'
                        ? 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]'
                        : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                    }`}
                  >
                    {alert.stockStatus} ({alert.reportCount}x)
                  </span>
                </div>
                {alert.note && (
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {alert.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Pasokan lapak dilaporkan normal tanpa laporan kelangkaan aktif saat ini.
          </p>
        )}
      </div>
    </div>
  );
}

