import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import type { CommodityCategory, CommoditySummary } from '@/types';

function mapCat(category: string): CommodityCategory {
  if (category === 'BERAS') return 'BERAS';
  if (category === 'CABAI_BAWANG') return 'CABAI_BAWANG';
  if (category === 'DAGING') return 'DAGING_TELUR';
  if (category === 'MINYAK') return 'MINYAK_GULA';
  if (category === 'SAYUR') return 'SAYURAN';
  return 'CABAI_BAWANG';
}

export async function GET(req: NextRequest) {
  const categoryParam = req.nextUrl.searchParams.get('category');

  try {
    const { commodities, markets, dailyPrices } = await fetchBootstrapFromDb();
    const activeMarkets = markets.filter((m) => m.isActive);

    const list: CommoditySummary[] = commodities
      .filter((c) => c.isActive)
      .map((c) => {
        const entries = activeMarkets
          .map((m) => dailyPrices[`${m.id}_${c.id}`])
          .filter((r): r is NonNullable<typeof r> => Boolean(r && r.price > 0));

        const avg =
          entries.length > 0
            ? Math.round(entries.reduce((acc, e) => acc + e.price, 0) / entries.length)
            : c.hapHetPrice;
        const prev =
          entries.length > 0
            ? Math.round(entries.reduce((acc, e) => acc + (e.previousPrice || e.price), 0) / entries.length)
            : c.hapHetPrice;
        const pct = prev > 0 ? Math.round(((avg - prev) / prev) * 1000) / 10 : 0;

        let statusVsHap: CommoditySummary['statusVsHap'] = 'EQUAL_HAP';
        if (avg - c.hapHetPrice > c.hapHetPrice * 0.05) statusVsHap = 'ABOVE_HAP';
        else if (avg - c.hapHetPrice < -c.hapHetPrice * 0.05) statusVsHap = 'BELOW_HAP';

        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          category: mapCat(c.category),
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

