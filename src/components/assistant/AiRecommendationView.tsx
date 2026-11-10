'use client';

import { useState, useMemo, useRef, useEffect, type FormEvent } from 'react';
import { ChatCircleDots, PaperPlaneRight, ArrowsCounterClockwise, MapPin } from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { computeCommodityCitizenStats, matchesCommodityRecord } from '@/lib/market-insights';
import { DEFAULT_PROMPT_PRESETS } from '@/lib/assistant/assistant-presets';
import { AiMessageBubble } from './AiMessageBubble';

export function AiRecommendationView() {
  const { messages, isTyping, sendMessage, clearConversation } = useAssistant();
  const { selectedRegion, allRegions, setSelectedRegion } = useRegion();
  const { commodities, rawMarkets, dailyPrices, reports } = useLiveCatalog();
  const [selectedSlug, setSelectedSlug] = useState(commodities[0]?.slug || 'cabai-rawit-merah');
  const [inputText, setInputText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const activeCom = useMemo(() => {
    return commodities.find((c) => c.slug === selectedSlug) || commodities[0];
  }, [commodities, selectedSlug]);

  const comparisonSources = useMemo(() => {
    if (!activeCom) return [];
    const activeOnly = rawMarkets.filter((m) => m.isActive);
    const regionMarkets = filterMarketsForRegion(activeOnly, selectedRegion.id);
    const scope = regionMarkets.length > 0 ? regionMarkets : activeOnly;
    const prices: Array<{ name: string; price: number }> = [];

    for (const m of scope) {
      const rec = dailyPrices[`${m.id}_${activeCom.id}`];
      if (rec && rec.price > 0) prices.push({ name: m.name, price: rec.price });
    }
    prices.sort((a, b) => a.price - b.price);

    const factor = selectedRegion.disparityIndex || 1;
    const nationalHap = activeCom.hapHetPrice;
    const pihpsAvg =
      prices.length > 0
        ? Math.round(prices.reduce((s, p) => s + p.price, 0) / prices.length / 100) * 100
        : Math.round((activeCom.currentAvgPrice * factor) / 100) * 100;
    const cheapestMarket = prices[0]?.price || pihpsAvg;
    const citizenStats = computeCommodityCitizenStats(activeCom, reports);
    const shortageCount = reports.filter(
      (r) => r.status === 'APPROVED' && r.reportType === 'SHORTAGE' && matchesCommodityRecord(r, activeCom)
    ).length;
    const citizenMedian = citizenStats.cityCount > 0 ? citizenStats.cityMedian : pihpsAvg;

    const rows = [
      {
        source: 'Acuan Nasional Bapanas (HAP/HET)',
        price: nationalHap,
        note:
          factor !== 1
            ? `Dasar nasional (+${selectedRegion.logisticsCostPct}% logistik ${selectedRegion.name})`
            : 'Batas acuan resmi pemerintah nasional',
      },
      {
        source: `Acuan Daerah (${selectedRegion.name})`,
        price: pihpsAvg,
        note: `Pelengkap survei PIHPS BI di ${prices.length || 1} pasar aktif`,
      },
      {
        source: prices[0] ? `${prices[0].name} (Pasar Rakyat)` : 'Pasar Rakyat Termurah',
        price: cheapestMarket,
        note: 'Harga terendah terpantau di wilayah aktif',
      },
      {
        source: 'Laporan Warga & Pedagang',
        price: citizenMedian,
        note:
          citizenStats.cityCount > 0
            ? `Median ${citizenStats.cityCount} laporan warga${shortageCount > 0 ? ` · ${shortageCount} info stok` : ''}`
            : 'Belum ada laporan tambahan, memakai acuan rerata',
      },
    ];
    const minPrice = Math.min(...rows.map((r) => r.price));
    return rows.map((r) => ({ ...r, isLowest: r.price === minPrice }));
  }, [activeCom, rawMarkets, dailyPrices, reports, selectedRegion]);

  const handleAskSelected = () => {
    if (!activeCom) return;
    sendMessage(
      `Bandingkan harga ${activeCom.name} lintas sumber di ${selectedRegion.name} (Bapanas, PIHPS BI, Pasar Rakyat, dan Laporan Warga) dalam tabel Markdown ringkas, lalu rekomendasikan patokan terbaik dan tips menawarnya.`
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[var(--border-ink)] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Tanya PUNTEN &amp; Komparasi Harga Multi-Sumber
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Alat bantu keputusan belanja pelengkap PIHPS BI &amp; Bapanas dengan data acuan nasional, daerah, pasar setempat, laporan warga, dan info kelangkaan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <MapPin size={16} weight="fill" className="text-[var(--accent-chili)]" />
          <select
            value={selectedRegion.id}
            onChange={(e) => {
              const found = allRegions.find((r) => r.id === e.target.value);
              if (found) setSelectedRegion(found);
            }}
            className="px-3 py-2 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
          >
            {allRegions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.phaseLabel ? `${reg.phaseLabel.split(' · ')[0]} · ` : ''}{reg.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 market-card p-5 space-y-4 bg-[var(--bg-card)]">
          <div className="space-y-1.5">
            <label htmlFor="aiComSelect" className="text-xs font-bold text-[var(--text-primary)]">
              Pilih Komoditas Pembanding
            </label>
            <select
              id="aiComSelect"
              value={activeCom?.slug || ''}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
            >
              {commodities.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} (/{c.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            {comparisonSources.map((src) => (
              <div
                key={src.source}
                className={`p-3 rounded-xl border-2 flex items-center justify-between gap-3 ${
                  src.isLowest
                    ? 'bg-[var(--forest-surface)] border-[var(--forest-ink)] text-[var(--forest-ink)]'
                    : 'bg-[var(--bg-paper)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{src.source}</div>
                  <div className="text-[11px] opacity-80 truncate">{src.note}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold font-mono-num">
                    Rp {src.price.toLocaleString('id-ID')}
                  </div>
                  {src.isLowest && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--forest-ink)]">
                      Acuan Terhemat
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAskSelected}
            disabled={isTyping}
            className="market-btn-primary w-full py-3 text-xs font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <ChatCircleDots size={16} weight="bold" />
            <span>Tanya PUNTEN</span>
          </button>
        </div>

        <div className="lg:col-span-7 market-card bg-[var(--bg-card)] flex flex-col h-[560px] md:h-[620px] overflow-hidden">
          <div className="px-5 py-3.5 border-b-2 border-[var(--border-ink)] flex items-center justify-between bg-[var(--bg-muted)]">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-[#EEF773] border-2 border-[#132E20] flex items-center justify-center text-[#132E20] font-bold text-sm">
                P
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#15803D] border-2 border-[var(--bg-muted)]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  PUNTEN &middot; Asisten Harga Multi-Sumber
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Wilayah acuan: {selectedRegion.name} &bull; Format Markdown aktif
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={clearConversation}
              className="market-btn-secondary px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowsCounterClockwise size={13} weight="bold" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[var(--bg-paper)]">
            {messages.map((msg) => (
              <AiMessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-ink)] w-fit text-xs font-bold text-[var(--text-secondary)]">
                <span>PUNTEN sedang membandingkan sumber harga...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] flex gap-2 overflow-x-auto scrollbar-none">
            {DEFAULT_PROMPT_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => sendMessage(p.prompt)}
                disabled={isTyping}
                className="px-3 py-1 rounded-full bg-[var(--bg-muted)] hover:bg-[#EEF773] hover:text-[#132E20] border border-[var(--border-ink)] text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-3.5 border-t-2 border-[var(--border-ink)] bg-[var(--bg-card)] flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanya PUNTEN soal harga pasar, tabel perbandingan, atau tips tawar..."
              disabled={isTyping}
              className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] text-xs text-[var(--text-primary)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="market-btn-primary px-4 py-2.5 text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <span>Kirim</span>
              <PaperPlaneRight size={14} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
