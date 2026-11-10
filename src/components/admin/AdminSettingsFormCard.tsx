'use client';

import React, { useState } from 'react';
import {
  Key,
  Robot,
  Eye,
  EyeSlash,
  PlugsConnected,
  FloppyDisk,
  MapPin,
} from '@phosphor-icons/react';
import type { PublicAiSettingsDto } from './AdminSettingsStatusCard';

const MODEL_OPTIONS = [
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Direkomendasikan)' },
  { id: 'gemini-flash-latest', label: 'Gemini Flash Latest' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  { id: 'gemini-pro-latest', label: 'Gemini Pro Latest' },
];

export const AI_SOURCE_OPTIONS = [
  'Panel Harga Bapanas',
  'PIHPS Bank Indonesia',
  'Perumda PPJ Kota Bogor',
  'Laporan Warga Terverifikasi',
];

interface Props {
  settings: PublicAiSettingsDto | null;
  apiKeyInput: string;
  onApiKeyChange: (val: string) => void;
  mapboxTokenInput: string;
  onMapboxTokenChange: (val: string) => void;
  geminiModel: string;
  onGeminiModelChange: (val: string) => void;
  systemInstruction: string;
  onSystemInstructionChange: (val: string) => void;
  enabledSources: string[];
  onToggleSource: (src: string) => void;
  saving: boolean;
  testingGemini: boolean;
  testingMapbox: boolean;
  onTestGemini: () => void;
  onTestMapbox: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdminSettingsFormCard({
  settings,
  apiKeyInput,
  onApiKeyChange,
  mapboxTokenInput,
  onMapboxTokenChange,
  geminiModel,
  onGeminiModelChange,
  systemInstruction,
  onSystemInstructionChange,
  enabledSources,
  onToggleSource,
  saving,
  testingGemini,
  testingMapbox,
  onTestGemini,
  onTestMapbox,
  onSubmit,
}: Props) {
  const [showKey, setShowKey] = useState(false);
  const [showMapbox, setShowMapbox] = useState(false);
  const busy = saving || testingGemini || testingMapbox;

  return (
    <form onSubmit={onSubmit} className="bg-white border border-[#E5E3DE] rounded-3xl p-6 space-y-5">
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
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder={
                settings?.hasApiKey
                  ? 'Kosongkan jika tidak ingin ganti'
                  : 'Tempel Google Gemini API Key...'
              }
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E5E3DE] bg-[#FAF9F5] text-xs text-[#1B1A18] focus:outline-[#1B1A18]"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706E6A] hover:text-[#1B1A18]"
              aria-label="Tampilkan atau sembunyikan Gemini API Key"
            >
              {showKey ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1B1A18] flex items-center gap-1.5">
            <Robot size={14} weight="bold" />
            <span>Model Gemini Aktif (PUNTEN)</span>
          </label>
          <select
            value={geminiModel}
            onChange={(e) => onGeminiModelChange(e.target.value)}
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

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#1B1A18] flex items-center gap-1.5">
          <MapPin size={14} weight="bold" />
          <span>Mapbox Access Token (Peta 3D 13 Unit Pasar)</span>
        </label>
        <div className="relative">
          <input
            type={showMapbox ? 'text' : 'password'}
            value={mapboxTokenInput}
            onChange={(e) => onMapboxTokenChange(e.target.value)}
            placeholder={
              settings?.hasMapboxToken
                ? `Tersimpan (${settings.maskedMapboxToken}) - isi hanya untuk mengganti`
                : 'Tempel Mapbox Public Token (pk.eyJ1...)...'
            }
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E5E3DE] bg-[#FAF9F5] text-xs text-[#1B1A18] focus:outline-[#1B1A18]"
          />
          <button
            type="button"
            onClick={() => setShowMapbox((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706E6A] hover:text-[#1B1A18]"
            aria-label="Tampilkan atau sembunyikan Token Mapbox"
          >
            {showMapbox ? <EyeSlash size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-[11px] text-[#706E6A]">
          Disimpan dinamis ke <code className="px-1 bg-[#FAF9F5] rounded">system_settings</code> agar Peta 3D tidak hardcode token di kode sumber.
        </p>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-[#1B1A18] block">Sumber Pembanding Harga AI</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AI_SOURCE_OPTIONS.map((src) => {
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
                  onChange={() => onToggleSource(src)}
                  className="w-4 h-4 accent-[#1B1A18]"
                />
                <span>{src}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#1B1A18]">Instruksi Sistem Asisten PUNTEN</label>
        <textarea
          rows={3}
          value={systemInstruction}
          onChange={(e) => onSystemInstructionChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3DE] bg-[#FAF9F5] text-xs text-[#1B1A18] focus:outline-[#1B1A18]"
        />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onTestGemini}
          disabled={busy}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#1B1A18] text-xs font-bold text-[#1B1A18] hover:bg-[#FAF9F5] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <PlugsConnected size={16} weight="bold" />
          <span>{testingGemini ? 'Menguji Gemini...' : 'Uji Koneksi Gemini'}</span>
        </button>

        <button
          type="button"
          onClick={onTestMapbox}
          disabled={busy}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#1B1A18] text-xs font-bold text-[#1B1A18] hover:bg-[#FAF9F5] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <MapPin size={16} weight="bold" />
          <span>{testingMapbox ? 'Menguji Mapbox...' : 'Uji Token Mapbox'}</span>
        </button>

        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2.5 rounded-xl bg-[#EEF773] border border-[#1B1A18] text-xs font-bold text-[#1B1A18] shadow-[2px_2px_0px_#1B1A18] hover:bg-[#e5ef63] inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <FloppyDisk size={16} weight="bold" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Konfigurasi ke Supabase'}</span>
        </button>
      </div>
    </form>
  );
}

