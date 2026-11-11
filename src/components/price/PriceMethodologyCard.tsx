'use client';

import { Question } from '@phosphor-icons/react';

const STATUS_GUIDES = [
  {
    label: 'Wajar',
    badge: 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]',
    desc: 'Selisih -15% s.d. +10% dari acuan pasar setempat.',
  },
  {
    label: 'Agak Mahal',
    badge: 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--warning-ink)]',
    desc: 'Lebih mahal +10% s.d. +25%; disarankan menawar.',
  },
  {
    label: 'Terlalu Mahal',
    badge: 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]',
    desc: 'Di atas +25% acuan wajar; sebaiknya pindah lapak.',
  },
  {
    label: 'Jauh Lebih Murah',
    badge: 'bg-[#EEF773] text-[#102B03] border-[var(--border-ink)]',
    desc: 'Di bawah -15%; pastikan mutu bahan & timbangan akurat.',
  },
];

export function PriceMethodologyCard() {
  return (
    <div className="market-card p-5 sm:p-6 bg-[var(--bg-card)] flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Question size={17} weight="bold" className="text-[var(--accent-chili)] shrink-0" />
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
          Arti Status Kewajaran &amp; Peran Pelengkap PIHPS
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
        {STATUS_GUIDES.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--bg-paper)] border border-[var(--border-subtle)]"
          >
            <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border w-fit ${item.badge}`}>
              {item.label}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {item.desc}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
        <strong className="text-[var(--text-primary)] font-semibold">Melengkapi PIHPS &amp; Bapanas:</strong>{' '}
        Data makro resmi tetap mengacu ke PIHPS Bank Indonesia &amp; Bapanas; PasarKu membantu menerjemahkan acuan tersebut ke satuan belanja eceran di depan lapak serta tanya jawab PUNTEN AI.
      </p>
    </div>
  );
}
