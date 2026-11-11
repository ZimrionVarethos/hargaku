import type { CommoditySummary, Market, Region } from '../../types/index.ts';
import type { BogorCommodity } from '../data/bogor-commodities.ts';
import { findMatchingCommodity } from '../market-insights.ts';
import {
  expandSearchTokenGroups,
  isSafeInternalHref,
  normalizeSearchText,
  sanitizeSearchQuery,
} from './search-security.ts';
import { SITE_SEARCH_PAGES } from './site-pages-index.ts';
import {
  formatShortCategoryBadge,
  inferSvgKind,
  scoreMatch,
  type SiteSearchFilter,
  type SiteSearchItem,
  type SiteSearchResult,
} from './site-search-helpers.ts';

export type {
  SiteSearchCategory,
  SiteSearchFilter,
  SiteSearchItem,
  SiteSearchResult,
} from './site-search-helpers.ts';

export function searchSiteContent(params: {
  query: string;
  category?: SiteSearchFilter;
  region?: Region;
  regions: Region[];
  bogorCommodities: BogorCommodity[];
  catalogCommodities: CommoditySummary[];
  markets: Market[];
  limit?: number;
}): SiteSearchResult {
  const {
    query,
    category = 'ALL',
    region,
    regions,
    bogorCommodities,
    catalogCommodities,
    markets,
    limit = 30,
  } = params;

  const sanitizedQuery = sanitizeSearchQuery(query);
  const activeRegionId = region?.id || regions[0]?.id || 'reg_bogor';
  const emptyCounts: Record<SiteSearchFilter, number> = {
    ALL: 0,
    COMMODITY: 0,
    MARKET: 0,
    REGION: 0,
    PAGE: 0,
  };

  if (!sanitizedQuery) {
    return {
      query: '',
      sanitizedQuery: '',
      regionId: activeRegionId,
      total: 0,
      counts: emptyCounts,
      items: [],
    };
  }

  const normalizedPhrase = normalizeSearchText(sanitizedQuery);
  const tokenGroups = expandSearchTokenGroups(sanitizedQuery);
  if (tokenGroups.length === 0) {
    return {
      query: sanitizedQuery,
      sanitizedQuery,
      regionId: activeRegionId,
      total: 0,
      counts: emptyCounts,
      items: [],
    };
  }

  const disparity = region?.disparityIndex || 1;
  const regionNameById = new Map<string, string>();
  for (const r of regions) regionNameById.set(r.id, r.name);

  const candidates: SiteSearchItem[] = [];
  const matchedCatalogIds = new Set<string>();

  for (const item of bogorCommodities) {
    const matched = findMatchingCommodity(catalogCommodities, {
      commodityId: String(item.id),
      commodityName: item.name,
    });
    if (matched) matchedCatalogIds.add(matched.id);

    const displayName = item.name;
    const basePrice = matched && matched.currentAvgPrice > 0 ? matched.currentAvgPrice : item.price;
    const regionalPrice = Math.round(basePrice * disparity);
    const score = scoreMatch(normalizedPhrase, tokenGroups, displayName, [
      matched?.name || '',
      item.category,
      item.subCategory,
      item.unit,
      `#${item.no.toString().padStart(2, '0')}`,
      'komoditas harga pangan',
    ]);

    if (score > 0) {
      const targetHref = `/indeks-harga?q=${encodeURIComponent(displayName)}`;
      candidates.push({
        id: `com-b-${item.id}`,
        kind: 'COMMODITY',
        title: displayName,
        subtitle: `Acuan ${region?.name || 'wilayah'} · Rp ${regionalPrice.toLocaleString('id-ID')}/${item.unit}`,
        metaLabel: item.category,
        badgeLabel: formatShortCategoryBadge(item.category, item.subCategory, displayName),
        href: isSafeInternalHref(targetHref) ? targetHref : '/indeks-harga',
        priceText: `Rp ${regionalPrice.toLocaleString('id-ID')}/${item.unit}`,
        svgKind: item.svg,
        commoditySlug: matched?.slug,
        score: score + (item.isPrimaryStaple ? 5 : 0),
      });
    }
  }

  for (const c of catalogCommodities) {
    if (matchedCatalogIds.has(c.id)) continue;
    const basePrice = c.currentAvgPrice > 0 ? c.currentAvgPrice : c.hapHetPrice;
    const regionalPrice = Math.round(basePrice * disparity);
    const score = scoreMatch(normalizedPhrase, tokenGroups, c.name, [
      c.category,
      c.unit,
      c.slug.replace(/-/g, ' '),
      'komoditas harga pangan',
    ]);
    if (score > 0) {
      const targetHref = `/indeks-harga?q=${encodeURIComponent(c.name)}`;
      candidates.push({
        id: `com-c-${c.id}`,
        kind: 'COMMODITY',
        title: c.name,
        subtitle: `Acuan ${region?.name || 'wilayah'} · Rp ${regionalPrice.toLocaleString('id-ID')}/${c.unit}`,
        metaLabel: c.category,
        badgeLabel: formatShortCategoryBadge(c.category, '', c.name),
        href: isSafeInternalHref(targetHref) ? targetHref : '/indeks-harga',
        priceText: `Rp ${regionalPrice.toLocaleString('id-ID')}/${c.unit}`,
        svgKind: inferSvgKind(c.name),
        commoditySlug: c.slug,
        score: score + 4,
      });
    }
  }

  const seenMarkets = new Set<string>();
  for (const m of markets) {
    if (!m.isActive || seenMarkets.has(m.id)) continue;
    seenMarkets.add(m.id);

    const regLabel = (m.regionId && regionNameById.get(m.regionId)) || m.city;
    const stationNote = m.landmarkNote || (m.nearStation ? 'Dekat Stasiun' : '');
    const score = scoreMatch(normalizedPhrase, tokenGroups, m.name, [
      m.district,
      m.city,
      regLabel,
      stationNote,
      m.nearStation ? 'stasiun kereta' : '',
      'pasar rakyat tradisional lokasi',
    ]);
    if (score > 0) {
      const paramsList = [`market=${encodeURIComponent(m.id)}`];
      if (m.regionId) paramsList.push(`region=${encodeURIComponent(m.regionId)}`);
      const targetHref = `/peta?${paramsList.join('&')}`;
      const isCurrentRegion = m.regionId === activeRegionId;
      candidates.push({
        id: `mkt-${m.id}`,
        kind: 'MARKET',
        title: m.name,
        subtitle: stationNote ? `${m.district}, ${m.city} · ${stationNote}` : `${m.district}, ${m.city}`,
        metaLabel: regLabel,
        badgeLabel: m.nearStation ? 'Pasar · Stasiun' : 'Pasar Rakyat',
        href: isSafeInternalHref(targetHref) ? targetHref : '/peta',
        nearStation: Boolean(m.nearStation),
        marketId: m.id,
        regionId: m.regionId,
        score: score + (isCurrentRegion ? 8 : 0) + (m.nearStation ? 4 : 0),
      });
    }
  }

  for (const reg of regions) {
    const score = scoreMatch(normalizedPhrase, tokenGroups, reg.name, [
      reg.province || '',
      reg.islandName,
      reg.phaseLabel || '',
      'wilayah provinsi daerah fase',
    ]);
    if (score > 0) {
      const targetHref = `/peta?region=${encodeURIComponent(reg.slug)}`;
      candidates.push({
        id: `reg-${reg.id}`,
        kind: 'REGION',
        title: reg.name,
        subtitle: `${reg.phaseLabel || 'Fase 4'} · ${reg.islandName}${reg.logisticsCostPct > 0 ? ` (+${reg.logisticsCostPct}% logistik)` : ''}`,
        metaLabel: reg.province || reg.islandName,
        badgeLabel: `Wilayah F${reg.phase || 4}`,
        href: isSafeInternalHref(targetHref) ? targetHref : '/peta',
        regionId: reg.id,
        score: score + (reg.phase === 1 ? 4 : 0),
      });
    }
  }

  for (const page of SITE_SEARCH_PAGES) {
    const score = scoreMatch(normalizedPhrase, tokenGroups, page.title, [
      page.subtitle,
      page.badgeLabel,
      ...page.keywords,
    ]);
    if (score > 0 && isSafeInternalHref(page.href)) {
      candidates.push({
        id: page.id,
        kind: 'PAGE',
        title: page.title,
        subtitle: page.subtitle,
        metaLabel: page.badgeLabel,
        badgeLabel: page.badgeLabel,
        href: page.href,
        iconKey: page.iconKey,
        score: score + 3,
      });
    }
  }

  candidates.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.title.localeCompare(b.title)));

  const counts: Record<SiteSearchFilter, number> = {
    ALL: candidates.length,
    COMMODITY: candidates.filter((i) => i.kind === 'COMMODITY').length,
    MARKET: candidates.filter((i) => i.kind === 'MARKET').length,
    REGION: candidates.filter((i) => i.kind === 'REGION').length,
    PAGE: candidates.filter((i) => i.kind === 'PAGE').length,
  };

  const scoped =
    category === 'ALL' ? candidates : candidates.filter((item) => item.kind === category);

  return {
    query: sanitizedQuery,
    sanitizedQuery,
    regionId: activeRegionId,
    total: candidates.length,
    counts,
    items: scoped.slice(0, Math.max(1, Math.min(60, limit))),
  };
}
