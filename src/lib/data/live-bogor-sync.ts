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

interface NormalizedLiveEntry {
  normalized: string;
  price: number;
}

function matchPriceFromNormalized(
  bogorItem: BogorCommodity,
  normalizedLive: NormalizedLiveEntry[]
): number {
  if (normalizedLive.length === 0) return bogorItem.price;
  const target = normalizeCommodityName(bogorItem.name);

  for (const live of normalizedLive) {
    if (
      live.normalized === target ||
      (target.length >= 8 && (live.normalized.includes(target) || target.includes(live.normalized)))
    ) {
      return live.price > 0 ? live.price : bogorItem.price;
    }
  }
  return bogorItem.price;
}

export function findMatchingLivePrice(
  bogorItem: BogorCommodity,
  liveCommodities: CommoditySummary[]
): number {
  if (!liveCommodities.length) return bogorItem.price;
  return matchPriceFromNormalized(
    bogorItem,
    liveCommodities.map((live) => ({
      normalized: normalizeCommodityName(live.name),
      price: live.currentAvgPrice,
    }))
  );
}

export function useLiveBogorCommodities(): BogorCommodity[] {
  const { commodities } = useLiveCatalog();

  return useMemo(() => {
    const normalizedLive = commodities.map((live) => ({
      normalized: normalizeCommodityName(live.name),
      price: live.currentAvgPrice,
    }));
    return BOGOR_COMMODITIES.map((item) => ({
      ...item,
      price: matchPriceFromNormalized(item, normalizedLive),
    }));
  }, [commodities]);
}

