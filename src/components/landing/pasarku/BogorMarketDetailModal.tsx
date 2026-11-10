'use client';

import { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  ChatCircleDots,
  CubeFocus,
  MapPin,
  Storefront,
  X,
} from '@phosphor-icons/react';
import type { BogorMarket, MarketTier } from '@/lib/data/bogor-markets';
import { useAssistant } from '@/lib/store/assistant-store';

interface Props {
  market: BogorMarket | null;
  markets: BogorMarket[];
  onClose: () => void;
  onSelectMarket: (marketId: string, shouldFly?: boolean) => void;
  onFocus3D: (marketId: string) => void;
}

const TIER_META: Record<MarketTier, { label: string; dotClass: string }> = {
  induk: { label: 'Pasar Induk', dotClass: 'bg-[var(--accent-chili)]' },
  sentra: { label: 'Pasar Sentra', dotClass: 'bg-[var(--earth-ochre)]' },
  rakyat: { label: 'Pasar Rakyat', dotClass: 'bg-[var(--forest-ink)]' },
};

export function BogorMarketDetailModal({
  market,
  markets,
  onClose,
  onSelectMarket,
  onFocus3D,
}: Props) {
  const { openAssistant } = useAssistant();

  const currentIdx = market ? markets.findIndex((m) => m.id === market.id) : -1;
  const hasMultiple = markets.length > 1 && currentIdx !== -1;

  useEffect(() => {
    if (!market) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (!hasMultiple) return;
      if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIdx - 1 + markets.length) % markets.length;
        onSelectMarket(markets[prevIdx].id, true);
      } else if (e.key === 'ArrowRight') {
        const nextIdx = (currentIdx + 1) % markets.length;
        onSelectMarket(markets[nextIdx].id, true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [market, hasMultiple, currentIdx, markets, onClose, onSelectMarket]);

  if (!market) return null;

  const tierInfo = TIER_META[market.tier];

  const handleStep = (delta: -1 | 1) => {
    if (!hasMultiple) return;
    const targetIdx = (currentIdx + delta + markets.length) % markets.length;
    onSelectMarket(markets[targetIdx].id, true);
  };

  const handleAskPunten = () => {
    const prompt = `Bandingkan harga komoditas pokok serta kondisi acuan di ${market.name} (${market.area}, Kota Bogor) dari Bapanas, PIHPS BI, Perumda PPJ, dan laporan warga.`;
    onClose();
    openAssistant(prompt);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bogorMarketModalTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-[#0A120E]/65 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl market-card p-5 sm:p-6 z-10 max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-start justify-between gap-3 pb-4 border-b-2 border-[var(--border-ink)]">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#EEF773] text-[#132E20] border border-[#132E20] text-[11px] font-bold tracking-wide">
                {market.code} &bull; {market.area.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-ink)] text-[11px] font-bold">
                <span className={`w-2 h-2 rounded-xs ${tierInfo.dotClass}`} aria-hidden="true" />
                <span>{tierInfo.label}</span>
              </span>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-chili)]">
              {market.highlight}
            </div>

            <h3
              id="bogorMarketModalTitle"
              className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-snug"
            >
              {market.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup rincian pasar"
            title="Tutup (Esc)"
            className="market-btn-secondary w-10 h-10 p-0 inline-flex items-center justify-center shrink-0"
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className="rounded-[14px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] p-4 sm:p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--forest-surface)] border border-[var(--border-ink)] flex items-center justify-center shrink-0 mt-0.5 text-[var(--forest-ink)]">
              <MapPin size={16} weight="bold" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Lokasi Unit Pasar
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed mt-0.5">
                {market.address}
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--ochre-surface)] border border-[var(--border-ink)] flex items-center justify-center shrink-0 mt-0.5 text-[var(--earth-ochre)]">
              <Storefront size={16} weight="bold" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Profil &amp; Kapasitas Pasar
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-0.5">
                {market.details}
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-3.5 space-y-2 text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[var(--text-muted)] font-medium shrink-0">Pengelola Resmi</span>
              <span className="ledger-leader" />
              <span className="font-bold text-[var(--text-primary)] text-right">
                Perumda Pasar Pakuan Jaya
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[var(--text-muted)] font-medium shrink-0">Koordinat Peta 3D</span>
              <span className="ledger-leader" />
              <span className="font-mono-num font-bold text-[var(--forest-ink)] text-right">
                {market.lat.toFixed(5)}, {market.lng.toFixed(5)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleAskPunten}
            className="market-btn-primary flex-1 min-h-[44px] px-4 py-2.5 text-xs sm:text-sm inline-flex items-center justify-center gap-2"
          >
            <ChatCircleDots size={16} weight="bold" aria-hidden="true" />
            <span>Tanya PUNTEN</span>
          </button>

          <button
            type="button"
            onClick={() => onFocus3D(market.id)}
            className="market-btn-secondary min-h-[44px] px-3.5 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5"
          >
            <CubeFocus size={15} weight="bold" aria-hidden="true" />
            <span>Fokus 3D</span>
          </button>

          <a
            href={market.url}
            target="_blank"
            rel="noopener noreferrer"
            className="market-btn-secondary min-h-[44px] px-3.5 py-2.5 text-xs font-bold text-[var(--accent-chili)] inline-flex items-center justify-center gap-1.5 no-underline"
          >
            <span>Info Resmi PPJ</span>
            <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
          </a>
        </div>

        {hasMultiple && (
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)] text-xs">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              className="market-btn-secondary min-h-[38px] px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={13} weight="bold" aria-hidden="true" />
              <span>Unit Sebelumnya</span>
            </button>

            <span className="font-mono-num font-bold text-[var(--text-muted)]">
              {currentIdx + 1} / {markets.length}
            </span>

            <button
              type="button"
              onClick={() => handleStep(1)}
              className="market-btn-secondary min-h-[38px] px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Unit Berikutnya</span>
              <ArrowRight size={13} weight="bold" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
