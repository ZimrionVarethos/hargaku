import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { MOCK_COMMODITY_DETAILS, MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import type { CommodityCategory, CommodityDetail } from '@/types';

function mapCat(category: string): CommodityCategory {
  if (category === 'BERAS') return 'BERAS';
  if (category === 'CABAI_BAWANG') return 'CABAI_BAWANG';
  if (category === 'DAGING') return 'DAGING_TELUR';
  if (category === 'MINYAK') return 'MINYAK_GULA';
  if (category === 'SAYUR') return 'SAYURAN';
  return 'CABAI_BAWANG';
}

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

    const activeMarkets = markets.filter((m) => m.isActive);
    const entries = activeMarkets
      .map((m) => ({
        marketName: m.name,
        rec: dailyPrices[`${m.id}_${com.id}`],
      }))
      .filter((x): x is { marketName: string; rec: NonNullable<typeof x.rec> } => Boolean(x.rec && x.rec.price > 0));

    const sorted = [...entries].sort((a, b) => a.rec.price - b.rec.price);
    const cityAvg =
      entries.length > 0
        ? Math.round(entries.reduce((acc, e) => acc + e.rec.price, 0) / entries.length)
        : com.hapHetPrice;
    const prevAvg =
      entries.length > 0
        ? Math.round(entries.reduce((acc, e) => acc + (e.rec.previousPrice || e.rec.price), 0) / entries.length)
        : com.hapHetPrice;

    const approvedCount = reports.filter(
      (r) => r.status === 'APPROVED' && r.commodityName.toLowerCase().includes(com.name.split(' ')[0].toLowerCase())
    ).length;

    const detail: CommodityDetail = {
      id: com.id,
      name: com.name,
      slug: com.slug,
      unit: com.unit,
      category: mapCat(com.category),
      reference: {
        priceHapHet: com.hapHetPrice,
        type: com.name.toLowerCase().includes('beras') || com.name.toLowerCase().includes('minyak') ? 'HET' : 'HAP',
        legalDoc: 'Peraturan Bapanas RI',
      },
      currentPriceStats: {
        cityAverage: cityAvg,
        highestMarket: sorted.length > 0
          ? { name: sorted[sorted.length - 1].marketName, price: sorted[sorted.length - 1].rec.price }
          : { name: 'Pasar Rakyat', price: cityAvg },
        lowestMarket: sorted.length > 0
          ? { name: sorted[0].marketName, price: sorted[0].rec.price }
          : { name: 'Pasar Rakyat', price: cityAvg },
        citizenReportsCount: Math.max(3, approvedCount),
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

