'use client';

import React, { useState } from 'react';
import { PasarKuLorongHero } from '@/components/landing/pasarku/PasarKuLorongHero';
import { PasarKuStageSection } from '@/components/landing/pasarku/PasarKuStageSection';
import { PasarKuSorotanSection } from '@/components/landing/pasarku/PasarKuSorotanSection';
import { PasarKuAnalitikSection } from '@/components/landing/pasarku/PasarKuAnalitikSection';
import { PasarKuUnitPasarSection } from '@/components/landing/pasarku/PasarKuUnitPasarSection';
import { PasarKuCommodityModal } from '@/components/landing/pasarku/PasarKuCommodityModal';
import { BogorCommodity } from '@/lib/data/bogor-commodities';

export default function HomePage() {
  const [selectedCommodity, setSelectedCommodity] = useState<BogorCommodity | null>(null);

  return (
    <div className="w-full flex flex-col bg-[var(--bg-paper)] text-[var(--text-primary)]">
      {/* Immersive Gate Zoom & Lorong Pasar Walkthrough */}
      <PasarKuLorongHero onSelectCommodity={setSelectedCommodity} />

      {/* Meja Timbangan Mekanis */}
      <PasarKuStageSection />

      {/* Papan Pokok & Sorotan Pangan */}
      <PasarKuSorotanSection />

      {/* Grafik Kategori & Metrik Harga */}
      <PasarKuAnalitikSection />

      {/* Direktori 13 Unit Pasar */}
      <PasarKuUnitPasarSection />

      {/* Pop-up Detail Komoditas */}
      <PasarKuCommodityModal
        item={selectedCommodity}
        onClose={() => setSelectedCommodity(null)}
      />
    </div>
  );
}
