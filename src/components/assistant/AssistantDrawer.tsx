'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Robot,
  X,
  PaperPlaneRight,
  ArrowsCounterClockwise,
  MapPin,
  ArrowSquareOut,
  Tag,
  Scales,
} from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';
import { DEFAULT_PROMPT_PRESETS } from '@/lib/assistant/assistant-presets';

export function AssistantDrawer() {
  const {
    isOpen,
    closeAssistant,
    messages,
    isTyping,
    sendMessage,
    clearConversation,
  } = useAssistant();
  const { selectedRegion } = useRegion();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-200"
        onClick={closeAssistant}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10"
        role="dialog"
        aria-modal="true"
        aria-label="Panel Rekomendasi Harga AI Multi-Sumber"
      >
        <div className="w-screen max-w-md bg-[var(--bg-paper)] border-l-2 border-[var(--border-ink)] shadow-2xl flex flex-col justify-between text-[var(--text-primary)]">
          {/* Header */}
          <div className="px-5 py-4 bg-[var(--bg-card)] border-b-2 border-[var(--border-ink)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#EEF773] border-2 border-[var(--border-ink)] flex items-center justify-center text-[#132E20] shrink-0">
                <Robot size={20} weight="fill" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-[15px] font-bold tracking-tight truncate">
                    Rekomendasi Harga AI
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-[#15803D] shrink-0" />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] truncate">
                  <MapPin size={11} weight="fill" className="text-[var(--accent-chili)] shrink-0" />
                  <span className="truncate">Acuan: {selectedRegion.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/rekomendasi-ai"
                onClick={closeAssistant}
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-[var(--bg-muted)] hover:bg-[var(--bg-paper)] border border-[var(--border-ink)] text-[var(--text-primary)]"
                title="Buka tampilan layar penuh"
              >
                Layar Penuh
              </Link>
              <button
                type="button"
                onClick={clearConversation}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                title="Reset Percakapan"
              >
                <ArrowsCounterClockwise size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={closeAssistant}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                title="Tutup Panel"
              >
                <X size={18} weight="bold" />
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl p-3.5 sm:p-4 text-[13px] leading-[20px] border-2 ${
                      isUser
                        ? 'bg-[#132E20] text-[#F9F3EE] border-[var(--border-ink)] rounded-tr-xs'
                        : 'bg-[var(--bg-card)] border-[var(--border-ink)] text-[var(--text-primary)] rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {!isUser && msg.provider && (
                      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--forest-ink)]">
                        <span>{msg.provider === 'gemini' ? `Gemini AI (${msg.model || '3.8-flash'})` : 'Acuan Data Lokal'}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line space-y-1">{msg.content}</div>

                    {/* Multi-Source Comparison Cards */}
                    {msg.sourceComparisons && msg.sourceComparisons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
                        {msg.sourceComparisons.map((cmp) => (
                          <div
                            key={cmp.commodityName}
                            className="rounded-xl bg-[var(--bg-paper)] border border-[var(--border-ink)] p-2.5 space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                              <span className="inline-flex items-center gap-1 text-[var(--accent-chili)]">
                                <Scales size={13} weight="bold" />
                                <span>{cmp.commodityName}</span>
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)]">/{cmp.unit}</span>
                            </div>

                            <div className="space-y-1">
                              {cmp.sources.map((src) => (
                                <div
                                  key={src.sourceName}
                                  className={`flex items-center justify-between gap-2 text-[11px] px-2 py-1 rounded-md ${
                                    src.isLowest
                                      ? 'bg-[#E2EFE6] text-[#132E20] font-bold border border-[#245034]/30'
                                      : 'text-[var(--text-secondary)]'
                                  }`}
                                >
                                  <span className="truncate">{src.sourceName}</span>
                                  <span className="font-mono-num shrink-0">
                                    Rp {src.price.toLocaleString('id-ID')}
                                    {src.isLowest ? ' (Hemat)' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Referenced Commodities */}
                    {msg.referencedCommodities && msg.referencedCommodities.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap gap-1.5">
                        {msg.referencedCommodities.map((com) => (
                          <div
                            key={com.id}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px]"
                          >
                            <Tag size={11} weight="bold" className="text-[var(--accent-chili)]" />
                            <span className="font-semibold">{com.name}</span>
                            <span className="font-mono-num">
                              Rp {com.currentPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Actions */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
                        {msg.suggestedActions.map((act) => (
                          <Link
                            key={act.href}
                            href={act.href}
                            onClick={closeAssistant}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-muted)] hover:bg-[var(--bg-paper)] text-[var(--text-primary)] border border-[var(--border-ink)] text-[11px] font-bold transition-colors"
                          >
                            <span>{act.label}</span>
                            <ArrowSquareOut size={11} weight="bold" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-ink)] w-fit">
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  Membandingkan sumber harga...
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-chili)] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-chili)] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-chili)] animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompt Chips */}
          <div className="px-4 py-2 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] overflow-x-auto scrollbar-none flex items-center gap-2">
            {DEFAULT_PROMPT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => sendMessage(preset.prompt)}
                disabled={isTyping}
                className="px-2.5 py-1 rounded-full bg-[var(--bg-muted)] hover:bg-[var(--bg-paper)] border border-[var(--border-ink)] text-[11px] font-bold text-[var(--text-primary)] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3.5 sm:p-4 bg-[var(--bg-card)] border-t-2 border-[var(--border-ink)] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Bandingkan harga atau tanya rekomendasi sumber..."
              disabled={isTyping}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="market-btn-primary px-4 py-2.5 rounded-xl text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Kirim Pesan"
            >
              <PaperPlaneRight size={16} weight="bold" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
