'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowSquareOut,
  ChatCircleDots,
  Compass,
  CubeFocus,
  List,
  MapTrifold,
  NavigationArrow,
  Train,
  WarningCircle,
} from '@phosphor-icons/react';
import { PetaMarketPrice } from './peta-data';
import { useAssistant } from '@/lib/store/assistant-store';
import { formatRupiah } from '@/lib/utils';

const MapboxMarketMap = dynamic(() => import('./MapboxMarketMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[var(--bg-stage)] flex items-center justify-center text-[#F9F3EE] text-[13px] font-bold animate-pulse">
      Memuat Peta Spasial Mapbox 3D...
    </div>
  ),
});

interface Props {
  markets: PetaMarketPrice[];
  selectedMarketId: string;
  onSelectMarket: (id: string) => void;
  commodityName: string;
  commoditySlug: string;
  commodityUnit?: string;
  regionName: string;
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  onEnableLightMode: () => void;
  focusSeq: number;
  onRequestFocusSelected: () => void;
}

export function PetaSpatialStage({
  markets,
  selectedMarketId,
  onSelectMarket,
  commodityName,
  commoditySlug,
  commodityUnit = 'kg',
  regionName,
  isMenuOpen,
  onOpenMenu,
  onEnableLightMode,
  focusSeq,
  onRequestFocusSelected,
}: Props) {
  const { openAssistant } = useAssistant();
  const [orbitSeq, setOrbitSeq] = useState(0);
  const [resetSeq, setResetSeq] = useState(0);

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
    nearStation: m.nearStation,
  }));

  const handleAskMarket = () => {
    if (!selectedMarket) return;
    openAssistant(
      `Saya ingin ke ${selectedMarket.name}. Menurut laporan warga dan pedagang, komoditas apa yang sedang mahal atau langka di pasar ini?`
    );
  };

  return (
    <div className="relative w-full rounded-2xl bg-[var(--bg-stage)] border-2 border-[var(--border-ink)] overflow-hidden h-[calc(100dvh-84px)] min-h-[540px] sm:min-h-[600px] max-h-[900px] flex flex-col justify-between p-3 sm:p-4 shadow-[var(--shadow-hard)]">
      <div className="absolute inset-0 z-0">
        <MapboxMarketMap
          markets={mapItems}
          activeMarketId={selectedMarketId}
          onSelectMarket={onSelectMarket}
          onEnableLightMode={onEnableLightMode}
          focusSeq={focusSeq}
          orbitSeq={orbitSeq}
          resetSeq={resetSeq}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 pr-14 sm:pr-56">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-expanded={isMenuOpen}
            aria-controls="peta-hamburger-drawer"
            aria-label="Buka menu filter dan daftar pasar"
            className="pointer-events-auto market-btn-primary h-10 px-2.5 sm:px-3.5 text-[12px] font-bold inline-flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer"
          >
            <List size={17} weight="bold" aria-hidden="true" />
            <span className="sm:hidden">Menu</span>
            <span className="hidden sm:inline">Filter &amp; Pasar</span>
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            className="pointer-events-auto h-10 px-2 sm:px-3 rounded-[10px] bg-[var(--bg-card)]/95 backdrop-blur-md border-2 border-[var(--border-ink)] text-[11px] sm:text-[12px] text-[var(--text-primary)] font-semibold shadow-[var(--shadow-hard-sm)] inline-flex items-center gap-1.5 sm:gap-2 hover:bg-[var(--bg-muted)] transition-colors min-w-0 cursor-pointer"
          >
            <span className="truncate font-bold">{commodityName}</span>
            <span className="text-[var(--text-muted)] hidden md:inline">&middot;</span>
            <span className="text-[var(--text-secondary)] truncate hidden md:inline">
              {regionName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--border-ink)] shrink-0">
              {markets.length} Pasar
            </span>
          </button>
        </div>

        <div className="pointer-events-auto flex sm:hidden items-center gap-1.5 w-fit">
          <button
            type="button"
            onClick={() => setOrbitSeq((n) => n + 1)}
            className="market-btn-secondary h-8 px-2.5 text-[11px] font-bold inline-flex items-center gap-1"
            title="Putar sudut pandang 3D"
          >
            <Compass size={13} weight="bold" />
            <span>Putar 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setResetSeq((n) => n + 1)}
            className="market-btn-secondary h-8 px-2.5 text-[11px] font-bold inline-flex items-center gap-1"
          >
            <MapTrifold size={13} weight="bold" />
            <span>Semua</span>
          </button>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 absolute top-4 right-14 z-10 pointer-events-auto">
        <button
          type="button"
          onClick={() => setOrbitSeq((n) => n + 1)}
          className="market-btn-secondary h-9 px-3 text-[11px] font-bold inline-flex items-center gap-1.5"
          title="Putar sudut pandang 3D 45 derajat"
        >
          <Compass size={14} weight="bold" />
          <span>Putar 3D</span>
        </button>
        <button
          type="button"
          onClick={() => setResetSeq((n) => n + 1)}
          className="market-btn-secondary h-9 px-3 text-[11px] font-bold inline-flex items-center gap-1.5"
        >
          <MapTrifold size={14} weight="bold" />
          <span>Semua Pasar</span>
        </button>
      </div>

      <div className="pointer-events-none flex-1 min-h-[120px]" />

      {selectedMarket && (
        <div className="relative z-10 pointer-events-auto mb-6 sm:mb-7 market-card bg-[var(--bg-card)]/95 backdrop-blur-md p-3.5 sm:p-4 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full xl:max-w-[780px]">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
                {selectedMarket.district}
              </span>
              {selectedMarket.nearStation && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] text-[10px] font-bold">
                  <Train size={11} weight="bold" />
                  <span>{selectedMarket.landmarkNote || 'Dekat Stasiun'}</span>
                </span>
              )}
              {selectedMarket.alertHeadline && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--ochre-surface)] text-[var(--warning-ink)] border border-[var(--border-subtle)] text-[10px] font-bold">
                  <WarningCircle size={11} weight="bold" />
                  <span>{selectedMarket.alertHeadline}</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h2 className="text-[17px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
                {selectedMarket.name}
              </h2>
              <div className="flex items-center gap-1">
                <span className="text-[20px] sm:text-[23px] font-extrabold text-[var(--forest-ink)] tabular-nums tracking-tight font-mono-num">
                  {formatRupiah(selectedMarket.price)}
                </span>
                <span className="text-[12px] text-[var(--text-muted)]">/ {commodityUnit}</span>
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
              <span className="text-[11px] text-[var(--text-muted)]">
                &middot; {selectedMarket.reportsCount} Laporan Aktif
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onRequestFocusSelected}
              className="market-btn-secondary py-2 px-2.5 text-[11px] sm:text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CubeFocus size={14} weight="bold" />
              <span>Fokus</span>
            </button>
            <button
              type="button"
              onClick={handleAskMarket}
              className="market-btn-secondary py-2 px-2.5 text-[11px] sm:text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ChatCircleDots size={14} weight="bold" />
              <span>Tanya PUNTEN</span>
            </button>
            <a
              href={selectedMarket.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="market-btn-secondary py-2 px-2.5 text-[11px] sm:text-[12px] font-bold inline-flex items-center gap-1.5"
            >
              <NavigationArrow size={14} weight="bold" />
              <span>Rute</span>
            </a>
            <Link
              href={`/cek-harga?market=${selectedMarket.marketId}&commodity=${commoditySlug}`}
              className="market-btn-primary py-2 px-3 text-[11px] sm:text-[12px] font-bold inline-flex items-center gap-1.5 no-underline"
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
