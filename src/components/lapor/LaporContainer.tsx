'use client';

import { useMemo, useState } from 'react';
import { CommoditySummary, Market, ReportType, ReporterRole, StockStatus } from '@/types';
import { LaporFormCard } from './LaporFormCard';
import { LaporVerificationCard } from './LaporVerificationCard';
import { LaporSuccessCard } from './LaporSuccessCard';
import { submitCitizenReport } from '@/lib/api/reports.api';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { resolveCanonicalMarket } from '@/lib/market-insights';
import { useRegion } from '@/lib/store/region-store';
import { useAdminStore } from '@/lib/store/admin-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';

interface Props {
  commodities: CommoditySummary[];
  markets: Market[];
  initialCommoditySlug?: string;
  initialMarketId?: string;
  initialPrice?: string;
  initialMode?: ReportType;
}

interface SubmittedReportState {
  reportId: string;
  commodityName: string;
  marketName: string;
  pricePerUnit: number;
  unitLabel: string;
  normalizedPricePerKg: number;
  reportType: ReportType;
  stockStatus?: StockStatus;
  hasPhoto: boolean;
}

export function LaporContainer({
  commodities,
  markets,
  initialCommoditySlug,
  initialMarketId,
  initialPrice,
  initialMode = 'PRICE',
}: Props) {
  const { selectedRegion, regionMarkets } = useRegion();
  const { addReport } = useAdminStore();
  const { commodities: liveCommodities, markets: liveMarkets } = useLiveCatalog();

  const currentCommodities = liveCommodities.length > 0 ? liveCommodities : commodities;
  const currentMarkets = useMemo(() => {
    const base = liveMarkets.length > 0 ? liveMarkets : markets;
    const filtered = filterMarketsForRegion(base, selectedRegion.id);
    if (filtered.length > 0) return filtered;
    return regionMarkets.length > 0 ? regionMarkets : markets;
  }, [liveMarkets, markets, regionMarkets, selectedRegion.id]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReport, setSubmittedReport] = useState<SubmittedReportState | null>(null);

  const handleSubmit = async (data: {
    commodityId: string;
    marketId: string;
    price: number;
    quantity: number;
    unit: string;
    normalizedPrice: number;
    reportType: ReportType;
    reporterRole: ReporterRole;
    stockStatus?: StockStatus;
    purchaseDate: string;
    photoFile: File | null;
    notes: string;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await submitCitizenReport({
        commodityId: data.commodityId,
        marketId: data.marketId,
        reportedPrice: data.price,
        quantity: data.quantity,
        unit: data.unit,
        normalizedPrice: data.normalizedPrice,
        reportType: data.reportType,
        reporterRole: data.reporterRole,
        stockStatus: data.stockStatus,
        purchaseDate: data.purchaseDate,
        photoFile: data.photoFile,
        notes: data.notes,
      });

      const matchedCommodity = currentCommodities.find((c) => c.id === data.commodityId);
      const matchedMarket = resolveCanonicalMarket(currentMarkets, data.marketId);

      const hapPrice = matchedCommodity?.hapHetPrice || data.normalizedPrice;
      const diffPercent =
        data.reportType === 'PRICE' && hapPrice > 0
          ? Math.round(((data.normalizedPrice - hapPrice) / hapPrice) * 1000) / 10
          : 0;
      const isAnomaly = data.reportType === 'PRICE' && Math.abs(diffPercent) > 25;

      const recordToAdd = res.data.reportRecord
        ? {
            ...res.data.reportRecord,
            photoUrl: data.photoFile ? URL.createObjectURL(data.photoFile) : undefined,
          }
        : {
            id: res.data.reportId,
            commodityId: matchedCommodity?.id || data.commodityId,
            commodityName: matchedCommodity?.name || 'Komoditas Pangan',
            marketId: matchedMarket?.id || data.marketId,
            marketName: matchedMarket?.name || 'Pasar Rakyat',
            reportType: data.reportType,
            reporterRole: data.reporterRole,
            quantity: data.quantity,
            reportedPrice: data.price,
            unit: data.unit,
            normalizedPricePerKg: data.reportType === 'SHORTAGE' ? 0 : data.normalizedPrice,
            officialHapPrice: hapPrice,
            cityAvgPrice: matchedCommodity?.currentAvgPrice || hapPrice,
            diffPercent,
            stockStatus: data.stockStatus,
            submittedAt: 'Baru saja',
            hasPhoto: Boolean(data.photoFile),
            photoUrl: data.photoFile ? URL.createObjectURL(data.photoFile) : undefined,
            citizenNotes: data.notes || undefined,
            status: (isAnomaly ? 'ANOMALY' : 'PENDING') as 'ANOMALY' | 'PENDING',
            anomalyReason: isAnomaly
              ? `Deviasi ${diffPercent > 0 ? '+' : ''}${diffPercent}% melampaui ambang batas toleransi MAD (25%).`
              : undefined,
            exifSanitized: true,
          };

      addReport(recordToAdd, Boolean(res.data.reportRecord));

      setSubmittedReport({
        reportId: res.data.reportId,
        commodityName: matchedCommodity?.name || 'Komoditas Pangan',
        marketName: matchedMarket?.name || 'Pasar Rakyat',
        pricePerUnit: data.price,
        unitLabel: data.unit,
        normalizedPricePerKg: data.normalizedPrice,
        reportType: data.reportType,
        stockStatus: data.stockStatus,
        hasPhoto: Boolean(data.photoFile),
      });
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 xl:col-span-7">
        {submittedReport ? (
          <LaporSuccessCard
            reportId={submittedReport.reportId}
            commodityName={submittedReport.commodityName}
            marketName={submittedReport.marketName}
            pricePerUnit={submittedReport.pricePerUnit}
            unitLabel={submittedReport.unitLabel}
            normalizedPricePerKg={submittedReport.normalizedPricePerKg}
            reportType={submittedReport.reportType}
            stockStatus={submittedReport.stockStatus}
            hasPhoto={submittedReport.hasPhoto}
            onReset={() => setSubmittedReport(null)}
          />
        ) : (
          <LaporFormCard
            commodities={currentCommodities}
            markets={currentMarkets}
            isSubmitting={isSubmitting}
            initialCommoditySlug={initialCommoditySlug}
            initialMarketId={initialMarketId}
            initialPrice={initialPrice}
            initialMode={initialMode}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <div className="lg:col-span-5 xl:col-span-5">
        <LaporVerificationCard />
      </div>
    </div>
  );
}
