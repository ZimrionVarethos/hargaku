import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SiteSearchResultsView } from '@/components/search/SiteSearchResultsView';

export const metadata: Metadata = {
  title: 'Pencarian PasarKu · Cari Komoditas, Pasar & Fitur',
  description:
    'Cari komoditas pangan, pasar rakyat terdekat, wilayah pantauan lintas Indonesia, serta layanan dan tanya jawab PasarKu.',
};

export default function CariPage() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-7 sm:py-10">
      <div className="max-w-[1240px] mx-auto">
        <Suspense
          fallback={
            <div className="market-card p-8 text-center text-sm font-bold text-[var(--text-muted)]">
              Memuat halaman pencarian PasarKu...
            </div>
          }
        >
          <SiteSearchResultsView />
        </Suspense>
      </div>
    </div>
  );
}

