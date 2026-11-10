import type { Market } from '../../types/index.ts';

export const OUTER_MARKETS: Market[] = [
  { id: 'mkt_petisah', regionId: 'reg_sumut', name: 'Pasar Petisah Sentral', slug: 'petisah', city: 'Kota Medan', district: 'Medan Petisah', latitude: 3.59012, longitude: 98.66712, isActive: true },
  { id: 'mkt_pusat_pasar_medan', regionId: 'reg_sumut', name: 'Pusat Pasar Medan (Sentral)', slug: 'pusat-pasar-medan', city: 'Kota Medan', district: 'Medan Kota', latitude: 3.58745, longitude: 98.68312, isActive: true },
  { id: 'mkt_sukaramai', regionId: 'reg_sumut', name: 'Pasar Sukaramai', slug: 'sukaramai', city: 'Kota Medan', district: 'Medan Area', latitude: 3.58123, longitude: 98.70123, isActive: true },

  { id: 'mkt_16_ilir', regionId: 'reg_sumsel', name: 'Pasar 16 Ilir Pesisir Musi', slug: '16-ilir', city: 'Kota Palembang', district: 'Ilir Timur I', latitude: -2.99123, longitude: 104.76123, isActive: true },
  { id: 'mkt_cinde', regionId: 'reg_sumsel', name: 'Pasar Cinde Sentral', slug: 'cinde', city: 'Kota Palembang', district: 'Ilir Barat I', latitude: -2.97845, longitude: 104.75234, isActive: true },
  { id: 'mkt_jakabaring', regionId: 'reg_sumsel', name: 'Pasar Induk Jakabaring', slug: 'jakabaring', city: 'Kota Palembang', district: 'Seberang Ulu I', latitude: -3.02123, longitude: 104.78123, isActive: true },

  { id: 'mkt_raya_padang', regionId: 'reg_sumbar', name: 'Pasar Raya Padang', slug: 'raya-padang', city: 'Kota Padang', district: 'Padang Barat', latitude: -0.95234, longitude: 100.35891, isActive: true },
  { id: 'mkt_atas_bkt', regionId: 'reg_sumbar', name: 'Pasar Atas Jam Gadang', slug: 'pasar-atas-bukittinggi', city: 'Kota Bukittinggi', district: 'Guguk Panjang', latitude: -0.30451, longitude: 100.36891, isActive: true },
  { id: 'mkt_banto', regionId: 'reg_sumbar', name: 'Pasar Banto Sentra Sayur', slug: 'pasar-banto', city: 'Kota Bukittinggi', district: 'Mandiangin', latitude: -0.30123, longitude: 100.37123, isActive: true },

  { id: 'mkt_bawah_pku', regionId: 'reg_riau', name: 'Pasar Bawah Wisata', slug: 'pasar-bawah', city: 'Kota Pekanbaru', district: 'Senapelan', latitude: 0.53678, longitude: 101.44654, isActive: true },
  { id: 'mkt_kodim_pku', regionId: 'reg_riau', name: 'Pasar Kodim Sentral Pangan', slug: 'pasar-kodim', city: 'Kota Pekanbaru', district: 'Sukajadi', latitude: 0.52891, longitude: 101.44123, isActive: true },
  { id: 'mkt_arengka_pku', regionId: 'reg_riau', name: 'Pasar Pagi Arengka', slug: 'pagi-arengka', city: 'Kota Pekanbaru', district: 'Marpoyan Damai', latitude: 0.48123, longitude: 101.42123, isActive: true },

  { id: 'mkt_bambu_kuning', regionId: 'reg_lampung', name: 'Pasar Bambu Kuning', slug: 'bambu-kuning', city: 'Kota Bandar Lampung', district: 'Tanjung Karang Pusat', latitude: -5.41891, longitude: 105.25891, isActive: true },
  { id: 'mkt_tamin', regionId: 'reg_lampung', name: 'Pasar Pasir Gintung & Tamin', slug: 'tamin', city: 'Kota Bandar Lampung', district: 'Tanjung Karang Barat', latitude: -5.41234, longitude: 105.25123, isActive: true },

  { id: 'mkt_klandasan', regionId: 'reg_kaltim', name: 'Pasar Klandasan', slug: 'klandasan', city: 'Kota Balikpapan', district: 'Balikpapan Kota', latitude: -1.27891, longitude: 116.82912, isActive: true },
  { id: 'mkt_pandansari', regionId: 'reg_kaltim', name: 'Pasar Pandansari', slug: 'pandansari', city: 'Kota Balikpapan', district: 'Balikpapan Barat', latitude: -1.24312, longitude: 116.81234, isActive: true },
  { id: 'mkt_segiri', regionId: 'reg_kaltim', name: 'Pasar Induk Segiri', slug: 'segiri', city: 'Kota Samarinda', district: 'Samarinda Ulu', latitude: -0.48912, longitude: 117.15123, isActive: true },

  { id: 'mkt_flamboyan', regionId: 'reg_kalbar', name: 'Pasar Flamboyan Utama', slug: 'flamboyan', city: 'Kota Pontianak', district: 'Pontianak Selatan', latitude: -0.03891, longitude: 109.34123, isActive: true },
  { id: 'mkt_mawar', regionId: 'reg_kalbar', name: 'Pasar Mawar Sentral', slug: 'pasar-mawar', city: 'Kota Pontianak', district: 'Pontianak Kota', latitude: -0.02451, longitude: 109.33678, isActive: true },

  { id: 'mkt_antasari', regionId: 'reg_kalsel', name: 'Pasar Sentra Antasari', slug: 'antasari', city: 'Kota Banjarmasin', district: 'Banjarmasin Tengah', latitude: -3.32891, longitude: 114.59891, isActive: true },
  { id: 'mkt_sudimampir', regionId: 'reg_kalsel', name: 'Pasar Sudimampir', slug: 'sudimampir', city: 'Kota Banjarmasin', district: 'Banjarmasin Tengah', latitude: -3.32123, longitude: 114.59123, isActive: true },

  { id: 'mkt_pasar_terong', regionId: 'reg_sulsel', name: 'Pasar Terong Utama', slug: 'terong', city: 'Kota Makassar', district: 'Bontoala', latitude: -5.13451, longitude: 119.42781, isActive: true },
  { id: 'mkt_pabaeng_baeng', regionId: 'reg_sulsel', name: "Pasar Pa'baeng-baeng", slug: 'pabaeng-baeng', city: 'Kota Makassar', district: 'Tamalate', latitude: -5.17645, longitude: 119.42123, isActive: true },
  { id: 'mkt_daya', regionId: 'reg_sulsel', name: 'Pasar Niaga Daya', slug: 'pasar-daya', city: 'Kota Makassar', district: 'Biringkanaya', latitude: -5.11234, longitude: 119.51123, isActive: true },

  { id: 'mkt_bersehati', regionId: 'reg_sulut', name: 'Pasar Bersehati Manado', slug: 'bersehati', city: 'Kota Manado', district: 'Wenang', latitude: 1.49845, longitude: 124.84123, isActive: true },
  { id: 'mkt_pinasungkulan', regionId: 'reg_sulut', name: 'Pasar Pinasungkulan', slug: 'pinasungkulan', city: 'Kota Manado', district: 'Wanea', latitude: 1.45891, longitude: 124.84891, isActive: true },

  { id: 'mkt_badung', regionId: 'reg_bali', name: 'Pasar Badung Sentral', slug: 'pasar-badung', city: 'Kota Denpasar', district: 'Denpasar Barat', latitude: -8.65712, longitude: 115.21543, isActive: true },
  { id: 'mkt_kumbasari', regionId: 'reg_bali', name: 'Pasar Seni & Pangan Kumbasari', slug: 'kumbasari', city: 'Kota Denpasar', district: 'Denpasar Barat', latitude: -8.65681, longitude: 115.21451, isActive: true },
  { id: 'mkt_kreneng', regionId: 'reg_bali', name: 'Pasar Kreneng', slug: 'kreneng', city: 'Kota Denpasar', district: 'Denpasar Timur', latitude: -8.65123, longitude: 115.23123, isActive: true },

  { id: 'mkt_kebon_roek', regionId: 'reg_ntb', name: 'Pasar Kebon Roek Ampenan', slug: 'kebon-roek', city: 'Kota Mataram', district: 'Ampenan', latitude: -8.57891, longitude: 116.08123, isActive: true },
  { id: 'mkt_mandalika', regionId: 'reg_ntb', name: 'Pasar Induk Mandalika Bertais', slug: 'mandalika-bertais', city: 'Kota Mataram', district: 'Sandubaya', latitude: -8.59123, longitude: 116.14891, isActive: true },

  { id: 'mkt_naikoten', regionId: 'reg_ntt', name: 'Pasar Kasih Naikoten I', slug: 'naikoten', city: 'Kota Kupang', district: 'Kota Raja', latitude: -10.17891, longitude: 123.60891, isActive: true },
  { id: 'mkt_oeba', regionId: 'reg_ntt', name: 'Pasar Ikan & Pangan Oeba', slug: 'oeba', city: 'Kota Kupang', district: 'Kota Lama', latitude: -10.15891, longitude: 123.59123, isActive: true },

  { id: 'mkt_hamadi', regionId: 'reg_papua', name: 'Pasar Sentral Hamadi', slug: 'pasar-hamadi', city: 'Kota Jayapura', district: 'Jayapura Selatan', latitude: -2.56412, longitude: 140.71234, isActive: true },
  { id: 'mkt_youtefa', regionId: 'reg_papua', name: 'Pasar Youtefa Abepura', slug: 'youtefa', city: 'Kota Jayapura', district: 'Abepura', latitude: -2.60123, longitude: 140.67123, isActive: true },

  { id: 'mkt_mardika', regionId: 'reg_maluku', name: 'Pasar Mardika Sentral', slug: 'mardika', city: 'Kota Ambon', district: 'Sirimau', latitude: -3.69451, longitude: 128.18891, isActive: true },
  { id: 'mkt_gotong_royong', regionId: 'reg_maluku', name: 'Pasar Gotong Royong', slug: 'gotong-royong', city: 'Kota Ambon', district: 'Sirimau', latitude: -3.69123, longitude: 128.18123, isActive: true },
];
