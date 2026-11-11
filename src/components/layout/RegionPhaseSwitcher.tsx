'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CaretDown, Check, MagnifyingGlass, MapPin, X } from '@phosphor-icons/react';
import { ROLLOUT_PHASES } from '@/lib/mock/regions.data';
import { useRegion } from '@/lib/store/region-store';
import type { Region, RolloutPhase } from '@/types';

const PHASE_PRIMARY_REGION: Record<RolloutPhase, string> = {
  1: 'reg_bogor',
  2: 'reg_bodebek',
  3: 'reg_jabar',
  4: 'reg_jateng',
};

export function RegionPhaseSwitcher({ compact = false }: { compact?: boolean }) {
  const { selectedRegion, setSelectedRegion, allRegions, regionMarkets } = useRegion();
  const [open, setOpen] = useState(false);
  const [activePhase, setActivePhase] = useState<RolloutPhase>(selectedRegion.phase || 1);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivePhase(selectedRegion.phase || 1);
  }, [selectedRegion.phase]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSelectPhase = (phase: RolloutPhase) => {
    setActivePhase(phase);
    if (phase !== 4) {
      const target = allRegions.find((r) => r.id === PHASE_PRIMARY_REGION[phase]);
      if (target) {
        setSelectedRegion(target);
      }
    }
  };

  const handlePickRegion = (region: Region) => {
    setSelectedRegion(region);
    setOpen(false);
    setSearch('');
  };

  const phaseMeta = ROLLOUT_PHASES.find((p) => p.phase === activePhase) || ROLLOUT_PHASES[0];

  const visibleRegions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q) {
      return allRegions.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.islandName.toLowerCase().includes(q) ||
          (r.phaseLabel?.toLowerCase().includes(q) ?? false)
      );
    }
    return allRegions.filter((r) => (r.phase || 4) === activePhase);
  }, [allRegions, activePhase, search]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Pilih Fase & Wilayah PasarKu"
        className={`market-btn-secondary inline-flex items-center gap-1.5 font-bold cursor-pointer ${
          compact
            ? 'w-full justify-between px-3 py-2 text-xs min-h-[40px]'
            : 'px-2.5 py-1.5 text-xs min-h-[38px] sm:min-h-[40px]'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <MapPin size={14} weight="fill" className="text-[var(--accent-chili)] shrink-0" aria-hidden="true" />
          <span className="truncate max-w-[118px]">{selectedRegion.name}</span>
          <span className="px-1.5 py-0.5 rounded border border-[var(--border-ink)] bg-[var(--forest-surface)] text-[var(--forest-ink)] text-[10px] font-bold shrink-0">
            F{selectedRegion.phase || 1}
          </span>
        </span>
        <CaretDown
          size={12}
          weight="bold"
          aria-hidden="true"
          className={`text-[var(--text-primary)] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`${
            compact ? 'relative mt-2 w-full' : 'absolute left-0 top-full mt-2 w-[min(92vw,410px)]'
          } z-50 market-card bg-[var(--bg-card)] p-4 space-y-3`}
        >
          <div className="flex items-start justify-between gap-2 pb-3 border-b-2 border-[var(--border-ink)]">
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold text-[var(--text-primary)] leading-tight">
                Cakupan Wilayah PasarKu
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                Pilih skala pantauan dari tingkat kota hingga 21 provinsi nasional.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--border-ink)] font-mono-num shrink-0">
              {regionMarkets.length} pasar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ROLLOUT_PHASES.map((p) => {
              const active = activePhase === p.phase;
              return (
                <button
                  key={p.phase}
                  type="button"
                  onClick={() => handleSelectPhase(p.phase)}
                  className={`text-left px-3 py-2 rounded-xl border-2 border-[var(--border-ink)] transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-chili)] text-white shadow-[var(--shadow-hard-sm)]'
                      : 'bg-[var(--bg-paper)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  <div className={`text-[10px] font-bold ${active ? 'text-white/90' : 'text-[var(--text-muted)]'}`}>
                    Fase {p.phase}
                  </div>
                  <div className="text-xs font-bold truncate">{p.shortLabel}</div>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] leading-snug">
            {phaseMeta.description}
          </div>

          <div className="relative">
            <MagnifyingGlass
              size={14}
              weight="bold"
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kota atau provinsi (Bogor, Bali, Papua)..."
              aria-label="Cari kota atau provinsi"
              className="w-full min-h-[40px] pl-9 pr-8 py-1.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Hapus kata kunci wilayah"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] cursor-pointer"
              >
                <X size={13} weight="bold" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] max-h-48 overflow-y-auto divide-y divide-[var(--border-subtle)]">
            {visibleRegions.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handlePickRegion(reg)}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-[var(--forest-surface)] text-[var(--text-primary)]'
                      : 'hover:bg-[var(--bg-muted)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold flex items-center gap-1.5 truncate">
                      <span>{reg.name}</span>
                      {reg.logisticsCostPct > 0 && (
                        <span className="text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                          +{reg.logisticsCostPct}%
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      {reg.phaseLabel} &middot; {reg.islandName}
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={14} weight="bold" className="text-[var(--forest-ink)] shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
            {visibleRegions.length === 0 && (
              <div className="text-xs text-[var(--text-muted)] py-4 text-center">
                Wilayah tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
