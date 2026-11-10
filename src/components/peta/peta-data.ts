export interface PetaMarketPrice {
  marketId: string;
  name: string;
  shortName: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  xPercent: number;
  yPercent: number;
  price: number;
  regionalAvgPrice?: number;
  diffPercent: number;
  status: 'cheaper' | 'average' | 'expensive';
  stock?: 'Melimpah' | 'Cukup' | 'Terbatas';
  reportsCount: number;
  nearStation?: boolean;
  landmarkNote?: string;
  expensiveItemsCount?: number;
  shortageCount?: number;
  alertHeadline?: string;
  lastUpdated: string;
  googleMapsUrl: string;
}

export interface PetaCommodityOption {
  id: string;
  name: string;
  unit: string;
  cityAvgPrice: number;
  markets: Record<string, Omit<PetaMarketPrice, 'marketId' | 'name' | 'shortName' | 'district' | 'address' | 'latitude' | 'longitude' | 'xPercent' | 'yPercent' | 'googleMapsUrl' | 'regionalAvgPrice'>>;
}

export const PETA_MARKETS_INFO = [
  {
    id: 'sukasari',
    name: 'Pasar Sukasari',
    shortName: 'Pasar Sukasari',
    district: 'Sentra Wilayah Timur',
    address: 'Sentra Sayur & Bumbu Wilayah Timur',
    latitude: -6.602123,
    longitude: 106.800123,
    xPercent: 62,
    yPercent: 74,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Sukasari',
  },
  {
    id: 'pasar-anyar',
    name: 'Pasar Kebon Kembang (Pasar Anyar)',
    shortName: 'Pasar Kebon Kembang',
    district: 'Pusat Kota',
    address: 'Pusat Kota & Dekat Stasiun Bogor',
    latitude: -6.591245,
    longitude: 106.792512,
    xPercent: 44,
    yPercent: 52,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Anyar+Bogor',
  },
  {
    id: 'devries',
    name: 'Pasar Devries',
    shortName: 'Devries',
    district: 'Bogor Tengah',
    address: 'Jl. Veteran Dekat Stasiun Bogor',
    latitude: -6.59441,
    longitude: 106.78791,
    xPercent: 38,
    yPercent: 50,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Devries+Bogor',
  },
  {
    id: 'gunung-batu',
    name: 'Pasar Gunung Batu',
    shortName: 'Gunung Batu',
    district: 'Bogor Barat',
    address: 'Kawasan Permukiman Padat Barat',
    latitude: -6.597654,
    longitude: 106.778912,
    xPercent: 24,
    yPercent: 60,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Gunung+Batu',
  },
  {
    id: 'jambu-dua',
    name: 'Pasar Jambu Dua',
    shortName: 'Jambu Dua',
    district: 'Bogor Utara',
    address: 'Simpang Distribusi Utara',
    latitude: -6.573214,
    longitude: 106.805432,
    xPercent: 72,
    yPercent: 26,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Jambu+Dua',
  },
];

export const PETA_COMMODITIES: PetaCommodityOption[] = [
  {
    id: 'cabai-rawit-merah',
    name: 'Cabai Rawit Merah',
    unit: 'kg',
    cityAvgPrice: 60400,
    markets: {
      sukasari: { price: 58000, diffPercent: -4.0, status: 'cheaper', stock: 'Melimpah', reportsCount: 1, lastUpdated: '06:00 WIB' },
      'jambu-dua': { price: 59500, diffPercent: -1.5, status: 'cheaper', stock: 'Cukup', reportsCount: 1, lastUpdated: '06:00 WIB' },
      'gunung-batu': { price: 60500, diffPercent: 0.2, status: 'average', stock: 'Cukup', reportsCount: 1, lastUpdated: '05:30 WIB' },
      'pasar-anyar': { price: 61000, diffPercent: 1.0, status: 'average', stock: 'Terbatas', reportsCount: 3, lastUpdated: '06:00 WIB' },
      devries: { price: 63500, diffPercent: 5.1, status: 'expensive', stock: 'Terbatas', reportsCount: 2, lastUpdated: '06:00 WIB' },
    },
  },
  {
    id: 'bawang-merah-brebes',
    name: 'Bawang Merah Brebes',
    unit: 'kg',
    cityAvgPrice: 36500,
    markets: {},
  },
  {
    id: 'cabai-merah-keriting',
    name: 'Cabai Merah Keriting',
    unit: 'kg',
    cityAvgPrice: 40000,
    markets: {},
  },
  {
    id: 'daging-ayam-broiler',
    name: 'Daging Ayam Broiler',
    unit: 'kg',
    cityAvgPrice: 36750,
    markets: {},
  },
  {
    id: 'daging-sapi-murni',
    name: 'Daging Sapi Murni',
    unit: 'kg',
    cityAvgPrice: 140000,
    markets: {},
  },
  {
    id: 'minyak-goreng-curah',
    name: 'Minyak Goreng Curah',
    unit: 'liter',
    cityAvgPrice: 15700,
    markets: {},
  },
  {
    id: 'beras-medium-ir64',
    name: 'Beras Medium IR-64',
    unit: 'kg',
    cityAvgPrice: 14500,
    markets: {},
  },
  {
    id: 'telur-ayam-ras',
    name: 'Telur Ayam Ras',
    unit: 'kg',
    cityAvgPrice: 28000,
    markets: {},
  },
];
