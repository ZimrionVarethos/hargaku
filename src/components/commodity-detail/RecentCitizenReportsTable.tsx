'use client';

import { ShieldCheck } from '@phosphor-icons/react';

interface ReportRow {
  marketLocation: string;
  price: string;
  time: string;
  proofType: string;
  status: 'Terverifikasi Warga' | 'Menunggu Moderasi';
}

const CITIZEN_REPORTS: ReportRow[] = [
  {
    marketLocation: 'Pasar Sukasari (Kios Sayur Timur)',
    price: 'Rp 58.000 /kg',
    time: '05:45 WIB (Hari ini)',
    proofType: 'Foto Nota & Timbangan',
    status: 'Terverifikasi Warga',
  },
  {
    marketLocation: 'Pasar Gunung Batu (Lapak Blok B)',
    price: 'Rp 59.500 /kg',
    time: '06:12 WIB (Hari ini)',
    proofType: 'Foto Timbangan Digital',
    status: 'Terverifikasi Warga',
  },
  {
    marketLocation: 'Pasar Anyar (Sentra Bumbu)',
    price: 'Rp 62.000 /kg',
    time: '06:30 WIB (Hari ini)',
    proofType: 'Foto Lapak Terbuka',
    status: 'Terverifikasi Warga',
  },
  {
    marketLocation: 'Pasar Kebon Kembang (Pintu 2)',
    price: 'Rp 64.000 /kg',
    time: '06:48 WIB (Hari ini)',
    proofType: 'Sedang Ditinjau Foto',
    status: 'Menunggu Moderasi',
  },
];

export function RecentCitizenReportsTable() {
  return (
    <div className="market-card p-6 sm:p-7 flex flex-col gap-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
            Laporan Terbaru Warga (Agregat per Pasar)
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Transparansi harga riil lapak pedagang tanpa mengekspos identitas perorangan pedagang.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-primary)] w-fit">
          <ShieldCheck size={14} weight="bold" className="text-[var(--accent-chili)]" />
          <span>Terverifikasi Sistem &amp; TPID</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-t border-[var(--border-subtle)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4">Pasar Tradisional</th>
              <th className="py-3 px-3">Harga Lapak</th>
              <th className="py-3 px-3">Waktu Lapor</th>
              <th className="py-3 px-3">Bukti Lapak</th>
              <th className="py-3 px-3 sm:px-4 text-right">Status Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
            {CITIZEN_REPORTS.map((r, idx) => (
              <tr key={idx} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                <td className="py-3 px-3 sm:px-4 font-bold text-[var(--text-primary)]">
                  {r.marketLocation}
                </td>
                <td className="py-3 px-3 font-extrabold text-[var(--forest-ink)] tabular-nums font-mono-num">
                  {r.price}
                </td>
                <td className="py-3 px-3 text-[var(--text-secondary)] text-[12px]">
                  {r.time}
                </td>
                <td className="py-3 px-3 text-[var(--text-secondary)] text-[12px]">
                  {r.proofType}
                </td>
                <td className="py-3 px-3 sm:px-4 text-right">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                      r.status === 'Terverifikasi Warga'
                        ? 'bg-[#E2EFE6] text-[#245034] border border-[#245034]'
                        : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ethics Note Footer */}
      <div className="pt-2 border-t border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary)] leading-[18px]">
        <strong className="text-[var(--text-primary)] font-bold">Kode etik perlindungan pedagang:</strong> Nama toko dan identitas perseorangan pedagang tidak dicantumkan di platform publik. Seluruh data diverifikasi agregat oleh sistem dan relawan TPID demi transparansi pasar yang saling menghormati.
      </div>
    </div>
  );
}
