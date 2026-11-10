'use client';

import React from 'react';
import type { AdminCommodity, DailyPriceRecord } from '@/lib/types/admin';
import { Lightning, ArrowUp, ArrowDown, Minus, Info } from '@phosphor-icons/react';

interface DailyPriceTableProps {
  currentMarketName: string;
  activeCommodities: AdminCommodity[];
  dailyPrices: Record<string, DailyPriceRecord>;
  selectedMarketId: string;
  inputs: Record<string, string>;
  onPriceChange: (commodityId: string, val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DailyPriceTable({
  currentMarketName,
  activeCommodities,
  dailyPrices,
  selectedMarketId,
  inputs,
  onPriceChange,
  onSubmit,
}: DailyPriceTableProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b-2 border-[var(--border-ink)]">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
              Daftar Komoditas di {currentMarketName}
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Masukkan harga pantauan lapangan terbaru dibandingkan dengan HAP resmi Bapanas.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] w-fit">
            {activeCommodities.length} Bahan Pokok
          </span>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[660px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-2.5 pl-3.5 sm:pl-4 pr-4">No. &amp; Komoditas</th>
                <th className="py-2.5 px-4 text-right">Acuan HAP</th>
                <th className="py-2.5 px-4 text-right">Harga Kemarin</th>
                <th className="py-2.5 px-4 w-52">Input Harga (Rp)</th>
                <th className="py-2.5 pr-3.5 sm:pr-4 pl-4 text-right">Selisih vs HAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
              {activeCommodities.map((c, idx) => {
                const key = `${selectedMarketId}_${c.id}`;
                const record = dailyPrices[key];
                const currentVal = parseInt(inputs[c.id] || '0', 10);
                const diffHap =
                  currentVal > 0
                    ? Math.round(((currentVal - c.hapHetPrice) / c.hapHetPrice) * 100)
                    : 0;

                return (
                  <tr key={c.id} className="hover:bg-[var(--bg-muted)]/35 transition-colors">
                    <td className="py-3.5 pl-3.5 sm:pl-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/40">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-[var(--text-primary)]">{c.name}</div>
                          <span className="text-[11px] text-[var(--text-muted)]">Satuan: per {c.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-num font-bold text-[var(--text-primary)] tabular-nums text-[13px]">
                      Rp {c.hapHetPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-num font-medium text-[var(--text-secondary)] tabular-nums text-[13px]">
                      {record?.previousPrice
                        ? `Rp ${record.previousPrice.toLocaleString('id-ID')}`
                        : `Rp ${record?.price?.toLocaleString('id-ID') || c.hapHetPrice.toLocaleString('id-ID')}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={inputs[c.id] || ''}
                          onChange={(e) => onPriceChange(c.id, e.target.value)}
                          placeholder={c.hapHetPrice.toString()}
                          className="w-full pl-9 pr-3 py-1.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] font-mono-num text-sm font-extrabold text-[var(--forest-ink)]"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 pr-3.5 sm:pr-4 pl-4 text-right">
                      {currentVal > 0 ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono-num tabular-nums ${
                            diffHap > 10
                              ? 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]/40'
                              : diffHap > 0
                              ? 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--earth-ochre)]/45'
                              : diffHap === 0
                              ? 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                              : 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]/40'
                          }`}
                        >
                          {diffHap > 0 ? (
                            <ArrowUp size={11} weight="bold" />
                          ) : diffHap < 0 ? (
                            <ArrowDown size={11} weight="bold" />
                          ) : (
                            <Minus size={11} weight="bold" />
                          )}
                          <span>{diffHap > 0 ? `+${diffHap}%` : `${diffHap}%`}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="market-card p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="space-y-1.5 md:max-w-[48%]">
          <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--text-primary)]">
            <Info size={15} weight="bold" className="text-[var(--accent-chili)]" />
            <span>Apa itu Acuan HAP Bapanas?</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)] font-bold">Harga Acuan Penjualan (HAP)</strong> adalah batas patokan resmi stabilitas pangan di tingkat konsumen dari Badan Pangan Nasional (Bapanas RI). Digunakan sebagai tolok ukur deteksi kewajaran harga belanja warga.
          </p>
        </div>

        <div className="space-y-2 md:max-w-[48%] border-t md:border-t-0 md:border-l border-[var(--border-subtle)] pt-3 md:pt-0 md:pl-5">
          <span className="font-bold text-xs text-[var(--text-primary)] block">Panduan Indikator Selisih vs HAP:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold bg-[var(--ochre-surface)] text-[var(--warning-ink)] border border-[var(--earth-ochre)]/45 shrink-0">
                <ArrowUp size={10} weight="bold" /> Naik (+%)
              </span>
              <span className="text-[var(--text-secondary)]">Di atas HAP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/40 shrink-0">
                <ArrowDown size={10} weight="bold" /> Turun (-%)
              </span>
              <span className="text-[var(--text-secondary)]">Lebih hemat dari HAP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)] shrink-0">
                <Minus size={10} weight="bold" /> 0% Sesuai
              </span>
              <span className="text-[var(--text-secondary)]">Tepat standar nasional</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)]/40 shrink-0">
                <ArrowUp size={10} weight="bold" /> &gt;+10%
              </span>
              <span className="text-[var(--text-secondary)]">Lonjakan signifikan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="submit"
          className="market-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs cursor-pointer"
        >
          <Lightning size={16} weight="bold" />
          <span>Simpan &amp; Publikasikan Harga Pasar Ini</span>
        </button>
      </div>
    </form>
  );
}
