'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { useRegion } from '@/lib/store/region-store';
import { sanitizeSearchQuery } from '@/lib/search/search-security';
import { searchSiteContent, type SiteSearchItem } from '@/lib/search/site-search';
import { mergeSearchMarkets } from '@/lib/search/site-search-helpers';
import { fetchSiteSearch } from '@/lib/api/search.api';
import { GlobalSearchSuggestList } from './GlobalSearchSuggestList';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedRegion, allRegions, setSelectedRegion } = useRegion();
  const { commodities: liveCatalog, markets: liveMarkets } = useLiveCatalog();
  const bogorCommodities = useLiveBogorCommodities();

  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const [remoteResult, setRemoteResult] = useState<{
    queryKey: string;
    items: SiteSearchItem[];
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveIdx(-1);
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const sanitized = useMemo(() => sanitizeSearchQuery(query), [query]);

  const mergedMarkets = useMemo(() => mergeSearchMarkets(liveMarkets), [liveMarkets]);

  const instantResult = useMemo(
    () =>
      searchSiteContent({
        query: sanitized,
        category: 'ALL',
        region: selectedRegion,
        regions: allRegions,
        bogorCommodities,
        catalogCommodities: liveCatalog,
        markets: mergedMarkets,
        limit: 8,
      }),
    [sanitized, selectedRegion, allRegions, bogorCommodities, liveCatalog, mergedMarkets]
  );

  useEffect(() => {
    if (!isOpen || !sanitized) {
      setRemoteResult(null);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetchSiteSearch({
        query: sanitized,
        category: 'ALL',
        region: selectedRegion,
        catalogCommodities: liveCatalog,
        markets: mergedMarkets,
        limit: 8,
        signal: controller.signal,
      })
        .then((res) => {
          if (!controller.signal.aborted) {
            setRemoteResult({ queryKey: sanitized, items: res.items, total: res.total });
          }
        })
        .catch(() => {});
    }, 150);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, sanitized, selectedRegion, liveCatalog, mergedMarkets]);

  const activeItems =
    remoteResult && remoteResult.queryKey === sanitized && remoteResult.items.length > 0
      ? remoteResult.items.slice(0, 7)
      : instantResult.items.slice(0, 7);
  const totalCount =
    remoteResult && remoteResult.queryKey === sanitized
      ? Math.max(remoteResult.total, instantResult.total)
      : instantResult.total;

  const goToResultsPage = (targetQuery = sanitized) => {
    const clean = sanitizeSearchQuery(targetQuery);
    onClose();
    router.push(clean ? `/cari?q=${encodeURIComponent(clean)}` : '/cari');
  };

  const handleSelectItem = (item: SiteSearchItem) => {
    if (item.kind === 'REGION' && item.regionId) {
      const targetRegion = allRegions.find((r) => r.id === item.regionId);
      if (targetRegion) setSelectedRegion(targetRegion);
    }
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'ArrowDown' && activeItems.length > 0) {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1) % activeItems.length);
      return;
    }
    if (e.key === 'ArrowUp' && activeItems.length > 0) {
      e.preventDefault();
      setActiveIdx((prev) => (prev <= 0 ? activeItems.length - 1 : prev - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && activeItems[activeIdx]) {
        handleSelectItem(activeItems[activeIdx]);
      } else {
        goToResultsPage(sanitized);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian global PasarKu"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-[7vh] sm:pt-[11vh]"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="relative z-10 w-full max-w-2xl market-card bg-[var(--bg-card)] overflow-hidden">
        <div className="p-3 sm:p-4 bg-[var(--bg-paper)] border-b-2 border-[var(--border-ink)] space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                weight="bold"
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                ref={inputRef}
                id="globalSiteSearchInput"
                type="text"
                role="combobox"
                aria-expanded={Boolean(sanitized)}
                aria-controls="globalSiteSearchResults"
                aria-autocomplete="list"
                maxLength={80}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Cari barang, pasar, wilayah, cek harga, atau PUNTEN AI..."
                className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveIdx(-1);
                    inputRef.current?.focus();
                  }}
                  aria-label="Bersihkan kata kunci"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
                >
                  <X size={14} weight="bold" aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela pencarian"
              className="market-btn-secondary h-[44px] px-3 text-xs font-bold shrink-0 cursor-pointer"
            >
              Esc
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-secondary)]">
            <span>
              Cari lintas komoditas, pasar rakyat, wilayah {selectedRegion.name}, &amp; halaman.
            </span>
            <span className="hidden sm:inline font-mono-num text-[10px] px-2 py-0.5 rounded bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              Ctrl + K
            </span>
          </div>
        </div>

        <GlobalSearchSuggestList
          sanitized={sanitized}
          regionName={selectedRegion.name}
          activeItems={activeItems}
          totalCount={totalCount}
          activeIdx={activeIdx}
          onSelectQuery={(tag) => {
            setQuery(tag);
            setActiveIdx(-1);
            inputRef.current?.focus();
          }}
          onSelectItem={handleSelectItem}
          onViewAll={() => goToResultsPage(sanitized)}
        />
      </div>
    </div>
  );
}
