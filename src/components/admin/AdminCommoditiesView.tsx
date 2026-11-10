'use client';

import { useState } from 'react';
import type { AdminCommodity } from '@/lib/types/admin';
import { useAdminStore } from '@/lib/store/admin-store';
import { COMMODITY_CATEGORY_FILTERS } from './admin-data';
import { CommodityFormModal } from './CommodityFormModal';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminPagination } from './AdminPagination';
import {
  Plus,
  MagnifyingGlass,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react';

const CATEGORY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  COMMODITY_CATEGORY_FILTERS.filter((c) => c.id !== 'ALL').map((c) => [c.id, c.label])
);

export function AdminCommoditiesView() {
  const { commodities, addCommodity, updateCommodity, deleteCommodity } =
    useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminCommodity | null>(null);
  const [deletingCommodity, setDeletingCommodity] = useState<{ id: string; name: string } | null>(null);

  const ITEMS_PER_PAGE = 10;

  const filtered = commodities.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCommodities = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminCommodity) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (item: AdminCommodity) => {
    if (editingItem) {
      updateCommodity(item.id, item);
    } else {
      addCommodity(item);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeletingCommodity({ id, name });
  };

  const handleToggleActive = (item: AdminCommodity) => {
    updateCommodity(item.id, { isActive: !item.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="market-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Kelola Komoditas Pangan
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Atur nama, kategori, harga acuan HAP/HET Bapanas, dan status tayang di publik.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="market-btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          <span>Tambah Komoditas</span>
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
            placeholder="Cari komoditas atau slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-[var(--shadow-hard-sm)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {COMMODITY_CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'market-btn-primary'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-ink)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b-2 border-[var(--border-ink)]">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
              Katalog Komoditas &amp; Acuan HAP
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Klik status publik untuk mengaktifkan atau menonaktifkan komoditas di katalog warga.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] w-fit">
            {filtered.length} Komoditas Terdata
          </span>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-2.5 pl-3.5 sm:pl-4 pr-4 min-w-[210px]">No. &amp; Komoditas</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Kategori</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Satuan</th>
                <th className="py-2.5 px-4 text-right whitespace-nowrap">HAP Resmi</th>
                <th className="py-2.5 px-4 text-center whitespace-nowrap">Toleransi</th>
                <th className="py-2.5 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-2.5 pr-3.5 sm:pr-4 pl-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[13px]">
              {paginatedCommodities.length > 0 ? (
                paginatedCommodities.map((item, idx) => (
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
                          <span className="text-[11px] text-[var(--text-muted)]">{item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                        {CATEGORY_LABEL_MAP[item.category] || item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                      / {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono-num font-extrabold text-[var(--forest-ink)] tabular-nums text-[14px] whitespace-nowrap">
                      Rp {item.hapHetPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--ochre-surface)] text-[var(--warning-ink)] border border-[var(--earth-ochre)]/45 font-mono-num tabular-nums">
                        &plusmn;{item.tolerancePercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
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
                          onClick={() => handleOpenEdit(item)}
                          className="market-btn-secondary px-3 py-1.5 text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <PencilSimple size={13} weight="bold" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
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
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-[var(--text-muted)]">
                    Tidak ada komoditas yang cocok dengan filter pencarian ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        itemLabel="komoditas pangan"
        onPageChange={setCurrentPage}
      />

      <CommodityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSave={handleSave}
      />

      <AdminConfirmModal
        isOpen={Boolean(deletingCommodity)}
        onClose={() => setDeletingCommodity(null)}
        onConfirm={() => {
          if (deletingCommodity) {
            deleteCommodity(deletingCommodity.id);
            setDeletingCommodity(null);
          }
        }}
        title={`Hapus ${deletingCommodity?.name || 'Komoditas'}?`}
        description="Komoditas ini akan dihapus dari katalog harga publik, grafik tren, dan formulir cek harga."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
      />
    </div>
  );
}
