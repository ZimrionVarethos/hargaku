'use client';

import { useState } from 'react';
import {
  MagnifyingGlass,
  WarningCircle,
  CheckCircle,
  Hourglass,
  Prohibit,
  Camera,
} from '@phosphor-icons/react';
import { AdminReport } from './admin-data';
import { formatRupiah } from '@/lib/utils';

interface Props {
  reports: AdminReport[];
  selectedReportId: string;
  onSelectReport: (id: string) => void;
  activeTab: 'ALL' | 'PENDING' | 'ANOMALY' | 'APPROVED' | 'REJECTED';
  onTabChange: (tab: 'ALL' | 'PENDING' | 'ANOMALY' | 'APPROVED' | 'REJECTED') => void;
}

export function AdminReportQueue({
  reports,
  selectedReportId,
  onSelectReport,
  activeTab,
  onTabChange,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'PENDING' && r.status !== 'PENDING') return false;
    if (activeTab === 'ANOMALY' && r.status !== 'ANOMALY') return false;
    if (activeTab === 'APPROVED' && r.status !== 'APPROVED') return false;
    if (activeTab === 'REJECTED' && r.status !== 'REJECTED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.commodityName.toLowerCase().includes(q) ||
        r.marketName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-[var(--border-ink)]">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            Antrean Laporan Warga
          </h2>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Pilih baris untuk meninjau rincian dan bukti nota.
          </p>
        </div>
        <span className="text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] shrink-0">
          {filteredReports.length} Laporan
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {(
          [
            { id: 'ALL', label: 'Semua' },
            { id: 'ANOMALY', label: 'Anomali' },
            { id: 'PENDING', label: 'Menunggu' },
            { id: 'APPROVED', label: 'Disetujui' },
            { id: 'REJECTED', label: 'Ditolak' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-1 text-[11px] font-bold text-center flex items-center justify-center cursor-pointer transition-all ${
                isActive
                  ? 'market-btn-primary'
                  : 'rounded-[10px] bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-ink)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <MagnifyingGlass
          size={14}
          weight="bold"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari ID laporan, komoditas, atau pasar..."
          className="w-full pl-9 pr-4 py-2 rounded-[10px] bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[12px] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
        />
      </div>

      <div className="divide-y divide-[var(--border-subtle)] max-h-[540px] overflow-y-auto">
        {filteredReports.map((r, idx) => {
          const isSelected = r.id === selectedReportId;

          return (
            <div
              key={r.id}
              onClick={() => onSelectReport(r.id)}
              className={`py-3.5 px-2.5 cursor-pointer transition-colors flex flex-col gap-2 ${
                isSelected
                  ? 'bg-[var(--bg-muted)]/70'
                  : 'hover:bg-[var(--bg-muted)]/35'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/50'
                        : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-[var(--text-primary)] leading-snug truncate">
                      {r.commodityName}
                    </h4>
                    <span className="text-[11px] text-[var(--text-muted)] block truncate">
                      {r.marketName} &middot; {r.id}
                    </span>
                  </div>
                </div>

                {r.status === 'ANOMALY' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--ochre-surface)] text-[var(--warning-ink)] border border-[var(--earth-ochre)]/45 flex items-center gap-1 shrink-0">
                    <WarningCircle size={11} weight="bold" />
                    <span>{r.diffPercent > 0 ? `+${r.diffPercent}%` : `${r.diffPercent}%`}</span>
                  </span>
                )}
                {r.status === 'PENDING' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center gap-1 shrink-0">
                    <Hourglass size={11} weight="bold" />
                    <span>MENUNGGU</span>
                  </span>
                )}
                {r.status === 'APPROVED' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/35 flex items-center gap-1 shrink-0">
                    <CheckCircle size={11} weight="bold" />
                    <span>DISETUJUI</span>
                  </span>
                )}
                {r.status === 'REJECTED' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)]/35 flex items-center gap-1 shrink-0">
                    <Prohibit size={11} weight="bold" />
                    <span>DITOLAK</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pl-8 text-[11px]">
                <span className="font-mono-num font-extrabold text-[var(--forest-ink)] tabular-nums text-[12px]">
                  {formatRupiah(r.reportedPrice)} / {r.unit}
                </span>

                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  {r.hasPhoto && (
                    <span className="flex items-center gap-0.5 text-[var(--forest-ink)] font-bold">
                      <Camera size={12} weight="bold" />
                      <span>Foto</span>
                    </span>
                  )}
                  <span>{r.submittedAt}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
