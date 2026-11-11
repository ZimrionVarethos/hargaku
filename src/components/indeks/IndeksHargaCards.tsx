'use client';

import Link from 'next/link';
import { ArrowRight, ChatCircleDots, Scales } from '@phosphor-icons/react';
import { CommoditySvg } from '@/lib/data/market-svgs';
import type { BogorCommodity } from '@/lib/data/bogor-commodities';
import type { IndeksCommodityRow } from './indeks-harga-types';

interface Props {
  rows: IndeksCommodityRow[];
  regionName: string;
  onSelectCommodity: (item: BogorCommodity) => void;
  onAskPunten: (row: IndeksCommodityRow) => void;
}

export function IndeksHargaCards({ rows, regionName, onSelectCommodity, onAskPunten }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rows.map((row) => {
        const cekHref = row.catalogSlug
          ? `/cek-harga?commodity=${encodeURIComponent(row.catalogSlug)}`
          : '/cek-harga';

        return (
          <div
            key={row.key}
            className="market-card market-card-interactive p-4 bg-[var(--bg-card)] flex flex-col justify-between gap-3"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--forest-surface)] p-1.5 border border-[var(--border-ink)] shrink-0">
                  <CommoditySvg kind={row.svg} />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] font-mono-num">
                  INDEKS #{row.no.toString().padStart(2, '0')}
                </span>
              </div>

              <div>
                <div className="text-[10px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
                  {row.categoryLabel}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCommodity(row.bogorItem)}
                  className="text-left text-[15px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-chili)] transition-colors cursor-pointer leading-snug mt-0.5"
                >
                  {row.name}
                </button>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] text-[var(--text-muted)]">{regionName}</span>
                  <span className="text-[16px] font-bold text-[var(--forest-ink)] font-mono-num">
                    Rp {row.regionalPrice.toLocaleString('id-ID')}
                    <span className="text-[10px] font-normal text-[var(--text-muted)]">/{row.unit}</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 text-[11px]">
                  <span className="text-[var(--text-muted)]">HAP Nasional</span>
                  <span className="font-semibold text-[var(--text-secondary)] font-mono-num">
                    {row.nationalRef
                      ? `Rp ${row.nationalRef.toLocaleString('id-ID')}/${row.unit}`
                      : 'Arsip PPJ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCommodity(row.bogorItem)}
                className="text-[11px] font-bold text-[var(--accent-chili)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Rincian</span>
                <ArrowRight size={11} weight="bold" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-1.5">
                <Link
                  href={cekHref}
                  className="market-btn-secondary px-2 py-1 text-[10px] font-bold inline-flex items-center gap-1 no-underline"
                >
                  <Scales size={11} weight="bold" aria-hidden="true" />
                  <span>Cek</span>
                </Link>
                <button
                  type="button"
                  onClick={() => onAskPunten(row)}
                  className="market-btn-secondary px-2 py-1 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChatCircleDots size={11} weight="bold" aria-hidden="true" />
                  <span>PUNTEN</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

