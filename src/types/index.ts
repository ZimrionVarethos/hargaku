export type CommodityCategory =
  | 'BERAS'
  | 'CABAI_BAWANG'
  | 'DAGING_TELUR'
  | 'MINYAK_GULA'
  | 'SAYURAN';

export type BapanasZone = 'ZONA_1' | 'ZONA_2' | 'ZONA_3';

export type IslandCorridor =
  | 'JAWA'
  | 'SUMATERA'
  | 'KALIMANTAN'
  | 'SULAWESI'
  | 'BALI_NUSRA'
  | 'MALUKU_PAPUA';

export interface Region {
  id: string;
  name: string;
  slug: string;
  province?: string;
  island: IslandCorridor;
  islandName: string;
  zone: BapanasZone;
  logisticsCostPct: number;
  disparityIndex: number;
  description?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface CommoditySummary {
  id: string;
  name: string;
  slug: string;
  category: CommodityCategory;
  unit: string;
  imageUrl: string;
  currentAvgPrice: number;
  previousAvgPrice: number;
  changePercentage: number;
  hapHetPrice: number;
  nationalHapPrice?: number;
  regionalAdjustedHap?: number;
  statusVsHap: 'BELOW_HAP' | 'EQUAL_HAP' | 'ABOVE_HAP';
  lastUpdated: string;
  sparkline?: number[];
  source?: 'PIHPS' | 'Bapanas';
}

export interface CommodityDetail {
  id: string;
  name: string;
  slug: string;
  unit: string;
  category: CommodityCategory;
  reference: {
    priceHapHet: number;
    nationalHapHet?: number;
    regionalAdjustedPrice?: number;
    zone?: BapanasZone;
    type: 'HAP' | 'HET';
    legalDoc: string;
  };
  currentPriceStats: {
    regionName?: string;
    cityAverage: number;
    highestMarket: { name: string; price: number };
    lowestMarket: { name: string; price: number };
    citizenReportsCount: number;
  };
  priceHistory: Array<{
    date: string;
    avgPrice: number;
  }>;
}

export interface Market {
  id: string;
  regionId?: string;
  name: string;
  slug: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export type PriceCheckStatus =
  | 'FAIR'
  | 'SLIGHTLY_EXPENSIVE'
  | 'OVERPRICED'
  | 'MUCH_CHEAPER';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriceCheckRequest {
  commodityId: string;
  marketId: string;
  regionSlug?: string;
  offeredPrice: number;
}

export interface PriceCheckResult {
  offeredPrice: number;
  comparisonPrice: number;
  diffPercentage: number;
  status: PriceCheckStatus;
  statusLabel: string;
  statusBadgeColor: 'emerald' | 'amber' | 'rose' | 'blue';
  markupDetected?: boolean;
  markupLabel?: string;
  advice: string;
  confidenceLevel: ConfidenceLevel;
  confidenceReason: string;
  layers: {
    lapis1HapHet: number;
    lapis1NationalHap?: number;
    lapis1RegionalHap?: number;
    lapis2OfficialAvg: number;
    lapis3CitizenMedian: number;
  };
  regionName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
