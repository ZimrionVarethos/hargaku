import type { CommoditySummary, Market } from '../types/index.ts';
import type { AdminCommodity, AdminMarket, AdminReport } from './types/admin.ts';

export const PIHPS_POSITIONING_NOTE =
  'PasarKu melengkapi pemantauan PIHPS Bank Indonesia dan Panel Harga Bapanas sebagai alat bantu keputusan pembeli di depan lapak, bukan menggantikan data resmi pemerintah.';

export const MARKET_ALIAS_MAP: Record<string, string> = {
  'kebon-kembang': 'mkt_kebon_kembang',
  mkt_kebon_kembang: 'mkt_kebon_kembang',
  'pasar-anyar': 'mkt_kebon_kembang',
  mkt_pasar_anyar: 'mkt_kebon_kembang',
  devries: 'mkt_devries',
  mkt_devries: 'mkt_devries',
  merdeka: 'mkt_merdeka',
  mkt_merdeka: 'mkt_merdeka',
  sukasari: 'mkt_sukasari',
  mkt_sukasari: 'mkt_sukasari',
  'gunung-batu': 'mkt_gunung_batu',
  mkt_gunung_batu: 'mkt_gunung_batu',
  'jambu-dua': 'mkt_jambu_dua',
  mkt_jambu_dua: 'mkt_jambu_dua',
  'tanah-baru': 'mkt_tanah_baru',
  mkt_tanah_baru: 'mkt_tanah_baru',
  'pasar-baru-bogor': 'mkt_pasar_baru_bogor',
  mkt_pasar_baru_bogor: 'mkt_pasar_baru_bogor',
  'plaza-bogor': 'mkt_plaza_bogor',
  mkt_plaza_bogor: 'mkt_plaza_bogor',
  'taman-kencana': 'mkt_taman_kencana',
  mkt_taman_kencana: 'mkt_taman_kencana',
  pamoyanan: 'mkt_pamoyanan',
  mkt_pamoyanan: 'mkt_pamoyanan',
  padasuka: 'mkt_padasuka',
  mkt_padasuka: 'mkt_padasuka',
  tekum: 'mkt_tekum',
  mkt_tekum: 'mkt_tekum',
};

export const STATION_MARKET_LANDMARKS: Record<string, string> = {
  mkt_kebon_kembang: 'Dekat Stasiun Bogor (±350 m)',
  mkt_devries: 'Dekat Stasiun Bogor (±400 m)',
  mkt_merdeka: 'Dekat Stasiun Bogor (±250 m)',
  mkt_kemiri_muka: 'Dekat Stasiun Depok Baru (±200 m)',
};

export function normalizeMarketKey(raw?: string): string {
  if (!raw) return '';
  const cleaned = raw.trim().toLowerCase();
  if (MARKET_ALIAS_MAP[cleaned]) return MARKET_ALIAS_MAP[cleaned];
  if (cleaned.includes('kebon kembang') || cleaned.includes('pasar anyar')) return 'mkt_kebon_kembang';
  if (cleaned.includes('devries')) return 'mkt_devries';
  if (cleaned.includes('merdeka')) return 'mkt_merdeka';
  if (cleaned.includes('sukasari') || cleaned.includes('gembrong')) return 'mkt_sukasari';
  if (cleaned.includes('gunung batu')) return 'mkt_gunung_batu';
  if (cleaned.includes('jambu dua')) return 'mkt_jambu_dua';
  if (cleaned.includes('tanah baru')) return 'mkt_tanah_baru';
  if (cleaned.includes('pasar baru bogor')) return 'mkt_pasar_baru_bogor';
  if (cleaned.includes('plaza bogor')) return 'mkt_plaza_bogor';
  if (cleaned.includes('taman kencana')) return 'mkt_taman_kencana';
  if (cleaned.includes('pamoyanan')) return 'mkt_pamoyanan';
  if (cleaned.includes('padasuka')) return 'mkt_padasuka';
  if (cleaned.includes('tekum')) return 'mkt_tekum';
  return cleaned;
}

export function resolveCanonicalMarket<T extends { id: string; slug: string; name: string }>(
  markets: T[],
  idOrName?: string
): T | undefined {
  if (!idOrName) return undefined;
  const canonical = normalizeMarketKey(idOrName);
  return (
    markets.find(
      (m) =>
        m.id === idOrName ||
        m.slug === idOrName ||
        normalizeMarketKey(m.id) === canonical ||
        normalizeMarketKey(m.slug) === canonical ||
        normalizeMarketKey(m.name) === canonical
    ) ||
    markets.find((m) => m.name.toLowerCase().includes(idOrName.trim().toLowerCase()))
  );
}

export function findMentionedMarket<T extends { id: string; slug: string; name: string }>(
  markets: T[],
  sentence?: string
): T | undefined {
  if (!sentence) return undefined;
  const lower = sentence.toLowerCase();
  const aliasKey = normalizeMarketKey(lower);
  if (aliasKey !== lower.trim()) {
    const matched = markets.find((m) => m.id === aliasKey || normalizeMarketKey(m.id) === aliasKey);
    if (matched) return matched;
  }
  return markets.find((m) => {
    const shortName = m.name.replace(/^pasar\s+/i, '').trim().toLowerCase();
    return shortName.length >= 5 && lower.includes(shortName);
  });
}

