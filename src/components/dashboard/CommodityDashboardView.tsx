'use client';

import { useState, useMemo } from 'react';
import { CommoditySummary } from '@/types';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import {
  DashboardFilterBar,
  type DashboardCategoryFilter,
  type DashboardSort,
} from './DashboardFilterBar';
import { TactileCommodityCard } from './TactileCommodityCard';
import { CommodityLedgerTable } from './CommodityLedgerTable';
import { StatusLegendCard } from './StatusLegendCard';
import { PriceSurgeAlertBanner } from './PriceSurgeAlertBanner';

interface Props {
  initialCommodities: CommoditySummary[];
}

export function CommodityDashboardView({ initialCommodities }: Props) {
  const { commodities: liveCommodities, markets: liveMarkets } = useLiveCatalog();
  const currentCommodities = liveCommodities.length > 0 ? liveCommodities : initialCommodities;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState<DashboardSort>('CHANGE_DESC');
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<DashboardCategoryFilter>('ALL');

  const processedCommodities = useMemo(() => {
    let list = [...currentCommodities];

    if (selectedCategory !== 'ALL') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }

    switch (selectedSort) {
      case 'CHANGE_DESC':
        list.sort((a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage));
        break;
      case 'PRICE_ASC':
        list.sort((a, b) => a.currentAvgPrice - b.currentAvgPrice);
        break;
      case 'PRICE_DESC':
        list.sort((a, b) => b.currentAvgPrice - a.currentAvgPrice);
        break;
      case 'NAME_ASC':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [currentCommodities, selectedCategory, searchQuery, selectedSort]);

  return (
    <div className="flex flex-col gap-8">
      <PriceSurgeAlertBanner />

      <DashboardFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        isLightMode={isLightMode}
        onToggleLightMode={() => setIsLightMode((prev) => !prev)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalCount={currentCommodities.length}
        markets={liveMarkets}
      />

      {processedCommodities.length === 0 ? (
        <div className="w-full py-16 text-center bg-white rounded-[16px] outline outline-1 outline-[#E5E3DE] flex flex-col items-center justify-center gap-2">
          <p className="text-[15px] font-semibold text-[#1B1A18]">
            Tidak ada komoditas yang cocok dengan pencarian &quot;{searchQuery}&quot;
          </p>
          <p className="text-[13px] text-[#6E6D67]">
            Coba gunakan kata kunci umum seperti beras, telur, atau cabai.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="mt-3 px-4 py-2 rounded-[8px] bg-[#1B1A18] text-white text-[12px] font-medium hover:bg-black transition-colors"
          >
            Reset Filter
          </button>
        </div>
      ) : isLightMode ? (
        <CommodityLedgerTable commodities={processedCommodities} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {processedCommodities.map((commodity) => (
            <TactileCommodityCard key={commodity.id} commodity={commodity} />
          ))}
        </div>
      )}

      <StatusLegendCard />
    </div>
  );
}
