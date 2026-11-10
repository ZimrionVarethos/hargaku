'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth/admin-auth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticatedAdmin()) {
      router.replace('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <span className="pasarku-logo-plaque px-3 py-1.5 bg-[var(--bg-card)] border-2 border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)] animate-pulse">
          <Image
            src="/images/pasarku/logo-nav.webp"
            alt="Logo PasarKu"
            width={400}
            height={173}
            unoptimized
            className="h-8 w-auto object-contain"
          />
        </span>
        <div className="text-xs font-bold text-[var(--text-primary)]">
          Memverifikasi Otorisasi Administrator...
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">
          Mengalihkan ke portal masuk jika sesi tidak valid.
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
