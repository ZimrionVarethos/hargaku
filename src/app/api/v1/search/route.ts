import { NextRequest, NextResponse } from 'next/server';
import { BOGOR_COMMODITIES } from '@/lib/data/bogor-commodities';
import { MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import { MOCK_MARKETS } from '@/lib/mock/markets.data';
import { MOCK_REGIONS } from '@/lib/mock/regions.data';
import { sanitizeSearchQuery } from '@/lib/search/search-security';
import {
  searchSiteContent,
  type SiteSearchFilter,
} from '@/lib/search/site-search';
import { queryPublicSearchCatalogFromDb } from '@/lib/server/search-db';
import {
  consumeSearchRateLimit,
  extractClientKey,
} from '@/lib/server/search-rate-limit';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'no-store',
};

const VALID_FILTERS = new Set<SiteSearchFilter>([
  'ALL',
  'COMMODITY',
  'MARKET',
  'REGION',
  'PAGE',
]);

export async function GET(req: NextRequest) {
  const clientKey = extractClientKey(req.headers);
  const rate = consumeSearchRateLimit(clientKey);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: 'Terlalu banyak permintaan pencarian. Coba lagi sebentar.',
      },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          'Retry-After': String(rate.retryAfterSec),
        },
      }
    );
  }

  const rawQuery = req.nextUrl.searchParams.get('q') || '';
  const sanitizedQuery = sanitizeSearchQuery(rawQuery);
  const rawCategory = (req.nextUrl.searchParams.get('category') || 'ALL').toUpperCase();
  const category: SiteSearchFilter = VALID_FILTERS.has(rawCategory as SiteSearchFilter)
    ? (rawCategory as SiteSearchFilter)
    : 'ALL';

  const rawRegion = (req.nextUrl.searchParams.get('region') || 'reg_bogor')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 40);
  const region =
    MOCK_REGIONS.find((r) => r.id === rawRegion || r.slug === rawRegion) || MOCK_REGIONS[0];

  const rawLimit = Number(req.nextUrl.searchParams.get('limit') || '30');
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(60, Math.round(rawLimit))) : 30;

  if (!sanitizedQuery) {
    return NextResponse.json(
      {
        success: true,
        message: 'Masukkan kata kunci pencarian.',
        data: {
          query: sanitizedQuery,
          sanitizedQuery: '',
          regionId: region.id,
          total: 0,
          counts: { ALL: 0, COMMODITY: 0, MARKET: 0, REGION: 0, PAGE: 0 },
          items: [],
        },
      },
      { headers: SECURITY_HEADERS }
    );
  }

  let catalogCommodities = [...MOCK_COMMODITY_SUMMARIES];
  let markets = [...MOCK_MARKETS];
  try {
    const dbResult = await queryPublicSearchCatalogFromDb(sanitizedQuery);
    if (dbResult) {
      if (dbResult.commodities.length > 0) {
        const comMap = new Map(catalogCommodities.map((c) => [c.id, c]));
        for (const dbCom of dbResult.commodities) comMap.set(dbCom.id, dbCom);
        catalogCommodities = Array.from(comMap.values());
      }
      if (dbResult.markets.length > 0) {
        const mktMap = new Map(markets.map((m) => [m.id, m]));
        for (const dbMkt of dbResult.markets) mktMap.set(dbMkt.id, dbMkt);
        markets = Array.from(mktMap.values());
      }
    }
  } catch {
  }

  const result = searchSiteContent({
    query: rawQuery,
    category,
    region,
    regions: MOCK_REGIONS,
    bogorCommodities: BOGOR_COMMODITIES,
    catalogCommodities,
    markets,
    limit,
  });

  return NextResponse.json(
    {
      success: true,
      message: 'Hasil pencarian berhasil dimuat.',
      data: result,
    },
    { headers: SECURITY_HEADERS }
  );
}
