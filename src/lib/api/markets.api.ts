import { Market, ApiResponse } from '@/types';
import { apiClient, IS_MOCK } from './client';
import { MOCK_MARKETS } from '../mock/markets.data';

function getFallbackMarkets(regionSlugOrId?: string): Market[] {
  if (!regionSlugOrId) {
    return MOCK_MARKETS;
  }
  const filtered = MOCK_MARKETS.filter(
    (m) =>
      m.regionId === regionSlugOrId ||
      m.city.toLowerCase().includes(regionSlugOrId.replace('-', ' ').toLowerCase()) ||
      m.city.toLowerCase().replace(/\s+/g, '-') === regionSlugOrId.toLowerCase()
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
