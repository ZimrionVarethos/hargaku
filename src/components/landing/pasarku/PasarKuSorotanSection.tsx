'use client';

import { useMemo } from 'react';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { useAssistant } from '@/lib/store/assistant-store';
import { CommoditySvg } from '@/lib/data/market-svgs';

const QUICK_COMMODITY_IDS = [2, 3, 8, 21, 16, 17, 43, 44, 46, 30];

export function PasarKuSorotanSection() {
  const { openAssistant } = useAssistant();
  const liveCommodities = useLiveBogorCommodities();

  const { quickItems, topPriceItem, berasRange } = useMemo(() => {
    const byId = new Map<number, (typeof liveCommodities)[number]>();
    let minBeras = Infinity;
    let maxBeras = -Infinity;

    for (const c of liveCommodities) {
      byId.set(c.id, c);
      if (c.subCategory === 'BERAS') {
        if (c.price < minBeras) minBeras = c.price;
        if (c.price > maxBeras) maxBeras = c.price;
      }
    }

    const items: (typeof liveCommodities)[number][] = [];
    let top: (typeof liveCommodities)[number] | undefined;
    for (const id of QUICK_COMMODITY_IDS) {
      const found = byId.get(id);
      if (!found) continue;
      items.push(found);
      if (!top || found.price > top.price) top = found;
    }

    return {
      quickItems: items,
      topPriceItem: top,
      berasRange:
        minBeras <= maxBeras
          ? { min: minBeras, max: maxBeras }
          : { min: 12500, max: 16000 },
    };
  }, [liveCommodities]);

  const handleAskAi = (item: (typeof quickItems)[0]) => {
    openAssistant(
      `Bandingkan harga ${item.name} (saat ini Rp ${item.price.toLocaleString('id-ID')}/${item.unit}) di Panel Bapanas, PIHPS BI, pasar rakyat, dan laporan warga.`
    );
  };

  return (
    <section id="sorotanSection" className="border-b-2 border-[var(--border-ink)] py-12 bg-[var(--bg-paper)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-muted)] text-[var(--accent-chili)] mb-3">
                INDEKS PANGAN HARIAN
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Sorotan Pangan Utama
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Rangkuman harga pasar harian 10 kebutuhan pokok keluarga yang tersinkron langsung dengan pembaruan petugas dan database Supabase.
              </p>
            </div>

            <div className="market-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Rentang Harga Beras</div>
                  <div className="text-lg font-bold text-[var(--text-primary)] font-mono-num">
                    Rp {berasRange.min.toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-[var(--text-muted)]">s.d.</span> Rp{' '}
                    {berasRange.max.toLocaleString('id-ID')}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#E2EFE6] text-[#245034] font-bold">
                  Beras Pokok
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Indeks Tertinggi Saat Ini</div>
                  <div className="text-lg font-bold text-[var(--accent-chili)] font-mono-num">
                    Rp {(topPriceItem?.price || 150000).toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-[var(--text-muted)]">/{topPriceItem?.unit || 'kg'}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">{topPriceItem?.name || 'Daging Sapi Murni'}</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#FBE9E6] text-[var(--accent-chili)] font-bold">
                  Pantauan Tinggi
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Validasi PUNTEN Multi-Sumber</div>
                  <div className="text-lg font-bold text-[#245034] font-mono-num">4 Sumber Resmi</div>
                  <div className="text-xs text-[var(--text-secondary)]">Bapanas, PIHPS, PPJ, &amp; Warga</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] font-bold">
                  Siap Ditanya
                </span>
              </div>
            </div>

            <div className="text-xs text-[var(--text-muted)] italic">
              Data terverifikasi: Supabase PostgreSQL, Perumda PPJ, PIHPS BI, &amp; Bapanas RI.
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="market-card p-6">
              <div className="flex items-center justify-between border-b-2 border-[var(--border-ink)] pb-4 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  Papan Harga Cepat 10 Komoditas
                </h3>
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  Klik Tanya PUNTEN untuk komparasi sumber
                </span>
              </div>

              <div className="space-y-3">
                {quickItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1 text-sm group hover:bg-[var(--bg-muted)]/50 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-[#E2EFE6] p-0.5 shrink-0">
                        <CommoditySvg kind={item.svg} />
                      </div>
                      <span className="font-medium text-[var(--text-primary)] truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="ledger-leader hidden sm:block" />

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-[var(--forest-ink)] font-mono-num">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAskAi(item)}
                        className="market-btn-secondary px-2.5 py-1 text-xs font-bold hover:bg-[var(--accent-chili)] hover:text-white hover:border-[var(--border-ink)] transition-colors cursor-pointer"
                        title={`Tanya PUNTEN untuk ${item.name}`}
                      >
                        Tanya PUNTEN
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
