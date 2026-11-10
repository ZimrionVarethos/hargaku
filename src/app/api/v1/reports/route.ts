import { NextRequest, NextResponse } from 'next/server';
import { fetchBootstrapFromDb, fetchCatalogFromDb, insertReportDb } from '@/lib/server/admin-db';
import { INITIAL_ADMIN_STATE } from '@/lib/store/admin-seed';
import { matchesCommodityRecord, matchesMarketRecord, resolveCanonicalMarket } from '@/lib/market-insights';
import type { AdminReport } from '@/lib/types/admin';
import type { ReportType, ReporterRole, StockStatus } from '@/types';

export async function GET(req: NextRequest) {
  const marketId = req.nextUrl.searchParams.get('marketId')?.trim();
  const commodity = req.nextUrl.searchParams.get('commodity')?.trim();
  const reportType = req.nextUrl.searchParams.get('reportType')?.trim().toUpperCase();

  const dbData = await fetchBootstrapFromDb().catch(() => null);
  const allReports =
    dbData && dbData.reports.length > 0 ? dbData.reports : INITIAL_ADMIN_STATE.reports;

  let approved = allReports.filter((r) => r.status === 'APPROVED');

  if (marketId) {
    approved = approved.filter((r) => matchesMarketRecord(r, marketId));
  }
  if (commodity) {
    const q = commodity.toLowerCase();
    approved = approved.filter((r) =>
      matchesCommodityRecord(r, { id: commodity, slug: commodity, name: q })
    );
  }
  if (reportType === 'PRICE' || reportType === 'SHORTAGE') {
    approved = approved.filter((r) => (r.reportType || 'PRICE') === reportType);
  }

  return NextResponse.json({
    success: true,
    message: 'Daftar laporan terverifikasi dimuat.',
    data: approved,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      commodityId?: string;
      marketId?: string;
      reportedPrice?: number;
      quantity?: number;
      unit?: string;
      normalizedPrice?: number;
      reportType?: ReportType;
      reporterRole?: ReporterRole;
      stockStatus?: StockStatus;
      hasPhoto?: boolean;
      notes?: string;
    };

    const reportType: ReportType = body.reportType === 'SHORTAGE' ? 'SHORTAGE' : 'PRICE';
    const reporterRole: ReporterRole =
      body.reporterRole === 'PEDAGANG' || reportType === 'SHORTAGE' ? 'PEDAGANG' : 'WARGA';
    const stockStatus: StockStatus | undefined =
      reportType === 'SHORTAGE' ? body.stockStatus || 'TERBATAS' : undefined;
    const reportedPrice = Number(body.reportedPrice || 0);

    if (!body.commodityId || !body.marketId || (reportType === 'PRICE' && reportedPrice <= 0)) {
      return NextResponse.json(
        { success: false, message: 'Data laporan tidak lengkap atau nominal harga tidak valid.' },
        { status: 400 }
      );
    }

    const catalog = await fetchCatalogFromDb().catch(() => null);
    const commodities =
      catalog && catalog.commodities.length > 0
        ? catalog.commodities
        : INITIAL_ADMIN_STATE.commodities;
    const markets =
      catalog && catalog.markets.length > 0 ? catalog.markets : INITIAL_ADMIN_STATE.markets;
    const dailyPrices =
      catalog && Object.keys(catalog.dailyPrices).length > 0
        ? catalog.dailyPrices
        : INITIAL_ADMIN_STATE.dailyPrices;

    const com = commodities.find((c) => c.id === body.commodityId || c.slug === body.commodityId);
    const mkt = resolveCanonicalMarket(markets, body.marketId);

    const hapPrice = com?.hapHetPrice || Math.max(reportedPrice, 0);
    const cityAvg = (mkt && com && dailyPrices[`${mkt.id}_${com.id}`]?.price) || hapPrice;
    const norm = reportType === 'SHORTAGE' ? 0 : Number(body.normalizedPrice || reportedPrice);
    const diffPercent =
      reportType === 'PRICE' && cityAvg > 0
        ? Math.round(((norm - cityAvg) / cityAvg) * 1000) / 10
        : 0;
    const isAnomaly = reportType === 'PRICE' && Math.abs(diffPercent) > 25;
    const reportId = `REP-${Date.now().toString().slice(-6)}`;

    const newReport: AdminReport = {
      id: reportId,
      commodityId: com?.id || body.commodityId,
      commodityName: com?.name || body.commodityId,
      marketId: mkt?.id || body.marketId,
      marketName: mkt?.name || body.marketId,
      reportType,
      reporterRole,
      quantity: Math.max(1, Number(body.quantity || 1)),
      reportedPrice: reportType === 'SHORTAGE' ? Math.max(0, reportedPrice) : reportedPrice,
      unit: body.unit || '1 kg',
      normalizedPricePerKg: norm,
      officialHapPrice: hapPrice,
      cityAvgPrice: cityAvg,
      diffPercent,
      stockStatus,
      submittedAt: 'Baru saja',
      hasPhoto: Boolean(body.hasPhoto),
      citizenNotes: body.notes?.trim() || undefined,
      status: isAnomaly ? 'ANOMALY' : 'PENDING',
      anomalyReason: isAnomaly
        ? `Deviasi ${diffPercent > 0 ? '+' : ''}${diffPercent}% melampaui ambang toleransi MAD (25%).`
        : undefined,
      exifSanitized: true,
    };

    let savedInDb = true;
    try {
      await insertReportDb(newReport);
    } catch {
      savedInDb = false;
    }

    const thankYouText =
      reportType === 'SHORTAGE'
        ? 'Terima kasih atas informasi stok! Laporan kelangkaan agregat pasar masuk antrean moderasi tanpa identitas toko.'
        : savedInDb
        ? 'Terima kasih atas laporanmu! Data tersimpan di antrean moderasi Supabase.'
        : 'Terima kasih atas laporanmu! Data disimpan sementara pada sesi aktif untuk moderasi.';

    return NextResponse.json({
      success: true,
      message: savedInDb
        ? 'Laporan tersimpan untuk moderasi admin.'
        : 'Laporan tersimpan dalam mode lokal.',
      data: {
        reportId,
        status: newReport.status,
        commodityName: newReport.commodityName,
        marketName: newReport.marketName,
        normalizedPrice: norm,
        reportType,
        reporterRole,
        stockStatus,
        source: savedInDb ? 'supabase' : 'local-fallback',
        submittedAt: new Date().toISOString(),
        reportRecord: newReport,
        message: thankYouText,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Gagal menyimpan laporan.',
      },
      { status: 400 }
    );
  }
}
