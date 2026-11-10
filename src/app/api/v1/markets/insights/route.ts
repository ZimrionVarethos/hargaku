import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { INITIAL_ADMIN_STATE } from '@/lib/store/admin-seed';
import { DEFAULT_REGION, MOCK_REGIONS } from '@/lib/mock/regions.data';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { computeMarketInsights, resolveCanonicalMarket } from '@/lib/market-insights';

export async function GET(req: NextRequest) {
  const marketId = req.nextUrl.searchParams.get('marketId')?.trim();
  const regionId = req.nextUrl.searchParams.get('regionId')?.trim() || DEFAULT_REGION.id;
  const region =
    MOCK_REGIONS.find((r) => r.id === regionId || r.slug === regionId) || DEFAULT_REGION;

  const dbData = await fetchBootstrapFromDb().catch(() => null);
  const commodities =
    dbData && dbData.commodities.length > 0 ? dbData.commodities : INITIAL_ADMIN_STATE.commodities;
  const markets =
    dbData && dbData.markets.length > 0 ? dbData.markets : INITIAL_ADMIN_STATE.markets;
  const dailyPrices =
    dbData && Object.keys(dbData.dailyPrices).length > 0
      ? dbData.dailyPrices
      : INITIAL_ADMIN_STATE.dailyPrices;
  const reports =
    dbData && dbData.reports.length > 0 ? dbData.reports : INITIAL_ADMIN_STATE.reports;

  if (marketId) {
    const resolved = resolveCanonicalMarket(markets, marketId);
    const insight = computeMarketInsights({
      marketId: resolved?.id || marketId,
      marketName: resolved?.name,
      commodities,
      markets,
      dailyPrices,
      reports,
      disparityIndex: region.disparityIndex,
    });

    return NextResponse.json({
      success: true,
      message: 'Ringkasan intelijen pasar dimuat.',
      data: insight,
    });
  }

  const activeMarkets = filterMarketsForRegion(
    markets.filter((m) => m.isActive),
    region.id
  );

  const summaries = activeMarkets
    .map((m) =>
      computeMarketInsights({
        marketId: m.id,
        marketName: m.name,
        commodities,
        markets,
        dailyPrices,
        reports,
        disparityIndex: region.disparityIndex,
      })
    )
    .sort((a, b) => {
      const aScore = (a.nearStation ? 10 : 0) + a.expensiveItems.length * 3 + a.shortageAlerts.length * 4;
      const bScore = (b.nearStation ? 10 : 0) + b.expensiveItems.length * 3 + b.shortageAlerts.length * 4;
      return bScore - aScore;
    });

  return NextResponse.json({
    success: true,
    message: 'Daftar ringkasan intelijen pasar dimuat.',
    data: summaries,
  });
}

