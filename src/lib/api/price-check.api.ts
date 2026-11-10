import { PriceCheckRequest, PriceCheckResult, ApiResponse } from '@/types';
import { apiClient, IS_MOCK } from './client';
import { MOCK_COMMODITY_SUMMARIES } from '../mock/commodities.data';
import { MOCK_REGIONS, DEFAULT_REGION } from '../mock/regions.data';
import { evaluatePrice } from '../price-logic';

function evaluateFallbackPriceCheck(request: PriceCheckRequest): PriceCheckResult {
  const commodity =
    MOCK_COMMODITY_SUMMARIES.find((c) => c.id === request.commodityId) ||
    MOCK_COMMODITY_SUMMARIES[0];

  const region =
    MOCK_REGIONS.find((r) => r.slug === request.regionSlug || r.id === request.regionSlug) ||
    DEFAULT_REGION;

  const lapis1NationalHap = commodity.hapHetPrice;
  const lapis1RegionalHap = Math.round(commodity.hapHetPrice * region.disparityIndex);
  const lapis2OfficialAvg = Math.round(commodity.currentAvgPrice * region.disparityIndex);
  const lapis3CitizenMedian = Math.round(lapis2OfficialAvg * 1.01);

  const comparisonPrice = lapis3CitizenMedian || lapis2OfficialAvg;

  return evaluatePrice(
    request.offeredPrice,
    comparisonPrice,
    {
      lapis1HapHet: lapis1RegionalHap,
      lapis1NationalHap,
      lapis1RegionalHap,
      lapis2OfficialAvg,
      lapis3CitizenMedian,
    },
    'HIGH',
    `Dihitung dari survei pasar resmi harian dan laporan warga terverifikasi di ${region.name} (${region.islandName}, +${region.logisticsCostPct}% toleransi logistik).`,
    region.name
  );
}

export async function submitPriceCheck(
  request: PriceCheckRequest
): Promise<PriceCheckResult> {
  if (IS_MOCK || typeof window === 'undefined') {
    return evaluateFallbackPriceCheck(request);
  }

  try {
    const res = await apiClient<ApiResponse<PriceCheckResult>>('/price-check', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return res.data;
  } catch {
    return evaluateFallbackPriceCheck(request);
  }
}
