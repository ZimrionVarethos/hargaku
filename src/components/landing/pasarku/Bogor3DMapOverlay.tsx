'use client';

import React from 'react';
import {
  Compass,
  CubeFocus,
  ChatCircleDots,
  ArrowSquareOut,
  MapTrifold,
} from '@phosphor-icons/react';
import type { BogorMarket } from '@/lib/data/bogor-markets';
import { useAssistant } from '@/lib/store/assistant-store';

interface Props {
  activeMarket?: BogorMarket;
  onFocusMarket: (marketId: string) => void;
  onOrbit: () => void;
  onResetOverview: () => void;
}

export function Bogor3DMapOverlay({
  activeMarket,
  onFocusMarket,
  onOrbit,
  onResetOverview,
}: Props) {
  const { openAssistant } = useAssistant();

  return (
    <>
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)]/95 border border-[var(--border-ink)] text-[10px] font-bold inline-flex items-center gap-1.5 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#A92717] inline-block" />
          <span>Induk</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-[#C2611A] inline-block ml-1" />
          <span>Sentra</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-[#245034] inline-block ml-1" />
          <span>Rakyat 3D</span>
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={onOrbit}
          className="market-btn-secondary px-2.5 py-1.5 text-[11px] font-bold inline-flex items-center gap-1"
          title="Putar sudut pandang 3D 45 derajat"
        >
          <Compass size={14} weight="bold" />
          <span className="hidden sm:inline">Putar 3D</span>
        </button>
        <button
          type="button"
          onClick={onResetOverview}
          className="market-btn-secondary px-2.5 py-1.5 text-[11px] font-bold inline-flex items-center gap-1"
        >
          <MapTrifold size={14} weight="bold" />
          <span>Semua 13 Pasar</span>
        </button>
      </div>

      {activeMarket && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-10 bg-[var(--bg-card)]/95 backdrop-blur-xs border-2 border-[var(--border-ink)] rounded-xl p-3.5 shadow-[3px_3px_0px_var(--border-ink)] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF773] text-[#132E20] border border-[#132E20]">
              {activeMarket.code} &bull; {activeMarket.area}
            </span>
            <span className="text-[10px] font-bold text-[var(--accent-chili)] truncate">
              {activeMarket.highlight}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
              {activeMarket.name}
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-0.5">
              {activeMarket.address}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => onFocusMarket(activeMarket.id)}
              className="market-btn-secondary px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1"
            >
              <CubeFocus size={13} weight="bold" />
              <span>Fokus 3D</span>
            </button>
            <button
              type="button"
              onClick={() =>
                openAssistant(
                  `Bagaimana ringkasan harga komoditas pokok dan kewajaran harga di ${activeMarket.name} (${activeMarket.area}, Kota Bogor) hari ini?`
                )
              }
              className="market-btn-primary px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1"
            >
              <ChatCircleDots size={13} weight="bold" />
              <span>Tanya PUNTEN</span>
            </button>
            <a
              href={activeMarket.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-[11px] font-bold text-[var(--accent-chili)] hover:underline inline-flex items-center gap-0.5"
            >
              <span>PPJ</span>
              <ArrowSquareOut size={12} weight="bold" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

