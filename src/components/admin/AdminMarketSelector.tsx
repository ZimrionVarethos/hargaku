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
      {/* Search Autocomplete */}
      <div ref={searchBoxRef} className="relative flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#706E6A]">
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
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#E5E3DE] text-xs font-medium text-[#1B1A18] placeholder-[#A8A29E] focus:outline-none focus:border-[#1B1A18] shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706E6A] hover:text-[#1B1A18]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-[#E5E3DE] rounded-2xl shadow-lg p-2 z-30 space-y-1">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((m) => {
                const isSelected = m.id === selectedMarketId;
                const reg = m.regionId ? regionMap.get(m.regionId) : undefined;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMarket(m.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B1A18] text-white'
                        : 'hover:bg-[#FAF9F5] text-[#1B1A18]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{m.name}</span>
                      <span className={isSelected ? 'text-white/80' : 'text-[#706E6A]'}>
                        {m.city || 'Nasional'} · {m.district}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FAF9F5] text-[#6E6D67] border border-[#E5E3DE]'
                      }`}
                    >
                      {reg?.islandName || 'Nasional'}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-[#706E6A]">
                Tidak ada pasar yang cocok dengan pencarian &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Island tabs */}
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1B1A18] text-white border-[#1B1A18] shadow-xs'
                  : 'bg-white text-[#706E6A] border-[#E5E3DE] hover:bg-[#FAF9F5] hover:text-[#1B1A18]'
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
