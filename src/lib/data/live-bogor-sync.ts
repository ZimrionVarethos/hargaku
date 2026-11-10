'use client';

import { useMemo } from 'react';
import { BOGOR_COMMODITIES, BogorCommodity } from './bogor-commodities';
import { useLiveCatalog } from '@/lib/store/use-live-catalog';
import type { CommoditySummary } from '@/types';

function normalizeCommodityName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\bcabe\b/g, 'cabai')
    .replace(/\b(ir-64|brebes|bonggol|curah|broiler|kemasan|lokal|murni|pipilan)\b/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findMatchingLivePrice(
  bogorItem: BogorCommodity,
  liveCommodities: CommoditySummary[]
): number {
  if (!liveCommodities.length) return bogorItem.price;
  const target = normalizeCommodityName(bogorItem.name);

  for (const live of liveCommodities) {
    const candidate = normalizeCommodityName(live.name);
    if (
      candidate === target ||
      (target.length >= 8 && (candidate.includes(target) || target.includes(candidate)))
    ) {
      return live.currentAvgPrice > 0 ? live.currentAvgPrice : bogorItem.price;
    }
  }
  return bogorItem.price;
}

export function useLiveBogorCommodities(): BogorCommodity[] {
  const { commodities } = useLiveCatalog();

  return useMemo(() => {
    return BOGOR_COMMODITIES.map((item) => ({
      ...item,
      price: findMatchingLivePrice(item, commodities),
    }));
  }, [commodities]);
}

