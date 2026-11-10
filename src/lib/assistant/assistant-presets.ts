import { AssistantPromptPreset } from '@/types/assistant';

export const DEFAULT_PROMPT_PRESETS: AssistantPromptPreset[] = [
  {
    id: 'p0',
    label: 'Apa yang Mahal Dekat Stasiun Bogor?',
    prompt:
      'Saya mau ke pasar dekat Stasiun Bogor hari ini. Menurut laporan warga dan pedagang, komoditas apa yang sedang mahal atau stoknya terbatas?',
    category: 'compare',
  },
  {
    id: 'p1',
    label: 'Bandingkan Cabai Rawit Nasional vs Bogor',
    prompt:
      'Bandingkan harga Cabai Rawit Merah di Acuan Nasional Bapanas, PIHPS daerah Bogor, pasar rakyat, dan laporan warga.',
    category: 'compare',
  },
  {
    id: 'p2',
    label: 'Cabai Rawit 25rb / 250g Wajar?',
    prompt:
      'Tadi pedagang nawarin cabai rawit merah 25 ribu seperempat kilo, wajar gak dibanding acuan nasional dan lokal?',
    category: 'price-check',
  },
  {
    id: 'p3',
    label: 'Komoditas Paling Hemat Hari Ini?',
    prompt: 'Komoditas pangan apa saja yang paling murah atau stabil dibanding acuan Bapanas hari ini?',
    category: 'cheap-deals',
  },
  {
    id: 'p4',
    label: 'Peran PasarKu vs PIHPS BI',
    prompt:
      'Bagaimana peran PasarKu melengkapi PIHPS BI dan Panel Harga Bapanas saat saya belanja di lapak?',
    category: 'general',
  },
];
