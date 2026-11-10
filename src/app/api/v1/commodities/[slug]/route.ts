import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { MOCK_COMMODITY_DETAILS, MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import { computeCommodityCitizenStats } from '@/lib/market-insights';
import { mapAdminCategoryToPublic } from '@/lib/utils';
import type { CommodityDetail } from '@/types';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  try {
    const { commodities, markets, dailyPrices, reports } = await fetchBootstrapFromDb();
    const com = commodities.find((c) => c.slug === slug || c.id === slug);
    if (!com) {
      return NextResponse.json({ success: false, message: 'Komoditas tidak ditemukan.' }, { status: 404 });
    }

    let sumPrice = 0;
    let sumPrev = 0;
    let count = 0;
    let highest: { name: string; price: number } | null = null;
    let lowest: { name: string; price: number } | null = null;

    for (const m of markets) {
      if (!m.isActive) continue;
      const rec = dailyPrices[`${m.id}_${com.id}`];
      if (!rec || rec.price <= 0) continue;
      sumPrice += rec.price;
      sumPrev += rec.previousPrice || rec.price;
      count++;
      if (!highest || rec.price > highest.price) highest = { name: m.name, price: rec.price };
      if (!lowest || rec.price < lowest.price) lowest = { name: m.name, price: rec.price };
    }

    const cityAvg = count > 0 ? Math.round(sumPrice / count) : com.hapHetPrice;
    const prevAvg = count > 0 ? Math.round(sumPrev / count) : com.hapHetPrice;
    const citizenStats = computeCommodityCitizenStats(com, reports);

    const detail: CommodityDetail = {
      id: com.id,
      name: com.name,
      slug: com.slug,
      unit: com.unit,
      category: mapAdminCategoryToPublic(com.category),
      reference: {
        priceHapHet: com.hapHetPrice,
        type:
          com.name.toLowerCase().includes('beras') || com.name.toLowerCase().includes('minyak')
            ? 'HET'
            : 'HAP',
        legalDoc: 'Peraturan Bapanas RI',
      },
      currentPriceStats: {
        cityAverage: cityAvg,
        highestMarket: highest || { name: 'Pasar Rakyat', price: cityAvg },
        lowestMarket: lowest || { name: 'Pasar Rakyat', price: cityAvg },
        citizenReportsCount: Math.max(1, citizenStats.cityCount),
      },
      priceHistory: [
        { date: 'H-2', avgPrice: prevAvg },
        { date: 'H-1', avgPrice: Math.round((prevAvg + cityAvg) / 2) },
        { date: 'Hari Ini', avgPrice: cityAvg },
      ],
    };

    return NextResponse.json({ success: true, message: 'Detail komoditas dimuat.', data: detail });
  } catch {
    const found = MOCK_COMMODITY_DETAILS[slug] || MOCK_COMMODITY_SUMMARIES.find((c) => c.slug === slug);
    return NextResponse.json({ success: true, message: 'Detail fallback dimuat.', data: found || null });
  }
}
