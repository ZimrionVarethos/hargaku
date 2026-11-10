'use client';

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
    <div className="relative z-30 w-full bg-[rgba(19,46,32,0.92)] backdrop-blur-md border-t-2 border-[#132E20] py-2 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-white shrink-0 shadow-lg">

      <button
        type="button"
        disabled={activeStallIndex === 0}
        onClick={() => onSelectStall(Math.max(0, activeStallIndex - 1))}
        className="market-btn-secondary px-3 py-1.5 text-xs font-bold disabled:opacity-40"
      >
        &larr; Mundur
      </button>

      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 scrollbar-none">
        {stalls.map((stall, idx) => {
          const isActive = activeStallIndex === idx;
          return (
            <button
              key={stall.id}
              type="button"
              onClick={() => onSelectStall(idx)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? 'bg-[#A92717] text-white border-white shadow-xs'
                  : 'bg-black/40 text-amber-100/90 border-white/20 hover:bg-black/60'
              }`}
            >
              {stall.badge}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleDrawer}
          className="px-3 py-1.5 rounded-lg bg-[#245034] hover:bg-[#2e6542] text-white border border-[#6EE7A0]/40 text-xs font-bold flex items-center gap-1.5 shadow-xs"
          title="Buka daftar komplit 53 komoditas pasar"
        >
          <span>📋</span>
          <span className="hidden sm:inline">Semua 53 Komoditas</span>
        </button>

        <button
          type="button"
          disabled={activeStallIndex === stalls.length - 1}
          onClick={() => onSelectStall(Math.min(stalls.length - 1, activeStallIndex + 1))}
          className="market-btn-secondary px-3 py-1.5 text-xs font-bold disabled:opacity-40"
        >
          Maju &rarr;
        </button>
      </div>

    </div>
  );
}
