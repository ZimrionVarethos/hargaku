'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  NavigationArrow,
  ArrowSquareOut,
  ChatCircleDots,
  Train,
  WarningCircle,
} from '@phosphor-icons/react';
import { PetaMarketPrice } from './peta-data';
import { useAssistant } from '@/lib/store/assistant-store';
import { formatRupiah } from '@/lib/utils';

const LeafletMarketMap = dynamic(
  () => import('@/components/common/LeafletMarketMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[460px] bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)] text-[13px] font-bold animate-pulse">
        Memuat Peta Spasial Pasar Tradisional...
      </div>
    ),
  }
);

interface Props {
  markets: PetaMarketPrice[];
  selectedMarketId: string;
  onSelectMarket: (id: string) => void;
  commodityName: string;
  commoditySlug: string;
  commodityUnit?: string;
}

export function PetaSpatialStage({
  markets,
  selectedMarketId,
  onSelectMarket,
  commoditySlug,
  commodityUnit = 'kg',
}: Props) {
  const { openAssistant } = useAssistant();
  const selectedMarket =
    markets.find((m) => m.marketId === selectedMarketId) || markets[0];

  const mapItems = markets.map((m) => ({
    id: m.marketId,
    name: m.name,
    shortName: m.shortName,
    latitude: m.latitude,
    longitude: m.longitude,
    priceText: formatRupiah(m.price),
    status: m.status,
    address: m.address,
  }));

  const mapCenter: [number, number] =
    selectedMarket && selectedMarket.latitude
      ? [selectedMarket.latitude, selectedMarket.longitude]
      : markets[0] && markets[0].latitude
      ? [markets[0].latitude, markets[0].longitude]
      : [-6.597147, 106.806039];

  const handleAskMarket = () => {
    if (!selectedMarket) return;
    openAssistant(
      `Saya ingin ke ${selectedMarket.name}. Menurut laporan warga dan pedagang, komoditas apa yang sedang mahal atau langka di pasar ini?`
    );
  };

  return (
    <div className="relative w-full rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] overflow-hidden min-h-[560px] sm:min-h-[620px] flex flex-col justify-between p-3.5 sm:p-5 shadow-[var(--shadow-hard)]">
      <div className="absolute inset-0 z-0">
        <LeafletMarketMap
          markets={mapItems}
          activeMarketId={selectedMarketId}
          onSelectMarket={onSelectMarket}
          center={mapCenter}
          zoom={13}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-card)]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[var(--border-ink)] shadow-sm max-w-fit">
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
          <span className="font-bold text-[var(--text-primary)]">Pantauan Spasial:</span>
          <span>Pasar &amp; Sinyal Laporan Setempat</span>
        </div>
        <span className="text-[11px] font-bold text-[var(--forest-ink)] bg-[var(--forest-surface)] px-2 py-0.5 rounded-full border border-[var(--border-ink)]">
          {markets.length} Unit Pasar
        </span>
      </div>

      <div className="pointer-events-none flex-1 min-h-[180px]" />

      {selectedMarket && (
        <div className="relative z-10 market-card p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
                {selectedMarket.district}
              </span>
              {selectedMarket.nearStation && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] text-[10px] font-bold">
                  <Train size={11} weight="bold" />
                  <span>{selectedMarket.landmarkNote || 'Dekat Stasiun'}</span>
                </span>
              )}
              {selectedMarket.alertHeadline && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[10px] font-bold">
                  <WarningCircle size={11} weight="bold" />
                  <span>{selectedMarket.alertHeadline}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
                {selectedMarket.name}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[22px] sm:text-[26px] font-extrabold text-[var(--forest-ink)] tabular-nums tracking-tight font-mono-num">
                  {formatRupiah(selectedMarket.price)}
                </span>
                <span className="text-[13px] text-[var(--text-muted)]">/ {commodityUnit}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {selectedMarket.status === 'cheaper' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]">
                  Termurah {selectedMarket.diffPercent}% vs Rerata
                </span>
              )}
              {selectedMarket.status === 'average' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                  Wajar ({selectedMarket.diffPercent > 0 ? `+${selectedMarket.diffPercent}%` : `${selectedMarket.diffPercent}%`})
                </span>
              )}
              {selectedMarket.status === 'expensive' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)]">
                  Tinggi (+{selectedMarket.diffPercent}%)
                </span>
              )}
              <span className="text-[12px] text-[var(--text-muted)]">
                &middot; {selectedMarket.reportsCount} Laporan Aktif
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={handleAskMarket}
              className="market-btn-secondary py-2 px-3 text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ChatCircleDots size={14} weight="bold" />
              <span>Tanya PUNTEN</span>
            </button>
            <a
              href={selectedMarket.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="market-btn-secondary py-2 px-3 text-[12px] font-bold inline-flex items-center gap-1.5"
            >
              <NavigationArrow size={14} weight="bold" />
              <span>Rute</span>
            </a>
            <Link
              href={`/cek-harga?market=${selectedMarket.marketId}&commodity=${commoditySlug}`}
              className="market-btn-primary py-2 px-3.5 text-[12px] font-bold inline-flex items-center gap-1.5 no-underline"
            >
              <span>Cek Harga</span>
              <ArrowSquareOut size={14} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
