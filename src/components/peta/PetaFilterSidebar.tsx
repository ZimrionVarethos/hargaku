'use client';

import { CaretDown, ListNumbers } from '@phosphor-icons/react';
import { CommoditySummary } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { PetaMarketPrice } from './peta-data';

interface Props {
  commodities: CommoditySummary[];
  selectedCommodityId: string;
  onCommodityChange: (id: string) => void;
  commodityUnit: string;
  regionalAvgPrice: number;
  markets: PetaMarketPrice[];
  onOpenRankingTab?: () => void;
}

export function PetaFilterSidebar({
  commodities,
  selectedCommodityId,
  onCommodityChange,
  commodityUnit,
  regionalAvgPrice,
  markets,
  onOpenRankingTab,
}: Props) {
  const sorted = [...markets].sort((a, b) => a.price - b.price);
  const cheaperSample =
    markets.find((m) => m.status === 'cheaper')?.shortName || sorted[0]?.shortName || 'Harga di bawah acuan';
  const averageSample =
    markets.find((m) => m.status === 'average')?.shortName || 'Sekitar acuan rerata wilayah';
  const expensiveSample =
    markets.find((m) => m.status === 'expensive')?.shortName ||
    sorted[sorted.length - 1]?.shortName ||
    'Harga di atas acuan';
  const cheapest = sorted[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="petaCommoditySelect"
          className="text-[12px] font-bold text-[var(--text-primary)]"
        >
          Komoditas Pilihan
        </label>
        <div className="relative">
          <select
            id="petaCommoditySelect"
            value={selectedCommodityId}
            onChange={(e) => onCommodityChange(e.target.value)}
            className="w-full appearance-none min-h-[42px] pl-3.5 pr-9 py-2.5 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-bold shadow-[var(--shadow-hard-sm)] cursor-pointer"
          >
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.unit})
              </option>
            ))}
          </select>
          <CaretDown
            size={14}
            weight="bold"
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] pointer-events-none"
          />
        </div>
        {regionalAvgPrice > 0 && (
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1">
            <span>Acuan Terkalibrasi Wilayah:</span>
            <span className="font-bold font-mono-num text-[var(--forest-ink)]">
              {formatRupiah(regionalAvgPrice)} / {commodityUnit}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--border-subtle)]">
        <span className="text-[12px] font-bold text-[var(--text-primary)]">
          Kategori Indeks Relatif
        </span>

        <div className="flex flex-col gap-2.5 text-[12px]">
          <div className="flex items-start gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#E2EFE6] border border-[#245034] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-[var(--text-primary)]">
                Lebih hemat (&lt; -2% vs acuan)
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Contoh: {cheaperSample}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[var(--bg-muted)] border border-[var(--border-ink)] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-[var(--text-primary)]">
                Wajar sekitar rata-rata
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Contoh: {averageSample}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#FBE9E6] border border-[#A92717] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-[var(--text-primary)]">
                Lebih tinggi (&gt; +2% vs acuan)
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Contoh: {expensiveSample}
              </span>
            </div>
          </div>
        </div>
      </div>

      {cheapest && onOpenRankingTab && (
        <button
          type="button"
          onClick={onOpenRankingTab}
          className="w-full text-left p-3.5 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--forest-surface)] hover:opacity-95 transition-opacity flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--forest-ink)]">
              Paling Hemat Saat Ini
            </div>
            <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
              {cheapest.shortName} &middot; {formatRupiah(cheapest.price)}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[11px] font-bold text-[var(--text-primary)] shrink-0">
            <ListNumbers size={13} weight="bold" />
            <span>{markets.length}</span>
          </span>
        </button>
      )}
    </div>
  );
}
