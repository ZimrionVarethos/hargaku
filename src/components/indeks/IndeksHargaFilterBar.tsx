'use client';

import type { RefObject } from 'react';
import { CaretDown, MagnifyingGlass, SquaresFour, Table, X } from '@phosphor-icons/react';
import {
  INDEKS_CATEGORY_TABS,
  QUICK_SEARCH_KEYWORDS,
  type IndeksCategoryFilter,
  type IndeksSortOption,
} from './indeks-harga-types';

interface Props {
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: IndeksCategoryFilter;
  onCategoryChange: (cat: IndeksCategoryFilter) => void;
  categoryCounts: Record<IndeksCategoryFilter, number>;
  selectedSort: IndeksSortOption;
  onSortChange: (sort: IndeksSortOption) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  filteredCount: number;
  totalCount: number;
}

export function IndeksHargaFilterBar({
  searchInputRef,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  selectedSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  filteredCount,
  totalCount,
}: Props) {
  return (
    <div className="market-card p-4 sm:p-5 bg-[var(--bg-card)] space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-6 relative">
          <MagnifyingGlass
            size={16}
            weight="bold"
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            ref={searchInputRef}
            id="indeksSearchInput"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari pangan apa? Misal: beras, cabai rawit, bawang, telur, ikan..."
            aria-label="Cari bahan pangan di indeks harga"
            className="w-full min-h-[42px] pl-10 pr-9 py-2 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[13px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                searchInputRef.current?.focus();
              }}
              aria-label="Hapus kata kunci pencarian"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
            >
              <X size={14} weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="lg:col-span-3 relative">
          <select
            aria-label="Urutkan daftar indeks harga"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as IndeksSortOption)}
            className="w-full appearance-none min-h-[42px] pl-3.5 pr-9 py-2 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[12px] font-bold text-[var(--text-primary)] shadow-[var(--shadow-hard-sm)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)] cursor-pointer"
          >
            <option value="NO_ASC">Urutan Papan (#01 - #59)</option>
            <option value="PRICE_ASC">Harga Termurah dulu</option>
            <option value="PRICE_DESC">Harga Termahal dulu</option>
            <option value="DIFF_DESC">Selisih HAP Tertinggi</option>
            <option value="NAME_ASC">Nama A - Z</option>
          </select>
          <CaretDown
            size={14}
            weight="bold"
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] pointer-events-none"
          />
        </div>

        <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-2">
          <span className="text-[11px] font-bold text-[var(--text-muted)] font-mono-num lg:hidden">
            {filteredCount} / {totalCount} item
          </span>
          <div className="inline-flex rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[var(--accent-chili)] text-white'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <Table size={14} weight="bold" aria-hidden="true" />
              <span>Tabel Papan</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[var(--accent-chili)] text-white'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <SquaresFour size={14} weight="bold" aria-hidden="true" />
              <span>Mode Kartu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="font-bold text-[var(--text-muted)] mr-1">Cari cepat:</span>
        {QUICK_SEARCH_KEYWORDS.map((kw) => {
          const isCurrent = searchQuery.trim().toLowerCase() === kw.toLowerCase();
          return (
            <button
              key={kw}
              type="button"
              onClick={() => onSearchChange(isCurrent ? '' : kw)}
              className={`px-2.5 py-1 rounded-full font-bold border transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]'
                  : 'bg-[var(--bg-paper)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-ink)] hover:text-[var(--text-primary)]'
              }`}
            >
              {kw}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {INDEKS_CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            const count = categoryCounts[tab.id] || 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onCategoryChange(tab.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent-chili)] text-white border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)]'
                    : 'bg-[var(--bg-paper)] text-[var(--text-primary)] border-[var(--border-ink)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <span className="hidden lg:inline-block text-[11px] font-bold text-[var(--text-muted)] font-mono-num whitespace-nowrap shrink-0">
          Menampilkan {filteredCount} dari {totalCount} pangan
        </span>
      </div>
    </div>
  );
}

