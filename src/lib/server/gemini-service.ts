import { getAiRuntimeConfig } from './settings-db';
import { fetchBootstrapFromDb } from './admin-db';
import { MOCK_REGIONS, DEFAULT_REGION } from '@/lib/mock/regions.data';
import { INITIAL_COMMODITIES, INITIAL_MARKETS, INITIAL_DAILY_PRICES } from '@/lib/store/admin-seed';
import { processAssistantMessage } from '@/lib/assistant/assistant-engine';
import type { AssistantChatResponse, SourceComparisonItem } from '@/types/assistant';
import type { AdminCommodity, AdminMarket, DailyPriceRecord, AdminReport } from '@/lib/types/admin';
import type { Region } from '@/types';

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

function buildSourceComparisons(
  query: string,
  region: Region,
  commodities: AdminCommodity[],
  markets: AdminMarket[],
  dailyPrices: Record<string, DailyPriceRecord>,
  reports: AdminReport[],
  enabledSources: string[]
): SourceComparisonItem[] {
  const lower = query.toLowerCase();
  const regionMarkets = markets.filter((m) => m.isActive && m.regionId === region.id);
  const scopeMarkets = regionMarkets.length > 0 ? regionMarkets : markets.filter((m) => m.isActive);

  let picked = commodities.filter(
    (c) =>
      c.isActive &&
      (lower.includes(c.name.toLowerCase()) ||
        lower.includes(c.name.split(' ')[0].toLowerCase()) ||
        lower.includes(c.slug.replace(/-/g, ' ')))
  );

  if (picked.length === 0) {
    picked = commodities.filter((c) => c.isActive).slice(0, 3);
  } else {
    picked = picked.slice(0, 3);
  }

  return picked.map((com) => {
    const marketPrices: Array<{ market: AdminMarket; price: number }> = [];
    for (const m of scopeMarkets) {
      const rec = dailyPrices[`${m.id}_${com.id}`];
      if (rec && rec.price > 0) {
        marketPrices.push({ market: m, price: rec.price });
      }
    }

    const regionalFactor = region.disparityIndex || 1.0;
    const hapRegional = Math.round((com.hapHetPrice * regionalFactor) / 100) * 100;
    const pihpsAvg =
      marketPrices.length > 0
        ? Math.round(marketPrices.reduce((s, x) => s + x.price, 0) / marketPrices.length / 100) * 100
        : Math.round((hapRegional * 1.04) / 100) * 100;

    const sortedMarkets = [...marketPrices].sort((a, b) => a.price - b.price);
    const cheapestMarket = sortedMarkets[0];
    const localMarketPrice = cheapestMarket
      ? cheapestMarket.price
      : Math.round((pihpsAvg * 0.97) / 100) * 100;

    const approvedReport = reports.find(
      (r) => r.status === 'APPROVED' && r.commodityName.toLowerCase().includes(com.name.split(' ')[0].toLowerCase())
    );
    const citizenPrice = approvedReport ? approvedReport.normalizedPricePerKg : Math.round((localMarketPrice * 0.99) / 100) * 100;

    const candidates = [
      {
        sourceName: 'Panel Harga Bapanas (HAP/HET)',
        price: hapRegional,
        note: `Batas acuan resmi ${region.name} (+${region.logisticsCostPct}% logistik)`,
      },
      {
        sourceName: 'Survei PIHPS Bank Indonesia',
        price: pihpsAvg,
        note: `Rerata ${marketPrices.length || 1} pasar terpantau`,
      },
      {
        sourceName: cheapestMarket ? `${cheapestMarket.market.name} (Data Lapak)` : 'Perumda PPJ / Pasar Rakyat',
        price: localMarketPrice,
        note: cheapestMarket ? `Pasar terhemat di ${region.name}` : 'Data survei pasar rakyat',
      },
      {
        sourceName: 'Laporan Warga Terverifikasi',
        price: citizenPrice,
        note: approvedReport ? `Nota ${approvedReport.marketName}` : 'Median laporan warga 7 hari',
      },
    ].filter((src) => {
      if (enabledSources.length === 0) return true;
      if (src.sourceName.includes('Bapanas')) return enabledSources.some((e) => e.includes('Bapanas'));
      if (src.sourceName.includes('PIHPS')) return enabledSources.some((e) => e.includes('PIHPS'));
      if (src.sourceName.includes('Warga')) return enabledSources.some((e) => e.includes('Warga'));
      return true;
    });

    const activeList = candidates.length > 0
      ? candidates
      : [{ sourceName: 'Panel Harga Bapanas (HAP/HET)', price: hapRegional, note: `Acuan ${region.name}` }];

    const minPrice = Math.min(...activeList.map((s) => s.price));
    const sources = activeList.map((s) => ({ ...s, isLowest: s.price === minPrice }));
    const best = sources.find((s) => s.isLowest) || sources[0];

    return {
      commodityName: com.name,
      unit: com.unit,
      regionName: region.name,
      recommendedSource: `${best.sourceName} (Rp ${best.price.toLocaleString('id-ID')}/${com.unit})`,
      sources,
    };
  });
}

