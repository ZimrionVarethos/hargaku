export type SitePageIconKey =
  | 'home'
  | 'list'
  | 'calculator'
  | 'ai'
  | 'map'
  | 'megaphone'
  | 'chart'
  | 'info'
  | 'question';

export interface SiteSearchPageEntry {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badgeLabel: string;
  iconKey: SitePageIconKey;
  keywords: string[];
}

export const SITE_SEARCH_PAGES: SiteSearchPageEntry[] = [
  {
    id: 'page-beranda',
    title: 'Beranda & Lorong Pasar 3D',
    subtitle: 'Masuk lorong pasar virtual, Papan Acuan 10 komoditas, tanya jawab, dan peta 3D.',
    href: '/',
    badgeLabel: 'Halaman',
    iconKey: 'home',
    keywords: ['beranda', 'utama', 'home', 'lorong', 'pasar', '3d', 'hero', '10 komoditas', 'gerbang'],
  },
  {
    id: 'page-indeks-harga',
    title: 'Indeks Harga Pangan Lengkap',
    subtitle: 'Daftar seluruh 53+ bahan pokok pasar rakyat dengan filter kategori & pencarian cepat.',
    href: '/indeks-harga',
    badgeLabel: 'Halaman',
    iconKey: 'list',
    keywords: ['indeks', 'daftar harga', 'papan acuan', 'detail papan', 'semua komoditas', '53', 'tabel', 'hap', 'het'],
  },
  {
    id: 'page-cek-harga',
    title: 'Cek Harga Wajar di Lapak',
    subtitle: 'Hitung apakah harga tawaran penjual wajar atau kemahalan berdasarkan takaran belanja.',
    href: '/cek-harga',
    badgeLabel: 'Fitur Utama',
    iconKey: 'calculator',
    keywords: ['cek harga', 'wajar', 'kemahalan', 'mahal', 'murah', 'kalkulator', 'kasir', 'takaran', 'tawar', '1/4 kg', 'ons'],
  },
  {
    id: 'page-punten-ai',
    title: 'Tanya PUNTEN AI (Asisten Harga)',
    subtitle: 'Konsultasi harga multi-sumber & minta tips tawar sopan bersama Maskot 3D PUNTEN AI.',
    href: '/cek-harga#punten-panel',
    badgeLabel: 'Asisten AI',
    iconKey: 'ai',
    keywords: ['punten', 'ai', 'asisten', 'bot', 'maskot 3d', 'rekomendasi', 'tips tawar', 'komparasi'],
  },
  {
    id: 'page-peta',
    title: 'Peta Pasar Rakyat (Mapbox 3D)',
    subtitle: 'Jelajahi sebaran harga antar pasar rakyat, lokasi dekat stasiun, dan menu filter peta.',
    href: '/peta',
    badgeLabel: 'Peta Spasial',
    iconKey: 'map',
    keywords: ['peta', 'map', 'mapbox', 'lokasi', 'terdekat', 'stasiun', 'sebaran', 'tabel pasar', '3d'],
  },
  {
    id: 'page-lapor',
    title: 'Lapor Harga Warga & Kelangkaan Pedagang',
    subtitle: 'Kirim laporan harga lapak atau info stok langka secara anonim teragregasi per pasar.',
    href: '/lapor',
    badgeLabel: 'Lapor',
    iconKey: 'megaphone',
    keywords: ['lapor', 'laporan', 'kelangkaan', 'stok', 'langka', 'terbatas', 'pulih', 'foto', 'struk', 'warga', 'pedagang'],
  },
  {
    id: 'page-dashboard',
    title: 'Dashboard Tren & Fluktuasi Harga',
    subtitle: 'Pantau pergerakan naik-turun harga pangan strategis harian dan grafik sparkline.',
    href: '/dashboard',
    badgeLabel: 'Halaman',
    iconKey: 'chart',
    keywords: ['dashboard', 'grafik', 'tren', 'fluktuasi', 'sparkline', 'inflasi', 'harian'],
  },
  {
    id: 'page-tentang',
    title: 'Tentang, Metodologi 3 Lapis & Sumber Resmi',
    subtitle: 'Penjelasan acuan HAP/HET Bapanas, PIHPS BI, filter anomali MAD, dan prinsip netralitas.',
    href: '/tentang',
    badgeLabel: 'Panduan',
    iconKey: 'info',
    keywords: ['tentang', 'metodologi', 'sumber data', 'bapanas', 'pihps', 'bank indonesia', 'mad', 'anomali', 'etika'],
  },
  {
    id: 'qna-cek-wajar',
    title: 'Q&A: Cara Tahu Harga Tawaran Wajar atau Kemahalan',
    subtitle: 'Panduan singkat memakai kalkulator takaran vs acuan HAP/HET, survei pasar, dan laporan warga.',
    href: '/#qnaSection',
    badgeLabel: 'Tanya Jawab',
    iconKey: 'question',
    keywords: ['qna', 'faq', 'tanya jawab', 'cara pakai', 'kemahalan', 'menawar', 'selisih'],
  },
  {
    id: 'qna-independen-pihps',
    title: 'Q&A: Peran Pelengkap terhadap PIHPS BI & Bapanas',
    subtitle: 'PasarKu adalah platform independen pelengkap PIHPS dan Bapanas untuk pembeli di lapak.',
    href: '/#qnaSection',
    badgeLabel: 'Tanya Jawab',
    iconKey: 'question',
    keywords: ['qna', 'independen', 'afiliasi', 'pelengkap', 'pihps', 'bapanas', 'nasional'],
  },
  {
    id: 'guide-privasi-exif',
    title: 'Privasi Anonim & Penghapusan Metadata EXIF Foto',
    subtitle: 'Foto bukti disanitasi otomatis di peramban dan laporan tidak menyebut nama kios/pedagang.',
    href: '/lapor',
    badgeLabel: 'Keamanan',
    iconKey: 'info',
    keywords: ['privasi', 'exif', 'gps', 'keamanan', 'anonim', 'sanitasi', 'foto'],
  },
];

