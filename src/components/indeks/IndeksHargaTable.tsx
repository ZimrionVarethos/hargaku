'use client';

import Link from 'next/link';
import { ChatCircleDots, Scales } from '@phosphor-icons/react';
import { CommoditySvg } from '@/lib/data/market-svgs';
import type { BogorCommodity } from '@/lib/data/bogor-commodities';
import type { IndeksCommodityRow } from './indeks-harga-types';

interface Props {
  rows: IndeksCommodityRow[];
  regionName: string;
  onSelectCommodity: (item: BogorCommodity) => void;
  onAskPunten: (row: IndeksCommodityRow) => void;
}

function getDiffBadge(diffVsHapPct: number | null) {
  if (diffVsHapPct === null) {
    return {
      label: 'Pantauan PPJ',
      cls: 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
    };
  }
  if (diffVsHapPct > 15) {
    return {
      label: `+${diffVsHapPct}% Di Atas HAP`,
      cls: 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]',
    };
  }
  if (diffVsHapPct > 5) {
    return {
      label: `+${diffVsHapPct}% Sedikit Naik`,
      cls: 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--warning-ink)]',
    };
  }
  if (diffVsHapPct < -2) {
    return {
      label: `${diffVsHapPct}% Lebih Hemat`,
      cls: 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]',
    };
  }
  return {
    label: diffVsHapPct === 0 ? 'Sesuai HAP' : `${diffVsHapPct > 0 ? `+${diffVsHapPct}` : diffVsHapPct}% Wajar`,
    cls: 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]',
  };
}

export function IndeksHargaTable({ rows, regionName, onSelectCommodity, onAskPunten }: Props) {
  return (
    <div className="market-card bg-[var(--bg-card)] overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b-2 border-[var(--border-ink)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[var(--bg-card)]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Papan Acuan Lengkap ({rows.length} Komoditas)
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Klik komoditas untuk rincian perbandingan sumber, cek harga lapak, atau tanya PUNTEN.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-primary)] w-fit">
          Wilayah: {regionName}
        </span>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-paper)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="py-3 pl-6 pr-2 w-14">No</th>
              <th className="py-3 px-3">Komoditas Pangan</th>
              <th className="py-3 px-3">Harga {regionName}</th>
              <th className="py-3 px-3">Acuan Nasional HAP/HET</th>
              <th className="py-3 px-3">Posisi Harga</th>
              <th className="py-3 pl-3 pr-6 text-right">Aksi Pembeli</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
            {rows.map((row) => {
              const badge = getDiffBadge(row.diffVsHapPct);
              const cekHref = row.catalogSlug
                ? `/cek-harga?commodity=${encodeURIComponent(row.catalogSlug)}`
                : '/cek-harga';

              return (
                <tr key={row.key} className="hover:bg-[var(--bg-muted)]/45 transition-colors">
                  <td className="py-3 pl-6 pr-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-primary)] font-mono-num">
                      {row.no.toString().padStart(2, '0')}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => onSelectCommodity(row.bogorItem)}
                      className="flex items-center gap-2.5 text-left group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--forest-surface)] p-1 border border-[var(--border-subtle)] shrink-0">
                        <CommoditySvg kind={row.svg} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-chili)] transition-colors">
                          {row.name}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {row.categoryLabel} &bull; per {row.unit}
                        </div>
                      </div>
                    </button>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-bold text-[var(--forest-ink)] font-mono-num text-[14px]">
                      Rp {row.regionalPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">/{row.unit}</span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    {row.nationalRef ? (
                      <div className="font-mono-num">
                        <span className="font-bold text-[var(--text-primary)]">
                          Rp {row.nationalRef.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">/{row.unit}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[var(--text-muted)]">Arsip Perumda PPJ</span>
                    )}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>

                  <td className="py-3 pl-3 pr-6 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        href={cekHref}
                        className="market-btn-secondary px-2.5 py-1.5 text-[11px] font-bold inline-flex items-center gap-1 no-underline"
                      >
                        <Scales size={12} weight="bold" aria-hidden="true" />
                        <span>Cek Harga</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onAskPunten(row)}
                        className="market-btn-secondary px-2.5 py-1.5 text-[11px] font-bold inline-flex items-center gap-1 hover:bg-[var(--accent-chili)] hover:text-white cursor-pointer"
                      >
                        <ChatCircleDots size={12} weight="bold" aria-hidden="true" />
                        <span>Tanya PUNTEN</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-[var(--border-subtle)]">
        {rows.map((row) => {
          const badge = getDiffBadge(row.diffVsHapPct);
          const cekHref = row.catalogSlug
            ? `/cek-harga?commodity=${encodeURIComponent(row.catalogSlug)}`
            : '/cek-harga';

          return (
            <div key={row.key} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectCommodity(row.bogorItem)}
                  className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--forest-surface)] p-1 border border-[var(--border-subtle)] shrink-0">
                    <CommoditySvg kind={row.svg} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                      #{row.no.toString().padStart(2, '0')} {row.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      {row.nationalRef
                        ? `HAP Nasional: Rp ${row.nationalRef.toLocaleString('id-ID')}/${row.unit}`
                        : `${row.categoryLabel} · /${row.unit}`}
                    </div>
                  </div>
                </button>

                <div className="text-right shrink-0">
                  <div className="text-[14px] font-bold text-[var(--forest-ink)] font-mono-num">
                    Rp {row.regionalPrice.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">/{row.unit}</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.cls}`}>
                  {badge.label}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={cekHref}
                    className="market-btn-secondary px-2.5 py-1 text-[11px] font-bold no-underline"
                  >
                    Cek Harga
                  </Link>
                  <button
                    type="button"
                    onClick={() => onAskPunten(row)}
                    className="market-btn-secondary px-2.5 py-1 text-[11px] font-bold cursor-pointer"
                  >
                    Tanya PUNTEN
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

