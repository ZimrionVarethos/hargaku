import { MOCK_REGIONS } from '@/lib/mock/regions.data';
import type { IslandCorridor } from '@/types';

export type { AdminReport } from '@/lib/types/admin';
export { INITIAL_ADMIN_REPORTS } from '@/lib/store/admin-seed';

export const COMMODITY_CATEGORY_FILTERS = [
  { id: 'ALL', label: 'Semua' },
  { id: 'CABAI_BAWANG', label: 'Cabai/Bawang' },
  { id: 'BERAS', label: 'Beras' },
  { id: 'DAGING', label: 'Daging/Telur' },
  { id: 'MINYAK', label: 'Minyak/Gula' },
  { id: 'SAYUR', label: 'Sayur' },
] as const;

export const REGION_ISLAND_MAP: Record<string, IslandCorridor> = Object.fromEntries(
  MOCK_REGIONS.map((r) => [r.id, r.island])
);

export const MARKET_ISLAND_FILTERS = [
  { id: 'ALL', label: 'Semua Wilayah' },
  { id: 'JAWA', label: 'Jawa' },
  { id: 'SUMATERA', label: 'Sumatera' },
  { id: 'KALIMANTAN', label: 'Kalimantan' },
  { id: 'SULAWESI', label: 'Sulawesi' },
  { id: 'BALI_NUSRA', label: 'Bali-Nusra' },
  { id: 'MALUKU_PAPUA', label: 'Maluku-Papua' },
] as const;
