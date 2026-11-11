'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CaretDown, ChatCircleDots, Question } from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';

interface QnaItem {
  id: string;
  question: string;
  answer: string;
}

const QNA_ITEMS: QnaItem[] = [
  {
    id: 'cek-wajar',
    question: 'Bagaimana cara tahu harga tawaran pedagang wajar atau kemahalan?',
    answer:
      'Buka halaman Cek Harga, pilih komoditas, takaran belanja (1 kg, 1/2 kg, 1/4 kg, atau 1 ons), lalu masukkan harga tawaran penjual. Sistem menghitung selisih Rupiah langsung untuk takaran itu terhadap acuan HAP/HET Bapanas, survei pasar setempat, dan laporan warga.',
  },
  {
    id: 'pelengkap-pihps',
    question: 'Apakah PasarKu menggantikan data resmi PIHPS BI atau Bapanas?',
    answer:
      'Tidak. PasarKu adalah platform independen pelengkap (decision layer) yang menerjemahkan acuan nasional Bapanas RI, PIHPS Bank Indonesia, dan laporan warga ke format praktis untuk dipakai langsung sebelum menawar di lapak.',
  },
  {
    id: 'cakupan-nasional',
    question: 'Apakah data PasarKu hanya untuk Kota Bogor atau seluruh Indonesia?',
    answer:
      'PasarKu mencakup wilayah di hampir seluruh Indonesia lintas 6 koridor pulau (21+ provinsi) dengan kalibrasi logistik Bapanas. Pengalih wilayah di bagian atas layar memungkinkan Anda berpindah dari Kota Bogor ke Jabodetabek, Jawa Barat, hingga Nasional.',
  },
];

export function PasarKuQnaSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { openAssistant } = useAssistant();

  const toggleItem = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="qnaSection" className="scroll-mt-20 py-10 sm:py-12 bg-[var(--bg-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-ink)] text-[11px] font-bold text-[var(--text-primary)] shadow-[var(--shadow-hard-sm)]">
              <Question size={14} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />
              <span>Tanya Jawab Singkat</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
              Kenapa Pakai PasarKu Sebelum Belanja?
            </h2>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Ringkasan cepat cara memakai acuan harga PasarKu di depan lapak serta cakupannya sebagai platform independen lintas wilayah Indonesia.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                href="/cek-harga"
                className="market-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center justify-center no-underline"
              >
                Cek Harga Sekarang
              </Link>
              <button
                type="button"
                onClick={() => openAssistant('Jelaskan cara memakai PasarKu sebelum menawar harga di pasar.')}
                className="market-btn-secondary px-3.5 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ChatCircleDots size={14} weight="bold" aria-hidden="true" />
                <span>Tanya PUNTEN</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {QNA_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              const panelId = `qna-panel-${item.id}`;
              return (
                <div key={item.id} className="market-card bg-[var(--bg-card)] overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(idx)}
                    className="w-full min-h-[56px] px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[var(--bg-paper)]/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg border border-[var(--border-ink)] text-xs font-bold font-mono-num flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-[var(--accent-chili)] text-white'
                            : 'bg-[var(--forest-surface)] text-[var(--forest-ink)]'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span className="text-sm sm:text-[15px] font-bold text-[var(--text-primary)] leading-snug">
                        {item.question}
                      </span>
                    </div>

                    <CaretDown
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className={`shrink-0 text-[var(--text-primary)] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      className="px-4 sm:px-5 pb-4 pt-1 border-t border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pl-14 sm:pl-[60px]"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

