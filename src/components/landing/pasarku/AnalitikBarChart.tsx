'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { BogorCommodity } from '@/lib/data/bogor-commodities';

interface Props {
  items: BogorCommodity[];
  selectedCategory: string;
  avg: number;
  maxPrice: number;
}

export function AnalitikBarChart({ items, selectedCategory, avg, maxPrice }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pinnedIdx, setPinnedIdx] = useState<number | null>(null);
  const [scrollState, setScrollState] = useState({ left: false, right: false });
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollState({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);
    window.addEventListener('resize', updateScrollState);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScrollState);
    };
  }, [items.length, updateScrollState]);

  const handleScrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const inspectedIdx = hoveredIdx ?? pinnedIdx;
  const displayIdx = inspectedIdx ?? (items.length > 0 ? 0 : null);
  const displayItem = displayIdx !== null ? items[displayIdx] ?? null : null;
  const diffVsAvgPct =
    displayItem && avg > 0 ? Math.round(((displayItem.price - avg) / avg) * 100) : 0;

  const avgBottomPct = maxPrice > 0 ? Math.min(96, Math.max(4, (avg / maxPrice) * 100)) : 0;

  return (
    <div className="lg:col-span-8 market-card p-5 flex flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span>Bilah Harga per Komoditas (Rp)</span>
          <span className="px-2 py-0.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-primary)]">
            {items.length} Komoditas
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent-chili)]" />
            <span>Tertinggi</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--forest-ink)]" />
            <span>Komoditas Lain</span>
          </span>
          {avg > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 border-b-2 border-dashed border-[var(--wave-line-gold)]" />
              <span>Rerata: Rp {avg.toLocaleString('id-ID')}</span>
            </span>
          )}
        </div>
      </div>

      {displayItem && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-paper)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                displayIdx === 0 ? 'bg-[var(--accent-chili)]' : 'bg-[var(--forest-ink)]'
              }`}
            />
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
              {displayItem.name}
            </span>
            {displayIdx === 0 && (
              <span className="px-1.5 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] text-[10px] font-bold shrink-0">
                Tertinggi
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-bold font-mono-num text-[var(--forest-ink)]">
              Rp {displayItem.price.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)]">
              / {displayItem.unit}
            </span>
            {avg > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-num ${
                  diffVsAvgPct > 0
                    ? 'bg-[var(--ochre-surface)] text-[var(--warning-ink)]'
                    : 'bg-[var(--forest-surface)] text-[var(--forest-ink)]'
                }`}
              >
                {diffVsAvgPct > 0 ? `+${diffVsAvgPct}%` : `${diffVsAvgPct}%`} vs rerata
              </span>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="w-full overflow-x-auto pb-1.5 scroll-smooth"
        >
          <div className="relative min-w-full w-max px-3 pt-16">
            <div className="absolute inset-x-3 top-16 h-44 pointer-events-none border-b border-[var(--border-subtle)]">
              {maxPrice > 0 && avg > 0 && (
                <div
                  className="absolute left-0 right-0 border-b-2 border-dashed border-[var(--wave-line-gold)] z-10"
                  style={{ bottom: `${avgBottomPct}%` }}
                />
              )}
            </div>

            <div className="flex items-stretch gap-2.5">
              {items.map((item, idx) => {
                const heightPct =
                  maxPrice > 0 ? Math.max(10, Math.min(92, Math.round((item.price / maxPrice) * 100))) : 10;
                const isTop = idx === 0;
                const isInspected = inspectedIdx === idx;
                const tooltipAlignClass =
                  items.length <= 2 || idx <= 1
                    ? 'left-0'
                    : idx >= items.length - 2
                      ? 'right-0'
                      : 'left-1/2 -translate-x-1/2';

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={pinnedIdx === idx}
                    aria-label={`${item.name}: Rp ${item.price.toLocaleString('id-ID')} per ${item.unit}`}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onFocus={() => setHoveredIdx(idx)}
                    onBlur={() => setHoveredIdx(null)}
                    onClick={() => setPinnedIdx((prev) => (prev === idx ? null : idx))}
                    className="flex-1 min-w-[58px] max-w-[96px] flex flex-col items-center cursor-pointer group rounded-md p-0 border-0 bg-transparent text-left"
                  >
                    <div className="w-full h-44 flex items-end justify-center relative">
                      <div
                        className="relative w-9 sm:w-10 transition-transform duration-200"
                        style={{ height: `${heightPct}%` }}
                      >
                        {isInspected && (
                          <div
                            className={`absolute bottom-full mb-2 z-30 px-2.5 py-1.5 rounded-lg bg-[#132E20] text-[#F9F3EE] border border-[var(--border-ink)] text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none ${tooltipAlignClass}`}
                          >
                            <div>{item.name}</div>
                            <div className="font-mono-num text-[#EEF773]">
                              Rp {item.price.toLocaleString('id-ID')} / {item.unit}
                            </div>
                          </div>
                        )}

                        <div
                          className={`w-full h-full rounded-t-md transition-all duration-200 border-2 border-[var(--border-ink)] ${
                            isTop ? 'bg-[var(--accent-chili)]' : 'bg-[var(--forest-ink)]'
                          } ${isInspected ? 'brightness-110 -translate-y-0.5 shadow-[var(--shadow-hard-sm)]' : ''}`}
                        />
                      </div>
                    </div>

                    <span className="mt-2 w-full min-h-[26px] text-[10px] font-bold leading-tight text-[var(--text-primary)] line-clamp-2 text-center break-words">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {scrollState.left && (
          <div className="pointer-events-none absolute top-14 bottom-1 left-0 w-5 bg-gradient-to-r from-[var(--bg-card)] to-transparent z-20" />
        )}
        {scrollState.right && (
          <div className="pointer-events-none absolute top-14 bottom-1 right-0 w-5 bg-gradient-to-l from-[var(--bg-card)] to-transparent z-20" />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {(scrollState.left || scrollState.right) ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScrollBy(-240)}
              disabled={!scrollState.left}
              aria-label="Geser grafik ke kiri"
              className="w-7 h-7 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-paper)] text-[var(--text-primary)] inline-flex items-center justify-center disabled:opacity-35 hover:bg-[var(--bg-muted)] cursor-pointer"
            >
              <CaretLeft size={14} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollBy(240)}
              disabled={!scrollState.right}
              aria-label="Geser grafik ke kanan"
              className="w-7 h-7 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-paper)] text-[var(--text-primary)] inline-flex items-center justify-center disabled:opacity-35 hover:bg-[var(--bg-muted)] cursor-pointer"
            >
              <CaretRight size={14} weight="bold" aria-hidden="true" />
            </button>
            <span className="text-[11px] font-medium text-[var(--text-muted)] ml-1">
              Geser atau ketuk bilah untuk detail harga
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            Arahkan kursor atau ketuk bilah untuk detail harga
          </span>
        )}

        <div className="text-[11px] text-[var(--text-muted)] text-right italic ml-auto">
          *Tinggi bilah proporsional terhadap harga tertinggi dalam kelompok {selectedCategory}.
        </div>
      </div>
    </div>
  );
}
