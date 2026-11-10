'use client';

import { useState, useMemo, useEffect } from 'react';
import { CommoditySummary, Market, PriceCheckResult } from '@/types';
import { submitPriceCheck } from '@/lib/api/price-check.api';
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
  const { commodities: liveCommodities, markets: liveMarkets } = useLiveCatalog(selectedRegion.id);

  const currentCommodities =
    liveCommodities.length > 0 ? liveCommodities : initialCommodities;

  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(
    () => {
      if (initialCommoditySlug) {
        const found = initialCommodities.find((c) => c.slug === initialCommoditySlug);
        if (found) return found.id;
      }
      // Default to Cabai Rawit Merah (matching node SWBPt in pen app)
      const cabaiRawit = initialCommodities.find((c) => c.slug === 'cabai-rawit-merah');
      return cabaiRawit ? cabaiRawit.id : initialCommodities[0]?.id || '';
    }
  );

  const liveRegionMarkets = useMemo(() => {
    const filtered = liveMarkets.filter((m) => m.regionId === selectedRegion.id);
    return filtered.length > 0 ? filtered : liveMarkets;
  }, [liveMarkets, selectedRegion.id]);

  const activeMarkets =
    liveRegionMarkets.length > 0
      ? liveRegionMarkets
      : regionMarkets.length > 0
      ? regionMarkets
      : initialMarkets;

  const [takaranAmount, setTakaranAmount] = useState<number>(2);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('ons');
  const [selectedMarketId, setSelectedMarketId] = useState<string>(
    () => initialMarketId || activeMarkets[0]?.id || ''
  );

  // If selected market is not in active region's markets, reset to first market of region
  useEffect(() => {
    if (activeMarkets.length > 0 && !activeMarkets.some((m) => m.id === selectedMarketId)) {
      setSelectedMarketId(activeMarkets[0].id);
    }
  }, [activeMarkets, selectedMarketId]);

  // Default to Rp 15.000 for 2 ons (matching node SWBPt in pen app: Rp 15.000 per 2 ons = Rp 75.000/kg)
  const [rawPriceInput, setRawPriceInput] = useState<string>('Rp 15.000');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PriceCheckResult | null>(null);

  // Compute numeric price from string
  const numericRawPrice = useMemo(() => {
    return parseInt(rawPriceInput.replace(/\D/g, ''), 10) || 0;
  }, [rawPriceInput]);

  // Compute normalized price per standard kg or liter
  const normalizedPricePerKg = useMemo(() => {
    if (numericRawPrice <= 0) return 0;
    const unit = TAKARAN_UNITS.find((u) => u.id === selectedUnitId);
    if (!unit) return numericRawPrice;
    const totalGrams = takaranAmount * unit.gramMultiplier;
    if (totalGrams <= 0) return numericRawPrice;
    return Math.round((numericRawPrice * 1000) / totalGrams);
  }, [numericRawPrice, takaranAmount, selectedUnitId]);

  // Selected commodity object
  const selectedCommodity = useMemo(() => {
    return (
      currentCommodities.find((c) => c.id === selectedCommodityId) ||
      currentCommodities[0]
    );
  }, [currentCommodities, selectedCommodityId]);

  // Selected market object
  const selectedMarket = useMemo(() => {
    return activeMarkets.find((m) => m.id === selectedMarketId) || initialMarkets.find((m) => m.id === selectedMarketId);
  }, [activeMarkets, initialMarkets, selectedMarketId]);

  // Formatted price handler
  const handlePriceChange = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10);
    if (isNaN(num)) {
      setRawPriceInput('');
    } else {
      setRawPriceInput(`Rp ${num.toLocaleString('id-ID')}`);
    }
  };

  // Perform calculation
  const executeEvaluation = async () => {
    if (!selectedCommodityId || normalizedPricePerKg <= 0) return;
    setLoading(true);
    try {
      const res = await submitPriceCheck({
        commodityId: selectedCommodityId,
        marketId: selectedMarketId,
        regionSlug: selectedRegion.slug,
        offeredPrice: normalizedPricePerKg,
      });
      setResult(res);
    } catch {
      // Fallback evaluation
    } finally {
      setLoading(false);
    }
  };

  // Initial calculation on mount and when region changes
  useEffect(() => {
    executeEvaluation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommodityId, normalizedPricePerKg, selectedMarketId, selectedRegion.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeEvaluation();
  };

  const selectedUnitLabel =
    TAKARAN_UNITS.find((u) => u.id === selectedUnitId)?.label || 'Ons';

  return (
    <div className="flex flex-col gap-8">
      {/* Top Interactive Row: Form + Evaluation Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
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
          <div className="bg-white rounded-[18px] outline outline-1 outline-[#E5E3DE] p-6 sm:p-7 shadow-xs flex items-center justify-center text-[#8C8B85] text-[13px]">
            Memuat hasil evaluasi kewajaran...
          </div>
        ) : (
          <PriceInsufficientDataCard
            commodityName={selectedCommodity?.name}
            marketName={selectedMarket?.name}
          />
        )}
      </div>

      {/* Bottom Knowledge Row: Comprehensive Methodology */}
      <div className="w-full">
        <PriceMethodologyCard />
      </div>
    </div>
  );
}
