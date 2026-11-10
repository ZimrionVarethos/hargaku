'use client';

import { Question } from '@phosphor-icons/react';

export function PriceMethodologyCard() {
  return (
    <div className="market-card p-6 sm:p-7 bg-[var(--bg-card)] flex flex-col justify-between gap-5">
      <div className="flex items-center gap-2">
        <Question size={18} weight="bold" className="text-[var(--accent-chili)]" />
        <h3 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
          Bagaimana Status Kewajaran Dihitung?
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
        {/* Wajar */}
        <div className="flex flex-col gap-1 p-3 rounded-[10px] bg-[var(--bg-paper)]/60 border border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--border-ink)] w-fit">
            Wajar
          </span>
          <span className="text-[var(--text-muted)] leading-[18px]">
            Dalam rentang ±10% dari harga pembanding pasar saat ini.
          </span>
        </div>

        {/* Agak Mahal */}
        <div className="flex flex-col gap-1 p-3 rounded-[10px] bg-[var(--bg-paper)]/60 border border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] w-fit">
            Agak Mahal
          </span>
          <span className="text-[var(--text-muted)] leading-[18px]">
            +10% sampai +25% di atas rata-rata pembanding pasar.
          </span>
        </div>

        {/* Terlalu Mahal */}
        <div className="flex flex-col gap-1 p-3 rounded-[10px] bg-[var(--bg-paper)]/60 border border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)] w-fit">
            Terlalu Mahal
          </span>
          <span className="text-[var(--text-muted)] leading-[18px]">
            Di atas +25% dari acuan rata-rata harga pasar saat ini.
          </span>
        </div>

        {/* Jauh Lebih Murah */}
        <div className="flex flex-col gap-1 p-3 rounded-[10px] bg-[var(--bg-paper)]/60 border border-[var(--border-subtle)]">
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#EEF773] text-[#102B03] border border-[var(--border-ink)] w-fit">
            Jauh Lebih Murah
          </span>
          <span className="text-[var(--text-muted)] leading-[18px]">
            Di bawah -15% (cek kualitas bahan, kesegaran, &amp; anak timbangan).
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[var(--text-muted)] leading-[16px] pt-2 border-t border-[var(--border-subtle)]">
        <strong className="text-[var(--text-primary)] font-semibold">Hirarki sumber pembanding:</strong> Laporan Warga Lapak (≥3 laporan, 7 hari) → Rerata Survei Pasar Resmi Daerah (PIHPS) → Standarisasi Nasional HAP/HET Bapanas (Zonasi Wilayah).
      </p>
    </div>
  );
}
