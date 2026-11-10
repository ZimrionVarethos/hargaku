import type {
  MarketExpensiveItem,
  MarketInsightsSummary,
  MarketReportSummary,
  MarketShortageAlert,
  ReportType,
  ReporterRole,
  StockStatus,
} from '../types/index.ts';
import type { AdminReport, DailyPriceRecord } from './types/admin.ts';
import {
  STATION_MARKET_LANDMARKS,
  computeCommodityCitizenStats,
  computeMedian,
  findMatchingCommodity,
  findMentionedMarket,
  matchesCommodityRecord,
  matchesMarketRecord,
  normalizeMarketKey,
  normalizeQuantityPrice,
  PIHPS_POSITIONING_NOTE,
  resolveCanonicalMarket,
  type CommodityLike,
  type MarketLike,
} from './market-matching.ts';

export {
  PIHPS_POSITIONING_NOTE,
  computeCommodityCitizenStats,
  computeMedian,
  findMatchingCommodity,
  findMentionedMarket,
  matchesCommodityRecord,
  matchesMarketRecord,
  normalizeMarketKey,
  normalizeQuantityPrice,
  resolveCanonicalMarket,
};

function getBaselinePrice(com: CommodityLike, disparityIndex = 1): number {
  if ('hapHetPrice' in com && typeof com.hapHetPrice === 'number' && com.hapHetPrice > 0) {
    return Math.round(com.hapHetPrice * disparityIndex);
  }
  return 35000;
}

