'use client';

import Link from 'next/link';
import {
  CheckCircle,
  ShieldCheck,
  MapPin,
  Clock,
  PlusCircle,
} from '@phosphor-icons/react';
import { formatRupiah } from '@/lib/utils';

interface Props {
  reportId: string;
  commodityName: string;
  marketName: string;
  pricePerUnit: number;
  unitLabel: string;
  normalizedPricePerKg: number;
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
  hasPhoto,
  onReset,
}: Props) {
  return (
    <div className="market-card p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className="w-14 h-14 rounded-full bg-[#E2EFE6] border-2 border-[#245034] flex items-center justify-center text-[#245034] shadow-sm">
          <CheckCircle size={32} weight="fill" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
            Laporan Tersimpan
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)] tracking-tight">
            Terima Kasih Atas Kontribusimu!
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] max-w-[520px]">
            Data harga lapakmu telah dicatat dan masuk ke antrean verifikasi konsensus TPID &amp; Pemantau Pasar.
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

        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <span className="text-[var(--text-muted)] font-medium">Bukti Foto</span>
          <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <ShieldCheck size={16} weight="bold" className="text-[#245034]" />
            <span>{hasPhoto ? 'Terunggah (EXIF Sanitized)' : 'Tanpa Foto (Pernyataan Riil)'}</span>
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[var(--text-muted)] font-medium">Status Validasi</span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center gap-1">
            <Clock size={12} weight="bold" />
            <span>Menunggu Moderasi (&lt; 30 menit)</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="market-btn-secondary w-full sm:w-auto flex-1 py-3 px-5 text-[13px] font-bold flex items-center justify-center gap-2"
        >
          <PlusCircle size={16} weight="bold" />
          <span>Lapor Komoditas Lain</span>
        </button>

        <Link
          href="/peta"
          className="market-btn-primary w-full sm:w-auto flex-1 py-3 px-5 text-[13px] font-bold flex items-center justify-center gap-2"
        >
          <MapPin size={16} weight="bold" />
          <span>Cek Peta Persebaran Pasar</span>
        </Link>
      </div>
    </div>
  );
}
