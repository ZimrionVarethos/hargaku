'use client';

import { ArrowRight, ListBullets, Storefront } from '@phosphor-icons/react';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { CommoditySvg } from '@/lib/data/market-svgs';
import {
  findCompartmentSlotByCommodityId,
  getZoneIndexForCommodity,
  STALL_ZONE_META,
} from '@/lib/data/market-stalls';

interface Props {
  id: string;
  matches: BogorCommodity[];
  activeIdx: number;
  query: string;
  onSelectMatch: (item: BogorCommodity) => void;
  onOpenFilteredDrawer: () => void;
}

export function LorongSearchDropdown({
  id,
  matches,
  activeIdx,
  query,
  onSelectMatch,
  onOpenFilteredDrawer,
}: Props) {
  if (!query.trim()) return null;

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Hasil pencarian komoditas lorong"
      className="absolute right-0 top-full mt-1.5 w-full min-w-[260px] rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] shadow-[4px_4px_0px_var(--border-ink)] overflow-hidden z-50"
    >
      {matches.length === 0 ? (
        <div className="px-3.5 py-3 text-xs text-[var(--text-muted)] text-center">
          Komoditas tidak ditemukan di daftar pasar.
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-subtle)] max-h-72 overflow-y-auto">
          {matches.slice(0, 6).map((item, idx) => {
            const slot = findCompartmentSlotByCommodityId(item.id);
            const zoneMeta = STALL_ZONE_META[getZoneIndexForCommodity(item)];
            const isHighlighted = idx === activeIdx;

            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isHighlighted}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelectMatch(item)}
                className={`w-full px-3 py-2 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                  isHighlighted ? 'bg-[var(--bg-muted)]' : 'hover:bg-[var(--bg-muted)]/70'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-[var(--bg-paper)] border border-[var(--border-ink)] p-1 shrink-0">
                    <CommoditySvg kind={item.svg} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-bold text-[var(--forest-ink)] font-mono-num">
                      Rp {item.price.toLocaleString('id-ID')}
                      <span className="font-normal text-[var(--text-muted)]">/{item.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-paper)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)] whitespace-nowrap">
                    {slot ? (
                      <>
                        <Storefront size={11} weight="bold" aria-hidden="true" />
                        <span>Lapak #{String(slot.id).padStart(2, '0')}</span>
                      </>
                    ) : (
                      <span>{zoneMeta.badge}</span>
                    )}
                  </span>
                  <ArrowRight size={12} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {matches.length > 0 && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onOpenFilteredDrawer}
          className="w-full px-3 py-2 bg-[var(--bg-muted)] hover:bg-[var(--bg-paper)] border-t border-[var(--border-ink)] text-[11px] font-bold text-[var(--forest-ink)] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ListBullets size={13} weight="bold" aria-hidden="true" />
          <span>Buka semua hasil di daftar ({matches.length})</span>
        </button>
      )}
    </div>
  );
}
