import { filterMarketsForRegion, getMarketsByRegion } from '@/lib/mock/markets.data';
import { computeMarketInsights } from '@/lib/market-insights';
import {
  STATION_MARKET_LANDMARKS,
  normalizeMarketKey,
} from '@/lib/market-matching';
import type { AdminCommodity, AdminMarket, AdminReport, DailyPriceRecord } from '@/lib/types/admin';
import type { Region } from '@/types';
import type { PetaMarketPrice } from './peta-data';

export function buildRegionMarketsList(
  rawMarkets: AdminMarket[],
  regionId: string
): AdminMarket[] {
  const liveFiltered = filterMarketsForRegion(rawMarkets, regionId);
  const seedFiltered = getMarketsByRegion(regionId);
  const dedupedLive: AdminMarket[] = [];
  const seenCanonical = new Set<string>();

  const sortedLive = [...liveFiltered].sort((a, b) => {
    if (a.id === 'mkt_kebon_kembang') return -1;
    if (b.id === 'mkt_kebon_kembang') return 1;
    return 0;
  });

  for (const m of sortedLive) {
    const canonical = normalizeMarketKey(m.id) || normalizeMarketKey(m.name) || m.id;
    if (seenCanonical.has(canonical)) continue;
    seenCanonical.add(canonical);
    dedupedLive.push(m);
  }

  if (dedupedLive.length === 0) {
    return seedFiltered.map((s) => ({
      ...s,
      regionId: s.regionId || regionId,
      address: `${s.name}, ${s.district}, ${s.city}`,
      operatingHours: '04:00 - 14:00 WIB',
      specialty: s.nearStation ? 'Dekat Stasiun & Sentra Pangan' : 'Sentra Pangan Tradisional',
    }));
  }

  const supplemented = seedFiltered
    .filter((s) => {
      const canonical = normalizeMarketKey(s.id) || normalizeMarketKey(s.name) || s.id;
      return !seenCanonical.has(canonical);
    })
    .map((s) => ({
      ...s,
      regionId: s.regionId || regionId,
      address: `${s.name}, ${s.district}, ${s.city}`,
      operatingHours: '04:00 - 14:00 WIB',
      specialty: s.nearStation ? 'Dekat Stasiun & Sentra Pangan' : 'Sentra Pangan Tradisional',
    }));

  return [...dedupedLive, ...supplemented];
}

export function buildPetaMarketPrices(params: {
  markets: AdminMarket[];
  dailyPrices: Record<string, DailyPriceRecord>;
  commodityId: string;
  baseRegionalPrice: number;
  rawCommodities: AdminCommodity[];
  rawMarkets: AdminMarket[];
  reports: AdminReport[];
  selectedRegion: Region;
}): PetaMarketPrice[] {
  const {
    markets,
    dailyPrices,
    commodityId,
    baseRegionalPrice,
    rawCommodities,
    rawMarkets,
    reports,
    selectedRegion,
  } = params;

  return markets.map((info, idx) => {
    const canonicalId = normalizeMarketKey(info.id) || info.id;
    const dailyRecord =
      dailyPrices[`${info.id}_${commodityId}`] ||
      dailyPrices[`${canonicalId}_${commodityId}`] ||
      (canonicalId === 'mkt_kebon_kembang'
        ? dailyPrices[`mkt_pasar_anyar_${commodityId}`]
        : undefined);
    const livePrice = dailyRecord && dailyRecord.price > 0 ? dailyRecord.price : null;

    const variationMultiplier = idx === 0 ? 0.96 : idx === 1 ? 0.99 : idx === 2 ? 1.02 : 1.04;
    const computedPrice =
      livePrice || Math.round((baseRegionalPrice * variationMultiplier) / 100) * 100;
    const diffPercent =
      baseRegionalPrice > 0
        ? Math.round(((computedPrice - baseRegionalPrice) / baseRegionalPrice) * 1000) / 10
        : 0;
    const status =
      diffPercent < -2
        ? ('cheaper' as const)
        : diffPercent > 2
        ? ('expensive' as const)
        : ('average' as const);

    const insights = computeMarketInsights({
      marketId: canonicalId,
      marketName: info.name,
      commodities: rawCommodities,
      markets: rawMarkets,
      dailyPrices,
      reports,
      disparityIndex: selectedRegion.disparityIndex,
    });

    const landmarkNote = info.landmarkNote || STATION_MARKET_LANDMARKS[canonicalId];
    const nearStation = Boolean(info.nearStation || landmarkNote || insights.nearStation);
    const totalReports =
      insights.approvedPriceReportCount + insights.approvedShortageReportCount;
    const alertHeadline = insights.expensiveItems[0]
      ? `${insights.expensiveItems[0].commodityName} +${insights.expensiveItems[0].diffPercent}%`
      : insights.shortageAlerts[0]
      ? `${insights.shortageAlerts[0].commodityName} (${insights.shortageAlerts[0].stockStatus})`
      : undefined;

    return {
      marketId: info.id,
      name: info.name,
      shortName: info.name.replace('Pasar ', '').split(' (')[0],
      district: info.district,
      address: landmarkNote
        ? `${info.district}, ${info.city} · ${landmarkNote}`
        : `${info.district}, ${info.city}`,
      latitude: info.latitude,
      longitude: info.longitude,
      xPercent: 50,
      yPercent: 50,
      price: computedPrice,
      regionalAvgPrice: baseRegionalPrice,
      diffPercent,
      status,
      reportsCount: totalReports,
      nearStation,
      landmarkNote,
      expensiveItemsCount: insights.expensiveItems.length,
      shortageCount: insights.shortageAlerts.length,
      alertHeadline,
      lastUpdated: '06:00 WIB',
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${info.name} ${info.city}`)}`,
    };
  });
}

