import { PriceCheckRequest, PriceCheckResult, ApiResponse } from '@/types';
import { apiClient, IS_MOCK } from './client';
import { INITIAL_ADMIN_STATE } from '../store/admin-seed';
import { MOCK_REGIONS, DEFAULT_REGION } from '../mock/regions.data';
import { filterMarketsForRegion } from '../mock/markets.data';
import { evaluatePrice } from '../price-logic';
import {
  PIHPS_POSITIONING_NOTE,
  computeCommodityCitizenStats,
  computeMarketInsights,
  normalizeQuantityPrice,
  resolveCanonicalMarket,
} from '../market-insights';

function evaluateFallbackPriceCheck(request: PriceCheckRequest): PriceCheckResult {
  const { commodities, markets, dailyPrices, reports } = INITIAL_ADMIN_STATE;
  const com =
    commodities.find((c) => c.id === request.commodityId || c.slug === request.commodityId) ||
    commodities[0];

  const region =
    MOCK_REGIONS.find((r) => r.slug === request.regionSlug || r.id === request.regionSlug) ||
    DEFAULT_REGION;

  const normalizedOffer =
    request.offeredTotalPrice && request.offeredTotalPrice > 0
      ? normalizeQuantityPrice(
          request.offeredTotalPrice,
          request.quantity || 1,
          request.unitId || 'kg'
        )
      : request.offeredPrice;

  const lapis1NationalHap = com.hapHetPrice;
  const lapis1RegionalHap = Math.round(com.hapHetPrice * region.disparityIndex);

  const scopeMarkets = filterMarketsForRegion(markets, region.id);
  const selectedMarket = resolveCanonicalMarket(markets, request.marketId);
  const regionPrices = scopeMarkets
    .map((m) => dailyPrices[`${m.id}_${com.id}`]?.price)
    .filter((p): p is number => typeof p === 'number' && p > 0);

  const lapis2PihpsCityAvg =
    regionPrices.length > 0
      ? Math.round(regionPrices.reduce((a, b) => a + b, 0) / regionPrices.length)
      : lapis1RegionalHap;
  const exactRec = selectedMarket ? dailyPrices[`${selectedMarket.id}_${com.id}`] : undefined;
  const lapis2OfficialAvg = exactRec?.price || lapis2PihpsCityAvg;

  const stats = computeCommodityCitizenStats(com, reports, selectedMarket?.id || request.marketId);
  const lapis3CitizenMedian =
    stats.marketCount >= 2
      ? stats.marketMedian
      : stats.cityCount >= 1
      ? stats.cityMedian
      : lapis2OfficialAvg;

  const comparisonPrice =
    stats.marketCount >= 2
      ? stats.marketMedian
      : stats.cityCount >= 2
      ? stats.cityMedian
      : lapis2OfficialAvg;

  const nationalVsLocalDiffPct =
    lapis1NationalHap > 0
      ? Number((((lapis2PihpsCityAvg - lapis1NationalHap) / lapis1NationalHap) * 100).toFixed(1))
      : 0;

  const targetMarketId = selectedMarket?.id || request.marketId || scopeMarkets[0]?.id || 'mkt_kebon_kembang';
  const insights = computeMarketInsights({
    marketId: targetMarketId,
    marketName: selectedMarket?.name,
    commodities,
    markets,
    dailyPrices,
    reports,
    disparityIndex: region.disparityIndex,
  });

  return evaluatePrice(
    normalizedOffer,
    comparisonPrice,
    {
      lapis1HapHet: lapis1RegionalHap,
      lapis1NationalHap,
      lapis1RegionalHap,
      lapis2OfficialAvg,
      lapis2PihpsCityAvg,
      lapis3CitizenMedian,
      nationalVsLocalDiffPct,
    },
    stats.marketCount >= 2 || stats.cityCount >= 2 ? 'HIGH' : 'MEDIUM',
    `Dihitung dari perbandingan HAP Bapanas, survei pasar di ${region.name}, dan laporan warga terverifikasi.`,
    region.name,
    {
      marketContext: {
        marketId: insights.marketId,
        marketName: insights.marketName,
        nearStation: insights.nearStation,
        landmarkNote: insights.landmarkNote,
        marketReportCount:
          insights.approvedPriceReportCount + insights.approvedShortageReportCount,
        expensiveItems: insights.expensiveItems.slice(0, 4),
        shortageAlerts: insights.shortageAlerts.slice(0, 4),
      },
      positioningNote: PIHPS_POSITIONING_NOTE,
    }
  );
}

export async function submitPriceCheck(
  request: PriceCheckRequest
): Promise<PriceCheckResult> {
  if (IS_MOCK || typeof window === 'undefined') {
    return evaluateFallbackPriceCheck(request);
  }

  try {
    const res = await apiClient<ApiResponse<PriceCheckResult>>('/price-check', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return res.data;
  } catch {
    return evaluateFallbackPriceCheck(request);
  }
}
