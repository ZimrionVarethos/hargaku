'use client';

import { useMemo } from 'react';
import { useAdminStore } from './admin-store';
import type { CommoditySummary, Market } from '@/types';
import { mapAdminCategoryToPublic, mapAdminMarketToPublic } from '@/lib/utils';

export function useLiveCatalog() {
  const { commodities, markets, dailyPrices, reports, isLoaded } = useAdminStore();

  const activeMarkets = useMemo(() => markets.filter((m) => m.isActive), [markets]);
  const activeCommodities = useMemo(() => commodities.filter((c) => c.isActive), [commodities]);

  const liveCommodities = useMemo<CommoditySummary[]>(() => {
    return activeCommodities.map((c) => {
      let sumCurrent = 0;
      let sumPrev = 0;
      let count = 0;

      for (const m of activeMarkets) {
        const record = dailyPrices[`${m.id}_${c.id}`];
        if (record && record.price > 0) {
          sumCurrent += record.price;
          sumPrev += record.previousPrice || record.price;
          count++;
        }
      }

      const currentAvgPrice = count > 0 ? Math.round(sumCurrent / count) : c.hapHetPrice;
      const previousAvgPrice = count > 0 ? Math.round(sumPrev / count) : c.hapHetPrice;
      const changePercentage =
        count > 0 && previousAvgPrice > 0 && currentAvgPrice !== previousAvgPrice
          ? Math.round(((currentAvgPrice - previousAvgPrice) / previousAvgPrice) * 1000) / 10
          : 0;

      const diffVsHap = currentAvgPrice - c.hapHetPrice;
      let statusVsHap: 'BELOW_HAP' | 'EQUAL_HAP' | 'ABOVE_HAP' = 'EQUAL_HAP';
      if (diffVsHap > c.hapHetPrice * 0.05) statusVsHap = 'ABOVE_HAP';
      else if (diffVsHap < -c.hapHetPrice * 0.05) statusVsHap = 'BELOW_HAP';

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        category: mapAdminCategoryToPublic(c.category),
        unit: c.unit,
        imageUrl: c.imageUrl || '/images/commodities/default.png',
        currentAvgPrice,
        previousAvgPrice,
        changePercentage,
        hapHetPrice: c.hapHetPrice,
        statusVsHap,
        lastUpdated: '06:00 WIB',
        sparkline: [previousAvgPrice, (previousAvgPrice + currentAvgPrice) / 2, currentAvgPrice],
        source: 'PIHPS',
      };
    });
  }, [activeCommodities, activeMarkets, dailyPrices]);

  const liveMarkets = useMemo<Market[]>(
    () => activeMarkets.map(mapAdminMarketToPublic),
    [activeMarkets]
  );

  return {
    isLoaded,
    commodities: liveCommodities,
    markets: liveMarkets,
    rawCommodities: activeCommodities,
    rawMarkets: activeMarkets,
    dailyPrices,
    reports,
  };
}
