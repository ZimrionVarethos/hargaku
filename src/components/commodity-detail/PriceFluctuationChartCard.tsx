'use client';

import { useState } from 'react';
import { CommodityDetail } from '@/types';

interface Props {
  detail: CommodityDetail;
}

const DAILY_SERIES_30D = [
  { day: '22 Sep', price: 56000 },
  { day: '24 Sep', price: 56200 },
  { day: '26 Sep', price: 56500 },
  { day: '28 Sep', price: 56800 },
  { day: '30 Sep', price: 57000 },
  { day: '02 Okt', price: 57200 },
  { day: '04 Okt', price: 57000 },
  { day: '06 Okt', price: 57500 },
  { day: '08 Okt', price: 57800 },
  { day: '10 Okt', price: 58000 },
  { day: '12 Okt', price: 58500 },
  { day: '14 Okt', price: 59000 },
  { day: '16 Okt', price: 59800 },
  { day: '17 Okt', price: 60500 },
  { day: '18 Okt', price: 61000 },
  { day: '19 Okt', price: 61400 },
  { day: '20 Okt', price: 61800 },
  { day: '21 Okt', price: 62200 },
  { day: '22 Okt', price: 62500 },
];

export function PriceFluctuationChartCard({ detail }: Props) {
  const [activeRange, setActiveRange] = useState<'7' | '30' | '90'>('30');
  const hapPrice = detail.reference.priceHapHet;

  const minVal = 54000;
  const maxVal = 65000;
  const range = maxVal - minVal;

  const hapTopPercent = Math.round(((maxVal - hapPrice) / range) * 100);

  return (
    <div className="bg-white rounded-[18px] outline outline-1 outline-[#E5E3DE] p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[16px] font-bold text-[#1B1A18] tracking-tight">
            Tren Fluktuasi 30 Hari vs Batas HAP Acuan
          </h3>
          <p className="text-[12px] text-[#6E6D67]">
            Pergerakan harga harian dibanding batas toleransi resmi Bapanas
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-[8px] bg-[#FAF9F5] outline outline-1 outline-[#E5E3DE] text-[11px] font-medium w-fit">
          <button
            type="button"
            onClick={() => setActiveRange('7')}
            className={`px-2.5 py-1 rounded-[6px] transition-all ${
              activeRange === '7' ? 'bg-[#1B1A18] text-white shadow-xs' : 'text-[#6E6D67] hover:text-[#1B1A18]'
            }`}
          >
            7 Hari
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('30')}
            className={`px-2.5 py-1 rounded-[6px] transition-all ${
              activeRange === '30' ? 'bg-[#1B1A18] text-white shadow-xs' : 'text-[#6E6D67] hover:text-[#1B1A18]'
            }`}
          >
            30 Hari
          </button>
          <button
            type="button"
            onClick={() => setActiveRange('90')}
            className={`px-2.5 py-1 rounded-[6px] transition-all ${
              activeRange === '90' ? 'bg-[#1B1A18] text-white shadow-xs' : 'text-[#6E6D67] hover:text-[#1B1A18]'
            }`}
          >
            90 Hari
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#8C8B85] border-b border-[#E5E3DE] pb-2">
        <span>Maks 30 Hari: Rp {maxVal.toLocaleString('id-ID')}</span>
        <span className="font-semibold text-[#1B1A18]">
          Garis Acuan: Batas HAP Rp {hapPrice.toLocaleString('id-ID')}
        </span>
      </div>

      <div className="relative h-44 w-full flex flex-col justify-end">
        <div
          className="absolute left-0 right-0 border-b border-dashed border-[#1B1A18] pointer-events-none z-10 flex items-center justify-end"
          style={{ top: `${hapTopPercent}%` }}
        >
          <span className="text-[10px] font-bold text-[#1B1A18] bg-[#FAF9F5] px-1.5 py-0.5 rounded-[4px] -translate-y-1/2">
            HAP Rp {hapPrice.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="h-full flex items-end gap-1.5 sm:gap-2 pt-6">
          {DAILY_SERIES_30D.map((item, idx) => {
            const barHeight = Math.round(((item.price - minVal) / range) * 100);
            const isOverHap = item.price > hapPrice;
            const isLast = idx === DAILY_SERIES_30D.length - 1;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
              >
                <div
                  className="w-full rounded-t-[3px] transition-all group-hover:opacity-80"
                  style={{
                    height: `${Math.max(15, barHeight)}%`,
                    backgroundColor: isLast
                      ? isOverHap
                        ? '#DC2626'
                        : '#15803D'
                      : isOverHap
                      ? '#F87171'
                      : '#D6D4CE',
                  }}
                  title={`${item.day}: Rp ${item.price.toLocaleString('id-ID')}`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#8C8B85] pt-2 border-t border-[#E5E3DE]">
          <span>22 Sep</span>
          <span>29 Sep</span>
          <span>06 Okt</span>
          <span>13 Okt</span>
          <span className="font-bold text-[#1B1A18]">22 Okt (Hari Ini)</span>
        </div>
      </div>

      <p className="text-[11px] text-[#6E6D67] leading-[16px] pt-1 border-t border-[#E5E3DE]">
        Garis putus-putus = Batas HAP resmi (Rp {hapPrice.toLocaleString('id-ID')}/kg). Bar oranye menunjukkan pergerakan harga yang mulai melampaui batas toleransi resmi sejak pertengahan Oktober.
      </p>
    </div>
  );
}
