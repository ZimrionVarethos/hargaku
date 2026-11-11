'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { findMatchingCommodity } from '@/lib/market-insights';
import { CommoditySvg } from '@/lib/data/market-svgs';
import { BatikMeshBackground } from '@/components/ornament/BatikMeshBackground';

const QUICK_COMMODITY_IDS = [2, 3, 8, 21, 16, 17, 43, 44, 46, 30];

export function PasarKuSorotanSection() {
  const { openAssistant } = useAssistant();
  const { selectedRegion, calculateRegionalPrice } = useRegion();
  const { commodities: catalogCommodities, reports } = useLiveCatalog();
  const liveCommodities = useLiveBogorCommodities();

  const { quickItems, topPriceItem, berasRange, approvedCount, shortageCount } = useMemo(() => {
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

    const items: Array<(typeof liveCommodities)[number] & { nationalRef?: number; regionalPrice: number }> = [];
    let top: (typeof liveCommodities)[number] | undefined;

    for (const id of QUICK_COMMODITY_IDS) {
      const found = byId.get(id);
      if (!found) continue;
      const matchedCatalog = findMatchingCommodity(catalogCommodities, {
        commodityId: String(found.id),
        commodityName: found.name,
      });
      const regionalPrice = calculateRegionalPrice(found.price);
      items.push({
        ...found,
        regionalPrice,
        nationalRef: matchedCatalog?.hapHetPrice,
      });
      if (!top || regionalPrice > top.price) {
        top = { ...found, price: regionalPrice };
      }
    }

    const approvedReports = reports.filter((r) => r.status === 'APPROVED');

    return {
      quickItems: items,
      topPriceItem: top,
      berasRange:
        minBeras <= maxBeras
          ? { min: calculateRegionalPrice(minBeras), max: calculateRegionalPrice(maxBeras) }
          : { min: 12500, max: 16000 },
      approvedCount: approvedReports.length,
      shortageCount: approvedReports.filter((r) => r.reportType === 'SHORTAGE').length,
    };
  }, [liveCommodities, catalogCommodities, calculateRegionalPrice, reports]);

  const handleAskAi = (item: (typeof quickItems)[0]) => {
    openAssistant(
      `Bandingkan harga ${item.name} di Acuan Nasional Bapanas${item.nationalRef ? ` (Rp ${item.nationalRef.toLocaleString('id-ID')})` : ''} dan Acuan Lokal ${selectedRegion.name} (Rp ${item.regionalPrice.toLocaleString('id-ID')}/${item.unit}), beserta laporan warga terkini.`
    );
  };

  return (
    <section
      id="sorotanSection"
      className="relative isolate overflow-hidden scroll-mt-16 pt-14 pb-10 bg-[var(--bg-paper)]"
    >
      <BatikMeshBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Acuan Nasional vs {selectedRegion.name}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Bandingkan acuan nasional (HAP/HET Bapanas) dengan harga pasar di{' '}
                <strong className="text-[var(--text-primary)]">{selectedRegion.name}</strong> sebelum menawar di lapak. PasarKu melengkapi pemantauan PIHPS Bank Indonesia dengan informasi pasar setempat yang lebih dekat ke kebutuhan pembeli.
              </p>
            </div>

            <div className="market-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">
                    Rentang Harga Beras ({selectedRegion.name})
                  </div>
                  <div className="text-lg font-bold text-[var(--text-primary)] font-mono-num">
                    Rp {berasRange.min.toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-[var(--text-muted)]">s.d.</span> Rp{' '}
                    {berasRange.max.toLocaleString('id-ID')}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--forest-surface)] text-[var(--forest-ink)] font-bold">
                  Beras Pokok
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">
                    Indeks Tertinggi ({selectedRegion.name})
                  </div>
                  <div className="text-lg font-bold text-[var(--accent-chili)] font-mono-num">
                    Rp {(topPriceItem?.price || 150000).toLocaleString('id-ID')}{' '}
                    <span className="text-xs text-[var(--text-muted)]">/{topPriceItem?.unit || 'kg'}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">{topPriceItem?.name || 'Daging Sapi Murni'}</div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] font-bold">
                  Pantauan Tinggi
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Sinyal Laporan Aktif</div>
                  <div className="text-lg font-bold text-[var(--forest-ink)] font-mono-num">
                    {approvedCount} Laporan Terverifikasi
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Termasuk {shortageCount} info kelangkaan pedagang (agregat pasar)
                  </div>
                </div>
                <Link
                  href="/cek-harga"
                  className="market-btn-secondary px-3 py-1.5 text-xs font-bold whitespace-nowrap no-underline"
                >
                  Cek Harga 
                </Link>
              </div>
            </div>

            <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Cakupan berjenjang dari Kota Bogor, Jabodetabek, Jawa Barat, hingga Nasional (21 Provinsi). Data rujukan: Bapanas RI, PIHPS BI, serta survei pasar rakyat setempat.
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="market-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[var(--border-ink)] pb-4 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    Papan Acuan 10 Komoditas ({selectedRegion.name})
                  </h3>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    Harga lokal vs Acuan Nasional HAP/HET
                  </span>
                </div>
                <Link
                  href="/indeks-harga"
                  className="market-btn-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 w-fit shrink-0 no-underline"
                >
                  <span>Detail Papan</span>
                  <ArrowRight size={13} weight="bold" aria-hidden="true" />
                </Link>
              </div>

              <div className="space-y-3">
                {quickItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1.5 text-sm group hover:bg-[var(--bg-muted)]/50 px-2 rounded-lg transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-[var(--forest-surface)] p-0.5 shrink-0">
                        <CommoditySvg kind={item.svg} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-[var(--text-primary)] truncate">
                          {item.name}
                        </div>
                        {item.nationalRef && (
                          <div className="text-[11px] text-[var(--text-muted)] font-mono-num">
                            HAP Nasional: Rp {item.nationalRef.toLocaleString('id-ID')}/{item.unit}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ledger-leader hidden sm:block" />

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-bold text-[var(--forest-ink)] font-mono-num">
                        Rp {item.regionalPrice.toLocaleString('id-ID')}
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

              <div className="mt-5 pt-4 border-t-2 border-[var(--border-ink)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-[var(--text-secondary)]">
                  Menampilkan 10 komoditas utama dari total{' '}
                  <strong className="text-[var(--text-primary)]">{liveCommodities.length} pangan</strong>{' '}
                  di {selectedRegion.name}.
                </span>
                <Link
                  href="/indeks-harga"
                  className="market-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center justify-center gap-2 shrink-0 no-underline"
                >
                  <MagnifyingGlass size={14} weight="bold" aria-hidden="true" />
                  <span>Detail Papan &amp; Cari Semua ({liveCommodities.length})</span>
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
