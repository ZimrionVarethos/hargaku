'use client';

import { useState, useMemo } from 'react';
import { PETA_COMMODITIES, PetaMarketPrice } from './peta-data';
import { PetaFilterSidebar } from './PetaFilterSidebar';
import { PetaSpatialStage } from './PetaSpatialStage';
import { PetaMarketRankTable } from './PetaMarketRankTable';
import { CommoditySummary } from '@/types';
import { useRegion } from '@/lib/store/region-store';
import { getMarketsByRegion } from '@/lib/mock/markets.data';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';

interface Props {
  initialCommodities: CommoditySummary[];
}

export function PetaContainer({ initialCommodities }: Props) {
  const { selectedRegion } = useRegion();
  const { rawMarkets, dailyPrices } = useLiveCatalog();
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    PETA_COMMODITIES[0].id
  );
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const currentRegionMarkets = useMemo(() => {
    const regionFiltered = rawMarkets.filter(
      (m) =>
        m.regionId === selectedRegion.id ||
        m.city?.toLowerCase().includes(selectedRegion.name.toLowerCase()) ||
        (selectedRegion.province && m.city?.toLowerCase().includes(selectedRegion.province.toLowerCase()))
    );

    if (regionFiltered.length > 0) {
      return regionFiltered.map((m) => ({
        id: m.id,
        name: m.name,
        city: m.city,
        district: m.district,
        latitude: m.latitude,
        longitude: m.longitude,
      }));
    }

    return getMarketsByRegion(selectedRegion.id);
  }, [rawMarkets, selectedRegion]);

  const activeCommodity =
    PETA_COMMODITIES.find((c) => c.id === selectedCommodityId) ||
    PETA_COMMODITIES[0];

  const baseRegionalPrice =
    Math.round(
      (activeCommodity.cityAvgPrice * (1 + (selectedRegion.logisticsCostPct || 0) / 100)) / 100
    ) * 100;

  const marketsWithPrice: PetaMarketPrice[] = useMemo(
    () =>
      currentRegionMarkets.map((info, idx) => {
        const dailyRecord = dailyPrices[`${info.id}_${selectedCommodityId}`];
        const livePrice = dailyRecord && dailyRecord.price > 0 ? dailyRecord.price : null;

        const variationMultiplier = idx === 0 ? 0.96 : idx === 1 ? 0.99 : idx === 2 ? 1.02 : 1.04;
        const computedPrice = livePrice || Math.round((baseRegionalPrice * variationMultiplier) / 100) * 100;
        const diffPercent = Math.round(((computedPrice - baseRegionalPrice) / baseRegionalPrice) * 1000) / 10;
        const status =
          diffPercent < -2
            ? ('cheaper' as const)
            : diffPercent > 2
            ? ('expensive' as const)
            : ('average' as const);

        return {
          marketId: info.id,
          name: info.name,
          shortName: info.name.replace('Pasar ', '').split(' (')[0],
          district: info.district,
          address: `${info.district}, ${info.city}`,
          latitude: info.latitude,
          longitude: info.longitude,
          xPercent: 50,
          yPercent: 50,
          price: computedPrice,
          regionalAvgPrice: baseRegionalPrice,
          diffPercent,
          status,
          reportsCount: 6 + idx * 3,
          lastUpdated: '06:00 WIB',
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${info.name} ${info.city}`)}`,
        };
      }),
    [currentRegionMarkets, dailyPrices, selectedCommodityId, baseRegionalPrice]
  );

  const activeMarketId =
    marketsWithPrice.find((m) => m.marketId === selectedMarketId)?.marketId ||
    marketsWithPrice[0]?.marketId ||
    '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-[96px]">
        <PetaFilterSidebar
          commodities={initialCommodities}
          selectedCommodityId={selectedCommodityId}
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
              commodityName={activeCommodity.name}
              commoditySlug={activeCommodity.id}
            />
            <PetaMarketRankTable
              markets={marketsWithPrice}
              selectedMarketId={activeMarketId}
              onSelectMarket={setSelectedMarketId}
              commodityName={activeCommodity.name}
            />
          </>
        ) : (
          <>
            <PetaMarketRankTable
              markets={marketsWithPrice}
              selectedMarketId={activeMarketId}
              onSelectMarket={setSelectedMarketId}
              commodityName={activeCommodity.name}
            />
            <div className="p-4 rounded-[14px] bg-white outline outline-1 outline-[#E5E3DE] text-[13px] text-[#6E6D67] flex items-center justify-between">
              <span>Mode Ringan aktif untuk menghemat kuota dan mempermudah pembacaan data.</span>
              <button
                type="button"
                onClick={() => setIsLightMode(false)}
                className="text-[12px] font-bold text-[#1B1A18] underline hover:no-underline"
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
