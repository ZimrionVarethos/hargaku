import Link from 'next/link';
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
            <div className="md:col-span-6 space-y-2">
              <div className="font-bold text-2xl text-[var(--text-primary)]">
                Pasar<span className="text-[var(--accent-chili)]">Ku</span>{' '}
                <span className="text-sm font-medium text-[var(--text-secondary)]">Indonesia</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md">
                Platform independen alat bantu keputusan harga pangan pasar rakyat lintas wilayah Indonesia. Membantu pembeli membandingkan harga tawaran di lapak terhadap acuan nasional dan laporan warga.
              </p>
            </div>

            <div className="md:col-span-3 space-y-1.5 text-xs">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Jelajah PasarKu</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href="/indeks-harga"
                    className="font-bold underline text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                  >
                    Indeks Harga Lengkap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cek-harga"
                    className="font-bold underline text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                  >
                    Cek Harga &amp; PUNTEN AI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/peta"
                    className="font-bold underline text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                  >
                    Peta Harga Antar-Pasar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lapor"
                    className="font-bold underline text-[var(--text-primary)] hover:text-[var(--accent-chili)]"
                  >
                    Lapor Harga &amp; Stok
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-1.5 text-xs text-[var(--text-secondary)]">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Independensi &amp; Cakupan
              </h3>
              <p className="leading-relaxed">
                Web independen non-afiliasi pengelola pasar maupun instansi mana pun. Cakupan data lintas 6 koridor pulau (21+ provinsi) merujuk Bapanas RI, PIHPS BI, serta laporan warga anonim.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
