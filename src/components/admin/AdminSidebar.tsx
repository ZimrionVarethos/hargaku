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
      <div className="space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase border-b-2 border-[var(--border-ink)]">
          Menu Operasional
        </div>
        <div className="pt-1 space-y-1.5">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'market-btn-primary'
                    : 'rounded-[10px] border-2 border-transparent font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? 'text-white shrink-0' : 'text-[var(--text-muted)] shrink-0'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`font-mono-num text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5 pt-3 border-t-2 border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="market-btn-secondary flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold"
          >
            <Question size={14} weight="bold" />
            <span>Bantuan</span>
          </button>
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            title="Reset Data Simulasi"
            aria-label="Reset Data Simulasi"
            className="market-btn-secondary p-2 hover:text-[var(--accent-chili)]"
          >
            <ArrowsCounterClockwise size={14} weight="bold" />
          </button>
        </div>

        <div className="p-3 rounded-[12px] bg-[var(--bg-paper)] border-2 border-[var(--border-ink)] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--forest-surface)] border border-[var(--border-ink)] text-[var(--forest-ink)] font-bold text-xs flex items-center justify-center shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            title="Keluar Akun"
            aria-label="Keluar Akun"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-chili)] rounded-lg transition-colors cursor-pointer"
          >
            <SignOut size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-[248px] shrink-0 sticky top-6 self-start market-card p-4">
        {navContent}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-[#0A120E]/65 transition-opacity" onClick={onCloseMobile} />
          <div className="relative w-[280px] max-w-[85vw] bg-[var(--bg-card)] h-full p-5 flex flex-col justify-between border-r-2 border-[var(--border-ink)] z-10">
            <div className="flex items-center justify-between pb-3.5 border-b-2 border-[var(--border-ink)]">
              <span className="font-bold text-sm text-[var(--text-primary)]">Navigasi Admin</span>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Tutup menu admin"
                className="market-btn-secondary w-9 h-9 p-0 inline-flex items-center justify-center"
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
