import { AssistantMessage } from '@/types/assistant';
import { Region } from '@/types';
import { MOCK_COMMODITY_SUMMARIES } from '@/lib/mock/commodities.data';
import { INITIAL_ADMIN_STATE } from '@/lib/store/admin-seed';
import {
  PIHPS_POSITIONING_NOTE,
  computeMarketInsights,
  computeStationAreaInsights,
  findMentionedMarket,
} from '@/lib/market-insights';
import { evaluatePrice, formatRupiah } from '@/lib/price-logic';

function getRegionalPrice(basePrice: number, region: Region): number {
  if (!region.logisticsCostPct || region.logisticsCostPct === 0) return basePrice;
  return Math.round((basePrice * (1 + region.logisticsCostPct / 100)) / 100) * 100;
}

export async function processAssistantMessage(
  userText: string,
  region: Region
): Promise<AssistantMessage> {
  const lower = userText.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const matchedMarket = findMentionedMarket(INITIAL_ADMIN_STATE.markets, userText);
  const asksMarketAlert =
    Boolean(matchedMarket) ||
    lower.includes('stasiun') ||
    lower.includes('mahal') ||
    lower.includes('langka') ||
    lower.includes('kelangkaan') ||
    lower.includes('stok') ||
    lower.includes('laporan pasar');

  if (asksMarketAlert && !lower.includes('wajar') && !lower.includes('nawarin')) {
    const targets = matchedMarket
      ? [
          computeMarketInsights({
            marketId: matchedMarket.id,
            marketName: matchedMarket.name,
            commodities: INITIAL_ADMIN_STATE.commodities,
            markets: INITIAL_ADMIN_STATE.markets,
            dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
            reports: INITIAL_ADMIN_STATE.reports,
            disparityIndex: region.disparityIndex,
          }),
        ]
      : computeStationAreaInsights({
          commodities: INITIAL_ADMIN_STATE.commodities,
          markets: INITIAL_ADMIN_STATE.markets,
          dailyPrices: INITIAL_ADMIN_STATE.dailyPrices,
          reports: INITIAL_ADMIN_STATE.reports,
        }).filter((s) => s.expensiveItems.length > 0 || s.shortageAlerts.length > 0);

    const rows = targets
      .flatMap((mkt) => {
        const expRows = mkt.expensiveItems.map(
          (item) =>
            `| **${mkt.marketName}**${mkt.nearStation ? ' *(Dekat Stasiun)*' : ''} | ${item.commodityName} | \`${formatRupiah(item.reportedMedianPrice)}/${item.unit}\` (+${item.diffPercent}% vs acuan) | Laporan Warga (${item.reportCount}x) |`
        );
        const shRows = mkt.shortageAlerts.map(
          (al) =>
            `| **${mkt.marketName}**${mkt.nearStation ? ' *(Dekat Stasiun)*' : ''} | ${al.commodityName} | Status Stok: **${al.stockStatus}** | Info Pedagang (${al.reportCount}x) |`
        );
        return [...expRows, ...shRows];
      })
      .slice(0, 8);

    const title = matchedMarket
      ? `### Laporan Pasar: ${matchedMarket.name}`
      : '### Pantauan Pasar Dekat Stasiun & Laporan Warga';

    const table =
      rows.length > 0
        ? `| Pasar | Komoditas | Temuan Harga / Stok | Sumber |\n| :--- | :--- | :--- | :--- |\n${rows.join('\n')}`
        : 'Belum ada lonjakan harga atau laporan kelangkaan aktif pada pasar tersebut.';

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      timestamp,
      provider: 'grounded-fallback',
      content:
        `${title}\n\n${table}\n\n` +
        `> **Catatan Posisi**: ${PIHPS_POSITIONING_NOTE}`,
      suggestedActions: [
        { label: 'Cek Harga di Pasar Ini', href: matchedMarket ? `/cek-harga?market=${matchedMarket.id}` : '/cek-harga' },
        { label: 'Lapor Harga / Kelangkaan', href: matchedMarket ? `/lapor?market=${matchedMarket.id}` : '/lapor' },
        { label: 'Lihat Peta Pasar', href: '/peta' },
      ],
    };
  }

  if (lower.includes('wajar') || lower.includes('kemahalan') || lower.includes('nawarin')) {
    let matchedCom = MOCK_COMMODITY_SUMMARIES.find(
      (c) => lower.includes(c.name.toLowerCase()) || lower.includes(c.slug.replace(/-/g, ' '))
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
        lapis1NationalHap: commodity.hapHetPrice,
        lapis2OfficialAvg: benchmarkPrice,
        lapis2PihpsCityAvg: benchmarkPrice,
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
        `| Pembanding | Nominal | Keterangan |\n` +
        `| :--- | ---: | :--- |\n` +
        `| Tawaran Lapak | \`${formatRupiah(offeredPerKg)}/kg\` | Harga disetarakan |\n` +
        `| Acuan Lokal ${region.name} | \`${formatRupiah(benchmarkPrice)}/kg\` | Survei & PIHPS daerah |\n` +
        `| Acuan Nasional (HAP/HET) | \`${formatRupiah(commodity.hapHetPrice)}/kg\` | Standar Bapanas RI |\n\n` +
        `Status saat ini: **${evalResult.statusLabel}** (${isOver ? `+${diffPct}%` : `${diffPct}%`} terhadap acuan lokal).\n\n` +
        `> **Saran PUNTEN**: ${evalResult.advice}`,
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
        { label: 'Buka Form Cek Harga', href: `/cek-harga?commodity=${commodity.slug}` },
        { label: 'Lapor Harga / Kelangkaan', href: `/lapor?commodity=${commodity.slug}` },
      ],
    };
  }

  if (lower.includes('murah') || lower.includes('turun') || lower.includes('hemat')) {
    const cheapItems = MOCK_COMMODITY_SUMMARIES.filter((c) => c.changePercentage <= 0).slice(0, 3);
    const itemsTable = cheapItems
      .map((item) => {
        const p = getRegionalPrice(item.currentAvgPrice, region);
        return `| **${item.name}** | \`${formatRupiah(item.hapHetPrice)}/${item.unit}\` | \`${formatRupiah(p)}/${item.unit}\` | ${item.changePercentage}% |`;
      })
      .join('\n');

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      timestamp,
      provider: 'grounded-fallback',
      content:
        `### Komoditas Hemat di ${region.name}\n\n` +
        `| Komoditas | Acuan Nasional | Acuan Daerah | Tren 7 Hari |\n` +
        `| :--- | ---: | ---: | ---: |\n` +
        `${itemsTable}\n\n` +
        `> **Tips PUNTEN**: Cek kondisi pasokan di direktori pasar atau gunakan Cek Harga sebelum menawar di lapak.`,
      referencedCommodities: cheapItems.map((c) => ({
        id: c.id,
        name: c.name,
        currentPrice: getRegionalPrice(c.currentAvgPrice, region),
        unit: c.unit,
        status: 'MUCH_CHEAPER',
        statusLabel: 'Stabil & Hemat',
      })),
      suggestedActions: [
        { label: 'Peta Pasar Daerah', href: '/peta' },
        { label: 'Cek Harga Wajar', href: '/cek-harga' },
      ],
    };
  }

  const matchedAny = MOCK_COMMODITY_SUMMARIES.find(
    (c) => lower.includes(c.name.toLowerCase()) || lower.includes(c.slug.replace(/-/g, ' '))
  );

  if (matchedAny) {
    const regionalPrice = getRegionalPrice(matchedAny.currentAvgPrice, region);
    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      timestamp,
      provider: 'grounded-fallback',
      content:
        `### Perbandingan Nasional vs ${region.name}: ${matchedAny.name}\n\n` +
        `| Sumber Data | Nominal (${region.name}) |\n` +
        `| :--- | ---: |\n` +
        `| Acuan Nasional Bapanas (HAP/HET) | \`${formatRupiah(matchedAny.hapHetPrice)}/${matchedAny.unit}\` |\n` +
        `| Acuan Lokal & Survei PIHPS | \`${formatRupiah(regionalPrice)}/${matchedAny.unit}\` |\n\n` +
        `- **Tren 7 Hari**: ${matchedAny.changePercentage > 0 ? `+${matchedAny.changePercentage}% (Naik)` : `${matchedAny.changePercentage}% (Stabil/Turun)`}\n` +
        `- **Batas Tawar Pembeli**: Bila tawaran di atas \`${formatRupiah(Math.round(regionalPrice * 1.15))}/${matchedAny.unit}\`, kamu punya acuan kuat untuk menawar.`,
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
        { label: 'Cek Harga Wajar Lapak', href: `/cek-harga?commodity=${matchedAny.slug}` },
      ],
    };
  }

  if (lower.includes('pihps') || lower.includes('peran') || lower.includes('menggantikan')) {
    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      timestamp,
      provider: 'grounded-fallback',
      content:
        `### Peran PasarKu sebagai Pelengkap PIHPS BI & Bapanas\n\n` +
        `${PIHPS_POSITIONING_NOTE}\n\n` +
        `- **Keputusan di Depan Lapak**: Masukkan jumlah, satuan (250g/ons/kg), dan harga tawaran di **Cek Harga** untuk langsung melihat deviasi terhadap acuan nasional dan lokal.\n` +
        `- **Konteks Pasar Setempat**: Cek direktori pasar dekat stasiun atau pusat belanja untuk melihat komoditas yang dilaporkan warga sedang mahal.\n` +
        `- **Sinyal Pasokan Dua Sisi**: Warga melaporkan harga riil, sementara pedagang dapat melaporkan kelangkaan stok (Terbatas/Langka) secara anonim per pasar.`,
      suggestedActions: [
        { label: 'Coba Cek Harga Wajar', href: '/cek-harga' },
        { label: 'Lihat Direktori Pasar', href: '/peta' },
      ],
    };
  }

  return {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    timestamp,
    provider: 'grounded-fallback',
    content:
      `### Halo, saya PUNTEN!\n\nSaya membantu keputusan belanja di **${region.name}** (${region.phaseLabel || 'Fase Aktif'}) dan melengkapi pemantauan PIHPS:\n\n` +
      `1. **Cek Pasar Dekat Stasiun**: Tanya *"Di pasar dekat Stasiun Bogor apa yang sedang mahal atau langka?"*\n` +
      `2. **Cek Kewajaran Tawaran**: Tanya *"Cabai rawit 25rb seperempat kilo wajar gak?"*\n` +
      `3. **Bandingkan Nasional vs Lokal**: Acuan Bapanas (HAP/HET), survei daerah, dan laporan warga`,
    suggestedActions: [
      { label: 'Cek Harga Wajar', href: '/cek-harga' },
      { label: 'Lapor Harga / Kelangkaan', href: '/lapor' },
    ],
  };
}
