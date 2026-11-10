import { getAiRuntimeConfig } from './settings-db';
import { fetchBootstrapFromDb } from './admin-db';
import { MOCK_REGIONS, DEFAULT_REGION } from '@/lib/mock/regions.data';
import { INITIAL_ADMIN_STATE } from '@/lib/store/admin-seed';
import { processAssistantMessage } from '@/lib/assistant/assistant-engine';
import { buildMarketAlertContextPrompt, buildSourceComparisons } from './punten-context';
import type { AssistantChatResponse } from '@/types/assistant';

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
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
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function generateMultiSourceAiReply(input: {
  message: string;
  regionId: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<AssistantChatResponse> {
  const region =
    MOCK_REGIONS.find((r) => r.id === input.regionId || r.slug === input.regionId) || DEFAULT_REGION;

  const [dbData, cfg] = await Promise.all([
    fetchBootstrapFromDb().catch(() => null),
    getAiRuntimeConfig(),
  ]);

  const commodities =
    dbData && dbData.commodities.length > 0 ? dbData.commodities : INITIAL_ADMIN_STATE.commodities;
  const markets =
    dbData && dbData.markets.length > 0 ? dbData.markets : INITIAL_ADMIN_STATE.markets;
  const dailyPrices =
    dbData && Object.keys(dbData.dailyPrices).length > 0
      ? dbData.dailyPrices
      : INITIAL_ADMIN_STATE.dailyPrices;
  const reports =
    dbData && dbData.reports.length > 0 ? dbData.reports : INITIAL_ADMIN_STATE.reports;

  const sourceComparisons = buildSourceComparisons(
    input.message,
    region,
    commodities,
    markets,
    dailyPrices,
    reports,
    cfg.enabledSources
  );

  const marketAlertsContext = buildMarketAlertContextPrompt(
    input.message,
    region,
    commodities,
    markets,
    dailyPrices,
    reports
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
    { label: 'Lapor Harga / Kelangkaan', href: '/lapor' },
    { label: 'Peta Pasar & Stasiun', href: '/peta' },
  ];

  if (!cfg.apiKey) {
    const fallback = await processAssistantMessage(input.message, region);
    const showComp =
      !fallback.content.includes('Komparasi Sumber') &&
      !fallback.content.includes('Laporan Pasar') &&
      sourceComparisons[0];

    const bestLine = showComp
      ? `\n\n#### Komparasi Acuan: ${sourceComparisons[0].commodityName} (${region.name})\n\n| Sumber Harga | Nominal | Keterangan |\n| :--- | ---: | :--- |\n` +
        sourceComparisons[0].sources
          .map(
            (s) =>
              `| ${s.isLowest ? `**${s.sourceName}**` : s.sourceName} | \`Rp ${s.price.toLocaleString('id-ID')}/${sourceComparisons[0].unit}\` | ${s.note} |`
          )
          .join('\n')
      : '';

    return {
      reply: `${fallback.content}${bestLine}\n\n> *Catatan: PUNTEN berjalan dengan data lokal terverifikasi dan aturan keputusan PasarKu yang melengkapi PIHPS & Bapanas.*`,
      intent: 'PRICE_RECOMMENDATION',
      provider: 'grounded-fallback',
      model: cfg.geminiModel,
      sourceComparisons,
      referencedCommodities,
      suggestedActions: fallback.suggestedActions || suggestedActions,
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
    .map((m) => `${m.role === 'user' ? 'Pengguna' : 'PUNTEN'}: ${m.content}`)
    .join('\n');

  const prompt = [
    `PERAN: Kamu adalah PUNTEN, asisten keputusan belanja di platform PasarKu / HargaKu.`,
    `WILAYAH AKTIF: ${region.name} (${region.islandName}, ${region.zone}, Fase ${region.phase || 1} ${region.phaseLabel || 'Kota Bogor'}).`,
    `SUMBER PERBANDINGAN DATA HARGA:`,
    contextLines,
    marketAlertsContext,
    historyText ? `\nRIWAYAT SINGKAT:\n${historyText}` : '',
    `\nPERTANYAAN PENGGUNA:\n${input.message}`,
    `\nATURAN JAWABAN PUNTEN: Jawab ramah dalam Bahasa Indonesia memakai Markdown rapi (### heading singkat, tabel Markdown, dan nominal backtick). JANGAN pernah menyebut nama pedagang atau nama lapak/kios individu (hanya agregat per pasar). Jelaskan acuan nasional Bapanas vs acuan lokal serta laporan warga/kelangkaan pedagang jika relevan, posisikan PasarKu sebagai alat bantu keputusan pembeli yang melengkapi PIHPS BI (bukan menggantikan), dan JANGAN gunakan karakter em-dash.`,
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
