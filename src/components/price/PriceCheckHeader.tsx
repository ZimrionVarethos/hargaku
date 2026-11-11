'use client';

const STEPS = [
  { num: '1', title: 'Pilih barang & pasar', desc: 'atau pakai Contoh Cepat' },
  { num: '2', title: 'Isi takaran & tawaran', desc: 'otomatis setara per kg' },
  { num: '3', title: 'Cek putusan & tanya AI', desc: 'bandingkan 4 sumber data' },
];

export function PriceCheckHeader() {
  return (
    <div className="flex flex-col gap-3.5 pb-1">
      <div className="space-y-1.5">
        <h1 className="text-[28px] sm:text-[38px] font-bold text-[var(--text-primary)] leading-[1.12] tracking-tight">
          Cek Harga &amp; Komparasi AI
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] max-w-[740px] leading-[1.55]">
          Masukkan tawaran harga pedagang di lapak, langsung tahu wajar atau tidak, lengkap dengan komparasi 4 sumber dan asisten PUNTEN AI.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-card)] border-2 border-[var(--border-ink)] shadow-[var(--shadow-hard-sm)]"
          >
            <span className="w-6 h-6 rounded-full bg-[var(--forest-surface)] text-[var(--forest-ink)] border border-[var(--forest-ink)] text-[11px] font-bold flex items-center justify-center shrink-0">
              {step.num}
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-[var(--text-primary)] truncate">
                {step.title}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] truncate">
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
