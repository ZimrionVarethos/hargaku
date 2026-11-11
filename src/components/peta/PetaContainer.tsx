'use client';

import { useMemo, useState } from 'react';
import { List, MapTrifold } from '@phosphor-icons/react';
import { PETA_COMMODITIES, PetaMarketPrice } from './peta-data';
import { PetaSpatialStage } from './PetaSpatialStage';
import { PetaMarketRankTable } from './PetaMarketRankTable';
import { PetaHamburgerDrawer } from './PetaHamburgerDrawer';
import { CommoditySummary } from '@/types';
import { useRegion } from '@/lib/store/region-store';
import { filterMarketsForRegion, getMarketsByRegion } from '@/lib/mock/markets.data';
import { computeMarketInsights } from '@/lib/market-insights';
import {
  STATION_MARKET_LANDMARKS,
  findMatchingCommodity,
  normalizeMarketKey,
} from '@/lib/market-matching';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';

interface Props {
  initialCommodities: CommoditySummary[];
}

export function PetaContainer({ initialCommodities }: Props) {
  const { selectedRegion } = useRegion();
  const { commodities: liveCommodities, rawCommodities, rawMarkets, dailyPrices, reports } =
    useLiveCatalog();
  const catalogCommodities = liveCommodities.length > 0 ? liveCommodities : initialCommodities;
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(() => {
    const preferred =
      catalogCommodities.find((c) => c.slug === 'cabai-rawit-merah' || c.id === 'cabai-rawit-merah') ||
      catalogCommodities[0];
    return preferred?.id || PETA_COMMODITIES[0].id;
  });
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [focusSeq, setFocusSeq] = useState<number>(0);

  const currentRegionMarkets = useMemo(() => {
    const liveFiltered = filterMarketsForRegion(rawMarkets, selectedRegion.id);
    const seedFiltered = getMarketsByRegion(selectedRegion.id);
    const dedupedLive: typeof liveFiltered = [];
    const seenCanonical = new Set<string>();

    const sortedLive = [...liveFiltered].sort((a, b) => {
      if (a.id === 'mkt_kebon_kembang') return -1;
      if (b.id === 'mkt_kebon_kembang') return 1;
      return 0;
    });

    for (const m of sortedLive) {
      const canonical = normalizeMarketKey(m.id) || normalizeMarketKey(m.name) || m.id;
      if (seenCanonical.has(canonical)) continue;
      seenCanonical.add(canonical);
      dedupedLive.push(m);
    }

    if (dedupedLive.length === 0) return seedFiltered;

    const supplemented = seedFiltered.filter((s) => {
      const canonical = normalizeMarketKey(s.id) || normalizeMarketKey(s.name) || s.id;
      return !seenCanonical.has(canonical);
    });
    return [...dedupedLive, ...supplemented];
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
    const fromFallback =
      PETA_COMMODITIES.find((c) => c.id === selectedCommodityId) || PETA_COMMODITIES[0];
    return {
      id: fromFallback.id,
      name: fromFallback.name,
      unit: fromFallback.unit,
      basePrice: fromFallback.cityAvgPrice,
    };
  }, [catalogCommodities, rawCommodities, selectedCommodityId]);

  const activeSidebarCommodityId =
    catalogCommodities.find((c) => c.id === selectedCommodityId || c.slug === selectedCommodityId)
      ?.id ||
    catalogCommodities[0]?.id ||
    selectedCommodityId;

  const baseRegionalPrice =
    Math.round(
      (activeCom.basePrice * (1 + (selectedRegion.logisticsCostPct || 0) / 100)) / 100
    ) * 100;

  const marketsWithPrice: PetaMarketPrice[] = useMemo(
    () =>
      currentRegionMarkets.map((info, idx) => {
        const canonicalId = normalizeMarketKey(info.id) || info.id;
        const dailyRecord =
          dailyPrices[`${info.id}_${activeCom.id}`] ||
          dailyPrices[`${canonicalId}_${activeCom.id}`] ||
          (canonicalId === 'mkt_kebon_kembang'
            ? dailyPrices[`mkt_pasar_anyar_${activeCom.id}`]
            : undefined);
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
          marketId: canonicalId,
          marketName: info.name,
          commodities: rawCommodities,
          markets: rawMarkets,
          dailyPrices,
          reports,
          disparityIndex: selectedRegion.disparityIndex,
        });

        const landmarkNote = info.landmarkNote || STATION_MARKET_LANDMARKS[canonicalId];
        const nearStation = Boolean(info.nearStation || landmarkNote || insights.nearStation);
        const totalReports =
          insights.approvedPriceReportCount + insights.approvedShortageReportCount;
        const alertHeadline = insights.expensiveItems[0]
          ? `${insights.expensiveItems[0].commodityName} +${insights.expensiveItems[0].diffPercent}%`
          : insights.shortageAlerts[0]
          ? `${insights.shortageAlerts[0].commodityName} (${insights.shortageAlerts[0].stockStatus})`
          : undefined;

        return {
          marketId: info.id,
          name: info.name,
          shortName: info.name.replace('Pasar ', '').split(' (')[0],
          district: info.district,
          address: landmarkNote
            ? `${info.district}, ${info.city} · ${landmarkNote}`
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
          nearStation,
          landmarkNote,
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

  const handleSelectMarket = (marketId: string, shouldFly = false) => {
    setSelectedMarketId(marketId);
    if (shouldFly) {
      setFocusSeq((n) => n + 1);
    }
  };

  return (
    <div className="w-full">
      {!isLightMode ? (
        <PetaSpatialStage
          markets={marketsWithPrice}
          selectedMarketId={activeMarketId}
          onSelectMarket={(id) => handleSelectMarket(id, false)}
          commodityName={activeCom.name}
          commoditySlug={activeCom.id}
          commodityUnit={activeCom.unit}
          regionName={selectedRegion.name}
          isMenuOpen={isMenuOpen}
          onOpenMenu={() => setIsMenuOpen(true)}
          onEnableLightMode={() => setIsLightMode(true)}
          focusSeq={focusSeq}
          onRequestFocusSelected={() => setFocusSeq((n) => n + 1)}
        />
      ) : (
        <div className="max-w-7xl mx-auto flex flex-col gap-4 py-2 sm:py-4">
          <div className="market-card p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-expanded={isMenuOpen}
                aria-controls="peta-hamburger-drawer"
                className="market-btn-primary h-10 px-3.5 text-[12px] font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <List size={18} weight="bold" aria-hidden="true" />
                <span>Filter &amp; Pasar</span>
              </button>
              <span className="text-[13px] font-bold text-[var(--text-primary)]">
                Mode Ringan &middot; {activeCom.name} ({selectedRegion.name})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightMode(false)}
              className="market-btn-secondary h-10 px-3.5 text-[12px] font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <MapTrifold size={15} weight="bold" />
              <span>Kembalikan Peta Mapbox</span>
            </button>
          </div>

          <PetaMarketRankTable
            markets={marketsWithPrice}
            selectedMarketId={activeMarketId}
            onSelectMarket={(id) => handleSelectMarket(id, false)}
            commodityName={activeCom.name}
            commodityUnit={activeCom.unit}
          />
        </div>
      )}

      <PetaHamburgerDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        regionName={selectedRegion.name}
        regionPhase={selectedRegion.phase || 1}
        commodities={catalogCommodities}
        selectedCommodityId={activeSidebarCommodityId}
        onCommodityChange={setSelectedCommodityId}
        commodityName={activeCom.name}
        commodityUnit={activeCom.unit}
        regionalAvgPrice={baseRegionalPrice}
        markets={marketsWithPrice}
        selectedMarketId={activeMarketId}
        onSelectMarket={handleSelectMarket}
        isLightMode={isLightMode}
        onToggleLightMode={() => setIsLightMode((prev) => !prev)}
      />
    </div>
  );
}
