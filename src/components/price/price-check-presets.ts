export interface TakaranUnit {
  id: string;
  shortLabel: string;
  label: string;
  gramMultiplier: number;
}

export const TAKARAN_UNITS: TakaranUnit[] = [
  { id: 'kg', shortLabel: 'kg', label: '1 kg (Sekilo)', gramMultiplier: 1000 },
  { id: 'half', shortLabel: '500g', label: '1/2 kg (Setengah)', gramMultiplier: 500 },
  { id: 'quarter', shortLabel: '250g', label: '1/4 kg (Seperempat)', gramMultiplier: 250 },
  { id: 'ons', shortLabel: 'ons', label: 'Ons (100 gram)', gramMultiplier: 100 },
  { id: 'liter', shortLabel: 'liter', label: '1 Liter', gramMultiplier: 1000 },
  { id: 'ikat', shortLabel: 'ikat', label: '1 Ikat / Satuan', gramMultiplier: 1000 },
];

export const POPULAR_PORTIONS = [
  { id: '1kg', label: '1 kg', hint: 'Sekilo', amount: 1, unitId: 'kg' },
  { id: 'half', label: '1/2 kg', hint: 'Setengah', amount: 1, unitId: 'half' },
  { id: 'quarter', label: '1/4 kg', hint: 'Seperempat', amount: 1, unitId: 'quarter' },
  { id: '1ons', label: '1 ons', hint: '100 gram', amount: 1, unitId: 'ons' },
];

export interface PriceQuickPreset {
  id: string;
  label: string;
  slugHints: string[];
  amount: number;
  unitId: string;
  price: number;
}

export const PRICE_QUICK_PRESETS: PriceQuickPreset[] = [
  {
    id: 'preset_cabai',
    label: 'Cabai 1/4 kg · Rp 18rb',
    slugHints: ['cabai-rawit-merah', 'cabai'],
    amount: 1,
    unitId: 'quarter',
    price: 18000,
  },
  {
    id: 'preset_beras',
    label: 'Beras 5 kg · Rp 75rb',
    slugHints: ['beras-medium-ir64', 'beras-medium', 'beras'],
    amount: 5,
    unitId: 'kg',
    price: 75000,
  },
  {
    id: 'preset_telur',
    label: 'Telur 1 kg · Rp 30rb',
    slugHints: ['telur-ayam-ras', 'telur'],
    amount: 1,
    unitId: 'kg',
    price: 30000,
  },
];

export function formatPortionLabel(amount: number, unitId: string): string {
  if (amount === 1 && unitId === 'quarter') return '1/4 kg';
  if (amount === 1 && unitId === 'half') return '1/2 kg';
  const unit = TAKARAN_UNITS.find((u) => u.id === unitId);
  return `${amount} ${unit?.shortLabel || 'kg'}`;
}

