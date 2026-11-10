'use client';

import { useMemo } from 'react';
import { ShieldCheck } from '@phosphor-icons/react';
import type { CommodityDetail } from '@/types';
import { matchesCommodityRecord } from '@/lib/market-insights';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { formatRupiah } from '@/lib/utils';

export function RecentCitizenReportsTable({ detail }: { detail: CommodityDetail }) {
  const { reports } = useLiveCatalog();

  const matchingReports = useMemo(() => {
    return reports.filter((r) => matchesCommodityRecord(r, detail)).slice(0, 8);
  }, [reports, detail]);

  return (
    <div className="market-card p-6 sm:p-7 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
            Laporan Warga &amp; Info Kelangkaan Pedagang: {detail.name}
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Transparansi harga lapak dan status pasokan diagregasi per pasar tanpa menyebut identitas toko atau pedagang.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-primary)] w-fit">
          <ShieldCheck size={14} weight="bold" className="text-[var(--accent-chili)]" />
          <span>Moderator HargaKu &amp; Pemantau Pasar</span>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-[var(--border-subtle)]">
        {matchingReports.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-3 px-3 sm:px-4">Pasar &amp; Jenis</th>
                <th className="py-3 px-3">Harga / Stok</th>
                <th className="py-3 px-3">Waktu Lapor</th>
                <th className="py-3 px-3">Catatan Lapak</th>
                <th className="py-3 px-3 sm:px-4 text-right">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
              {matchingReports.map((r) => {
                const isShortage = r.reportType === 'SHORTAGE';
                return (
                  <tr key={r.id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-bold text-[var(--text-primary)]">{r.marketName}</div>
                      <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">
                        {isShortage ? 'Pedagang · Kelangkaan' : 'Warga · Laporan Harga'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold tabular-nums font-mono-num">
                      {isShortage ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                          Stok {r.stockStatus || 'TERBATAS'}
                        </span>
                      ) : (
                        <span className="text-[var(--forest-ink)]">
                          {formatRupiah(r.normalizedPricePerKg)} /{detail.unit}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] text-[12px]">
                      {r.submittedAt}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] text-[12px] max-w-[260px]">
                      {r.citizenNotes || (r.hasPhoto ? 'Foto nota terlampir' : 'Laporan lapangan')}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                          r.status === 'APPROVED'
                            ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]'
                            : r.status === 'PENDING'
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)]'
                        }`}
                      >
                        {r.status === 'APPROVED'
                          ? 'Terverifikasi'
                          : r.status === 'PENDING'
                          ? 'Menunggu Moderasi'
                          : 'Ditolak'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="py-6 text-center text-xs text-[var(--text-muted)]">
            Belum ada laporan warga maupun info kelangkaan untuk {detail.name}. Kirim laporan pertama lewat menu Lapor.
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary)] leading-[18px]">
        <strong className="text-[var(--text-primary)] font-bold">Kode etik perlindungan pedagang:</strong> Nama toko dan identitas perseorangan tidak pernah ditampilkan di platform publik. Seluruh data diverifikasi agregat per pasar oleh Moderator HargaKu.
      </div>
    </div>
  );
}
