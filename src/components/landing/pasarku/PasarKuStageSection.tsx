'use client';

import React, { useState, useMemo } from 'react';
import { useAssistant } from '@/lib/store/assistant-store';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { CommoditySvg } from '@/lib/data/market-svgs';

const SPECIMEN_DEFS = [
  { id: 2, slug: 'beras-medium', name: 'Beras Medium', unit: 'kg', svg: 'rice', floatClass: 'specimen-float-1', pos: 'top-4 left-6' },
  { id: 21, slug: 'cabai-rawit-merah', name: 'Cabai Rawit', unit: 'kg', svg: 'chili', floatClass: 'specimen-float-2', pos: 'top-8 right-8' },
  { id: 16, slug: 'bawang-merah', name: 'Bawang Merah', unit: 'kg', svg: 'shallot', floatClass: 'specimen-float-3', pos: 'bottom-8 left-8' },
  { id: 44, slug: 'daging-ayam', name: 'Daging Ayam', unit: 'kg', svg: 'poultry', floatClass: 'specimen-float-1', pos: 'bottom-6 right-10' },
];

export function PasarKuStageSection() {
  const { openAssistant } = useAssistant();
  const liveCommodities = useLiveBogorCommodities();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [animMode, setAnimMode] = useState<'pagi' | 'sayur' | 'harmonis'>('pagi');
  const [scaleHit, setScaleHit] = useState(false);

  const specimens = useMemo(() => {
    return SPECIMEN_DEFS.map((s) => {
      const match = liveCommodities.find((c) => c.id === s.id);
      return { ...s, price: match?.price || 35000 };
    });
  }, [liveCommodities]);

  const activeSpec = specimens[selectedIdx] || specimens[0];
  const needleAngle = Math.min(165, Math.max(15, Math.round((activeSpec.price / 90000) * 150)));

  const handleSpecimenClick = (idx: number) => {
    setSelectedIdx(idx);
    setScaleHit(true);
    setTimeout(() => setScaleHit(false), 450);
  };

  const handleOpenAi = () => {
    openAssistant(
      `Bandingkan harga ${activeSpec.name} (saat ini Rp ${activeSpec.price.toLocaleString('id-ID')}/${activeSpec.unit}) lintas sumber (Bapanas, PIHPS BI, Pasar Rakyat, dan Laporan Warga) serta beri rekomendasi terbaik.`
    );
  };

  return (
    <section id="etagStageSection" className="border-b-2 border-[var(--border-ink)] py-12 bg-[var(--bg-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 5 Cols Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-ink)] bg-[var(--bg-card)] text-[var(--accent-chili)] mb-3">
                TIMBANGAN KOMPARASI SUMBER
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Meja Timbangan Indeks &amp; AI
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Klik komoditas melayang untuk mengukur indeks harganya di timbangan pasar, lalu konsultasikan ke Gemini AI untuk perbandingan lintas sumber.
              </p>
            </div>

            <div className="market-card p-4 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Mode Atmosfer Pasar
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['pagi', 'sayur', 'harmonis'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAnimMode(mode)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border-2 border-[var(--border-ink)] transition-all ${
                      animMode === mode
                        ? 'bg-[var(--accent-chili)] text-white shadow-xs'
                        : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    {mode === 'pagi' ? 'Pagi Hari' : mode === 'sayur' ? 'Pasar Ramai' : 'Harmonis'}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
                  <span>Kecepatan Animasi: {animSpeed.toFixed(1)}x</span>
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    className="font-bold text-[var(--accent-chili)] underline text-xs"
                  >
                    {isPaused ? 'Putar Animasi' : 'Jeda Animasi'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={animSpeed}
                  onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent-chili)]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAi}
              className="market-btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tanya Rekomendasi AI ({activeSpec.name})</span>
            </button>
          </div>

          {/* Right Column: 7 Cols Stage & Mechanical Scale */}
          <div className="lg:col-span-7">
            <div
              className={`relative min-h-[380px] sm:min-h-[440px] rounded-2xl border-2 border-[var(--border-ink)] bg-[#132A1E] p-6 overflow-hidden flex flex-col items-center justify-center shadow-lg ${
                isPaused ? 'paused-motion' : ''
              }`}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, #EFE4D4 10%, transparent 60%)',
                }}
              />

              {specimens.map((spec, idx) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => handleSpecimenClick(idx)}
                  className={`absolute ${spec.pos} ${spec.floatClass} market-card p-2.5 flex items-center gap-2 z-10 hover:scale-105 transition-transform cursor-pointer ${
                    selectedIdx === idx ? 'bg-[#EEF773]' : 'bg-[#F9F3EE]'
                  }`}
                  title={`Klik untuk ukur indeks ${spec.name}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E2EFE6] p-1 shrink-0">
                    <CommoditySvg kind={spec.svg} />
                  </div>
                  <div className="text-left text-xs">
                    <div className="font-bold text-[#132E20] leading-tight">{spec.name}</div>
                    <div className="text-[#245034] font-semibold">Rp {spec.price.toLocaleString('id-ID')}</div>
                  </div>
                </button>
              ))}

              <div className={`relative z-20 flex flex-col items-center ${scaleHit ? 'animate-scale-hit' : ''}`}>
                <div className="w-48 sm:w-56 h-8 bg-[#D8C8B0] rounded-t-xl border-2 border-[var(--border-ink)] border-b-0 shadow-xs flex items-center justify-center">
                  <span className="text-[10px] font-bold tracking-wider text-[#132E20]">
                    {activeSpec.name.toUpperCase()}
                  </span>
                </div>

                <div className="w-44 sm:w-52 h-44 sm:h-52 rounded-full border-4 border-[var(--border-ink)] bg-[#F9F3EE] shadow-xl relative flex items-center justify-center p-3">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle cx="50" cy="50" r="42" stroke="#132E20" strokeWidth="1" strokeDasharray="2 4" fill="none" />
                  </svg>

                  <div className="absolute top-4 text-[10px] font-bold text-[#132E20]">Hemat</div>
                  <div className="absolute right-4 text-[10px] font-bold text-[#132E20]">Wajar</div>
                  <div className="absolute bottom-4 text-[10px] font-bold text-[#132E20]">Tinggi</div>
                  <div className="absolute left-4 text-[10px] font-bold text-[#132E20]">Acuan</div>

                  <div
                    className="absolute w-1 h-18 bg-[#A92717] rounded-full origin-bottom transition-transform duration-500 ease-out z-10"
                    style={{ transform: `rotate(${needleAngle - 90}deg)`, bottom: '50%' }}
                  />

                  <div className="w-4 h-4 rounded-full bg-[#132E20] border-2 border-[#FFFFFF] z-20" />
                </div>

                <div className="w-44 h-6 bg-[#263E30] border-2 border-[var(--border-ink)] rounded-b-lg mt-1 flex items-center justify-center px-2">
                  <span className="text-[10px] font-bold text-[#EFE4D4] truncate">
                    RP {activeSpec.price.toLocaleString('id-ID')} / {activeSpec.unit.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
