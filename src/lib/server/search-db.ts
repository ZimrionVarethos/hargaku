import { dbQuery, getPgPool } from './db';
import { escapeSqlLike, expandSearchTokenGroups } from '../search/search-security';
import { mapAdminCategoryToPublic } from '../utils';
import type { CommoditySummary, Market } from '@/types';

interface DbCommoditySearchRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  unit: string;
  hap_het_price: number;
  avg_price: number;
  prev_price: number;
}

interface DbMarketSearchRow {
  id: string;
  region_id: string;
  name: string;
  slug: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  near_station: boolean | null;
  landmark_note: string | null;
  is_active: boolean;
}

export async function queryPublicSearchCatalogFromDb(sanitizedQuery: string): Promise<{
  commodities: CommoditySummary[];
  markets: Market[];
} | null> {
  if (!getPgPool()) return null;

  const groups = expandSearchTokenGroups(sanitizedQuery);
  const patternSet = new Set<string>();
  for (const g of groups) {
    for (const v of g) {
      if (v.length >= 2) patternSet.add(`%${escapeSqlLike(v)}%`);
    }
  }
  const patterns = Array.from(patternSet).slice(0, 16);

  if (patterns.length === 0) {
    const [comRes, mktRes] = await Promise.all([
      dbQuery<DbCommoditySearchRow>(
        `SELECT c.id, c.name, c.slug, c.category, c.unit, c.hap_het_price,
                COALESCE(ROUND(AVG(NULLIF(dp.price, 0))), c.hap_het_price)::int AS avg_price,
                COALESCE(ROUND(AVG(NULLIF(dp.previous_price, 0))), c.hap_het_price)::int AS prev_price
         FROM commodities c
         LEFT JOIN daily_prices dp ON dp.commodity_id = c.id
         WHERE c.is_active = true
         GROUP BY c.id
         ORDER BY c.name ASC
         LIMIT 50`
      ),
      dbQuery<DbMarketSearchRow>(
        `SELECT id, region_id, name, slug, city, district, latitude, longitude, near_station, landmark_note, is_active
         FROM markets
         WHERE is_active = true
         ORDER BY near_station DESC, name ASC
         LIMIT 60`
      ),
    ]);
    return {
      commodities: comRes.rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: mapAdminCategoryToPublic(r.category),
        unit: r.unit,
        imageUrl: '/images/commodities/default.png',
        currentAvgPrice: Number(r.avg_price),
        previousAvgPrice: Number(r.prev_price),
        changePercentage: 0,
        hapHetPrice: Number(r.hap_het_price),
        statusVsHap: 'EQUAL_HAP',
        lastUpdated: '06:00 WIB',
      })),
      markets: mktRes.rows.map((m) => ({
        id: m.id,
        regionId: m.region_id,
        name: m.name,
        slug: m.slug,
        city: m.city,
        district: m.district,
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
        nearStation: Boolean(m.near_station),
        landmarkNote: m.landmark_note || undefined,
        isActive: m.is_active,
      })),
    };
  }

  const [comRes, mktRes] = await Promise.all([
    dbQuery<DbCommoditySearchRow>(
      `SELECT c.id, c.name, c.slug, c.category, c.unit, c.hap_het_price,
              COALESCE(ROUND(AVG(NULLIF(dp.price, 0))), c.hap_het_price)::int AS avg_price,
              COALESCE(ROUND(AVG(NULLIF(dp.previous_price, 0))), c.hap_het_price)::int AS prev_price
       FROM commodities c
       LEFT JOIN daily_prices dp ON dp.commodity_id = c.id
       WHERE c.is_active = true
         AND (c.name ILIKE ANY($1::text[]) ESCAPE '\\' OR c.category ILIKE ANY($1::text[]) ESCAPE '\\')
       GROUP BY c.id
       ORDER BY c.name ASC
       LIMIT 50`,
      [patterns]
    ),
    dbQuery<DbMarketSearchRow>(
      `SELECT id, region_id, name, slug, city, district, latitude, longitude, near_station, landmark_note, is_active
       FROM markets
       WHERE is_active = true
         AND (
           name ILIKE ANY($1::text[]) ESCAPE '\\'
           OR district ILIKE ANY($1::text[]) ESCAPE '\\'
           OR city ILIKE ANY($1::text[]) ESCAPE '\\'
           OR COALESCE(landmark_note, '') ILIKE ANY($1::text[]) ESCAPE '\\'
         )
       ORDER BY near_station DESC, name ASC
       LIMIT 60`,
      [patterns]
    ),
  ]);

  return {
    commodities: comRes.rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      category: mapAdminCategoryToPublic(r.category),
      unit: r.unit,
      imageUrl: '/images/commodities/default.png',
      currentAvgPrice: Number(r.avg_price),
      previousAvgPrice: Number(r.prev_price),
      changePercentage: 0,
      hapHetPrice: Number(r.hap_het_price),
      statusVsHap: 'EQUAL_HAP',
      lastUpdated: '06:00 WIB',
    })),
    markets: mktRes.rows.map((m) => ({
      id: m.id,
      regionId: m.region_id,
      name: m.name,
      slug: m.slug,
      city: m.city,
      district: m.district,
      latitude: Number(m.latitude),
      longitude: Number(m.longitude),
      nearStation: Boolean(m.near_station),
      landmarkNote: m.landmark_note || undefined,
      isActive: m.is_active,
    })),
  };
}

