'use client';

import React, { useState, useEffect } from 'react';
import type { AdminMarket } from '@/lib/types/admin';
import { MOCK_REGIONS } from '@/lib/mock/regions.data';
import { X } from '@phosphor-icons/react';

interface MarketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AdminMarket | null;
  onSave: (market: AdminMarket) => void;
}

const STANDARD_DISTRICTS = [
  'Wilayah Sentral / Pusat',
  'Wilayah Utara',
  'Wilayah Selatan',
  'Wilayah Barat',
  'Wilayah Timur',
  'Kawasan Pasar Induk',
];

export function MarketFormModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: MarketFormModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [city, setCity] = useState('DKI Jakarta');
  const [regionId, setRegionId] = useState('reg_jakarta');
  const [district, setDistrict] = useState(STANDARD_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('-6.2088');
  const [longitude, setLongitude] = useState('106.8456');
  const [operatingHours, setOperatingHours] = useState('04:00 – 14:00 WIB');
  const [specialty, setSpecialty] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setCity(initialData.city || 'DKI Jakarta');
      setRegionId(initialData.regionId || 'reg_jakarta');
      setDistrict(initialData.district);
      setAddress(initialData.address);
      setLatitude(initialData.latitude.toString());
      setLongitude(initialData.longitude.toString());
      setOperatingHours(initialData.operatingHours);
      setSpecialty(initialData.specialty);
      setIsActive(initialData.isActive);
      setError('');
    } else {
      setName('');
      setSlug('');
      setCity('DKI Jakarta');
      setRegionId('reg_jakarta');
      setDistrict(STANDARD_DISTRICTS[0]);
      setAddress('');
      setLatitude('-6.2088');
      setLongitude('106.8456');
      setOperatingHours('04:00 – 14:00 WIB');
      setSpecialty('');
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
      setError('Nama pasar tradisional wajib diisi.');
      return;
    }
    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Titik koordinat GPS latitude dan longitude harus berupa angka desimal.');
      return;
    }

    const savedMarket: AdminMarket = {
      id: initialData?.id || slug || `mkt_${Date.now()}`,
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      city: city.trim() || 'DKI Jakarta',
      regionId: regionId || 'reg_jakarta',
      district: district.trim() || 'Sentral',
      address: address.trim() || `${name.trim()}, ${city.trim()}`,
      latitude: latNum,
      longitude: lngNum,
      operatingHours: operatingHours.trim() || '04:00 – 14:00 WIB',
      specialty: specialty.trim() || 'Komoditas Pangan Tradisional',
      isActive,
    };

    onSave(savedMarket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#0A120E]/65 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg market-card p-6 z-10 max-h-[92vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-ink)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {initialData ? 'Edit Pasar Tradisional' : 'Tambah Pasar Tradisional Baru'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal pasar"
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
            <label className="text-xs font-bold text-[var(--text-primary)]">Nama Pasar Tradisional</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Pasar Induk Kramat Jati"
              className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">Provinsi / Koridor Wilayah Acuan</label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)] cursor-pointer"
            >
              {MOCK_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.islandName}) &middot; {r.logisticsCostPct > 0 ? `+${r.logisticsCostPct}% Ongkir Kapal` : 'Sentra Produksi (Acuan Nasional)'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Kota / Kabupaten</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Contoh: DKI Jakarta"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Kecamatan / Distrik</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Contoh: Kramat Jati"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)]">Alamat Lengkap</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Merdeka No. 12"
              className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Latitude GPS</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-6.5925"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] font-mono-num text-sm text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Longitude GPS</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="106.7905"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] font-mono-num text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Jam Bongkar Muat</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="04:00 – 14:00 WIB"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">Spesialisasi Lapak</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Sentra Cabai & Rempah"
                className="w-full px-3.5 py-2.5 rounded-[10px] border-2 border-[var(--border-ink)] bg-[var(--bg-paper)] focus:bg-[var(--bg-card)] text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isMarketActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-ink)] accent-[var(--accent-chili)]"
            />
            <label htmlFor="isMarketActive" className="text-xs font-bold text-[var(--text-primary)] cursor-pointer">
              Pantau Pasar di Peta Publik (Status Aktif)
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
              Simpan Pasar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
