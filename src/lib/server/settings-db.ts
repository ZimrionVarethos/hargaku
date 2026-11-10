import { dbQuery } from './db';

export interface AiPublicSettings {
  hasApiKey: boolean;
  maskedApiKey: string;
  hasMapboxToken: boolean;
  maskedMapboxToken: string;
  geminiModel: string;
  systemInstruction: string;
  enabledSources: string[];
  dbConnected: boolean;
  updatedAt: string | null;
}

export interface AiRuntimeConfig extends AiPublicSettings {
  apiKey: string | null;
  mapboxToken: string | null;
}

export interface PublicMapConfig {
  mapboxToken: string;
  source: 'supabase-db' | 'env-fallback' | 'unconfigured';
}

const DEFAULT_MODEL = 'gemini-3.8-flash';
const DEFAULT_SOURCES = [
  'PIHPS Bank Indonesia',
  'Panel Harga Bapanas',
  'Perumda PPJ Kota Bogor',
  'Laporan Warga Terverifikasi',
];
const DEFAULT_INSTRUCTION =
  'Kamu adalah PUNTEN, Asisten HargaKu yang ramah, cerdas, dan jujur. Bandingkan harga lintas sumber (HAP/HET Bapanas, PIHPS BI, Pasar Rakyat/Perumda PPJ, dan Laporan Warga), rekomendasikan patokan paling hemat, serta jawab pertanyaan pengguna dengan format Markdown yang rapi (gunakan heading, poin, penebalan angka, dan tabel Markdown jika membandingkan sumber).';

interface SettingRow {
  key: string;
  value: string;
  updated_at: string;
}

export function maskSecretValue(raw: string | null | undefined): string {
  if (!raw || !raw.trim()) return '';
  const trimmed = raw.trim();
  if (trimmed.length <= 10) return `${trimmed.slice(0, 2)}****${trimmed.slice(-2)}`;
  return `${trimmed.slice(0, 6)}......${trimmed.slice(-4)}`;
}

export async function getAiRuntimeConfig(): Promise<AiRuntimeConfig> {
  try {
    const res = await dbQuery<SettingRow>(
      `SELECT key, value, updated_at::text
       FROM system_settings
       WHERE key IN ('gemini_api_key', 'gemini_model', 'ai_system_instruction', 'price_sources_config', 'mapbox_access_token')`
    );

    const map = new Map<string, { value: string; updatedAt: string }>();
    for (const row of res.rows) {
      map.set(row.key, { value: row.value, updatedAt: row.updated_at });
    }

    const dbKey = map.get('gemini_api_key')?.value?.trim() || null;
    const envKey = process.env.GEMINI_API_KEY?.trim() || null;
    const activeKey = dbKey || envKey;

    const dbMapbox = map.get('mapbox_access_token')?.value?.trim() || null;
    const envMapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() || null;
    const activeMapbox = dbMapbox || envMapbox;

    let enabledSources = DEFAULT_SOURCES;
    const rawSources = map.get('price_sources_config')?.value;
    if (rawSources) {
      try {
        const parsed = JSON.parse(rawSources) as unknown;
        if (Array.isArray(parsed)) {
          enabledSources = parsed.filter((s): s is string => typeof s === 'string');
        }
      } catch {
        // Fallback silently to default source list
      }
    }

    const rawInstruction = map.get('ai_system_instruction')?.value?.trim();
    const normalizedInstruction = rawInstruction
      ? rawInstruction.replace(/\bRin\b/g, 'PUNTEN')
      : DEFAULT_INSTRUCTION;

    const latestUpdated =
      map.get('mapbox_access_token')?.updatedAt ||
      map.get('gemini_api_key')?.updatedAt ||
      map.get('gemini_model')?.updatedAt ||
      map.get('ai_system_instruction')?.updatedAt ||
      null;

    return {
      apiKey: activeKey,
      hasApiKey: Boolean(activeKey),
      maskedApiKey: maskSecretValue(activeKey),
      mapboxToken: activeMapbox,
      hasMapboxToken: Boolean(activeMapbox),
      maskedMapboxToken: maskSecretValue(activeMapbox),
      geminiModel: map.get('gemini_model')?.value?.trim() || DEFAULT_MODEL,
      systemInstruction: normalizedInstruction,
      enabledSources,
      dbConnected: true,
      updatedAt: latestUpdated,
    };
  } catch {
    const envKey = process.env.GEMINI_API_KEY?.trim() || null;
    const envMapbox = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() || null;
    return {
      apiKey: envKey,
      hasApiKey: Boolean(envKey),
      maskedApiKey: maskSecretValue(envKey),
      mapboxToken: envMapbox,
      hasMapboxToken: Boolean(envMapbox),
      maskedMapboxToken: maskSecretValue(envMapbox),
      geminiModel: DEFAULT_MODEL,
      systemInstruction: DEFAULT_INSTRUCTION,
      enabledSources: DEFAULT_SOURCES,
      dbConnected: false,
      updatedAt: null,
    };
  }
}

