'use client';

import Link from 'next/link';
import { CheckCircle, ShieldCheck, MapPin, Clock, PlusCircle } from '@phosphor-icons/react';
import { formatRupiah } from '@/lib/utils';
import type { ReportType, StockStatus } from '@/types';

interface Props {
  reportId: string;
  commodityName: string;
  marketName: string;
  pricePerUnit: number;
  unitLabel: string;
  normalizedPricePerKg: number;
  reportType?: ReportType;
  stockStatus?: StockStatus;
  hasPhoto: boolean;
  onReset: () => void;
}

export function LaporSuccessCard({
  reportId,
  commodityName,
  marketName,
  pricePerUnit,
  unitLabel,
  normalizedPricePerKg,
  reportType = 'PRICE',
  stockStatus,
  hasPhoto,
  onReset,
}: Props) {
  const isShortage = reportType === 'SHORTAGE';

  return (
    <div className="market-card p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className="w-14 h-14 rounded-full bg-[var(--forest-surface)] border-2 border-[var(--forest-ink)] flex items-center justify-center text-[var(--forest-ink)] shadow-sm">
          <CheckCircle size={32} weight="fill" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            {isShortage ? 'Info Kelangkaan Tersimpan' : 'Laporan Harga Tersimpan'}
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)] tracking-tight">
            Terima Kasih Atas Kontribusimu!
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] max-w-[520px]">
            {isShortage
              ? 'Laporan kondisi stok dari pedagang telah masuk antrean verifikasi Moderator HargaKu tanpa menyingkap identitas lapak.'
              : 'Data harga lapakmu telah dicatat dan masuk antrean verifikasi konsensus Moderator HargaKu & Pemantau Pasar.'}
          </p>
        </div>
      </div>

      <div className="bg-[var(--bg-muted)] rounded-xl border border-[var(--border-subtle)] p-5 flex flex-col gap-3 text-[13px]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <span className="text-[var(--text-muted)] font-medium">Nomor Laporan</span>
          <span className="font-bold text-[var(--text-primary)] font-mono">{reportId}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <span className="text-[var(--text-muted)] font-medium">Komoditas &amp; Pasar</span>
          <div className="text-right">
            <span className="font-bold text-[var(--text-primary)] block">{commodityName}</span>
            <span className="text-[11px] text-[var(--text-secondary)]">{marketName}</span>
          </div>
        </div>

        {isShortage ? (
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)] font-medium">Status Stok Terlapor</span>
            <span className="font-extrabold px-2.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs">
              {stockStatus || 'TERBATAS'}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)] font-medium">Harga Transaksi</span>
            <div className="text-right">
              <span className="font-extrabold text-[var(--forest-ink)] block font-mono-num">
                {formatRupiah(pricePerUnit)} / {unitLabel}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono font-mono-num">
                &asymp; {formatRupiah(normalizedPricePerKg)} / kg
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <span className="text-[var(--text-muted)] font-medium">Privasi &amp; Bukti</span>
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <ShieldCheck size={16} weight="bold" className="text-[var(--forest-ink)]" />
            <span>{hasPhoto ? 'Foto Terunggah (EXIF Sanitized)' : 'Agregat Anonim Per Pasar'}</span>
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[var(--text-muted)] font-medium">Status Validasi</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center gap-1">
            <Clock size={12} weight="bold" />
            <span>Menunggu Moderasi Admin</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="market-btn-secondary w-full sm:w-auto flex-1 py-3 px-5 text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle size={16} weight="bold" />
          <span>Kirim Laporan Lain</span>
        </button>

        <Link
          href="/peta"
          className="market-btn-primary w-full sm:w-auto flex-1 py-3 px-5 text-[13px] font-bold flex items-center justify-center gap-2 no-underline"
        >
          <MapPin size={16} weight="bold" />
          <span>Lihat Kondisi Pasar di Peta</span>
        </Link>
      </div>
    </div>
  );
}
