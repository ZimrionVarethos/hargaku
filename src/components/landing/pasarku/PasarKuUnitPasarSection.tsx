'use client';

import React, { useState, useMemo } from 'react';
import { BOGOR_MARKETS } from '@/lib/data/bogor-markets';

const MARKET_AREAS = [
  'SEMUA',
  'Bogor Tengah',
  'Bogor Barat',
  'Bogor Selatan',
  'Bogor Utara',
  'Tanah Sareal',
] as const;

export function PasarKuUnitPasarSection() {
  const [selectedArea, setSelectedArea] = useState<string>('SEMUA');

  const visibleMarkets = useMemo(() => {
    if (selectedArea === 'SEMUA') return BOGOR_MARKETS;
    return BOGOR_MARKETS.filter((m) => m.area === selectedArea);
  }, [selectedArea]);

  return (
    <section id="unitPasarSection" className="py-12 border-b-2 border-[var(--border-ink)] bg-[var(--bg-paper)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-muted)] text-[var(--accent-chili)] mb-2">
              JARINGAN DISTRIBUSI PANGAN RESMI
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Direktori 13 Unit Pasar Rakyat
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Seluruh unit pasar tradisional binaan Perumda Pasar Pakuan Jaya di Kota Bogor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="areaFilter" className="text-xs font-bold text-[var(--text-primary)] whitespace-nowrap">
              Wilayah Kecamatan:
            </label>
            <select
              id="areaFilter"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
            >
              {MARKET_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area === 'SEMUA' ? 'Semua Wilayah' : area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleMarkets.map((market) => (
            <div
              key={market.id}
              className="market-card market-card-interactive p-5 flex flex-col justify-between bg-[var(--bg-card)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-ink)]">
                    {market.code} • {market.area.toUpperCase()}
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

              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                  Perumda Pakuan Jaya
                </span>
                <a
                  href={market.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[var(--accent-chili)] hover:underline inline-flex items-center gap-1"
                >
                  <span>Info Resmi</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

