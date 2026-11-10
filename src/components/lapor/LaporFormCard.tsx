'use client';

import { useState, useId } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';
import { CommoditySummary, Market } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { LaporPhotoUpload } from './LaporPhotoUpload';

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

interface Props {
  commodities: CommoditySummary[];
  markets: Market[];
  isSubmitting: boolean;
  onSubmit: (data: {
    commodityId: string;
    marketId: string;
    price: number;
    unit: string;
    normalizedPrice: number;
    purchaseDate: string;
    photoFile: File | null;
    notes: string;
  }) => void;
}

export function LaporFormCard({
  commodities,
  markets,
  isSubmitting,
  onSubmit,
}: Props) {
  const [selectedCommodityId, setSelectedCommodityId] = useState(
    commodities[0]?.id || 'cabai-rawit-merah'
  );
  const [selectedMarketId, setSelectedMarketId] = useState(
    markets[0]?.id || 'mkt_pasar_anyar'
  );
  const [priceInput, setPriceInput] = useState<string>('15000');
  const [selectedUnit, setSelectedUnit] = useState<TakaranUnitOption>(TAKARAN_UNITS[2]);
  const [purchaseDate] = useState<'today' | 'yesterday'>('today');
  const [notes, setNotes] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fileInputId = useId();
  const rawPrice = parseInt(priceInput.replace(/\D/g, ''), 10) || 0;
  const normalizedPrice = Math.round(rawPrice / selectedUnit.ratioToKg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawPrice <= 0) return;
    const now = new Date();
    if (purchaseDate === 'yesterday') {
      now.setDate(now.getDate() - 1);
    }
    onSubmit({
      commodityId: selectedCommodityId,
      marketId: selectedMarketId,
      price: rawPrice,
      unit: selectedUnit.label,
      normalizedPrice,
      purchaseDate: now.toISOString(),
      photoFile,
      notes,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="market-card p-6 sm:p-8 flex flex-col gap-6"
    >
      <div>
        <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
          Formulir Laporan Harga Lapak
        </h2>
        <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] mt-1">
          Laporan Anda akan divalidasi dengan acuan resmi sebelum dipublikasikan ke peta transparansi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[var(--text-primary)]">Pilih Komoditas</label>
          <div className="relative">
            <select
              value={selectedCommodityId}
              onChange={(e) => setSelectedCommodityId(e.target.value)}
              className="w-full appearance-none py-2.5 px-3.5 pr-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] font-semibold text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-chili)]"
            >
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[var(--text-primary)]">Pilih Lokasi Pasar</label>
          <div className="relative">
            <select
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              className="w-full appearance-none py-2.5 px-3.5 pr-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] font-semibold text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-chili)]"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district})
                </option>
              ))}
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-7 flex flex-col gap-2">
          <label className="text-[12px] font-bold text-[var(--text-primary)]">Nominal yang Dibayar &amp; Takaran</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--text-muted)]">Rp</span>
              <input
                type="text"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="15.000"
                className="w-full py-2.5 pl-10 pr-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[15px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num focus:ring-2 focus:ring-[var(--accent-chili)]"
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
                  onClick={() => setSelectedUnit(u)}
                  className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-colors ${
                    isSelected
                      ? 'market-btn-primary'
                      : 'market-btn-secondary'
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
            Konversi Standar Pangan
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[16px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num">
              {formatRupiah(normalizedPrice)}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">/ kg</span>
          </div>
        </div>
      </div>

      <LaporPhotoUpload
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        fileInputId={fileInputId}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-[var(--text-primary)]">
          Catatan Tambahan <span className="font-normal text-[var(--text-muted)]">(Opsional)</span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Contoh: Kios Bu Siti dekat pintu timur, kualitas bagus dan segar."
          className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[12px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-chili)]"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rawPrice <= 0}
        className="market-btn-primary w-full py-3 text-[13px] font-bold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Check size={16} weight="bold" />
        <span>{isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Harga Lapak'}</span>
      </button>
    </form>
  );
}
