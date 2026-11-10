'use client';

import { useState, useId, useEffect } from 'react';
import { CaretDown, Check, Package, Tag } from '@phosphor-icons/react';
import { CommoditySummary, Market, ReportType, ReporterRole, StockStatus } from '@/types';
import { resolveCanonicalMarket } from '@/lib/market-insights';
import { LaporPhotoUpload } from './LaporPhotoUpload';
import {
  LaporPriceInputGroup,
  LaporShortageSelector,
  TAKARAN_UNITS,
  type TakaranUnitOption,
} from './LaporModeFields';

interface Props {
  commodities: CommoditySummary[];
  markets: Market[];
  isSubmitting: boolean;
  initialCommoditySlug?: string;
  initialMarketId?: string;
  initialPrice?: string;
  initialMode?: ReportType;
  onSubmit: (data: {
    commodityId: string;
    marketId: string;
    price: number;
    quantity: number;
    unit: string;
    normalizedPrice: number;
    reportType: ReportType;
    reporterRole: ReporterRole;
    stockStatus?: StockStatus;
    purchaseDate: string;
    photoFile: File | null;
    notes: string;
  }) => void;
}

export function LaporFormCard({
  commodities,
  markets,
  isSubmitting,
  initialCommoditySlug,
  initialMarketId,
  initialPrice,
  initialMode = 'PRICE',
  onSubmit,
}: Props) {
  const [reportType, setReportType] = useState<ReportType>(initialMode);
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(() => {
    if (initialCommoditySlug) {
      const found = commodities.find(
        (c) => c.slug === initialCommoditySlug || c.id === initialCommoditySlug
      );
      if (found) return found.id;
    }
    return commodities[0]?.id || 'cabai-rawit-merah';
  });
  const [selectedMarketId, setSelectedMarketId] = useState<string>(() => {
    const found = resolveCanonicalMarket(markets, initialMarketId);
    return found?.id || markets[0]?.id || 'mkt_kebon_kembang';
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [priceInput, setPriceInput] = useState<string>(initialPrice || '15000');
  const [selectedUnit, setSelectedUnit] = useState<TakaranUnitOption>(
    initialPrice ? TAKARAN_UNITS[0] : TAKARAN_UNITS[2]
  );
  const [stockStatus, setStockStatus] = useState<StockStatus>('TERBATAS');
  const [notes, setNotes] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (markets.length > 0 && !markets.some((m) => m.id === selectedMarketId)) {
      const resolved = resolveCanonicalMarket(markets, initialMarketId);
      setSelectedMarketId(resolved?.id || markets[0].id);
    }
  }, [markets, selectedMarketId, initialMarketId]);

  const fileInputId = useId();
  const rawPrice = parseInt(priceInput.replace(/\D/g, ''), 10) || 0;
  const totalUnitRatio = Math.max(0.05, quantity * selectedUnit.ratioToKg);
  const normalizedPrice = Math.round(rawPrice / totalUnitRatio);
  const isShortage = reportType === 'SHORTAGE';
  const canSubmit = isShortage
    ? !isSubmitting && (notes.trim().length >= 5 || rawPrice >= 0)
    : !isSubmitting && rawPrice > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      commodityId: selectedCommodityId,
      marketId: selectedMarketId,
      price: isShortage ? Math.max(0, rawPrice) : rawPrice,
      quantity,
      unit: quantity > 1 ? `${quantity} x ${selectedUnit.label}` : selectedUnit.label,
      normalizedPrice: isShortage ? 0 : normalizedPrice,
      reportType,
      reporterRole: isShortage ? 'PEDAGANG' : 'WARGA',
      stockStatus: isShortage ? stockStatus : undefined,
      purchaseDate: new Date().toISOString(),
      photoFile,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="market-card p-6 sm:p-8 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-ink)]">
          <button
            type="button"
            onClick={() => setReportType('PRICE')}
            className={`py-2 px-3 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              !isShortage
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-ink)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Tag size={14} weight="bold" className="text-[var(--accent-chili)]" />
            <span>Warga &bull; Lapor Harga</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType('SHORTAGE')}
            className={`py-2 px-3 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isShortage
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-ink)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Package size={14} weight="bold" className="text-[var(--earth-ochre)]" />
            <span>Pedagang &bull; Kelangkaan</span>
          </button>
        </div>

        <div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
            {isShortage ? 'Laporan Kelangkaan Pasokan (Pedagang)' : 'Laporan Harga Tidak Wajar (Warga)'}
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            {isShortage
              ? 'Identitas lapak dan nama pedagang tidak pernah disimpan. Informasi hanya muncul sebagai status pasokan pasar.'
              : 'Bantu pembeli lain mengetahui harga wajar di pasar tujuan lewat catatan lapak Anda.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[var(--text-primary)]">Pilih Komoditas</label>
          <div className="relative">
            <select
              value={selectedCommodityId}
              onChange={(e) => setSelectedCommodityId(e.target.value)}
              className="w-full appearance-none py-2.5 px-3.5 pr-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] font-semibold text-[var(--text-primary)]"
            >
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-[var(--text-primary)]">Pilih Lokasi Pasar</label>
          <div className="relative">
            <select
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              className="w-full appearance-none py-2.5 px-3.5 pr-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[13px] font-semibold text-[var(--text-primary)]"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district}){m.nearStation ? ' [Dekat Stasiun]' : ''}
                </option>
              ))}
            </select>
            <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      {isShortage ? (
        <LaporShortageSelector stockStatus={stockStatus} onChange={setStockStatus} />
      ) : (
        <LaporPriceInputGroup
          quantity={quantity}
          onQuantityChange={setQuantity}
          priceInput={priceInput}
          onPriceChange={setPriceInput}
          selectedUnit={selectedUnit}
          onUnitChange={setSelectedUnit}
          normalizedPrice={normalizedPrice}
        />
      )}

      <LaporPhotoUpload photoFile={photoFile} setPhotoFile={setPhotoFile} fileInputId={fileInputId} />

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-[var(--text-primary)]">
          {isShortage ? 'Keterangan Kendala Pasokan' : 'Catatan Kondisi Lapak'}{' '}
          <span className="font-normal text-[var(--text-muted)]">
            ({isShortage ? 'Tanpa menyebut nama kios' : 'Opsional'})
          </span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            isShortage
              ? 'Contoh: Kiriman distributor dari sentra produksi terlambat karena cuaca, stok tinggal sedikit.'
              : 'Contoh: Kualitas barang segar atau kenaikan terasa di blok sayuran sejak pagi.'
          }
          className="w-full p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-ink)] text-[12px] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="market-btn-primary w-full py-3 text-[13px] font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        <Check size={16} weight="bold" />
        <span>
          {isSubmitting
            ? 'Mengirim Laporan...'
            : isShortage
            ? 'Kirim Laporan Kelangkaan Anonim'
            : 'Kirim Laporan Harga Warga'}
        </span>
      </button>
    </form>
  );
}
