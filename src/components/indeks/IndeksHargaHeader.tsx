'use client';

import Link from 'next/link';
import { ArrowLeft, ListNumbers, TrendDown, TrendUp } from '@phosphor-icons/react';
import type { IndeksCommodityRow } from './indeks-harga-types';

interface Props {
  regionName: string;
  totalCount: number;
  rows: IndeksCommodityRow[];
}

export function IndeksHargaHeader({ regionName, totalCount, rows }: Props) {
  const withHap = rows.filter((r) => r.diffVsHapPct !== null);
  const mostAffordable = [...withHap].sort(
    (a, b) => (a.diffVsHapPct ?? 0) - (b.diffVsHapPct ?? 0)
  )[0];
  const mostAffordableDiff = mostAffordable?.diffVsHapPct ?? null;
  const isAllAboveHap = mostAffordableDiff !== null && mostAffordableDiff > 0;
  const highestPrice = [...rows].sort((a, b) => b.regionalPrice - a.regionalPrice)[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/"
            className="market-btn-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 no-underline w-fit"
          >
            <ArrowLeft size={14} weight="bold" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>

          <h1 className="text-[28px] sm:text-[38px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight pt-1">
            Indeks Harga Pangan ({regionName})
          </h1>

          <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[700px] leading-[1.55]">
            Rincian lengkap papan acuan seluruh <strong className="text-[var(--text-primary)]">{totalCount} komoditas pangan</strong> yang dipantau PasarKu di {regionName}, lengkap dengan perbandingan HAP/HET Nasional Bapanas dan pencarian cepat.
          </p>
        </div>

        <Link
          href="/cek-harga"
          className="market-btn-primary px-4 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 shrink-0 no-underline w-fit"
        >
          <span>Cek Tawaran Penjual</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="market-card p-4 bg-[var(--bg-card)] flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Semua Pangan Terpantau
            </span>
            <div className="text-xl font-bold text-[var(--text-primary)] font-mono-num mt-0.5">
              {totalCount} Komoditas
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Rujukan Perumda PPJ, PIHPS BI, &amp; Bapanas
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--forest-surface)] border border-[var(--border-ink)] flex items-center justify-center shrink-0">
            <ListNumbers size={20} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />
          </div>
        </div>

        <div className="market-card p-4 bg-[var(--bg-card)] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {isAllAboveHap ? 'Selisih Terdekat HAP' : 'Paling Hemat vs HAP'}
            </span>
            <div
              className={`text-xl font-bold font-mono-num mt-0.5 truncate ${
                isAllAboveHap ? 'text-[var(--warning-ink)]' : 'text-[var(--forest-ink)]'
              }`}
            >
              {mostAffordableDiff !== null
                ? `${mostAffordableDiff > 0 ? `+${mostAffordableDiff}%` : `${mostAffordableDiff}%`}`
                : '-'}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
              {mostAffordable
                ? `${mostAffordable.name} (Rp ${mostAffordable.regionalPrice.toLocaleString('id-ID')}/${mostAffordable.unit})`
                : 'Semua selaras acuan'}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl border border-[var(--border-ink)] flex items-center justify-center shrink-0 ${
              isAllAboveHap ? 'bg-[var(--bg-muted)]' : 'bg-[var(--forest-surface)]'
            }`}
          >
            {isAllAboveHap ? (
              <TrendUp size={20} weight="bold" className="text-[var(--warning-ink)]" aria-hidden="true" />
            ) : (
              <TrendDown size={20} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="market-card p-4 bg-[var(--bg-card)] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Nominal Tertinggi ({regionName})
            </span>
            <div className="text-xl font-bold text-[var(--accent-chili)] font-mono-num mt-0.5 truncate">
              {highestPrice ? `Rp ${highestPrice.regionalPrice.toLocaleString('id-ID')}` : '-'}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
              {highestPrice ? `${highestPrice.name} /${highestPrice.unit}` : '-'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-chili-soft)] border border-[var(--border-ink)] flex items-center justify-center shrink-0">
            <TrendUp size={20} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
