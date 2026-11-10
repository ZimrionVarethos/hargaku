import { Market, ApiResponse } from '@/types';
import { apiClient, IS_MOCK } from './client';
import { filterMarketsForRegion, MOCK_MARKETS } from '../mock/markets.data';
import { MOCK_REGIONS } from '../mock/regions.data';

function getFallbackMarkets(regionSlugOrId?: string): Market[] {
  if (!regionSlugOrId) {
    return MOCK_MARKETS;
  }
  const matchedRegion = MOCK_REGIONS.find(
    (r) => r.id.toLowerCase() === regionSlugOrId.toLowerCase() || r.slug.toLowerCase() === regionSlugOrId.toLowerCase()
  );
  if (matchedRegion) {
    return filterMarketsForRegion(MOCK_MARKETS, matchedRegion.id);
  }
  const q = regionSlugOrId.toLowerCase();
  const filtered = MOCK_MARKETS.filter(
    (m) =>
      m.regionId === regionSlugOrId ||
      m.city.toLowerCase().includes(q.replace(/-/g, ' ')) ||
      m.city.toLowerCase().replace(/\s+/g, '-') === q
  );
  return filtered.length > 0 ? filtered : MOCK_MARKETS;
}

export async function fetchMarkets(regionSlugOrId?: string): Promise<Market[]> {
  if (IS_MOCK || typeof window === 'undefined') {
    return getFallbackMarkets(regionSlugOrId);
  }

  try {
    const query = regionSlugOrId ? `?region=${encodeURIComponent(regionSlugOrId)}` : '';
    const res = await apiClient<ApiResponse<Market[]>>(`/markets${query}`);
    return res.data;
  } catch {
    return getFallbackMarkets(regionSlugOrId);
  }
}
