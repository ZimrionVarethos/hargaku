import { Metadata } from 'next';
import { fetchCommodities } from '@/lib/api/commodities.api';
import { PetaContainer } from '@/components/peta/PetaContainer';

export const metadata: Metadata = {
  title: 'Peta Harga Pasar Tradisional · HargaKu',
  description:
    'Peta interaktif Mapbox sebaran harga komoditas pangan pokok di pasar-pasar tradisional Indonesia terkalibrasi daerah.',
};

interface Props {
  searchParams?: Promise<{
    market?: string;
    commodity?: string;
    region?: string;
  }>;
}

export default async function PetaPage({ searchParams }: Props) {
  const resolved = searchParams ? await searchParams : {};
  const commodities = await fetchCommodities();

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
      <PetaContainer
        initialCommodities={commodities}
        initialMarketId={resolved.market}
        initialCommoditySlug={resolved.commodity}
        initialRegionSlug={resolved.region}
      />
    </div>
  );
}
