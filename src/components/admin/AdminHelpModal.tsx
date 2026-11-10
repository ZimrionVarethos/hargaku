'use client';

import React from 'react';
import {
  X,
  Question,
  BookOpen,
  ShieldCheck,
  Lightning,
  EnvelopeSimple,
} from '@phosphor-icons/react';

interface AdminHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminHelpModal({ isOpen, onClose }: AdminHelpModalProps) {
  if (!isOpen) return null;

  const faqs = [
    {
      icon: Lightning,
      title: 'Entri Harga Harian',
      desc: 'Petugas lapangan menginput harga rata-rata komoditas dari seluruh pasar tradisional terdaftar setiap pagi pukul 06:00 – 08:00 WIB melalui menu Entri Harga Harian. Data langsung tersinkronisasi ke website publik.',
    },
    {
      icon: ShieldCheck,
      title: 'Moderasi Laporan Warga (MAD)',
      desc: 'Sistem otomatis mendeteksi anomali jika harga yang dilaporkan warga deviasi >25% dari HAP/HET atau rata-rata pasar. Laporan anomali wajib diperiksa foto struk/notanya sebelum disetujui.',
    },
    {
      icon: BookOpen,
      title: 'Katalog Komoditas & Pasar',
      desc: 'Gunakan tab Katalog Komoditas untuk mengubah batas HAP/HET resmi dan tab Pasar Tradisional untuk memperbarui koordinat GPS peta atau jam operasional lapak.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#0A120E]/65 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg market-card p-6 z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-ink)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[var(--forest-surface)] border-2 border-[var(--border-ink)] flex items-center justify-center text-[var(--forest-ink)]">
              <Question size={20} weight="bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Bantuan &amp; Panduan Admin
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">
                SOP Pengelolaan Data PasarKu
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="market-btn-secondary w-9 h-9 p-0 inline-flex items-center justify-center"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const Icon = faq.icon;
            return (
              <div
                key={faq.title}
                className="p-3.5 rounded-[12px] bg-[var(--bg-paper)] border border-[var(--border-subtle)] space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-[var(--text-primary)]">
                  <Icon size={16} weight="bold" className="text-[var(--accent-chili)]" />
                  <span>{faq.title}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {faq.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <EnvelopeSimple size={15} />
            <span>Kontak: support@hargaku.id</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="market-btn-primary px-4 py-1.5 text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
