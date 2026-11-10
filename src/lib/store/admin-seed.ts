import type {
  AdminCommodity,
  AdminMarket,
  DailyPriceRecord,
  AdminState,
} from '../types/admin.ts';
import { MOCK_MARKETS } from '../mock/markets.data.ts';
import { DEFAULT_ADMIN_USER, INITIAL_ADMIN_REPORTS } from './admin-seed-reports.ts';

export { DEFAULT_ADMIN_USER, INITIAL_ADMIN_REPORTS };

export const INITIAL_COMMODITIES: AdminCommodity[] = [
  {
    id: 'cabai-merah-keriting',
    name: 'Cabai Merah Keriting',
    slug: 'cabai-merah-keriting',
    category: 'CABAI_BAWANG',
    unit: 'kg',
    hapHetPrice: 40000,
    tolerancePercentage: 10,
    isActive: true,
  },
  {
    id: 'bawang-merah-brebes',
    name: 'Bawang Merah Brebes',
    slug: 'bawang-merah-brebes',
    category: 'CABAI_BAWANG',
    unit: 'kg',
    hapHetPrice: 36500,
    tolerancePercentage: 10,
    isActive: true,
  },
  {
    id: 'cabai-rawit-merah',
    name: 'Cabai Rawit Merah',
    slug: 'cabai-rawit-merah',
    category: 'CABAI_BAWANG',
    unit: 'kg',
    hapHetPrice: 57000,
    tolerancePercentage: 10,
    isActive: true,
  },
  {
    id: 'daging-sapi-murni',
    name: 'Daging Sapi Murni',
    slug: 'daging-sapi-murni',
    category: 'DAGING',
    unit: 'kg',
    hapHetPrice: 140000,
    tolerancePercentage: 10,
    isActive: true,
  },
  {
    id: 'daging-ayam-broiler',
    name: 'Daging Ayam Broiler',
    slug: 'daging-ayam-broiler',
    category: 'DAGING',
    unit: 'kg',
    hapHetPrice: 36750,
    tolerancePercentage: 10,
    isActive: true,
  },
  {
    id: 'minyak-goreng-curah',
    name: 'Minyak Goreng Curah',
    slug: 'minyak-goreng-curah',
    category: 'MINYAK',
    unit: 'liter',
    hapHetPrice: 15700,
    tolerancePercentage: 10,
    isActive: true,
  },
  {
    id: 'beras-medium-ir64',
    name: 'Beras Medium IR-64',
    slug: 'beras-medium-ir64',
    category: 'BERAS',
    unit: 'kg',
    hapHetPrice: 14500,
    tolerancePercentage: 10,
    isActive: true,
  },
  {
    id: 'telur-ayam-ras',
    name: 'Telur Ayam Ras',
    slug: 'telur-ayam-ras',
    category: 'DAGING',
    unit: 'kg',
    hapHetPrice: 28000,
    tolerancePercentage: 10,
    isActive: true,
  },
];

export const INITIAL_MARKETS: AdminMarket[] = MOCK_MARKETS.map((m) => ({
  id: m.id,
  regionId: m.regionId || 'reg_bogor',
  name: m.name,
  slug: m.slug,
  city: m.city,
  district: m.district,
  address: `${m.name}, ${m.district}, ${m.city}`,
  latitude: m.latitude,
  longitude: m.longitude,
  operatingHours: '04:00 - 14:00 WIB',
  specialty: m.nearStation ? 'Dekat Stasiun & Sentra Pangan' : 'Sentra Pangan Tradisional',
  nearStation: Boolean(m.nearStation),
  landmarkNote: m.landmarkNote,
  isActive: m.isActive,
}));

function generateInitialDailyPrices(): Record<string, DailyPriceRecord> {
  const records: Record<string, DailyPriceRecord> = {};
  const today = '2026-10-23';

  for (const m of INITIAL_MARKETS) {
    for (const c of INITIAL_COMMODITIES) {
      const charCodeSum = (m.id + c.id).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const variancePct = ((charCodeSum % 15) - 6) / 100;
      const basePrice = Math.round((c.hapHetPrice * (1 + variancePct)) / 100) * 100;
      const prevPrice = Math.round((c.hapHetPrice * (1 + variancePct - 0.02)) / 100) * 100;

      records[`${m.id}_${c.id}`] = {
        marketId: m.id,
        commodityId: c.id,
        price: basePrice,
        previousPrice: prevPrice,
        recordedDate: today,
      };
    }
  }

  return records;
}

export const INITIAL_DAILY_PRICES: Record<string, DailyPriceRecord> = generateInitialDailyPrices();

export const INITIAL_ADMIN_STATE: AdminState = {
  currentUser: DEFAULT_ADMIN_USER,
  commodities: INITIAL_COMMODITIES,
  markets: INITIAL_MARKETS,
  dailyPrices: INITIAL_DAILY_PRICES,
  reports: INITIAL_ADMIN_REPORTS,
};
