import type { AdminMarket } from '@/lib/types/admin';
import type { CommodityCategory, Market } from '@/types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatDateWIB(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function mapAdminCategoryToPublic(category: string): CommodityCategory {
  switch (category) {
    case 'BERAS':
      return 'BERAS';
    case 'CABAI_BAWANG':
      return 'CABAI_BAWANG';
    case 'DAGING':
      return 'DAGING_TELUR';
    case 'MINYAK':
      return 'MINYAK_GULA';
    case 'SAYUR':
      return 'SAYURAN';
    default:
      return 'CABAI_BAWANG';
  }
}

export function mapAdminMarketToPublic(m: AdminMarket): Market {
  return {
    id: m.id,
    regionId: m.regionId,
    name: m.name,
    slug: m.slug,
    city: m.city || 'Nasional',
    district: m.district,
    latitude: m.latitude,
    longitude: m.longitude,
    isActive: m.isActive,
  };
}
