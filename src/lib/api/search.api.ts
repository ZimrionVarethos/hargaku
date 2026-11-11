import type { ApiResponse, CommoditySummary, Market, Region } from '@/types';
import { BOGOR_COMMODITIES } from '@/lib/data/bogor-commodities';
import { MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import { MOCK_MARKETS } from '@/lib/mock/markets.data';
import { MOCK_REGIONS } from '@/lib/mock/regions.data';
import { sanitizeSearchQuery } from '@/lib/search/search-security';
import {
  searchSiteContent,
  type SiteSearchFilter,
  type SiteSearchResult,
} from '@/lib/search/site-search';

export async function fetchSiteSearch(params: {
  query: string;
  category?: SiteSearchFilter;
  region?: Region;
  catalogCommodities?: CommoditySummary[];
  markets?: Market[];
  limit?: number;
  signal?: AbortSignal;
}): Promise<SiteSearchResult> {
  const {
    query,
    category = 'ALL',
    region = MOCK_REGIONS[0],
    catalogCommodities = MOCK_COMMODITY_SUMMARIES,
    markets = MOCK_MARKETS,
    limit = 30,
    signal,
  } = params;

  const cleanQuery = sanitizeSearchQuery(query);
  if (!cleanQuery || typeof window === 'undefined') {
    return searchSiteContent({
      query,
      category,
      region,
      regions: MOCK_REGIONS,
      bogorCommodities: BOGOR_COMMODITIES,
      catalogCommodities,
      markets,
      limit,
    });
  }

  try {
    const searchParams = new URLSearchParams({
      q: cleanQuery,
      category,
      region: region.id,
      limit: String(limit),
    });
    const res = await fetch(`/api/v1/search?${searchParams.toString()}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('Search request failed');
    const json = (await res.json()) as ApiResponse<SiteSearchResult>;
    if (json?.success && json.data) {
      return json.data;
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
  }

  return searchSiteContent({
    query,
    category,
    region,
    regions: MOCK_REGIONS,
    bogorCommodities: BOGOR_COMMODITIES,
    catalogCommodities,
    markets,
    limit,
  });
}

