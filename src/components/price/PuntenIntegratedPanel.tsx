'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowsCounterClockwise, ChatCircleDots, MapPin, PaperPlaneRight } from '@phosphor-icons/react';
import type { CommoditySummary, Market, PriceCheckResult } from '@/types';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
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
  const { commodities } = useLiveCatalog();
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

  const handleAskTips = () => {
    if (!activeCom) return;
    const marketNote = market ? ` di ${market.name}` : ` di ${selectedRegion.name}`;
    sendMessage(
      `Saya mau beli ${activeCom.name}${marketNote}. Berapa patokan harga wajarnya sekarang, apakah ada info pasar lebih murah, dan bagaimana tips menawar yang sopan?`
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <section id="punten-panel" className="scroll-mt-20">
      <div className="market-card bg-[var(--bg-card)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-5 sm:p-6 bg-[var(--bg-muted)]/60 border-b-2 lg:border-b-0 lg:border-r-2 border-[var(--border-ink)] flex flex-col justify-between gap-4">
            <div className="flex flex-col items-center text-center gap-3">
              <PuntenMascot3D size={136} mood={mascotMood} />
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/40 text-[10px] font-bold uppercase tracking-wider">
                  Asisten PUNTEN AI 3D
                </span>
                <h2 className="text-[18px] font-bold text-[var(--text-primary)] leading-snug">
                  Masih Ragu? Tanya PUNTEN Aja
                </h2>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  {result && activeCom
                    ? `Menurut catatan ${selectedRegion.name}, patokan ${activeCom.name} sekitar Rp ${result.comparisonPrice.toLocaleString('id-ID')}/${activeCom.unit}.`
                    : `Tanyakan harga bahan pokok di sekitar pasar tujuanmu dengan bahasa sehari-hari.`}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleAskTips}
                disabled={isTyping}
                className="market-btn-primary w-full py-2.5 px-4 text-[12px] font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <ChatCircleDots size={16} weight="bold" />
                <span>Minta Tips Nawar ke PUNTEN</span>
              </button>

              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text-muted)] shrink-0">
                  <MapPin size={13} weight="fill" className="text-[var(--accent-chili)]" />
                  <span>Wilayah:</span>
                </span>
                <select
                  aria-label="Pilih wilayah acuan PUNTEN AI"
                  value={selectedRegion.id}
                  onChange={(e) => {
                    const found = allRegions.find((r) => r.id === e.target.value);
                    if (found) setSelectedRegion(found);
                  }}
                  className="bg-transparent text-[11px] font-bold text-[var(--text-primary)] rounded-md px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)] cursor-pointer truncate"
                >
                  {allRegions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col h-[430px] sm:h-[470px]">
            <div className="px-4 sm:px-5 py-3 border-b-2 border-[var(--border-ink)] flex items-center justify-between bg-[var(--bg-card)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] flex items-center justify-center shrink-0">
                  <PuntenMascotAvatar size={28} mood={mascotMood} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">
                    Obrolan dengan PUNTEN
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    Jawab cepat harga pasar &amp; perbandingan daerah
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
                  <span>PUNTEN sedang mengecek catatan pasar...</span>
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
              className="p-3 sm:p-3.5 border-t-2 border-[var(--border-ink)] bg-[var(--bg-card)] flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik aja, misal: Telur 1 kg 32rb di Pasar Anyar mahal gak?"
                disabled={isTyping}
                className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] text-xs text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-chili)]"
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
      </div>
    </section>
  );
}
