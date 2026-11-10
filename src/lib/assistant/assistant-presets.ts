import { AssistantPromptPreset } from '@/types/assistant';

export const DEFAULT_PROMPT_PRESETS: AssistantPromptPreset[] = [
  {
    id: 'p1',
    label: 'Bandingkan Cabai Rawit 4 Sumber',
    prompt:
      'Bandingkan harga Cabai Rawit Merah di Panel Bapanas, PIHPS BI, pasar rakyat, dan laporan warga. Sumber mana yang paling tepat jadi patokan?',
    category: 'compare',
  },
  {
    id: 'p2',
    label: 'Cabai Rawit 25rb / 250g Wajar?',
    prompt: 'Tadi pedagang nawarin cabai rawit merah 25 ribu seperempat kilo, wajar gak dibanding acuan resmi?',
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
    label: 'Bapanas vs PIHPS vs Laporan Warga',
    prompt: 'Apa bedanya acuan HAP Bapanas, survei PIHPS BI, data Perumda PPJ, dan laporan warga untuk cek harga wajar?',
    category: 'general',
  },
];
