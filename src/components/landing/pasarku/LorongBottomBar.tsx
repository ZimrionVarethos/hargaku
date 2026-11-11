'use client';

import { ArrowLeft, ArrowRight, ListBullets } from '@phosphor-icons/react';
import { MarketStallData } from '@/lib/data/market-stalls';

interface Props {
  stalls: MarketStallData[];
  activeStallIndex: number;
  onSelectStall: (index: number) => void;
  onToggleDrawer: () => void;
}

export function LorongBottomBar({
  stalls,
  activeStallIndex,
  onSelectStall,
  onToggleDrawer,
}: Props) {
  return (
    <div className="relative z-30 w-full bg-[rgba(19,46,32,0.84)] backdrop-blur-md border-t border-white/15 py-2 px-3 sm:px-6 flex items-center justify-between gap-2 text-white shrink-0 shadow-lg">

      <button
        type="button"
        disabled={activeStallIndex === 0}
        onClick={() => onSelectStall(Math.max(0, activeStallIndex - 1))}
        aria-label="Mundur satu zona di lorong"
        className="market-btn-secondary h-9 px-2.5 sm:px-3 text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
      >
        <ArrowLeft size={14} weight="bold" aria-hidden="true" />
        <span className="hidden sm:inline">Mundur</span>
      </button>

      <nav aria-label="Kategori lapak lorong pasar" className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 scrollbar-none">
        {stalls.map((stall, idx) => {
          const isActive = activeStallIndex === idx;
          return (
            <button
              key={stall.id}
              type="button"
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelectStall(idx)}
              className={`h-8 px-3 rounded-full text-xs font-bold whitespace-nowrap transition-colors border shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#A92717] text-white border-white shadow-xs'
                  : 'bg-black/40 text-amber-100/95 border-white/20 hover:bg-black/60'
              }`}
            >
              {stall.badge}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleDrawer}
          aria-label="Buka daftar komplit 53 komoditas pasar"
          className="h-9 px-2.5 sm:px-3 rounded-lg bg-[#245034] hover:bg-[#2e6542] text-white border border-[#6EE7A0]/40 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
        >
          <ListBullets size={15} weight="bold" aria-hidden="true" />
          <span className="hidden md:inline">Semua 53 Komoditas</span>
        </button>

        <button
          type="button"
          disabled={activeStallIndex === stalls.length - 1}
          onClick={() => onSelectStall(Math.min(stalls.length - 1, activeStallIndex + 1))}
          aria-label="Maju satu zona di lorong"
          className="market-btn-secondary h-9 px-2.5 sm:px-3 text-xs font-bold disabled:opacity-40 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="hidden sm:inline">Maju</span>
          <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>

    </div>
  );
}
