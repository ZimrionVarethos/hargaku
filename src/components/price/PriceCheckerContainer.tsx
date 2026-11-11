'use client';

import { useState, useMemo, useEffect, useCallback, useRef, type FormEvent } from 'react';
import { CommoditySummary, Market, PriceCheckResult } from '@/types';
import { submitPriceCheck } from '@/lib/api/price-check.api';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { resolveCanonicalMarket } from '@/lib/market-insights';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { useAssistant } from '@/lib/store/assistant-store';
import { PriceCheckForm } from './PriceCheckForm';
import { TAKARAN_UNITS, type PriceQuickPreset } from './price-check-presets';
import { PriceEvaluationResultCard } from './PriceEvaluationResultCard';
import { PriceMethodologyCard } from './PriceMethodologyCard';
import { PriceInsufficientDataCard } from './PriceInsufficientDataCard';
import { PuntenIntegratedPanel } from './PuntenIntegratedPanel';

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
  const { sendMessage } = useAssistant();

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

  const targetSlugRef = useRef<string>(
    initialCommodities.find((c) => c.id === selectedCommodityId || c.slug === initialCommoditySlug)?.slug ||
      initialCommoditySlug ||
      'cabai-rawit-merah'
  );

  useEffect(() => {
    if (currentCommodities.length === 0) return;
    if (currentCommodities.some((c) => c.id === selectedCommodityId)) return;
    const matched =
      currentCommodities.find((c) => c.slug === targetSlugRef.current || c.id === targetSlugRef.current) ||
      currentCommodities[0];
    if (matched) {
      targetSlugRef.current = matched.slug;
      setSelectedCommodityId(matched.id);
    }
  }, [currentCommodities, selectedCommodityId]);

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

  const [takaranAmount, setTakaranAmount] = useState<number>(1);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('quarter');
  const [activePresetId, setActivePresetId] = useState<string | null>(
    initialCommoditySlug ? null : 'preset_cabai'
  );
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

  const [rawPriceInput, setRawPriceInput] = useState<string>('Rp 18.000');
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
      currentCommodities.find((c) => c.slug === targetSlugRef.current) ||
      currentCommodities[0]
    );
  }, [currentCommodities, selectedCommodityId]);

  const effectiveCommodityId = selectedCommodity?.id || selectedCommodityId;

  const selectedMarket = useMemo(() => {
    return (
      activeMarkets.find((m) => m.id === selectedMarketId) ||
      initialMarkets.find((m) => m.id === selectedMarketId)
    );
  }, [activeMarkets, initialMarkets, selectedMarketId]);

  const handlePriceChange = (val: string) => {
    setActivePresetId(null);
    const num = parseInt(val.replace(/\D/g, ''), 10);
    if (isNaN(num)) {
      setRawPriceInput('');
    } else {
      setRawPriceInput(`Rp ${num.toLocaleString('id-ID')}`);
    }
  };

  const handleApplyPreset = (preset: PriceQuickPreset) => {
    let matched = currentCommodities.find((c) =>
      preset.slugHints.some((hint) => c.slug === hint || c.id === hint)
    );
    if (!matched) {
      matched = currentCommodities.find((c) =>
        preset.slugHints.some((hint) => c.slug.includes(hint) || c.name.toLowerCase().includes(hint))
      );
    }
    if (matched) {
      targetSlugRef.current = matched.slug;
      setSelectedCommodityId(matched.id);
    }
    setTakaranAmount(preset.amount);
    setSelectedUnitId(preset.unitId);
    setRawPriceInput(`Rp ${preset.price.toLocaleString('id-ID')}`);
    setActivePresetId(preset.id);
  };

  const executeEvaluation = useCallback(async () => {
    if (!effectiveCommodityId || normalizedPricePerKg <= 0) return;
    setLoading(true);
    try {
      const res = await submitPriceCheck({
        commodityId: effectiveCommodityId,
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
    effectiveCommodityId,
    normalizedPricePerKg,
    selectedMarketId,
    selectedRegion.slug,
    takaranAmount,
    selectedUnitId,
    numericRawPrice,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void executeEvaluation();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [executeEvaluation]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void executeEvaluation();
  };

  const handleAskPuntenForOffer = () => {
    if (!selectedCommodity || !result) return;
    const location = selectedMarket?.name || result.regionName || 'pasar rakyat';
    const unit = TAKARAN_UNITS.find((u) => u.id === selectedUnitId);
    const portionDesc = `${takaranAmount} ${unit?.shortLabel || 'kg'}`;
    const prompt = `Saya ditawari ${selectedCommodity.name} ${portionDesc} seharga ${rawPriceInput} (status: ${result.statusLabel}) di ${location}. Harga pasar wajarnya sekitar Rp ${result.comparisonPrice.toLocaleString('id-ID')}/${selectedCommodity.unit}. Kasih saran tawar yang pas dan cek apakah ada pasar lebih murah di sekitar sini.`;
    document.getElementById('punten-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void sendMessage(prompt);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <PriceCheckForm
            commodities={currentCommodities}
            markets={activeMarkets}
            selectedCommodityId={effectiveCommodityId}
            onCommodityChange={(id) => {
              setActivePresetId(null);
              const found = currentCommodities.find((c) => c.id === id || c.slug === id);
              if (found) targetSlugRef.current = found.slug;
              setSelectedCommodityId(id);
            }}
            takaranAmount={takaranAmount}
            onTakaranAmountChange={(amt) => {
              setActivePresetId(null);
              setTakaranAmount(amt);
            }}
            selectedUnitId={selectedUnitId}
            onUnitChange={(unitId) => {
              setActivePresetId(null);
              setSelectedUnitId(unitId);
            }}
            selectedMarketId={selectedMarketId}
            onMarketChange={setSelectedMarketId}
            rawPriceInput={rawPriceInput}
            onPriceInputChange={handlePriceChange}
            normalizedPricePerKg={normalizedPricePerKg}
            standardUnit={selectedCommodity?.unit || 'kg'}
            activePresetId={activePresetId}
            onApplyPreset={handleApplyPreset}
            onSelectPortion={(amount, unitId) => {
              setActivePresetId(null);
              setTakaranAmount(amount);
              setSelectedUnitId(unitId);
            }}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-7">
          {result && selectedCommodity ? (
            <PriceEvaluationResultCard
              result={result}
              commodity={selectedCommodity}
              market={selectedMarket}
              takaranAmount={takaranAmount}
              selectedUnitId={selectedUnitId}
              rawPriceInput={rawPriceInput}
              onAskPunten={handleAskPuntenForOffer}
            />
          ) : loading ? (
            <div className="market-card bg-[var(--bg-card)] p-6 sm:p-7 flex items-center justify-center text-[var(--text-muted)] text-[13px] min-h-[280px]">
              Sedang memeriksa harga...
            </div>
          ) : (
            <PriceInsufficientDataCard
              commodityName={selectedCommodity?.name}
              marketName={selectedMarket?.name}
            />
          )}
        </div>
      </div>

      <PuntenIntegratedPanel
        commodity={selectedCommodity}
        market={selectedMarket}
        result={result}
      />

      <PriceMethodologyCard />
    </div>
  );
}
