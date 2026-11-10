import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { INITIAL_ADMIN_STATE } from '@/lib/store/admin-seed';
import { MOCK_REGIONS, DEFAULT_REGION } from '@/lib/mock/regions.data';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { evaluatePrice } from '@/lib/price-logic';
import {
  PIHPS_POSITIONING_NOTE,
  computeCommodityCitizenStats,
  computeMarketInsights,
  normalizeQuantityPrice,
  resolveCanonicalMarket,
} from '@/lib/market-insights';
import type { PriceCheckRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<PriceCheckRequest>;
    const normalizedInput =
      body.offeredTotalPrice && body.offeredTotalPrice > 0
        ? normalizeQuantityPrice(body.offeredTotalPrice, body.quantity || 1, body.unitId || 'kg')
        : Number(body.offeredPrice || 0);

    if (!body.commodityId || normalizedInput <= 0) {
      return NextResponse.json(
        { success: false, message: 'Komoditas dan nominal harga harus valid.' },
        { status: 400 }
      );
    }

    const region =
      MOCK_REGIONS.find((r) => r.slug === body.regionSlug || r.id === body.regionSlug) || DEFAULT_REGION;

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

    const com =
      commodities.find((c) => c.id === body.commodityId || c.slug === body.commodityId) || commodities[0];

    const lapis1NationalHap = com ? com.hapHetPrice : 35000;
    const lapis1RegionalHap = Math.round(lapis1NationalHap * region.disparityIndex);

    const activeMarkets = filterMarketsForRegion(
      markets.filter((m) => m.isActive),
      region.id
    );
    const scopeMarkets = activeMarkets.length > 0 ? activeMarkets : markets.filter((m) => m.isActive);
    const selectedMarket = resolveCanonicalMarket(markets, body.marketId);

    const regionRecs = com
      ? scopeMarkets
          .map((m) => dailyPrices[`${m.id}_${com.id}`]?.price)
          .filter((p): p is number => typeof p === 'number' && p > 0)
      : [];

    const lapis2PihpsCityAvg =
      regionRecs.length > 0
        ? Math.round(regionRecs.reduce((a, b) => a + b, 0) / regionRecs.length)
        : lapis1RegionalHap;

    const exactRec =
      selectedMarket && com ? dailyPrices[`${selectedMarket.id}_${com.id}`] : undefined;
    const lapis2OfficialAvg =
      exactRec && exactRec.price > 0 ? exactRec.price : lapis2PihpsCityAvg;

    const citizenStats = com
      ? computeCommodityCitizenStats(com, reports, selectedMarket?.id || body.marketId)
      : { marketMedian: 0, cityMedian: 0, marketCount: 0, cityCount: 0 };

    const lapis3CitizenMedian =
      citizenStats.marketCount >= 2
        ? citizenStats.marketMedian
        : citizenStats.cityCount >= 1
        ? citizenStats.cityMedian
        : lapis2OfficialAvg;

    const comparisonPrice =
      citizenStats.marketCount >= 2
        ? citizenStats.marketMedian
        : citizenStats.cityCount >= 2
        ? citizenStats.cityMedian
        : lapis2OfficialAvg;

    const nationalVsLocalDiffPct =
      lapis1NationalHap > 0
        ? Number((((lapis2PihpsCityAvg - lapis1NationalHap) / lapis1NationalHap) * 100).toFixed(1))
        : 0;

    const targetMarketId = selectedMarket?.id || body.marketId || scopeMarkets[0]?.id || 'mkt_kebon_kembang';
    const fullInsights = computeMarketInsights({
      marketId: targetMarketId,
      marketName: selectedMarket?.name,
      commodities,
      markets,
      dailyPrices,
      reports,
      disparityIndex: region.disparityIndex,
    });

    const dataSourceNote = dbData ? 'Supabase + data wilayah' : 'katalog terkurasi wilayah';
    const result = evaluatePrice(
      normalizedInput,
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
      citizenStats.marketCount >= 2 || citizenStats.cityCount >= 2 ? 'HIGH' : 'MEDIUM',
      `Dihitung dari acuan nasional (HAP), survei ${region.name}, dan laporan warga (${dataSourceNote}).`,
      region.name,
      {
        marketContext: {
          marketId: fullInsights.marketId,
          marketName: fullInsights.marketName,
          nearStation: fullInsights.nearStation,
          landmarkNote: fullInsights.landmarkNote,
          marketReportCount:
            fullInsights.approvedPriceReportCount + fullInsights.approvedShortageReportCount,
          expensiveItems: fullInsights.expensiveItems.slice(0, 4),
          shortageAlerts: fullInsights.shortageAlerts.slice(0, 4),
        },
        positioningNote: PIHPS_POSITIONING_NOTE,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Evaluasi kewajaran harga selesai.',
      data: result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Gagal menghitung kewajaran harga.',
      },
      { status: 400 }
    );
  }
}
