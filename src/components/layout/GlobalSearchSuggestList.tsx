'use client';

import { ArrowRight, ListBullets } from '@phosphor-icons/react';
import type { SiteSearchItem } from '@/lib/search/site-search';
import { SearchItemIcon } from '@/components/search/SearchItemIcon';

const QUICK_POPULAR_QUERIES = [
  'Cabai Rawit',
  'Bayam',
  'Dekat Stasiun',
  'Cek Harga',
  'PUNTEN AI',
  'Lapor Stok',
  'Jawa Barat',
];

interface Props {
  sanitized: string;
  regionName: string;
  activeItems: SiteSearchItem[];
  totalCount: number;
  activeIdx: number;
  onSelectQuery: (tag: string) => void;
  onSelectItem: (item: SiteSearchItem) => void;
  onViewAll: () => void;
}

export function GlobalSearchSuggestList({
  sanitized,
  regionName,
  activeItems,
  totalCount,
  activeIdx,
  onSelectQuery,
  onSelectItem,
  onViewAll,
}: Props) {
  if (!sanitized) {
    return (
      <div className="p-4 sm:p-5 bg-[var(--bg-card)] space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Pencarian Cepat Populer
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_POPULAR_QUERIES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectQuery(tag)}
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-paper)] hover:bg-[var(--bg-muted)] border border-[var(--border-ink)] text-xs font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="globalSiteSearchResults" role="listbox" aria-label="Saran hasil pencarian global">
      {activeItems.length === 0 ? (
        <div className="px-4 py-6 text-center space-y-2 bg-[var(--bg-card)]">
          <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
            Tidak ditemukan saran langsung untuk &ldquo;{sanitized}&rdquo;.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Tekan Enter untuk membuka halaman hasil /cari atau ubah kata kunci umum.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-subtle)] max-h-[50vh] overflow-y-auto bg-[var(--bg-card)]">
          {activeItems.map((item, idx) => {
            const isHighlighted = idx === activeIdx;
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={isHighlighted}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelectItem(item)}
                className={`w-full px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                  isHighlighted ? 'bg-[var(--bg-muted)]' : 'hover:bg-[var(--bg-muted)]/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-[var(--bg-paper)] border border-[var(--border-ink)] p-1 shrink-0 flex items-center justify-center">
                    <SearchItemIcon item={item} size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-[13px] font-bold text-[var(--text-primary)] truncate">
                      {item.title}
                    </div>
                    {item.kind === 'COMMODITY' && item.priceText ? (
                      <div className="text-[11px] font-bold text-[var(--forest-ink)] font-mono-num truncate">
                        {item.priceText}
                        <span className="font-normal text-[var(--text-muted)]">
                          {' '}
                          &middot; {regionName}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[var(--bg-paper)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)] whitespace-nowrap">
                    {item.badgeLabel}
                  </span>
                  <ArrowRight
                    size={12}
                    weight="bold"
                    className="text-[var(--accent-chili)]"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onViewAll}
        className="w-full px-4 py-2.5 bg-[var(--bg-muted)] hover:bg-[var(--bg-paper)] border-t-2 border-[var(--border-ink)] text-xs font-bold text-[var(--forest-ink)] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <ListBullets size={14} weight="bold" aria-hidden="true" />
        <span>
          Lihat seluruh hasil untuk &ldquo;{sanitized}&rdquo; ({totalCount})
        </span>
      </button>
    </div>
  );
}

