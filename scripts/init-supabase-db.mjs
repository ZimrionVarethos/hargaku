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

  for (const c of INITIAL_COMMODITIES) {
    await client.query(
      `INSERT INTO commodities (id, name, slug, category, unit, hap_het_price, tolerance_percentage, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name, c.slug, c.category, c.unit, c.hapHetPrice, c.tolerancePercentage, c.imageUrl || null, c.isActive]
    );
  }
  console.log(`Seeded check for ${INITIAL_COMMODITIES.length} commodities`);

  for (const m of INITIAL_MARKETS) {
    await client.query(
      `INSERT INTO markets (id, region_id, name, slug, city, district, address, latitude, longitude, operating_hours, specialty, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO NOTHING`,
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
  console.log(`Seeded check for ${INITIAL_MARKETS.length} markets`);

  const entries = Object.values(INITIAL_DAILY_PRICES);
  for (const d of entries) {
    await client.query(
      `INSERT INTO daily_prices (market_id, commodity_id, price, previous_price, recorded_date, source_type)
       VALUES ($1, $2, $3, $4, $5, 'PIHPS_BI')
       ON CONFLICT (market_id, commodity_id) DO NOTHING`,
      [d.marketId, d.commodityId, d.price, d.previousPrice || null, d.recordedDate]
    );
  }
  console.log(`Seeded check for ${entries.length} daily_prices`);

  for (const r of INITIAL_ADMIN_REPORTS) {
    await client.query(
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
      'Kamu adalah Rin, Asisten HargaKu yang ramah, cerdas, dan jujur. Tugasmu membantu warga membandingkan harga pangan dari berbagai sumber resmi (HAP Bapanas, PIHPS BI, Perumda PPJ, dan Laporan Warga), menjawab pertanyaan kewajaran harga di lapak dengan format Markdown rapi (tabel perbandingan dan poin singkat), serta memberi rekomendasi paling hemat tanpa menyarankan fitur keranjang belanja.',
      'Instruksi sistem dasar untuk Rin AI Rekomendasi HargaKu',
      false,
    ],
    [
      'price_sources_config',
      JSON.stringify(['PIHPS Bank Indonesia', 'Panel Harga Bapanas', 'Perumda PPJ Kota Bogor', 'Laporan Warga Terverifikasi']),
      'Daftar sumber data pembanding yang dianalisis AI',
      false,
    ],
  ];

  for (const [k, v, desc, sec] of defaultSettings) {
    await client.query(
      `INSERT INTO system_settings (key, value, description, is_secret)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO NOTHING`,
      [k, v, desc, sec]
    );
  }

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

  await client.end();
  console.log('Supabase DB bootstrap finished cleanly!');
}

main().catch((err) => {
  console.error('Supabase bootstrap failed:', err);
  process.exit(1);
});
