'use client';

import { useEffect, useState } from 'react';
import {
  ListNumbers,
  SlidersHorizontal,
  SquaresFour,
  Table,
  X,
} from '@phosphor-icons/react';
import { CommoditySummary } from '@/types';
import { PetaMarketPrice } from './peta-data';
import { PetaFilterSidebar } from './PetaFilterSidebar';
import { PetaDrawerRankList } from './PetaDrawerRankList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  regionName: string;
  regionPhase: number;
  commodities: CommoditySummary[];
  selectedCommodityId: string;
  onCommodityChange: (id: string) => void;
  commodityName: string;
  commodityUnit: string;
  regionalAvgPrice: number;
  markets: PetaMarketPrice[];
  selectedMarketId: string;
  onSelectMarket: (marketId: string, shouldFly?: boolean) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

export function PetaHamburgerDrawer({
  isOpen,
  onClose,
  regionName,
  regionPhase,
  commodities,
  selectedCommodityId,
  onCommodityChange,
  commodityName,
  commodityUnit,
  regionalAvgPrice,
  markets,
  selectedMarketId,
  onSelectMarket,
  isLightMode,
  onToggleLightMode,
}: Props) {
  const [activeTab, setActiveTab] = useState<'filter' | 'ranking'>('filter');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="peta-hamburger-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Menu Filter dan Urutan Pasar"
      className="fixed inset-0 z-50 flex"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <aside className="relative z-10 w-[min(92vw,420px)] h-full bg-[var(--bg-paper)] border-r-2 border-[var(--border-ink)] shadow-2xl flex flex-col">
        <div className="p-4 sm:p-5 border-b-2 border-[var(--border-ink)] bg-[var(--bg-card)] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--border-ink)] text-[10px] font-bold">
                F{regionPhase} &middot; {regionName}
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-[10px] font-bold">
                {markets.length} Pasar
              </span>
            </div>
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              Peta Harga Pasar Tradisional
            </h2>
            <p className="text-[11px] sm:text-[12px] text-[var(--text-secondary)] mt-1 leading-snug">
              Filter komoditas atau pilih pasar terhemat di {regionName} untuk menerbangkan peta.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu peta"
            className="market-btn-secondary w-9 h-9 p-0 inline-flex items-center justify-center shrink-0"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="px-4 sm:px-5 pt-3 pb-2 bg-[var(--bg-paper)] border-b border-[var(--border-subtle)] grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('filter')}
            className={`py-2 px-3 rounded-xl text-[12px] font-bold inline-flex items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
              activeTab === 'filter'
                ? 'bg-[var(--accent-chili)] text-white border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)]'
                : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            <SlidersHorizontal size={14} weight="bold" />
            <span>Filter &amp; Indeks</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ranking')}
            className={`py-2 px-3 rounded-xl text-[12px] font-bold inline-flex items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
              activeTab === 'ranking'
                ? 'bg-[var(--accent-chili)] text-white border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)]'
                : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            <ListNumbers size={14} weight="bold" />
            <span>Urutan ({markets.length})</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'filter' ? (
            <PetaFilterSidebar
              commodities={commodities}
              selectedCommodityId={selectedCommodityId}
              onCommodityChange={onCommodityChange}
              commodityUnit={commodityUnit}
              regionalAvgPrice={regionalAvgPrice}
              markets={markets}
              onOpenRankingTab={() => setActiveTab('ranking')}
            />
          ) : (
            <PetaDrawerRankList
              markets={markets}
              selectedMarketId={selectedMarketId}
              commodityName={commodityName}
              commodityUnit={commodityUnit}
              onSelectMarket={(id) => {
                onSelectMarket(id, true);
                onClose();
              }}
            />
          )}
        </div>

        <div className="p-4 border-t-2 border-[var(--border-ink)] bg-[var(--bg-card)]">
          <button
            type="button"
            onClick={() => {
              onToggleLightMode();
              onClose();
            }}
            className="market-btn-secondary w-full py-2.5 px-4 text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLightMode ? (
              <>
                <SquaresFour size={15} weight="bold" />
                <span>Tampilkan Peta Mapbox 3D</span>
              </>
            ) : (
              <>
                <Table size={15} weight="bold" />
                <span>Mode Ringan (Tabel Langsung)</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
