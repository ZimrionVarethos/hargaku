import { dbQuery } from './db';
import type {
  AdminCommodity,
  AdminMarket,
  DailyPriceRecord,
  AdminReport,
  CommodityCategory,
} from '@/lib/types/admin';
import {
  INITIAL_COMMODITIES,
  INITIAL_MARKETS,
  INITIAL_DAILY_PRICES,
  INITIAL_ADMIN_REPORTS,
} from '@/lib/store/admin-seed';

interface CommodityRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  unit: string;
  hap_het_price: number;
  tolerance_percentage: number;
  image_url: string | null;
  is_active: boolean;
}

interface MarketRow {
  id: string;
  region_id: string;
  name: string;
  slug: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  operating_hours: string;
  specialty: string;
  is_active: boolean;
}

interface DailyPriceRow {
  market_id: string;
  commodity_id: string;
  price: number;
  previous_price: number | null;
  recorded_date: string;
}

interface ReportRow {
  id: string;
  commodity_name: string;
  market_name: string;
  reported_price: number;
  unit: string;
  normalized_price_per_kg: number;
  official_hap_price: number;
  city_avg_price: number;
  diff_percent: number;
  submitted_at: string;
  has_photo: boolean;
  photo_url: string | null;
  citizen_notes: string | null;
  status: string;
  anomaly_reason: string | null;
  exif_sanitized: boolean;
}

export async function fetchBootstrapFromDb() {
  const [comRes, mktRes, priceRes, repRes] = await Promise.all([
    dbQuery<CommodityRow>('SELECT * FROM commodities ORDER BY name ASC'),
    dbQuery<MarketRow>('SELECT * FROM markets ORDER BY name ASC'),
    dbQuery<DailyPriceRow>('SELECT market_id, commodity_id, price, previous_price, recorded_date FROM daily_prices'),
    dbQuery<ReportRow>('SELECT * FROM citizen_reports ORDER BY created_at DESC LIMIT 100'),
  ]);

  const commodities: AdminCommodity[] = comRes.rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    category: r.category as CommodityCategory,
    unit: r.unit,
    hapHetPrice: Number(r.hap_het_price),
    tolerancePercentage: Number(r.tolerance_percentage),
    imageUrl: r.image_url || undefined,
    isActive: r.is_active,
  }));

  const markets: AdminMarket[] = mktRes.rows.map((r) => ({
    id: r.id,
    regionId: r.region_id,
    name: r.name,
    slug: r.slug,
    city: r.city,
    district: r.district,
    address: r.address,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    operatingHours: r.operating_hours,
    specialty: r.specialty,
    isActive: r.is_active,
  }));

  const dailyPrices: Record<string, DailyPriceRecord> = {};
  for (const p of priceRes.rows) {
    dailyPrices[`${p.market_id}_${p.commodity_id}`] = {
      marketId: p.market_id,
      commodityId: p.commodity_id,
      price: Number(p.price),
      previousPrice: p.previous_price !== null ? Number(p.previous_price) : undefined,
      recordedDate: p.recorded_date,
    };
  }

  const reports: AdminReport[] = repRes.rows.map((r) => ({
    id: r.id,
    commodityName: r.commodity_name,
    marketName: r.market_name,
    reportedPrice: Number(r.reported_price),
    unit: r.unit,
    normalizedPricePerKg: Number(r.normalized_price_per_kg),
    officialHapPrice: Number(r.official_hap_price),
    cityAvgPrice: Number(r.city_avg_price),
    diffPercent: Number(r.diff_percent),
    submittedAt: r.submitted_at,
    hasPhoto: r.has_photo,
    photoUrl: r.photo_url || undefined,
    citizenNotes: r.citizen_notes || undefined,
    status: r.status as AdminReport['status'],
    anomalyReason: r.anomaly_reason || undefined,
    exifSanitized: r.exif_sanitized,
  }));

  return { commodities, markets, dailyPrices, reports };
}

export async function upsertCommodityDb(c: AdminCommodity) {
  await dbQuery(
    `INSERT INTO commodities (id, name, slug, category, unit, hap_het_price, tolerance_percentage, image_url, is_active, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       slug = EXCLUDED.slug,
       category = EXCLUDED.category,
       unit = EXCLUDED.unit,
       hap_het_price = EXCLUDED.hap_het_price,
       tolerance_percentage = EXCLUDED.tolerance_percentage,
       image_url = EXCLUDED.image_url,
       is_active = EXCLUDED.is_active,
       updated_at = NOW()`,
    [c.id, c.name, c.slug, c.category, c.unit, c.hapHetPrice, c.tolerancePercentage, c.imageUrl || null, c.isActive]
  );
}

