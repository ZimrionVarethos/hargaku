'use client';

import { useState, useMemo } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { type BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { AnalitikBarChart } from './AnalitikBarChart';

const CHART_CATEGORIES = [
  'SAYURAN',
  'CABAI',
  'BERAS & POKOK',
  'BAWANG',
  'DAGING & TELUR',
  'MINYAK & GULA',
  'IKAN SEGAR',
  'BUAH',
] as const;

function matchesChartCategory(item: BogorCommodity, category: string): boolean {
  if (item.category === category || item.subCategory === category) return true;
  const lower = item.name.toLowerCase();
  if (category === 'CABAI') return /\bcabe\b/.test(lower) || lower.includes('cabai');
  if (category === 'BAWANG') return lower.includes('bawang');
  return false;
}

export function PasarKuAnalitikSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('SAYURAN');
  const liveCommodities = useLiveBogorCommodities();

  const items = useMemo(() => {
    return liveCommodities
      .filter((c) => matchesChartCategory(c, selectedCategory))
      .sort((a, b) => b.price - a.price);
  }, [selectedCategory, liveCommodities]);

  const highest = items[0];
  const lowest = items[items.length - 1];
  const avg = useMemo(() => {
    if (!items.length) return 0;
    const sum = items.reduce((acc, c) => acc + c.price, 0);
    return Math.round(sum / items.length);
  }, [items]);

  const maxPrice = highest ? highest.price * 1.1 : 100000;

  return (
    <section id="analitikSection" className="scroll-mt-20 border-b-2 border-[var(--border-ink)] py-12 bg-[var(--bg-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Grafik Komparasi Kategori
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="catSelect" className="text-xs font-bold text-[var(--text-primary)] whitespace-nowrap">
              Pilih Kategori:
            </label>
            <div className="relative inline-flex">
              <select
                id="catSelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none min-h-[40px] pl-3.5 pr-9 py-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] shadow-[var(--shadow-hard-sm)] cursor-pointer transition-colors hover:bg-[var(--bg-paper)]"
              >
                {CHART_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <CaretDown
                size={14}
                weight="bold"
                aria-hidden="true"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] pointer-events-none"
              />
            </div>
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
              <div className="text-xl font-bold text-[var(--forest-ink)] font-mono-num mt-1">
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

          <AnalitikBarChart
            key={selectedCategory}
            items={items}
            selectedCategory={selectedCategory}
            avg={avg}
            maxPrice={maxPrice}
          />

        </div>
      </div>
    </section>
  );
}
