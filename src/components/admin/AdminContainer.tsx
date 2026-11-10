'use client';

import React, { useState } from 'react';
import { AdminStoreProvider } from '@/lib/store/admin-store';
import { AdminTopbar } from './AdminTopbar';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminReportsView } from './AdminReportsView';
import { AdminCommoditiesView } from './AdminCommoditiesView';
import { AdminMarketsView } from './AdminMarketsView';
import { AdminDailyPricesView } from './AdminDailyPricesView';
import { AdminSettingsView } from './AdminSettingsView';
import type { AdminModule } from '@/lib/types/admin';

function AdminWorkspace() {
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-between gap-6">
      <div className="space-y-6 flex-1 flex flex-col">
        {/* Topbar Console */}
        <AdminTopbar onOpenMobileSidebar={() => setIsMobileNavOpen(true)} />

        {/* Main SaaS Workspace Body: Sidebar + Active View */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar */}
          <AdminSidebar
            activeModule={activeModule}
            onSelectModule={setActiveModule}
            isOpenMobile={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />

          {/* Right Active Module Work Area */}
          <main className="flex-1 w-full min-w-0">
            {activeModule === 'overview' && (
              <AdminOverviewView onNavigate={setActiveModule} />
            )}
            {activeModule === 'reports' && <AdminReportsView />}
            {activeModule === 'commodities' && <AdminCommoditiesView />}
            {activeModule === 'markets' && <AdminMarketsView />}
            {activeModule === 'daily-prices' && <AdminDailyPricesView />}
            {activeModule === 'settings' && <AdminSettingsView />}
          </main>
        </div>
      </div>

      <footer className="mt-auto pt-5 pb-2 text-xs text-[var(--text-muted)] flex flex-col sm:flex-row items-center justify-between gap-2 border-t-2 border-[var(--border-subtle)]">
        <span className="font-semibold text-[var(--text-secondary)]">
          PasarKu Admin Console &middot; Khusus Petugas Operasional &amp; Pengawas Pangan
        </span>
        <span className="font-mono-num text-[11px]">
          Sistem Pantauan Harga Pasar Rakyat
        </span>
      </footer>
    </div>
  );
}

export function AdminContainer() {
  return <AdminWorkspace />;
}
