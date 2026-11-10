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
    shortName: 'Pasar Anyar',
    district: 'Pusat Kota',
    address: 'Pusat Kota & Induk Sembako',
    latitude: -6.591245,
    longitude: 106.792512,
    xPercent: 44,
    yPercent: 52,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Anyar+Bogor',
  },
  {
    id: 'kebon-kembang',
    name: 'Pasar Kebon Kembang Blok F',
    shortName: 'Kebon Kembang F',
    district: 'Pusat Grosir',
    address: 'Pusat Grosir & Komoditas Pangan',
    latitude: -6.592812,
    longitude: 106.791245,
    xPercent: 38,
    yPercent: 50,
    googleMapsUrl: 'https://maps.google.com/?q=Pasar+Kebon+Kembang',
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
      sukasari: { price: 58000, diffPercent: -4.0, status: 'cheaper', stock: 'Melimpah', reportsCount: 14, lastUpdated: '06:00 WIB' },
      'jambu-dua': { price: 59500, diffPercent: -1.5, status: 'cheaper', stock: 'Cukup', reportsCount: 8, lastUpdated: '06:00 WIB' },
      'gunung-batu': { price: 60500, diffPercent: 0.2, status: 'average', stock: 'Cukup', reportsCount: 9, lastUpdated: '05:30 WIB' },
      'pasar-anyar': { price: 61000, diffPercent: 1.0, status: 'average', stock: 'Melimpah', reportsCount: 22, lastUpdated: '06:00 WIB' },
      'kebon-kembang': { price: 63500, diffPercent: 5.1, status: 'expensive', stock: 'Terbatas', reportsCount: 11, lastUpdated: '06:00 WIB' },
    },
  },
  {
    id: 'bawang-merah',
    name: 'Bawang Merah Brebes',
    unit: 'kg',
    cityAvgPrice: 34500,
    markets: {
      'pasar-anyar': { price: 33000, diffPercent: -4.3, status: 'cheaper', stock: 'Melimpah', reportsCount: 18, lastUpdated: '06:00 WIB' },
      'kebon-kembang': { price: 34000, diffPercent: -1.4, status: 'cheaper', stock: 'Melimpah', reportsCount: 15, lastUpdated: '06:00 WIB' },
      sukasari: { price: 34500, diffPercent: 0.0, status: 'average', stock: 'Cukup', reportsCount: 12, lastUpdated: '06:00 WIB' },
      'jambu-dua': { price: 35000, diffPercent: 1.4, status: 'average', stock: 'Cukup', reportsCount: 7, lastUpdated: '06:00 WIB' },
      'gunung-batu': { price: 36000, diffPercent: 4.3, status: 'expensive', stock: 'Terbatas', reportsCount: 6, lastUpdated: '05:30 WIB' },
    },
  },
  {
    id: 'daging-ayam',
    name: 'Daging Ayam Broiler',
    unit: 'kg',
    cityAvgPrice: 36600,
    markets: {
      sukasari: { price: 36000, diffPercent: -1.6, status: 'cheaper', stock: 'Melimpah', reportsCount: 16, lastUpdated: '06:00 WIB' },
      'pasar-anyar': { price: 36500, diffPercent: -0.3, status: 'average', stock: 'Melimpah', reportsCount: 19, lastUpdated: '06:00 WIB' },
      'jambu-dua': { price: 36500, diffPercent: -0.3, status: 'average', stock: 'Cukup', reportsCount: 10, lastUpdated: '06:00 WIB' },
      'gunung-batu': { price: 37000, diffPercent: 1.1, status: 'average', stock: 'Cukup', reportsCount: 8, lastUpdated: '05:30 WIB' },
      'kebon-kembang': { price: 37500, diffPercent: 2.5, status: 'expensive', stock: 'Cukup', reportsCount: 12, lastUpdated: '06:00 WIB' },
    },
  },
  {
    id: 'daging-sapi',
    name: 'Daging Sapi Murni',
    unit: 'kg',
    cityAvgPrice: 137000,
    markets: {
      sukasari: { price: 134000, diffPercent: -2.2, status: 'cheaper', stock: 'Melimpah', reportsCount: 11, lastUpdated: '05:00 WIB' },
      'pasar-anyar': { price: 136000, diffPercent: -0.7, status: 'average', stock: 'Cukup', reportsCount: 10, lastUpdated: '06:00 WIB' },
      'kebon-kembang': { price: 138000, diffPercent: 0.7, status: 'average', stock: 'Cukup', reportsCount: 9, lastUpdated: '06:00 WIB' },
      'jambu-dua': { price: 139000, diffPercent: 1.5, status: 'average', stock: 'Terbatas', reportsCount: 6, lastUpdated: '06:00 WIB' },
      'gunung-batu': { price: 140000, diffPercent: 2.2, status: 'expensive', stock: 'Terbatas', reportsCount: 5, lastUpdated: '05:30 WIB' },
    },
  },
  {
    id: 'beras-medium',
    name: 'Beras Medium IR-64',
    unit: 'kg',
    cityAvgPrice: 13900,
    markets: {
      'kebon-kembang': { price: 13500, diffPercent: -2.9, status: 'cheaper', stock: 'Melimpah', reportsCount: 21, lastUpdated: '06:00 WIB' },
      'pasar-anyar': { price: 13700, diffPercent: -1.4, status: 'average', stock: 'Melimpah', reportsCount: 16, lastUpdated: '06:00 WIB' },
      'gunung-batu': { price: 13900, diffPercent: 0.0, status: 'average', stock: 'Cukup', reportsCount: 11, lastUpdated: '05:30 WIB' },
      sukasari: { price: 14100, diffPercent: 1.4, status: 'average', stock: 'Cukup', reportsCount: 9, lastUpdated: '06:00 WIB' },
      'jambu-dua': { price: 14200, diffPercent: 2.2, status: 'expensive', stock: 'Cukup', reportsCount: 8, lastUpdated: '06:00 WIB' },
    },
  },
];
