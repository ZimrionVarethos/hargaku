import type { CommoditySummary } from '@/types';
import type { BogorCommodity } from '@/lib/data/bogor-commodities';
import { findMatchingCommodity } from '@/lib/market-insights';

export type IndeksCategoryFilter =
  | 'ALL'
  | 'BERAS_POKOK'
  | 'CABAI_BAWANG'
  | 'SAYURAN'
  | 'DAGING_TELUR'
  | 'MINYAK_GULA'
  | 'IKAN_BUAH';

export type IndeksSortOption =
  | 'NO_ASC'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'NAME_ASC'
  | 'DIFF_DESC';

export interface IndeksCommodityRow {
  key: string;
  no: number;
  name: string;
  categoryLabel: string;
  subCategory: string;
  unit: string;
  svg: string;
  regionalPrice: number;
  nationalRef?: number;
  diffVsHapPct: number | null;
  catalogSlug?: string;
  changePercentage?: number;
  bogorItem: BogorCommodity;
}

export const QUICK_SEARCH_KEYWORDS = [
  'Beras',
  'Cabai',
  'Bawang',
  'Minyak',
  'Telur',
  'Daging',
  'Ikan',
];

export const INDEKS_CATEGORY_TABS: Array<{ id: IndeksCategoryFilter; label: string }> = [
  { id: 'ALL', label: 'Semua Pangan' },
  { id: 'BERAS_POKOK', label: 'Beras & Pokok' },
  { id: 'CABAI_BAWANG', label: 'Cabai & Bawang' },
  { id: 'SAYURAN', label: 'Sayuran' },
  { id: 'DAGING_TELUR', label: 'Daging & Telur' },
  { id: 'MINYAK_GULA', label: 'Minyak & Gula' },
  { id: 'IKAN_BUAH', label: 'Ikan & Buah' },
];

export function matchesIndeksCategory(
  row: IndeksCommodityRow,
  filter: IndeksCategoryFilter
): boolean {
  if (filter === 'ALL') return true;
  const upperCat = row.categoryLabel.toUpperCase();
  const lowerName = row.name.toLowerCase();
  const isCabaiOrBawang =
    /\bcabe\b/.test(lowerName) ||
    lowerName.includes('cabai') ||
    lowerName.includes('bawang');

  switch (filter) {
    case 'BERAS_POKOK':
      return upperCat.includes('BERAS');
    case 'CABAI_BAWANG':
      return isCabaiOrBawang || upperCat.includes('CABAI');
    case 'SAYURAN':
      return upperCat.includes('SAYUR') && !isCabaiOrBawang;
    case 'DAGING_TELUR':
      return upperCat.includes('DAGING') || upperCat.includes('TELUR');
    case 'MINYAK_GULA':
      return upperCat.includes('MINYAK') || upperCat.includes('GULA');
    case 'IKAN_BUAH':
      return upperCat.includes('IKAN') || upperCat.includes('BUAH');
  }
}

export function matchesIndeksSearch(row: IndeksCommodityRow, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const normalizedQ = q.replace(/\bcabai\b/g, 'cabe');
  const lowerName = row.name.toLowerCase();
  const normalizedName = lowerName.replace(/\bcabai\b/g, 'cabe');
  const indexTag = `#${row.no.toString().padStart(2, '0')}`;
  return (
    lowerName.includes(q) ||
    normalizedName.includes(normalizedQ) ||
    row.categoryLabel.toLowerCase().includes(q) ||
    row.subCategory.toLowerCase().includes(q) ||
    row.unit.toLowerCase().includes(q) ||
    indexTag.includes(q)
  );
}

function mapCatalogCategoryToLabel(category: CommoditySummary['category']): string {
  switch (category) {
    case 'BERAS':
      return 'BERAS & POKOK';
    case 'MINYAK_GULA':
      return 'MINYAK & GULA';
    case 'DAGING_TELUR':
      return 'DAGING & TELUR';
    default:
      return 'SAYURAN';
  }
}

function pickSvgForCatalog(item: CommoditySummary): string {
  const lower = item.name.toLowerCase();
  if (lower.includes('cabai') || lower.includes('cabe')) return 'chili';
  if (lower.includes('bawang merah')) return 'shallot';
  if (lower.includes('bawang putih')) return 'garlic';
  if (lower.includes('telur')) return 'egg';
  if (lower.includes('daging') || lower.includes('ayam')) return 'meat';
  if (lower.includes('ikan')) return 'fish';
  if (lower.includes('minyak') || lower.includes('gula')) return 'oil';
  if (lower.includes('beras')) return 'rice';
  return 'leafy';
}

export function buildIndeksCommodityRows(params: {
  bogorCommodities: BogorCommodity[];
  catalogCommodities: CommoditySummary[];
  calculateRegionalPrice: (basePrice: number) => number;
}): IndeksCommodityRow[] {
  const { bogorCommodities, catalogCommodities, calculateRegionalPrice } = params;
  const matchedCatalogIds = new Set<string>();
  const rows: IndeksCommodityRow[] = [];

  for (const b of bogorCommodities) {
    const matched = findMatchingCommodity(catalogCommodities, {
      commodityId: String(b.id),
      commodityName: b.name,
    });
    if (matched) matchedCatalogIds.add(matched.id);

    const regionalPrice = calculateRegionalPrice(b.price);
    const nationalRef = matched?.hapHetPrice && matched.hapHetPrice > 0 ? matched.hapHetPrice : undefined;
    const diffVsHapPct =
      nationalRef && nationalRef > 0
        ? Math.round(((regionalPrice - nationalRef) / nationalRef) * 1000) / 10
        : null;

    rows.push({
      key: `bogor-${b.id}`,
      no: b.no,
      name: b.name,
      categoryLabel: b.category,
      subCategory: b.subCategory,
      unit: b.unit,
      svg: b.svg,
      regionalPrice,
      nationalRef,
      diffVsHapPct,
      catalogSlug: matched?.slug,
      changePercentage: matched?.changePercentage,
      bogorItem: b,
    });
  }

  let extraNo = rows.reduce((max, r) => Math.max(max, r.no), 59) + 1;
  for (const c of catalogCommodities) {
    if (matchedCatalogIds.has(c.id)) continue;
    const basePrice = c.currentAvgPrice > 0 ? c.currentAvgPrice : c.hapHetPrice;
    const regionalPrice = calculateRegionalPrice(basePrice);
    const nationalRef = c.hapHetPrice > 0 ? c.hapHetPrice : undefined;
    const diffVsHapPct =
      nationalRef && nationalRef > 0
        ? Math.round(((regionalPrice - nationalRef) / nationalRef) * 1000) / 10
        : null;
    const catLabel = mapCatalogCategoryToLabel(c.category);
    const svg = pickSvgForCatalog(c);
    const syntheticBogor: BogorCommodity = {
      id: 1000 + extraNo,
      no: extraNo,
      name: c.name,
      category: catLabel,
      subCategory: c.category,
      price: basePrice,
      unit: c.unit,
      svg,
      featuredHero: false,
      isPrimaryStaple: false,
      url: 'https://pasarpakuanjaya.co.id/komoditas/index/view-all',
    };

    rows.push({
      key: `cat-${c.id}`,
      no: extraNo,
      name: c.name,
      categoryLabel: catLabel,
      subCategory: c.category,
      unit: c.unit,
      svg,
      regionalPrice,
      nationalRef,
      diffVsHapPct,
      catalogSlug: c.slug,
      changePercentage: c.changePercentage,
      bogorItem: syntheticBogor,
    });
    extraNo += 1;
  }

  return rows;
}

