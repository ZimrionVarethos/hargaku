'use client';

import { useMemo } from 'react';
import { CommodityDetail } from '@/types';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { matchesCommodityRecord, matchesMarketRecord } from '@/lib/market-insights';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';

export function MarketComparisonCard({ detail }: { detail: CommodityDetail }) {
  const { selectedRegion, calculateRegionalPrice } = useRegion();
  const { rawMarkets, dailyPrices, reports } = useLiveCatalog();

  const rows = useMemo(() => {
    const scopeMarkets = filterMarketsForRegion(rawMarkets, selectedRegion.id).slice(0, 6);
    const items = scopeMarkets.map((m, idx) => {
      const rec =
        dailyPrices[`${m.id}_${detail.slug}`] || dailyPrices[`${m.id}_${detail.id}`];
      const base = rec?.price || detail.currentPriceStats.cityAverage;
      const adjustedPrice = calculateRegionalPrice(
        rec?.price ? base : Math.round((base * (0.96 + idx * 0.02)) / 100) * 100
      );
      const shortage = reports.find(
        (r) =>
          r.status === 'APPROVED' &&
          r.reportType === 'SHORTAGE' &&
          matchesMarketRecord(r, m.id) &&
          matchesCommodityRecord(r, detail)
      );
      return {
        id: m.id,
        name: m.name,
        nearStation: Boolean(m.nearStation),
        adjustedPrice,
        stockBadge: shortage?.stockStatus,
      };
    });

    items.sort((a, b) => a.adjustedPrice - b.adjustedPrice);
    const minPrice = items[0]?.adjustedPrice || 1;
    const maxPrice = Math.max(items[items.length - 1]?.adjustedPrice || 1, minPrice + 1);

    return items.map((item, idx) => {
      const pctAboveMin = minPrice > 0 ? ((item.adjustedPrice - minPrice) / minPrice) * 100 : 0;
      const badge: 'Paling Hemat' | 'Wajar' | 'Agak Mahal' | 'Tertinggi' =
        idx === 0
          ? 'Paling Hemat'
          : idx === items.length - 1 && pctAboveMin > 4
          ? 'Tertinggi'
          : pctAboveMin > 5
          ? 'Agak Mahal'
          : 'Wajar';
      const widthPercent = Math.max(30, Math.round((item.adjustedPrice / maxPrice) * 100));
      return { ...item, badge, widthPercent };
    });
  }, [rawMarkets, dailyPrices, reports, selectedRegion.id, detail, calculateRegionalPrice]);

  return (
    <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
          Perbandingan Antar Pasar di {selectedRegion.name}
        </h3>
        <p className="text-[12px] text-[var(--text-secondary)]">
          Survei harian pasar &amp; status stok untuk {detail.name}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {rows.map((m) => {
          let badgeStyle =
            'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]';
          if (m.badge === 'Paling Hemat') {
            badgeStyle = 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]';
          } else if (m.badge === 'Agak Mahal') {
            badgeStyle = 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
          } else if (m.badge === 'Tertinggi') {
            badgeStyle = 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)]';
          }

          return (
            <div key={m.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-[13px]">
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                  <span className="font-bold text-[var(--text-primary)] truncate">{m.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeStyle}`}>
                    {m.badge}
                  </span>
                  {m.nearStation && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)]">
                      Stasiun
                    </span>
                  )}
                  {m.stockBadge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                      Stok {m.stockBadge}
                    </span>
                  )}
                </div>

                <span className="font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num shrink-0">
                  Rp {m.adjustedPrice.toLocaleString('id-ID')}/{detail.unit}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${m.widthPercent}%`,
                    backgroundColor:
                      m.badge === 'Paling Hemat'
                        ? 'var(--forest-ink)'
                        : m.badge === 'Tertinggi'
                        ? 'var(--accent-chili)'
                        : m.badge === 'Agak Mahal'
                        ? 'var(--warning-ink)'
                        : 'var(--earth-ochre)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--text-muted)] leading-[16px] pt-2 border-t border-[var(--border-subtle)]">
        Data dirangkum dari pemantauan {rows.length} unit pasar di {selectedRegion.name} sebagai pelengkap PIHPS.
      </p>
    </div>
  );
}
