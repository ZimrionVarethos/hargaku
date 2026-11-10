import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import {
  PIHPS_POSITIONING_NOTE,
  computeMedian,
  computeMarketInsights,
  computeStationAreaInsights,
  findMentionedMarket,
  matchesCommodityRecord,
} from '@/lib/market-insights';
import type { SourceComparisonItem } from '@/types/assistant';
import type { AdminCommodity, AdminMarket, AdminReport, DailyPriceRecord } from '@/lib/types/admin';
import type { MarketInsightsSummary, Region } from '@/types';

export function buildSourceComparisons(
  query: string,
  region: Region,
  commodities: AdminCommodity[],
  markets: AdminMarket[],
  dailyPrices: Record<string, DailyPriceRecord>,
  reports: AdminReport[],
  enabledSources: string[]
): SourceComparisonItem[] {
  const lower = query.toLowerCase();
  const activeMarkets = markets.filter((m) => m.isActive);
  const regionMarkets = filterMarketsForRegion(activeMarkets, region.id);
  const scopeMarkets = regionMarkets.length > 0 ? regionMarkets : activeMarkets;

  let picked = commodities.filter(
    (c) =>
      c.isActive &&
      (lower.includes(c.name.toLowerCase()) ||
        lower.includes(c.slug.replace(/-/g, ' ')) ||
        c.name
          .toLowerCase()
          .split(' ')
          .filter((w) => w.length >= 4)
          .every((w) => lower.includes(w)))
  );

  if (picked.length === 0) {
    picked = commodities.filter((c) => c.isActive).slice(0, 3);
  } else {
    picked = picked.slice(0, 3);
  }

  const approvedPriceReports = reports.filter(
    (r) => r.status === 'APPROVED' && (r.reportType || 'PRICE') === 'PRICE' && r.normalizedPricePerKg > 0
  );

  return picked.map((com) => {
    let priceSum = 0;
    let priceCount = 0;
    let cheapestMarket: { market: AdminMarket; price: number } | undefined;

    for (const m of scopeMarkets) {
      const rec = dailyPrices[`${m.id}_${com.id}`];
      if (rec && rec.price > 0) {
        priceSum += rec.price;
        priceCount++;
        if (!cheapestMarket || rec.price < cheapestMarket.price) {
          cheapestMarket = { market: m, price: rec.price };
        }
      }
    }

    const regionalFactor = region.disparityIndex || 1.0;
    const hapNational = com.hapHetPrice;
    const hapRegional = Math.round((hapNational * regionalFactor) / 100) * 100;
    const pihpsAvg =
      priceCount > 0
        ? Math.round(priceSum / priceCount / 100) * 100
        : Math.round((hapRegional * 1.04) / 100) * 100;

    const localMarketPrice = cheapestMarket
      ? cheapestMarket.price
      : Math.round((pihpsAvg * 0.97) / 100) * 100;

    const matchedReports = approvedPriceReports.filter((r) => matchesCommodityRecord(r, com));
    const citizenMedian =
      matchedReports.length > 0
        ? computeMedian(matchedReports.map((r) => r.normalizedPricePerKg))
        : Math.round((localMarketPrice * 0.99) / 100) * 100;

    const candidates = [
      {
        sourceName: 'Acuan Nasional Bapanas (HAP/HET)',
        price: hapNational,
        note: `Standar nasional${regionalFactor !== 1 ? ` (Zona daerah: Rp ${hapRegional.toLocaleString('id-ID')})` : ''}`,
      },
      {
        sourceName: `Rerata Pasar ${region.name} / PIHPS`,
        price: pihpsAvg,
        note: `Rerata ${priceCount || 1} pasar terpantau`,
      },
      {
        sourceName: cheapestMarket ? `${cheapestMarket.market.name} (Survei)` : 'Perumda PPJ / Pasar Rakyat',
        price: localMarketPrice,
        note: cheapestMarket ? `Pasar terhemat di ${region.name}` : 'Data survei pasar rakyat',
      },
      {
        sourceName: 'Laporan Warga Terverifikasi',
        price: citizenMedian,
        note:
          matchedReports.length > 0
            ? `Median ${matchedReports.length} laporan warga (${matchedReports[0].marketName})`
            : 'Median laporan warga 7 hari',
      },
    ].filter((src) => {
      if (enabledSources.length === 0) return true;
      if (src.sourceName.includes('Bapanas')) return enabledSources.some((e) => e.includes('Bapanas'));
      if (src.sourceName.includes('PIHPS')) return enabledSources.some((e) => e.includes('PIHPS'));
      if (src.sourceName.includes('Warga')) return enabledSources.some((e) => e.includes('Warga'));
      return true;
    });

    const activeList =
      candidates.length > 0
        ? candidates
        : [{ sourceName: 'Acuan Nasional Bapanas (HAP/HET)', price: hapNational, note: 'Acuan nasional' }];

    let minPrice = Infinity;
    for (const s of activeList) {
      if (s.price < minPrice) minPrice = s.price;
    }
    const sources = activeList.map((s) => ({ ...s, isLowest: s.price === minPrice }));
    const best = sources.find((s) => s.isLowest) || sources[0];

    return {
      commodityName: com.name,
      unit: com.unit,
      regionName: region.name,
      recommendedSource: `${best.sourceName} (Rp ${best.price.toLocaleString('id-ID')}/${com.unit})`,
      sources,
    };
  });
}

