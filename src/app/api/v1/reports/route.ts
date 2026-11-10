import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalogFromDb, insertReportDb } from '@/lib/server/admin-db';
import type { AdminReport } from '@/lib/types/admin';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      commodityId?: string;
      marketId?: string;
      reportedPrice?: number;
      unit?: string;
      normalizedPrice?: number;
      hasPhoto?: boolean;
      notes?: string;
    };

    const reportedPrice = Number(body.reportedPrice || 0);
    if (!body.commodityId || !body.marketId || reportedPrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'Data laporan warga tidak lengkap.' },
        { status: 400 }
      );
    }

    const { commodities, markets, dailyPrices } = await fetchCatalogFromDb();
    const com = commodities.find((c) => c.id === body.commodityId || c.slug === body.commodityId);
    const mkt = markets.find((m) => m.id === body.marketId || m.slug === body.marketId);

    const hapPrice = com?.hapHetPrice || reportedPrice;
    const cityAvg = (mkt && com && dailyPrices[`${mkt.id}_${com.id}`]?.price) || hapPrice;
    const norm = Number(body.normalizedPrice || reportedPrice);
    const diffPercent = cityAvg > 0 ? Math.round(((norm - cityAvg) / cityAvg) * 1000) / 10 : 0;
    const isAnomaly = Math.abs(diffPercent) > 25;
    const reportId = `REP-${Date.now().toString().slice(-6)}`;

    const newReport: AdminReport = {
      id: reportId,
      commodityName: com?.name || body.commodityId,
      marketName: mkt?.name || body.marketId,
      reportedPrice,
      unit: body.unit || '1 kg',
      normalizedPricePerKg: norm,
      officialHapPrice: hapPrice,
      cityAvgPrice: cityAvg,
      diffPercent,
      submittedAt: 'Baru saja',
      hasPhoto: Boolean(body.hasPhoto),
      citizenNotes: body.notes?.trim() || undefined,
      status: isAnomaly ? 'ANOMALY' : 'PENDING',
      anomalyReason: isAnomaly
        ? `Deviasi ${diffPercent > 0 ? '+' : ''}${diffPercent}% melampaui ambang toleransi MAD (25%).`
        : undefined,
      exifSanitized: true,
    };

    await insertReportDb(newReport);

    return NextResponse.json({
      success: true,
      message: 'Laporan warga tersimpan di Supabase untuk moderasi admin.',
      data: {
        reportId,
        status: newReport.status,
        commodityName: newReport.commodityName,
        marketName: newReport.marketName,
        normalizedPrice: norm,
        submittedAt: new Date().toISOString(),
        reportRecord: newReport,
        message: 'Terima kasih atas laporanmu! Data tersimpan di antrean moderasi Supabase.',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Gagal menyimpan laporan warga.',
      },
      { status: 500 }
    );
  }
}

