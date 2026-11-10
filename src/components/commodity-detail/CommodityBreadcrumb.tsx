'use client';

import Link from 'next/link';

interface Props {
  commodityName: string;
}

export function CommodityBreadcrumb({ commodityName }: Props) {
  return (
    <nav className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
      <Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
        Harga
      </Link>
      <span className="text-[var(--text-muted)] font-bold">›</span>
      <Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">
        Detail Komoditas
      </Link>
      <span className="text-[var(--text-muted)] font-bold">›</span>
      <span className="font-semibold text-[var(--text-primary)]">{commodityName}</span>
    </nav>
  );
}
