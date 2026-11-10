import { notFound } from 'next/navigation';
import { fetchCommodityDetail } from '@/lib/api/commodities.api';
import { CommodityBreadcrumb } from '@/components/commodity-detail/CommodityBreadcrumb';
import { CommodityHeroHeader } from '@/components/commodity-detail/CommodityHeroHeader';
import { ThreeLayerPriceCards } from '@/components/commodity-detail/ThreeLayerPriceCards';
import { PriceFluctuationChartCard } from '@/components/commodity-detail/PriceFluctuationChartCard';
import { MarketComparisonCard } from '@/components/commodity-detail/MarketComparisonCard';
import { RecentCitizenReportsTable } from '@/components/commodity-detail/RecentCitizenReportsTable';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CommodityDetailPage({ params }: Props) {
  const { slug } = await params;
  const commodity = await fetchCommodityDetail(slug);

  if (!commodity) {
    notFound();
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
      <div className="max-w-[1240px] mx-auto space-y-8">
        <CommodityBreadcrumb commodityName={commodity.name} />

        <CommodityHeroHeader detail={commodity} changePercentage={2.8} />

        <ThreeLayerPriceCards detail={commodity} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <PriceFluctuationChartCard detail={commodity} />
          <MarketComparisonCard detail={commodity} />
        </div>

        <RecentCitizenReportsTable detail={commodity} />
      </div>
    </div>
  );
}
