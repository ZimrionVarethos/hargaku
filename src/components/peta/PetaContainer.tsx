'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { List, MapTrifold } from '@phosphor-icons/react';
import { PETA_COMMODITIES, PetaMarketPrice } from './peta-data';
import { PetaSpatialStage } from './PetaSpatialStage';
import { PetaMarketRankTable } from './PetaMarketRankTable';
import { PetaHamburgerDrawer } from './PetaHamburgerDrawer';
import { CommoditySummary } from '@/types';
import { useRegion } from '@/lib/store/region-store';
import { MOCK_MARKETS } from '@/lib/mock/markets.data';
import { findMatchingCommodity, normalizeMarketKey } from '@/lib/market-matching';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { buildPetaMarketPrices, buildRegionMarketsList } from './peta-market-builder';

interface Props {
  initialCommodities: CommoditySummary[];
  initialMarketId?: string;
  initialCommoditySlug?: string;
  initialRegionSlug?: string;
}

export function PetaContainer({
  initialCommodities,
  initialMarketId,
  initialCommoditySlug,
  initialRegionSlug,
}: Props) {
  const { selectedRegion, allRegions, setSelectedRegion } = useRegion();
  const { commodities: liveCommodities, rawCommodities, rawMarkets, dailyPrices, reports } =
    useLiveCatalog();
  const catalogCommodities = liveCommodities.length > 0 ? liveCommodities : initialCommodities;
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(() => {
    if (initialCommoditySlug) {
      const targetCom = catalogCommodities.find(
        (c) => c.slug === initialCommoditySlug || c.id === initialCommoditySlug
      );
      if (targetCom) return targetCom.id;
    }
    const preferred =
      catalogCommodities.find((c) => c.slug === 'cabai-rawit-merah' || c.id === 'cabai-rawit-merah') ||
      catalogCommodities[0];
    return preferred?.id || PETA_COMMODITIES[0].id;
  });
  const [selectedMarketId, setSelectedMarketId] = useState<string>(initialMarketId || '');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [focusSeq, setFocusSeq] = useState<number>(initialMarketId ? 1 : 0);
  const syncedDeepLinkRef = useRef<string>('');

  useEffect(() => {
    const deepKey = `${initialRegionSlug || ''}|${initialMarketId || ''}`;
    if (!initialRegionSlug && !initialMarketId) return;
    if (syncedDeepLinkRef.current === deepKey) return;
    syncedDeepLinkRef.current = deepKey;

    if (initialRegionSlug) {
      const targetReg = allRegions.find(
        (r) => r.id === initialRegionSlug || r.slug === initialRegionSlug
      );
      if (targetReg && targetReg.id !== selectedRegion.id) {
        setSelectedRegion(targetReg);
      }
    } else if (initialMarketId) {
      const marketPool = rawMarkets.length > 0 ? rawMarkets : MOCK_MARKETS;
      const targetMkt = marketPool.find(
        (m) =>
          m.id === initialMarketId ||
          normalizeMarketKey(m.id) === normalizeMarketKey(initialMarketId)
      );
      if (targetMkt?.regionId) {
        const targetReg = allRegions.find((r) => r.id === targetMkt.regionId);
        if (targetReg && targetReg.id !== selectedRegion.id) {
          setSelectedRegion(targetReg);
        }
      }
    }

    if (initialMarketId) {
      setSelectedMarketId(initialMarketId);
      setFocusSeq((n) => n + 1);
    }
  }, [initialRegionSlug, initialMarketId, allRegions, rawMarkets, selectedRegion.id, setSelectedRegion]);

  const currentRegionMarkets = useMemo(
    () => buildRegionMarketsList(rawMarkets, selectedRegion.id),
    [rawMarkets, selectedRegion.id]
  );

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
      buildPetaMarketPrices({
        markets: currentRegionMarkets,
        dailyPrices,
        commodityId: activeCom.id,
        baseRegionalPrice,
        rawCommodities,
        rawMarkets,
        reports,
        selectedRegion,
      }),
    [
      currentRegionMarkets,
      dailyPrices,
      activeCom.id,
      baseRegionalPrice,
      rawCommodities,
      rawMarkets,
      reports,
      selectedRegion,
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
