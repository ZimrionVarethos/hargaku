'use client';

import React, { useState, useMemo, useRef } from 'react';
import { CubeFocus } from '@phosphor-icons/react';
import { BOGOR_MARKETS } from '@/lib/data/bogor-markets';
import { Bogor3DMapCanvas } from './Bogor3DMapCanvas';

const MARKET_AREAS = [
  'SEMUA',
  'Bogor Tengah',
  'Bogor Barat',
  'Bogor Timur',
  'Bogor Selatan',
  'Bogor Utara',
  'Tanah Sareal',
] as const;

export function PasarKuUnitPasarSection() {
  const [selectedArea, setSelectedArea] = useState<string>('SEMUA');
  const [activeMarketId, setActiveMarketId] = useState<string>(BOGOR_MARKETS[0].id);
  const [flyRequestSeq, setFlyRequestSeq] = useState<number>(0);
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const visibleMarkets = useMemo(() => {
    if (selectedArea === 'SEMUA') return BOGOR_MARKETS;
    return BOGOR_MARKETS.filter((m) => m.area === selectedArea);
  }, [selectedArea]);

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    const matches = area === 'SEMUA' ? BOGOR_MARKETS : BOGOR_MARKETS.filter((m) => m.area === area);
    if (matches.length > 0) {
      setActiveMarketId(matches[0].id);
      setFlyRequestSeq((s) => s + 1);
    }
  };

  const handleSelectMarket = (marketId: string, shouldFly = true, scrollToMap = false) => {
    setActiveMarketId(marketId);
    if (shouldFly) {
      setFlyRequestSeq((s) => s + 1);
    }
    if (scrollToMap && mapWrapperRef.current) {
      mapWrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="unitPasarSection"
      className="py-12 border-b-2 border-[var(--border-ink)] bg-[var(--bg-paper)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-muted)] text-[var(--accent-chili)] mb-2">
              PETA 3D &amp; JARINGAN DISTRIBUSI RESMI
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Peta 3D &amp; Direktori 13 Unit Pasar Rakyat
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Visualisasi 3D bangunan pasar Perumda Pasar Pakuan Jaya Kota Bogor berbasis Mapbox &amp; lapisan arsitektur 3D. Klik unit di peta atau kartu untuk terbang ke lokasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="areaFilter"
              className="text-xs font-bold text-[var(--text-primary)] whitespace-nowrap"
            >
              Wilayah Kecamatan:
            </label>
            <select
              id="areaFilter"
              value={selectedArea}
              onChange={(e) => handleSelectArea(e.target.value)}
              className="px-3 py-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
            >
              {MARKET_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area === 'SEMUA' ? 'Semua Wilayah (13 Unit)' : area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive 3D Mapbox Stage */}
        <div ref={mapWrapperRef}>
          <Bogor3DMapCanvas
            allMarkets={BOGOR_MARKETS}
            visibleMarkets={visibleMarkets}
            activeMarketId={activeMarketId}
            flyRequestSeq={flyRequestSeq}
            onSelectMarket={(id, fly) => handleSelectMarket(id, fly, false)}
          />
        </div>

        {/* 3-Column Market Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleMarkets.map((market) => {
            const isSelected = market.id === activeMarketId;
            return (
              <div
                key={market.id}
                onClick={() => handleSelectMarket(market.id, true, true)}
                className={`market-card market-card-interactive p-5 flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[var(--forest-surface)] ring-2 ring-[var(--accent-chili)]'
                    : 'bg-[var(--bg-card)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border border-[var(--border-ink)] ${
                        isSelected
                          ? 'bg-[#EEF773] text-[#132E20]'
                          : 'bg-[var(--bg-muted)] text-[var(--text-primary)]'
                      }`}
                    >
                      {market.code} &bull; {market.area.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--accent-chili)]">
                      {market.highlight}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[var(--text-primary)] leading-tight mb-2">
                    {market.name}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
                    {market.address}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {market.details}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMarket(market.id, true, true);
                    }}
                    className="market-btn-secondary px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <CubeFocus size={13} weight="bold" />
                    <span>{isSelected ? 'Sedang Aktif 3D' : 'Lihat 3D'}</span>
                  </button>

                  <a
                    href={market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-[var(--accent-chili)] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Info Resmi</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
