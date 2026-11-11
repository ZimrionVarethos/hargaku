import type { Metadata } from 'next';
import { fetchCommodities } from '@/lib/api/commodities.api';
import { fetchMarkets } from '@/lib/api/markets.api';
import { PriceCheckHeader } from '@/components/price/PriceCheckHeader';
import { PriceCheckerContainer } from '@/components/price/PriceCheckerContainer';

export const metadata: Metadata = {
  title: 'Cek Harga & Komparasi AI · PasarKu',
  description:
    'Hitung kewajaran harga tawaran di lapak berdasarkan takaran, bandingkan 4 sumber data (Bapanas, PIHPS, pasar, warga), dan konsultasi langsung dengan PUNTEN AI.',
};

interface Props {
  searchParams?: Promise<{
    commodity?: string;
    market?: string;
  }>;
}

export default async function CekHargaPage({ searchParams }: Props) {
  const resolvedParams = searchParams ? await searchParams : {};
  const [commodities, markets] = await Promise.all([
    fetchCommodities(),
    fetchMarkets(),
  ]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-9">
      <div className="max-w-[1240px] mx-auto space-y-5">
        <PriceCheckHeader />
        <PriceCheckerContainer
          initialCommodities={commodities}
          initialMarkets={markets}
          initialCommoditySlug={resolvedParams.commodity}
          initialMarketId={resolvedParams.market}
        />
      </div>
    </div>
  );
}