export async function getPublicMapConfig(): Promise<PublicMapConfig> {
  try {
    const res = await dbQuery<SettingRow>(
      `SELECT key, value, updated_at::text FROM system_settings WHERE key = 'mapbox_access_token' LIMIT 1`
    );
    const dbToken = res.rows[0]?.value?.trim();
    if (dbToken) {
      return { mapboxToken: dbToken, source: 'supabase-db' };
    }
  } catch {
    // Fallback to optional env if DB is momentarily unavailable
  }

  const envToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
  if (envToken) {
    return { mapboxToken: envToken, source: 'env-fallback' };
  }

  return { mapboxToken: '', source: 'unconfigured' };
}

export async function getPublicAiSettings(): Promise<AiPublicSettings> {
  const cfg = await getAiRuntimeConfig();
  return {
    hasApiKey: cfg.hasApiKey,
    maskedApiKey: cfg.maskedApiKey,
    hasMapboxToken: cfg.hasMapboxToken,
    maskedMapboxToken: cfg.maskedMapboxToken,
    geminiModel: cfg.geminiModel,
    systemInstruction: cfg.systemInstruction,
    enabledSources: cfg.enabledSources,
    dbConnected: cfg.dbConnected,
    updatedAt: cfg.updatedAt,
  };
}

export async function saveAiSettings(input: {
  geminiApiKey?: string;
  mapboxAccessToken?: string;
  geminiModel?: string;
  systemInstruction?: string;
  enabledSources?: string[];
}): Promise<AiPublicSettings> {
  if (input.geminiApiKey && input.geminiApiKey.trim().length > 8) {
    await dbQuery(
      `INSERT INTO system_settings (key, value, description, is_secret, updated_at)
       VALUES ('gemini_api_key', $1, 'API Key Google Gemini dinamis via Admin Dashboard', true, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, is_secret = true, updated_at = NOW()`,
      [input.geminiApiKey.trim()]
    );
  }

  if (input.mapboxAccessToken && input.mapboxAccessToken.trim().length > 8) {
    await dbQuery(
      `INSERT INTO system_settings (key, value, description, is_secret, updated_at)
       VALUES ('mapbox_access_token', $1, 'Token publik Mapbox GL JS untuk Peta 3D 13 Unit Pasar', false, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [input.mapboxAccessToken.trim()]
    );
  }

  if (input.geminiModel && input.geminiModel.trim()) {
    await dbQuery(
      `INSERT INTO system_settings (key, value, description, is_secret, updated_at)
       VALUES ('gemini_model', $1, 'Model Gemini aktif', false, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [input.geminiModel.trim()]
    );
  }

  if (input.systemInstruction && input.systemInstruction.trim()) {
    await dbQuery(
      `INSERT INTO system_settings (key, value, description, is_secret, updated_at)
       VALUES ('ai_system_instruction', $1, 'Instruksi sistem asisten AI HargaKu', false, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [input.systemInstruction.trim()]
    );
  }

  if (Array.isArray(input.enabledSources) && input.enabledSources.length > 0) {
    await dbQuery(
      `INSERT INTO system_settings (key, value, description, is_secret, updated_at)
       VALUES ('price_sources_config', $1, 'Sumber pembanding harga AI', false, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [JSON.stringify(input.enabledSources)]
    );
  }

  return getPublicAiSettings();
}

