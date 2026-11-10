'use client';

import {
  Hourglass,
  WarningCircle,
  CheckCircle,
  Prohibit,
} from '@phosphor-icons/react';

interface Props {
  pendingCount: number;
  anomalyCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function AdminMetricCards({
  pendingCount,
  anomalyCount,
  approvedCount,
  rejectedCount,
}: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="market-card p-4 sm:p-5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[var(--text-muted)]">
            Menunggu Review
          </span>
          <Hourglass size={18} weight="bold" className="text-[var(--text-muted)]" />
        </div>
        <span className="font-mono-num text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tabular-nums tracking-tight">
          {pendingCount}
        </span>
      </div>

      <div className="market-card bg-[var(--ochre-surface)] p-4 sm:p-5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[var(--warning-ink)]">
            Peringatan Anomali
          </span>
          <WarningCircle size={18} weight="bold" className="text-[var(--warning-ink)]" />
        </div>
        <span className="font-mono-num text-[26px] sm:text-[30px] font-bold text-[var(--warning-ink)] tabular-nums tracking-tight">
          {anomalyCount}
        </span>
      </div>

      <div className="market-card p-4 sm:p-5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[var(--text-muted)]">
            Disetujui Hari Ini
          </span>
          <CheckCircle size={18} weight="bold" className="text-[var(--forest-ink)]" />
        </div>
        <span className="font-mono-num text-[26px] sm:text-[30px] font-bold text-[var(--forest-ink)] tabular-nums tracking-tight">
          {approvedCount}
        </span>
      </div>

      <div className="market-card p-4 sm:p-5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[var(--text-muted)]">
            Dieliminasi / Spam
          </span>
          <Prohibit size={18} weight="bold" className="text-[var(--accent-chili)]" />
        </div>
        <span className="font-mono-num text-[26px] sm:text-[30px] font-bold text-[var(--accent-chili)] tabular-nums tracking-tight">
          {rejectedCount}
        </span>
      </div>
    </div>
  );
}
