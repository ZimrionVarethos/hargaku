'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChatCircleDots } from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { useTheme } from '@/lib/store/theme-store';

const NAV_LINKS = [
  { href: '/#heroSection', label: 'Lorong Pasar' },
  { href: '/#etagStageSection', label: 'Timbangan' },
  { href: '/#sorotanSection', label: 'Papan Pokok' },
  { href: '/#unitPasarSection', label: '13 Unit Pasar' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[64px] py-2 flex items-center justify-between gap-3">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <Image
            src="/images/pasarku/logo-nav.webp"
            alt="Logo PasarKu"
            width={110}
            height={48}
            priority
            className="h-9 w-auto object-contain"
          />
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-ink)]">
            Kota Bogor
          </span>
        </Link>

        {/* Desktop Navigation Links */}
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

        {/* Right Actions: Cari, Mode Subuh/Siang, Tanya Rin */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickSearch}
            aria-label="Fokus ke pencarian komoditas"
            className="market-btn-secondary px-3 py-1.5 text-xs min-h-[40px] inline-flex items-center gap-1.5"
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
            aria-label="Ganti tema tampilan terang atau gelap"
            className="market-btn-secondary px-3 py-1.5 text-xs min-h-[40px] inline-flex items-center gap-1.5"
          >
            <span className="font-bold">
              {theme === 'dark' ? 'Mode Siang' : 'Mode Subuh'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => openAssistant()}
            className="market-btn-primary px-3.5 py-1.5 text-xs min-h-[40px] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ChatCircleDots size={15} weight="bold" />
            <span>Tanya Rin</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka navigasi seluler"
            className="xl:hidden market-btn-secondary p-2 min-h-[40px]"
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

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="xl:hidden border-t-2 border-[var(--border-ink)] bg-[var(--bg-paper)] px-4 py-3 space-y-1">
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
      )}
    </header>
  );
}
