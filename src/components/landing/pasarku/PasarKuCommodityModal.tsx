'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { CommoditySvg } from '@/lib/data/market-svgs';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { findMatchingCommodity } from '@/lib/market-insights';

interface Props {
  item: BogorCommodity | null;
  onClose: () => void;
  categoryAvg?: number;
}

export function PasarKuCommodityModal({ item, onClose, categoryAvg = 0 }: Props) {
  const { openAssistant } = useAssistant();
  const { selectedRegion, calculateRegionalPrice } = useRegion();
  const { commodities: catalogCommodities } = useLiveCatalog();
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

  const matchedCatalog = useMemo(() => {
    if (!resolvedItem) return undefined;
    return findMatchingCommodity(catalogCommodities, {
      commodityId: String(resolvedItem.id),
      commodityName: resolvedItem.name,
    });
  }, [resolvedItem, catalogCommodities]);

  const computedCatAvg = useMemo(() => {
    if (categoryAvg > 0) return categoryAvg;
    if (!resolvedItem) return 0;
    const sameCat = liveList.filter((c) => c.category === resolvedItem.category);
    if (sameCat.length === 0) return resolvedItem.price;
    return Math.round(sameCat.reduce((sum, x) => sum + x.price, 0) / sameCat.length);
  }, [categoryAvg, resolvedItem, liveList]);

  if (!resolvedItem) return null;

  const regionalPrice = calculateRegionalPrice(resolvedItem.price);
  const nationalHap = matchedCatalog?.hapHetPrice || Math.round(resolvedItem.price * 0.94);
  const avg = calculateRegionalPrice(computedCatAvg || resolvedItem.price);
  const diffPct = avg > 0 ? Math.round(((regionalPrice - avg) / avg) * 100) : 0;
  const isHigher = diffPct > 0;
  const targetSlug = matchedCatalog?.slug || 'cabai-rawit-merah';

  const handleAskAi = () => {
    const prompt = `Bandingkan harga ${resolvedItem.name} (Nasional HAP Rp ${nationalHap.toLocaleString('id-ID')}/${resolvedItem.unit} vs Lokal ${selectedRegion.name} Rp ${regionalPrice.toLocaleString('id-ID')}/${resolvedItem.unit}) dari Bapanas, PIHPS BI, pasar setempat, dan laporan warga.`;
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
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Acuan Lokal ({selectedRegion.name}):
            </span>
            <span className="text-2xl font-bold text-[var(--forest-ink)] font-mono-num">
              Rp {regionalPrice.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-[var(--text-muted)] ml-1">/{resolvedItem.unit}</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)]">Acuan Nasional Bapanas (HAP/HET):</span>
            <span className="font-bold text-[var(--text-primary)] font-mono-num">
              Rp {nationalHap.toLocaleString('id-ID')}/{resolvedItem.unit}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--text-secondary)]">Rerata Kategori {resolvedItem.category}:</span>
            <span className="font-bold text-[var(--text-primary)] font-mono-num">
              Rp {avg.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--text-secondary)]">Posisi Terhadap Rerata:</span>
            <span className={`font-bold ${isHigher ? 'text-[var(--accent-chili)]' : 'text-[var(--forest-ink)]'}`}>
              {diffPct === 0 ? 'Sama dengan Rerata' : isHigher ? `+${diffPct}% Di Atas` : `${diffPct}% Di Bawah`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Melengkapi PIHPS &amp; Bapanas untuk keputusan pembeli</span>
          <a
            href={resolvedItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--accent-chili)] hover:underline inline-flex items-center gap-1"
          >
            <span>Rujukan Data</span>
            <ArrowSquareOut size={13} weight="bold" aria-hidden="true" />
          </a>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <Link
            href={`/cek-harga?commodity=${targetSlug}`}
            onClick={onClose}
            className="market-btn-secondary flex-1 py-2.5 text-xs font-bold text-center no-underline"
          >
            Cek Harga di Lapak
          </Link>
          <Link
            href={`/lapor?commodity=${targetSlug}`}
            onClick={onClose}
            className="market-btn-secondary flex-1 py-2.5 text-xs font-bold text-center no-underline"
          >
            Lapor Harga / Stok
          </Link>
          <button
            type="button"
            onClick={handleAskAi}
            className="market-btn-primary flex-1 py-2.5 text-xs font-bold cursor-pointer"
          >
            Tanya PUNTEN
          </button>
        </div>
      </div>
    </div>
  );
}
