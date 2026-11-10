'use client';

import { useRegion } from '@/lib/store/region-store';

interface MarketPriceItem {
  name: string;
  price: number;
  badge: 'Paling Hemat' | 'Wajar' | 'Agak Mahal' | 'Tertinggi';
}

const MARKET_PRICES: MarketPriceItem[] = [
  { name: 'Pasar Sukasari', price: 58000, badge: 'Paling Hemat' },
  { name: 'Pasar Gunung Batu', price: 59500, badge: 'Wajar' },
  { name: 'Pasar Jambu Dua', price: 61000, badge: 'Wajar' },
  { name: 'Pasar Anyar', price: 62500, badge: 'Agak Mahal' },
  { name: 'Pasar Kebon Kembang', price: 64000, badge: 'Tertinggi' },
];

export function MarketComparisonCard() {
  const { selectedRegion, calculateRegionalPrice } = useRegion();
  const maxPrice = calculateRegionalPrice(65000);

  return (
    <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
          Perbandingan Pasar di {selectedRegion.name}
        </h3>
        <p className="text-[12px] text-[var(--text-secondary)]">
          Harga rerata lapak hari ini (22 Okt 2026)
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {MARKET_PRICES.map((m) => {
          const adjustedPrice = calculateRegionalPrice(m.price);
          const widthPercent = Math.round((adjustedPrice / maxPrice) * 100);

          let badgeStyle = 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]';
          if (m.badge === 'Paling Hemat') {
            badgeStyle = 'bg-[#E2EFE6] text-[#245034] border border-[#245034]';
          } else if (m.badge === 'Agak Mahal') {
            badgeStyle = 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]';
          } else if (m.badge === 'Tertinggi') {
            badgeStyle = 'bg-[#FBE9E6] text-[var(--accent-chili)] border border-[var(--accent-chili)]';
          }

          return (
            <div key={m.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-primary)]">{m.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeStyle}`}
                  >
                    {m.badge}
                  </span>
                </div>

                <span className="font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num">
                  Rp {adjustedPrice.toLocaleString('id-ID')}/kg
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor:
                      m.badge === 'Paling Hemat'
                        ? '#245034'
                        : m.badge === 'Tertinggi'
                        ? '#A92717'
                        : m.badge === 'Agak Mahal'
                        ? '#D97706'
                        : '#132E20',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--text-muted)] leading-[16px] pt-2 border-t border-[var(--border-subtle)]">
        Berdasarkan 24 laporan terverifikasi + survei harian PIHPS.
      </p>
    </div>
  );
}
