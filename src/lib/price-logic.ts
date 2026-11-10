import type { PriceCheckResult, PriceCheckStatus, ConfidenceLevel } from '../types/index.ts';

export function evaluatePrice(
  offeredPrice: number,
  comparisonPrice: number,
  layers: {
    lapis1HapHet: number;
    lapis1NationalHap?: number;
    lapis1RegionalHap?: number;
    lapis2OfficialAvg: number;
    lapis2PihpsCityAvg?: number;
    lapis3CitizenMedian: number;
    nationalVsLocalDiffPct?: number;
  },
  confidenceLevel: ConfidenceLevel = 'HIGH',
  confidenceReason?: string,
  regionName: string = 'Wilayah Anda',
  extras?: {
    marketContext?: PriceCheckResult['marketContext'];
    positioningNote?: string;
  }
): PriceCheckResult {
  const diffPercentage = Number(
    (((offeredPrice - comparisonPrice) / comparisonPrice) * 100).toFixed(2)
  );

  let status: PriceCheckStatus;
  let statusLabel: string;
  let statusBadgeColor: 'emerald' | 'amber' | 'rose' | 'blue';
  let markupDetected = false;
  let markupLabel = 'Harga Sesuai Acuan';
  let advice: string;

  if (diffPercentage < -15) {
    status = 'MUCH_CHEAPER';
    statusLabel = 'Jauh Lebih Murah';
    statusBadgeColor = 'blue';
    markupDetected = false;
    markupLabel = 'Harga di Bawah Standar';
    advice = `Harga berada jauh di bawah rata-rata pasar di ${regionName}. Pastikan memeriksa kesegaran mutu pangan dan akurasi timbangan pedagang.`;
  } else if (diffPercentage <= 10) {
    status = 'FAIR';
    statusLabel = 'Wajar';
    statusBadgeColor = 'emerald';
    markupDetected = false;
    markupLabel = 'Harga Wajar & Transparan';
    advice = `Harga ini wajar dan sejalan dengan rata-rata transaksi harian di ${regionName}.`;
  } else if (diffPercentage <= 25) {
    status = 'SLIGHTLY_EXPENSIVE';
    statusLabel = 'Agak Mahal';
    statusBadgeColor = 'amber';
    markupDetected = true;
    markupLabel = 'Di Atas Acuan Rerata';
    advice = `Harga lebih tinggi (+${diffPercentage}%) dari acuan wajar di ${regionName}. Cobalah menawar mendekati Rp ${comparisonPrice.toLocaleString('id-ID')}/kg atau bandingkan lapak sekitar.`;
  } else {
    status = 'OVERPRICED';
    statusLabel = 'Terlalu Mahal';
    statusBadgeColor = 'rose';
    markupDetected = true;
    markupLabel = 'Jauh Di Atas Acuan';
    advice = `Harga melampaui toleransi wajar (> +25%). Pedagang mematok harga jauh di atas acuan di ${regionName}. Sangat disarankan menawar ke Rp ${comparisonPrice.toLocaleString('id-ID')}/kg atau pindah ke lapak lain.`;
  }

  const defaultReason = confidenceReason || `Dihitung dari kombinasi survei resmi harian dan laporan warga di ${regionName}.`;
  const nationalHap = layers.lapis1NationalHap ?? layers.lapis1HapHet;
  const pihpsCityAvg = layers.lapis2PihpsCityAvg ?? layers.lapis2OfficialAvg;
  const computedNatVsLocalDiff =
    layers.nationalVsLocalDiffPct ??
    (nationalHap > 0 ? Number((((pihpsCityAvg - nationalHap) / nationalHap) * 100).toFixed(1)) : 0);

  return {
    offeredPrice,
    comparisonPrice,
    diffPercentage,
    status,
    statusLabel,
    statusBadgeColor,
    markupDetected,
    markupLabel,
    advice,
    confidenceLevel,
    confidenceReason: defaultReason,
    layers: {
      lapis1HapHet: layers.lapis1HapHet,
      lapis1NationalHap: nationalHap,
      lapis1RegionalHap: layers.lapis1RegionalHap ?? layers.lapis1HapHet,
      lapis2OfficialAvg: layers.lapis2OfficialAvg,
      lapis2PihpsCityAvg: pihpsCityAvg,
      lapis3CitizenMedian: layers.lapis3CitizenMedian,
      nationalVsLocalDiffPct: computedNatVsLocalDiff,
    },
    marketContext: extras?.marketContext,
    positioningNote: extras?.positioningNote,
    regionName,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('Rp', 'Rp ');
}