export function computeMarketInsights(params: {
  marketId: string;
  marketName?: string;
  commodities: CommodityLike[];
  markets: MarketLike[];
  dailyPrices: Record<string, DailyPriceRecord>;
  reports: AdminReport[];
  disparityIndex?: number;
}): MarketInsightsSummary {
  const {
    marketId,
    marketName,
    commodities,
    markets,
    dailyPrices,
    reports,
    disparityIndex = 1,
  } = params;

  const resolved = resolveCanonicalMarket(markets, marketId) || resolveCanonicalMarket(markets, marketName);
  const canonicalId = resolved?.id || normalizeMarketKey(marketId) || marketId;
  const resolvedName = resolved?.name || marketName || marketId;
  const landmarkNote = resolved?.landmarkNote || STATION_MARKET_LANDMARKS[canonicalId];
  const nearStation = Boolean(resolved?.nearStation || landmarkNote);

  const marketReports = reports.filter(
    (r) => matchesMarketRecord(r, canonicalId) || (resolvedName && matchesMarketRecord(r, resolvedName))
  );
  const approvedMarketReports = marketReports.filter((r) => r.status === 'APPROVED');

  const priceBuckets = new Map<string, { com: CommodityLike; prices: number[]; unit: string }>();
  const shortageMap = new Map<string, MarketShortageAlert>();

  for (const r of approvedMarketReports) {
    const matchedCom = findMatchingCommodity(commodities, r);
    const comKey = matchedCom?.id || r.commodityId || r.commodityName.toLowerCase();
    const comName = matchedCom?.name || r.commodityName;
    const reportType = r.reportType || 'PRICE';

    if (reportType === 'SHORTAGE') {
      const stockStatus: StockStatus = r.stockStatus || 'TERBATAS';
      if (stockStatus === 'PULIH') continue;
      const existing = shortageMap.get(comKey);
      if (!existing) {
        shortageMap.set(comKey, {
          commodityId: comKey,
          commodityName: comName,
          stockStatus,
          reportCount: 1,
          note: r.citizenNotes,
          submittedAt: r.submittedAt,
        });
      } else {
        existing.reportCount += 1;
        if (stockStatus === 'LANGKA') existing.stockStatus = 'LANGKA';
        if (!existing.note && r.citizenNotes) existing.note = r.citizenNotes;
      }
      continue;
    }

    if (r.normalizedPricePerKg <= 0) continue;
    const bucket = priceBuckets.get(comKey);
    if (bucket) {
      bucket.prices.push(r.normalizedPricePerKg);
    } else if (matchedCom) {
      priceBuckets.set(comKey, {
        com: matchedCom,
        prices: [r.normalizedPricePerKg],
        unit: matchedCom.unit || 'kg',
      });
    } else {
      priceBuckets.set(comKey, {
        com: {
          id: comKey,
          slug: comKey,
          name: comName,
          category: 'CABAI_BAWANG',
          unit: 'kg',
          hapHetPrice: r.officialHapPrice || r.cityAvgPrice || r.normalizedPricePerKg,
          tolerancePercentage: 10,
          isActive: true,
        },
        prices: [r.normalizedPricePerKg],
        unit: 'kg',
      });
    }
  }

  const expensiveItems: MarketExpensiveItem[] = [];
  for (const [comKey, bucket] of priceBuckets.entries()) {
    const medianPrice = computeMedian(bucket.prices);
    const hapPrice = getBaselinePrice(bucket.com, disparityIndex);
    const dailyRec = dailyPrices[`${canonicalId}_${comKey}`];
    const officialPrice =
      dailyRec && dailyRec.price > 0
        ? dailyRec.price
        : 'currentAvgPrice' in bucket.com &&
            typeof bucket.com.currentAvgPrice === 'number' &&
            bucket.com.currentAvgPrice > 0
        ? bucket.com.currentAvgPrice
        : hapPrice;
    const diffPercent = officialPrice > 0 ? Math.round(((medianPrice - officialPrice) / officialPrice) * 1000) / 10 : 0;

    if (diffPercent > 10) {
      expensiveItems.push({
        commodityId: bucket.com.id,
        commodityName: bucket.com.name,
        reportedMedianPrice: medianPrice,
        officialPrice,
        hapPrice,
        diffPercent,
        reportCount: bucket.prices.length,
        unit: bucket.unit,
      });
    }
  }
  expensiveItems.sort((a, b) => b.diffPercent - a.diffPercent);

  const shortageAlerts = Array.from(shortageMap.values()).sort((a, b) => {
    if (a.stockStatus === b.stockStatus) return b.reportCount - a.reportCount;
    return a.stockStatus === 'LANGKA' ? -1 : 1;
  });

  const recentReports: MarketReportSummary[] = approvedMarketReports.slice(0, 6).map((r) => ({
    id: r.id,
    reportType: (r.reportType || 'PRICE') as ReportType,
    reporterRole: (r.reporterRole || 'WARGA') as ReporterRole,
    commodityName: r.commodityName,
    marketName: r.marketName,
    reportedPrice: r.reportedPrice,
    unit: r.unit,
    normalizedPricePerKg: r.normalizedPricePerKg,
    diffPercent: r.diffPercent,
    stockStatus: r.stockStatus,
    submittedAt: r.submittedAt,
    hasPhoto: r.hasPhoto,
    citizenNotes: r.citizenNotes,
    status: r.status,
  }));

  return {
    marketId: canonicalId,
    marketName: resolvedName,
    nearStation,
    landmarkNote,
    expensiveItems,
    shortageAlerts,
    approvedPriceReportCount: approvedMarketReports.filter((r) => (r.reportType || 'PRICE') === 'PRICE').length,
    approvedShortageReportCount: approvedMarketReports.filter((r) => r.reportType === 'SHORTAGE').length,
    recentReports,
  };
}

export function computeStationAreaInsights(params: {
  commodities: CommodityLike[];
  markets: MarketLike[];
  dailyPrices: Record<string, DailyPriceRecord>;
  reports: AdminReport[];
}): MarketInsightsSummary[] {
  const stationMarkets = params.markets.filter(
    (m) => m.nearStation || Boolean(STATION_MARKET_LANDMARKS[normalizeMarketKey(m.id)])
  );
  return stationMarkets.map((m) =>
    computeMarketInsights({
      marketId: m.id,
      marketName: m.name,
      commodities: params.commodities,
      markets: params.markets,
      dailyPrices: params.dailyPrices,
      reports: params.reports,
    })
  );
}
