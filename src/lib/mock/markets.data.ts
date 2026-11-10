import type { Market } from '../../types/index.ts';
import { JAWA_MARKETS } from './markets-jawa.data.ts';
import { OUTER_MARKETS } from './markets-outer.data.ts';

export const MOCK_MARKETS: Market[] = [...JAWA_MARKETS, ...OUTER_MARKETS];

export function filterMarketsForRegion<T extends { id: string; regionId?: string }>(
  markets: T[],
  regionId: string
): T[] {
  if (regionId === 'reg_bogor') {
    const bogor = markets.filter((m) => m.regionId === 'reg_bogor');
    if (bogor.length > 0) return bogor;
  }
  if (regionId === 'reg_bodebek') {
    const jabodetabek = markets.filter(
      (m) =>
        m.regionId === 'reg_bodebek' ||
        m.regionId === 'reg_bogor' ||
        m.regionId === 'reg_jakarta' ||
        m.id === 'mkt_lama_tng'
    );
    if (jabodetabek.length > 0) return jabodetabek;
  }
  if (regionId === 'reg_jabar') {
    const jabar = markets.filter(
      (m) =>
        m.regionId === 'reg_jabar' ||
        m.regionId === 'reg_bogor' ||
        m.regionId === 'reg_bodebek'
    );
    if (jabar.length > 0) return jabar;
  }
  const exact = markets.filter((m) => m.regionId === regionId);
  if (exact.length > 0) return exact;
  return markets.filter((m) => m.regionId === 'reg_bogor' || m.regionId === 'reg_jabar').slice(0, 6);
}

export function getMarketsByRegion(regionId: string): Market[] {
  const filtered = filterMarketsForRegion(MOCK_MARKETS, regionId);
  return filtered.length > 0 ? filtered : JAWA_MARKETS.slice(0, 6);
}
