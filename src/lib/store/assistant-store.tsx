'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
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

export function AssistantProvider({ children }: { children: ReactNode }) {
  const { selectedRegion } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      timestamp: '06:00',
      content: `### Halo, saya PUNTEN!\n\nSaya asisten keputusan belanja **PasarKu** (pelengkap data **PIHPS BI** & **Panel Harga Bapanas**) untuk membandingkan:\n- **Acuan Nasional & Daerah** sesuai fase wilayah aktif\n- **Pasar Setempat & Dekat Stasiun** dari **Laporan Warga**\n- **Info Kelangkaan Stok** dari **Laporan Pedagang**\n\n> Tanyakan harga bahan pokok di lapak, takaran (250g/ons), atau komoditas yang sedang mahal dekat Stasiun Bogor.`,
      suggestedActions: [
        { label: 'Cek Harga Wajar', href: '/cek-harga' },
        { label: 'Komparasi Multi-Sumber', href: '/rekomendasi-ai' },
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
        content: `Obrolan dengan **PUNTEN** sudah direset.\n\nMau bandingkan harga komoditas apa hari ini di **${selectedRegion.name}**?`,
      },
    ]);
  }, [selectedRegion]);

  const contextValue = useMemo<AssistantContextType>(
    () => ({
      isOpen,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      messages,
      isTyping,
      sendMessage,
      clearConversation,
    }),
    [isOpen, openAssistant, closeAssistant, toggleAssistant, messages, isTyping, sendMessage, clearConversation]
  );

  return <AssistantContext.Provider value={contextValue}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
