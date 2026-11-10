'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChatCircleDots, Moon, Sun } from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { useTheme } from '@/lib/store/theme-store';
import { RegionPhaseSwitcher } from './RegionPhaseSwitcher';

const NAV_LINKS = [
  { href: '/#heroSection', label: 'Lorong Pasar' },
  { href: '/#sorotanSection', label: 'Papan Pokok' },
  { href: '/#unitPasarSection', label: 'Unit Pasar' },
  { href: '/cek-harga', label: 'Cek Harga' },
  { href: '/peta', label: 'Peta' },
  { href: '/lapor', label: 'Lapor' },
  { href: '/rekomendasi-ai', label: 'Komparasi AI' },
];

export function Navbar() {
  const { openAssistant } = useAssistant();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleQuickSearch = () => {
    const input = document.getElementById('heroSearchInput') || document.querySelector('input[type="text"]');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-paper)]/95 backdrop-blur-xs border-b-2 border-[var(--border-ink)] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[60px] sm:h-[64px] flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link href="/" className="flex items-center no-underline shrink-0">
            <span className="pasarku-logo-plaque">
              <Image
                src="/images/pasarku/logo-nav.webp"
                alt="Logo PasarKu"
                width={400}
                height={173}
                unoptimized
                priority
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </span>
          </Link>
          <div className="hidden sm:block">
            <RegionPhaseSwitcher />
          </div>
        </div>

        <nav aria-label="Navigasi Utama" className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href.startsWith('/#') && pathname === '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isActive
                    ? 'text-[var(--accent-chili)] hover:bg-[var(--bg-muted)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleQuickSearch}
            aria-label="Fokus ke pencarian komoditas"
            className="market-btn-secondary px-2.5 sm:px-3 py-1.5 text-xs min-h-[38px] sm:min-h-[40px] inline-flex items-center gap-1.5"
          >
            <svg aria-hidden="true" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.2" y2="16.2" />
            </svg>
            <span className="hidden sm:inline">Cari</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Subuh'}
            title={theme === 'dark' ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Subuh'}
            className="market-btn-secondary w-9 h-9 sm:w-10 sm:h-10 p-0 inline-flex items-center justify-center shrink-0"
          >
            {theme === 'dark' ? (
              <Sun size={18} weight="bold" className="text-[#EEF773]" aria-hidden="true" />
            ) : (
              <Moon size={18} weight="bold" className="text-[var(--text-primary)]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => openAssistant()}
            className="market-btn-primary px-2.5 sm:px-3.5 py-1.5 text-xs min-h-[38px] sm:min-h-[40px] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ChatCircleDots size={15} weight="bold" />
            <span>Tanya PUNTEN</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka navigasi seluler"
            className="xl:hidden market-btn-secondary p-2 min-h-[38px] sm:min-h-[40px]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t-2 border-[var(--border-ink)] bg-[var(--bg-paper)] px-4 py-3 space-y-2">
          <div className="sm:hidden pb-2 border-b border-[var(--border-subtle)]">
            <RegionPhaseSwitcher compact />
          </div>
          <div className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
