'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChatCircleDots, X } from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { PuntenMascot3D } from './PuntenMascot3D';

export function PuntenScrollMascot() {
  const pathname = usePathname() || '/';
  const { isOpen, openAssistant } = useAssistant();
  const [bubbleUnlocked, setBubbleUnlocked] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [aboveAlleyBar, setAboveAlleyBar] = useState(false);

  const ticksRef = useRef(0);

  const isSuppressedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/cek-harga') ||
    pathname.startsWith('/rekomendasi-ai');

  useEffect(() => {
    setBubbleUnlocked(false);
    setAboveAlleyBar(false);
    ticksRef.current = 0;
  }, [pathname]);

  useEffect(() => {
    if (isSuppressedRoute) return;

    const evaluateLayout = (fromScroll: boolean) => {
      const y = window.scrollY;
      if (pathname === '/') {
        const hero = document.getElementById('heroSection');
        if (hero) {
          const rect = hero.getBoundingClientRect();
          setAboveAlleyBar(rect.top < -80 && rect.bottom > window.innerHeight + 20);
        } else {
          setAboveAlleyBar(false);
        }
      } else {
        setAboveAlleyBar(false);
      }

      if (fromScroll && y > 160) {
        ticksRef.current += 1;
      }

      if (y >= 240 && ticksRef.current >= 2) {
        setBubbleUnlocked(true);
      } else if (y < 100 && pathname === '/') {
        setBubbleUnlocked(false);
      }
    };

    const handleScroll = () => evaluateLayout(true);
    evaluateLayout(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isSuppressedRoute, pathname]);

  if (isSuppressedRoute || isOpen) {
    return null;
  }

  const showBubble = !bubbleDismissed && (bubbleUnlocked || hovered);

  return (
    <div
      className={`fixed right-3 sm:right-6 z-40 flex items-end gap-1.5 sm:gap-2.5 max-w-[calc(100vw-24px)] transition-[bottom] duration-200 ${
        aboveAlleyBar ? 'bottom-[74px] sm:bottom-20' : 'bottom-4 sm:bottom-5'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showBubble && (
        <div className="relative animate-fadeIn">
          <button
            type="button"
            onClick={() => openAssistant()}
            className="text-left rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] shadow-[var(--shadow-hard)] px-3.5 py-2.5 pr-7 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--forest-ink)]">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span>PUNTEN AI</span>
            </span>
            <p className="text-[13px] sm:text-[14px] font-bold text-[var(--text-primary)] leading-snug mt-0.5">
              Lagi cari harga apa nih?
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-chili)] mt-1">
              <ChatCircleDots size={12} weight="bold" aria-hidden="true" />
              <span>Klik buat ngobrol dengan AI</span>
              <ArrowRight size={11} weight="bold" aria-hidden="true" />
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBubbleDismissed(true);
            }}
            aria-label="Sembunyikan balon ajakan PUNTEN AI"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[var(--text-primary)] hover:bg-[var(--accent-chili)] hover:text-white inline-flex items-center justify-center shadow-xs cursor-pointer"
          >
            <X size={11} weight="bold" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => openAssistant()}
        aria-label="Buka obrolan mengambang dengan PUNTEN AI"
        className="group relative shrink-0 flex flex-col items-center cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
      >
        <div className="w-[78px] h-[78px] sm:w-[90px] sm:h-[90px] flex items-center justify-center transition-transform group-hover:scale-105">
          <PuntenMascot3D
            size={86}
            mood={hovered ? 'happy' : 'curious'}
            trackGlobalPointer
            className="drop-shadow-[0_6px_12px_rgba(18,59,43,0.32)]"
          />
        </div>
        {!showBubble && (
          <span className="-mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-ink)] shadow-[2px_2px_0px_var(--border-ink)] text-[10px] font-bold text-[var(--text-primary)] whitespace-nowrap group-hover:bg-[#EEF773] group-hover:text-[#132E20] transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
            <span>PUNTEN AI</span>
          </span>
        )}
      </button>
    </div>
  );
}
