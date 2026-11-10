'use client';

import { MarketStallData } from '@/lib/data/market-stalls';

interface Props {
  stalls: MarketStallData[];
  activeStallIndex: number;
  walkMeters: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectStall: (index: number) => void;
  onExitToEntrance: () => void;
}

export function LorongWalkHud({
  stalls,
  activeStallIndex,
  walkMeters,
  searchQuery,
  onSearchChange,
  onSelectStall,
  onExitToEntrance,
}: Props) {
  return (
    <div className="w-full bg-[var(--bg-paper)]/95 backdrop-blur-md border-b-2 border-[var(--border-ink)] py-2.5 px-3 sm:px-6 shrink-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            type="button"
            onClick={onExitToEntrance}
            className="market-btn-secondary px-2.5 py-1.5 text-xs inline-flex items-center gap-1.5 shrink-0"
            title="Kembali ke halaman depan gerbang pasar"
          >
            <span>&larr;</span>
            <span className="font-bold">Gerbang Depan</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-ink)] text-xs font-bold text-[var(--forest-ink)]">
            <span>👣</span>
            <span>{walkMeters} m</span>
            <span className="hidden sm:inline text-[10px] text-[var(--text-muted)] font-normal">
              di lorong pasar
            </span>
            <span className="hidden lg:inline text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-mono">
              &larr; &rarr; Tombol Panah
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {stalls.map((stall, idx) => {
            const isActive = activeStallIndex === idx;
            return (
              <button
                key={stall.id}
                type="button"
                onClick={() => onSelectStall(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isActive
                    ? 'bg-[#A92717] text-white border-[var(--border-ink)] shadow-[2px_2px_0px_#132E20]'
                    : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-ink)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                {stall.badge}
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-64 relative shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari komoditas di lorong..."
            aria-label="Cari komoditas di lorong pasar"
            className="w-full px-3 py-1.5 pr-8 rounded-lg text-xs bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-chili)] placeholder:text-[var(--text-muted)]"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              &times;
            </button>
          ) : (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] pointer-events-none">
              🔍
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
