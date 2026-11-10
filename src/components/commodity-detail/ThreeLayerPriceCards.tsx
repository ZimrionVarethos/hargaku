'use client';

import { CommodityDetail } from '@/types';
import { computeCommodityCitizenStats, matchesCommodityRecord } from '@/lib/market-insights';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';

interface Props {
  detail: CommodityDetail;
}

export function ThreeLayerPriceCards({ detail }: Props) {
  const { selectedRegion, calculateRegionalPrice } = useRegion();
  const { reports } = useLiveCatalog();

  const nationalHap = detail.reference.nationalHapHet ?? detail.reference.priceHapHet;
  const regionalHap = calculateRegionalPrice(nationalHap);
  const tolerancePrice = Math.round(regionalHap * 1.1);
  const cityAvg = calculateRegionalPrice(detail.currentPriceStats.cityAverage);
  const deviationPercent =
    regionalHap > 0 ? Number((((cityAvg - regionalHap) / regionalHap) * 100).toFixed(1)) : 0;

  const citizenStats = computeCommodityCitizenStats(detail, reports);
  const shortageReports = reports.filter(
    (r) =>
      r.status === 'APPROVED' &&
      r.reportType === 'SHORTAGE' &&
      matchesCommodityRecord(r, detail)
  );
  const citizenMedian =
    citizenStats.cityCount > 0 ? calculateRegionalPrice(citizenStats.cityMedian) : cityAvg;

  const lowest = Math.round(detail.currentPriceStats.lowestMarket.price * selectedRegion.disparityIndex);
  const highest = Math.round(detail.currentPriceStats.highestMarket.price * selectedRegion.disparityIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            LAPIS 1 &middot; ACUAN NASIONAL ({detail.reference.type})
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num tracking-tight">
              Rp {nationalHap.toLocaleString('id-ID')}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)]">/{detail.unit}</span>
          </div>

          <p className="text-[12px] text-[var(--text-secondary)] leading-[18px]">
            Panel Bapanas RI ({detail.reference.legalDoc || 'Peraturan Bapanas'}) &middot; Penyesuaian {selectedRegion.name} (+{selectedRegion.logisticsCostPct}%): Rp {regionalHap.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
            Batas Toleransi (+10%): Rp {tolerancePrice.toLocaleString('id-ID')}/{detail.unit}
          </span>
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            LAPIS 2 &middot; ACUAN DAERAH ({selectedRegion.name.toUpperCase()})
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num tracking-tight">
              Rp {cityAvg.toLocaleString('id-ID')}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)]">/{detail.unit}</span>
          </div>

          <p className="text-[12px] text-[var(--text-secondary)] leading-[18px]">
            Melengkapi pemantauan PIHPS Bank Indonesia &amp; survei pasar harian di {selectedRegion.name}.
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            Selisih vs Acuan: {deviationPercent > 0 ? `+${deviationPercent}%` : `${deviationPercent}%`}
          </span>
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            LAPIS 3 &middot; LAPORAN WARGA &amp; STOK
          </span>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num tracking-tight">
              Rp {citizenMedian.toLocaleString('id-ID')}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)]">/{detail.unit}</span>
          </div>

          <p className="text-[12px] text-[var(--text-secondary)] leading-[18px]">
            {citizenStats.cityCount > 0
              ? `${citizenStats.cityCount} laporan harga warga terverifikasi`
              : `${detail.currentPriceStats.citizenReportsCount || 3} laporan konsensus awal`}{' '}
            &middot; {shortageReports.length > 0 ? `${shortageReports.length} info stok pedagang aktif` : 'Pasokan stabil'}
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]">
            Rentang lapak: Rp {lowest.toLocaleString('id-ID')} s.d. Rp {highest.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}
