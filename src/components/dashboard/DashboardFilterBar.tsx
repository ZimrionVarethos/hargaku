'use client';

import {
  MagnifyingGlass,
  Table,
  SquaresFour,
  CaretDown,
} from '@phosphor-icons/react';

export type DashboardCategoryFilter =
  | 'ALL'
  | 'BERAS'
  | 'DAGING_TELUR'
  | 'CABAI_BAWANG'
  | 'SAYURAN'
  | 'MINYAK_GULA';

export type DashboardSort =
  | 'CHANGE_DESC'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'NAME_ASC';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMarket: string;
  onMarketChange: (market: string) => void;
  selectedSort: DashboardSort;
  onSortChange: (sort: DashboardSort) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
  selectedCategory: DashboardCategoryFilter;
  onCategoryChange: (category: DashboardCategoryFilter) => void;
  totalCount: number;
  markets?: Array<{ id: string; name: string }>;
}

const CATEGORIES: Array<{ id: DashboardCategoryFilter; label: string }> = [
  { id: 'ALL', label: 'Semua (12)' },
  { id: 'BERAS', label: 'Beras' },
  { id: 'DAGING_TELUR', label: 'Protein & Daging' },
  { id: 'CABAI_BAWANG', label: 'Bumbu & Cabai' },
  { id: 'SAYURAN', label: 'Sayur Mayur' },
  { id: 'MINYAK_GULA', label: 'Minyak & Gula' },
];

export function DashboardFilterBar({
  searchQuery,
  onSearchChange,
  selectedMarket,
  onMarketChange,
  selectedSort,
  onSortChange,
  isLightMode,
  onToggleLightMode,
  selectedCategory,
  onCategoryChange,
  markets = [],
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari komoditas (cth: beras, telur, cabai)..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-chili)] shadow-xs transition-all"
          />
        </div>

        {/* Market Selector */}
        <div className="md:col-span-3 relative">
          <select
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-semibold shadow-xs focus:ring-2 focus:ring-[var(--accent-chili)] cursor-pointer"
          >
            <option value="ALL">
              Semua Pasar {markets.length > 0 ? `(${markets.length} Pasar)` : ''}
            </option>
            {markets.length > 0 ? (
              markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))
            ) : (
              <>
                <option value="kebon-kembang">Pasar Kebon Kembang</option>
                <option value="pasar-anyar">Pasar Anyar</option>
                <option value="sukasari">Pasar Sukasari</option>
                <option value="gunung-batu">Pasar Gunung Batu</option>
                <option value="jambu-dua">Pasar Jambu Dua</option>
              </>
            )}
          </select>
          <CaretDown
            size={13}
            weight="bold"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          />
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-2 relative">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as DashboardSort)}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-semibold shadow-xs focus:ring-2 focus:ring-[var(--accent-chili)] cursor-pointer"
          >
            <option value="CHANGE_DESC">Urutkan: Perubahan Terbesar</option>
            <option value="PRICE_ASC">Harga Terendah</option>
            <option value="PRICE_DESC">Harga Tertinggi</option>
            <option value="NAME_ASC">Nama A-Z</option>
          </select>
          <CaretDown
            size={13}
            weight="bold"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          />
        </div>

        {/* Light Mode / Table View Switch */}
        <div className="md:col-span-2 flex items-center justify-end">
          <button
            type="button"
            onClick={onToggleLightMode}
            className="market-btn-secondary inline-flex items-center gap-2 px-3 py-2 text-[12px] font-bold"
            title="Beralih ke format tabel hemat data"
          >
            {isLightMode ? (
              <>
                <SquaresFour size={14} weight="bold" />
                <span>Mode Kartu</span>
              </>
            ) : (
              <>
                <Table size={14} weight="bold" />
                <span>Mode Ringan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#A92717] text-white border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-ink)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
