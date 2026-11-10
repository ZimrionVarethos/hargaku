'use client';

import {
  ShieldCheck,
  CheckCircle,
  Prohibit,
  WarningCircle,
  Camera,
  Question,
} from '@phosphor-icons/react';
import { AdminReport } from './admin-data';
import { formatRupiah } from '@/lib/utils';

interface Props {
  report: AdminReport;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestMoreInfo: (id: string) => void;
}

export function AdminReportInspector({
  report,
  onApprove,
  onReject,
  onRequestMoreInfo,
}: Props) {
  return (
    <div className="market-card p-5 sm:p-7 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[var(--border-ink)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono-num text-[11px] font-bold text-[var(--text-muted)]">
              {report.id}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
            <span className="text-[11px] text-[var(--text-secondary)]">{report.submittedAt}</span>
          </div>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
            {report.commodityName}
          </h2>
          <span className="text-[12px] text-[var(--text-secondary)]">{report.marketName}</span>
        </div>

        <div>
          {report.status === 'ANOMALY' && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--ochre-surface)] text-[var(--warning-ink)] border border-[var(--earth-ochre)]/45 inline-flex items-center gap-1.5">
              <WarningCircle size={14} weight="bold" />
              <span>Peringatan Anomali Statistik</span>
            </span>
          )}
          {report.status === 'PENDING' && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
              Menunggu Keputusan
            </span>
          )}
          {report.status === 'APPROVED' && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/35 inline-flex items-center gap-1.5">
              <CheckCircle size={14} weight="bold" />
              <span>Telah Disetujui Masuk Konsensus</span>
            </span>
          )}
          {report.status === 'REJECTED' && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)]/35 inline-flex items-center gap-1.5">
              <Prohibit size={14} weight="bold" />
              <span>Ditolak / Dieliminasi</span>
            </span>
          )}
        </div>
      </div>

      {report.anomalyReason && (
        <div className="p-4 rounded-[12px] bg-[var(--ochre-surface)] border-2 border-[var(--border-ink)] flex items-start gap-3 text-[12px]">
          <WarningCircle size={20} weight="fill" className="text-[var(--warning-ink)] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[var(--warning-ink)]">Diagnosa Algoritma MAD:</span>
            <p className="text-[var(--text-secondary)] leading-relaxed">{report.anomalyReason}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Komparasi 3 Lapis Harga
        </span>
        <div className="bg-[var(--bg-paper)] rounded-[12px] border-2 border-[var(--border-ink)] p-4 divide-y divide-[var(--border-subtle)] text-[13px]">
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-[var(--text-secondary)]">Lapis 1: HAP Bapanas</span>
            <span className="font-mono-num font-bold text-[var(--text-primary)] tabular-nums">
              {formatRupiah(report.officialHapPrice)} / kg
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-[var(--text-secondary)]">Lapis 2: Rerata Kota PIHPS BI</span>
            <span className="font-mono-num font-bold text-[var(--text-primary)] tabular-nums">
              {formatRupiah(report.cityAvgPrice)} / kg
            </span>
          </div>
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex flex-col">
              <span className="font-bold text-[var(--text-primary)]">Lapis 3: Laporan Warga Lapak</span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Trans: {formatRupiah(report.reportedPrice)} / {report.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono-num font-extrabold text-[var(--forest-ink)] tabular-nums text-[15px] block">
                {formatRupiah(report.normalizedPricePerKg)} / kg
              </span>
              <span
                className={`text-[11px] font-bold tabular-nums ${
                  report.diffPercent > 20
                    ? 'text-[var(--accent-chili)]'
                    : report.diffPercent < 0
                    ? 'text-[var(--forest-ink)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {report.diffPercent > 0 ? `+${report.diffPercent}%` : `${report.diffPercent}%`} vs Rerata Kota
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Bukti Foto Lapak
          </span>
          <span className="text-[11px] font-bold text-[var(--forest-ink)] flex items-center gap-1">
            <ShieldCheck size={14} weight="bold" />
            <span>EXIF Sanitized: No GPS Metadata</span>
          </span>
        </div>

        {report.hasPhoto ? (
          <div className="relative rounded-[12px] bg-[var(--bg-muted)]/55 border-2 border-[var(--border-subtle)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[140px]">
            <Camera size={32} weight="bold" className="text-[var(--text-muted)]" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-[var(--text-primary)]">
                Nota Belanja &amp; Label Lapak
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                File JPG &middot; 1.2 MB &middot; GPS distrip di browser
              </span>
            </div>
            <span className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono-num font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/35">
              SANITY CHECK: PASSED
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-[12px] bg-[var(--bg-paper)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-muted)] text-center">
            Pelapor tidak menyertakan foto (Laporan murni nilai transaksi).
          </div>
        )}
      </div>

      {report.citizenNotes && (
        <div className="p-3.5 rounded-[12px] bg-[var(--bg-paper)] border border-[var(--border-subtle)] flex flex-col gap-1 text-[12px]">
          <span className="font-bold text-[var(--text-muted)]">Catatan Warga Pelapor:</span>
          <p className="text-[var(--text-primary)] italic">&ldquo;{report.citizenNotes}&rdquo;</p>
        </div>
      )}

      <div className="pt-4 border-t-2 border-[var(--border-subtle)] flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onApprove(report.id)}
          className="flex-1 py-2.5 px-4 rounded-[10px] bg-[#245034] hover:bg-[#1A3B26] border-2 border-[var(--border-ink)] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-[var(--shadow-hard-sm)] transition-all cursor-pointer"
        >
          <CheckCircle size={16} weight="bold" />
          <span>Setujui Laporan</span>
        </button>

        <button
          type="button"
          onClick={() => onReject(report.id)}
          className="flex-1 py-2.5 px-4 rounded-[10px] bg-[var(--accent-chili-soft)] hover:bg-[var(--accent-chili)] hover:text-white border-2 border-[var(--border-ink)] text-[var(--accent-chili)] text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-[var(--shadow-hard-sm)] transition-all cursor-pointer"
        >
          <Prohibit size={16} weight="bold" />
          <span>Tolak Laporan</span>
        </button>

        <button
          type="button"
          onClick={() => onRequestMoreInfo(report.id)}
          className="market-btn-secondary py-2.5 px-3 text-[13px] font-bold flex items-center justify-center gap-1.5"
          title="Tandai Butuh Investigasi"
        >
          <Question size={16} weight="bold" />
          <span className="hidden sm:inline">Investigasi</span>
        </button>
      </div>
    </div>
  );
}
