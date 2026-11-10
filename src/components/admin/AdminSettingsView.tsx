'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Key,
  Robot,
  Eye,
  EyeSlash,
  WarningCircle,
  PlugsConnected,
  FloppyDisk,
} from '@phosphor-icons/react';
import { getAdminAuthHeaders, logoutAdmin } from '@/lib/auth/admin-auth';
import { AdminSettingsStatusCard, PublicAiSettingsDto } from './AdminSettingsStatusCard';

const MODEL_OPTIONS = [
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Direkomendasikan)' },
  { id: 'gemini-flash-latest', label: 'Gemini Flash Latest' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  { id: 'gemini-pro-latest', label: 'Gemini Pro Latest' },
];

const SOURCE_OPTIONS = [
  'Panel Harga Bapanas',
  'PIHPS Bank Indonesia',
  'Perumda PPJ Kota Bogor',
  'Laporan Warga Terverifikasi',
];

export function AdminSettingsView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [needsRelogin, setNeedsRelogin] = useState(false);
  const [settings, setSettings] = useState<PublicAiSettingsDto | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [geminiModel, setGeminiModel] = useState('gemini-3.8-flash');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [enabledSources, setEnabledSources] = useState<string[]>(SOURCE_OPTIONS);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        headers: { ...getAdminAuthHeaders() },
        cache: 'no-store',
      });
      if (res.status === 401) {
        setNeedsRelogin(true);
        return;
      }
      const json = (await res.json()) as { success?: boolean; data?: PublicAiSettingsDto };
      if (json.success && json.data) {
        setSettings(json.data);
        setGeminiModel(json.data.geminiModel);
        setSystemInstruction(json.data.systemInstruction);
        setEnabledSources(json.data.enabledSources);
        setNeedsRelogin(false);
      }
    } catch {
      setFeedback({ type: 'err', text: 'Gagal memuat konfigurasi dari server.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const toggleSource = (src: string) => {
    setEnabledSources((prev) =>
      prev.includes(src) ? prev.filter((item) => item !== src) : [...prev, src]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
        body: JSON.stringify({
          geminiApiKey: apiKeyInput.trim() || undefined,
          geminiModel,
          systemInstruction,
          enabledSources,
        }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        message?: string;
        data?: PublicAiSettingsDto;
      };
      if (!res.ok || !json.success) {
        setFeedback({ type: 'err', text: json.message || 'Gagal menyimpan konfigurasi.' });
        return;
      }
      if (json.data) setSettings(json.data);
      setApiKeyInput('');
      setFeedback({
        type: 'ok',
        text: 'Konfigurasi API Key, model, dan sumber pembanding berhasil disimpan ke Supabase.',
      });
    } catch {
      setFeedback({ type: 'err', text: 'Kesalahan jaringan saat menyimpan pengaturan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
        body: JSON.stringify({
          action: 'test',
          geminiApiKey: apiKeyInput.trim() || undefined,
          geminiModel,
        }),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      setFeedback({
        type: json.success ? 'ok' : 'err',
        text: json.message || (json.success ? 'Koneksi Gemini berhasil.' : 'Uji koneksi gagal.'),
      });
    } catch {
      setFeedback({ type: 'err', text: 'Gagal menghubungi endpoint uji Gemini.' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E5E3DE] rounded-3xl p-8 text-xs text-[#706E6A]">
        Memuat konfigurasi integrasi Supabase &amp; Gemini API...
      </div>
    );
  }

  if (needsRelogin) {
    return (
      <div className="bg-white border border-[#E5E3DE] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm">
          <WarningCircle size={20} weight="fill" />
          <span>Sesi Server Admin Perlu Diperbarui</span>
        </div>
        <p className="text-xs text-[#706E6A] leading-relaxed">
          Untuk mengelola kredensial API di database Supabase, silakan masuk ulang agar cookie sesi terverifikasi oleh server.
        </p>
        <button
          type="button"
          onClick={() => {
            logoutAdmin();
            router.push('/admin/login');
          }}
          className="px-4 py-2.5 rounded-xl bg-[#EEF773] text-[#1B1A18] border border-[#1B1A18] text-xs font-bold cursor-pointer"
        >
          Keluar &amp; Login Ulang Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <AdminSettingsStatusCard settings={settings} feedback={feedback} />

      <form onSubmit={handleSave} className="bg-white border border-[#E5E3DE] rounded-3xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B1A18] flex items-center gap-1.5">
              <Key size={14} weight="bold" />
              <span>Ganti / Setel Gemini API Key</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={settings?.hasApiKey ? 'Kosongkan jika tidak ingin ganti' : 'Tempel Google Gemini API Key...'}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E5E3DE] bg-[#FAF9F5] text-xs text-[#1B1A18] focus:outline-[#1B1A18]"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706E6A] hover:text-[#1B1A18]"
                aria-label="Tampilkan atau sembunyikan API Key"
              >
                {showKey ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B1A18] flex items-center gap-1.5">
              <Robot size={14} weight="bold" />
              <span>Model Gemini Aktif</span>
            </label>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3DE] bg-[#FAF9F5] text-xs font-medium text-[#1B1A18] focus:outline-[#1B1A18]"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#1B1A18] block">Sumber Pembanding Harga AI</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SOURCE_OPTIONS.map((src) => {
              const checked = enabledSources.includes(src);
              return (
                <label
                  key={src}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer ${
                    checked ? 'bg-[#FAF9F5] border-[#1B1A18] text-[#1B1A18]' : 'border-[#E5E3DE] text-[#706E6A]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSource(src)}
                    className="w-4 h-4 accent-[#1B1A18]"
                  />
                  <span>{src}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1B1A18]">Instruksi Sistem Asisten AI</label>
          <textarea
            rows={3}
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3DE] bg-[#FAF9F5] text-xs text-[#1B1A18] focus:outline-[#1B1A18]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || saving}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#1B1A18] text-xs font-bold text-[#1B1A18] hover:bg-[#FAF9F5] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <PlugsConnected size={16} weight="bold" />
            <span>{testing ? 'Menguji Koneksi...' : 'Uji Koneksi Gemini'}</span>
          </button>

          <button
            type="submit"
            disabled={saving || testing}
            className="px-5 py-2.5 rounded-xl bg-[#EEF773] border border-[#1B1A18] text-xs font-bold text-[#1B1A18] shadow-[2px_2px_0px_#1B1A18] hover:bg-[#e5ef63] inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <FloppyDisk size={16} weight="bold" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Konfigurasi ke Supabase'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
