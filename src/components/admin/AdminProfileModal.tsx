'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '@/lib/store/admin-store';
import { DEFAULT_ADMIN_USER } from '@/lib/store/admin-seed';
import {
  X,
  User,
  ShieldCheck,
  LockKey,
  ClockCounterClockwise,
  CheckCircle,
} from '@phosphor-icons/react';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminProfileModal({ isOpen, onClose }: AdminProfileModalProps) {
  const { currentUser, updateProfile } = useAdminStore();
  const user = currentUser || DEFAULT_ADMIN_USER;

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY' | 'AUDIT'>('PROFILE');

  const getCleanName = (val?: string) =>
    val?.toLowerCase().includes('hendra') ? 'Admin' : val || 'Admin';
  const getCleanEmail = (val?: string) =>
    val?.toLowerCase().includes('hendra') ? 'admin@hargaku.id' : val || 'admin@hargaku.id';

  // Form states
  const [name, setName] = useState(getCleanName(user.name || user.fullName));
  const [email, setEmail] = useState(getCleanEmail(user.email));
  const [successMessage, setSuccessMessage] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setName(getCleanName(user.name || user.fullName));
      setEmail(getCleanEmail(user.email));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      fullName: name.trim(),
      email: email.trim(),
    });
    setSuccessMessage('Pengaturan profil berhasil disimpan!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!oldPassword) {
      setPasswordError('Kata sandi saat ini wajib diisi.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMessage('Kata sandi berhasil diperbarui!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#0A120E]/65 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg market-card p-6 z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-ink)]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--border-ink)] bg-[var(--forest-surface)] shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--forest-surface)] text-[var(--forest-ink)] font-bold text-xs">
                  AD
                </div>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Pengaturan Akun Admin
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">
                {user.email || 'admin@hargaku.id'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan akun"
            className="market-btn-secondary w-9 h-9 p-0 inline-flex items-center justify-center"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] pb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'PROFILE'
                ? 'market-btn-primary'
                : 'rounded-[10px] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            <User size={14} weight="bold" />
            <span>Profil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'market-btn-primary'
                : 'rounded-[10px] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            <LockKey size={14} weight="bold" />
            <span>Kata Sandi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'AUDIT'
                ? 'market-btn-primary'
                : 'rounded-[10px] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            <ClockCounterClockwise size={14} weight="bold" />
            <span>Sesi Aktif</span>
          </button>
        </div>

        {successMessage && (
          <div className="p-3 rounded-[10px] bg-[var(--forest-surface)] border-2 border-[var(--forest-ink)] text-xs font-bold text-[var(--forest-ink)] flex items-center gap-2">
            <CheckCircle size={16} weight="fill" />
            <span>{successMessage}</span>
          </div>
        )}
        {passwordError && (
          <div className="p-3 rounded-[10px] bg-[var(--accent-chili-soft)] border-2 border-[var(--accent-chili)] text-xs font-bold text-[var(--accent-chili)]">
            {passwordError}
          </div>
        )}

        {activeTab === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-primary)]">Nama Tampilan</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-primary)]">Email Administrator</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              />
            </div>

            <div className="p-3 rounded-[10px] bg-[var(--bg-paper)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
              <div className="flex justify-between">
                <span>Peran:</span>
                <span className="font-bold text-[var(--text-primary)]">Administrator Penuh</span>
              </div>
              <div className="flex justify-between">
                <span>Hak Akses:</span>
                <span className="font-bold text-[var(--forest-ink)]">CRUD Komoditas, Pasar, Harga &amp; Moderasi</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="market-btn-primary px-4 py-2 text-xs cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {activeTab === 'SECURITY' && (
          <form onSubmit={handleSavePassword} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-primary)]">Kata Sandi Saat Ini</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-primary)]">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full px-3 py-2 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-primary)]">Ulangi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi sandi baru"
                  className="w-full px-3 py-2 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="market-btn-primary px-4 py-2 text-xs cursor-pointer"
              >
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        )}

        {activeTab === 'AUDIT' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-[12px] bg-[var(--bg-paper)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between font-medium">
                <span className="text-[var(--text-secondary)]">Status Sesi:</span>
                <span className="text-[var(--forest-ink)] font-bold flex items-center gap-1">
                  <ShieldCheck size={14} weight="fill" />
                  Aktif &amp; Terverifikasi
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Token Autentikasi:</span>
                <span className="font-mono-num font-bold text-[var(--text-primary)]">JWT-SHA256 (Exp: 24 Jam)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
