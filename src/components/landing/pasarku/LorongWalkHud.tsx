'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { ArrowLeft, Footprints, MagnifyingGlass, X } from '@phosphor-icons/react';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { LorongSearchDropdown } from './LorongSearchDropdown';

interface Props {
  walkMeters: number;
  searchQuery: string;
  matches: BogorCommodity[];
  onSearchChange: (q: string) => void;
  onSelectMatch: (item: BogorCommodity) => void;
  onOpenFilteredDrawer: () => void;
  onExitToEntrance: () => void;
}

export function LorongWalkHud({
  walkMeters,
  searchQuery,
  matches,
  onSearchChange,
  onSelectMatch,
  onOpenFilteredDrawer,
  onExitToEntrance,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleMatches = matches.slice(0, 6);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (visibleMatches.length > 0) {
        setIsOpen(true);
        setActiveIdx((prev) => (prev + 1) % visibleMatches.length);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (visibleMatches.length > 0) {
        setIsOpen(true);
        setActiveIdx((prev) => (prev - 1 + visibleMatches.length) % visibleMatches.length);
      }
      return;
    }
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      const target = visibleMatches[activeIdx] || visibleMatches[0];
      if (target) {
        setIsOpen(false);
        onSelectMatch(target);
      } else {
        setIsOpen(false);
        onOpenFilteredDrawer();
      }
    }
  };

  return (
    <div className="w-full bg-[var(--bg-paper)]/80 backdrop-blur-md border-b border-[var(--border-ink)]/25 py-2 px-3 sm:px-6 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={onExitToEntrance}
            className="market-btn-secondary h-9 px-3 text-xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden="true" />
            <span className="font-bold">Gerbang Depan</span>
          </button>

          <div className="h-9 px-3 rounded-lg bg-[var(--bg-muted)]/90 border border-[var(--border-ink)] text-xs font-bold text-[var(--forest-ink)] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 leading-none">
            <Footprints size={15} weight="bold" aria-hidden="true" />
            <span className="font-mono-num">{walkMeters} m</span>
            <span className="text-[11px] text-[var(--text-muted)] font-normal hidden xs:inline sm:inline">
              di lorong pasar
            </span>
          </div>
        </div>

        <div className="w-full sm:w-72 md:w-80 relative shrink-0">
          <input
            ref={inputRef}
            id="heroSearchInput"
            type="text"
            role="combobox"
            aria-label="Cari komoditas di lorong pasar"
            aria-expanded={isOpen && Boolean(searchQuery.trim())}
            aria-controls="lorongSearchResults"
            aria-autocomplete="list"
            value={searchQuery}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 140)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setActiveIdx(0);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari komoditas di lorong..."
            className="w-full h-9 px-3 pr-9 rounded-lg text-xs bg-[var(--bg-card)]/95 text-[var(--text-primary)] border-2 border-[var(--border-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-chili)] placeholder:text-[var(--text-muted)]"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setActiveIdx(0);
                inputRef.current?.focus();
              }}
              aria-label="Hapus pencarian komoditas"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 inline-flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X size={14} weight="bold" aria-hidden="true" />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none inline-flex items-center">
              <MagnifyingGlass size={15} weight="bold" aria-hidden="true" />
            </span>
          )}

          {isOpen && (
            <LorongSearchDropdown
              id="lorongSearchResults"
              matches={matches}
              activeIdx={activeIdx}
              query={searchQuery}
              onSelectMatch={(item) => {
                setIsOpen(false);
                onSelectMatch(item);
              }}
              onOpenFilteredDrawer={() => {
                setIsOpen(false);
                onOpenFilteredDrawer();
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}
