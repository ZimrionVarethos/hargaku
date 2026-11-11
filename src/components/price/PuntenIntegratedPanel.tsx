'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowsCounterClockwise, ChatCircleDots, MapPin, PaperPlaneRight, Scales } from '@phosphor-icons/react';
import type { CommoditySummary, Market, PriceCheckResult } from '@/types';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import { filterMarketsForRegion } from '@/lib/mock/markets.data';
import { computeCommodityCitizenStats, matchesCommodityRecord } from '@/lib/market-insights';
import { DEFAULT_PROMPT_PRESETS } from '@/lib/assistant/assistant-presets';
import { AiMessageBubble } from '@/components/assistant/AiMessageBubble';
import { PuntenMascot3D } from '@/components/assistant/PuntenMascot3D';
import { PuntenMascotAvatar, type PuntenMood } from '@/components/assistant/PuntenMascotAvatar';

interface Props {
  commodity?: CommoditySummary;
  market?: Market;
  result: PriceCheckResult | null;
}

export function PuntenIntegratedPanel({ commodity, market, result }: Props) {
  const { messages, isTyping, sendMessage, clearConversation } = useAssistant();
  const { selectedRegion, allRegions, setSelectedRegion } = useRegion();
  const { commodities, rawMarkets, dailyPrices, reports } = useLiveCatalog();
  const [inputText, setInputText] = useState('');

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  const activeCom = commodity || commodities[0];

  const mascotMood: PuntenMood = isTyping
    ? 'thinking'
    : result?.status === 'OVERPRICED'
    ? 'surprised'
    : result?.status === 'MUCH_CHEAPER'
    ? 'happy'
    : 'normal';

  const regionalSources = useMemo(() => {
    if (!activeCom) return [];
    const activeOnly = rawMarkets.filter((m) => m.isActive);
    const scoped = filterMarketsForRegion(activeOnly, selectedRegion.id);
    const pool = scoped.length > 0 ? scoped : activeOnly;
    const marketPrices: Array<{ name: string; price: number }> = [];

    for (const m of pool) {
      const rec = dailyPrices[`${m.id}_${activeCom.id}`];
      if (rec && rec.price > 0) marketPrices.push({ name: m.name, price: rec.price });
    }
    marketPrices.sort((a, b) => a.price - b.price);

    const factor = selectedRegion.disparityIndex || 1;
    const pihpsAvg =
      marketPrices.length > 0
        ? Math.round(marketPrices.reduce((s, p) => s + p.price, 0) / marketPrices.length / 100) * 100
        : Math.round((activeCom.currentAvgPrice * factor) / 100) * 100;
    const citizenStats = computeCommodityCitizenStats(activeCom, reports, market?.id);
    const shortageCount = reports.filter(
      (r) => r.status === 'APPROVED' && r.reportType === 'SHORTAGE' && matchesCommodityRecord(r, activeCom)
    ).length;

    const rows = [
      { label: 'Acuan Nasional Bapanas', price: activeCom.hapHetPrice, note: 'Batas HAP/HET pemerintah pusat' },
      { label: `Acuan Daerah · PIHPS (${selectedRegion.name})`, price: pihpsAvg, note: `Rerata ${marketPrices.length || 1} pasar aktif setempat` },
      { label: marketPrices[0] ? `${marketPrices[0].name} (Termurah)` : 'Pasar Rakyat Termurah', price: marketPrices[0]?.price || pihpsAvg, note: 'Harga terendah terpantau di wilayah ini' },
      {
        label: 'Laporan Warga & Pedagang',
        price: citizenStats.cityCount > 0 ? citizenStats.cityMedian : pihpsAvg,
        note: citizenStats.cityCount > 0 ? `Median ${citizenStats.cityCount} laporan${shortageCount > 0 ? ` · ${shortageCount} info stok` : ''}` : 'Memakai acuan rerata pasar wilayah',
      },
    ];
    const minPrice = Math.min(...rows.map((r) => r.price));
    return rows.map((r) => ({ ...r, isLowest: r.price === minPrice }));
  }, [activeCom, rawMarkets, dailyPrices, reports, selectedRegion, market?.id]);

  const handleCompareSources = () => {
    if (!activeCom) return;
    const marketNote = market ? ` khususnya di ${market.name}` : '';
    sendMessage(
      `Bandingkan harga ${activeCom.name} lintas sumber di ${selectedRegion.name}${marketNote} (Bapanas, PIHPS, Pasar Rakyat Termurah, dan Laporan Warga), lalu beri patokan tawar paling aman.`
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <section id="punten-panel" className="scroll-mt-20 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t-2 border-[var(--border-ink)]">
        <div className="space-y-0.5">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Scales size={22} weight="bold" className="text-[var(--accent-chili)] shrink-0" />
            <span>Komparasi Sumber &amp; Tanya PUNTEN AI</span>
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)]">
            Maskot PUNTEN AI siap membandingkan harga Bapanas, PIHPS, pasar termurah, hingga tips tawar untuk barang pilihanmu.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <MapPin size={15} weight="fill" className="text-[var(--accent-chili)]" />
          <select
            aria-label="Pilih wilayah acuan PUNTEN AI"
            value={selectedRegion.id}
            onChange={(e) => {
              const found = allRegions.find((r) => r.id === e.target.value);
              if (found) setSelectedRegion(found);
            }}
            className="px-3 py-1.5 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
          >
            {allRegions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.phaseLabel ? `${reg.phaseLabel.split(' · ')[0]} · ` : ''}
                {reg.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 market-card p-5 bg-[var(--bg-card)] space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)]">
            <div className="shrink-0">
              <PuntenMascot3D size={112} mood={mascotMood} />
            </div>
            <div className="space-y-1.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/40 text-[10px] font-bold uppercase tracking-wider">
                PUNTEN AI 3D
              </span>
              <p className="text-[12px] font-bold text-[var(--text-primary)] leading-snug">
                {result
                  ? `Status ${activeCom?.name || 'komoditas'}: ${result.statusLabel} di ${market?.name || selectedRegion.name}.`
                  : `Pilih komoditas & takaran di atas, atau langsung tanya PUNTEN!`}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                Patokan pasar aktif: Rp {(result?.comparisonPrice || activeCom?.currentAvgPrice || 0).toLocaleString('id-ID')}/{activeCom?.unit || 'kg'}.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Ringkasan 4 Sumber · {activeCom?.name || 'Komoditas'}
            </div>
            {regionalSources.map((src) => (
              <div
                key={src.label}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  src.isLowest
                    ? 'bg-[var(--forest-surface)] border-[var(--forest-ink)] text-[var(--forest-ink)]'
                    : 'bg-[var(--bg-paper)] border-[var(--border-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-bold truncate">{src.label}</div>
                  <div className="text-[11px] opacity-80 truncate">{src.note}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-bold font-mono-num">
                    Rp {src.price.toLocaleString('id-ID')}
                  </div>
                  {src.isLowest && (
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Acuan Terhemat
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCompareSources}
            disabled={isTyping}
            className="market-btn-primary w-full py-2.5 px-4 text-[12px] font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <ChatCircleDots size={16} weight="bold" />
            <span>Minta PUNTEN Bandingkan Sumber</span>
          </button>
        </div>

        <div className="lg:col-span-7 market-card bg-[var(--bg-card)] flex flex-col h-[500px] sm:h-[540px] overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b-2 border-[var(--border-ink)] flex items-center justify-between bg-[var(--bg-muted)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] flex items-center justify-center shrink-0">
                <PuntenMascotAvatar size={32} mood={mascotMood} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                  PUNTEN &middot; Asisten Harga Multi-Sumber
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">
                  Acuan: {selectedRegion.name}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={clearConversation}
              className="market-btn-secondary px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <ArrowsCounterClockwise size={13} weight="bold" />
              <span>Reset</span>
            </button>
          </div>

          <div
            ref={chatBoxRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 bg-[var(--bg-paper)]"
          >
            {messages.map((msg) => (
              <AiMessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-ink)] w-fit text-xs font-bold text-[var(--text-secondary)]">
                <PuntenMascotAvatar size={22} mood="thinking" />
                <span>PUNTEN sedang membandingkan sumber harga...</span>
              </div>
            )}
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

          <form
            onSubmit={handleSubmit}
            className="p-3.5 border-t-2 border-[var(--border-ink)] bg-[var(--bg-card)] flex gap-2"
          >
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
              className="market-btn-primary px-4 py-2.5 text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shrink-0"
            >
              <span>Kirim</span>
              <PaperPlaneRight size={14} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
