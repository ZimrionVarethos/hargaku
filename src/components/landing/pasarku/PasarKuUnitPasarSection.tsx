'use client';

import React, { useState, useMemo, useRef } from 'react';
import { MapPin } from '@phosphor-icons/react';
import { BOGOR_MARKETS } from '@/lib/data/bogor-markets';
import { Bogor3DMapCanvas } from './Bogor3DMapCanvas';
import { BogorMarketDetailModal } from './BogorMarketDetailModal';

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
  const [modalMarketId, setModalMarketId] = useState<string | null>(null);
  const [flyRequestSeq, setFlyRequestSeq] = useState<number>(0);
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const visibleMarkets = useMemo(() => {
    if (selectedArea === 'SEMUA') return BOGOR_MARKETS;
    return BOGOR_MARKETS.filter((m) => m.area === selectedArea);
  }, [selectedArea]);

  const modalMarket = useMemo(() => {
    if (!modalMarketId) return null;
    return BOGOR_MARKETS.find((m) => m.id === modalMarketId) || null;
  }, [modalMarketId]);

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

  const handleOpenMarketPopup = (marketId: string) => {
    setActiveMarketId(marketId);
    setFlyRequestSeq((s) => s + 1);
    setModalMarketId(marketId);
  };

  return (
    <section
      id="unitPasarSection"
      className="py-12 border-b-2 border-[var(--border-ink)] bg-[var(--bg-paper)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-muted)] text-[var(--accent-chili)] mb-2">
              PETA 3D &amp; JARINGAN DISTRIBUSI RESMI
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Peta 3D 13 Unit Pasar Rakyat
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Klik langsung pin unit atau bangunan pasar 3D pada peta untuk menerbangkan kamera sekaligus membuka popup rincian lengkap tiap pasar Perumda PPJ Kota Bogor.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
              className="px-3 py-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] focus:outline-none min-h-[40px]"
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
            onOpenMarket={handleOpenMarketPopup}
          />
        </div>

        {/* Compact Single-Row Unit Quick Jump Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MapPin size={14} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />
              <span>Indeks Cepat ({visibleMarkets.length} Unit): klik untuk buka popup detail pasar</span>
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
            {visibleMarkets.map((market) => {
              const isSelected = market.id === activeMarketId;
              return (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => handleOpenMarketPopup(market.id)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl border-2 border-[var(--border-ink)] text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-[#EEF773] text-[#132E20] shadow-[var(--shadow-hard-sm)]'
                      : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono-num ${
                      isSelected
                        ? 'bg-[#132E20] text-[#EEF773]'
                        : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {market.code.replace('UNIT ', '#')}
                  </span>
                  <span>{market.shortName.replace('Pasar ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BogorMarketDetailModal
        market={modalMarket}
        markets={visibleMarkets}
        onClose={() => setModalMarketId(null)}
        onSelectMarket={(id, fly) => {
          setActiveMarketId(id);
          setModalMarketId(id);
          if (fly) setFlyRequestSeq((s) => s + 1);
        }}
        onFocus3D={(id) => {
          setModalMarketId(null);
          handleSelectMarket(id, true, true);
        }}
      />
    </section>
  );
}
