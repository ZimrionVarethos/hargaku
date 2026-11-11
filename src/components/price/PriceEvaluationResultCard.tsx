'use client';

import Link from 'next/link';
import { PriceCheckResult, CommoditySummary, Market } from '@/types';
import {
  ArrowRight,
  ChatCircleDots,
  MegaphoneSimple,
  CheckCircle,
  Warning,
  ArrowDown,
} from '@phosphor-icons/react';
import { useAssistant } from '@/lib/store/assistant-store';
import { PriceMarketContextBox } from './PriceMarketContextBox';

interface Props {
  result: PriceCheckResult;
  commodity: CommoditySummary;
  market?: Market;
  takaranAmount: number;
  takaranUnitShort: string;
  rawPriceInput: string;
  onAskPunten?: () => void;
}

export function PriceEvaluationResultCard({
  result,
  commodity,
  market,
  takaranAmount,
  takaranUnitShort,
  rawPriceInput,
  onAskPunten,
}: Props) {
  const { openAssistant } = useAssistant();

  const handleAskClick = () => {
    if (onAskPunten) {
      onAskPunten();
      return;
    }
    const location = market?.name || result.regionName || 'pasar rakyat';
    openAssistant(
      `Saya ditawari ${commodity.name} seharga Rp ${result.offeredPrice.toLocaleString('id-ID')}/${commodity.unit} (${result.statusLabel}) di ${location}. Bandingkan dengan Acuan Nasional Bapanas, PIHPS daerah, dan laporan warga.`
    );
  };

  let badgeStyle = 'bg-[var(--forest-surface)] text-[var(--forest-ink)] border-[var(--forest-ink)]';
  let adviceBoxStyle = 'bg-[var(--forest-surface)]/50 border-[var(--forest-ink)]/40 text-[var(--text-primary)]';
  let StatusIcon = CheckCircle;

  if (result.status === 'SLIGHTLY_EXPENSIVE') {
    badgeStyle = 'bg-[var(--ochre-surface)] text-[var(--warning-ink)] border-[var(--warning-ink)]';
    adviceBoxStyle = 'bg-[var(--ochre-surface)] border-[var(--warning-ink)]/50 text-[var(--warning-ink)]';
    StatusIcon = Warning;
  } else if (result.status === 'OVERPRICED') {
    badgeStyle = 'bg-[var(--accent-chili-soft)] text-[var(--accent-chili)] border-[var(--accent-chili)]';
    adviceBoxStyle = 'bg-[var(--accent-chili-soft)] border-[var(--accent-chili)] text-[var(--accent-chili)]';
    StatusIcon = Warning;
  } else if (result.status === 'MUCH_CHEAPER') {
    badgeStyle = 'bg-[#EEF773] text-[#102B03] border-[var(--border-ink)]';
    adviceBoxStyle = 'bg-[var(--forest-surface)] border-[var(--forest-ink)]/50 text-[var(--forest-ink)]';
    StatusIcon = ArrowDown;
  }

  const diffNominal = Math.abs(result.offeredPrice - result.comparisonPrice);
  const diffSummary =
    result.diffPercentage > 0
      ? `Rp ${diffNominal.toLocaleString('id-ID')}/${commodity.unit} di atas patokan pasar saat ini.`
      : result.diffPercentage < 0
      ? `Rp ${diffNominal.toLocaleString('id-ID')}/${commodity.unit} lebih hemat dari patokan pasar saat ini.`
      : `Sama persis dengan patokan harga pasar saat ini.`;

  const nationalHap = result.layers.lapis1NationalHap ?? result.layers.lapis1HapHet;
  const pihpsLocal = result.layers.lapis2PihpsCityAvg ?? result.layers.lapis2OfficialAvg;

  const sourcePrices = [
    nationalHap,
    pihpsLocal,
    result.layers.lapis3CitizenMedian,
  ].filter((v) => v > 0);
  const lowestBenchmark = sourcePrices.length > 0 ? Math.min(...sourcePrices) : pihpsLocal;

  const comparisonRows = [
    {
      label: 'Tawaran Penjual',
      sub: `${rawPriceInput || 'Rp 0'} (${takaranAmount} ${takaranUnitShort})`,
      price: result.offeredPrice,
      isHighlight: false,
      tag: '',
    },
    {
      label: 'Acuan Nasional Bapanas (HAP/HET)',
      sub: 'Batas acuan resmi pemerintah',
      price: nationalHap,
      isHighlight: nationalHap === lowestBenchmark,
      tag: nationalHap === lowestBenchmark ? 'Terendah' : '',
    },
    {
      label: `Acuan Daerah (${result.regionName || 'Lokal'}) · PIHPS`,
      sub:
        result.layers.nationalVsLocalDiffPct !== undefined && result.layers.nationalVsLocalDiffPct !== 0
          ? `${result.layers.nationalVsLocalDiffPct > 0 ? `+${result.layers.nationalVsLocalDiffPct}%` : `${result.layers.nationalVsLocalDiffPct}%`} dari nasional`
          : 'Rerata survei pasar resmi',
      price: pihpsLocal,
      isHighlight: pihpsLocal === lowestBenchmark,
      tag: pihpsLocal === lowestBenchmark ? 'Terendah' : '',
    },
    {
      label: `Laporan Warga (${market?.name || 'Wilayah'})`,
      sub: result.confidenceLevel === 'HIGH' ? 'Data terverifikasi aktif' : 'Mengikuti patokan pasar terdekat',
      price: result.layers.lapis3CitizenMedian,
      isHighlight: result.layers.lapis3CitizenMedian === lowestBenchmark,
      tag: result.layers.lapis3CitizenMedian === lowestBenchmark ? 'Terendah' : '',
    },
  ];

  return (
    <div className="market-card p-5 sm:p-6 bg-[var(--bg-card)] flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-4">
        <div className="space-y-2 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Putusan Harga &bull; {result.regionName || market?.city || 'Daerah'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
              {result.confidenceLevel === 'HIGH' ? 'Kepercayaan Tinggi' : 'Acuan Wilayah'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="inline-flex items-center gap-2 text-[26px] sm:text-[30px] font-bold text-[var(--text-primary)] tracking-tight leading-none">
              <StatusIcon size={26} weight="bold" className="shrink-0" />
              <span>{result.statusLabel}</span>
            </h3>

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border font-mono-num ${badgeStyle}`}>
              {result.diffPercentage > 0 ? `+${result.diffPercentage}%` : `${result.diffPercentage}%`} vs Patokan
            </span>
          </div>

          <p className="text-[13px] text-[var(--text-secondary)] leading-snug">
            {diffSummary}
          </p>
        </div>

        <div className={`p-3.5 rounded-xl border text-[12px] leading-relaxed ${adviceBoxStyle}`}>
          <span className="font-bold block mb-0.5">Saran Belanja:</span>
          {result.advice}
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Komparasi 4 Sumber Harga (/{commodity.unit})
          </div>
          <div className="rounded-xl border border-[var(--border-ink)] bg-[var(--bg-paper)] divide-y divide-[var(--border-subtle)] overflow-hidden">
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className={`px-3.5 py-2.5 flex items-center justify-between gap-3 ${
                  row.isHighlight ? 'bg-[var(--forest-surface)]/45' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[var(--text-primary)] truncate">
                    {row.label}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {row.sub}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-bold text-[var(--text-primary)] font-mono-num">
                    Rp {row.price.toLocaleString('id-ID')}
                  </div>
                  {row.tag && (
                    <span className="text-[10px] font-bold text-[var(--forest-ink)] uppercase">
                      {row.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <PriceMarketContextBox
          marketContext={result.marketContext}
          positioningNote={result.positioningNote}
        />
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
            <span>Lapor Harga / Stok</span>
          </Link>

          <Link
            href={`/komoditas/${commodity.slug}`}
            className="market-btn-secondary inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-semibold"
          >
            <span>Grafik &amp; Pasar Lain</span>
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
