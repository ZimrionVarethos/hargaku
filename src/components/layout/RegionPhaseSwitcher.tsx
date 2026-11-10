'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CaretDown, Check, GlobeHemisphereEast, MapPin } from '@phosphor-icons/react';
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
        className={`inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-ink)] bg-[var(--bg-muted)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] font-bold transition-colors cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-xs w-full justify-between' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <span className="inline-flex items-center gap-1.5 min-w-0">
          <MapPin size={13} weight="fill" className="text-[var(--accent-chili)] shrink-0" />
          <span className="truncate max-w-[118px]">{selectedRegion.name}</span>
          <span className="px-1.5 py-0.5 rounded bg-[var(--forest-surface)] text-[var(--forest-ink)] text-[10px] font-extrabold shrink-0">
            F{selectedRegion.phase || 1}
          </span>
        </span>
        <CaretDown size={12} weight="bold" className="text-[var(--text-muted)] shrink-0" />
      </button>

      {open && (
        <div
          className={`${
            compact ? 'relative mt-2 w-full' : 'absolute left-0 top-full mt-2 w-[min(92vw,390px)]'
          } z-50 rounded-2xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] p-4 shadow-xl`}
        >
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-chili)]">
                <GlobeHemisphereEast size={13} weight="bold" />
                <span>Peta Skala 4 Fase</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                Bogor &rarr; Jabodetabek &rarr; Jawa Barat &rarr; Nasional (21 Provinsi)
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)] shrink-0">
              {regionMarkets.length} pasar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 my-3">
            {ROLLOUT_PHASES.map((p) => {
              const active = activePhase === p.phase;
              return (
                <button
                  key={p.phase}
                  type="button"
                  onClick={() => handleSelectPhase(p.phase)}
                  className={`text-left px-2.5 py-2 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)] shadow-xs'
                      : 'bg-[var(--bg-paper)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  <div className="text-[10px] font-extrabold opacity-80">FASE {p.phase}</div>
                  <div className="text-[12px] font-bold truncate">{p.shortLabel}</div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-[var(--text-muted)] mb-2.5 leading-relaxed">
            {phaseMeta.description}
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kota / provinsi (misal: Bogor, Bali, Papua)..."
            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-paper)] border border-[var(--border-ink)] text-xs text-[var(--text-primary)] focus:outline-none mb-2.5"
          />

          <div className="max-h-52 overflow-y-auto flex flex-col gap-1 pr-0.5">
            {visibleRegions.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handlePickRegion(reg)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg border flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--forest-surface)] border-[var(--border-ink)] text-[var(--text-primary)]'
                      : 'bg-transparent border-transparent hover:bg-[var(--bg-muted)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold flex items-center gap-1.5 truncate">
                      <span>{reg.name}</span>
                      {reg.logisticsCostPct > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-muted)] text-[var(--text-secondary)]">
                          +{reg.logisticsCostPct}%
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate">
                      {reg.phaseLabel} &bull; {reg.islandName}
                    </div>
                  </div>
                  {isSelected && <Check size={14} weight="bold" className="text-[var(--forest-ink)] shrink-0" />}
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
