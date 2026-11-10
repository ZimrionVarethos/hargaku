import { NextRequest, NextResponse } from 'next/server';
import { fetchMarketsFromDb } from '@/lib/server/admin-db';
import { filterMarketsForRegion, MOCK_MARKETS } from '@/lib/mock/markets.data';
import { MOCK_REGIONS } from '@/lib/mock/regions.data';
import { mapAdminMarketToPublic } from '@/lib/utils';
import type { Market } from '@/types';

function resolveRegionMarkets(list: Market[], regionQuery: string | null): Market[] {
  if (!regionQuery) return list;
  const matchedRegion = MOCK_REGIONS.find(
    (r) => r.id.toLowerCase() === regionQuery.toLowerCase() || r.slug.toLowerCase() === regionQuery.toLowerCase()
  );
  if (matchedRegion) {
    return filterMarketsForRegion(list, matchedRegion.id);
  }
  const q = regionQuery.toLowerCase();
  const direct = list.filter(
    (m) =>
      m.regionId?.toLowerCase() === q ||
      m.city.toLowerCase().includes(q.replace(/-/g, ' ')) ||
      m.city.toLowerCase().replace(/\s+/g, '-') === q
  );
  return direct.length > 0 ? direct : filterMarketsForRegion(list, regionQuery);
}

export async function GET(req: NextRequest) {
  const region = req.nextUrl.searchParams.get('region');
  try {
    const markets = await fetchMarketsFromDb();
    const mapped: Market[] = markets.filter((m) => m.isActive).map(mapAdminMarketToPublic);
    const data = resolveRegionMarkets(mapped, region);

    return NextResponse.json({
      success: true,
      message: region ? 'Daftar pasar wilayah dimuat.' : 'Daftar pasar dimuat.',
      data,
    });
  } catch {
    const data = resolveRegionMarkets(MOCK_MARKETS, region);
    return NextResponse.json({
      success: true,
      message: 'Daftar pasar fallback dimuat.',
      data,
    });
  }
}
