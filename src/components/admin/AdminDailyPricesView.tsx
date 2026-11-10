'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdminStore } from '@/lib/store/admin-store';
import { MOCK_REGIONS } from '@/lib/mock/regions.data';
import { DailyPriceTable } from './DailyPriceTable';
import { AdminMarketSelector } from './AdminMarketSelector';
import { CheckCircle, Clock, MapPin, Storefront } from '@phosphor-icons/react';

export function AdminDailyPricesView() {
  const { markets, commodities, dailyPrices, updateDailyPrices } = useAdminStore();

  const activeMarkets = useMemo(() => markets.filter((m) => m.isActive), [markets]);
  const activeCommodities = useMemo(() => commodities.filter((c) => c.isActive), [commodities]);
  const regionMap = useMemo(() => new Map(MOCK_REGIONS.map((r) => [r.id, r])), []);

  const [selectedIsland, setSelectedIsland] = useState<string>('ALL');
  const [selectedMarketId, setSelectedMarketId] = useState<string>(
    activeMarkets[0]?.id || 'kebon-kembang'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recordedDate, setRecordedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const islandFilteredMarkets = useMemo(() => {
    return activeMarkets.filter((m) => {
      const reg = m.regionId ? regionMap.get(m.regionId) : undefined;
      return selectedIsland === 'ALL' || reg?.island === selectedIsland;
    });
  }, [activeMarkets, selectedIsland, regionMap]);

  const searchFilteredMarkets = useMemo(() => {
    if (!searchQuery.trim()) return islandFilteredMarkets;
    const q = searchQuery.toLowerCase();
    return activeMarkets.filter((m) => {
      const reg = m.regionId ? regionMap.get(m.regionId) : undefined;
      return (
        m.name.toLowerCase().includes(q) ||
        (m.city && m.city.toLowerCase().includes(q)) ||
        (m.district && m.district.toLowerCase().includes(q)) ||
        (reg && reg.name.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, islandFilteredMarkets, activeMarkets, regionMap]);

  useEffect(() => {
    if (selectedIsland === 'ALL') return;
    const isCurrentInIsland = islandFilteredMarkets.some((m) => m.id === selectedMarketId);
    if (!isCurrentInIsland && islandFilteredMarkets.length > 0) {
      setSelectedMarketId(islandFilteredMarkets[0].id);
    }
  }, [selectedIsland, islandFilteredMarkets, selectedMarketId]);

  useEffect(() => {
    const newInputs: Record<string, string> = {};
    activeCommodities.forEach((c) => {
      const key = `${selectedMarketId}_${c.id}`;
      const existing = dailyPrices[key];
      newInputs[c.id] = existing ? String(existing.price) : '';
    });
    setInputs(newInputs);
  }, [selectedMarketId, activeCommodities, dailyPrices]);

  const handleInputChange = (commodityId: string, value: string) => {
    const clean = value.replace(/[^0-9]/g, '');
    setInputs((prev) => ({ ...prev, [commodityId]: clean }));
  };

  const handleSelectMarket = (marketId: string) => {
    setSelectedMarketId(marketId);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const currentMarket = useMemo(() => {
    return markets.find((m) => m.id === selectedMarketId);
  }, [markets, selectedMarketId]);

  const currentRegion = useMemo(() => {
    if (!currentMarket?.regionId) return undefined;
    return regionMap.get(currentMarket.regionId);
  }, [currentMarket, regionMap]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: { commodityId: string; price: number }[] = [];
    Object.entries(inputs).forEach(([commodityId, valStr]) => {
      const p = parseInt(valStr, 10);
      if (!isNaN(p) && p > 0) {
        updates.push({ commodityId, price: p });
      }
    });

    if (updates.length === 0) return;

    updateDailyPrices(selectedMarketId, recordedDate, updates);
    setSuccessMessage(`Berhasil menyimpan ${updates.length} entri harga untuk ${currentMarket?.name || 'Pasar'}`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <AdminMarketSelector
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        selectedIsland={selectedIsland}
        setSelectedIsland={setSelectedIsland}
        filteredMarkets={searchFilteredMarkets}
        selectedMarketId={selectedMarketId}
        handleSelectMarket={handleSelectMarket}
        regionMap={regionMap}
      />

      {/* Quick market scrollable track */}
      <div className="bg-white border border-[#E5E3DE] rounded-[20px] p-4 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1B1A18]">
            Akses Cepat Pasar {selectedIsland !== 'ALL' ? `(Koridor ${selectedIsland})` : '(Semua Wilayah)'}:
          </span>
          <span className="text-[11px] text-[#A8A29E]">
            {islandFilteredMarkets.length} pasar · Geser ke samping untuk memilih pasar lain
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 -mx-1 px-1 scrollbar-none">
          {islandFilteredMarkets.map((m) => {
            const isSelected = m.id === selectedMarketId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMarket(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B1A18] text-white border-[#1B1A18] shadow-xs'
                    : 'bg-[#FAF9F5] text-[#706E6A] border-[#E5E3DE] hover:bg-white hover:text-[#1B1A18]'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Public Context Banner */}
      <div className="bg-white border border-[#E5E3DE] rounded-[20px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#E5E3DE] flex items-center justify-center text-[#FF7714] shrink-0">
            <Storefront size={20} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#1B1A18]">{currentMarket?.name}</h3>
              <span className="px-2 py-0.5 rounded-md bg-[#FAF9F5] text-[#706E6A] border border-[#E5E3DE] text-[11px] font-medium flex items-center gap-1">
                <MapPin size={12} weight="bold" />
                {currentRegion ? `${currentRegion.name} (${currentRegion.islandName})` : currentMarket?.city || 'Nasional'}
              </span>
            </div>
            <p className="text-xs text-[#706E6A] mt-0.5">
              {currentMarket?.address || 'Alamat pasar terdaftar di konsol admin'} · {currentMarket?.district}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DE] text-xs font-medium text-[#1B1A18]">
            <Clock size={14} className="text-[#706E6A]" />
            <input
              type="date"
              value={recordedDate}
              onChange={(e) => setRecordedDate(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-[#1B1A18] focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] text-xs font-semibold flex items-center gap-2">
          <CheckCircle size={16} weight="bold" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Prices Form Table */}
      <DailyPriceTable
        currentMarketName={currentMarket?.name || 'Pasar'}
        activeCommodities={activeCommodities}
        dailyPrices={dailyPrices}
        selectedMarketId={selectedMarketId}
        inputs={inputs}
        onPriceChange={handleInputChange}
        onSubmit={handleSave}
      />
    </div>
  );
}
