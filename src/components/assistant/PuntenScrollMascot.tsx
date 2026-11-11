'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, X } from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { PuntenMascot3D } from './PuntenMascot3D';

export function PuntenScrollMascot() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const { isOpen } = useAssistant();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const ticksRef = useRef(0);
  const startScrollMsRef = useRef<number | null>(null);
  const unlockedRef = useRef(false);

  const isSuppressedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/cek-harga') ||
    pathname.startsWith('/rekomendasi-ai');

  useEffect(() => {
    setVisible(false);
    ticksRef.current = 0;
    startScrollMsRef.current = null;
    unlockedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (isSuppressedRoute || dismissed) return;

    const evaluateVisibility = (fromScroll: boolean) => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = docHeight > 0 ? y / docHeight : 0;

      if (y < 140) {
        setVisible(false);
        return;
      }

      if (fromScroll && y > 200) {
        ticksRef.current += 1;
        if (startScrollMsRef.current === null) {
          startScrollMsRef.current = Date.now();
        }
      }

      if (unlockedRef.current && y >= 240) {
        setVisible(true);
        return;
      }

      const elapsed = startScrollMsRef.current ? Date.now() - startScrollMsRef.current : 0;
      const exploredLong = ticksRef.current >= 3 && y >= 380 && elapsed >= 7000;
      const scrolledDeep = ticksRef.current >= 3 && (y >= 850 || (depth >= 0.42 && y >= 320));

      if (exploredLong || scrolledDeep) {
        unlockedRef.current = true;
        setVisible(true);
      }
    };

    const handleScroll = () => evaluateVisibility(true);
    const intervalId = window.setInterval(() => evaluateVisibility(false), 900);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSuppressedRoute, dismissed, pathname]);

  if (isSuppressedRoute || dismissed || isOpen || !visible) {
    return null;
  }

  return (
    <div
      className={`fixed right-3 sm:right-6 z-40 flex items-end gap-1.5 sm:gap-2.5 max-w-[calc(100vw-24px)] ${
        pathname === '/' ? 'bottom-20 sm:bottom-20' : 'bottom-4 sm:bottom-6'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => router.push('/cek-harga')}
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
            <span>Klik buat cek harga</span>
            <ArrowRight size={12} weight="bold" />
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          aria-label="Tutup ajakan PUNTEN"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] text-[var(--text-primary)] hover:bg-[var(--accent-chili)] hover:text-white inline-flex items-center justify-center shadow-xs cursor-pointer"
        >
          <X size={11} weight="bold" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push('/cek-harga')}
        aria-label="Buka halaman Cek Harga dan PUNTEN AI"
        className="relative shrink-0 w-[86px] h-[86px] sm:w-[98px] sm:h-[98px] rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer bg-transparent border-0 p-0 focus:outline-none"
      >
        <PuntenMascot3D
          size={92}
          mood={hovered ? 'happy' : 'curious'}
          trackGlobalPointer
          className="drop-shadow-[0_6px_12px_rgba(18,59,43,0.32)]"
        />
      </button>
    </div>
  );
}

