'use client';

import type { FormEvent } from 'react';
import { CommoditySummary, Market } from '@/types';
import { CaretDown, Lightning, Calculator } from '@phosphor-icons/react';

export interface TakaranUnit {
  id: string;
  shortLabel: string;
  label: string;
  gramMultiplier: number;
}

export const TAKARAN_UNITS: TakaranUnit[] = [
  { id: 'kg', shortLabel: 'kg', label: '1 kg (1.000 gram)', gramMultiplier: 1000 },
  { id: 'half', shortLabel: '500g', label: '500 gram (1/2 kg)', gramMultiplier: 500 },
  { id: 'quarter', shortLabel: '250g', label: '250 gram (1/4 kg)', gramMultiplier: 250 },
  { id: 'ons', shortLabel: 'ons', label: 'Ons (100 gram)', gramMultiplier: 100 },
  { id: 'liter', shortLabel: 'liter', label: '1 Liter', gramMultiplier: 1000 },
  { id: 'ikat', shortLabel: 'ikat', label: '1 Ikat / Satuan', gramMultiplier: 1000 },
];

export interface PriceQuickPreset {
  id: string;
  label: string;
  slugHints: string[];
  amount: number;
  unitId: string;
  price: number;
}

export const PRICE_QUICK_PRESETS: PriceQuickPreset[] = [
  {
    id: 'preset_cabai',
    label: 'Cabai 250g · Rp 18rb',
    slugHints: ['cabai-rawit-merah', 'cabai'],
    amount: 1,
    unitId: 'quarter',
    price: 18000,
  },
  {
    id: 'preset_beras',
    label: 'Beras 5 kg · Rp 75rb',
    slugHints: ['beras-medium-ir64', 'beras-medium', 'beras'],
    amount: 5,
    unitId: 'kg',
    price: 75000,
  },
  {
    id: 'preset_telur',
    label: 'Telur 1 kg · Rp 30rb',
    slugHints: ['telur-ayam-ras', 'telur'],
    amount: 1,
    unitId: 'kg',
    price: 30000,
  },
];

interface Props {
  commodities: CommoditySummary[];
  markets: Market[];
  selectedCommodityId: string;
  onCommodityChange: (id: string) => void;
  takaranAmount: number;
  onTakaranAmountChange: (amount: number) => void;
  selectedUnitId: string;
  onUnitChange: (unitId: string) => void;
  selectedMarketId: string;
  onMarketChange: (marketId: string) => void;
  rawPriceInput: string;
  onPriceInputChange: (price: string) => void;
  normalizedPricePerKg: number;
  standardUnit?: string;
  activePresetId: string | null;
  onApplyPreset: (preset: PriceQuickPreset) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
}

export function PriceCheckForm({
  commodities,
  markets,
  selectedCommodityId,
  onCommodityChange,
  takaranAmount,
  onTakaranAmountChange,
  selectedUnitId,
  onUnitChange,
  selectedMarketId,
  onMarketChange,
  rawPriceInput,
  onPriceInputChange,
  normalizedPricePerKg,
  standardUnit = 'kg',
  activePresetId,
  onApplyPreset,
  onSubmit,
  loading,
}: Props) {
  const currentUnit = TAKARAN_UNITS.find((u) => u.id === selectedUnitId) || TAKARAN_UNITS[0];

  return (
    <div className="market-card p-5 sm:p-6 flex flex-col gap-4 bg-[var(--bg-card)]">
      <div className="space-y-2 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            Hitung Harga Tawaran
          </h2>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--forest-ink)] uppercase tracking-wider">
            <Lightning size={12} weight="fill" />
            <span>Contoh Cepat</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRICE_QUICK_PRESETS.map((preset) => {
            const active = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]'
                    : 'bg-[var(--bg-paper)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-ink)] hover:text-[var(--text-primary)]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cekCommoditySelect" className="text-[12px] font-bold text-[var(--text-primary)]">
              1. Barang yang Mau Dibeli
            </label>
            <div className="relative">
              <select
                id="cekCommoditySelect"
                value={selectedCommodityId}
                onChange={(e) => onCommodityChange(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-semibold shadow-xs focus:outline-none cursor-pointer"
              >
                {commodities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (/{item.unit})
                  </option>
                ))}
              </select>
              <CaretDown
                size={14}
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cekMarketSelect" className="text-[12px] font-bold text-[var(--text-primary)]">
              Pasar Lokasi Belanja
            </label>
            <div className="relative">
              <select
                id="cekMarketSelect"
                value={selectedMarketId}
                onChange={(e) => onMarketChange(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-semibold shadow-xs focus:outline-none cursor-pointer"
              >
                {markets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.district}){m.nearStation ? ' · Dekat Stasiun' : ''}
                  </option>
                ))}
              </select>
              <CaretDown
                size={14}
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start pt-1">
          <div className="sm:col-span-4 flex flex-col gap-1.5">
            <label htmlFor="cekAmountInput" className="text-[12px] font-bold text-[var(--text-primary)]">
              2. Jumlah
            </label>
            <input
              id="cekAmountInput"
              type="number"
              min={1}
              max={100}
              value={takaranAmount}
              onChange={(e) => onTakaranAmountChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[14px] text-[var(--text-primary)] font-bold shadow-xs focus:outline-none font-mono-num"
            />
          </div>

          <div className="sm:col-span-8 flex flex-col gap-1.5">
            <span className="text-[12px] font-bold text-[var(--text-primary)]">
              Takaran / Satuan
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {TAKARAN_UNITS.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => onUnitChange(unit.id)}
                    title={unit.label}
                    className={`py-2 px-1.5 text-[12px] font-bold rounded-lg border-2 border-[var(--border-ink)] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-chili)] text-white shadow-xs'
                        : 'bg-[var(--bg-paper)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    {unit.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cekPriceInput" className="text-[12px] font-bold text-[var(--text-primary)]">
            Harga yang Diminta Penjual (Total)
          </label>
          <input
            id="cekPriceInput"
            type="text"
            inputMode="numeric"
            value={rawPriceInput}
            onChange={(e) => onPriceInputChange(e.target.value)}
            placeholder="Rp 18.000"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[16px] text-[var(--text-primary)] font-bold shadow-xs focus:outline-none font-mono-num"
          />

          {normalizedPricePerKg > 0 && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--forest-surface)] border border-[var(--forest-ink)]/35 text-[11px] sm:text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Calculator size={14} weight="bold" className="text-[var(--forest-ink)] shrink-0" />
                <span>
                  {takaranAmount} &times; {currentUnit.shortLabel} ({rawPriceInput || 'Rp 0'})
                </span>
              </span>
              <span className="font-bold text-[var(--forest-ink)] font-mono-num shrink-0">
                = Rp {normalizedPricePerKg.toLocaleString('id-ID')} / {standardUnit}
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="market-btn-primary mt-1 w-full py-3 px-5 text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Menghitung Perbandingan...' : 'Cek & Bandingkan Harga'}
        </button>
      </form>
    </div>
  );
}
