'use client';

import { CommoditySummary, Market } from '@/types';
import { CaretDown } from '@phosphor-icons/react';

export interface TakaranUnit {
  id: string;
  label: string;
  gramMultiplier: number;
}

export const TAKARAN_UNITS: TakaranUnit[] = [
  { id: 'ons', label: 'Ons (100 gram)', gramMultiplier: 100 },
  { id: 'quarter', label: '1/4 kg (250 gram)', gramMultiplier: 250 },
  { id: 'half', label: '1/2 kg (500 gram)', gramMultiplier: 500 },
  { id: 'kg', label: '1 kg (Standar)', gramMultiplier: 1000 },
  { id: 'liter', label: 'Liter', gramMultiplier: 1000 },
  { id: 'ikat', label: 'Ikat / Satuan', gramMultiplier: 1000 },
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
  onSubmit: (e: React.FormEvent) => void;
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
  onSubmit,
  loading,
}: Props) {
  return (
    <div className="market-card p-6 sm:p-7 flex flex-col gap-6 bg-[var(--bg-card)]">
      <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">
        Input Penawaran di Lapak
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--text-primary)]">
            Pilih Komoditas
          </label>
          <div className="relative">
            <select
              value={selectedCommodityId}
              onChange={(e) => onCommodityChange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-medium shadow-xs focus:outline-none cursor-pointer"
            >
              {commodities.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <CaretDown
              size={13}
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4 flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--text-primary)]">
              Jumlah
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={takaranAmount}
              onChange={(e) => onTakaranAmountChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-[14px] text-[var(--text-primary)] font-bold shadow-xs focus:outline-none"
            />
          </div>

          <div className="sm:col-span-8 flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--text-primary)]">
              Satuan
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {TAKARAN_UNITS.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => onUnitChange(unit.id)}
                    className={`py-2 px-1.5 text-[11px] font-bold rounded-lg border-2 border-[var(--border-ink)] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-chili)] text-white shadow-xs'
                        : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    {unit.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--text-primary)]">
            Lokasi Pasar Tujuan
          </label>
          <div className="relative">
            <select
              value={selectedMarketId}
              onChange={(e) => onMarketChange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-medium shadow-xs focus:outline-none cursor-pointer"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district}){m.nearStation ? ' [Dekat Stasiun]' : ''}
                </option>
              ))}
            </select>
            <CaretDown
              size={13}
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[13px] font-semibold text-[var(--text-primary)]">
              Harga yang Ditawarkan Pedagang (Rp)
            </label>
            {normalizedPricePerKg > 0 && (
              <span className="text-[12px] font-bold text-[var(--forest-ink)] tabular-nums">
                = Rp {normalizedPricePerKg.toLocaleString('id-ID')}/{standardUnit}
              </span>
            )}
          </div>
          <input
            type="text"
            value={rawPriceInput}
            onChange={(e) => onPriceInputChange(e.target.value)}
            placeholder="Rp 15.000"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-[15px] text-[var(--text-primary)] font-bold shadow-xs focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="market-btn-primary mt-2 w-full py-3.5 px-5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Menghitung Perbandingan...' : 'Bandingkan dengan Acuan Sekarang'}
        </button>

        <p className="text-[11px] text-[var(--text-muted)] text-center leading-[16px] pt-1">
          Tanpa login. Harga otomatis disetarakan ke satuan acuan nasional &amp; pasar setempat (Rp/kg atau Rp/liter).
        </p>
      </form>
    </div>
  );
}
