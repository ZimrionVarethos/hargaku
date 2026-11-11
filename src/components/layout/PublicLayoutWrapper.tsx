'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RegionProvider } from '@/lib/store/region-store';
import { AssistantProvider } from '@/lib/store/assistant-store';
import { AdminStoreProvider } from '@/lib/store/admin-store';
import { ThemeProvider } from '@/lib/store/theme-store';
import { AssistantDrawer } from '@/components/assistant/AssistantDrawer';
import { PuntenScrollMascot } from '@/components/assistant/PuntenScrollMascot';

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
}

export function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <ThemeProvider>
      <AdminStoreProvider>
        <RegionProvider>
          <AssistantProvider>
            {isAdminRoute ? (
              <div className="min-h-screen w-full flex flex-col bg-[var(--bg-paper)] text-[var(--text-primary)]">
                {children}
              </div>
            ) : (
              <>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <AssistantDrawer />
                <PuntenScrollMascot />
              </>
            )}
          </AssistantProvider>
        </RegionProvider>
      </AdminStoreProvider>
    </ThemeProvider>
  );
}
