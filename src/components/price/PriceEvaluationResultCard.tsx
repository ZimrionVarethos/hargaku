'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PriceCheckResult, CommoditySummary, Market } from '@/types';
import {
  ArrowDown,
  ArrowRight,
  CaretDown,
  CaretUp,
  ChatCircleDots,
  CheckCircle,
  MegaphoneSimple,
  Package,
  Train,
  Warning,
} from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { TAKARAN_UNITS, formatPortionLabel } from './price-check-presets';
import { PriceMarketContextBox } from './PriceMarketContextBox';

interface Props {
  result: PriceCheckResult;
  commodity: CommoditySummary;
  market?: Market;
  takaranAmount: number;
  selectedUnitId: string;
  rawPriceInput: string;
  onAskPunten?: () => void;
}

export function PriceEvaluationResultCard({
  result,
  commodity,
  market,
  takaranAmount,
  selectedUnitId,
  rawPriceInput,
  onAskPunten,
}: Props) {
  const { openAssistant } = useAssistant();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const unit = TAKARAN_UNITS.find((u) => u.id === selectedUnitId) || TAKARAN_UNITS[0];
  const portionRatio = (takaranAmount * unit.gramMultiplier) / 1000;
  const portionLabel = formatPortionLabel(takaranAmount, selectedUnitId);

  const rawNumeric = parseInt(rawPriceInput.replace(/\D/g, ''), 10) || 0;
  const offeredForPortion =
    rawNumeric > 0 ? rawNumeric : Math.round(result.offeredPrice * portionRatio);
  const fairForPortion = Math.round((result.comparisonPrice * portionRatio) / 100) * 100;
  const portionDiff = offeredForPortion - fairForPortion;

  const handleAskClick = () => {
    if (onAskPunten) {
      onAskPunten();
      return;
    }
    const location = market?.name || result.regionName || 'pasar';
    openAssistant(
      `Saya ditawari ${commodity.name} (${portionLabel}) seharga Rp ${offeredForPortion.toLocaleString('id-ID')} di ${location}. Normalnya Rp ${fairForPortion.toLocaleString('id-ID')}. Kasih tips tawar paling pas!`
    );
  };

  let badgeStyle = 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]';
  let adviceBoxStyle = 'bg-[var(--forest-surface)]/45 border-[var(--forest-ink)]/40 text-[var(--text-primary)]';
  let StatusIcon = CheckCircle;

  if (result.status === 'SLIGHTLY_EXPENSIVE') {
    badgeStyle = 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--warning-ink)]';
    adviceBoxStyle = 'bg-[var(--ochre-surface)] border-[var(--warning-ink)]/45 text-[var(--warning-ink)]';
    StatusIcon = Warning;
  } else if (result.status === 'OVERPRICED') {
    badgeStyle = 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]';
    adviceBoxStyle = 'bg-[var(--accent-chili-soft)] border-[var(--accent-chili)] text-[var(--accent-chili)]';
    StatusIcon = Warning;
  } else if (result.status === 'MUCH_CHEAPER') {
    badgeStyle = 'bg-[#EEF773] text-[#102B03] border-[var(--border-ink)]';
    adviceBoxStyle = 'bg-[var(--forest-surface)]/45 border-[var(--forest-ink)]/45 text-[var(--text-primary)]';
    StatusIcon = ArrowDown;
  }

  let headlineText = `Harga pas untuk ${portionLabel} ini!`;
  let adviceText = `Aman dibeli. Harga ini sudah sejalan dengan harga pasar hari ini.`;

  if (result.status === 'OVERPRICED' || result.status === 'SLIGHTLY_EXPENSIVE') {
    headlineText =
      portionDiff > 0
        ? `Lebih mahal sekitar Rp ${portionDiff.toLocaleString('id-ID')} untuk ${portionLabel} ini.`
        : `Lebih tinggi dari kisaran pasar hari ini.`;
    adviceText = `Coba tawar ke kisaran Rp ${fairForPortion.toLocaleString('id-ID')} untuk ${portionLabel} ya, atau cek lapak sebelah.`;
  } else if (result.status === 'MUCH_CHEAPER') {
    headlineText = `Lebih hemat sekitar Rp ${Math.abs(portionDiff).toLocaleString('id-ID')} untuk ${portionLabel} ini.`;
    adviceText = `Harganya miring banget. Pastikan barang masih segar dan timbangannya pas ya.`;
  }

  const nationalHap = result.layers.lapis1NationalHap ?? result.layers.lapis1HapHet;
  const pihpsLocal = result.layers.lapis2PihpsCityAvg ?? result.layers.lapis2OfficialAvg;

  const comparisonRows = [
    { label: 'Harga Tawaran Penjual', price: result.offeredPrice },
    { label: 'Patokan Pemerintah (Bapanas)', price: nationalHap },
    { label: `Rata-Rata Pasar Sekitar (${result.regionName || 'Daerah'})`, price: pihpsLocal },
    { label: `Data Warga (${market?.name || 'Wilayah'})`, price: result.layers.lapis3CitizenMedian },
  ];

  const hasShortages = (result.marketContext?.shortageAlerts?.length || 0) > 0;

  return (
    <div className="market-card p-5 sm:p-6 bg-[var(--bg-card)] flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="space-y-2 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Hasil Cek &bull; {market?.name || result.regionName || 'Pasar Rakyat'}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {result.marketContext?.nearStation && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-chili-soft)] text-[var(--accent-chili)]">
                  <Train size={11} weight="bold" />
                  <span>Dekat Stasiun</span>
                </span>
              )}
              {hasShortages && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--ochre-surface)] text-[var(--warning-ink)]">
                  <Package size={11} weight="bold" />
                  <span>Info Stok Terbatas</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
            <h3 className="inline-flex items-center gap-2 text-[26px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-none">
              <StatusIcon size={28} weight="bold" className="shrink-0" />
              <span>{result.statusLabel}</span>
            </h3>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border font-mono-num ${badgeStyle}`}>
              {result.diffPercentage > 0 ? `+${result.diffPercentage}%` : `${result.diffPercentage}%`}
            </span>
          </div>

          <p className="text-[15px] sm:text-[16px] font-bold text-[var(--text-primary)] leading-snug pt-0.5">
            {headlineText}
          </p>
          <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] font-mono-num">
            Harga pasar normal untuk {portionLabel}: <strong>Rp {fairForPortion.toLocaleString('id-ID')}</strong>{' '}
            (atau Rp {result.comparisonPrice.toLocaleString('id-ID')}/{commodity.unit}).
          </p>
        </div>

        <div className={`p-3.5 rounded-xl border text-[13px] leading-relaxed ${adviceBoxStyle}`}>
          <span className="font-bold block mb-0.5">Saran Buat Kamu:</span>
          {adviceText}
        </div>

        <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-paper)]">
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            aria-expanded={detailsOpen}
            className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-[12px] font-bold text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
          >
            <span>Lihat rincian harga resmi &amp; pasar lain (/{commodity.unit})</span>
            {detailsOpen ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
          </button>

          {detailsOpen && (
            <div className="px-3.5 pb-3.5 pt-1 border-t border-[var(--border-subtle)] space-y-3">
              <div className="divide-y divide-[var(--border-subtle)] text-[12px]">
                {comparisonRows.map((row) => (
                  <div key={row.label} className="py-2 flex items-center justify-between gap-3">
                    <span className="text-[var(--text-secondary)]">{row.label}</span>
                    <span className="font-bold text-[var(--text-primary)] font-mono-num shrink-0">
                      Rp {row.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
              <PriceMarketContextBox marketContext={result.marketContext} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={handleAskClick}
          className="market-btn-primary w-full py-2.5 px-4 text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChatCircleDots size={17} weight="bold" />
          <span>Tanya PUNTEN AI Soal Tawaran Ini</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href={`/lapor?commodity=${commodity.slug}&market=${market?.id || market?.slug || ''}&price=${result.offeredPrice}`}
            className="market-btn-secondary inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-semibold"
          >
            <MegaphoneSimple size={14} weight="bold" />
            <span>Laporkan Harga Ini</span>
          </Link>

          <Link
            href={`/komoditas/${commodity.slug}`}
            className="market-btn-secondary inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-semibold"
          >
            <span>Bandingkan Pasar Lain</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
