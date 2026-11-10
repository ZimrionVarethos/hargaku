'use client';

import { useState } from 'react';
import { useAdminStore } from '@/lib/store/admin-store';
import { AdminMetricCards } from './AdminMetricCards';
import { AdminReportQueue } from './AdminReportQueue';
import { AdminReportInspector } from './AdminReportInspector';

export function AdminReportsView() {
  const { reports, approveReport, rejectReport, requestReportInfo } =
    useAdminStore();

  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'PENDING' | 'ANOMALY' | 'APPROVED' | 'REJECTED'
  >('ALL');

  const selectedReport =
    reports.find((r) => r.id === selectedReportId) || reports[0];

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;
  const anomalyCount = reports.filter((r) => r.status === 'ANOMALY').length;
  const approvedCount = reports.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = reports.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <div className="market-card p-5 sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Portal Moderasi Laporan Warga
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Tinjau nota transaksi belanja warga, saring anomali statistik MAD, dan berikan persetujuan untuk acuan Lapis 3.
        </p>
      </div>

      <AdminMetricCards
        pendingCount={pendingCount}
        anomalyCount={anomalyCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-5">
          <AdminReportQueue
            reports={reports}
            selectedReportId={selectedReportId}
            onSelectReport={setSelectedReportId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-7">
          {selectedReport ? (
            <AdminReportInspector
              report={selectedReport}
              onApprove={approveReport}
              onReject={(id) => rejectReport(id)}
              onRequestMoreInfo={(id) =>
                requestReportInfo(id, 'Butuh verifikasi fisik timbangan')
              }
            />
          ) : (
            <div className="market-card p-8 text-center text-sm text-[var(--text-muted)]">
              Tidak ada laporan warga yang dipilih.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
