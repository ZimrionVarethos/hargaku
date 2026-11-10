'use client';

import React, { useState, useEffect } from 'react';
import type { AdminCommodity, CommodityCategory } from '@/lib/types/admin';
import { X } from '@phosphor-icons/react';

interface CommodityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AdminCommodity | null;
  onSave: (commodity: AdminCommodity) => void;
}

const CATEGORIES: Array<{ value: CommodityCategory; label: string }> = [
  { value: 'CABAI_BAWANG', label: 'Cabai & Bawang' },
  { value: 'BERAS', label: 'Beras & Padi' },
  { value: 'DAGING', label: 'Daging, Telur & Unggas' },
  { value: 'MINYAK', label: 'Minyak & Gula' },
  { value: 'SAYUR', label: 'Sayur Mayur' },
];

export function CommodityFormModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: CommodityFormModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<CommodityCategory>('CABAI_BAWANG');
  const [unit, setUnit] = useState('kg');
  const [hapHetPrice, setHapHetPrice] = useState('');
  const [tolerancePercentage, setTolerancePercentage] = useState('10');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setCategory(initialData.category);
      setUnit(initialData.unit);
      setHapHetPrice(initialData.hapHetPrice.toString());
      setTolerancePercentage(initialData.tolerancePercentage.toString());
      setIsActive(initialData.isActive);
      setError('');
    } else {
      setName('');
      setSlug('');
      setCategory('CABAI_BAWANG');
      setUnit('kg');
      setHapHetPrice('');
      setTolerancePercentage('10');
      setIsActive(true);
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama komoditas wajib diisi.');
      return;
    }
    const priceNum = parseInt(hapHetPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Harga acuan HAP/HET harus berupa angka positif.');
      return;
    }
    const tolNum = parseFloat(tolerancePercentage) || 10;

    const savedItem: AdminCommodity = {
      id: initialData?.id || slug || `com_${Date.now()}`,
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      category,
      unit: unit.trim() || 'kg',
      hapHetPrice: priceNum,
      tolerancePercentage: tolNum,
      isActive,
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#0A120E]/65 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg market-card p-6 z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-ink)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {initialData ? 'Edit Komoditas Pangan' : 'Tambah Komoditas Baru'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal komoditas"
            className="market-btn-secondary w-9 h-9 p-0 inline-flex items-center justify-center"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-[10px] bg-[var(--accent-chili-soft)] border-2 border-[var(--accent-chili)] text-xs font-bold text-[var(--accent-chili)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">Nama Komoditas</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Cabai Rawit Merah Super"
              className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommodityCategory)}
                className="w-full px-3 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Satuan Standar</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg / liter / ikat"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Harga Acuan HAP (Rp)</label>
              <input
                type="number"
                value={hapHetPrice}
                onChange={(e) => setHapHetPrice(e.target.value)}
                placeholder="57000"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] font-mono-num font-bold text-sm text-[var(--forest-ink)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Toleransi Wajar (&plusmn;%)</label>
              <input
                type="number"
                value={tolerancePercentage}
                onChange={(e) => setTolerancePercentage(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] font-mono-num text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-ink)] accent-[var(--accent-chili)]"
            />
            <label htmlFor="isActive" className="text-xs font-bold text-[var(--text-primary)] cursor-pointer">
              Tampilkan di Website Publik (Status Aktif)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="market-btn-secondary px-4 py-2 text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="market-btn-primary px-4 py-2 text-xs cursor-pointer"
            >
              Simpan Komoditas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
