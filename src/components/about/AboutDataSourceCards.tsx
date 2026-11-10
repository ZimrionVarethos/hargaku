import { Database, ArrowSquareOut, Buildings, Bank, UsersFour, ChartLineUp } from '@phosphor-icons/react/dist/ssr';

interface DataSourceItem {
  id: string;
  name: string;
  institution: string;
  badge: string;
  badgeClass: string;
  role: string;
  cadence: string;
  description: string;
  linkText: string;
  href: string;
  icon: typeof Buildings;
}

const DATA_SOURCES: DataSourceItem[] = [
  {
    id: 'bapanas',
    name: 'Badan Pangan Nasional (Bapanas)',
    institution: 'Republik Indonesia',
    badge: 'Pemerintah Pusat',
    badgeClass: 'bg-[#FBE9E6] text-[var(--accent-chili)] border border-[var(--accent-chili)]',
    role: 'Lapis 1: Harga Acuan Penjualan (HAP) & HET',
    cadence: 'Regulasi Berkala (Perbadan No. 11/2022 & Update 2024)',
    description:
      'Penetapan ambang batas harga acuan di tingkat produsen dan konsumen sebagai patokan resmi stabilitas pangan nasional dan pencegahan inflasi.',
    linkText: 'Kunjungi Panel Harga Bapanas',
    href: 'https://panelharga.badanpangan.go.id',
    icon: Buildings,
  },
  {
    id: 'pihps',
    name: 'PIHPS Nasional (Bank Indonesia)',
    institution: 'Bank Sentral Republik Indonesia',
    badge: 'Bank Sentral',
    badgeClass: 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]',
    role: 'Lapis 2: Rerata Harian Pasar Tradisional Terkalibrasi Wilayah',
    cadence: 'Pembaruan Harian Pukul 06:00 s.d. 09:00 WIB',
    description:
      'Survei harga harian terstandar langsung dari pasar-pasar tradisional strategis untuk mengukur tekanan inflasi pangan bergejolak (volatile foods).',
    linkText: 'Kunjungi PIHPS Nasional',
    href: 'https://www.bi.go.id/hargapangan',
    icon: Bank,
  },
  {
    id: 'crowdsourcing',
    name: 'Laporan Lapak Warga (Crowdsourcing)',
    institution: 'Komunitas Konsumen & Pembeli Cerdas Indonesia',
    badge: 'Partisipasi Publik',
    badgeClass: 'bg-[#E2EFE6] text-[#245034] border border-[#245034]',
    role: 'Lapis 3: Harga Riil di Kios Lapak Harian',
    cadence: 'Real-time Terverifikasi Konsensus 7 Hari',
    description:
      'Laporan langsung dari struk belanja dan timbangan warga yang difilter melalui sanitasi EXIF dan algoritma Median Absolute Deviation (MAD).',
    linkText: 'Coba Fitur Lapor Warga',
    href: '/lapor',
    icon: UsersFour,
  },
  {
    id: 'tpid',
    name: 'TPID & Dinas Perdagangan Daerah',
    institution: 'Pemerintah Daerah & Satgas Pangan',
    badge: 'Pemerintah Daerah',
    badgeClass: 'bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)]',
    role: 'Konteks Wilayah: Distribusi & Sentra Pasar Daerah',
    cadence: 'Mingguan & Pemantauan Khusus Hari Besar',
    description:
      'Data zonasi distribusi pangan, pasokan dari pasar induk distribusi, serta data intervensi operasi pasar murah untuk stabilisasi harga daerah.',
    linkText: 'Lihat Peta Pasar Wilayah',
    href: '/peta',
    icon: ChartLineUp,
  },
];

export function AboutDataSourceCards() {
  return (
    <section id="sumber-data" className="space-y-5 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b-2 border-[var(--border-ink)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database size={18} weight="bold" className="text-[var(--accent-chili)]" />
            <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
              Katalog Integritas
            </span>
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[var(--text-primary)] tracking-tight">
            Sumber Data Resmi yang Dirujuk
          </h2>
        </div>
        <div className="text-[12px] text-[var(--text-secondary)]">
          4 pilar data terintegrasi tanpa manipulasi sepihak
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DATA_SOURCES.map((source) => {
          const Icon = source.icon;
          const isExternal = source.href.startsWith('http');

          return (
            <div
              key={source.id}
              className="market-card p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${source.badgeClass}`}
                  >
                    {source.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                    <Icon size={18} weight="bold" />
                  </div>
                </div>

                <div>
                  <h3 className="text-[17px] font-bold text-[var(--text-primary)] leading-snug">
                    {source.name}
                  </h3>
                  <p className="text-[12px] font-bold text-[var(--accent-chili)] mt-0.5">
                    {source.role}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--text-primary)]">Pembaruan: </span>
                  {source.cadence}
                </div>

                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {source.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <a
                  href={source.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-chili)] transition-colors"
                >
                  <span>{source.linkText}</span>
                  <ArrowSquareOut size={14} weight="bold" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
