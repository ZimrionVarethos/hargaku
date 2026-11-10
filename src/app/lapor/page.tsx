import { Metadata } from 'next';
import { fetchCommodities } from '@/lib/api/commodities.api';
import { fetchMarkets } from '@/lib/api/markets.api';
import { LaporHeader } from '@/components/lapor/LaporHeader';
import { LaporContainer } from '@/components/lapor/LaporContainer';

export const metadata: Metadata = {
  title: 'Lapor Harga & Kelangkaan Pasar · PasarKu',
  description:
    'Warga dapat melaporkan harga lapak tidak wajar dan pedagang dapat melaporkan kelangkaan pasokan secara anonim teragregasi per pasar.',
};

interface Props {
  searchParams: Promise<{
    commodity?: string;
    market?: string;
    price?: string;
    mode?: string;
  }>;
}

export default async function LaporPage({ searchParams }: Props) {
  const params = await searchParams;
  const [commodities, markets] = await Promise.all([
    fetchCommodities(),
    fetchMarkets(),
  ]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto space-y-8">
        <LaporHeader />
        <LaporContainer
          commodities={commodities}
          markets={markets}
          initialCommoditySlug={params.commodity}
          initialMarketId={params.market}
          initialPrice={params.price}
          initialMode={params.mode === 'shortage' ? 'SHORTAGE' : 'PRICE'}
        />
      </div>
    </div>
  );
}
