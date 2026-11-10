import Link from 'next/link';

export function AboutHeroHeader() {
  return (
    <div className="flex flex-col gap-6 pb-4">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-bold">Tentang &amp; Sumber Data</span>
      </nav>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-ink)] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-chili)]" />
          <span className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Transparansi Pangan Publik &middot; Nasional &amp; Daerah
          </span>
        </div>

        <h1 className="text-[34px] sm:text-[44px] lg:text-[48px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
          Tentang HargaKu &amp; Integritas Data
        </h1>

        <p className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] max-w-[760px] leading-[1.6]">
          HargaKu adalah instrumen transparansi harga komoditas pangan independen untuk inisiatif{' '}
          <strong className="text-[var(--text-primary)] font-bold">Web In Action (WIA 2026, UPN Veteran Jakarta)</strong>. 
          Dirancang untuk membantu warga belanja cerdas tanpa kecemasan, melindungi privasi pedagang tradisional, dan menyajikan data berbasis metodologi statistik yang akuntabel.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <a
          href="#sumber-data"
          className="market-btn-secondary px-3.5 py-1.5 text-[12px] font-bold"
        >
          Sumber Data Resmi
        </a>
        <a
          href="#metodologi"
          className="market-btn-secondary px-3.5 py-1.5 text-[12px] font-bold"
        >
          Metodologi 3 Lapis &amp; MAD
        </a>
        <a
          href="#etika-pedagang"
          className="market-btn-secondary px-3.5 py-1.5 text-[12px] font-bold"
        >
          Etika Perlindungan Lapak
        </a>
        <a
          href="#tim-pengembang"
          className="market-btn-secondary px-3.5 py-1.5 text-[12px] font-bold"
        >
          Tim WIA 2026
        </a>
      </div>
    </div>
  );
}
