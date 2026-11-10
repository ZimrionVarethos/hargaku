import { Metadata } from 'next';
import { AiRecommendationView } from '@/components/assistant/AiRecommendationView';

export const metadata: Metadata = {
  title: 'Tanya PUNTEN · Rekomendasi Harga AI Multi-Sumber · HargaKu',
  description:
    'Bandingkan acuan harga pangan dari Bapanas, PIHPS Bank Indonesia, pasar rakyat, dan laporan warga bersama PUNTEN (Asisten AI HargaKu).',
};

export default function RekomendasiAiPage() {
  return <AiRecommendationView />;
}

