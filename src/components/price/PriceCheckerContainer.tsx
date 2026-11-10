'use client';

import { useState, useMemo, useEffect, useCallback, type FormEvent } from 'react';
import { CommoditySummary, Market, PriceCheckResult } from '@/types';
import { submitPriceCheck } from '@/lib/api/price-check.api';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { resolveCanonicalMarket } from '@/lib/market-insights';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { PriceCheckForm, TAKARAN_UNITS } from './PriceCheckForm';
import { PriceEvaluationResultCard } from './PriceEvaluationResultCard';
import { PriceMethodologyCard } from './PriceMethodologyCard';
import { PriceInsufficientDataCard } from './PriceInsufficientDataCard';

interface Props {
  initialCommodities: CommoditySummary[];
  initialMarkets: Market[];
  initialCommoditySlug?: string;
  initialMarketId?: string;
}

export function PriceCheckerContainer({
  initialCommodities,
  initialMarkets,
  initialCommoditySlug,
  initialMarketId,
}: Props) {
  const { selectedRegion, regionMarkets } = useRegion();
  const { commodities: liveCommodities, markets: liveMarkets } = useLiveCatalog();

  const currentCommodities =
    liveCommodities.length > 0 ? liveCommodities : initialCommodities;

  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(() => {
    if (initialCommoditySlug) {
      const found = initialCommodities.find(
        (c) => c.slug === initialCommoditySlug || c.id === initialCommoditySlug
      );
      if (found) return found.id;
    }
    const cabaiRawit = initialCommodities.find((c) => c.slug === 'cabai-rawit-merah');
    return cabaiRawit ? cabaiRawit.id : initialCommodities[0]?.id || '';
  });

  const liveRegionMarkets = useMemo(() => {
    const source = liveMarkets.length > 0 ? liveMarkets : initialMarkets;
    return filterMarketsForRegion(source, selectedRegion.id);
  }, [liveMarkets, initialMarkets, selectedRegion.id]);

  const activeMarkets =
    liveRegionMarkets.length > 0
      ? liveRegionMarkets
      : regionMarkets.length > 0
      ? regionMarkets
      : initialMarkets;

  const [takaranAmount, setTakaranAmount] = useState<number>(2);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('ons');
  const [selectedMarketId, setSelectedMarketId] = useState<string>(() => {
    const resolved = resolveCanonicalMarket(activeMarkets, initialMarketId);
    return resolved?.id || activeMarkets[0]?.id || '';
  });

  useEffect(() => {
    if (initialMarketId) {
      const resolved = resolveCanonicalMarket(activeMarkets, initialMarketId);
      if (resolved) {
        setSelectedMarketId(resolved.id);
        return;
      }
    }
    if (activeMarkets.length > 0 && !activeMarkets.some((m) => m.id === selectedMarketId)) {
      setSelectedMarketId(activeMarkets[0].id);
    }
  }, [activeMarkets, selectedMarketId, initialMarketId]);

  const [rawPriceInput, setRawPriceInput] = useState<string>('Rp 15.000');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PriceCheckResult | null>(null);

  const numericRawPrice = useMemo(() => {
    return parseInt(rawPriceInput.replace(/\D/g, ''), 10) || 0;
  }, [rawPriceInput]);

  const normalizedPricePerKg = useMemo(() => {
    if (numericRawPrice <= 0) return 0;
    const unit = TAKARAN_UNITS.find((u) => u.id === selectedUnitId);
    if (!unit) return numericRawPrice;
    const totalGrams = takaranAmount * unit.gramMultiplier;
    if (totalGrams <= 0) return numericRawPrice;
    return Math.round((numericRawPrice * 1000) / totalGrams);
  }, [numericRawPrice, takaranAmount, selectedUnitId]);

  const selectedCommodity = useMemo(() => {
    return (
      currentCommodities.find((c) => c.id === selectedCommodityId) ||
      currentCommodities[0]
    );
  }, [currentCommodities, selectedCommodityId]);

  const selectedMarket = useMemo(() => {
    return (
      activeMarkets.find((m) => m.id === selectedMarketId) ||
      initialMarkets.find((m) => m.id === selectedMarketId)
    );
  }, [activeMarkets, initialMarkets, selectedMarketId]);

  const handlePriceChange = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10);
    if (isNaN(num)) {
      setRawPriceInput('');
    } else {
      setRawPriceInput(`Rp ${num.toLocaleString('id-ID')}`);
    }
  };

  const executeEvaluation = useCallback(async () => {
    if (!selectedCommodityId || normalizedPricePerKg <= 0) return;
    setLoading(true);
    try {
      const res = await submitPriceCheck({
        commodityId: selectedCommodityId,
        marketId: selectedMarketId,
        regionSlug: selectedRegion.slug,
        offeredPrice: normalizedPricePerKg,
        quantity: takaranAmount,
        unitId: selectedUnitId,
        offeredTotalPrice: numericRawPrice,
      });
      setResult(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [
    selectedCommodityId,
    normalizedPricePerKg,
    selectedMarketId,
    selectedRegion.slug,
    takaranAmount,
    selectedUnitId,
    numericRawPrice,
  ]);

  useEffect(() => {
    void executeEvaluation();
  }, [executeEvaluation]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void executeEvaluation();
  };

  const selectedUnitLabel =
    TAKARAN_UNITS.find((u) => u.id === selectedUnitId)?.label || 'Ons';

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <PriceCheckForm
          commodities={currentCommodities}
          markets={activeMarkets}
          selectedCommodityId={selectedCommodityId}
          onCommodityChange={setSelectedCommodityId}
          takaranAmount={takaranAmount}
          onTakaranAmountChange={setTakaranAmount}
          selectedUnitId={selectedUnitId}
          onUnitChange={setSelectedUnitId}
          selectedMarketId={selectedMarketId}
          onMarketChange={setSelectedMarketId}
          rawPriceInput={rawPriceInput}
          onPriceInputChange={handlePriceChange}
          normalizedPricePerKg={normalizedPricePerKg}
          standardUnit={selectedCommodity?.unit || 'kg'}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {result && selectedCommodity ? (
          <PriceEvaluationResultCard
            result={result}
            commodity={selectedCommodity}
            market={selectedMarket}
            takaranAmount={takaranAmount}
            takaranUnitLabel={selectedUnitLabel}
            rawPriceInput={rawPriceInput}
          />
        ) : loading ? (
          <div className="market-card bg-[var(--bg-card)] p-6 sm:p-7 flex items-center justify-center text-[var(--text-muted)] text-[13px] min-h-[260px]">
            Memuat hasil evaluasi kewajaran...
          </div>
        ) : (
          <PriceInsufficientDataCard
            commodityName={selectedCommodity?.name}
            marketName={selectedMarket?.name}
          />
        )}
      </div>

      <div className="w-full">
        <PriceMethodologyCard />
      </div>
    </div>
  );
}