export function computeMedian(values: number[]): number {
  const valid = values.filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (valid.length === 0) return 0;
  const mid = Math.floor(valid.length / 2);
  if (valid.length % 2 === 1) return Math.round(valid[mid]);
  return Math.round((valid[mid - 1] + valid[mid]) / 2);
}

export function normalizeQuantityPrice(
  offeredTotalPrice: number,
  quantity: number = 1,
  unitIdOrLabel: string = 'kg'
): number {
  if (!Number.isFinite(offeredTotalPrice) || offeredTotalPrice <= 0) return 0;
  const qty = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  const u = unitIdOrLabel.toLowerCase();
  let multiplierToStandard = 1;
  if (u.includes('ons') || u.includes('100g') || u === 'ons') {
    multiplierToStandard = 0.1;
  } else if (u.includes('quarter') || u.includes('1/4') || u.includes('250')) {
    multiplierToStandard = 0.25;
  } else if (u.includes('half') || u.includes('1/2') || u.includes('500')) {
    multiplierToStandard = 0.5;
  }
  const totalStandardUnits = qty * multiplierToStandard;
  if (totalStandardUnits <= 0) return Math.round(offeredTotalPrice);
  return Math.round(offeredTotalPrice / totalStandardUnits);
}

function getCommodityTokens(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/\bcabe\b/g, 'cabai')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !['lokal', 'murni', 'konsumsi'].includes(t));
}

export function matchesCommodityRecord(
  report: Pick<AdminReport, 'commodityId' | 'commodityName'>,
  commodity: { id: string; slug: string; name: string }
): boolean {
  if (report.commodityId) {
    if (report.commodityId === commodity.id || report.commodityId === commodity.slug) {
      return true;
    }
  }
  const repName = report.commodityName.toLowerCase().replace(/\bcabe\b/g, 'cabai');
  const comName = commodity.name.toLowerCase().replace(/\bcabe\b/g, 'cabai');
  if (repName === comName || repName.includes(comName) || comName.includes(repName)) {
    return true;
  }
  const repTokens = getCommodityTokens(report.commodityName);
  const comTokens = getCommodityTokens(commodity.name);
  if (repTokens.length === 0 || comTokens.length === 0) return false;
  const overlap = comTokens.filter((t) => repTokens.includes(t)).length;
  return overlap >= Math.min(repTokens.length, comTokens.length);
}

export function findMatchingCommodity<T extends { id: string; slug: string; name: string }>(
  commodities: T[],
  report: Pick<AdminReport, 'commodityId' | 'commodityName'>
): T | undefined {
  if (report.commodityId) {
    const byId = commodities.find(
      (c) => c.id === report.commodityId || c.slug === report.commodityId
    );
    if (byId) return byId;
  }
  const repName = report.commodityName.toLowerCase().replace(/\bcabe\b/g, 'cabai');
  const byExactName = commodities.find(
    (c) => c.name.toLowerCase().replace(/\bcabe\b/g, 'cabai') === repName
  );
  if (byExactName) return byExactName;
  return commodities.find((c) => matchesCommodityRecord(report, c));
}

export function matchesMarketRecord(
  report: Pick<AdminReport, 'marketId' | 'marketName'>,
  targetMarketIdOrName: string
): boolean {
  const targetKey = normalizeMarketKey(targetMarketIdOrName);
  if (!targetKey) return false;
  if (report.marketId && normalizeMarketKey(report.marketId) === targetKey) {
    return true;
  }
  return normalizeMarketKey(report.marketName) === targetKey;
}

export type CommodityLike =
  | AdminCommodity
  | CommoditySummary
  | {
      id: string;
      slug: string;
      name: string;
      unit?: string;
      hapHetPrice?: number;
      currentAvgPrice?: number;
    };
export type MarketLike = AdminMarket | Market;

export function computeCommodityCitizenStats(
  commodity: { id: string; slug: string; name: string },
  reports: AdminReport[],
  marketIdOrName?: string
): {
  marketMedian: number;
  cityMedian: number;
  marketCount: number;
  cityCount: number;
} {
  const approvedPrices = reports.filter(
    (r) =>
      r.status === 'APPROVED' &&
      (r.reportType || 'PRICE') === 'PRICE' &&
      r.normalizedPricePerKg > 0 &&
      matchesCommodityRecord(r, commodity)
  );
  const cityMedian = computeMedian(approvedPrices.map((r) => r.normalizedPricePerKg));
  const marketReports = marketIdOrName
    ? approvedPrices.filter((r) => matchesMarketRecord(r, marketIdOrName))
    : [];
  const marketMedian = computeMedian(marketReports.map((r) => r.normalizedPricePerKg));

  return {
    marketMedian,
    cityMedian,
    marketCount: marketReports.length,
    cityCount: approvedPrices.length,
  };
}
