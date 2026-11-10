import React from 'react';

export function Footer() {
  return (
    <footer className="bg-[var(--bg-muted)] border-t-2 border-[var(--border-ink)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-2">
            <div className="font-bold text-2xl text-[var(--text-primary)]">
              Pasar<span className="text-[var(--accent-chili)]">Ku</span>{' '}
              <span className="text-sm font-medium text-[var(--text-secondary)]">Kota Bogor</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Platform digital untuk menjelajahi, membandingkan, dan memantau harga komoditas pasar di Kota Bogor secara real-time berdasarkan publikasi resmi Perumda Pasar Pakuan Jaya Kota Bogor.
            </p>
          </div>

          {/* Perumda PPJ Office Information */}
          <div className="md:col-span-4 space-y-1.5 text-xs text-[var(--text-secondary)]">
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Kantor Pusat Perumda Pasar Pakuan Jaya
            </h3>
            <p className="leading-relaxed">
              Blok F Trade Center Pasar Kebon Kembang Lantai 3, Jl. Dewi Sartika, Kel. Cibogor, Kec. Bogor Tengah, Kota Bogor 16124
            </p>
            <p>Telepon: (0251) 8330313 | Email: info@pasarpakuanjaya.co.id</p>
          </div>

          {/* Verified Data References */}
          <div className="md:col-span-3 space-y-1.5 text-xs">
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Referensi Data Terverifikasi
            </h3>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://pasarpakuanjaya.co.id/komoditas/index/view-all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                >
                  Tabel Index Harga Perumda PPJ
                </a>
              </li>
              <li>
                <a
                  href="https://www.pasarpakuanjaya.co.id/pasar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                >
                  Daftar 13 Unit Pasar Kota Bogor
                </a>
              </li>
              <li>
                <a
                  href="https://pasarpakuanjaya.co.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                >
                  Portal Resmi Perumda PPJ
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-muted)] gap-2">
          <span>&copy; {new Date().getFullYear()} PasarKu Kota Bogor. Hak cipta dilindungi.</span>
          <span>Inisiatif transparansi pangan publik: Tanpa bias komersial.</span>
        </div>
      </div>
    </footer>
  );
}
