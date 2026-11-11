'use client';

const LEGEND_ITEMS = [
  { label: 'Wajar', cls: 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]' },
  { label: 'Agak Mahal (+10–25%)', cls: 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--warning-ink)]' },
  { label: 'Terlalu Mahal (>25%)', cls: 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]' },
  { label: 'Jauh Lebih Murah (<-15%)', cls: 'bg-[#EEF773] text-[#102B03] border-[var(--border-ink)]' },
];

export function PriceMethodologyCard() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-[11px]">
      <div className="flex flex-wrap items-center gap-1.5">
        {LEGEND_ITEMS.map((item) => (
          <span
            key={item.label}
            className={`px-2 py-0.5 rounded-md border font-bold ${item.cls}`}
          >
            {item.label}
          </span>
        ))}
      </div>
      <p className="text-[var(--text-muted)] leading-snug">
        PasarKu melengkapi data resmi <strong className="text-[var(--text-primary)]">PIHPS BI &amp; Bapanas</strong> agar mudah dipakai saat belanja.
      </p>
    </div>
  );
}
