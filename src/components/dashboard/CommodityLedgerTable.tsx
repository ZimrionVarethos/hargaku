'use client';

import Link from 'next/link';
import { CommoditySummary } from '@/types';
import { ArrowRight } from '@phosphor-icons/react';
import { useRegion } from '@/lib/store/region-store';

interface Props {
  commodities: CommoditySummary[];
}

export function CommodityLedgerTable({ commodities }: Props) {
  const { selectedRegion } = useRegion();
  return (
    <div className="w-full market-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Komoditas Pokok</th>
              <th className="py-3.5 px-4">Harga Terkini</th>
              <th className="py-3.5 px-4">Tren 7 Hari</th>
              <th className="py-3.5 px-4">Acuan Resmi</th>
              <th className="py-3.5 px-4">Status Kewajaran</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
            {commodities.map((item) => {
              const isRising = item.changePercentage > 0;
              const isDropping = item.changePercentage < 0;

              let statusLabel = 'Wajar';
              let statusBadgeStyle = 'bg-[var(--bg-muted)] text-[var(--text-primary)] border-[var(--border-subtle)]';

              if (item.changePercentage > 10) {
                statusLabel = 'Terlalu Mahal';
                statusBadgeStyle = 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]';
              } else if (item.changePercentage > 3) {
                statusLabel = 'Agak Mahal';
                statusBadgeStyle = 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
              } else if (item.changePercentage < -2) {
                statusLabel = 'Murah';
                statusBadgeStyle = 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]';
              }

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--bg-muted)]/50 transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <Link
                      href={`/komoditas/${item.slug}`}
                      className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-chili)] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {item.source || 'PIHPS'} · {selectedRegion.name}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num">
                      Rp {item.currentAvgPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]"> /{item.unit}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold tabular-nums text-[12px] ${
                        isRising
                          ? 'text-[var(--accent-chili)]'
                          : isDropping
                          ? 'text-[var(--forest-ink)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {isRising
                        ? `▲ +${item.changePercentage}%`
                        : isDropping
                        ? `▼ ${item.changePercentage}%`
                        : '~ 0.0% Stabil'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[12px] text-[var(--text-secondary)] tabular-nums">
                    Rp {item.hapHetPrice.toLocaleString('id-ID')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${statusBadgeStyle}`}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <Link
                      href={`/komoditas/${item.slug}`}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--accent-chili)] hover:underline"
                    >
                      <span>Detail</span>
                      <ArrowRight size={12} weight="bold" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
