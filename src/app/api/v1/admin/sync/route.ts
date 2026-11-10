import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdminRequest } from '@/lib/server/admin-session';
import {
  upsertCommodityDb,
  deleteCommodityDb,
  upsertMarketDb,
  deleteMarketDb,
  upsertDailyPricesDb,
  insertReportDb,
  updateReportStatusDb,
  appendReportNoteDb,
  resetDefaultDataDb,
} from '@/lib/server/admin-db';
import type { AdminAction, AdminCommodity, AdminMarket } from '@/lib/types/admin';

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ success: false, message: 'Otorisasi admin diperlukan.' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      action: AdminAction;
      mergedCommodity?: AdminCommodity;
      mergedMarket?: AdminMarket;
    };
    const { action, mergedCommodity, mergedMarket } = body;

    switch (action.type) {
      case 'ADD_COMMODITY':
        await upsertCommodityDb(action.payload);
        break;
      case 'UPDATE_COMMODITY':
        if (mergedCommodity) await upsertCommodityDb(mergedCommodity);
        break;
      case 'DELETE_COMMODITY':
        await deleteCommodityDb(action.payload);
        break;
      case 'ADD_MARKET':
        await upsertMarketDb(action.payload);
        break;
      case 'UPDATE_MARKET':
        if (mergedMarket) await upsertMarketDb(mergedMarket);
        break;
      case 'DELETE_MARKET':
        await deleteMarketDb(action.payload);
        break;
      case 'UPDATE_DAILY_PRICES':
        await upsertDailyPricesDb(
          action.payload.marketId,
          action.payload.recordedDate,
          action.payload.entries
        );
        break;
      case 'ADD_REPORT':
        await insertReportDb(action.payload);
        break;
      case 'APPROVE_REPORT':
        await updateReportStatusDb(action.payload, 'APPROVED');
        break;
      case 'REJECT_REPORT':
        await updateReportStatusDb(action.payload.id, 'REJECTED', action.payload.reason);
        break;
      case 'REQUEST_REPORT_INFO':
        await appendReportNoteDb(action.payload.id, action.payload.note);
        break;
      case 'RESET_DEFAULT':
        await resetDefaultDataDb();
        break;
      default:
        break;
    }

    return NextResponse.json({
      success: true,
      message: 'Perubahan admin tersinkron ke Supabase PostgreSQL.',
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Gagal menyinkronkan ke database Supabase.',
      },
      { status: 500 }
    );
  }
}

