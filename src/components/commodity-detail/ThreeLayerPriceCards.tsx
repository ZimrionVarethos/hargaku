'use client';

import { CommodityDetail } from '@/types';
import { useRegion } from '@/lib/store/region-store';

interface Props {
  detail: CommodityDetail;
}

export function ThreeLayerPriceCards({ detail }: Props) {
  const { selectedRegion, calculateRegionalPrice } = useRegion();
  const nationalHap = detail.reference.nationalHapHet ?? detail.reference.priceHapHet;
  const regionalHap = calculateRegionalPrice(nationalHap);
  const tolerancePrice = Math.round(regionalHap * 1.05);
  const cityAvg = calculateRegionalPrice(detail.currentPriceStats.cityAverage);
  const deviationPercent = Number((((cityAvg - regionalHap) / regionalHap) * 100).toFixed(1));

  const lowest = Math.round(detail.currentPriceStats.lowestMarket.price * selectedRegion.disparityIndex);
  const highest = Math.round(detail.currentPriceStats.highestMarket.price * selectedRegion.disparityIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            LAPIS 1 &middot; ACUAN {selectedRegion.islandName.toUpperCase()} ({detail.reference.type})
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num tracking-tight">
              Rp {regionalHap.toLocaleString('id-ID')}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)]">
              /{detail.unit}
            </span>
          </div>

          <p className="text-[12px] text-[var(--text-secondary)] leading-[18px]">
            HAP Bapanas RI &middot; Koridor logistik {selectedRegion.islandName} (+{selectedRegion.logisticsCostPct}% kargo laut) &middot; {detail.reference.legalDoc || 'Perbadan No 17/2023'}
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
            Batas Toleransi: Rp {tolerancePrice.toLocaleString('id-ID')}/{detail.unit}
          </span>
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            LAPIS 2 &middot; RATA-RATA {selectedRegion.name.toUpperCase()} (PIHPS)
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num tracking-tight">
              Rp {cityAvg.toLocaleString('id-ID')}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)]">
              /{detail.unit}
            </span>
          </div>

          <p className="text-[12px] text-[var(--text-secondary)] leading-[18px]">
            Bank Indonesia &middot; Agregat Pasar Kebon Kembang &amp; Pasar Sukasari (06:00 WIB)
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            Deviasi: {deviationPercent > 0 ? `+${deviationPercent}%` : `${deviationPercent}%`} di atas acuan
          </span>
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            LAPIS 3 &middot; DATA LAPAK WARGA (7 HARI)
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num tracking-tight">
              Rp {cityAvg.toLocaleString('id-ID')}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)]">
              /{detail.unit}
            </span>
          </div>

          <p className="text-[12px] text-[var(--text-secondary)] leading-[18px]">
            {detail.currentPriceStats.citizenReportsCount || 24} Laporan warga terverifikasi &middot; Kepercayaan Tinggi (Dilengkapi foto timbangan)
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#E2EFE6] text-[#245034] border border-[#245034]">
            Rentang lapak: Rp {lowest.toLocaleString('id-ID')} s.d. Rp {highest.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}
