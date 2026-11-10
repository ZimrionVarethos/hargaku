'use client';

import { CommoditySummary } from '@/types';
import { CaretDown, Table, SquaresFour } from '@phosphor-icons/react';

interface Props {
  commodities: CommoditySummary[];
  selectedCommodityId: string;
  onCommodityChange: (id: string) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

export function PetaFilterSidebar({
  commodities,
  selectedCommodityId,
  onCommodityChange,
  isLightMode,
  onToggleLightMode,
}: Props) {
  return (
    <div className="market-card p-5 sm:p-6 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-5">
        <h3 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
          Filter Pantauan
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[var(--text-primary)]">
            Komoditas Pilihan
          </label>
          <div className="relative">
            <select
              value={selectedCommodityId}
              onChange={(e) => onCommodityChange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] font-semibold shadow-xs focus:ring-2 focus:ring-[var(--accent-chili)] cursor-pointer"
            >
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <CaretDown
              size={13}
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[12px] font-bold text-[var(--text-primary)]">
            Kategori Indeks Relatif
          </span>

          <div className="flex flex-col gap-2.5 text-[12px]">
            <div className="flex items-start gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#E2EFE6] border border-[#245034] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-bold text-[var(--text-primary)]">
                  Lebih hemat dari rerata kota
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Pasar Sukasari
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[var(--bg-muted)] border border-[var(--border-ink)] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-bold text-[var(--text-primary)]">
                  Sekitar rata-rata kota
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Pasar Gn. Batu, Pasar Jambu Dua
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#FBE9E6] border border-[#A92717] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-bold text-[var(--text-primary)]">
                  Lebih tinggi dari rerata kota
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Pasar Anyar, Kebon Kembang
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleLightMode}
        className="market-btn-secondary w-full py-2.5 px-4 text-[12px] font-bold flex items-center justify-center gap-2"
      >
        {isLightMode ? (
          <>
            <SquaresFour size={15} weight="bold" />
            <span>Tampilkan Peta Visual</span>
          </>
        ) : (
          <>
            <Table size={15} weight="bold" />
            <span>Mode Ringan (Tabel Langsung)</span>
          </>
        )}
      </button>
    </div>
  );
}
