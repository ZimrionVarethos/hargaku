'use client';

import type { StockStatus } from '@/types';
import { formatRupiah } from '@/lib/utils';

export interface TakaranUnitOption {
  label: string;
  ratioToKg: number;
}

export const TAKARAN_UNITS: TakaranUnitOption[] = [
  { label: '1 kg', ratioToKg: 1.0 },
  { label: '1/2 kg', ratioToKg: 0.5 },
  { label: '1/4 kg (2.5 ons)', ratioToKg: 0.25 },
  { label: '1 ons (100g)', ratioToKg: 0.1 },
  { label: '1 liter', ratioToKg: 1.0 },
  { label: '1 ikat / butir', ratioToKg: 1.0 },
];

const STOCK_STATUS_OPTIONS: Array<{ value: StockStatus; label: string; desc: string }> = [
  { value: 'TERBATAS', label: 'Stok Terbatas', desc: 'Pasokan pengirim berkurang' },
  { value: 'LANGKA', label: 'Stok Langka / Kosong', desc: 'Barang sulit didapat di lapak' },
  { value: 'PULIH', label: 'Pasokan Mulai Pulih', desc: 'Kiriman kembali lancar' },
];

export function LaporShortageSelector({
  stockStatus,
  onChange,
}: {
  stockStatus: StockStatus;
  onChange: (val: StockStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-bold text-[var(--text-primary)]">
        Kondisi Pasokan di Pasar
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {STOCK_STATUS_OPTIONS.map((opt) => {
          const active = stockStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                active
                  ? 'bg-[var(--forest-surface)] border-[var(--border-ink)] text-[var(--text-primary)] shadow-xs'
                  : 'bg-[var(--bg-paper)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
              }`}
            >
              <div className="text-xs font-extrabold">{opt.label}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{opt.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LaporPriceInputGroup({
  quantity,
  onQuantityChange,
  priceInput,
  onPriceChange,
  selectedUnit,
  onUnitChange,
  normalizedPrice,
}: {
  quantity: number;
  onQuantityChange: (q: number) => void;
  priceInput: string;
  onPriceChange: (p: string) => void;
  selectedUnit: TakaranUnitOption;
  onUnitChange: (u: TakaranUnitOption) => void;
  normalizedPrice: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
      <div className="sm:col-span-7 flex flex-col gap-2">
        <label className="text-[12px] font-bold text-[var(--text-primary)]">
          Jumlah, Satuan &amp; Nominal (Rp)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
            aria-label="Jumlah"
            className="w-20 py-2.5 px-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[14px] font-bold text-[var(--text-primary)] text-center"
          />
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--text-muted)]">
              Rp
            </span>
            <input
              type="text"
              value={priceInput}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="15000"
              className="w-full py-2.5 pl-10 pr-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[15px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {TAKARAN_UNITS.map((u) => {
            const isSelected = selectedUnit.label === u.label;
            return (
              <button
                key={u.label}
                type="button"
                onClick={() => onUnitChange(u)}
                className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  isSelected ? 'market-btn-primary' : 'market-btn-secondary'
                }`}
              >
                {u.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sm:col-span-5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex flex-col justify-center">
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Setara Acuan Standar
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-[16px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num">
            {formatRupiah(normalizedPrice)}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">/ kg</span>
        </div>
      </div>
    </div>
  );
}

