'use client';

import React from 'react';
import Link from 'next/link';
import { List, ArrowSquareOut, Database } from '@phosphor-icons/react';
import { useAdminStore } from '@/lib/store/admin-store';

interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
}

export function AdminTopbar({ onOpenMobileSidebar }: AdminTopbarProps) {
  const { dataSource } = useAdminStore();

  return (
    <header className="w-full bg-white border border-[#E5E3DE] rounded-[20px] px-4 sm:px-6 py-3.5 shadow-sm flex items-center justify-between gap-4">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Buka Menu Navigasi Admin"
          className="lg:hidden p-2 text-[#1B1A18] hover:bg-[#FAF9F5] border border-[#E5E3DE] rounded-xl transition-colors cursor-pointer"
        >
          <List size={20} weight="bold" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EEF773] border-1.5 border-[#1B1A18] flex items-center justify-center font-bold text-sm text-[#1B1A18] shadow-[1px_1px_0px_#1B1A18]">
            H.
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#1B1A18]">
                HargaKu Console
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#1B1A18] border border-[#E5E3DE]">
                Admin
              </span>
            </div>
            <span className="text-xs text-[#706E6A] hidden sm:inline">
              Pusat Kendali Data Pangan Pasar Tradisional
            </span>
          </div>
        </div>
      </div>

      {/* DB Status & Public Site Shortcut */}
      <div className="flex items-center gap-2.5">
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
            dataSource === 'supabase'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <Database size={13} weight="bold" />
          <span>{dataSource === 'supabase' ? 'Supabase DB Live' : 'Mode Fallback Lokal'}</span>
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F3F0] text-[#1B1A18] border border-[#E5E3DE] text-xs font-semibold transition-colors shadow-2xs"
        >
          <span>Website Publik</span>
          <ArrowSquareOut size={14} weight="bold" />
        </Link>
      </div>
    </header>
  );
}
