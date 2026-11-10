import { CommoditySummary, CommodityDetail, CommodityCategory, ApiResponse } from '@/types';
import { apiClient, IS_MOCK } from './client';
import { MOCK_COMMODITY_SUMMARIES, MOCK_COMMODITY_DETAILS } from '../mock/commodities.data';

function getFallbackCommodities(category?: CommodityCategory): CommoditySummary[] {
  if (!category) return MOCK_COMMODITY_SUMMARIES;
  return MOCK_COMMODITY_SUMMARIES.filter((c) => c.category === category);
}

function getFallbackCommodityDetail(slug: string): CommodityDetail | null {
  if (MOCK_COMMODITY_DETAILS[slug]) {
    return MOCK_COMMODITY_DETAILS[slug];
  }
  const found = MOCK_COMMODITY_SUMMARIES.find((c) => c.slug === slug);
  if (!found) return null;

  return {
    id: found.id,
    name: found.name,
    slug: found.slug,
    unit: found.unit,
    category: found.category,
    reference: {
      priceHapHet: found.hapHetPrice,
      type:
        found.name.toLowerCase().includes('beras') || found.name.toLowerCase().includes('minyak')
          ? 'HET'
          : 'HAP',
      legalDoc: 'Perbadan Bapanas 2024',
    },
    currentPriceStats: {
      cityAverage: found.currentAvgPrice,
      highestMarket: { name: 'Pasar Anyar', price: Math.round(found.currentAvgPrice * 1.05) },
      lowestMarket: { name: 'Pasar Merdeka', price: Math.round(found.currentAvgPrice * 0.96) },
      citizenReportsCount: 8,
    },
    priceHistory: [
      { date: '2026-10-15', avgPrice: found.previousAvgPrice },
      {
        date: '2026-10-18',
        avgPrice: Math.round((found.previousAvgPrice + found.currentAvgPrice) / 2),
      },
      { date: '2026-10-21', avgPrice: found.currentAvgPrice },
    ],
  };
}

export async function fetchCommodities(category?: CommodityCategory): Promise<CommoditySummary[]> {
  if (IS_MOCK || typeof window === 'undefined') {
    return getFallbackCommodities(category);
  }

  try {
    const query = category ? `?category=${category}` : '';
    const res = await apiClient<ApiResponse<CommoditySummary[]>>(`/commodities${query}`);
    return res.data;
  } catch {
    return getFallbackCommodities(category);
  }
}

export async function fetchCommodityDetail(slug: string): Promise<CommodityDetail | null> {
  if (IS_MOCK || typeof window === 'undefined') {
    return getFallbackCommodityDetail(slug);
  }

  try {
    const res = await apiClient<ApiResponse<CommodityDetail>>(`/commodities/${slug}`);
    return res.data;
  } catch {
    return getFallbackCommodityDetail(slug);
  }
}