export async function deleteCommodityDb(id: string) {
  await dbQuery('DELETE FROM daily_prices WHERE commodity_id = $1', [id]);
  await dbQuery('DELETE FROM commodities WHERE id = $1', [id]);
}

export async function upsertMarketDb(m: AdminMarket) {
  await dbQuery(
    `INSERT INTO markets (id, region_id, name, slug, city, district, address, latitude, longitude, operating_hours, specialty, is_active, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
     ON CONFLICT (id) DO UPDATE SET
       region_id = EXCLUDED.region_id,
       name = EXCLUDED.name,
       slug = EXCLUDED.slug,
       city = EXCLUDED.city,
       district = EXCLUDED.district,
       address = EXCLUDED.address,
       latitude = EXCLUDED.latitude,
       longitude = EXCLUDED.longitude,
       operating_hours = EXCLUDED.operating_hours,
       specialty = EXCLUDED.specialty,
       is_active = EXCLUDED.is_active,
       updated_at = NOW()`,
    [
      m.id,
      m.regionId || 'reg_jabar',
      m.name,
      m.slug,
      m.city,
      m.district,
      m.address,
      m.latitude,
      m.longitude,
      m.operatingHours,
      m.specialty,
      m.isActive,
    ]
  );
}

export async function deleteMarketDb(id: string) {
  await dbQuery('DELETE FROM daily_prices WHERE market_id = $1', [id]);
  await dbQuery('DELETE FROM markets WHERE id = $1', [id]);
}

export async function upsertDailyPricesDb(
  marketId: string,
  recordedDate: string,
  entries: Array<{ commodityId: string; price: number }>
) {
  for (const e of entries) {
    await dbQuery(
      `INSERT INTO daily_prices (market_id, commodity_id, price, previous_price, recorded_date, source_type, updated_at)
       VALUES ($1, $2, $3, $3, $4, 'ADMIN_CHECKUP', NOW())
       ON CONFLICT (market_id, commodity_id) DO UPDATE SET
         previous_price = daily_prices.price,
         price = EXCLUDED.price,
         recorded_date = EXCLUDED.recorded_date,
         source_type = 'ADMIN_CHECKUP',
         updated_at = NOW()`,
      [marketId, e.commodityId, e.price, recordedDate]
    );
  }
}

export async function insertReportDb(r: AdminReport) {
  await dbQuery(
    `INSERT INTO citizen_reports (id, commodity_name, market_name, reported_price, unit, normalized_price_per_kg, official_hap_price, city_avg_price, diff_percent, submitted_at, has_photo, photo_url, citizen_notes, status, anomaly_reason, exif_sanitized)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     ON CONFLICT (id) DO NOTHING`,
    [
      r.id,
      r.commodityName,
      r.marketName,
      r.reportedPrice,
      r.unit,
      r.normalizedPricePerKg,
      r.officialHapPrice,
      r.cityAvgPrice,
      r.diffPercent,
      r.submittedAt,
      r.hasPhoto,
      r.photoUrl || null,
      r.citizenNotes || null,
      r.status,
      r.anomalyReason || null,
      r.exifSanitized,
    ]
  );
}

export async function updateReportStatusDb(
  id: string,
  status: AdminReport['status'],
  noteOrReason?: string
) {
  if (status === 'REJECTED') {
    await dbQuery(
      'UPDATE citizen_reports SET status = $2, anomaly_reason = COALESCE($3, anomaly_reason) WHERE id = $1',
      [id, status, noteOrReason || null]
    );
  } else {
    await dbQuery('UPDATE citizen_reports SET status = $2 WHERE id = $1', [id, status]);
  }
}

export async function appendReportNoteDb(id: string, note: string) {
  await dbQuery(
    `UPDATE citizen_reports
     SET citizen_notes = COALESCE(citizen_notes, '') || ' [Moderator: ' || $2 || ']'
     WHERE id = $1`,
    [id, note]
  );
}

export async function resetDefaultDataDb() {
  await dbQuery('TRUNCATE daily_prices, citizen_reports, commodities, markets');
  for (const c of INITIAL_COMMODITIES) await upsertCommodityDb(c);
  for (const m of INITIAL_MARKETS) await upsertMarketDb(m);
  const grouped: Record<string, Array<{ commodityId: string; price: number; date: string }>> = {};
  for (const d of Object.values(INITIAL_DAILY_PRICES)) {
    if (!grouped[d.marketId]) grouped[d.marketId] = [];
    grouped[d.marketId].push({ commodityId: d.commodityId, price: d.price, date: d.recordedDate });
  }
  for (const [mId, list] of Object.entries(grouped)) {
    await upsertDailyPricesDb(mId, list[0]?.date || '2026-10-23', list);
  }
  for (const r of INITIAL_ADMIN_REPORTS) await insertReportDb(r);
}

