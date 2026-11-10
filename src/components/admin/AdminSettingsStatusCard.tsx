'use client';

import React from 'react';
import { Database, Key, MapPin, CheckCircle, WarningCircle } from '@phosphor-icons/react';

export interface PublicAiSettingsDto {
  hasApiKey: boolean;
  maskedApiKey: string;
  hasMapboxToken?: boolean;
  maskedMapboxToken?: string;
  geminiModel: string;
  systemInstruction: string;
  enabledSources: string[];
  dbConnected: boolean;
  updatedAt: string | null;
}

interface Props {
  settings: PublicAiSettingsDto | null;
  feedback: { type: 'ok' | 'err'; text: string } | null;
}

export function AdminSettingsStatusCard({ settings, feedback }: Props) {
  return (
    <>
      <div className="bg-white border border-[#E5E3DE] rounded-3xl p-6 space-y-2">
        <h1 className="text-xl font-bold text-[#1B1A18]">
          Integrasi Database Supabase, Gemini AI &amp; Mapbox 3D
        </h1>
        <p className="text-xs text-[#706E6A] leading-relaxed">
          Kelola API Key Google Gemini (PUNTEN) dan token publik Mapbox GL JS secara dinamis dari tabel{' '}
          <code className="px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-[#E5E3DE]">
            system_settings
          </code>{' '}
          Supabase tanpa hardcode di kode sumber.
        </p>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              settings?.dbConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <Database size={15} weight="bold" />
            <span>Supabase PostgreSQL: {settings?.dbConnected ? 'Terhubung' : 'Offline'}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              settings?.hasApiKey
                ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <Key size={15} weight="bold" />
            <span>
              Kunci Gemini:{' '}
              {settings?.hasApiKey ? `Aktif (${settings.maskedApiKey})` : 'Belum disetel di DB'}
            </span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              settings?.hasMapboxToken
                ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <MapPin size={15} weight="bold" />
            <span>
              Mapbox 3D:{' '}
              {settings?.hasMapboxToken
                ? `Aktif (${settings.maskedMapboxToken})`
                : 'Belum disetel di DB'}
            </span>
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
            feedback.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'ok' ? (
            <CheckCircle size={18} weight="fill" />
          ) : (
            <WarningCircle size={18} weight="fill" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </>
  );
}

