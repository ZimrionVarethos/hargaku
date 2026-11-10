import { getPgPool } from './db';
import {
  INITIAL_COMMODITIES,
  INITIAL_MARKETS,
  INITIAL_DAILY_PRICES,
  INITIAL_ADMIN_REPORTS,
} from '@/lib/store/admin-seed';

export async function resetDefaultDataDb() {
  const pool = getPgPool();
  if (!pool) {
    throw new Error('DATABASE_URL is not configured.');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE daily_prices, citizen_reports, commodities, markets');

    if (INITIAL_COMMODITIES.length > 0) {
      await client.query(
        `INSERT INTO commodities (id, name, slug, category, unit, hap_het_price, tolerance_percentage, image_url, is_active)
         SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::int[], $7::int[], $8::text[], $9::boolean[])`,
        [
          INITIAL_COMMODITIES.map((c) => c.id),
          INITIAL_COMMODITIES.map((c) => c.name),
          INITIAL_COMMODITIES.map((c) => c.slug),
          INITIAL_COMMODITIES.map((c) => c.category),
          INITIAL_COMMODITIES.map((c) => c.unit),
          INITIAL_COMMODITIES.map((c) => Math.round(c.hapHetPrice)),
          INITIAL_COMMODITIES.map((c) => Math.round(c.tolerancePercentage)),
          INITIAL_COMMODITIES.map((c) => c.imageUrl || null),
          INITIAL_COMMODITIES.map((c) => c.isActive),
        ]
      );
    }

    if (INITIAL_MARKETS.length > 0) {
      await client.query(
        `INSERT INTO markets (id, region_id, name, slug, city, district, address, latitude, longitude, operating_hours, specialty, is_active)
         SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::double precision[], $9::double precision[], $10::text[], $11::text[], $12::boolean[])`,
        [
          INITIAL_MARKETS.map((m) => m.id),
          INITIAL_MARKETS.map((m) => m.regionId || 'reg_jabar'),
          INITIAL_MARKETS.map((m) => m.name),
          INITIAL_MARKETS.map((m) => m.slug),
          INITIAL_MARKETS.map((m) => m.city),
          INITIAL_MARKETS.map((m) => m.district),
          INITIAL_MARKETS.map((m) => m.address),
          INITIAL_MARKETS.map((m) => m.latitude),
          INITIAL_MARKETS.map((m) => m.longitude),
          INITIAL_MARKETS.map((m) => m.operatingHours),
          INITIAL_MARKETS.map((m) => m.specialty),
          INITIAL_MARKETS.map((m) => m.isActive),
        ]
      );
    }

    const dailyList = Object.values(INITIAL_DAILY_PRICES);
    if (dailyList.length > 0) {
      await client.query(
        `INSERT INTO daily_prices (market_id, commodity_id, price, previous_price, recorded_date, source_type)
         SELECT u.m_id, u.c_id, u.price, u.prev_price, u.rec_date, 'PIHPS_BI'
         FROM UNNEST($1::text[], $2::text[], $3::int[], $4::int[], $5::text[]) AS u(m_id, c_id, price, prev_price, rec_date)`,
        [
          dailyList.map((d) => d.marketId),
          dailyList.map((d) => d.commodityId),
          dailyList.map((d) => Math.round(d.price)),
          dailyList.map((d) => (d.previousPrice !== undefined ? Math.round(d.previousPrice) : null)),
          dailyList.map((d) => d.recordedDate),
        ]
      );
    }

    if (INITIAL_ADMIN_REPORTS.length > 0) {
      await client.query(
        `INSERT INTO citizen_reports (id, commodity_name, market_name, reported_price, unit, normalized_price_per_kg, official_hap_price, city_avg_price, diff_percent, submitted_at, has_photo, photo_url, citizen_notes, status, anomaly_reason, exif_sanitized)
         SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::int[], $5::text[], $6::int[], $7::int[], $8::int[], $9::double precision[], $10::text[], $11::boolean[], $12::text[], $13::text[], $14::text[], $15::text[], $16::boolean[])`,
        [
          INITIAL_ADMIN_REPORTS.map((r) => r.id),
          INITIAL_ADMIN_REPORTS.map((r) => r.commodityName),
          INITIAL_ADMIN_REPORTS.map((r) => r.marketName),
          INITIAL_ADMIN_REPORTS.map((r) => Math.round(r.reportedPrice)),
          INITIAL_ADMIN_REPORTS.map((r) => r.unit),
          INITIAL_ADMIN_REPORTS.map((r) => Math.round(r.normalizedPricePerKg)),
          INITIAL_ADMIN_REPORTS.map((r) => Math.round(r.officialHapPrice)),
          INITIAL_ADMIN_REPORTS.map((r) => Math.round(r.cityAvgPrice)),
          INITIAL_ADMIN_REPORTS.map((r) => r.diffPercent),
          INITIAL_ADMIN_REPORTS.map((r) => r.submittedAt),
          INITIAL_ADMIN_REPORTS.map((r) => r.hasPhoto),
          INITIAL_ADMIN_REPORTS.map((r) => r.photoUrl || null),
          INITIAL_ADMIN_REPORTS.map((r) => r.citizenNotes || null),
          INITIAL_ADMIN_REPORTS.map((r) => r.status),
          INITIAL_ADMIN_REPORTS.map((r) => r.anomalyReason || null),
          INITIAL_ADMIN_REPORTS.map((r) => r.exifSanitized),
        ]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

