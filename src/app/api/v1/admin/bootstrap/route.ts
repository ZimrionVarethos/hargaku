import { NextResponse } from 'next/server';
import { fetchBootstrapFromDb } from '@/lib/server/admin-db';
import { INITIAL_ADMIN_STATE } from '@/lib/store/admin-seed';

export async function GET() {
  try {
    const data = await fetchBootstrapFromDb();
    return NextResponse.json({
      success: true,
      message: 'Data terpusat Supabase berhasil dimuat.',
      data: {
        source: 'supabase',
        commodities: data.commodities.length > 0 ? data.commodities : INITIAL_ADMIN_STATE.commodities,
        markets: data.markets.length > 0 ? data.markets : INITIAL_ADMIN_STATE.markets,
        dailyPrices:
          Object.keys(data.dailyPrices).length > 0 ? data.dailyPrices : INITIAL_ADMIN_STATE.dailyPrices,
        reports: data.reports,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      message: err instanceof Error ? `Fallback aktif: ${err.message}` : 'Fallback aktif.',
      data: {
        source: 'fallback',
        commodities: INITIAL_ADMIN_STATE.commodities,
        markets: INITIAL_ADMIN_STATE.markets,
        dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
        reports: INITIAL_ADMIN_STATE.reports,
      },
    });
  }
}

