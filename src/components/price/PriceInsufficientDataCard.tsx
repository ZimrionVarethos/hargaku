'use client';

import Link from 'next/link';
import { WarningCircle, MegaphoneSimple } from '@phosphor-icons/react';

interface Props {
  commodityName?: string;
  marketName?: string;
}

export function PriceInsufficientDataCard({ commodityName, marketName }: Props) {
  return (
    <div className="market-card p-6 sm:p-7 bg-[var(--bg-card)] flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <WarningCircle size={16} weight="bold" className="text-[var(--text-muted)]" />
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Data Belum Cukup
          </span>
        </div>

        <h3 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">
          Belum Ada Data Acuan
        </h3>

        <p className="text-[13px] text-[var(--text-secondary)] leading-[20px]">
          Belum ada data pembanding resmi yang cukup untuk{' '}
          {commodityName ? <strong className="text-[var(--text-primary)]">{commodityName}</strong> : 'komoditas ini'}
          {marketName ? <> di <strong className="text-[var(--text-primary)]">{marketName}</strong></> : ''}.{' '}
          HargaKu tidak pernah mengarang angka harga. Jadilah yang pertama melaporkan harga riil lapak untuk melengkapi data bersama warga.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href={`/lapor${commodityName ? `?commodity=${encodeURIComponent(commodityName)}` : ''}`}
          className="market-btn-primary inline-flex items-center justify-center gap-2 py-2.5 px-4 text-[12px] font-semibold"
        >
          <MegaphoneSimple size={15} weight="bold" />
          <span>Lapor Harga Lapak Pertama</span>
        </Link>
      </div>
    </div>
  );
}
