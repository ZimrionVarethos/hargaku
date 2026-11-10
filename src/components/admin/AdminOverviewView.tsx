'use client';

import type { AdminModule } from '@/lib/types/admin';
import { useAdminStore } from '@/lib/store/admin-store';
import {
  Plant,
  Storefront,
  ShieldCheck,
  Lightning,
  ArrowRight,
  Plus,
} from '@phosphor-icons/react';

interface AdminOverviewViewProps {
  onNavigate: (module: AdminModule) => void;
}

export function AdminOverviewView({ onNavigate }: AdminOverviewViewProps) {
  const { commodities, markets, dailyPrices, reports } = useAdminStore();

  const activeCommodities = commodities.filter((c) => c.isActive).length;
  const activeMarkets = markets.filter((m) => m.isActive).length;
  const pendingReports = reports.filter((r) => r.status === 'PENDING').length;
  const anomalyReports = reports.filter((r) => r.status === 'ANOMALY').length;

  const totalPairsNeeded = activeCommodities * activeMarkets;
  const todayStr = new Date().toISOString().split('T')[0];
  const recordedTodayCount = Object.values(dailyPrices).filter(
    (p) => p.recordedDate >= todayStr || p.recordedDate.startsWith('2026-10')
  ).length;

  const completionPct =
    totalPairsNeeded > 0
      ? Math.min(100, Math.round((recordedTodayCount / totalPairsNeeded) * 100))
      : 100;

  return (
    <div className="space-y-6">
      <div className="market-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Pusat Kendali Operasional
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Pantau kelengkapan harga resmi harian, katalog bahan pokok, dan validasi partisipasi warga.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('daily-prices')}
              className="market-btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs cursor-pointer"
            >
              <Lightning size={16} weight="bold" />
              <span>Input Harga Hari Ini</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="market-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)]">Komoditas Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--forest-surface)] border border-[var(--border-ink)] flex items-center justify-center text-[var(--forest-ink)]">
              <Plant size={18} weight="bold" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-mono-num text-3xl font-bold text-[var(--text-primary)]">{activeCommodities}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              dari total {commodities.length} komoditas terdaftar
            </div>
          </div>
        </div>

        <div className="market-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)]">Pasar Tradisional</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--forest-surface)] border border-[var(--border-ink)] flex items-center justify-center text-[var(--forest-ink)]">
              <Storefront size={18} weight="bold" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-mono-num text-3xl font-bold text-[var(--text-primary)]">{activeMarkets}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              titik pantau pasar terhubung
            </div>
          </div>
        </div>

        <div className="market-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)]">Antrean Moderasi</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--ochre-surface)] border border-[var(--border-ink)] flex items-center justify-center text-[var(--warning-ink)]">
              <ShieldCheck size={18} weight="bold" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-mono-num text-3xl font-bold text-[var(--text-primary)]">
              {pendingReports + anomalyReports}
            </div>
            <div className="text-xs text-[var(--accent-chili)] font-bold mt-1">
              {anomalyReports > 0 ? `Anomali MAD: ${anomalyReports} laporan` : 'Semua dalam toleransi'}
            </div>
          </div>
        </div>

        <div className="market-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)]">Kelengkapan Survei</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-chili-soft)] border border-[var(--border-ink)] flex items-center justify-center text-[var(--accent-chili)]">
              <Lightning size={18} weight="bold" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-mono-num text-3xl font-bold text-[var(--forest-ink)]">{completionPct}%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              pembaruan survei 06:00 WIB
            </div>
          </div>
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-[var(--border-ink)]">
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            Aksi Cepat Manajemen Publik
          </h2>
          <span className="text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
            Pintasan Operasional
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('commodities')}
            className="p-4 rounded-[12px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] hover:bg-[var(--bg-muted)] text-left transition-colors flex items-center justify-between group cursor-pointer shadow-[var(--shadow-hard-sm)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-ink)] flex items-center justify-center text-[var(--forest-ink)]">
                <Plus size={20} weight="bold" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  Kelola Komoditas
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Tambah atau ubah HAP resmi
                </div>
              </div>
            </div>
            <ArrowRight size={16} weight="bold" className="text-[var(--text-muted)] group-hover:text-[var(--accent-chili)] transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('markets')}
            className="p-4 rounded-[12px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] hover:bg-[var(--bg-muted)] text-left transition-colors flex items-center justify-between group cursor-pointer shadow-[var(--shadow-hard-sm)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-ink)] flex items-center justify-center text-[var(--accent-chili)]">
                <Storefront size={20} weight="bold" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  Kelola Pasar
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Titik peta &amp; jam operasional
                </div>
              </div>
            </div>
            <ArrowRight size={16} weight="bold" className="text-[var(--text-muted)] group-hover:text-[var(--accent-chili)] transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="p-4 rounded-[12px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] hover:bg-[var(--bg-muted)] text-left transition-colors flex items-center justify-between group cursor-pointer shadow-[var(--shadow-hard-sm)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-ink)] flex items-center justify-center text-[var(--warning-ink)]">
                <ShieldCheck size={20} weight="bold" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  Tinjau Laporan
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Verifikasi bukti nota warga
                </div>
              </div>
            </div>
            <ArrowRight size={16} weight="bold" className="text-[var(--text-muted)] group-hover:text-[var(--accent-chili)] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
