'use client';

import { useMemo, useState } from 'react';
import { MagnifyingGlass, NavigationArrow, Train } from '@phosphor-icons/react';
import { formatRupiah } from '@/lib/utils';
import { PetaMarketPrice } from './peta-data';

interface Props {
  markets: PetaMarketPrice[];
  selectedMarketId: string;
  commodityName: string;
  commodityUnit: string;
  onSelectMarket: (marketId: string) => void;
}

export function PetaDrawerRankList({
  markets,
  selectedMarketId,
  commodityName,
  commodityUnit,
  onSelectMarket,
}: Props) {
  const [marketSearch, setMarketSearch] = useState('');

  const sortedMarkets = useMemo(
    () => [...markets].sort((a, b) => a.price - b.price),
    [markets]
  );

  const filteredMarkets = useMemo(() => {
    const q = marketSearch.trim().toLowerCase();
    if (!q) return sortedMarkets;
    return sortedMarkets.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q)
    );
  }, [sortedMarkets, marketSearch]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 text-[12px]">
        <span className="font-bold text-[var(--text-primary)] truncate">
          {commodityName}
        </span>
        <span className="text-[11px] text-[var(--text-muted)] shrink-0">
          Harga / {commodityUnit}
        </span>
      </div>

      <div className="relative">
        <MagnifyingGlass
          size={14}
          weight="bold"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <input
          type="text"
          value={marketSearch}
          onChange={(e) => setMarketSearch(e.target.value)}
          placeholder="Cari pasar atau kecamatan..."
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-[12px] text-[var(--text-primary)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        {filteredMarkets.map((m) => {
          const rankIndex = sortedMarkets.findIndex((s) => s.marketId === m.marketId) + 1;
          const isSelected = m.marketId === selectedMarketId;
          const isCheapest = rankIndex === 1;

          return (
            <div
              key={m.marketId}
              onClick={() => onSelectMarket(m.marketId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMarket(m.marketId);
                }
              }}
              className={`p-3 rounded-xl border-2 transition-colors cursor-pointer flex flex-col gap-2 ${
                isSelected
                  ? 'bg-[var(--forest-surface)] border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)]'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--border-ink)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                      isCheapest
                        ? 'bg-[#EEF773] text-[#132E20] border border-[#132E20]'
                        : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {rankIndex}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--text-primary)] leading-snug">
                      {m.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      {m.address}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[14px] font-extrabold text-[var(--forest-ink)] font-mono-num">
                    {formatRupiah(m.price)}
                  </div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)]">
                    {m.diffPercent > 0 ? `+${m.diffPercent}%` : `${m.diffPercent}%`}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]/70">
                <div className="flex flex-wrap items-center gap-1.5">
                  {isCheapest && (
                    <span className="px-1.5 py-0.5 rounded bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)] text-[10px] font-bold">
                      Termurah
                    </span>
                  )}
                  {m.nearStation && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] text-[10px] font-bold">
                      <Train size={10} weight="bold" />
                      <span>Stasiun</span>
                    </span>
                  )}
                  {m.alertHeadline && (
                    <span className="px-1.5 py-0.5 rounded bg-[var(--ochre-surface)] text-[var(--warning-ink)] text-[10px] font-bold">
                      {m.alertHeadline}
                    </span>
                  )}
                </div>

                <a
                  href={m.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Buka rute di Google Maps"
                  className="p-1 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-paper)] text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                >
                  <NavigationArrow size={12} weight="bold" />
                </a>
              </div>
            </div>
          );
        })}

        {filteredMarkets.length === 0 && (
          <div className="text-center text-xs text-[var(--text-muted)] py-6">
            Tidak ada pasar yang sesuai pencarian.
          </div>
        )}
      </div>
    </div>
  );
}

