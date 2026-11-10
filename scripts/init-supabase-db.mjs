import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import {
  INITIAL_COMMODITIES,
  INITIAL_MARKETS,
  INITIAL_DAILY_PRICES,
  INITIAL_ADMIN_REPORTS,
} from '../src/lib/store/admin-seed.ts';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is missing in .env.local');
  process.exit(1);
}

const cleanDbUrl = dbUrl.replace(/([?&])sslmode=[^&]+&?/, '$1').replace(/[?&]$/, '');

const client = new Client({
  connectionString: cleanDbUrl,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  const schemaSql = fs.readFileSync(path.join(process.cwd(), 'supabase/schema.sql'), 'utf8');
  await client.query(schemaSql);
  console.log('Applied supabase/schema.sql');

  await client.query(
    `INSERT INTO commodities (id, name, slug, category, unit, hap_het_price, tolerance_percentage, image_url, is_active)
     SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::int[], $7::int[], $8::text[], $9::boolean[])
     ON CONFLICT (id) DO NOTHING`,
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
  console.log(`Seeded check for ${INITIAL_COMMODITIES.length} commodities`);

  await client.query(
    `INSERT INTO markets (id, region_id, name, slug, city, district, address, latitude, longitude, operating_hours, specialty, is_active)
     SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::double precision[], $9::double precision[], $10::text[], $11::text[], $12::boolean[])
     ON CONFLICT (id) DO NOTHING`,
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
  console.log(`Seeded check for ${INITIAL_MARKETS.length} markets`);

  const entries = Object.values(INITIAL_DAILY_PRICES);
  await client.query(
    `INSERT INTO daily_prices (market_id, commodity_id, price, previous_price, recorded_date, source_type)
     SELECT u.m_id, u.c_id, u.price, u.prev_price, u.rec_date, 'PIHPS_BI'
     FROM UNNEST($1::text[], $2::text[], $3::int[], $4::int[], $5::text[]) AS u(m_id, c_id, price, prev_price, rec_date)
     ON CONFLICT (market_id, commodity_id) DO NOTHING`,
    [
      entries.map((d) => d.marketId),
      entries.map((d) => d.commodityId),
      entries.map((d) => Math.round(d.price)),
      entries.map((d) => (d.previousPrice ? Math.round(d.previousPrice) : null)),
      entries.map((d) => d.recordedDate),
    ]
  );
  console.log(`Seeded check for ${entries.length} daily_prices`);

  await client.query(
    `INSERT INTO citizen_reports (id, commodity_name, market_name, reported_price, unit, normalized_price_per_kg, official_hap_price, city_avg_price, diff_percent, submitted_at, has_photo, photo_url, citizen_notes, status, anomaly_reason, exif_sanitized)
     SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::int[], $5::text[], $6::int[], $7::int[], $8::int[], $9::double precision[], $10::text[], $11::boolean[], $12::text[], $13::text[], $14::text[], $15::text[], $16::boolean[])
     ON CONFLICT (id) DO NOTHING`,
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
  console.log(`Seeded check for ${INITIAL_ADMIN_REPORTS.length} citizen_reports`);

  const defaultSettings = [
    [
      'gemini_model',
      'gemini-3.8-flash',
      'Model Google Gemini aktif untuk fitur rekomendasi dan tanya jawab harga',
      false,
    ],
    [
      'ai_system_instruction',
      'Kamu adalah PUNTEN, Asisten HargaKu yang ramah, cerdas, dan jujur. Tugasmu membantu warga membandingkan harga pangan dari berbagai sumber resmi (HAP Bapanas, PIHPS BI, Perumda PPJ, dan Laporan Warga), menjawab pertanyaan kewajaran harga di lapak dengan format Markdown rapi (tabel perbandingan dan poin singkat), serta memberi rekomendasi paling hemat tanpa menyarankan fitur keranjang belanja.',
      'Instruksi sistem dasar untuk PUNTEN AI Rekomendasi HargaKu',
      false,
    ],
    [
      'price_sources_config',
      JSON.stringify(['PIHPS Bank Indonesia', 'Panel Harga Bapanas', 'Perumda PPJ Kota Bogor', 'Laporan Warga Terverifikasi']),
      'Daftar sumber data pembanding yang dianalisis AI',
      false,
    ],
  ];

  await client.query(
    `INSERT INTO system_settings (key, value, description, is_secret)
     SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[], $4::boolean[])
     ON CONFLICT (key) DO NOTHING`,
    [
      defaultSettings.map((s) => s[0]),
      defaultSettings.map((s) => s[1]),
      defaultSettings.map((s) => s[2]),
      defaultSettings.map((s) => Boolean(s[3])),
    ]
  );

  await client.query(
    `UPDATE system_settings
     SET value = REPLACE(value, 'Rin', 'PUNTEN'),
         description = 'Instruksi sistem dasar untuk PUNTEN AI Rekomendasi HargaKu',
         updated_at = NOW()
     WHERE key = 'ai_system_instruction' AND value LIKE '%Rin%'`
  );

  const seedKey = process.env.SEED_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (seedKey && seedKey.trim()) {
    await client.query(
      `INSERT INTO system_settings (key, value, description, is_secret, updated_at)
       VALUES ('gemini_api_key', $1, 'API Key Google Gemini dinamis yang dikelola lewat Admin Console', true, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, is_secret = true, updated_at = NOW()`,
      [seedKey.trim()]
    );
    console.log('Stored dynamic gemini_api_key into system_settings table securely.');
  }

  const seedMapbox = process.env.SEED_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (seedMapbox && seedMapbox.trim()) {
    await client.query(
      `INSERT INTO system_settings (key, value, description, is_secret, updated_at)
       VALUES ('mapbox_access_token', $1, 'Token publik Mapbox GL JS untuk Peta 3D 13 Unit Pasar', false, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [seedMapbox.trim()]
    );
    console.log('Stored dynamic mapbox_access_token into system_settings table securely.');
  }

  await client.end();
  console.log('Supabase DB bootstrap finished cleanly!');
}

main().catch((err) => {
  console.error('Supabase bootstrap failed:', err);
  process.exit(1);
});
