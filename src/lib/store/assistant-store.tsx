'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { AssistantMessage } from '@/types/assistant';
import { useRegion } from '@/lib/store/region-store';
import { sendAssistantMessage } from '@/lib/api/assistant.api';

interface AssistantContextType {
  isOpen: boolean;
  openAssistant: (initialPrompt?: string) => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  messages: AssistantMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const { selectedRegion } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      timestamp: '06:00',
      content: `Halo! Saya **Asisten Rekomendasi Harga HargaKu** (Gemini AI). Saya membandingkan data **Panel Harga Bapanas**, **PIHPS BI**, **Pasar Rakyat / Perumda PPJ**, dan **Laporan Warga Terverifikasi** untuk menilai kewajaran harga dan menjawab pertanyaanmu.`,
      suggestedActions: [
        { label: 'Cek Harga Wajar', href: '/cek-harga' },
        { label: 'Halaman AI Multi-Sumber', href: '/rekomendasi-ai' },
      ],
    },
  ]);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: AssistantMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const botReply = await sendAssistantMessage(
          trimmed,
          selectedRegion,
          messagesRef.current
        );
        setMessages((prev) => [...prev, botReply]);
      } catch {
        // Fallback in case of unexpected error
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            content: `Maaf, terjadi kendala saat memproses pertanyaan Anda. Silakan coba kembali.`,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [selectedRegion]
  );

  const openAssistant = useCallback(
    (initialPrompt?: string) => {
      setIsOpen(true);
      if (initialPrompt) {
        sendMessage(initialPrompt);
      }
    },
    [sendMessage]
  );

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        content: `Percakapan telah direset. Mau konsultasi harga atau resep belanja apa hari ini di **${selectedRegion.name}**?`,
      },
    ]);
  }, [selectedRegion]);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        messages,
        isTyping,
        sendMessage,
        clearConversation,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
