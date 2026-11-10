import type { ApiResponse, MarketInsightsSummary } from '@/types';
import { apiClient, IS_MOCK } from './client';
import { INITIAL_ADMIN_STATE } from '../store/admin-seed';
import { DEFAULT_REGION, MOCK_REGIONS } from '../mock/regions.data';
import { filterMarketsForRegion } from '../mock/markets.data';
import { computeMarketInsights, resolveCanonicalMarket } from '../market-insights';

function computeFallbackMarketInsight(marketId: string, regionId?: string): MarketInsightsSummary {
  const region =
    MOCK_REGIONS.find((r) => r.id === regionId || r.slug === regionId) || DEFAULT_REGION;
  const resolved = resolveCanonicalMarket(INITIAL_ADMIN_STATE.markets, marketId);
  return computeMarketInsights({
    marketId: resolved?.id || marketId,
    marketName: resolved?.name,
    commodities: INITIAL_ADMIN_STATE.commodities,
    markets: INITIAL_ADMIN_STATE.markets,
    dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
    reports: INITIAL_ADMIN_STATE.reports,
    disparityIndex: region.disparityIndex,
  });
}

function computeFallbackRegionInsights(regionId?: string): MarketInsightsSummary[] {
  const region =
    MOCK_REGIONS.find((r) => r.id === regionId || r.slug === regionId) || DEFAULT_REGION;
  const activeMarkets = filterMarketsForRegion(
    INITIAL_ADMIN_STATE.markets.filter((m) => m.isActive),
    region.id
  );
  return activeMarkets.map((m) =>
    computeMarketInsights({
      marketId: m.id,
      marketName: m.name,
      commodities: INITIAL_ADMIN_STATE.commodities,
      markets: INITIAL_ADMIN_STATE.markets,
      dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
      reports: INITIAL_ADMIN_STATE.reports,
      disparityIndex: region.disparityIndex,
    })
  );
}

export async function fetchMarketInsight(
  marketId: string,
  regionId?: string
): Promise<MarketInsightsSummary> {
  if (IS_MOCK || typeof window === 'undefined') {
    return computeFallbackMarketInsight(marketId, regionId);
  }
  try {
    const qs = new URLSearchParams({ marketId });
    if (regionId) qs.set('regionId', regionId);
    const res = await apiClient<ApiResponse<MarketInsightsSummary>>(`/markets/insights?${qs.toString()}`);
    return res.data;
  } catch {
    return computeFallbackMarketInsight(marketId, regionId);
  }
}

export async function fetchRegionMarketInsights(regionId?: string): Promise<MarketInsightsSummary[]> {
  if (IS_MOCK || typeof window === 'undefined') {
    return computeFallbackRegionInsights(regionId);
  }
  try {
    const query = regionId ? `?regionId=${encodeURIComponent(regionId)}` : '';
    const res = await apiClient<ApiResponse<MarketInsightsSummary[]>>(`/markets/insights${query}`);
    return res.data;
  } catch {
    return computeFallbackRegionInsights(regionId);
  }
}