function formatInsightLine(ins: MarketInsightsSummary): string {
  const stationTag = ins.nearStation ? ` [${ins.landmarkNote || 'Dekat Stasiun'}]` : '';
  const exp =
    ins.expensiveItems.length > 0
      ? ins.expensiveItems
          .slice(0, 3)
          .map(
            (item) =>
              `${item.commodityName} Rp ${item.reportedMedianPrice.toLocaleString('id-ID')}/${item.unit} (+${item.diffPercent}% vs acuan Rp ${item.officialPrice.toLocaleString('id-ID')}, ${item.reportCount} laporan)`
          )
          .join('; ')
      : 'Belum ada lonjakan laporan warga >10%';
  const sh =
    ins.shortageAlerts.length > 0
      ? ins.shortageAlerts
          .slice(0, 3)
          .map(
            (al) =>
              `${al.commodityName} [${al.stockStatus}]${al.note ? `: ${al.note}` : ''}`
          )
          .join('; ')
      : 'Stok normal terpantau';
  return `- ${ins.marketName}${stationTag}\n  * Sedang mahal (laporan warga): ${exp}\n  * Info stok pedagang (agregat pasar, tanpa identitas lapak): ${sh}`;
}

export function buildMarketAlertContextPrompt(
  query: string,
  region: Region,
  commodities: AdminCommodity[],
  markets: AdminMarket[],
  dailyPrices: Record<string, DailyPriceRecord>,
  reports: AdminReport[]
): string {
  const lower = query.toLowerCase();
  const explicitMarket = findMentionedMarket(markets, query);
  const activeRegionMarkets = filterMarketsForRegion(
    markets.filter((m) => m.isActive),
    region.id
  );

  const selectedInsights: MarketInsightsSummary[] = [];
  if (explicitMarket) {
    selectedInsights.push(
      computeMarketInsights({
        marketId: explicitMarket.id,
        marketName: explicitMarket.name,
        commodities,
        markets,
        dailyPrices,
        reports,
        disparityIndex: region.disparityIndex,
      })
    );
  }

  if (lower.includes('stasiun') || lower.includes('kereta') || lower.includes('mahal') || lower.includes('langka') || selectedInsights.length === 0) {
    const stationInsights = computeStationAreaInsights({
      commodities,
      markets,
      dailyPrices,
      reports,
    });
    for (const si of stationInsights) {
      if (!selectedInsights.some((x) => x.marketId === si.marketId)) {
        selectedInsights.push(si);
      }
    }
  }

  if (selectedInsights.length === 0 && activeRegionMarkets.length > 0) {
    selectedInsights.push(
      ...activeRegionMarkets.slice(0, 3).map((m) =>
        computeMarketInsights({
          marketId: m.id,
          marketName: m.name,
          commodities,
          markets,
          dailyPrices,
          reports,
          disparityIndex: region.disparityIndex,
        })
      )
    );
  }

  const lines = selectedInsights.slice(0, 4).map(formatInsightLine).join('\n');
  return [
    `POSISI PRODUK: ${PIHPS_POSITIONING_NOTE}`,
    `LAPORAN WARGA & KELANGKAAN PEDAGANG PER PASAR:`,
    lines,
  ].join('\n');
}
