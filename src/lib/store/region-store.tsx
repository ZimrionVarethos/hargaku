'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { Region, Market } from '@/types';
import { MOCK_REGIONS, DEFAULT_REGION } from '@/lib/mock/regions.data';
import { getMarketsByRegion } from '@/lib/mock/markets.data';

interface RegionContextValue {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  allRegions: Region[];
  regionMarkets: Market[];
  calculateRegionalPrice: (baseNationalPrice: number) => number;
}

const RegionContext = createContext<RegionContextValue | undefined>(undefined);

const STORAGE_KEY = 'hargaku_active_region_id';

export function RegionProvider({ children }: { children: ReactNode }) {
  const [selectedRegion, setSelectedRegionState] = useState<Region>(DEFAULT_REGION);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const found = MOCK_REGIONS.find((r) => r.id === savedId || r.slug === savedId);
        if (found) {
          setSelectedRegionState(found);
        }
      }
    } catch {
    }
  }, []);

  const setSelectedRegion = useCallback((region: Region) => {
    setSelectedRegionState(region);
    try {
      localStorage.setItem(STORAGE_KEY, region.id);
    } catch {
    }
  }, []);

  const regionMarkets = useMemo(() => {
    return getMarketsByRegion(selectedRegion.id);
  }, [selectedRegion]);

  const calculateRegionalPrice = useCallback(
    (baseNationalPrice: number): number => Math.round(baseNationalPrice * selectedRegion.disparityIndex),
    [selectedRegion]
  );

  const contextValue = useMemo<RegionContextValue>(
    () => ({
      selectedRegion,
      setSelectedRegion,
      allRegions: MOCK_REGIONS,
      regionMarkets,
      calculateRegionalPrice,
    }),
    [selectedRegion, setSelectedRegion, regionMarkets, calculateRegionalPrice]
  );

  return <RegionContext.Provider value={contextValue}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}
