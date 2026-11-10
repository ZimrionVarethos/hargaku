'use client';

import React, { useRef, useEffect } from 'react';
import type { AdminMarket } from '@/lib/types/admin';
import type { Region } from '@/types';
import { ISLAND_TABS } from '@/lib/mock/regions.data';
import { MagnifyingGlass, X } from '@phosphor-icons/react';

interface Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  selectedIsland: string;
  setSelectedIsland: (island: string) => void;
  filteredMarkets: AdminMarket[];
  selectedMarketId: string;
  handleSelectMarket: (id: string) => void;
  regionMap: Map<string, Region>;
}

export function AdminMarketSelector({
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  selectedIsland,
  setSelectedIsland,
  filteredMarkets,
  selectedMarketId,
  handleSelectMarket,
  regionMap,
}: Props) {
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchOpen]);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div ref={searchBoxRef} className="relative flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <MagnifyingGlass size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Cari pasar, kota, atau kecamatan..."
            className="w-full pl-9 pr-9 py-2.5 rounded-[10px] bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-[var(--shadow-hard-sm)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Hapus pencarian pasar"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 max-h-60 overflow-y-auto market-card p-2 z-30 space-y-1">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((m) => {
                const isSelected = m.id === selectedMarketId;
                const reg = m.regionId ? regionMap.get(m.regionId) : undefined;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMarket(m.id)}
                    className={`w-full text-left px-3 py-2 rounded-[10px] text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-chili)] text-white'
                        : 'hover:bg-[var(--bg-muted)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold">{m.name}</span>
                      <span className={isSelected ? 'text-white/85' : 'text-[var(--text-secondary)]'}>
                        {m.city || 'Nasional'} &middot; {m.district}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isSelected
                          ? 'bg-white/20 text-white border-white/30'
                          : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                      }`}
                    >
                      {reg?.islandName || 'Nasional'}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                Tidak ada pasar yang cocok dengan pencarian &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        {ISLAND_TABS.map((tab) => {
          const isSelected = selectedIsland === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedIsland(tab.id);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isSelected
                  ? 'market-btn-primary'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-ink)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
