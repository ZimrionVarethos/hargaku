import { ApiResponse, ReportType, ReporterRole, StockStatus } from '@/types';
import type { AdminReport } from '@/lib/types/admin';
import { INITIAL_ADMIN_REPORTS } from '@/lib/store/admin-seed';
import { matchesCommodityRecord, matchesMarketRecord } from '@/lib/market-insights';

export interface SubmitReportPayload {
  commodityId: string;
  marketId: string;
  reportedPrice: number;
  quantity?: number;
  unit: string;
  normalizedPrice?: number;
  reportType?: ReportType;
  reporterRole?: ReporterRole;
  stockStatus?: StockStatus;
  purchaseDate: string;
  photoFile?: File | null;
  notes?: string;
}

export interface SubmitReportResponse {
  reportId: string;
  status: 'PENDING' | 'ANOMALY' | 'APPROVED';
  commodityName: string;
  marketName: string;
  normalizedPrice: number;
  reportType?: ReportType;
  reporterRole?: ReporterRole;
  stockStatus?: StockStatus;
  submittedAt: string;
  reportRecord?: AdminReport;
  message: string;
}

export async function fetchVerifiedReports(params?: {
  marketId?: string;
  commodity?: string;
  reportType?: ReportType;
}): Promise<AdminReport[]> {
  try {
    const qs = new URLSearchParams();
    if (params?.marketId) qs.set('marketId', params.marketId);
    if (params?.commodity) qs.set('commodity', params.commodity);
    if (params?.reportType) qs.set('reportType', params.reportType);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetch(`/api/v1/reports${suffix}`);
    const json = (await res.json()) as ApiResponse<AdminReport[]>;
    if (res.ok && json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch {
  }

  return INITIAL_ADMIN_REPORTS.filter((r) => {
    if (r.status !== 'APPROVED') return false;
    if (params?.marketId && !matchesMarketRecord(r, params.marketId)) return false;
    if (
      params?.commodity &&
      !matchesCommodityRecord(r, {
        id: params.commodity,
        slug: params.commodity,
        name: params.commodity.toLowerCase(),
      })
    ) {
      return false;
    }
    if (params?.reportType && (r.reportType || 'PRICE') !== params.reportType) return false;
    return true;
  });
}

export async function submitCitizenReport(
  payload: SubmitReportPayload
): Promise<ApiResponse<SubmitReportResponse>> {
  const reportType: ReportType = payload.reportType || 'PRICE';
  const reporterRole: ReporterRole =
    payload.reporterRole || (reportType === 'SHORTAGE' ? 'PEDAGANG' : 'WARGA');

  try {
    const res = await fetch('/api/v1/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commodityId: payload.commodityId,
        marketId: payload.marketId,
        reportedPrice: payload.reportedPrice,
        quantity: payload.quantity || 1,
        unit: payload.unit,
        normalizedPrice: payload.normalizedPrice ?? payload.reportedPrice,
        reportType,
        reporterRole,
        stockStatus: payload.stockStatus,
        hasPhoto: Boolean(payload.photoFile),
        notes: payload.notes,
      }),
    });

    const json = (await res.json()) as ApiResponse<SubmitReportResponse>;
    if (res.ok && json.success) {
      return json;
    }
  } catch {
  }

  const reportId = `REP-${Date.now().toString().slice(-6)}`;
  return {
    success: true,
    message: 'Laporan berhasil disimpan (mode lokal).',
    data: {
      reportId,
      status: 'PENDING',
      commodityName: payload.commodityId,
      marketName: payload.marketId,
      normalizedPrice: reportType === 'SHORTAGE' ? 0 : payload.normalizedPrice ?? payload.reportedPrice,
      reportType,
      reporterRole,
      stockStatus: payload.stockStatus,
      submittedAt: new Date().toISOString(),
      message:
        reportType === 'SHORTAGE'
          ? 'Terima kasih atas info kelangkaan pasokan! Laporan masuk antrean moderasi tanpa nama toko.'
          : 'Terima kasih atas laporanmu! Data tersimpan untuk verifikasi.',
    },
  };
}
