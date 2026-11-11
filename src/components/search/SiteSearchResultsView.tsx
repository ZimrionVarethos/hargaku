'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatCircleDots, MagnifyingGlass, X } from '@phosphor-icons/react';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { useRegion } from '@/lib/store/region-store';
import { useAssistant } from '@/lib/store/assistant-store';
import { sanitizeSearchQuery } from '@/lib/search/search-security';
import {
  searchSiteContent,
  type SiteSearchFilter,
  type SiteSearchResult,
} from '@/lib/search/site-search';
import { mergeSearchMarkets } from '@/lib/search/site-search-helpers';
import { fetchSiteSearch } from '@/lib/api/search.api';
import { SiteSearchResultCard } from './SiteSearchResultCard';

const CATEGORY_TABS: Array<{ id: SiteSearchFilter; label: string }> = [
  { id: 'ALL', label: 'Semua' },
  { id: 'COMMODITY', label: 'Komoditas' },
  { id: 'MARKET', label: 'Pasar Rakyat' },
  { id: 'REGION', label: 'Wilayah' },
  { id: 'PAGE', label: 'Halaman & Panduan' },
];

const SUGGESTED_STARTERS = [
  'Cabai Rawit',
  'Beras Medium',
  'Bayam',
  'Dekat Stasiun',
  'Cek Harga',
  'Lapor Kelangkaan',
  'Jawa Barat',
];

export function SiteSearchResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const { selectedRegion, allRegions, setSelectedRegion } = useRegion();
  const { commodities: liveCatalog, markets: liveMarkets } = useLiveCatalog();
  const bogorCommodities = useLiveBogorCommodities();
  const { openAssistant } = useAssistant();

  const [inputQuery, setInputQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState<SiteSearchFilter>('ALL');
  const [remoteResult, setRemoteResult] = useState<SiteSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputQuery(urlQuery);
  }, [urlQuery]);

  const activeSanitized = useMemo(() => sanitizeSearchQuery(urlQuery), [urlQuery]);

  const mergedMarkets = useMemo(() => mergeSearchMarkets(liveMarkets), [liveMarkets]);

  const localResult = useMemo(
    () =>
      searchSiteContent({
        query: activeSanitized,
        category: 'ALL',
        region: selectedRegion,
        regions: allRegions,
        bogorCommodities,
        catalogCommodities: liveCatalog,
        markets: mergedMarkets,
        limit: 60,
      }),
    [activeSanitized, selectedRegion, allRegions, bogorCommodities, liveCatalog, mergedMarkets]
  );

  useEffect(() => {
    if (!activeSanitized) {
      setRemoteResult(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    void fetchSiteSearch({
      query: activeSanitized,
      category: 'ALL',
      region: selectedRegion,
      catalogCommodities: liveCatalog,
      markets: mergedMarkets,
      limit: 60,
      signal: controller.signal,
    })
      .then((res) => {
        if (!controller.signal.aborted) {
          setRemoteResult(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [activeSanitized, selectedRegion, liveCatalog, mergedMarkets]);

  const activeResult =
    remoteResult && remoteResult.sanitizedQuery === activeSanitized ? remoteResult : localResult;

  const visibleItems = useMemo(() => {
    if (selectedCategory === 'ALL') return activeResult.items;
    return activeResult.items.filter((i) => i.kind === selectedCategory);
  }, [activeResult.items, selectedCategory]);

  const submitNewSearch = (nextRaw: string) => {
    const clean = sanitizeSearchQuery(nextRaw);
    setInputQuery(clean);
    router.replace(clean ? `/cari?q=${encodeURIComponent(clean)}` : '/cari');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitNewSearch(inputQuery);
  };

  return (
    <div className="space-y-6">
      <div className="market-card p-5 sm:p-6 bg-[var(--bg-card)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[var(--border-ink)]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Pencarian Seluruh Situs PasarKu
            </h1>
            <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] mt-0.5">
              Temukan harga pangan, lokasi pasar rakyat, cakupan wilayah, serta layanan PasarKu di{' '}
              <span className="font-bold text-[var(--forest-ink)]">{selectedRegion.name}</span>.
            </p>
          </div>
          {activeSanitized && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--border-ink)] font-mono-num w-fit shrink-0">
              {activeResult.total} Hasil
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={16}
              weight="bold"
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
            <input
              type="text"
              maxLength={80}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ketik komoditas, nama pasar, wilayah, atau fitur (misal: cabai, stasiun, lapor)..."
              aria-label="Kata kunci pencarian situs"
              className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => submitNewSearch('')}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                <X size={14} weight="bold" aria-hidden="true" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="market-btn-primary min-h-[44px] px-5 text-xs font-bold inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <MagnifyingGlass size={15} weight="bold" aria-hidden="true" />
            <span>Cari</span>
          </button>
        </form>

        {activeSanitized && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {CATEGORY_TABS.map((tab) => {
              const active = selectedCategory === tab.id;
              const count = activeResult.counts[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-chili)] text-white border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)]'
                      : 'bg-[var(--bg-paper)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--border-ink)]'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
            {isLoading && (
              <span className="text-[11px] font-bold text-[var(--text-muted)] ml-auto">
                Menyinkronkan data...
              </span>
            )}
          </div>
        )}
      </div>

      {!activeSanitized ? (
        <div className="market-card p-6 sm:p-8 bg-[var(--bg-card)] space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Mulai Jelajahi Informasi PasarKu
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Pilih topik populer di bawah atau ketik kata kunci barang, pasar rakyat, wilayah Indonesia, maupun panduan aplikasi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_STARTERS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => submitNewSearch(tag)}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-paper)] hover:bg-[var(--bg-muted)] border-2 border-[var(--border-ink)] text-xs font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="market-card p-8 sm:p-10 bg-[var(--bg-card)] text-center space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Tidak ditemukan hasil untuk &ldquo;{activeSanitized}&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            Coba kata kunci lebih umum seperti nama bahan pokok (beras, cabai, bawang, telur, bayam), nama pasar (Kebon Kembang, Merdeka), atau tanyakan langsung ke asisten PUNTEN AI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className="market-btn-secondary px-4 py-2 text-xs font-bold cursor-pointer"
            >
              Reset Filter Kategori
            </button>
            <button
              type="button"
              onClick={() => openAssistant(`Bantu saya cari informasi tentang ${activeSanitized} di ${selectedRegion.name}.`)}
              className="market-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ChatCircleDots size={15} weight="bold" aria-hidden="true" />
              <span>Tanyakan ke PUNTEN AI</span>
            </button>
            <Link
              href="/indeks-harga"
              className="market-btn-secondary px-4 py-2 text-xs font-bold no-underline"
            >
              Buka Indeks 53+ Pangan
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleItems.map((item) => (
            <SiteSearchResultCard
              key={item.id}
              item={item}
              activeRegion={selectedRegion}
              allRegions={allRegions}
              onActivateRegion={setSelectedRegion}
              onAskPunten={openAssistant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
