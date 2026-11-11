import type { Market } from '../../types/index.ts';
import { JAWA_MARKETS } from './markets-jawa.data.ts';
import { OUTER_MARKETS } from './markets-outer.data.ts';

export const MOCK_MARKETS: Market[] = [...JAWA_MARKETS, ...OUTER_MARKETS];

export function filterMarketsForRegion<T extends { id: string; regionId?: string; city?: string }>(
  markets: T[],
  regionId: string
): T[] {
  if (regionId === 'reg_bogor') {
    return markets.filter(
      (m) => m.regionId === 'reg_bogor' || Boolean(m.city?.toLowerCase().includes('kota bogor'))
    );
  }
  if (regionId === 'reg_bodebek') {
    return markets.filter(
      (m) =>
        m.regionId === 'reg_bodebek' ||
        m.regionId === 'reg_bogor' ||
        m.regionId === 'reg_jakarta' ||
        m.id === 'mkt_lama_tng' ||
        Boolean(m.city?.toLowerCase().includes('kota bogor'))
    );
  }
  if (regionId === 'reg_jabar') {
    return markets.filter(
      (m) =>
        m.regionId === 'reg_jabar' ||
        m.regionId === 'reg_bogor' ||
        m.regionId === 'reg_bodebek'
    );
  }
  return markets.filter((m) => m.regionId === regionId);
}

export function getMarketsByRegion(regionId: string): Market[] {
  const filtered = filterMarketsForRegion(MOCK_MARKETS, regionId);
  return filtered.length > 0 ? filtered : JAWA_MARKETS.slice(0, 6);
}
