import { AssistantMessage } from '@/types/assistant';
import { Region } from '@/types';
import { MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import { evaluatePrice, formatRupiah } from '@/lib/price-logic';

export { DEFAULT_PROMPT_PRESETS } from './assistant-presets';

function getRegionalPrice(basePrice: number, region: Region): number {
  if (!region.logisticsCostPct || region.logisticsCostPct === 0) return basePrice;
  return Math.round((basePrice * (1 + region.logisticsCostPct / 100)) / 100) * 100;
}

export async function processAssistantMessage(
  userText: string,
  region: Region
): Promise<AssistantMessage> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const lower = userText.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (lower.includes('wajar') || lower.includes('kemahalan') || lower.includes('nawarin')) {
    let matchedCom = MOCK_COMMODITY_SUMMARIES.find(
      (c) => lower.includes(c.name.toLowerCase()) || lower.includes(c.slug.replace('-', ' '))
    );
    if (!matchedCom && lower.includes('cabai rawit')) {
      matchedCom = MOCK_COMMODITY_SUMMARIES.find((c) => c.slug === 'cabai-rawit-merah');
    }
    if (!matchedCom && lower.includes('bawang merah')) {
      matchedCom = MOCK_COMMODITY_SUMMARIES.find((c) => c.slug === 'bawang-merah');
    }
    if (!matchedCom && lower.includes('daging')) {
      matchedCom = MOCK_COMMODITY_SUMMARIES.find((c) => c.slug === 'daging-sapi-murni');
    }

    const commodity = matchedCom || MOCK_COMMODITY_SUMMARIES[8];
    const benchmarkPrice = getRegionalPrice(commodity.currentAvgPrice, region);

    let offeredPerKg = benchmarkPrice;
    const numMatch = lower.match(/(\d+[\.,]?\d*)\s*(rb|ribu|k)?/);
    if (numMatch) {
      let rawNum = parseFloat(numMatch[1].replace(',', '.'));
      if (rawNum < 500) rawNum *= 1000;
      if (lower.includes('seperempat') || lower.includes('1/4') || lower.includes('250')) {
        offeredPerKg = rawNum * 4;
      } else if (lower.includes('setengah') || lower.includes('1/2') || lower.includes('500')) {
        offeredPerKg = rawNum * 2;
      } else if (lower.includes('ons') || lower.includes('100g')) {
        offeredPerKg = rawNum * 10;
      } else {
        offeredPerKg = rawNum;
      }
    }

    const evalResult = evaluatePrice(
      offeredPerKg,
      benchmarkPrice,
      {
        lapis1HapHet: commodity.hapHetPrice,
        lapis2OfficialAvg: benchmarkPrice,
        lapis3CitizenMedian: benchmarkPrice,
      },
      'HIGH',
      undefined,
      region.name
    );

    const diffPct = (((offeredPerKg - benchmarkPrice) / benchmarkPrice) * 100).toFixed(1);
    const isOver = offeredPerKg > benchmarkPrice;

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      timestamp,
      provider: 'grounded-fallback',
      content:
        `### Evaluasi Penawaran ${commodity.name} (${region.name})\n\n` +
        `| Pembanding | Nominal | Catatan |\n` +
        `| :--- | ---: | :--- |\n` +
        `| Tawaran Lapak | \`${formatRupiah(offeredPerKg)}/kg\` | Harga disetarakan |\n` +
        `| Rerata PIHPS & Pasar | \`${formatRupiah(benchmarkPrice)}/kg\` | Acuan pasar wilayah |\n` +
        `| HAP / HET Bapanas | \`${formatRupiah(commodity.hapHetPrice)}/kg\` | Standar nasional |\n\n` +
        `Status saat ini: **${evalResult.statusLabel}** (${isOver ? `+${diffPct}%` : `${diffPct}%`} terhadap acuan).\n\n` +
        `> **Saran Rin**: ${evalResult.advice}`,
      referencedCommodities: [
        {
          id: commodity.id,
          name: commodity.name,
          currentPrice: benchmarkPrice,
          unit: commodity.unit,
          status: evalResult.status,
          statusLabel: evalResult.statusLabel,
        },
      ],
      suggestedActions: [
        { label: 'Buka Form Cek Harga Wajar', href: '/cek-harga' },
        { label: 'Komparasi AI Multi-Sumber', href: '/rekomendasi-ai' },
      ],
    };
  }

  if (lower.includes('murah') || lower.includes('turun') || lower.includes('hemat')) {
    const cheapItems = MOCK_COMMODITY_SUMMARIES.filter((c) => c.changePercentage <= 0).slice(0, 3);
    const itemsTable = cheapItems
      .map((item) => {
        const p = getRegionalPrice(item.currentAvgPrice, region);
        return `| **${item.name}** | \`${formatRupiah(p)}/${item.unit}\` | ${item.changePercentage}% |`;
      })
      .join('\n');

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      timestamp,
      provider: 'grounded-fallback',
      content:
        `### Komoditas Hemat di ${region.name}\n\n` +
        `| Komoditas | Harga Wilayah | Tren 7 Hari |\n` +
        `| :--- | ---: | ---: |\n` +
        `${itemsTable}\n\n` +
        `> **Tips Rin**: Bandingkan harga antar pasar terlebih dahulu di Peta atau menu Cek Harga sebelum bertransaksi.`,
      referencedCommodities: cheapItems.map((c) => ({
        id: c.id,
        name: c.name,
        currentPrice: getRegionalPrice(c.currentAvgPrice, region),
        unit: c.unit,
        status: 'MUCH_CHEAPER',
        statusLabel: 'Stabil & Hemat',
      })),
      suggestedActions: [
        { label: 'Peta Pasar Termurah', href: '/peta' },
        { label: 'Komparasi AI Multi-Sumber', href: '/rekomendasi-ai' },
      ],
    };
  }

  const matchedAny = MOCK_COMMODITY_SUMMARIES.find(
    (c) => lower.includes(c.name.toLowerCase()) || lower.includes(c.slug.replace('-', ' '))
  );

  if (matchedAny) {
    const regionalPrice = getRegionalPrice(matchedAny.currentAvgPrice, region);
    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      timestamp,
      provider: 'grounded-fallback',
      content:
        `### Ringkasan Lintas Sumber: ${matchedAny.name}\n\n` +
        `| Sumber Data | Harga (${region.name}) |\n` +
        `| :--- | ---: |\n` +
        `| Panel Harga Bapanas (HAP/HET) | \`${formatRupiah(matchedAny.hapHetPrice)}/${matchedAny.unit}\` |\n` +
        `| Survei PIHPS & Pasar Rakyat | \`${formatRupiah(regionalPrice)}/${matchedAny.unit}\` |\n\n` +
        `- **Tren 7 Hari**: ${matchedAny.changePercentage > 0 ? `+${matchedAny.changePercentage}% (Naik)` : `${matchedAny.changePercentage}% (Stabil/Turun)`}\n` +
        `- **Batas Tawar Ideal**: Jika ditawari di atas \`${formatRupiah(Math.round(regionalPrice * 1.15))}/${matchedAny.unit}\`, kamu punya acuan kuat untuk menawar.`,
      referencedCommodities: [
        {
          id: matchedAny.id,
          name: matchedAny.name,
          currentPrice: regionalPrice,
          unit: matchedAny.unit,
        },
      ],
      suggestedActions: [
        { label: `Detail ${matchedAny.name}`, href: `/komoditas/${matchedAny.slug}` },
        { label: 'Cek Harga Wajar Lapak', href: '/cek-harga' },
      ],
    };
  }

  return {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    timestamp,
    provider: 'grounded-fallback',
    content:
      `### Halo, saya Rin!\n\nSaya asisten harga pangan **HargaKu** untuk wilayah **${region.name}** (${region.islandName}):\n\n` +
      `1. **Bandingkan Lintas Sumber**: Panel Bapanas, PIHPS BI, Pasar Rakyat, dan Laporan Warga\n` +
      `2. **Cek Kewajaran Tawaran**: Misal *"Cabai rawit 25rb seperempat kilo wajar gak?"*\n` +
      `3. **Cari Komoditas Hemat**: Rekomendasi bahan dengan deviasi harga paling rendah`,
    suggestedActions: [
      { label: 'Komparasi AI Multi-Sumber', href: '/rekomendasi-ai' },
      { label: 'Cek Harga Wajar', href: '/cek-harga' },
    ],
  };
}
