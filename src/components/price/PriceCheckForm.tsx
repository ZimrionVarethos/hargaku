'use client';

import { useState, type FormEvent } from 'react';
import { CommoditySummary, Market } from '@/types';
import { CaretDown, Lightning, SlidersHorizontal } from '@phosphor-icons/react';
import {
  POPULAR_PORTIONS,
  PRICE_QUICK_PRESETS,
  TAKARAN_UNITS,
  type PriceQuickPreset,
} from './price-check-presets';

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
  onSelectPortion: (amount: number, unitId: string) => void;
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
  onSelectPortion,
  onSubmit,
  loading,
}: Props) {
  const [customExpanded, setCustomExpanded] = useState(false);

  const isCustomPortionActive =
    takaranAmount > 1 || selectedUnitId === 'liter' || selectedUnitId === 'ikat';
  const showCustomFields = customExpanded || isCustomPortionActive;
  const currentUnit = TAKARAN_UNITS.find((u) => u.id === selectedUnitId) || TAKARAN_UNITS[0];
  const portionRatio = (takaranAmount * currentUnit.gramMultiplier) / 1000;

  return (
    <div className="market-card p-5 sm:p-6 flex flex-col gap-4 bg-[var(--bg-card)]">
      <div className="space-y-2 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            Isi Harga dari Penjual
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
        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cekCommoditySelect" className="text-[13px] font-bold text-[var(--text-primary)]">
              1. Mau beli barang apa?
            </label>
            <div className="relative">
              <select
                id="cekCommoditySelect"
                value={selectedCommodityId}
                onChange={(e) => onCommodityChange(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[14px] text-[var(--text-primary)] font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)] cursor-pointer"
              >
                {commodities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
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
            <label htmlFor="cekMarketSelect" className="text-[12px] font-semibold text-[var(--text-secondary)]">
              Belanja di pasar mana?
            </label>
            <div className="relative">
              <select
                id="cekMarketSelect"
                value={selectedMarketId}
                onChange={(e) => onMarketChange(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-medium shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)] cursor-pointer"
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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-bold text-[var(--text-primary)]">
              2. Beli berapa banyak?
            </span>
            <button
              type="button"
              onClick={() => setCustomExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--forest-ink)] hover:underline cursor-pointer"
            >
              <SlidersHorizontal size={12} weight="bold" />
              <span>{showCustomFields ? 'Pakai pilihan cepat' : 'Atur jumlah lain'}</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {POPULAR_PORTIONS.map((p) => {
              const isSelected = takaranAmount === p.amount && selectedUnitId === p.unitId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCustomExpanded(false);
                    onSelectPortion(p.amount, p.unitId);
                  }}
                  className={`py-2 px-1.5 rounded-xl border-2 border-[var(--border-ink)] text-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-chili)] text-white shadow-xs'
                      : 'bg-[var(--bg-paper)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  <div className="text-[13px] font-bold leading-tight">{p.label}</div>
                  <div className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-white/90' : 'text-[var(--text-muted)]'}`}>
                    {p.hint}
                  </div>
                </button>
              );
            })}
          </div>

          {showCustomFields && (
            <div className="grid grid-cols-12 gap-2 pt-1">
              <div className="col-span-5">
                <label htmlFor="cekAmountInput" className="text-[11px] font-bold text-[var(--text-muted)] block mb-1">
                  Jumlah
                </label>
                <input
                  id="cekAmountInput"
                  type="number"
                  min={1}
                  max={100}
                  value={takaranAmount}
                  onChange={(e) => onTakaranAmountChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[14px] text-[var(--text-primary)] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)] font-mono-num"
                />
              </div>
              <div className="col-span-7">
                <label htmlFor="cekUnitSelect" className="text-[11px] font-bold text-[var(--text-muted)] block mb-1">
                  Satuan
                </label>
                <div className="relative">
                  <select
                    id="cekUnitSelect"
                    value={selectedUnitId}
                    onChange={(e) => onUnitChange(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)] cursor-pointer"
                  >
                    {TAKARAN_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  <CaretDown
                    size={13}
                    weight="bold"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cekPriceInput" className="text-[13px] font-bold text-[var(--text-primary)]">
            3. Penjual minta harga berapa?
          </label>
          <input
            id="cekPriceInput"
            type="text"
            inputMode="numeric"
            value={rawPriceInput}
            onChange={(e) => onPriceInputChange(e.target.value)}
            placeholder="Contoh: 18000"
            className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[17px] text-[var(--text-primary)] font-bold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)] font-mono-num"
          />
          {normalizedPricePerKg > 0 && portionRatio !== 1 && (
            <p className="text-[11px] text-[var(--text-muted)] font-mono-num">
              Hitungan per {standardUnit}: sekitar Rp {normalizedPricePerKg.toLocaleString('id-ID')} / {standardUnit}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="market-btn-primary mt-1 w-full py-3.5 px-5 text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Sedang mengecek...' : 'Cek Mahal atau Wajar'}
        </button>
      </form>
    </div>
  );
}
