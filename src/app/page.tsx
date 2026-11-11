'use client';

import { useState } from 'react';
import { PasarKuLorongHero } from '@/components/landing/pasarku/PasarKuLorongHero';
import { PasarKuSorotanSection } from '@/components/landing/pasarku/PasarKuSorotanSection';
import { PasarKuAnalitikSection } from '@/components/landing/pasarku/PasarKuAnalitikSection';
import { PasarKuUnitPasarSection } from '@/components/landing/pasarku/PasarKuUnitPasarSection';
import { PasarKuCommodityModal } from '@/components/landing/pasarku/PasarKuCommodityModal';
import { KawungBand } from '@/components/ornament/KawungBand';
import { CacingWaveDivider } from '@/components/ornament/CacingWaveDivider';
import { BogorCommodity } from '@/lib/data/bogor-commodities';

export default function HomePage() {
  const [selectedCommodity, setSelectedCommodity] = useState<BogorCommodity | null>(null);

  return (
    <div className="w-full flex flex-col bg-[var(--bg-paper)] text-[var(--text-primary)]">
      <PasarKuLorongHero onSelectCommodity={setSelectedCommodity} />

      <KawungBand size="md" variant="scallop" className="relative z-20 -mb-[7px] sm:-mb-[9px]" />

      <PasarKuSorotanSection />

      <CacingWaveDivider topColor="var(--bg-paper)" bottomColor="var(--bg-muted)" />

      <PasarKuAnalitikSection />

      <CacingWaveDivider topColor="var(--bg-muted)" bottomColor="var(--bg-paper)" flip />

      <PasarKuUnitPasarSection />

      <PasarKuCommodityModal
        item={selectedCommodity}
        onClose={() => setSelectedCommodity(null)}
      />
    </div>
  );
}
