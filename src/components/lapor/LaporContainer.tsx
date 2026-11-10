'use client';

import { useState } from 'react';
import { CommoditySummary, Market } from '@/types';
import { LaporFormCard } from './LaporFormCard';
import { LaporVerificationCard } from './LaporVerificationCard';
import { LaporSuccessCard } from './LaporSuccessCard';
import { submitCitizenReport } from '@/lib/api/reports.api';
import { useRegion } from '@/lib/store/region-store';
import { useAdminStore } from '@/lib/store/admin-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';

interface Props {
  commodities: CommoditySummary[];
  markets: Market[];
}

interface SubmittedReportState {
  reportId: string;
  commodityName: string;
  marketName: string;
  pricePerUnit: number;
  unitLabel: string;
  normalizedPricePerKg: number;
  hasPhoto: boolean;
}

export function LaporContainer({ commodities, markets }: Props) {
  const { regionMarkets } = useRegion();
  const { addReport } = useAdminStore();
  const { commodities: liveCommodities, markets: liveMarkets } = useLiveCatalog();

  const currentCommodities = liveCommodities.length > 0 ? liveCommodities : commodities;
  const currentMarkets =
    liveMarkets.length > 0 ? liveMarkets : regionMarkets.length > 0 ? regionMarkets : markets;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReport, setSubmittedReport] =
    useState<SubmittedReportState | null>(null);

  const handleSubmit = async (data: {
    commodityId: string;
    marketId: string;
    price: number;
    unit: string;
    normalizedPrice: number;
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
        unit: data.unit,
        normalizedPrice: data.normalizedPrice,
        purchaseDate: data.purchaseDate,
        photoFile: data.photoFile,
        notes: data.notes,
      });

      const matchedCommodity = currentCommodities.find(
        (c) => c.id === data.commodityId
      );
      const matchedMarket = currentMarkets.find((m) => m.id === data.marketId);

      const hapPrice = matchedCommodity?.hapHetPrice || data.normalizedPrice;
      const diffPercent =
        hapPrice > 0
          ? Math.round(((data.normalizedPrice - hapPrice) / hapPrice) * 1000) / 10
          : 0;
      const isAnomaly = Math.abs(diffPercent) > 25;

      const recordToAdd = res.data.reportRecord
        ? {
            ...res.data.reportRecord,
            photoUrl: data.photoFile ? URL.createObjectURL(data.photoFile) : undefined,
          }
        : {
            id: res.data.reportId,
            commodityName: matchedCommodity?.name || 'Komoditas Pangan',
            marketName: matchedMarket?.name || 'Pasar Tradisional',
            reportedPrice: data.price,
            unit: data.unit,
            normalizedPricePerKg: data.normalizedPrice,
            officialHapPrice: hapPrice,
            cityAvgPrice: matchedCommodity?.currentAvgPrice || hapPrice,
            diffPercent,
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
        marketName: matchedMarket?.name || 'Pasar Tradisional',
        pricePerUnit: data.price,
        unitLabel: data.unit,
        normalizedPricePerKg: data.normalizedPrice,
        hasPhoto: !!data.photoFile,
      });
    } catch {
      // In case of simulated error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form or Success */}
      <div className="lg:col-span-7 xl:col-span-7">
        {submittedReport ? (
          <LaporSuccessCard
            reportId={submittedReport.reportId}
            commodityName={submittedReport.commodityName}
            marketName={submittedReport.marketName}
            pricePerUnit={submittedReport.pricePerUnit}
            unitLabel={submittedReport.unitLabel}
            normalizedPricePerKg={submittedReport.normalizedPricePerKg}
            hasPhoto={submittedReport.hasPhoto}
            onReset={() => setSubmittedReport(null)}
          />
        ) : (
          <LaporFormCard
            commodities={currentCommodities}
            markets={currentMarkets}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Right Column: Verification Pipeline & Security Guarantees */}
      <div className="lg:col-span-5 xl:col-span-5">
        <LaporVerificationCard />
      </div>
    </div>
  );
}
