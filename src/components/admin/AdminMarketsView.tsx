'use client';

import React, { useState } from 'react';
import type { AdminMarket } from '@/lib/types/admin';
import { useAdminStore } from '@/lib/store/admin-store';
import { MARKET_ISLAND_FILTERS, REGION_ISLAND_MAP } from './admin-data';
import { MarketFormModal } from './MarketFormModal';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminPagination } from './AdminPagination';
import {
  Plus,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
} from '@phosphor-icons/react';

const ITEMS_PER_PAGE = 10;

export function AdminMarketsView() {
  const { markets, addMarket, updateMarket, deleteMarket } = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedIsland, setSelectedIsland] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMarket | null>(null);
  const [deletingMarket, setDeletingMarket] = useState<{ id: string; name: string } | null>(null);

  const filtered = markets.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.district && item.district.toLowerCase().includes(q)) ||
      (item.address && item.address.toLowerCase().includes(q));

    const itemIsland = (item.regionId && REGION_ISLAND_MAP[item.regionId]) || 'JAWA';
    const matchesIsland = selectedIsland === 'ALL' || itemIsland === selectedIsland;

    return matchesSearch && matchesIsland;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMarkets = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleIslandChange = (islandId: string) => {
    setSelectedIsland(islandId);
    setCurrentPage(1);
  };

  const handleSave = (item: AdminMarket) => {
    if (editingItem) {
      updateMarket(item.id, item);
    } else {
      addMarket(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="market-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Kelola Pasar Tradisional
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Atur data sentra pasar per koridor wilayah untuk titik peta spasial 3D dan komparasi harga.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="market-btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>Tambah Pasar</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari pasar, kota, atau kecamatan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-[var(--shadow-hard-sm)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {MARKET_ISLAND_FILTERS.map((tab) => {
            const isSelected = selectedIsland === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleIslandChange(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'market-btn-primary'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-ink)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b-2 border-[var(--border-ink)]">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
              Daftar Sentra Pasar Tradisional
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Koordinat GPS, jam operasional bongkar muat, dan status pemantauan peta publik.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] w-fit">
            {filtered.length} Pasar Pantauan
          </span>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-2.5 pl-3.5 sm:pl-4 pr-4 min-w-[220px]">No. &amp; Pasar</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Titik GPS</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Jam Operasional</th>
                <th className="py-2.5 px-4 text-center whitespace-nowrap">Status Peta</th>
                <th className="py-2.5 pr-3.5 sm:pr-4 pl-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
              {paginatedMarkets.length > 0 ? (
                paginatedMarkets.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-muted)]/35 transition-colors">
                    <td className="py-3.5 pl-3.5 sm:pl-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            item.isActive
                              ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)]/45'
                              : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                          }`}
                        >
                          {startIndex + idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-[var(--text-primary)]">{item.name}</div>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            {item.city || 'Nasional'}, {item.district}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] font-mono-num font-bold text-[var(--text-secondary)]">
                        <MapPin size={12} weight="fill" className="text-[var(--accent-chili)] shrink-0" />
                        <span>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[var(--text-muted)] shrink-0" />
                        <span>{item.operatingHours}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => updateMarket(item.id, { isActive: !item.isActive })}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          item.isActive
                            ? 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]/40'
                            : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                        }`}
                      >
                        {item.isActive ? <CheckCircle size={13} weight="fill" /> : <XCircle size={13} weight="fill" />}
                        <span>{item.isActive ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 pr-3.5 sm:pr-4 pl-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          className="market-btn-secondary px-3 py-1.5 text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <PencilSimple size={13} weight="bold" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingMarket({ id: item.id, name: item.name })}
                          aria-label={`Hapus ${item.name}`}
                          className="p-1.5 rounded-lg border border-[var(--border-ink)] text-[var(--text-secondary)] hover:text-[var(--accent-chili)] hover:bg-[var(--accent-chili-soft)] transition-colors cursor-pointer"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-xs text-[var(--text-muted)]">
                    Tidak ada pasar tradisional yang sesuai dengan kata kunci pencarian atau wilayah ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <MarketFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSave={handleSave}
      />

      <AdminConfirmModal
        isOpen={Boolean(deletingMarket)}
        onClose={() => setDeletingMarket(null)}
        onConfirm={() => {
          if (deletingMarket) {
            deleteMarket(deletingMarket.id);
            setDeletingMarket(null);
          }
        }}
        title={`Hapus ${deletingMarket?.name || 'Pasar'}?`}
        description="Pasar ini akan dihapus dari data pantauan dan tidak lagi muncul di komparasi harga maupun peta spasial."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}
