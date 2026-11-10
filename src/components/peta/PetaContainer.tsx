'use client';

import { useState, useMemo } from 'react';
import { PETA_COMMODITIES, PetaMarketPrice } from './peta-data';
import { PetaFilterSidebar } from './PetaFilterSidebar';
import { PetaSpatialStage } from './PetaSpatialStage';
import { PetaMarketRankTable } from './PetaMarketRankTable';
import { CommoditySummary } from '@/types';
import { useRegion } from '@/lib/store/region-store';
import { filterMarketsForRegion, getMarketsByRegion } from '@/lib/mock/markets.data';
import { computeMarketInsights } from '@/lib/market-insights';
import { findMatchingCommodity } from '@/lib/market-matching';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';

interface Props {
  initialCommodities: CommoditySummary[];
}

export function PetaContainer({ initialCommodities }: Props) {
  const { selectedRegion } = useRegion();
  const { commodities: liveCommodities, rawCommodities, rawMarkets, dailyPrices, reports } = useLiveCatalog();
  const catalogCommodities = liveCommodities.length > 0 ? liveCommodities : initialCommodities;
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(() => {
    const preferred =
      catalogCommodities.find((c) => c.slug === 'cabai-rawit-merah' || c.id === 'cabai-rawit-merah') ||
      catalogCommodities[0];
    return preferred?.id || PETA_COMMODITIES[0].id;
  });
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const currentRegionMarkets = useMemo(() => {
    const filtered = filterMarketsForRegion(rawMarkets, selectedRegion.id);
    if (filtered.length > 0) return filtered;
    return getMarketsByRegion(selectedRegion.id);
  }, [rawMarkets, selectedRegion.id]);

  const activeCom = useMemo(() => {
    const selectedFromSidebar = catalogCommodities.find(
      (c) => c.id === selectedCommodityId || c.slug === selectedCommodityId
    );
    const fromCatalog =
      rawCommodities.find((c) => c.id === selectedCommodityId || c.slug === selectedCommodityId) ||
      (selectedFromSidebar
        ? findMatchingCommodity(rawCommodities, {
            commodityId: selectedFromSidebar.id,
            commodityName: selectedFromSidebar.name,
          })
        : undefined);

    if (fromCatalog) {
      return {
        id: fromCatalog.id,
        name: fromCatalog.name,
        unit: fromCatalog.unit,
        basePrice: fromCatalog.hapHetPrice,
      };
    }
    if (selectedFromSidebar) {
      return {
        id: selectedFromSidebar.id,
        name: selectedFromSidebar.name,
        unit: selectedFromSidebar.unit,
        basePrice: selectedFromSidebar.hapHetPrice,
      };
    }
    const fromFallback = PETA_COMMODITIES.find((c) => c.id === selectedCommodityId) || PETA_COMMODITIES[0];
    return {
      id: fromFallback.id,
      name: fromFallback.name,
      unit: fromFallback.unit,
      basePrice: fromFallback.cityAvgPrice,
    };
  }, [catalogCommodities, rawCommodities, selectedCommodityId]);

  const activeSidebarCommodityId =
    catalogCommodities.find((c) => c.id === selectedCommodityId || c.slug === selectedCommodityId)?.id ||
    catalogCommodities[0]?.id ||
    selectedCommodityId;

  const baseRegionalPrice =
    Math.round(
      (activeCom.basePrice * (1 + (selectedRegion.logisticsCostPct || 0) / 100)) / 100
    ) * 100;

  const marketsWithPrice: PetaMarketPrice[] = useMemo(
    () =>
      currentRegionMarkets.map((info, idx) => {
        const dailyRecord = dailyPrices[`${info.id}_${activeCom.id}`];
        const livePrice = dailyRecord && dailyRecord.price > 0 ? dailyRecord.price : null;

        const variationMultiplier = idx === 0 ? 0.96 : idx === 1 ? 0.99 : idx === 2 ? 1.02 : 1.04;
        const computedPrice =
          livePrice || Math.round((baseRegionalPrice * variationMultiplier) / 100) * 100;
        const diffPercent =
          baseRegionalPrice > 0
            ? Math.round(((computedPrice - baseRegionalPrice) / baseRegionalPrice) * 1000) / 10
            : 0;
        const status =
          diffPercent < -2
            ? ('cheaper' as const)
            : diffPercent > 2
            ? ('expensive' as const)
            : ('average' as const);

        const insights = computeMarketInsights({
          marketId: info.id,
          marketName: info.name,
          commodities: rawCommodities,
          markets: rawMarkets,
          dailyPrices,
          reports,
          disparityIndex: selectedRegion.disparityIndex,
        });

        const totalReports =
          insights.approvedPriceReportCount + insights.approvedShortageReportCount;
        const alertHeadline =
          insights.expensiveItems[0]
            ? `${insights.expensiveItems[0].commodityName} +${insights.expensiveItems[0].diffPercent}%`
            : insights.shortageAlerts[0]
            ? `${insights.shortageAlerts[0].commodityName} (${insights.shortageAlerts[0].stockStatus})`
            : undefined;

        return {
          marketId: info.id,
          name: info.name,
          shortName: info.name.replace('Pasar ', '').split(' (')[0],
          district: info.district,
          address: info.landmarkNote
            ? `${info.district}, ${info.city} · ${info.landmarkNote}`
            : `${info.district}, ${info.city}`,
          latitude: info.latitude,
          longitude: info.longitude,
          xPercent: 50,
          yPercent: 50,
          price: computedPrice,
          regionalAvgPrice: baseRegionalPrice,
          diffPercent,
          status,
          reportsCount: totalReports,
          nearStation: insights.nearStation,
          landmarkNote: insights.landmarkNote,
          expensiveItemsCount: insights.expensiveItems.length,
          shortageCount: insights.shortageAlerts.length,
          alertHeadline,
          lastUpdated: '06:00 WIB',
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${info.name} ${info.city}`)}`,
        };
      }),
    [
      currentRegionMarkets,
      dailyPrices,
      activeCom.id,
      baseRegionalPrice,
      rawCommodities,
      rawMarkets,
      reports,
      selectedRegion.disparityIndex,
    ]
  );

  const activeMarketId =
    marketsWithPrice.find((m) => m.marketId === selectedMarketId)?.marketId ||
    marketsWithPrice[0]?.marketId ||
    '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-[96px]">
        <PetaFilterSidebar
          commodities={catalogCommodities}
          selectedCommodityId={activeSidebarCommodityId}
          onCommodityChange={setSelectedCommodityId}
          isLightMode={isLightMode}
          onToggleLightMode={() => setIsLightMode(!isLightMode)}
        />
      </div>

      <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
        {!isLightMode ? (
          <>
            <PetaSpatialStage
              markets={marketsWithPrice}
              selectedMarketId={activeMarketId}
              onSelectMarket={setSelectedMarketId}
              commodityName={activeCom.name}
              commoditySlug={activeCom.id}
              commodityUnit={activeCom.unit}
            />
            <PetaMarketRankTable
              markets={marketsWithPrice}
              selectedMarketId={activeMarketId}
              onSelectMarket={setSelectedMarketId}
              commodityName={activeCom.name}
              commodityUnit={activeCom.unit}
            />
          </>
        ) : (
          <>
            <PetaMarketRankTable
              markets={marketsWithPrice}
              selectedMarketId={activeMarketId}
              onSelectMarket={setSelectedMarketId}
              commodityName={activeCom.name}
              commodityUnit={activeCom.unit}
            />
            <div className="market-card p-4 bg-[var(--bg-card)] text-[13px] text-[var(--text-secondary)] flex items-center justify-between gap-3">
              <span>Mode Ringan aktif untuk menghemat kuota dan mempermudah pembacaan data.</span>
              <button
                type="button"
                onClick={() => setIsLightMode(false)}
                className="text-[12px] font-bold text-[var(--text-primary)] underline hover:no-underline cursor-pointer"
              >
                Kembalikan Peta Visual
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
