'use client';

import Link from 'next/link';
import { PriceCheckResult, CommoditySummary, Market } from '@/types';
import { ArrowRight, MegaphoneSimple, ChatCircleDots } from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';

interface Props {
  result: PriceCheckResult;
  commodity: CommoditySummary;
  market?: Market;
  takaranAmount: number;
  takaranUnitLabel: string;
  rawPriceInput: string;
}

export function PriceEvaluationResultCard({
  result,
  commodity,
  market,
  takaranAmount,
  takaranUnitLabel,
  rawPriceInput,
}: Props) {
  const { openAssistant } = useAssistant();

  const handleAskAiRecommendation = () => {
    const location = market?.name || result.regionName || 'pasar rakyat';
    openAssistant(
      `Saya ditawari ${commodity.name} seharga Rp ${result.offeredPrice.toLocaleString('id-ID')}/kg (${result.statusLabel}) di ${location}. Bandingkan dengan Panel Bapanas, PIHPS BI, dan Laporan Warga lalu beri saran terbaik.`
    );
  };

  let badgeStyle = 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--border-ink)]';
  let titlePrefix = '';
  let adviceBoxStyle = 'bg-[var(--bg-paper)]/70 border-[var(--border-subtle)] text-[var(--text-secondary)]';

  if (result.status === 'SLIGHTLY_EXPENSIVE') {
    badgeStyle = 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    titlePrefix = '▲ ';
    adviceBoxStyle = 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]';
  } else if (result.status === 'OVERPRICED') {
    badgeStyle = 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]';
    titlePrefix = '▲ ';
    adviceBoxStyle = 'bg-[var(--accent-chili-soft)] border-[var(--accent-chili)] text-[var(--accent-chili)]';
  } else if (result.status === 'MUCH_CHEAPER') {
    badgeStyle = 'bg-[#EEF773] text-[#102B03] border-[var(--border-ink)]';
    titlePrefix = '▼ ';
    adviceBoxStyle = 'bg-[#F7FEE7] border-[#D9F99D] text-[#365314]';
  }

  const diffNominal = Math.abs(result.offeredPrice - result.comparisonPrice);
  const diffSignText =
    result.diffPercentage > 0
      ? `Rp ${diffNominal.toLocaleString('id-ID')}/kg lebih tinggi dari rata-rata pasar saat ini.`
      : result.diffPercentage < 0
      ? `Rp ${diffNominal.toLocaleString('id-ID')}/kg lebih hemat dari rata-rata pasar saat ini.`
      : `persis sama dengan rata-rata harga pasar saat ini.`;

  return (
    <div className="market-card p-6 sm:p-7 bg-[var(--bg-card)] flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Hasil Evaluasi Kewajaran &bull; {result.regionName || market?.city || 'Daerah'}
            </span>
            {result.markupDetected && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border border-[var(--accent-chili)] uppercase">
                {result.markupLabel || 'Di Atas Acuan'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight">
              {titlePrefix}
              {result.statusLabel}
            </h3>

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-[6px] border ${badgeStyle}`}>
              {result.diffPercentage > 0 ? `+${result.diffPercentage}%` : `${result.diffPercentage}%`} Di Atas Acuan
            </span>
          </div>

          <p className="text-[13px] text-[var(--text-secondary)] leading-[20px]">
            Harga yang ditawarkan {diffSignText}
          </p>
        </div>

        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)] text-[12px] py-1">
          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)]">Harga yang ditawarkan (normalisasi)</span>
            <span className="font-bold text-[var(--text-primary)] text-right">
              Rp {result.offeredPrice.toLocaleString('id-ID')} / kg{' '}
              <span className="font-normal text-[var(--text-muted)]">
                ({rawPriceInput} / {takaranAmount} {takaranUnitLabel.split(' ')[0]})
              </span>
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)]">Harga pembanding acuan daerah</span>
            <span className="font-bold text-[var(--forest-ink)]">
              Rp {result.comparisonPrice.toLocaleString('id-ID')} / kg
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)]">Pasar rujukan &amp; sumber</span>
            <span className="font-medium text-[var(--text-secondary)]">
              Laporan Warga &bull; {market?.name || 'Pasar Lokal'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)]">Standar HAP Nasional Bapanas</span>
            <span className="font-mono font-medium text-[var(--text-secondary)]">
              Rp {(result.layers.lapis1NationalHap ?? result.layers.lapis1HapHet).toLocaleString('id-ID')} / kg
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <span className="text-[var(--text-muted)]">Acuan Disesuaikan ({result.regionName || 'Daerah'})</span>
            <span className="font-medium text-[var(--text-primary)] text-right">
              Rp {result.layers.lapis1HapHet.toLocaleString('id-ID')} / kg{' '}
              <span className="text-[11px] text-[var(--text-muted)] font-normal block sm:inline">
                ({result.offeredPrice > result.layers.lapis1HapHet ? 'Melebihi acuan pulau' : 'Sesuai acuan pulau'})
              </span>
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-[10px] border text-[12px] leading-[18px] ${adviceBoxStyle}`}>
          <span className="font-semibold block mb-0.5">Saran Belanja:</span>
          {result.advice}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleAskAiRecommendation}
          className="market-btn-primary w-full py-2.5 px-4 rounded-[10px] text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChatCircleDots size={16} weight="bold" />
          <span>Tanya PUNTEN</span>
        </button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link
            href={`/lapor?commodity=${commodity.slug}&market=${market?.slug || ''}&price=${result.offeredPrice}`}
            className="market-btn-secondary flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 text-[12px] font-semibold"
          >
            <MegaphoneSimple size={14} weight="bold" />
            <span>Lapor Harga Lapak Ini</span>
          </Link>

          <Link
            href={`/komoditas/${commodity.slug}`}
            className="market-btn-secondary flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 text-[12px] font-semibold"
          >
            <span>Bandingkan Pasar Lain</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
