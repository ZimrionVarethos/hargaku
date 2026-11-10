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
    <div className="w-full bg-white rounded-[16px] outline outline-1 outline-[#E5E3DE] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E3DE] bg-[#FAF9F5] text-[11px] font-bold text-[#6E6D67] uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Komoditas Pokok</th>
              <th className="py-3.5 px-4">Harga Terkini</th>
              <th className="py-3.5 px-4">Tren 7 Hari</th>
              <th className="py-3.5 px-4">Acuan Resmi</th>
              <th className="py-3.5 px-4">Status Kewajaran</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DE] text-[13px]">
            {commodities.map((item) => {
              const isRising = item.changePercentage > 0;
              const isDropping = item.changePercentage < 0;

              let statusLabel = 'Wajar';
              let statusBadgeStyle = 'bg-[#F4F3F0] text-[#1B1A18] outline-[#E5E3DE]';

              if (item.changePercentage > 10) {
                statusLabel = 'Terlalu Mahal';
                statusBadgeStyle = 'bg-[#FEE2E2] text-[#991B1B] outline-[#FECACA]';
              } else if (item.changePercentage > 3) {
                statusLabel = 'Agak Mahal';
                statusBadgeStyle = 'bg-[#FEF3C7] text-[#92400E] outline-[#FDE68A]';
              } else if (item.changePercentage < -2) {
                statusLabel = 'Murah';
                statusBadgeStyle = 'bg-[#EEF773] text-[#1B1A18] outline-[#1B1A18]';
              }

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#FAF9F5] transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <Link
                      href={`/komoditas/${item.slug}`}
                      className="font-semibold text-[#1B1A18] group-hover:text-[#FF7714] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="text-[11px] text-[#8C8B85]">
                      {item.source || 'PIHPS'} · {selectedRegion.name}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#1B1A18] tabular-nums">
                      Rp {item.currentAvgPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[11px] text-[#78716C]"> /{item.unit}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold tabular-nums text-[12px] ${
                        isRising
                          ? 'text-[#DC2626]'
                          : isDropping
                          ? 'text-[#15803D]'
                          : 'text-[#6E6D67]'
                      }`}
                    >
                      {isRising
                        ? `▲ +${item.changePercentage}%`
                        : isDropping
                        ? `▼ ${item.changePercentage}%`
                        : '~ 0.0% Stabil'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[12px] text-[#6E6D67] tabular-nums">
                    Rp {item.hapHetPrice.toLocaleString('id-ID')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-[4px] outline outline-1 ${statusBadgeStyle}`}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <Link
                      href={`/komoditas/${item.slug}`}
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-[#FF7714] hover:underline"
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
