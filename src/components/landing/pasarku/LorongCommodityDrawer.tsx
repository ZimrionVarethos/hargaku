'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, X } from '@phosphor-icons/react';
import { MarketStallData } from '@/lib/data/market-stalls';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { CommoditySvg } from '@/lib/data/market-svgs';
import { useAssistant } from '@/lib/store/assistant-store';

interface Props {
  isOpen: boolean;
  stalls: MarketStallData[];
  initialStallIdx?: number;
  searchFilter?: string;
  onClearSearchFilter?: () => void;
  onClose: () => void;
  onSelectCommodity: (item: BogorCommodity) => void;
}

export function LorongCommodityDrawer({
  isOpen,
  stalls,
  initialStallIdx = 0,
  searchFilter = '',
  onClearSearchFilter,
  onClose,
  onSelectCommodity,
}: Props) {
  const [selectedStallIdx, setSelectedStallIdx] = useState(initialStallIdx);
  const { openAssistant } = useAssistant();

  useEffect(() => {
    if (isOpen) setSelectedStallIdx(initialStallIdx);
  }, [isOpen, initialStallIdx]);

  const normalizedFilter = searchFilter.trim().toLowerCase();
  const currentStall = stalls[selectedStallIdx] || stalls[0];

  const displayedItems = useMemo(() => {
    if (normalizedFilter) {
      return stalls
        .flatMap((s) => s.items)
        .filter(
          (item) =>
            item.name.toLowerCase().includes(normalizedFilter) ||
            item.category.toLowerCase().includes(normalizedFilter)
        );
    }
    return currentStall.items;
  }, [normalizedFilter, stalls, currentStall]);

  if (!isOpen) return null;

  const handleQuickAi = (e: React.MouseEvent, item: BogorCommodity) => {
    e.stopPropagation();
    onClose();
    openAssistant(
      `Bandingkan harga ${item.name} (Rp ${item.price.toLocaleString('id-ID')}/${item.unit}) lintas sumber (Bapanas, PIHPS BI, Pasar Rakyat, dan Laporan Warga).`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawerHeading"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[80vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-ink)] shrink-0">
          <div>
            <h3 id="drawerHeading" className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Daftar Lengkap 53 Komoditas Pasar Rakyat
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Harga lapak tersinkron dari database &amp; pembaruan admin harian
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar komoditas"
            className="market-btn-secondary h-9 px-3 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <X size={14} weight="bold" aria-hidden="true" />
            <span>Tutup</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-[var(--border-subtle)] shrink-0 scrollbar-none">
          {stalls.map((stall, idx) => (
            <button
              key={stall.id}
              type="button"
              onClick={() => {
                if (normalizedFilter && onClearSearchFilter) onClearSearchFilter();
                setSelectedStallIdx(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border shrink-0 transition-colors cursor-pointer ${
                !normalizedFilter && selectedStallIdx === idx
                  ? 'bg-[#A92717] text-white border-[var(--border-ink)]'
                  : 'bg-[var(--bg-muted)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--bg-card)]'
              }`}
            >
              {stall.badge} ({stall.items.length})
            </button>
          ))}
        </div>

        {normalizedFilter && (
          <div className="py-2 px-3 mt-2 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-between text-xs shrink-0">
            <span className="text-[var(--text-secondary)]">
              Hasil pencarian <strong className="text-[var(--text-primary)]">&ldquo;{searchFilter}&rdquo;</strong> ({displayedItems.length} item)
            </span>
            {onClearSearchFilter && (
              <button
                type="button"
                onClick={onClearSearchFilter}
                className="font-bold text-[var(--accent-chili)] hover:underline cursor-pointer"
              >
                Tampilkan semua kategori
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectCommodity(item);
                onClose();
              }}
              className="market-card market-card-interactive p-2.5 flex flex-col justify-between bg-[var(--bg-paper)] cursor-pointer group rounded-xl"
            >
              <div className="flex items-start justify-between gap-1">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] p-1 border border-[var(--border-ink)] shrink-0">
                  <CommoditySvg kind={item.svg} />
                </div>
                <span className="text-[9px] font-bold text-[var(--text-muted)]">
                  #{item.no.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="mt-2">
                <div className="text-[11px] font-bold text-[var(--text-primary)] line-clamp-1">
                  {item.name}
                </div>
                <div className="text-[12px] font-extrabold text-[var(--forest-ink)] font-mono-num mt-0.5">
                  Rp {item.price.toLocaleString('id-ID')}
                  <span className="text-[9px] font-normal text-[var(--text-muted)] ml-0.5">/{item.unit}</span>
                </div>
              </div>

              <div className="mt-2 pt-1 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px]">
                <span className="font-semibold text-[var(--accent-chili)] inline-flex items-center gap-0.5">
                  <span>Rincian</span>
                  <ArrowRight size={11} weight="bold" aria-hidden="true" />
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQuickAi(e, item)}
                  className="market-btn-secondary px-2 py-0.5 text-[9px] font-bold cursor-pointer"
                >
                  Tanya PUNTEN
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] shrink-0">
          <span>
            {normalizedFilter
              ? `${displayedItems.length} komoditas cocok`
              : `${currentStall.items.length} komoditas di ${currentStall.title}`}
          </span>
          <span className="font-semibold text-[var(--forest-ink)]">Sinkron DB</span>
        </div>
      </div>
    </div>
  );
}
