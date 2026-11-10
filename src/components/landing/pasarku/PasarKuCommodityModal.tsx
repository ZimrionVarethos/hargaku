'use client';

import React, { useEffect, useMemo } from 'react';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { CommoditySvg } from '@/lib/data/market-svgs';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';

interface Props {
  item: BogorCommodity | null;
  onClose: () => void;
  categoryAvg?: number;
}

export function PasarKuCommodityModal({ item, onClose, categoryAvg = 0 }: Props) {
  const { openAssistant } = useAssistant();
  const { selectedRegion } = useRegion();
  const liveList = useLiveBogorCommodities();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const resolvedItem = useMemo(() => {
    if (!item) return null;
    return liveList.find((c) => c.id === item.id) || item;
  }, [item, liveList]);

  const computedCatAvg = useMemo(() => {
    if (categoryAvg > 0) return categoryAvg;
    if (!resolvedItem) return 0;
    const sameCat = liveList.filter((c) => c.category === resolvedItem.category);
    if (sameCat.length === 0) return resolvedItem.price;
    return Math.round(sameCat.reduce((sum, x) => sum + x.price, 0) / sameCat.length);
  }, [categoryAvg, resolvedItem, liveList]);

  if (!resolvedItem) return null;

  const avg = computedCatAvg || resolvedItem.price;
  const diffPct = avg > 0 ? Math.round(((resolvedItem.price - avg) / avg) * 100) : 0;
  const isHigher = diffPct > 0;

  const handleAskAi = () => {
    const prompt = `Bandingkan harga ${resolvedItem.name} (Rp ${resolvedItem.price.toLocaleString('id-ID')}/${resolvedItem.unit}) dari Panel Bapanas, PIHPS BI, Pasar Rakyat ${selectedRegion.name}, dan Laporan Warga. Berikan rekomendasi acuan terbaik.`;
    onClose();
    openAssistant(prompt);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="commodityModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border-2 border-[var(--border-ink)] rounded-2xl shadow-2xl p-6 z-10 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[var(--forest-surface)] p-2 shrink-0 border border-[var(--border-ink)]">
              <CommoditySvg kind={resolvedItem.svg} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[var(--accent-chili)]">
                INDEKS #{resolvedItem.no.toString().padStart(2, '0')} &bull; {resolvedItem.category}
              </div>
              <h3 id="commodityModalTitle" className="text-xl font-bold text-[var(--text-primary)]">
                {resolvedItem.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="market-btn-secondary px-2.5 py-1 text-xs font-bold"
          >
            Tutup
          </button>
        </div>

        <div className="market-card p-4 space-y-3 bg-[var(--bg-paper)]">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-[var(--text-muted)] font-medium">Harga Lapak Terkini (DB):</span>
            <span className="text-2xl font-bold text-[var(--forest-ink)] font-mono-num">
              Rp {resolvedItem.price.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-[var(--text-muted)] ml-1">/{resolvedItem.unit}</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Rerata Kategori {resolvedItem.category}:</span>
            <span className="font-bold text-[var(--text-primary)] font-mono-num">
              Rp {avg.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--text-secondary)]">Posisi Terhadap Rerata:</span>
            <span className={`font-bold ${isHigher ? 'text-[var(--accent-chili)]' : 'text-[#245034]'}`}>
              {diffPct === 0 ? 'Sama dengan Rerata' : isHigher ? `+${diffPct}% Di Atas` : `${diffPct}% Di Bawah`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Data tersinkron Perumda PPJ &amp; Supabase</span>
          <a
            href={resolvedItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--accent-chili)] hover:underline"
          >
            Arsip Resmi PPJ &rarr;
          </a>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={handleAskAi}
            className="market-btn-primary flex-1 py-3 text-sm font-bold cursor-pointer"
          >
            Tanya Rekomendasi AI Lintas Sumber &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
