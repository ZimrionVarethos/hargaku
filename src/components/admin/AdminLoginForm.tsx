'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  loginAdmin,
  isAuthenticatedAdmin,
} from '@/lib/auth/admin-auth';
import { useTheme } from '@/lib/store/theme-store';
import {
  LockKey,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  ArrowRight,
  ArrowLeft,
  WarningCircle,
  CheckCircle,
  Moon,
  Sun,
} from '@phosphor-icons/react';

export function AdminLoginForm() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticatedAdmin()) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    const result = await loginAdmin({ email, password, rememberMe });
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 400);
    } else {
      setErrorMessage(result.error || 'Email atau kata sandi tidak valid.');
    }
  };

  return (
    <div className="w-full max-w-md market-card p-6 sm:p-8 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="pasarku-logo-plaque">
              <Image
                src="/images/pasarku/logo-nav.webp"
                alt="Logo PasarKu"
                width={400}
                height={173}
                unoptimized
                className="h-7 w-auto object-contain"
              />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-ink)]">
              ADMIN CONSOLE
            </span>
          </div>

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
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Masuk ke Dashboard Admin
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Gunakan akun administrator untuk mengakses panel kontrol PasarKu.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-[10px] bg-[var(--accent-chili-soft)] border-2 border-[var(--accent-chili)] text-xs font-bold text-[var(--accent-chili)] flex items-center gap-2">
          <WarningCircle size={16} weight="fill" className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess && (
        <div className="p-3.5 rounded-[10px] bg-[var(--forest-surface)] border-2 border-[var(--forest-ink)] text-xs font-bold text-[var(--forest-ink)] flex items-center gap-2">
          <CheckCircle size={16} weight="fill" className="shrink-0" />
          <span>Autentikasi berhasil! Mengalihkan...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-primary)]">Email Administrator</label>
          <div className="relative">
            <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hargaku.id"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-primary)]">Kata Sandi</label>
          <div className="relative">
            <LockKey size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-secondary)] font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-ink)] accent-[var(--accent-chili)]"
            />
            <span>Ingat sesi saya</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="market-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          <ArrowRight size={16} weight="bold" />
        </button>
      </form>

      <div className="text-center pt-3 border-t border-[var(--border-subtle)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-chili)] transition-colors no-underline"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Kembali ke Website Publik</span>
        </Link>
      </div>
    </div>
  );
}
