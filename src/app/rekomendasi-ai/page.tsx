import { Metadata } from 'next';
import { AiRecommendationView } from '@/components/assistant/AiRecommendationView';

export const metadata: Metadata = {
  title: 'Rekomendasi Harga AI Multi-Sumber · HargaKu',
  description:
    'Bandingkan acuan harga pangan dari Bapanas, PIHPS Bank Indonesia, pasar rakyat, dan laporan warga dengan konsultasi interaktif Gemini AI.',
};

export default function RekomendasiAiPage() {
  return <AiRecommendationView />;
}

