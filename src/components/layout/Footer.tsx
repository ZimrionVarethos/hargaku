import { FooterMarketPanorama } from '@/components/layout/FooterMarketPanorama';
import { FooterScenicBackdrop } from '@/components/layout/FooterScenicBackdrop';

export function Footer() {
  return (
    <footer className="bg-[var(--bg-muted)] mt-auto overflow-hidden">
      <FooterMarketPanorama />

      <div className="relative w-full overflow-hidden bg-[var(--bg-muted)]">
        <FooterScenicBackdrop />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-36 xl:px-24 pt-12 pb-28 sm:pt-14 sm:pb-32 md:pt-16 md:pb-36 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7">
            <div className="md:col-span-5 space-y-2">
              <div className="font-bold text-2xl text-[var(--text-primary)]">
                Pasar<span className="text-[var(--accent-chili)]">Ku</span>{' '}
                <span className="text-sm font-medium text-[var(--text-secondary)]">Kota Bogor</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Platform digital untuk menjelajahi, membandingkan, dan memantau harga komoditas pasar di Kota Bogor secara real-time berdasarkan publikasi resmi Perumda Pasar Pakuan Jaya Kota Bogor.
              </p>
            </div>

            <div className="md:col-span-4 space-y-1.5 text-xs text-[var(--text-secondary)]">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Kantor Pusat Perumda Pasar Pakuan Jaya
              </h3>
              <p className="leading-relaxed">
                Blok F Trade Center Pasar Kebon Kembang Lantai 3, Jl. Dewi Sartika, Kel. Cibogor, Kec. Bogor Tengah, Kota Bogor 16124
              </p>
              <p>Telepon: (0251) 8330313 | Email: info@pasarpakuanjaya.co.id</p>
            </div>

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
        </div>
      </div>
    </footer>
  );
}
