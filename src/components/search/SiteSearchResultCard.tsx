'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ChatCircleDots,
  Check,
  MapPin,
  Scales,
  Storefront,
  Train,
} from '@phosphor-icons/react';
import type { Region } from '@/types';
import type { SiteSearchItem } from '@/lib/search/site-search';
import { SearchItemIcon } from './SearchItemIcon';

interface Props {
  item: SiteSearchItem;
  activeRegion: Region;
  allRegions: Region[];
  onActivateRegion: (region: Region) => void;
  onAskPunten: (prompt: string) => void;
}

export function SiteSearchResultCard({
  item,
  activeRegion,
  allRegions,
  onActivateRegion,
  onAskPunten,
}: Props) {
  const isCurrentRegion = item.kind === 'REGION' && item.regionId === activeRegion.id;
  const targetRegion =
    item.kind === 'REGION' && item.regionId
      ? allRegions.find((r) => r.id === item.regionId)
      : undefined;

  return (
    <article className="market-card market-card-interactive p-4 sm:p-5 bg-[var(--bg-card)] flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] p-1.5 shrink-0 flex items-center justify-center">
              <SearchItemIcon item={item} size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                  {item.badgeLabel}
                </span>
                {item.nearStation && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] text-[10px] font-bold">
                    <Train size={10} weight="bold" aria-hidden="true" />
                    <span>Stasiun</span>
                  </span>
                )}
              </div>
              <h2 className="text-[15px] sm:text-[16px] font-bold text-[var(--text-primary)] leading-snug">
                {item.title}
              </h2>
            </div>
          </div>

          {item.kind === 'COMMODITY' && item.priceText && (
            <div className="text-right shrink-0">
              <div className="text-[14px] sm:text-[15px] font-extrabold text-[var(--forest-ink)] font-mono-num">
                {item.priceText}
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                Acuan {activeRegion.name}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {item.subtitle}
        </p>
      </div>

      <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2">
        {item.kind === 'COMMODITY' && (
          <>
            <Link
              href={item.href}
              className="market-btn-primary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 no-underline"
            >
              <span>Lihat di Indeks</span>
              <ArrowRight size={12} weight="bold" aria-hidden="true" />
            </Link>
            {item.commoditySlug && (
              <Link
                href={`/cek-harga?commodity=${encodeURIComponent(item.commoditySlug)}`}
                className="market-btn-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 no-underline"
              >
                <Scales size={13} weight="bold" aria-hidden="true" />
                <span>Cek Harga</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() =>
                onAskPunten(
                  `Berapa acuan harga wajar ${item.title} di ${activeRegion.name} saat ini dibanding HAP/HET Bapanas dan PIHPS?`
                )
              }
              className="market-btn-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ChatCircleDots size={13} weight="bold" aria-hidden="true" />
              <span>Tanya PUNTEN</span>
            </button>
          </>
        )}

        {item.kind === 'MARKET' && (
          <>
            <Link
              href={item.href}
              className="market-btn-primary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 no-underline"
            >
              <MapPin size={13} weight="bold" aria-hidden="true" />
              <span>Lihat di Peta</span>
            </Link>
            {item.marketId && (
              <Link
                href={`/cek-harga?market=${encodeURIComponent(item.marketId)}`}
                className="market-btn-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 no-underline"
              >
                <Storefront size={13} weight="bold" aria-hidden="true" />
                <span>Cek Harga Disini</span>
              </Link>
            )}
          </>
        )}

        {item.kind === 'REGION' && targetRegion && (
          <>
            <button
              type="button"
              onClick={() => onActivateRegion(targetRegion)}
              className={`px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                isCurrentRegion ? 'market-btn-secondary' : 'market-btn-primary'
              }`}
            >
              {isCurrentRegion ? (
                <>
                  <Check size={13} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />
                  <span>Wilayah Aktif</span>
                </>
              ) : (
                <span>Aktifkan Wilayah Ini</span>
              )}
            </button>
            <Link
              href={item.href}
              onClick={() => onActivateRegion(targetRegion)}
              className="market-btn-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 no-underline"
            >
              <span>Buka Peta</span>
              <ArrowRight size={12} weight="bold" aria-hidden="true" />
            </Link>
          </>
        )}

        {item.kind === 'PAGE' && (
          <Link
            href={item.href}
            className="market-btn-primary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 no-underline"
          >
            <span>Buka Halaman</span>
            <ArrowRight size={12} weight="bold" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

