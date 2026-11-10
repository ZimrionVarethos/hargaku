'use client';

import { Camera, CheckCircle, LockKey } from '@phosphor-icons/react';

export function LaporVerificationCard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="market-card p-5 sm:p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] tracking-tight">
            Bagaimana Laporan Warga &amp; Pedagang Diproses?
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            Setiap masukan disaring ketat dan digabungkan per pasar agar adil bagi pembeli maupun pedagang.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-[13px]">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-full bg-[var(--text-primary)] text-[var(--bg-paper)] flex items-center justify-center shrink-0 text-[12px] font-bold">
              1
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-[var(--text-primary)]">
                Sanitasi EXIF &amp; Anonimitas Penuh
              </span>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Koordinat GPS foto dihapus bersih dan sistem tidak pernah mencatat nama pedagang atau nomor kios individu.
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
                Laporan harga menyimpang melebihi 25% dari acuan pasar ditandai ke antrean moderasi agar bebas hoax dan spam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
            <div className="w-7 h-7 rounded-full bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)] flex items-center justify-center shrink-0 text-[12px] font-bold">
              3
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-[var(--text-primary)]">
                Agregasi Sinyal Harga &amp; Kelangkaan
              </span>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                Informasi barang yang sedang mahal dan status stok terbatas/langka tampil otomatis pada rincian tiap pasar.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="market-card p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <Camera size={18} weight="bold" className="text-[var(--accent-chili)]" />
          <span>Contoh Kontribusi Bermanfaat</span>
        </h3>

        <ul className="flex flex-col gap-2.5 text-[12px] text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <CheckCircle size={15} weight="fill" className="text-[var(--forest-ink)] shrink-0 mt-0.5" />
            <span>Warga: nota belanja atau foto timbangan saat harga eceran terasa melampaui acuan.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle size={15} weight="fill" className="text-[var(--forest-ink)] shrink-0 mt-0.5" />
            <span>Pedagang: info keterlambatan pasokan kiriman atau kekosongan stok dari distributor.</span>
          </li>
        </ul>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-start gap-2.5 text-[11px] text-[var(--text-muted)] leading-relaxed">
          <LockKey size={16} weight="bold" className="text-[var(--text-primary)] shrink-0 mt-0.5" />
          <span>
            <strong>Netralitas PasarKu:</strong> Data hanya disajikan per pasar rakyat, tidak pernah menyudutkan pelaku usaha individu.
          </span>
        </div>
      </div>
    </div>
  );
}
