import { BOGOR_COMMODITIES, BogorCommodity } from './bogor-commodities';

export interface MarketStallData {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  zStart: number;
  zEnd: number;
  targetWalkProgress: number;
  items: BogorCommodity[];
}

export interface LorongCompartmentSlot {
  id: number;
  commodityId: number;
  label: string;
  zStart: number;
  zEnd: number;
  side: 'left' | 'right';
  produceType: string;
}

export const LORONG_COMPARTMENT_SLOTS: LorongCompartmentSlot[] = [
  { id: 1, commodityId: 25, label: 'Kol Bulat', zStart: 1, zEnd: 7, side: 'left', produceType: 'kol' },
  { id: 2, commodityId: 30, label: 'Wortel', zStart: 7, zEnd: 13, side: 'left', produceType: 'wortel' },
  { id: 3, commodityId: 24, label: 'Kangkung', zStart: 1, zEnd: 7, side: 'right', produceType: 'sayur' },
  { id: 4, commodityId: 41, label: 'Tomat', zStart: 7, zEnd: 13, side: 'right', produceType: 'tomat' },
  { id: 5, commodityId: 16, label: 'Bwg Merah', zStart: 13, zEnd: 19, side: 'left', produceType: 'bawang-merah' },
  { id: 6, commodityId: 19, label: 'Cabe Krtg', zStart: 19, zEnd: 25, side: 'left', produceType: 'cabe' },
  { id: 7, commodityId: 17, label: 'Bwg Putih', zStart: 13, zEnd: 19, side: 'right', produceType: 'bawang-putih' },
  { id: 8, commodityId: 21, label: 'Cabe Rawit', zStart: 19, zEnd: 25, side: 'right', produceType: 'cabe' },
  { id: 9, commodityId: 2, label: 'Beras Med', zStart: 25, zEnd: 31, side: 'left', produceType: 'beras' },
  { id: 10, commodityId: 48, label: 'Gula Pasir', zStart: 31, zEnd: 37, side: 'left', produceType: 'gula' },
  { id: 11, commodityId: 8, label: 'Minyak Grg', zStart: 25, zEnd: 31, side: 'right', produceType: 'minyak' },
  { id: 12, commodityId: 3, label: 'Beras Prem', zStart: 31, zEnd: 37, side: 'right', produceType: 'beras' },
  { id: 13, commodityId: 43, label: 'Dg Sapi', zStart: 37, zEnd: 43, side: 'left', produceType: 'daging' },
  { id: 14, commodityId: 44, label: 'Dg Ayam', zStart: 43, zEnd: 49, side: 'left', produceType: 'daging' },
  { id: 15, commodityId: 46, label: 'Telur Ras', zStart: 37, zEnd: 43, side: 'right', produceType: 'telur' },
  { id: 16, commodityId: 47, label: 'Tlr Kampg', zStart: 43, zEnd: 49, side: 'right', produceType: 'telur' },
  { id: 17, commodityId: 57, label: 'Ikan Kmbg', zStart: 49, zEnd: 55, side: 'left', produceType: 'ikan' },
  { id: 18, commodityId: 53, label: 'Jeruk', zStart: 55, zEnd: 61, side: 'left', produceType: 'jeruk' },
  { id: 19, commodityId: 58, label: 'Ikan Tuna', zStart: 49, zEnd: 55, side: 'right', produceType: 'ikan' },
  { id: 20, commodityId: 56, label: 'Semangka', zStart: 55, zEnd: 61, side: 'right', produceType: 'semangka' },
];

export const STALL_ZONE_META = [
  { id: 0, badge: 'Sayuran', title: 'Lapak Sayuran Segar', subtitle: 'Wortel, kol, tomat, kangkung, bayam, dan sayuran hijau petani lokal', accentColor: '#245034', zStart: 1, zEnd: 13, targetWalkProgress: 0.025 },
  { id: 1, badge: 'Cabai & Bawang', title: 'Lapak Cabai & Bawang', subtitle: 'Cabai rawit, cabai keriting, bawang merah, bawang putih, dan bombay', accentColor: '#A92717', zStart: 13, zEnd: 25, targetWalkProgress: 0.21 },
  { id: 2, badge: 'Beras & Sembako', title: 'Lapak Beras & Sembako', subtitle: 'Beras medium, beras premium, minyak goreng, gula pasir, dan terigu', accentColor: '#B47B38', zStart: 25, zEnd: 37, targetWalkProgress: 0.41 },
  { id: 3, badge: 'Daging & Telur', title: 'Lapak Daging & Telur', subtitle: 'Daging sapi murni, daging ayam segar, serta telur ayam ras dan kampung', accentColor: '#9F1239', zStart: 37, zEnd: 49, targetWalkProgress: 0.61 },
  { id: 4, badge: 'Ikan & Buah', title: 'Lapak Ikan Segar & Buah', subtitle: 'Ikan kembung, tuna, tongkol segar, jeruk, pisang, pepaya, dan semangka', accentColor: '#1D4ED8', zStart: 49, zEnd: 61, targetWalkProgress: 0.785 },
] as const;

export function isSpiceOrChiliCommodity(c: BogorCommodity): boolean {
  return /\b(cabe|cabai|bawang)\b/i.test(c.name) || c.category === 'CABAI' || c.category === 'BAWANG';
}

export function getZoneIndexForCommodity(c: BogorCommodity): number {
  if (isSpiceOrChiliCommodity(c)) return 1;
  if (c.category === 'BERAS & POKOK' || c.category === 'MINYAK & GULA' || c.category === 'MINYAK & BUMBU') return 2;
  if (c.category === 'DAGING & TELUR' || c.category === 'DAGING & UNGGAS') return 3;
  if (c.category === 'IKAN SEGAR' || c.category === 'IKAN & LAUT' || c.category === 'BUAH') return 4;
  return 0;
}

export function getZoneIndexByWalkProgress(walkProgress: number): number {
  const viewZ = walkProgress * 60 + 6.0;
  for (let i = STALL_ZONE_META.length - 1; i >= 0; i--) {
    if (viewZ >= STALL_ZONE_META[i].zStart) return i;
  }
  return 0;
}

export function findCompartmentSlotByCommodityId(commodityId: number): LorongCompartmentSlot | undefined {
  return LORONG_COMPARTMENT_SLOTS.find((s) => s.commodityId === commodityId);
}

export function getMarketStalls(source: BogorCommodity[] = BOGOR_COMMODITIES): MarketStallData[] {
  const grouped: BogorCommodity[][] = [[], [], [], [], []];
  for (const item of source) {
    grouped[getZoneIndexForCommodity(item)].push(item);
  }
  return STALL_ZONE_META.map((meta, idx) => ({
    id: meta.id,
    title: meta.title,
    subtitle: meta.subtitle,
    badge: meta.badge,
    accentColor: meta.accentColor,
    zStart: meta.zStart,
    zEnd: meta.zEnd,
    targetWalkProgress: meta.targetWalkProgress,
    items: grouped[idx],
  }));
}
