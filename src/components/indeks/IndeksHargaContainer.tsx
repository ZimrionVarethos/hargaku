'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { useRegion } from '@/lib/store/region-store';
import { useAssistant } from '@/lib/store/assistant-store';
import { PasarKuCommodityModal } from '@/components/landing/pasarku/PasarKuCommodityModal';
import {
  INDEKS_CATEGORY_TABS,
  buildIndeksCommodityRows,
  matchesIndeksCategory,
  matchesIndeksSearch,
  type IndeksCategoryFilter,
  type IndeksCommodityRow,
  type IndeksSortOption,
} from './indeks-harga-types';
import { IndeksHargaHeader } from './IndeksHargaHeader';
import { IndeksHargaFilterBar } from './IndeksHargaFilterBar';
import { IndeksHargaTable } from './IndeksHargaTable';
import { IndeksHargaCards } from './IndeksHargaCards';

export function IndeksHargaContainer() {
  const searchParams = useSearchParams();
  const focusParam = searchParams.get('focus');
  const queryParam = searchParams.get('q') || '';

  const liveBogorCommodities = useLiveBogorCommodities();
  const { commodities: catalogCommodities } = useLiveCatalog();
  const { selectedRegion, calculateRegionalPrice } = useRegion();
  const { openAssistant } = useAssistant();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<IndeksCategoryFilter>('ALL');
  const [selectedSort, setSelectedSort] = useState<IndeksSortOption>('NO_ASC');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedModalCommodity, setSelectedModalCommodity] = useState<BogorCommodity | null>(null);

  useEffect(() => {
    if (focusParam === 'search' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [focusParam]);

  const allRows = useMemo(
    () =>
      buildIndeksCommodityRows({
        bogorCommodities: liveBogorCommodities,
        catalogCommodities,
        calculateRegionalPrice,
      }),
    [liveBogorCommodities, catalogCommodities, calculateRegionalPrice]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<IndeksCategoryFilter, number> = {
      ALL: 0,
      BERAS_POKOK: 0,
      CABAI_BAWANG: 0,
      SAYURAN: 0,
      DAGING_TELUR: 0,
      MINYAK_GULA: 0,
      IKAN_BUAH: 0,
    };
    const searchMatched = allRows.filter((row) => matchesIndeksSearch(row, searchQuery));
    for (const tab of INDEKS_CATEGORY_TABS) {
      counts[tab.id] = searchMatched.filter((row) => matchesIndeksCategory(row, tab.id)).length;
    }
    return counts;
  }, [allRows, searchQuery]);

  const filteredRows = useMemo(() => {
    const list = allRows.filter(
      (row) => matchesIndeksSearch(row, searchQuery) && matchesIndeksCategory(row, selectedCategory)
    );
    switch (selectedSort) {
      case 'PRICE_ASC':
        return [...list].sort((a, b) => a.regionalPrice - b.regionalPrice);
      case 'PRICE_DESC':
        return [...list].sort((a, b) => b.regionalPrice - a.regionalPrice);
      case 'NAME_ASC':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'DIFF_DESC':
        return [...list].sort((a, b) => (b.diffVsHapPct ?? -999) - (a.diffVsHapPct ?? -999));
      default:
        return [...list].sort((a, b) => a.no - b.no);
    }
  }, [allRows, searchQuery, selectedCategory, selectedSort]);

  const handleAskPunten = (row: IndeksCommodityRow) => {
    const hapInfo = row.nationalRef
      ? ` vs Acuan Nasional HAP/HET Rp ${row.nationalRef.toLocaleString('id-ID')}/${row.unit}`
      : '';
    openAssistant(
      `Bandingkan harga ${row.name} di ${selectedRegion.name} (Rp ${row.regionalPrice.toLocaleString('id-ID')}/${row.unit})${hapInfo}, serta laporan warga terkini di sekitar pasar.`
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <IndeksHargaHeader
        regionName={selectedRegion.name}
        totalCount={allRows.length}
        rows={allRows}
      />

      <IndeksHargaFilterBar
        searchInputRef={searchInputRef}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryCounts={categoryCounts}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filteredCount={filteredRows.length}
        totalCount={allRows.length}
      />

      {filteredRows.length === 0 ? (
        <div className="market-card p-10 text-center bg-[var(--bg-card)] space-y-2">
          <p className="text-[15px] font-bold text-[var(--text-primary)]">
            Tidak ditemukan pangan untuk pencarian &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Coba kata kunci umum seperti beras, cabai, bawang, minyak, telur, daging, atau ikan.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="market-btn-primary mt-2 px-4 py-2 text-xs font-bold cursor-pointer"
          >
            Tampilkan Semua Pangan
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <IndeksHargaCards
          rows={filteredRows}
          regionName={selectedRegion.name}
          onSelectCommodity={setSelectedModalCommodity}
          onAskPunten={handleAskPunten}
        />
      ) : (
        <IndeksHargaTable
          rows={filteredRows}
          regionName={selectedRegion.name}
          onSelectCommodity={setSelectedModalCommodity}
          onAskPunten={handleAskPunten}
        />
      )}

      <PasarKuCommodityModal
        item={selectedModalCommodity}
        onClose={() => setSelectedModalCommodity(null)}
      />
    </div>
  );
}

