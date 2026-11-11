import type { Market } from '../../types/index.ts';
import { MOCK_MARKETS } from '../mock/markets.data.ts';
import { normalizeSearchText } from './search-security.ts';
import type { SitePageIconKey } from './site-pages-index.ts';

export function mergeSearchMarkets(liveMarkets: Market[]): Market[] {
  const byId = new Map<string, Market>(MOCK_MARKETS.map((m) => [m.id, m]));
  for (const m of liveMarkets) {
    const seed = byId.get(m.id);
    byId.set(m.id, {
      ...seed,
      ...m,
      nearStation: Boolean(m.nearStation || seed?.nearStation),
      landmarkNote: m.landmarkNote || seed?.landmarkNote,
    });
  }
  return Array.from(byId.values());
}

export type SiteSearchCategory = 'COMMODITY' | 'MARKET' | 'REGION' | 'PAGE';
export type SiteSearchFilter = 'ALL' | SiteSearchCategory;

export interface SiteSearchItem {
  id: string;
  kind: SiteSearchCategory;
  title: string;
  subtitle: string;
  metaLabel: string;
  badgeLabel: string;
  href: string;
  priceText?: string;
  svgKind?: string;
  iconKey?: SitePageIconKey;
  nearStation?: boolean;
  regionId?: string;
  commoditySlug?: string;
  marketId?: string;
  score: number;
}

export interface SiteSearchResult {
  query: string;
  sanitizedQuery: string;
  regionId: string;
  total: number;
  counts: Record<SiteSearchFilter, number>;
  items: SiteSearchItem[];
}

export function formatShortCategoryBadge(
  categoryLabel: string,
  subCategory = '',
  name = ''
): string {
  const combined = `${categoryLabel} ${subCategory} ${name}`.toUpperCase();
  if (combined.includes('CABAI') || combined.includes('CABE') || combined.includes('BAWANG')) {
    return 'Cabai & Bawang';
  }
  if (combined.includes('BERAS') || combined.includes('POKOK')) return 'Beras & Pokok';
  if (combined.includes('DAGING') || combined.includes('TELUR')) return 'Daging & Telur';
  if (combined.includes('MINYAK') || combined.includes('GULA')) return 'Minyak & Gula';
  if (combined.includes('IKAN')) return 'Ikan Segar';
  if (combined.includes('BUAH')) return 'Buah';
  return 'Sayuran';
}

export function inferSvgKind(name: string): string {
  const lower = name.toLowerCase();
  if (
    lower.includes('cabai rawit hijau') ||
    lower.includes('cabe rawit hijau') ||
    lower.includes('cabe hijau')
  ) {
    return 'greenChili';
  }
  if (lower.includes('cabai') || lower.includes('cabe')) return 'chili';
  if (lower.includes('bawang merah')) return 'shallot';
  if (lower.includes('bawang putih')) return 'garlic';
  if (lower.includes('tomat')) return 'tomato';
  if (lower.includes('wortel')) return 'carrot';
  if (lower.includes('telur')) return 'egg';
  if (lower.includes('daging') || lower.includes('ayam')) return 'meat';
  if (lower.includes('ikan')) return 'fish';
  if (lower.includes('minyak') || lower.includes('gula')) return 'oil';
  if (lower.includes('beras') || lower.includes('tepung') || lower.includes('kedelai')) {
    return 'rice';
  }
  if (
    lower.includes('jeruk') ||
    lower.includes('pisang') ||
    lower.includes('pepaya') ||
    lower.includes('semangka')
  ) {
    return 'fruit';
  }
  return 'leafy';
}

export function scoreMatch(
  normalizedPhrase: string,
  tokenGroups: string[][],
  title: string,
  searchableFields: string[]
): number {
  const normTitle = normalizeSearchText(title);
  const normCorpus = normalizeSearchText([title, ...searchableFields].join(' '));
  if (!normCorpus) return 0;

  for (const group of tokenGroups) {
    const matched = group.some((variant) => normCorpus.includes(variant));
    if (!matched) return 0;
  }

  let score = 20;
  if (normTitle === normalizedPhrase) score += 120;
  else if (normTitle.startsWith(normalizedPhrase)) score += 75;
  else if (normTitle.includes(normalizedPhrase)) score += 48;

  const titleWords = normTitle.split(/\s+/);
  for (const group of tokenGroups) {
    if (group.some((v) => titleWords.some((w) => w === v))) score += 28;
    else if (group.some((v) => titleWords.some((w) => w.startsWith(v)))) score += 18;
    else if (group.some((v) => normTitle.includes(v))) score += 10;
  }

  return score;
}
