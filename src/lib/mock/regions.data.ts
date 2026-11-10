import { Region, IslandCorridor } from '@/types';

export interface IslandTab {
  id: 'ALL' | IslandCorridor;
  label: string;
  badge?: string;
}

export const ISLAND_TABS: IslandTab[] = [
  { id: 'ALL', label: 'Semua Pulau' },
  { id: 'JAWA', label: 'Jawa', badge: '+0%' },
  { id: 'SUMATERA', label: 'Sumatera', badge: '+6%' },
  { id: 'KALIMANTAN', label: 'Kalimantan', badge: '+12%' },
  { id: 'SULAWESI', label: 'Sulawesi', badge: '+8%' },
  { id: 'BALI_NUSRA', label: 'Bali-Nusra', badge: '+8%' },
  { id: 'MALUKU_PAPUA', label: 'Maluku-Papua', badge: '+25%' },
];

export const MOCK_REGIONS: Region[] = [
  { id: 'reg_jabar', latitude: -6.917464, longitude: 107.619123, name: 'Jawa Barat', slug: 'jawa-barat', island: 'JAWA', islandName: 'Pulau Jawa', zone: 'ZONA_1', logisticsCostPct: 0, disparityIndex: 1.0, description: 'Sentra hortikultura, sayur-mayur, dan penyangga pasokan Jabodetabek.', isActive: true },
  { id: 'reg_jakarta', latitude: -6.208763, longitude: 106.845599, name: 'DKI Jakarta', slug: 'dki-jakarta', island: 'JAWA', islandName: 'Pulau Jawa', zone: 'ZONA_1', logisticsCostPct: 2, disparityIndex: 1.02, description: 'Metropolitan konsumen terbesar nasional dengan hub Pasar Induk Kramat Jati.', isActive: true },
  { id: 'reg_jateng', latitude: -7.150975, longitude: 110.140259, name: 'Jawa Tengah', slug: 'jawa-tengah', island: 'JAWA', islandName: 'Pulau Jawa', zone: 'ZONA_1', logisticsCostPct: 0, disparityIndex: 1.0, description: 'Lumbung bawang merah nasional (Brebes) dan sentra beras Jateng.', isActive: true },
  { id: 'reg_jatim', latitude: -7.536064, longitude: 112.238402, name: 'Jawa Timur', slug: 'jawa-timur', island: 'JAWA', islandName: 'Pulau Jawa', zone: 'ZONA_1', logisticsCostPct: 0, disparityIndex: 1.0, description: 'Sentra cabai rawit nasional (Kediri/Blitar), daging sapi, dan lumbung padi.', isActive: true },
  { id: 'reg_banten', latitude: -6.405817, longitude: 106.064018, name: 'Banten', slug: 'banten', island: 'JAWA', islandName: 'Pulau Jawa', zone: 'ZONA_1', logisticsCostPct: 1, disparityIndex: 1.01, description: 'Pintu gerbang Jawa-Sumatera via Pelabuhan Merak.', isActive: true },
  { id: 'reg_diy', latitude: -7.875385, longitude: 110.426209, name: 'D.I. Yogyakarta', slug: 'di-yogyakarta', island: 'JAWA', islandName: 'Pulau Jawa', zone: 'ZONA_1', logisticsCostPct: 1, disparityIndex: 1.01, description: 'Pusat kebudayaan dengan jalur distribusi logistik Joglosemar.', isActive: true },
  { id: 'reg_sumut', latitude: 3.595196, longitude: 98.672223, name: 'Sumatera Utara', slug: 'sumatera-utara', island: 'SUMATERA', islandName: 'Pulau Sumatera', zone: 'ZONA_1', logisticsCostPct: 6, disparityIndex: 1.06, description: 'Pusat perdagangan Sumatera bagian utara dengan pelabuhan Belawan.', isActive: true },
  { id: 'reg_sumbar', latitude: -0.947083, longitude: 100.417181, name: 'Sumatera Barat', slug: 'sumatera-barat', island: 'SUMATERA', islandName: 'Pulau Sumatera', zone: 'ZONA_1', logisticsCostPct: 5, disparityIndex: 1.05, description: 'Sentra produksi beras Solok dan cabai merah Bukittinggi.', isActive: true },
  { id: 'reg_sumsel', latitude: -2.976074, longitude: 104.775431, name: 'Sumatera Selatan', slug: 'sumatera-selatan', island: 'SUMATERA', islandName: 'Pulau Sumatera', zone: 'ZONA_1', logisticsCostPct: 4, disparityIndex: 1.04, description: 'Lumbung pangan Sumatera bagian selatan (Palembang / Ogan Ilir).', isActive: true },
  { id: 'reg_riau', latitude: 0.507068, longitude: 101.447779, name: 'Riau', slug: 'riau', island: 'SUMATERA', islandName: 'Pulau Sumatera', zone: 'ZONA_1', logisticsCostPct: 7, disparityIndex: 1.07, description: 'Daerah konsumen pangan dengan pasokan impor antar-pulau dari Sumbar dan Sumut.', isActive: true },
  { id: 'reg_lampung', latitude: -5.450000, longitude: 105.266667, name: 'Lampung', slug: 'lampung', island: 'SUMATERA', islandName: 'Pulau Sumatera', zone: 'ZONA_1', logisticsCostPct: 3, disparityIndex: 1.03, description: 'Pintu gerbang logistik Sumatera ke Jawa via Bakauheni.', isActive: true },
  { id: 'reg_kaltim', latitude: -0.502106, longitude: 117.153709, name: 'Kalimantan Timur', slug: 'kalimantan-timur', island: 'KALIMANTAN', islandName: 'Pulau Kalimantan', zone: 'ZONA_2', logisticsCostPct: 12, disparityIndex: 1.12, description: 'Daerah mitra IKN Nusantara dengan ketergantungan pasokan kargo laut dari Jawa dan Sulsel.', isActive: true },
  { id: 'reg_kalbar', latitude: -0.026330, longitude: 109.342503, name: 'Kalimantan Barat', slug: 'kalimantan-barat', island: 'KALIMANTAN', islandName: 'Pulau Kalimantan', zone: 'ZONA_2', logisticsCostPct: 10, disparityIndex: 1.1, description: 'Wilayah perbatasan barat dengan pasokan kargo laut dari Pelabuhan Tanjung Priok.', isActive: true },
  { id: 'reg_kalsel', latitude: -3.316694, longitude: 114.590111, name: 'Kalimantan Selatan', slug: 'kalimantan-selatan', island: 'KALIMANTAN', islandName: 'Pulau Kalimantan', zone: 'ZONA_2', logisticsCostPct: 9, disparityIndex: 1.09, description: 'Hub pelabuhan logistik Trisakti Banjarmasin menyuplai pedalaman Kalimantan.', isActive: true },
  { id: 'reg_sulsel', latitude: -5.147665, longitude: 119.432732, name: 'Sulawesi Selatan', slug: 'sulawesi-selatan', island: 'SULAWESI', islandName: 'Pulau Sulawesi', zone: 'ZONA_2', logisticsCostPct: 7, disparityIndex: 1.07, description: 'Lumbung padi dan beras kawasan timur Indonesia dengan pelabuhan Makassar.', isActive: true },
  { id: 'reg_sulut', latitude: 1.474830, longitude: 124.842079, name: 'Sulawesi Utara', slug: 'sulawesi-utara', island: 'SULAWESI', islandName: 'Pulau Sulawesi', zone: 'ZONA_2', logisticsCostPct: 11, disparityIndex: 1.11, description: 'Konsumen cabai rawit (rica) per kapita tertinggi nasional (Manado).', isActive: true },
  { id: 'reg_sulteng', latitude: -0.900257, longitude: 119.877998, name: 'Sulawesi Tengah', slug: 'sulawesi-tengah', island: 'SULAWESI', islandName: 'Pulau Sulawesi', zone: 'ZONA_2', logisticsCostPct: 9, disparityIndex: 1.09, description: 'Penghubung koridor logistik Sulawesi bagian barat dan timur.', isActive: true },
  { id: 'reg_bali', latitude: -8.409518, longitude: 115.188916, name: 'Bali', slug: 'bali', island: 'BALI_NUSRA', islandName: 'Kepulauan Bali & Nusa Tenggara', zone: 'ZONA_2', logisticsCostPct: 6, disparityIndex: 1.06, description: 'Pusat pariwisata internasional dengan serapan komoditas daging dan hortikultura tinggi.', isActive: true },
  { id: 'reg_ntb', latitude: -8.652933, longitude: 117.361648, name: 'Nusa Tenggara Barat', slug: 'nusa-tenggara-barat', island: 'BALI_NUSRA', islandName: 'Kepulauan Bali & Nusa Tenggara', zone: 'ZONA_2', logisticsCostPct: 8, disparityIndex: 1.08, description: 'Sentra jagung nasional dan bawang merah Bima.', isActive: true },
  { id: 'reg_maluku', latitude: -3.655381, longitude: 128.190773, name: 'Maluku', slug: 'maluku', island: 'MALUKU_PAPUA', islandName: 'Kepulauan Maluku & Papua', zone: 'ZONA_3', logisticsCostPct: 22, disparityIndex: 1.22, description: 'Wilayah kepulauan dengan ketergantungan tol laut untuk pasokan sembako dari Jawa/Sulsel.', isActive: true },
  { id: 'reg_papua', latitude: -2.591603, longitude: 140.669006, name: 'Papua', slug: 'papua', island: 'MALUKU_PAPUA', islandName: 'Kepulauan Maluku & Papua', zone: 'ZONA_3', logisticsCostPct: 28, disparityIndex: 1.28, description: 'Wilayah timur Indonesia dengan disparitas harga logistik kargo laut dan pegunungan.', isActive: true },
];

export const REGIONS_BY_ISLAND: Record<IslandCorridor, Region[]> = {
  JAWA: MOCK_REGIONS.filter((r) => r.island === 'JAWA'),
  SUMATERA: MOCK_REGIONS.filter((r) => r.island === 'SUMATERA'),
  KALIMANTAN: MOCK_REGIONS.filter((r) => r.island === 'KALIMANTAN'),
  SULAWESI: MOCK_REGIONS.filter((r) => r.island === 'SULAWESI'),
  BALI_NUSRA: MOCK_REGIONS.filter((r) => r.island === 'BALI_NUSRA'),
  MALUKU_PAPUA: MOCK_REGIONS.filter((r) => r.island === 'MALUKU_PAPUA'),
};

export const DEFAULT_REGION = MOCK_REGIONS[0];
