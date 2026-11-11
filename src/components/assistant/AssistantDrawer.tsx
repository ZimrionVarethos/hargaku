'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  PaperPlaneRight,
  ArrowsCounterClockwise,
  MapPin,
  ArrowsOutSimple,
} from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { useRegion } from '@/lib/store/region-store';
import { DEFAULT_PROMPT_PRESETS } from '@/lib/assistant/assistant-presets';
import { AiMessageBubble } from './AiMessageBubble';
import { PuntenMascotAvatar } from './PuntenMascotAvatar';

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
    if (isOpen && (messages.length > 1 || isTyping)) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 150);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAssistant();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeAssistant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendMessage(inputText);
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="sm:hidden fixed inset-0 z-[59] bg-black/40 backdrop-blur-xs"
        onClick={closeAssistant}
        aria-hidden="true"
      />

      <section
        role="dialog"
        aria-modal="false"
        aria-label="PUNTEN AI Chatbot HargaKu"
        className="fixed inset-x-3 bottom-3 top-[68px] sm:inset-auto sm:bottom-5 sm:right-6 z-[60] sm:w-[410px] md:w-[430px] sm:h-[min(78dvh,590px)] rounded-2xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] shadow-[5px_5px_0px_var(--border-ink)] flex flex-col justify-between overflow-hidden text-[var(--text-primary)] animate-fadeIn"
      >
        <div className="px-4 py-3 bg-[var(--bg-card)] border-b-2 border-[var(--border-ink)] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] shadow-[2px_2px_0px_var(--border-ink)] flex items-center justify-center shrink-0">
              <PuntenMascotAvatar size={34} mood={isTyping ? 'thinking' : 'happy'} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#15803D] border-2 border-[var(--bg-card)]" />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[14px] sm:text-[15px] font-bold tracking-tight truncate">
                PUNTEN AI
              </h2>
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] truncate">
                <MapPin size={11} weight="fill" className="text-[var(--accent-chili)] shrink-0" />
                <span className="truncate">{selectedRegion.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/cek-harga#punten-panel"
              onClick={closeAssistant}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[var(--bg-muted)] hover:bg-[#EEF773] hover:text-[#132E20] border border-[var(--border-ink)] text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors"
              title="Buka halaman Cek Harga & Komparasi AI Terpadu"
            >
              <ArrowsOutSimple size={13} weight="bold" />
              <span className="hidden sm:inline">Cek Harga</span>
            </Link>
            <button
              type="button"
              onClick={clearConversation}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              title="Reset Percakapan"
              aria-label="Reset percakapan dengan PUNTEN AI"
            >
              <ArrowsCounterClockwise size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={closeAssistant}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              title="Tutup Obrolan"
              aria-label="Tutup obrolan PUNTEN AI"
            >
              <X size={17} weight="bold" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5">
          {messages.map((msg) => (
            <AiMessageBubble key={msg.id} message={msg} onNavigate={closeAssistant} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] w-fit shadow-xs">
              <PuntenMascotAvatar size={24} mood="thinking" />
              <span className="text-[11px] font-bold text-[var(--text-secondary)]">
                PUNTEN AI sedang menganalisis data...
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

        <div className="px-3.5 py-2 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
          {DEFAULT_PROMPT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => sendMessage(preset.prompt)}
              disabled={isTyping}
              className="px-2.5 py-1 rounded-full bg-[var(--bg-muted)] hover:bg-[#EEF773] hover:text-[#132E20] border border-[var(--border-ink)] text-[11px] font-bold text-[var(--text-primary)] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-3.5 bg-[var(--bg-card)] border-t-2 border-[var(--border-ink)] flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik pertanyaan harga atau stok pasar..."
            disabled={isTyping}
            className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="market-btn-primary px-3.5 py-2 rounded-xl text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Kirim pertanyaan ke PUNTEN AI"
          >
            <PaperPlaneRight size={16} weight="bold" />
          </button>
        </form>
      </section>
    </>
  );
}
