'use client';

import Link from 'next/link';

interface TickerCommodity {
  type?: 'commodity';
  name: string;
  price: string;
  market: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  diffText: string;
}

interface TickerBadge {
  type: 'badge';
  text: string;
}

interface TickerInfo {
  type: 'info';
  text: string;
}

type TickerItem = TickerCommodity | TickerBadge | TickerInfo;

const TICKER_ITEMS: TickerItem[] = [
  {
    type: 'badge',
    text: 'DATA SIMULASI DEMO WIA 2026 · Mengacu Struktur PIHPS & Bapanas',
  },
  {
    name: 'Cabai Rawit Merah',
    price: 'Rp 62.000/kg',
    market: 'Pasar Sukasari',
    trend: 'UP',
    diffText: '▲ +4.2% Naik',
  },
  {
    name: 'Bawang Merah Brebes',
    price: 'Rp 34.000/kg',
    market: 'Pasar Anyar',
    trend: 'DOWN',
    diffText: '▼ -2.8% Turun',
  },
  {
    name: 'Beras Medium IR-64',
    price: 'Rp 13.500/kg',
    market: 'Kebon Kembang',
    trend: 'STABLE',
    diffText: '~ Stabil',
  },
  {
    name: 'Daging Ayam Broiler',
    price: 'Rp 38.000/kg',
    market: 'Pasar Jambu Dua',
    trend: 'UP',
    diffText: '▲ +3.1% Naik',
  },
  {
    name: 'Daging Sapi Murni',
    price: 'Rp 134.000/kg',
    market: 'Pasar Sukasari',
    trend: 'DOWN',
    diffText: '▼ -1.5% Turun',
  },
  {
    name: 'Telur Ayam Ras',
    price: 'Rp 27.500/kg',
    market: 'Pasar Sukasari',
    trend: 'STABLE',
    diffText: '~ Stabil',
  },
  {
    name: 'Minyak Goreng Curah',
    price: 'Rp 15.800/kg',
    market: 'Pasar Anyar',
    trend: 'DOWN',
    diffText: '▼ -2.0% Turun',
  },
  {
    name: 'Cabai Merah Keriting',
    price: 'Rp 53.000/kg',
    market: 'Pasar Gunung Batu',
    trend: 'UP',
    diffText: '▲ +2.5% Naik',
  },
  {
    type: 'info',
    text: 'TREN HARGA HARIAN PASAR TRADISIONAL (vs Hari Kemarin) · UPDATE 06:00 WIB',
  },
];

function TickerTrack() {
  return (
    <div className="flex items-center gap-7 shrink-0 pr-7">
      {TICKER_ITEMS.map((item, idx) => {
        if (item.type === 'badge') {
          return (
            <Link
              key={idx}
              href="/tentang"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group/badge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EEF773] animate-pulse shrink-0" />
              <span className="text-[#EEF773] font-bold uppercase tracking-wider text-[10px] whitespace-nowrap group-hover/badge:underline underline-offset-2">
                {item.text} ↗
              </span>
            </Link>
          );
        }

        if (item.type === 'info') {
          return (
            <div
              key={idx}
              className="flex items-center gap-2 text-[#8E8D86] text-[10px] font-semibold tracking-wider whitespace-nowrap"
            >
              <span className="text-[#55534E]">●</span>
              <span>{item.text}</span>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="flex items-center gap-2 text-[11px] whitespace-nowrap"
          >
            <span className="text-[#A8A7A1]">{item.name}:</span>
            <span className="font-bold text-[#F4F3F0] tabular-nums">
              {item.price}
            </span>
            <span className="text-[10px] text-[#8E8D86]">({item.market})</span>
            <span
              className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded border ${
                item.trend === 'UP'
                  ? 'text-[#FCA5A5] bg-[#DC2626]/20 border-[#EF4444]/40'
                  : item.trend === 'DOWN'
                  ? 'text-[#EEF773] bg-[#EEF773]/15 border-[#EEF773]/30'
                  : 'text-[#D1CFCA] bg-white/10 border-white/15'
              }`}
            >
              {item.diffText}
            </span>
            <span className="text-[#3E3C38] select-none pl-1">/</span>
          </div>
        );
      })}
    </div>
  );
}

export function SimulationBadge() {
  return (
    <div
      role="status"
      aria-label="Live Commodity Price Ticker"
      className="relative w-full bg-[#181716] text-[#F4F3F0] h-[34px] border-b border-[#2C2A26] flex items-center overflow-hidden group select-none cursor-default"
    >
      {/* Edge gradient masks for smooth fade-in and fade-out */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#181716] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#181716] to-transparent z-10 pointer-events-none" />

      {/* Infinite Seamless Running Tracks */}
      <div className="flex animate-ticker">
        <TickerTrack />
        <TickerTrack />
      </div>
    </div>
  );
}
