'use client';

import { useState, useMemo } from 'react';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';

const CHART_CATEGORIES = [
  'SAYURAN',
  'CABAI',
  'BERAS & POKOK',
  'BAWANG',
  'DAGING & TELUR',
  'MINYAK & GULA',
  'IKAN SEGAR',
] as const;

export function PasarKuAnalitikSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('SAYURAN');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const liveCommodities = useLiveBogorCommodities();

  const items = useMemo(() => {
    return liveCommodities
      .filter((c) => c.category === selectedCategory || c.subCategory === selectedCategory)
      .sort((a, b) => b.price - a.price);
  }, [selectedCategory, liveCommodities]);

  const highest = items[0];
  const lowest = items[items.length - 1];
  const avg = useMemo(() => {
    if (!items.length) return 0;
    const sum = items.reduce((acc, c) => acc + c.price, 0);
    return Math.round(sum / items.length);
  }, [items]);

  const maxPrice = highest ? highest.price * 1.15 : 100000;

  return (
    <section id="analitikSection" className="border-b-2 border-[var(--border-ink)] py-12 bg-[var(--bg-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-card)] text-[var(--accent-chili)] mb-2">
              ANALITIK HARGA PASAR
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Grafik Komparasi Kategori
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="catSelect" className="text-xs font-bold text-[var(--text-primary)] whitespace-nowrap">
              Pilih Kategori:
            </label>
            <select
              id="catSelect"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
            >
              {CHART_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            <div className="market-card p-4 flex-1 flex flex-col justify-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Harga Tertinggi ({selectedCategory})</span>
              <div className="text-xl font-bold text-[var(--accent-chili)] font-mono-num mt-1">
                Rp {highest?.price.toLocaleString('id-ID') || 0}
              </div>
              <span className="text-xs text-[var(--text-secondary)] font-medium truncate mt-0.5">
                {highest?.name || '-'}
              </span>
            </div>

            <div className="market-card p-4 flex-1 flex flex-col justify-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Harga Terendah ({selectedCategory})</span>
              <div className="text-xl font-bold text-[#245034] font-mono-num mt-1">
                Rp {lowest?.price.toLocaleString('id-ID') || 0}
              </div>
              <span className="text-xs text-[var(--text-secondary)] font-medium truncate mt-0.5">
                {lowest?.name || '-'}
              </span>
            </div>

            <div className="market-card p-4 flex-1 flex flex-col justify-center">
              <span className="text-xs font-bold text-[var(--text-muted)]">Rata-Rata Kategori</span>
              <div className="text-xl font-bold text-[var(--text-primary)] font-mono-num mt-1">
                Rp {avg.toLocaleString('id-ID')}
              </div>
              <span className="text-xs text-[var(--text-muted)] mt-0.5">
                Standar acuan komparasi
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 market-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] mb-4">
              <span>Bilah Harga per Komoditas (Rp)</span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent-chili)]" />
                  <span>Tertinggi</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--forest-ink)]" />
                  <span>Komoditas Lain</span>
                </span>
              </div>
            </div>

            <div className="h-64 flex items-end gap-2 pt-6 pb-2 px-2 overflow-x-auto relative">

              {maxPrice > 0 && (
                <div
                  className="absolute left-0 right-0 border-b-2 border-dashed border-[var(--wave-line-gold)] pointer-events-none z-10"
                  style={{ bottom: `${(avg / maxPrice) * 100}%` }}
                >
                  <span className="absolute right-2 -top-5 text-[10px] font-bold text-[var(--text-primary)] bg-[var(--bg-muted)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                    Rerata: Rp {avg.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {items.map((item, idx) => {
                const heightPct = Math.max(8, Math.min(100, Math.round((item.price / maxPrice) * 100)));
                const isTop = idx === 0;
                const isHovered = hoveredIdx === idx;

                return (
                  <div
                    key={item.id}
                    className="flex-1 min-w-[36px] max-w-[64px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {isHovered && (
                      <div className="absolute -top-12 z-20 px-2 py-1 rounded bg-[#132E20] text-[#F9F3EE] text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none">
                        <div>{item.name}</div>
                        <div>Rp {item.price.toLocaleString('id-ID')}</div>
                      </div>
                    )}

                    <div
                      className={`w-full rounded-t-md transition-all duration-300 border-2 border-[var(--border-ink)] ${
                        isTop
                          ? 'bg-[var(--accent-chili)]'
                          : 'bg-[var(--forest-ink)]'
                      } ${isHovered ? 'brightness-110 -translate-y-1' : ''}`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-bold text-[var(--text-primary)] mt-1.5 truncate max-w-full text-center">
                      {item.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-[var(--text-muted)] text-right mt-2 italic">
              *Tinggi bilah proporsional terhadap harga tertinggi dalam kelompok {selectedCategory}.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
