
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  province TEXT,
  island TEXT NOT NULL,
  island_name TEXT NOT NULL,
  zone TEXT NOT NULL DEFAULT 'ZONA_1',
  logistics_cost_pct INTEGER NOT NULL DEFAULT 0,
  disparity_index DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  phase INTEGER NOT NULL DEFAULT 4,
  phase_label TEXT NOT NULL DEFAULT 'Fase 4 · Nasional',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
  near_station BOOLEAN NOT NULL DEFAULT false,
  landmark_note TEXT,
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
  commodity_id TEXT,
  commodity_name TEXT NOT NULL,
  market_id TEXT,
  market_name TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'PRICE',
  reporter_role TEXT NOT NULL DEFAULT 'WARGA',
  quantity DOUBLE PRECISION NOT NULL DEFAULT 1,
  reported_price INTEGER NOT NULL,
  unit TEXT NOT NULL,
  normalized_price_per_kg INTEGER NOT NULL,
  official_hap_price INTEGER NOT NULL,
  city_avg_price INTEGER NOT NULL,
  diff_percent DOUBLE PRECISION NOT NULL,
  stock_status TEXT,
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

ALTER TABLE markets ADD COLUMN IF NOT EXISTS near_station BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS landmark_note TEXT;

ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS commodity_id TEXT;
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS market_id TEXT;
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS report_type TEXT NOT NULL DEFAULT 'PRICE';
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS reporter_role TEXT NOT NULL DEFAULT 'WARGA';
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS quantity DOUBLE PRECISION NOT NULL DEFAULT 1;
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS stock_status TEXT;

CREATE INDEX IF NOT EXISTS idx_daily_prices_commodity ON daily_prices(commodity_id);
CREATE INDEX IF NOT EXISTS idx_daily_prices_market ON daily_prices(market_id);
CREATE INDEX IF NOT EXISTS idx_markets_region ON markets(region_id);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_status ON citizen_reports(status);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_market_status ON citizen_reports(market_id, status, report_type);

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_regions" ON regions;
CREATE POLICY "public_read_regions" ON regions FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_commodities" ON commodities;
CREATE POLICY "public_read_commodities" ON commodities FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_markets" ON markets;
CREATE POLICY "public_read_markets" ON markets FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_daily_prices" ON daily_prices;
CREATE POLICY "public_read_daily_prices" ON daily_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_approved_reports" ON citizen_reports;
CREATE POLICY "public_read_approved_reports" ON citizen_reports FOR SELECT USING (status = 'APPROVED');
