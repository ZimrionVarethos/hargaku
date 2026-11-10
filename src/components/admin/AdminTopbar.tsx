'use client';

import Link from 'next/link';
import Image from 'next/image';
import { List, ArrowSquareOut, Database, Moon, Sun } from '@phosphor-icons/react';
import { useAdminStore } from '@/lib/store/admin-store';
import { useTheme } from '@/lib/store/theme-store';

interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
}

export function AdminTopbar({ onOpenMobileSidebar }: AdminTopbarProps) {
  const { dataSource } = useAdminStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full market-card px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2.5 sm:gap-4">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Buka Menu Navigasi Admin"
          className="lg:hidden market-btn-secondary w-9 h-9 p-0 inline-flex items-center justify-center shrink-0"
        >
          <List size={18} weight="bold" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="pasarku-logo-plaque shrink-0">
            <Image
              src="/images/pasarku/logo-nav.webp"
              alt="Logo PasarKu"
              width={400}
              height={173}
              unoptimized
              className="h-6 sm:h-7 w-auto shrink-0 object-contain"
            />
          </span>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden sm:inline font-bold text-sm text-[var(--text-primary)] tracking-tight">
                Console
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-ink)] shrink-0">
                Admin
              </span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] hidden sm:inline truncate">
              Pusat Kendali Data Pangan Pasar Tradisional
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            dataSource === 'supabase'
              ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]/35'
              : 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--earth-ochre)]/45'
          }`}
        >
          <Database size={13} weight="bold" />
          <span>{dataSource === 'supabase' ? 'Supabase DB Live' : 'Mode Fallback Lokal'}</span>
        </span>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Subuh'}
          title={theme === 'dark' ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Subuh'}
          className="market-btn-secondary w-9 h-9 p-0 inline-flex items-center justify-center shrink-0"
        >
          {theme === 'dark' ? (
            <Sun size={17} weight="bold" className="text-[#EEF773]" aria-hidden="true" />
          ) : (
            <Moon size={17} weight="bold" className="text-[var(--text-primary)]" aria-hidden="true" />
          )}
        </button>

        <Link
          href="/"
          className="market-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-bold no-underline"
        >
          <span className="hidden sm:inline">Website Publik</span>
          <span className="sm:hidden">Publik</span>
          <ArrowSquareOut size={14} weight="bold" />
        </Link>
      </div>
    </header>
  );
}
