-- HargaKu Supabase PostgreSQL Schema & Row-Level Security Policies
-- Apply cleanly via Supavisor Session Pooler or Supabase SQL Editor

CREATE TABLE IF NOT EXISTS commodities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  hap_het_price INTEGER NOT NULL,
  tolerance_percentage INTEGER NOT NULL DEFAULT 10,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS markets (
  id TEXT PRIMARY KEY,
  region_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  operating_hours TEXT NOT NULL DEFAULT '04:00 - 14:00 WIB',
  specialty TEXT NOT NULL DEFAULT 'Sentra Pangan Tradisional',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_prices (
  market_id TEXT NOT NULL,
  commodity_id TEXT NOT NULL,
  price INTEGER NOT NULL,
  previous_price INTEGER,
  recorded_date TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'PIHPS_BI',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (market_id, commodity_id)
);

CREATE TABLE IF NOT EXISTS citizen_reports (
  id TEXT PRIMARY KEY,
  commodity_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  reported_price INTEGER NOT NULL,
  unit TEXT NOT NULL,
  normalized_price_per_kg INTEGER NOT NULL,
  official_hap_price INTEGER NOT NULL,
  city_avg_price INTEGER NOT NULL,
  diff_percent DOUBLE PRECISION NOT NULL,
  submitted_at TEXT NOT NULL,
  has_photo BOOLEAN NOT NULL DEFAULT false,
  photo_url TEXT,
  citizen_notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  anomaly_reason TEXT,
  exif_sanitized BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_prices_commodity ON daily_prices(commodity_id);
CREATE INDEX IF NOT EXISTS idx_daily_prices_market ON daily_prices(market_id);
CREATE INDEX IF NOT EXISTS idx_markets_region ON markets(region_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_status ON citizen_reports(status);

-- Public Read-Only Policies (Anon Key safe for public market transparency)
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_commodities" ON commodities;
CREATE POLICY "public_read_commodities" ON commodities FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_markets" ON markets;
CREATE POLICY "public_read_markets" ON markets FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_daily_prices" ON daily_prices;
CREATE POLICY "public_read_daily_prices" ON daily_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_approved_reports" ON citizen_reports;
CREATE POLICY "public_read_approved_reports" ON citizen_reports FOR SELECT USING (status = 'APPROVED');

-- system_settings deliberately has ZERO anon policies so secrets never leak via PostgREST

