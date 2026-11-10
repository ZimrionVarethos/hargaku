'use client';

import {
  Camera,
  CheckCircle,
  LockKey,
} from '@phosphor-icons/react';

export function LaporVerificationCard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="market-card p-5 sm:p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            Bagaimana Laporanmu Diproses?
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            Setiap data yang masuk disaring ketat agar bebas dari spam, hoax, dan manipulasi pasar.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-[13px]">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-[var(--bg-paper)] flex items-center justify-center shrink-0 text-[12px] font-bold">
              1
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-[var(--text-primary)]">
                Sanitasi EXIF &amp; Privasi Otomatis
              </span>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Metadata GPS koordinat perangkat dan nomor seri kamera dihapus bersih seketika di peramban sebelum file diunggah.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-[var(--bg-paper)] flex items-center justify-center shrink-0 text-[12px] font-bold">
              2
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-[var(--text-primary)]">
                Deteksi Anomali Statistik (MAD)
              </span>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Algoritma Median Absolute Deviation menyaring angka ekstrem yang melebihi batas wajar toleransi pasar (&gt; 2.5x deviasi).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-full bg-[#E2EFE6] text-[#245034] border border-[#245034] flex items-center justify-center shrink-0 text-[12px] font-bold">
              3
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-[var(--text-primary)]">
                Agregasi Konsensus Warga 7 Hari
              </span>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Hanya harga yang didukung minimal 3 laporan terverifikasi di pasar yang sama yang masuk ke indeks publik.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <Camera size={18} weight="bold" className="text-[var(--accent-chili)]" />
          <span>Panduan Bukti yang Sah</span>
        </h3>

        <ul className="flex flex-col gap-2.5 text-[12px] text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <CheckCircle size={15} weight="fill" className="text-[#245034] shrink-0 mt-0.5" />
            <span>Nota belanja / kertas kuitansi pasar dengan nominal dan tanggal.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={15} weight="fill" className="text-[#245034] shrink-0 mt-0.5" />
            <span>Papan label harga komoditas yang terpasang di kios lapak.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={15} weight="fill" className="text-[#245034] shrink-0 mt-0.5" />
            <span>Timbangan jarum atau digital yang memperlihatkan bobot komoditas.</span>
          </li>
        </ul>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-start gap-2.5 text-[11px] text-[var(--text-muted)] leading-relaxed">
          <LockKey size={16} weight="bold" className="text-[var(--text-primary)] shrink-0 mt-0.5" />
          <span>
            <strong>Privasi Pedagang Dijamin:</strong> HargaKu tidak mencatat atau mempublikasikan nama toko/individu. Data hanya diagregasikan per pasar.
          </span>
        </div>
      </div>
    </div>
  );
}
