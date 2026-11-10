import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalogFromDb } from '@/lib/server/admin-db';
import { MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import { mapAdminCategoryToPublic } from '@/lib/utils';
import type { CommoditySummary } from '@/types';

export async function GET(req: NextRequest) {
  const categoryParam = req.nextUrl.searchParams.get('category');

  try {
    const { commodities, markets, dailyPrices } = await fetchCatalogFromDb();
    const activeMarkets = markets.filter((m) => m.isActive);

    const list: CommoditySummary[] = commodities
      .filter((c) => c.isActive)
      .map((c) => {
        let sumCurrent = 0;
        let sumPrev = 0;
        let count = 0;
        for (const m of activeMarkets) {
          const rec = dailyPrices[`${m.id}_${c.id}`];
          if (rec && rec.price > 0) {
            sumCurrent += rec.price;
            sumPrev += rec.previousPrice || rec.price;
            count++;
          }
        }

        const avg = count > 0 ? Math.round(sumCurrent / count) : c.hapHetPrice;
        const prev = count > 0 ? Math.round(sumPrev / count) : c.hapHetPrice;
        const pct = prev > 0 ? Math.round(((avg - prev) / prev) * 1000) / 10 : 0;

        let statusVsHap: CommoditySummary['statusVsHap'] = 'EQUAL_HAP';
        if (avg - c.hapHetPrice > c.hapHetPrice * 0.05) statusVsHap = 'ABOVE_HAP';
        else if (avg - c.hapHetPrice < -c.hapHetPrice * 0.05) statusVsHap = 'BELOW_HAP';

        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          category: mapAdminCategoryToPublic(c.category),
          unit: c.unit,
          imageUrl: c.imageUrl || '/images/commodities/default.png',
          currentAvgPrice: avg,
          previousAvgPrice: prev,
          changePercentage: pct,
          hapHetPrice: c.hapHetPrice,
          statusVsHap,
          lastUpdated: new Date().toISOString(),
          sparkline: [prev, Math.round((prev + avg) / 2), avg],
          source: 'PIHPS',
        };
      });

    const filtered = categoryParam ? list.filter((c) => c.category === categoryParam) : list;
    return NextResponse.json({
      success: true,
      message: 'Daftar komoditas dimuat dari Supabase.',
      data: filtered,
    });
  } catch {
    const fallback = categoryParam
      ? MOCK_COMMODITY_SUMMARIES.filter((c) => c.category === categoryParam)
      : MOCK_COMMODITY_SUMMARIES;
    return NextResponse.json({
      success: true,
      message: 'Daftar komoditas dimuat dari fallback.',
      data: fallback,
    });
  }
}

