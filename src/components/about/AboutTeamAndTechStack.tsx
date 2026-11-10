import Link from 'next/link';
import {
  Code,
  GraduationCap,
  ArrowRight,
  ChartLineUp,
} from '@phosphor-icons/react/dist/ssr';

export function AboutTeamAndTechStack() {
  return (
    <section id="tim-pengembang" className="space-y-6 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b-2 border-[var(--border-ink)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} weight="bold" className="text-[var(--accent-chili)]" />
            <span className="text-[11px] font-bold text-[var(--accent-chili)] uppercase tracking-wider">
              Inisiatif Kolaboratif
            </span>
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[var(--text-primary)] tracking-tight">
            Tim Pengembang &amp; Arsitektur Sistem
          </h2>
        </div>
        <div className="text-[12px] text-[var(--text-secondary)]">
          Karya mahasiswa untuk kompetisi Web In Action (WIA 2026)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Team Card */}
        <div className="market-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-chili)] text-white flex items-center justify-center font-bold text-[18px]">
              H
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                Tim Inovasi HargaKu
              </h3>
              <p className="text-[12px] text-[var(--text-muted)]">
                UPN Veteran Jakarta
              </p>
            </div>
          </div>

          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            Dikembangkan oleh mahasiswa berdedikasi dalam bidang rekayasa perangkat lunak dan sains data publik untuk kompetisi nasional <strong>Web In Action (WIA 2026)</strong>.
          </p>

          <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[var(--text-muted)]">Kategori Lomba</span>
              <span className="font-bold text-[var(--text-primary)]">Web Application</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[var(--text-muted)]">Cakupan Observasi &amp; Validasi</span>
              <span className="font-bold text-[var(--text-primary)]">Pasar Tradisional Nasional</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[var(--text-muted)]">Lisensi</span>
              <span className="font-bold text-[var(--text-primary)]">Open Source (MIT)</span>
            </div>
          </div>
        </div>

        {/* Tech Stack Card */}
        <div className="lg:col-span-2 market-card p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code size={18} weight="bold" className="text-[var(--text-primary)]" />
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                Arsitektur &amp; Tumpukan Teknologi Modern
              </h3>
            </div>

            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              HargaKu dibangun dengan arsitektur frontend-first yang terintegrasi secara modular dengan skema basis data relasional standar PostgreSQL &amp; Prisma ORM.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] font-bold">Framework</div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">Next.js 16 (App Router)</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] font-bold">Language</div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">Strict TypeScript</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] font-bold">Styling</div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">Tailwind CSS v4</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] font-bold">Design Tokens</div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">PasarKu Tokens</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] font-bold">Database Layer</div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">PostgreSQL &amp; Prisma</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] font-bold">Typography</div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">100% Google Fonts Ubuntu</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/cek-harga"
              className="market-btn-primary w-full sm:w-auto h-11 px-5 text-[13px] font-bold flex items-center justify-center gap-2"
            >
              <span>Mulai Cek Harga Wajar</span>
              <ArrowRight size={15} weight="bold" />
            </Link>
            <Link
              href="/dashboard"
              className="market-btn-secondary w-full sm:w-auto h-11 px-5 text-[13px] font-bold flex items-center justify-center gap-2"
            >
              <ChartLineUp size={16} weight="bold" />
              <span>Pantau Dashboard 12 Komoditas</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
