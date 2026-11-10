import type { Market } from '../../types/index.ts';
import { JAWA_MARKETS } from './markets-jawa.data.ts';
import { OUTER_MARKETS } from './markets-outer.data.ts';

export const MOCK_MARKETS: Market[] = [...JAWA_MARKETS, ...OUTER_MARKETS];

export function getMarketsByRegion(regionId: string): Market[] {
  const filtered = MOCK_MARKETS.filter((m) => m.regionId === regionId);
  if (filtered.length > 0) return filtered;
  return JAWA_MARKETS.slice(0, 4);
}
