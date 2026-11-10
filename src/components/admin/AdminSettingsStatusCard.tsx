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
      <div className="market-card p-5 sm:p-6 space-y-3">
        <div className="pb-3 border-b-2 border-[var(--border-ink)]">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Integrasi Database Supabase, Gemini AI &amp; Mapbox 3D
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
            Kelola API Key Google Gemini (PUNTEN) dan token publik Mapbox GL JS secara dinamis dari tabel{' '}
            <code className="px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-mono-num">
              system_settings
            </code>{' '}
            Supabase tanpa hardcode di kode sumber.
          </p>
        </div>

        <div className="pt-1 flex flex-wrap gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              settings?.dbConnected
                ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]/40'
                : 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]/40'
            }`}
          >
            <Database size={15} weight="bold" />
            <span>Supabase PostgreSQL: {settings?.dbConnected ? 'Terhubung' : 'Offline'}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              settings?.hasApiKey
                ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]/40'
                : 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--earth-ochre)]/45'
            }`}
          >
            <Key size={15} weight="bold" />
            <span>
              Kunci Gemini:{' '}
              {settings?.hasApiKey ? `Aktif (${settings.maskedApiKey})` : 'Belum disetel di DB'}
            </span>
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              settings?.hasMapboxToken
                ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]/40'
                : 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--earth-ochre)]/45'
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
          className={`p-4 rounded-[12px] border-2 text-xs font-bold flex items-center gap-2.5 ${
            feedback.type === 'ok'
              ? 'bg-[var(--forest-surface)] border-[var(--forest-ink)] text-[var(--forest-ink)]'
              : 'bg-[var(--accent-chili-soft)] border-[var(--accent-chili)] text-[var(--accent-chili)]'
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

