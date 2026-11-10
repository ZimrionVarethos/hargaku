'use client';

import { useState } from 'react';
import { PasarKuLorongHero } from '@/components/landing/pasarku/PasarKuLorongHero';
import { PasarKuSorotanSection } from '@/components/landing/pasarku/PasarKuSorotanSection';
import { PasarKuAnalitikSection } from '@/components/landing/pasarku/PasarKuAnalitikSection';
import { PasarKuUnitPasarSection } from '@/components/landing/pasarku/PasarKuUnitPasarSection';
import { PasarKuCommodityModal } from '@/components/landing/pasarku/PasarKuCommodityModal';
import { BogorCommodity } from '@/lib/data/bogor-commodities';

export default function HomePage() {
  const [selectedCommodity, setSelectedCommodity] = useState<BogorCommodity | null>(null);

  return (
    <div className="w-full flex flex-col bg-[var(--bg-paper)] text-[var(--text-primary)]">
      <PasarKuLorongHero onSelectCommodity={setSelectedCommodity} />

      <PasarKuSorotanSection />

      <PasarKuAnalitikSection />

      <PasarKuUnitPasarSection />

      <PasarKuCommodityModal
        item={selectedCommodity}
        onClose={() => setSelectedCommodity(null)}
      />
    </div>
  );
}
