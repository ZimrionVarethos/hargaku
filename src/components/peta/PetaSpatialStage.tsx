'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  NavigationArrow,
  ArrowSquareOut,
} from '@phosphor-icons/react';
import { PetaMarketPrice } from './peta-data';
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
}

export function PetaSpatialStage({
  markets,
  selectedMarketId,
  onSelectMarket,
  commoditySlug,
}: Props) {
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

  const mapCenter: [number, number] = selectedMarket && selectedMarket.latitude
    ? [selectedMarket.latitude, selectedMarket.longitude]
    : markets[0] && markets[0].latitude
    ? [markets[0].latitude, markets[0].longitude]
    : [-6.208763, 106.845599];

  return (
    <div className="relative w-full rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] overflow-hidden min-h-[560px] sm:min-h-[620px] flex flex-col justify-between p-3.5 sm:p-5 shadow-[var(--shadow-hard)]">
      {/* Interactive Leaflet Map Canvas (Full Stage Background) */}
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

      {/* Top Floating Control Bar: Legend & Active View Mode */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-card)]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[var(--border-ink)] shadow-sm max-w-fit">
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
          <span className="font-bold text-[var(--text-primary)]">Pantauan Spasial:</span>
          <span>Titik Pasar &amp; Lapak Terpetakan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[var(--text-muted)]">
            Indikator:
          </span>
          <span className="text-[11px] font-bold text-[#245034] bg-[#E2EFE6] px-2 py-0.5 rounded-full border border-[#245034]/30">
            Harga Terkini Lapak
          </span>
        </div>
      </div>

      {/* Spacer to let user interact with map in center */}
      <div className="pointer-events-none flex-1 min-h-[180px]" />

      {/* Bottom Floating Market Card */}
      {selectedMarket && (
        <div className="relative z-10 market-card p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
                {selectedMarket.district}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
              <span className="text-[12px] text-[var(--text-secondary)]">{selectedMarket.address}</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
                {selectedMarket.name}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[22px] sm:text-[26px] font-extrabold text-[var(--forest-ink)] tabular-nums tracking-tight font-mono-num">
                  {formatRupiah(selectedMarket.price)}
                </span>
                <span className="text-[13px] text-[var(--text-muted)]">/ kg</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {selectedMarket.status === 'cheaper' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E2EFE6] text-[#245034] border border-[#245034]">
                  Termurah {selectedMarket.diffPercent}% vs Rerata Wilayah
                </span>
              )}
              {selectedMarket.status === 'average' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                  Wajar ({selectedMarket.diffPercent > 0 ? `+${selectedMarket.diffPercent}%` : `${selectedMarket.diffPercent}%`})
                </span>
              )}
              {selectedMarket.status === 'expensive' && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FBE9E6] text-[var(--accent-chili)] border border-[var(--accent-chili)]">
                  Tinggi (+{selectedMarket.diffPercent}%)
                </span>
              )}
              <span className="text-[12px] text-[var(--text-secondary)]">
                Rerata: <strong className="text-[var(--text-primary)] font-bold">{formatRupiah(selectedMarket.regionalAvgPrice ?? selectedMarket.price)}</strong>
              </span>
              <span className="text-[12px] text-[var(--text-muted)]">
                &middot; {selectedMarket.reportsCount} Laporan Warga
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
            <a
              href={selectedMarket.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="market-btn-secondary py-2.5 px-4 text-[13px] font-bold flex items-center gap-2"
            >
              <NavigationArrow size={16} weight="bold" />
              <span>Rute Maps</span>
            </a>
            <Link
              href={`/komoditas/${commoditySlug}`}
              className="market-btn-primary py-2.5 px-4 text-[13px] font-bold flex items-center gap-1.5"
            >
              <span>Detail Harga</span>
              <ArrowSquareOut size={16} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