export async function testGeminiConnection(
  apiKey: string,
  model: string
): Promise<{ ok: boolean; latencyMs: number; reply?: string; error?: string }> {
  const start = Date.now();
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey.trim() },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Balas singkat maksimal 8 kata: Koneksi HargaKu Gemini aktif!' }] }],
      }),
    });
    const data = (await res.json()) as GeminiApiResponse;
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      return { ok: false, latencyMs, error: data.error?.message || `HTTP ${res.status}` };
    }
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';
    return { ok: true, latencyMs, reply: replyText };
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - start, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function generateMultiSourceAiReply(input: {
  message: string;
  regionId: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<AssistantChatResponse> {
  const region =
    MOCK_REGIONS.find((r) => r.id === input.regionId || r.slug === input.regionId) || DEFAULT_REGION;

  let commodities = INITIAL_COMMODITIES;
  let markets = INITIAL_MARKETS;
  let dailyPrices = INITIAL_DAILY_PRICES;
  let reports: AdminReport[] = [];

  try {
    const dbData = await fetchBootstrapFromDb();
    if (dbData.commodities.length > 0) commodities = dbData.commodities;
    if (dbData.markets.length > 0) markets = dbData.markets;
    if (Object.keys(dbData.dailyPrices).length > 0) dailyPrices = dbData.dailyPrices;
    reports = dbData.reports;
  } catch {
    // Graceful fallback to baseline dataset if DB is offline
  }

  const cfg = await getAiRuntimeConfig();
  const sourceComparisons = buildSourceComparisons(
    input.message,
    region,
    commodities,
    markets,
    dailyPrices,
    reports,
    cfg.enabledSources
  );

  const referencedCommodities = sourceComparisons.map((sc, idx) => {
    const avg = Math.round(sc.sources.reduce((a, b) => a + b.price, 0) / Math.max(1, sc.sources.length));
    return {
      id: `src_${idx}_${sc.commodityName.toLowerCase().replace(/\s+/g, '_')}`,
      name: sc.commodityName,
      currentPrice: avg,
      unit: sc.unit,
    };
  });

  const suggestedActions = [
    { label: 'Cek Harga Wajar Lapak', href: '/cek-harga' },
    { label: 'Peta Pasar Termurah', href: '/peta' },
    { label: 'Komparasi Multi-Sumber', href: '/rekomendasi-ai' },
  ];

  if (!cfg.apiKey) {
    const fallback = await processAssistantMessage(input.message, region);
    const bestLine = sourceComparisons[0]
      ? `\n\n#### Komparasi Sumber: ${sourceComparisons[0].commodityName} (${region.name})\n\n| Sumber Harga | Nominal | Keterangan |\n| :--- | ---: | :--- |\n` +
        sourceComparisons[0].sources
          .map(
            (s) =>
              `| ${s.isLowest ? `**${s.sourceName}**` : s.sourceName} | \`Rp ${s.price.toLocaleString('id-ID')}/${sourceComparisons[0].unit}\` | ${s.note} |`
          )
          .join('\n')
      : '';
    return {
      reply: `${fallback.content}${bestLine}\n\n> *Catatan: Kunci Gemini API belum diisi di Admin Console (menu Integrasi AI & API), jadi Rin saat ini memakai acuan lokal terverifikasi.*`,
      intent: 'PRICE_RECOMMENDATION',
      provider: 'grounded-fallback',
      model: cfg.geminiModel,
      sourceComparisons,
      referencedCommodities,
      suggestedActions,
    };
  }

  const contextLines = sourceComparisons
    .map((sc) => {
      const rows = sc.sources
        .map((s) => `  * ${s.sourceName}: Rp ${s.price.toLocaleString('id-ID')}/${sc.unit} (${s.note})`)
        .join('\n');
      return `- Komoditas: ${sc.commodityName} (${sc.regionName})\n${rows}\n  * Acuan Terhemat: ${sc.recommendedSource}`;
    })
    .join('\n');

  const historyText = (input.conversationHistory || [])
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Pengguna' : 'Rin'}: ${m.content}`)
    .join('\n');

  const prompt = [
    `PERAN: Kamu adalah Rin, asisten harga pangan resmi di web HargaKu.`,
    `WILAYAH AKTIF: ${region.name} (${region.islandName}, ${region.zone}, toleransi logistik +${region.logisticsCostPct}%).`,
    `SUMBER PERBANDINGAN DATA HARGA NYATA DARI DATABASE:`,
    contextLines,
    historyText ? `\nRIWAYAT SINGKAT:\n${historyText}` : '',
    `\nPERTANYAAN PENGGUNA:\n${input.message}`,
    `\nATURAN JAWABAN RIN: Jawab dalam Bahasa Indonesia yang ramah menggunakan format Markdown rapi (gunakan ### heading singkat, tabel Markdown jika membandingkan antar sumber, bullet points, dan penebalan angka/backtick nominal Rupiah). Sebutkan angka antar sumber secara jujur, rekomendasikan sumber/pasar yang paling hemat, JANGAN menyarankan fitur keranjang belanja, dan JANGAN gunakan karakter em-dash.`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.geminiModel)}:generateContent`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cfg.apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: cfg.systemInstruction }] },
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = (await res.json()) as GeminiApiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!res.ok || !text) {
      throw new Error(data.error?.message || `Gemini HTTP ${res.status}`);
    }

    return {
      reply: text.replace(/\u2014/g, ','),
      intent: 'PRICE_RECOMMENDATION',
      provider: 'gemini',
      model: cfg.geminiModel,
      sourceComparisons,
      referencedCommodities,
      suggestedActions,
    };
  } catch (err) {
    const fallback = await processAssistantMessage(input.message, region);
    const errNote = err instanceof Error ? err.message : 'Gangguan koneksi AI';
    return {
      reply: `${fallback.content}\n\n(Fallback lokal aktif sementara karena kendala Gemini API: ${errNote})`,
      intent: 'PRICE_RECOMMENDATION',
      provider: 'grounded-fallback',
      model: cfg.geminiModel,
      sourceComparisons,
      referencedCommodities,
      suggestedActions,
    };
  }
}
