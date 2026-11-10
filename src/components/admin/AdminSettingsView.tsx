'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WarningCircle } from '@phosphor-icons/react';
import { getAdminAuthHeaders, logoutAdmin } from '@/lib/auth/admin-auth';
import { AdminSettingsStatusCard, PublicAiSettingsDto } from './AdminSettingsStatusCard';
import { AdminSettingsFormCard, AI_SOURCE_OPTIONS } from './AdminSettingsFormCard';

export function AdminSettingsView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [needsRelogin, setNeedsRelogin] = useState(false);
  const [settings, setSettings] = useState<PublicAiSettingsDto | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [mapboxTokenInput, setMapboxTokenInput] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-3.8-flash');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [enabledSources, setEnabledSources] = useState<string[]>(AI_SOURCE_OPTIONS);
  const [saving, setSaving] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [testingMapbox, setTestingMapbox] = useState(false);
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
          mapboxAccessToken: mapboxTokenInput.trim() || undefined,
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
      setMapboxTokenInput('');
      setFeedback({
        type: 'ok',
        text: 'Konfigurasi Gemini AI, Mapbox, dan sumber pembanding berhasil disimpan ke Supabase.',
      });
    } catch {
      setFeedback({ type: 'err', text: 'Kesalahan jaringan saat menyimpan pengaturan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestGemini = async () => {
    setTestingGemini(true);
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
      setTestingGemini(false);
    }
  };

  const handleTestMapbox = async () => {
    setTestingMapbox(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
        body: JSON.stringify({
          action: 'test-mapbox',
          mapboxAccessToken: mapboxTokenInput.trim() || undefined,
        }),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      setFeedback({
        type: json.success ? 'ok' : 'err',
        text: json.message || (json.success ? 'Token Mapbox valid.' : 'Uji token Mapbox gagal.'),
      });
    } catch {
      setFeedback({ type: 'err', text: 'Gagal menguji token Mapbox.' });
    } finally {
      setTestingMapbox(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E5E3DE] rounded-3xl p-8 text-xs text-[#706E6A]">
        Memuat konfigurasi integrasi Supabase, Gemini AI &amp; Mapbox...
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
          Untuk mengelola kredensial API &amp; token Mapbox di database Supabase, silakan masuk ulang agar cookie sesi terverifikasi oleh server.
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

      <AdminSettingsFormCard
        settings={settings}
        apiKeyInput={apiKeyInput}
        onApiKeyChange={setApiKeyInput}
        mapboxTokenInput={mapboxTokenInput}
        onMapboxTokenChange={setMapboxTokenInput}
        geminiModel={geminiModel}
        onGeminiModelChange={setGeminiModel}
        systemInstruction={systemInstruction}
        onSystemInstructionChange={setSystemInstruction}
        enabledSources={enabledSources}
        onToggleSource={toggleSource}
        saving={saving}
        testingGemini={testingGemini}
        testingMapbox={testingMapbox}
        onTestGemini={handleTestGemini}
        onTestMapbox={handleTestMapbox}
        onSubmit={handleSave}
      />
    </div>
  );
}
