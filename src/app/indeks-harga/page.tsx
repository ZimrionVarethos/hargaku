import { Suspense } from 'react';
import type { Metadata } from 'next';
import { IndeksHargaContainer } from '@/components/indeks/IndeksHargaContainer';

export const metadata: Metadata = {
  title: 'Indeks Harga Pangan Lengkap · PasarKu',
  description:
    'Detail lengkap papan acuan seluruh komoditas pangan pasar rakyat di Kota Bogor & wilayah pantauan, lengkap dengan perbandingan HAP/HET Nasional dan pencarian cepat.',
};

export default function IndeksHargaPage() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-7 sm:py-10">
      <div className="max-w-[1240px] mx-auto">
        <Suspense
          fallback={
            <div className="market-card p-8 text-center text-sm font-bold text-[var(--text-muted)]">
              Memuat indeks harga seluruh pangan...
            </div>
          }
        >
          <IndeksHargaContainer />
        </Suspense>
      </div>
    </div>
  );
}

