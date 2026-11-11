'use client';

import { NavigationArrow, Train } from '@phosphor-icons/react';
import { PetaMarketPrice } from './peta-data';
import { formatRupiah } from '@/lib/utils';

interface Props {
  markets: PetaMarketPrice[];
  selectedMarketId: string;
  onSelectMarket: (id: string) => void;
  commodityName: string;
  commodityUnit?: string;
}

export function PetaMarketRankTable({
  markets,
  selectedMarketId,
  onSelectMarket,
  commodityName,
  commodityUnit = 'kg',
}: Props) {
  const sortedMarkets = [...markets].sort((a, b) => a.price - b.price);

  return (
    <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-[var(--border-ink)]">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            Urutan Harga Pasar &middot; {commodityName}
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Diurutkan dari pasar terhemat di wilayah terpilih, beserta sinyal stasiun &amp; laporan aktif.
          </p>
        </div>
        <span className="text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] w-fit">
          {markets.length} Pasar Terpantau
        </span>
      </div>

      <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="py-2.5 pl-3.5 sm:pl-4 pr-4">Peringkat &amp; Pasar</th>
              <th className="py-2.5 px-4 text-right">Harga / {commodityUnit}</th>
              <th className="py-2.5 px-4 text-center">Selisih Acuan</th>
              <th className="py-2.5 px-4 text-left">Sinyal Warga &amp; Stok</th>
              <th className="py-2.5 pr-3.5 sm:pr-4 pl-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
            {sortedMarkets.map((m, idx) => {
              const isSelected = m.marketId === selectedMarketId;
              const isCheapest = idx === 0;

              return (
                <tr
                  key={m.marketId}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? 'bg-[var(--bg-muted)]/70' : 'hover:bg-[var(--bg-muted)]/30'
                  }`}
                  onClick={() => onSelectMarket(m.marketId)}
                >
                  <td className="py-3.5 pl-3.5 sm:pl-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isCheapest
                            ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]'
                            : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-[var(--text-primary)] flex flex-wrap items-center gap-1.5">
                          <span>{m.name}</span>
                          {m.nearStation && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] px-1.5 py-0.5 rounded">
                              <Train size={10} weight="bold" />
                              <span>Stasiun</span>
                            </span>
                          )}
                          {isCheapest && (
                            <span className="text-[10px] font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] px-1.5 py-0.5 rounded border border-[var(--forest-ink)]">
                              Termurah
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)]">{m.address}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-[var(--forest-ink)] tabular-nums text-[14px]">
                    {formatRupiah(m.price)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {m.diffPercent < 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/30 tabular-nums">
                        {m.diffPercent}%
                      </span>
                    ) : m.diffPercent === 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--bg-muted)] text-[var(--text-muted)] tabular-nums">
                        0%
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)]/30 tabular-nums">
                        +{m.diffPercent}%
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-[12px] text-[var(--text-secondary)]">
                    {m.alertHeadline ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-[var(--ochre-surface)] text-[var(--warning-ink)] text-[11px] font-bold">
                        {m.alertHeadline}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)]">
                        {m.reportsCount > 0 ? `${m.reportsCount} laporan aktif` : 'Survei harian stabil'}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 pr-3.5 sm:pr-4 pl-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMarket(m.marketId);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected ? 'market-btn-primary' : 'market-btn-secondary'
                        }`}
                      >
                        {isSelected ? 'Terpilih' : 'Pilih'}
                      </button>
                      <a
                        href={m.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Buka rute di Google Maps"
                        className="p-1.5 rounded-lg border border-[var(--border-ink)] text-[var(--text-secondary)] hover:text-[var(--accent-chili)] hover:bg-[var(--bg-muted)] transition-colors"
                      >
                        <NavigationArrow size={13} weight="bold" />
                      </a>
                    </div>
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
