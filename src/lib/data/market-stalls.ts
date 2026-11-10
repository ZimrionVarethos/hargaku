import { BOGOR_COMMODITIES, BogorCommodity } from './bogor-commodities';

export interface MarketStallData {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  items: BogorCommodity[];
}

export function getMarketStalls(source: BogorCommodity[] = BOGOR_COMMODITIES): MarketStallData[] {
  const stall0 = source.filter(
    (c) => c.category === 'CABAI' || c.category === 'BAWANG' || c.subCategory === 'CABAI' || c.subCategory === 'BAWANG'
  );

  const stall1 = source.filter(
    (c) => c.category === 'SAYURAN' && c.subCategory !== 'CABAI' && c.subCategory !== 'BAWANG'
  );

  const stall2 = source.filter(
    (c) => c.category === 'BERAS & POKOK'
  );

  const stall3 = source.filter(
    (c) => c.category === 'DAGING & TELUR' || c.category === 'DAGING & UNGGAS'
  );

  const stall4 = source.filter(
    (c) => c.category === 'MINYAK & GULA' || c.category === 'MINYAK & BUMBU'
  );

  const stall5 = source.filter(
    (c) => c.category === 'IKAN SEGAR' || c.category === 'IKAN & LAUT' || c.category === 'BUAH'
  );

  return [
    {
      id: 0,
      title: 'Lapak Bumbu & Cabai',
      subtitle: 'Cabai rawit, cabai keriting, bawang merah Brebes, dan aneka rempah dapur',
      badge: 'Pusat Rempah',
      accentColor: '#A92717',
      items: stall0,
    },
    {
      id: 1,
      title: 'Lapak Sayuran Segar & Umbi',
      subtitle: 'Wortel Bogor, kol, tomat, kentang, buncis, sayuran hijau petani lokal',
      badge: 'Hasil Bumi',
      accentColor: '#245034',
      items: stall1,
    },
    {
      id: 2,
      title: 'Lapak Beras & Palawija',
      subtitle: 'Beras medium IR-64, beras premium, pandan wangi, ketan, dan jagung pipil',
      badge: 'Pangan Pokok',
      accentColor: '#B47B38',
      items: stall2,
    },
    {
      id: 3,
      title: 'Lapak Daging & Telur',
      subtitle: 'Daging sapi murni, daging ayam broiler segar, dan telur ayam ras pilihan',
      badge: 'Protein Hewani',
      accentColor: '#9F1239',
      items: stall3,
    },
    {
      id: 4,
      title: 'Lapak Minyak & Sembako',
      subtitle: 'Minyak goreng curah & kemasan, gula pasir, tepung terigu, dan garam dapur',
      badge: 'Sembako Harian',
      accentColor: '#D97706',
      items: stall4,
    },
    {
      id: 5,
      title: 'Lapak Ikan Basah & Buah Segar',
      subtitle: 'Ikan kembung, ikan tongkol segar, jeruk Medan, pisang, dan pepaya California',
      badge: 'Segar Alami',
      accentColor: '#1D4ED8',
      items: stall5,
    },
  ];
}

