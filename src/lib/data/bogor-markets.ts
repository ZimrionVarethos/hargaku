export type MarketTier = 'induk' | 'sentra' | 'rakyat';

export interface BogorMarket {
  id: string;
  code: string;
  name: string;
  shortName: string;
  area: string;
  tier: MarketTier;
  lat: number;
  lng: number;
  address: string;
  details: string;
  highlight: string;
  nearStation?: boolean;
  landmarkNote?: string;
  url: string;
}

export const BOGOR_MAP_CENTER: [number, number] = [106.798, -6.597];

export const BOGOR_MARKETS: BogorMarket[] = [
  {
    id: 'kebon-kembang',
    code: 'UNIT 01',
    name: 'Pasar Kebon Kembang Blok A, B, F & G (Pasar Anyar)',
    shortName: 'Pasar Kebon Kembang',
    area: 'Bogor Tengah',
    tier: 'induk',
    lat: -6.592387,
    lng: 106.792039,
    address: 'Jl. Dewi Sartika, Kel. Cibogor, Kec. Bogor Tengah, Kota Bogor',
    details:
      'Luas Tanah 9.665 m2 dan Bangunan 15.650 m2. Pusat perdagangan sayur-mayur, sembako, tekstil, serta lokasi Kantor Pusat Perumda PPJ (Blok F Lt. 3).',
    highlight: 'Pasar Induk & Trade Center',
    nearStation: true,
    landmarkNote: 'Dekat Stasiun Bogor (±350 m)',
    url: 'https://pasarpakuanjaya.co.id/pasar/info/53072266507240242459',
  },
  {
    id: 'jambu-dua',
    code: 'UNIT 02',
    name: 'Pasar Jambu Dua',
    shortName: 'Pasar Jambu Dua',
    area: 'Tanah Sareal',
    tier: 'induk',
    lat: -6.570202,
    lng: 106.807409,
    address: 'Jl. Ahmad Yani No. 83, Kel. Tanah Sareal, Kec. Tanah Sareal, Kota Bogor',
    details:
      'Pasar induk sayur-mayur, pangan segar, serta sentra kuliner UMKM Kota Bogor yang telah direvitalisasi.',
    highlight: 'Pasar Induk Sayur & Kuliner',
    url: 'https://pasarpakuanjaya.co.id/pasar/info/00657970751379677867',
  },
  {
    id: 'sukasari',
    code: 'UNIT 03',
    name: 'Pasar Sukasari (Pasar Gembrong)',
    shortName: 'Pasar Sukasari',
    area: 'Bogor Timur',
    tier: 'sentra',
    lat: -6.607318,
    lng: 106.801546,
    address: 'Jl. Siliwangi No. 35, RT.07/RW.02, Kel. Sukasari, Kec. Bogor Timur, Kota Bogor',
    details:
      'Pasar rakyat yang melayani kebutuhan pangan pokok dan sayuran segar warga Bogor Timur (jam operasional 07.00 sampai 18.00 WIB).',
    highlight: 'Pasar Rakyat Bogor Timur',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'tanah-baru',
    code: 'UNIT 04',
    name: 'Pasar Tanah Baru',
    shortName: 'Pasar Tanah Baru',
    area: 'Bogor Utara',
    tier: 'rakyat',
    lat: -6.582237,
    lng: 106.822822,
    address: 'Jl. Raya Tanah Baru No. 28, RT.05/RW.04, Kel. Tanah Baru, Kec. Bogor Utara, Kota Bogor',
    details:
      'Unit pasar Perumda PPJ yang melayani kebutuhan sayur segar, daging, dan sembako bagi warga Kecamatan Bogor Utara.',
    highlight: 'Unit Pasar Bogor Utara',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'devries',
    code: 'UNIT 05',
    name: 'Pasar Devries',
    shortName: 'Pasar Devries',
    area: 'Bogor Tengah',
    tier: 'rakyat',
    lat: -6.595854,
    lng: 106.787419,
    address: 'Jl. Veteran, Kel. Panaragan, Kec. Bogor Tengah, Kota Bogor',
    details:
      'Luas Tanah 400 m2, Bangunan 160 m2, 43 Kios dan 15 Los. Komoditas utama kuliner, sembako, serta pusat batu akik dan permata.',
    highlight: '43 Kios & 15 Los',
    nearStation: true,
    landmarkNote: 'Dekat Stasiun Bogor (±400 m)',
    url: 'https://pasarpakuanjaya.co.id/pasar/info/33421789654907634444',
  },
  {
    id: 'gunung-batu',
    code: 'UNIT 06',
    name: 'Pasar Gunung Batu',
    shortName: 'Pasar Gunung Batu',
    area: 'Bogor Barat',
    tier: 'rakyat',
    lat: -6.59411,
    lng: 106.778364,
    address: 'Jl. Mayjen Ishak Juarsa No. 21A, Kec. Bogor Barat, Kota Bogor',
    details:
      'Unit pasar rakyat di wilayah Bogor Barat di bawah pengelolaan resmi Perumda Pasar Pakuan Jaya Kota Bogor.',
    highlight: 'Unit Pasar Bogor Barat',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'merdeka',
    code: 'UNIT 07',
    name: 'Pasar Merdeka',
    shortName: 'Pasar Merdeka',
    area: 'Bogor Tengah',
    tier: 'rakyat',
    lat: -6.592364,
    lng: 106.786431,
    address: 'Jl. Perintis Kemerdekaan, Kec. Bogor Tengah, Kota Bogor',
    details:
      'Unit pasar rakyat yang dikelola Perumda Pasar Pakuan Jaya untuk pemenuhan komoditas harian masyarakat.',
    highlight: 'Unit Pasar Perumda PPJ',
    nearStation: true,
    landmarkNote: 'Dekat Stasiun Bogor (±250 m)',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'pasar-baru-bogor',
    code: 'UNIT 08',
    name: 'Pasar Baru Bogor',
    shortName: 'Pasar Baru Bogor',
    area: 'Bogor Tengah',
    tier: 'sentra',
    lat: -6.603647,
    lng: 106.80025,
    address: 'Jl. Suryakencana No. 3, Babakan Pasar, Kec. Bogor Tengah, Kota Bogor',
    details:
      'Unit pasar pantauan komoditas pangan historis Perumda Pasar Pakuan Jaya di kawasan pusat Kota Bogor.',
    highlight: 'Unit Pasar Pantauan',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'plaza-bogor',
    code: 'UNIT 09',
    name: 'Plaza Bogor',
    shortName: 'Plaza Bogor',
    area: 'Bogor Tengah',
    tier: 'sentra',
    lat: -6.60312,
    lng: 106.79918,
    address: 'Kawasan Suryakencana, Babakan Pasar, Kec. Bogor Tengah, Kota Bogor',
    details:
      'Unit kawasan perdagangan di bawah koordinasi Perumda Pasar Pakuan Jaya Kota Bogor.',
    highlight: 'Kawasan Perdagangan',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'taman-kencana',
    code: 'UNIT 10',
    name: 'Pasar Taman Kencana',
    shortName: 'Pasar Taman Kencana',
    area: 'Bogor Tengah',
    tier: 'rakyat',
    lat: -6.58712,
    lng: 106.8014,
    address: 'Kel. Babakan, Kawasan Taman Kencana, Kec. Bogor Tengah, Kota Bogor',
    details:
      'Unit pasar Perumda Pasar Pakuan Jaya yang melayani kawasan Taman Kencana, Kecamatan Bogor Tengah.',
    highlight: 'Unit Pasar Bogor Tengah',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'pamoyanan',
    code: 'UNIT 11',
    name: 'Pasar Pamoyanan',
    shortName: 'Pasar Pamoyanan',
    area: 'Bogor Selatan',
    tier: 'rakyat',
    lat: -6.637947,
    lng: 106.808202,
    address: 'Kec. Bogor Selatan, Kota Bogor',
    details:
      'Unit pasar rakyat di wilayah Bogor Selatan dalam daftar jaringan Perumda Pasar Pakuan Jaya.',
    highlight: 'Unit Pasar Bogor Selatan',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'padasuka',
    code: 'UNIT 12',
    name: 'Pasar Padasuka',
    shortName: 'Pasar Padasuka',
    area: 'Bogor Tengah',
    tier: 'rakyat',
    lat: -6.608598,
    lng: 106.80245,
    address: 'Jl. Padasuka, Kel. Gudang, Kec. Bogor Tengah, Kota Bogor',
    details:
      'Unit pasar tradisional Perumda Pasar Pakuan Jaya yang melayani kebutuhan bahan pokok masyarakat sekitar.',
    highlight: 'Unit Pasar Perumda PPJ',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
  {
    id: 'tekum',
    code: 'UNIT 13',
    name: 'Pasar Tekum',
    shortName: 'Pasar Tekum (TU)',
    area: 'Tanah Sareal',
    tier: 'sentra',
    lat: -6.5578,
    lng: 106.7675,
    address: 'Jl. Sholeh Iskandar, Kel. Cibadak, Kec. Tanah Sareal, Kota Bogor',
    details:
      'Unit pasar induk/teknik umum resmi dalam jaringan 13 pasar Perumda Pasar Pakuan Jaya Kota Bogor.',
    highlight: 'Unit Pasar Perumda PPJ',
    url: 'https://www.pasarpakuanjaya.co.id/pasar',
  },
];
