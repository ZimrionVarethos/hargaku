import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { MOCK_REGIONS, DEFAULT_REGION } from '@/lib/mock/regions.data';
import { MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import { evaluatePrice } from '@/lib/price-logic';
import type { PriceCheckRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<PriceCheckRequest>;
    const offeredPrice = Number(body.offeredPrice || 0);

    if (!body.commodityId || offeredPrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'Komoditas dan nominal harga harus valid.' },
        { status: 400 }
      );
    }

    const region =
      MOCK_REGIONS.find((r) => r.slug === body.regionSlug || r.id === body.regionSlug) || DEFAULT_REGION;

    try {
      const { commodities, markets, dailyPrices, reports } = await fetchBootstrapFromDb();
      const com =
        commodities.find((c) => c.id === body.commodityId || c.slug === body.commodityId) ||
        commodities[0];

      const lapis1NationalHap = com ? com.hapHetPrice : 35000;
      const lapis1RegionalHap = Math.round(lapis1NationalHap * region.disparityIndex);

      const regionMarkets = markets.filter((m) => m.isActive && m.regionId === region.id);
      const scopeMarkets = regionMarkets.length > 0 ? regionMarkets : markets.filter((m) => m.isActive);

      const exactRec = body.marketId && com ? dailyPrices[`${body.marketId}_${com.id}`] : undefined;
      const regionRecs = com
        ? scopeMarkets
            .map((m) => dailyPrices[`${m.id}_${com.id}`]?.price)
            .filter((p): p is number => typeof p === 'number' && p > 0)
        : [];

      const lapis2OfficialAvg =
        exactRec && exactRec.price > 0
          ? exactRec.price
          : regionRecs.length > 0
          ? Math.round(regionRecs.reduce((a, b) => a + b, 0) / regionRecs.length)
          : lapis1RegionalHap;

      const approvedReports = com
        ? reports.filter(
            (r) =>
              r.status === 'APPROVED' &&
              r.commodityName.toLowerCase().includes(com.name.split(' ')[0].toLowerCase())
          )
        : [];

      const lapis3CitizenMedian =
        approvedReports.length > 0
          ? Math.round(
              approvedReports.reduce((s, r) => s + r.normalizedPricePerKg, 0) / approvedReports.length
            )
          : Math.round(lapis2OfficialAvg * 1.01);

      const comparisonPrice = approvedReports.length >= 2 ? lapis3CitizenMedian : lapis2OfficialAvg;

      const result = evaluatePrice(
        offeredPrice,
        comparisonPrice,
        {
          lapis1HapHet: lapis1RegionalHap,
          lapis1NationalHap,
          lapis1RegionalHap,
          lapis2OfficialAvg,
          lapis3CitizenMedian,
        },
        approvedReports.length >= 2 ? 'HIGH' : 'MEDIUM',
        `Dihitung dari data Supabase (${region.name}, +${region.logisticsCostPct}% logistik).`,
        region.name
      );

      return NextResponse.json({
        success: true,
        message: 'Evaluasi kewajaran harga selesai.',
        data: result,
      });
    } catch {
      const fallbackCom =
        MOCK_COMMODITY_SUMMARIES.find((c) => c.id === body.commodityId || c.slug === body.commodityId) ||
        MOCK_COMMODITY_SUMMARIES[0];
      const hap = fallbackCom.hapHetPrice;
      const regHap = Math.round(hap * region.disparityIndex);
      const regAvg = Math.round(fallbackCom.currentAvgPrice * region.disparityIndex);
      const citizenMed = Math.round(regAvg * 1.01);
      const result = evaluatePrice(
        offeredPrice,
        citizenMed,
        {
          lapis1HapHet: regHap,
          lapis1NationalHap: hap,
          lapis1RegionalHap: regHap,
          lapis2OfficialAvg: regAvg,
          lapis3CitizenMedian: citizenMed,
        },
        'MEDIUM',
        `Dihitung dari acuan wilayah fallback (${region.name}).`,
        region.name
      );
      return NextResponse.json({
        success: true,
        message: 'Evaluasi harga selesai (mode fallback).',
        data: result,
      });
    }
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
