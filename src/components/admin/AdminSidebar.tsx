'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminModule } from '@/lib/types/admin';
import { useAdminStore } from '@/lib/store/admin-store';
import { DEFAULT_ADMIN_USER } from '@/lib/store/admin-seed';
import { logoutAdmin } from '@/lib/auth/admin-auth';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminProfileModal } from './AdminProfileModal';
import { AdminHelpModal } from './AdminHelpModal';
import {
  ChartBar,
  ShieldCheck,
  Plant,
  Storefront,
  Lightning,
  GearSix,
  ArrowsCounterClockwise,
  SignOut,
  Question,
  X,
} from '@phosphor-icons/react';

interface AdminSidebarProps {
  activeModule: AdminModule;
  onSelectModule: (module: AdminModule) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  activeModule,
  onSelectModule,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const router = useRouter();
  const { commodities, markets, reports, resetToDefaultData, currentUser } = useAdminStore();
  const user = currentUser || DEFAULT_ADMIN_USER;

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const confirmLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  const pendingReportsCount = reports.filter((r) => r.status === 'PENDING').length;

  const menuItems: { id: AdminModule; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Ringkasan Eksekutif', icon: <ChartBar size={18} weight="bold" /> },
    {
      id: 'reports',
      label: 'Moderasi Laporan',
      icon: <ShieldCheck size={18} weight="bold" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
    },
    { id: 'commodities', label: 'Katalog Komoditas', icon: <Plant size={18} weight="bold" />, badge: commodities.length },
    { id: 'markets', label: 'Sentra Pasar', icon: <Storefront size={18} weight="bold" />, badge: markets.length },
    { id: 'daily-prices', label: 'Entri Harga Harian', icon: <Lightning size={18} weight="bold" /> },
    { id: 'settings', label: 'Integrasi AI & Peta', icon: <GearSix size={18} weight="bold" /> },
  ];

  const navContent = (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-[#A8A29E] uppercase">
          Menu Operasional
        </div>
        {menuItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectModule(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1B1A18] text-white shadow-xs'
                  : 'text-[#706E6A] hover:bg-white hover:text-[#1B1A18]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-[#FF7714]' : 'text-[#706E6A]'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FAF9F5] text-[#706E6A] border border-[#E5E3DE]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 pt-3 border-t border-[#E5E3DE]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#706E6A] bg-white border border-[#E5E3DE] hover:text-[#1B1A18] hover:border-[#1B1A18] transition-colors cursor-pointer"
          >
            <Question size={14} weight="bold" />
            <span>Bantuan</span>
          </button>
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            title="Reset Data Simulasi"
            className="p-2 rounded-xl text-[#706E6A] bg-white border border-[#E5E3DE] hover:text-[#DC2626] hover:border-[#DC2626] transition-colors cursor-pointer"
          >
            <ArrowsCounterClockwise size={14} weight="bold" />
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E5E3DE] shadow-2xs flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#1B1A18] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1B1A18] truncate">{user.name}</div>
              <div className="text-[10px] text-[#A8A29E] truncate">{user.email}</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            title="Keluar Akun"
            className="p-1.5 text-[#706E6A] hover:text-[#DC2626] rounded-lg transition-colors cursor-pointer"
          >
            <SignOut size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-[240px] shrink-0 sticky top-24 self-start bg-[#FAF9F5] rounded-3xl p-4 border border-[#E5E3DE] shadow-xs">
        {navContent}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onCloseMobile} />
          <div className="relative w-[280px] max-w-[85vw] bg-[#FAF9F5] h-full p-5 shadow-2xl flex flex-col justify-between border-r border-[#E5E3DE] z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E3DE]">
              <span className="font-semibold text-sm text-[#1B1A18]">Navigasi Admin</span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-[#706E6A] hover:text-[#1B1A18] rounded-lg border border-[#E5E3DE]"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            <div className="py-4 flex-1 overflow-y-auto">{navContent}</div>
          </div>
        </div>
      )}

      <AdminProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <AdminHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <AdminConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari Konsol Admin HargaKu? Sesi otorisasi Anda akan diakhiri."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="warning"
      />
      <AdminConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToDefaultData}
        title="Kembalikan Dataset Awal?"
        description="Seluruh perubahan data komoditas, pasar, dan laporan warga akan dikembalikan ke kondisi awal demonstrasi simulasi."
        confirmLabel="Ya, Reset Data"
        cancelLabel="Batal"
        variant="warning"
      />
    </>
  );
}
