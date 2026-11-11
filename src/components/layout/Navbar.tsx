'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MagnifyingGlass, Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from '@/lib/store/theme-store';
import { RegionPhaseSwitcher } from './RegionPhaseSwitcher';
import { GlobalSearchModal } from './GlobalSearchModal';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/indeks-harga', label: 'Indeks Harga' },
  { href: '/cek-harga', label: 'Cek Harga' },
  { href: '/peta', label: 'Peta' },
  { href: '/lapor', label: 'Lapor' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    const onOpenSearch = () => setSearchOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pasarku:open-search', onOpenSearch);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pasarku:open-search', onOpenSearch);
    };
  }, []);

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

        <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
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
            onClick={() => setSearchOpen(true)}
            aria-label="Buka pencarian seluruh situs PasarKu"
            className="market-btn-secondary px-2.5 sm:px-3 py-1.5 text-xs min-h-[38px] sm:min-h-[40px] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <MagnifyingGlass size={15} weight="bold" aria-hidden="true" />
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
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka navigasi seluler"
            className="lg:hidden market-btn-secondary p-2 min-h-[38px] sm:min-h-[40px]"
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
        <div className="lg:hidden border-t-2 border-[var(--border-ink)] bg-[var(--bg-paper)] px-4 py-3 space-y-2">
          <div className="sm:hidden pb-2 border-b border-[var(--border-subtle)]">
            <RegionPhaseSwitcher compact />
          </div>
          <div className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-bold hover:bg-[var(--bg-muted)] ${
                    isActive ? 'text-[var(--accent-chili)]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
