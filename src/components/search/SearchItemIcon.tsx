'use client';

import {
  Calculator,
  ChartLineUp,
  ChatCircleDots,
  GlobeHemisphereEast,
  House,
  Info,
  ListBullets,
  MapPin,
  MapTrifold,
  MegaphoneSimple,
  Question,
  Storefront,
  Train,
} from '@phosphor-icons/react';
import { CommoditySvg } from '@/lib/data/market-svgs';
import type { SiteSearchItem } from '@/lib/search/site-search';

export function SearchItemIcon({
  item,
  size = 16,
}: {
  item: Pick<SiteSearchItem, 'kind' | 'svgKind' | 'iconKey' | 'nearStation'>;
  size?: number;
}) {
  if (item.kind === 'COMMODITY') {
    return <CommoditySvg kind={item.svgKind} />;
  }

  if (item.kind === 'MARKET') {
    return item.nearStation ? (
      <Train size={size} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />
    ) : (
      <Storefront size={size} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />
    );
  }

  if (item.kind === 'REGION') {
    return (
      <GlobeHemisphereEast
        size={size}
        weight="bold"
        className="text-[var(--forest-ink)]"
        aria-hidden="true"
      />
    );
  }

  switch (item.iconKey) {
    case 'home':
      return <House size={size} weight="bold" className="text-[var(--text-primary)]" aria-hidden="true" />;
    case 'list':
      return <ListBullets size={size} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />;
    case 'calculator':
      return <Calculator size={size} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />;
    case 'ai':
      return <ChatCircleDots size={size} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />;
    case 'map':
      return <MapTrifold size={size} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />;
    case 'megaphone':
      return <MegaphoneSimple size={size} weight="bold" className="text-[var(--warning-ink)]" aria-hidden="true" />;
    case 'chart':
      return <ChartLineUp size={size} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />;
    case 'question':
      return <Question size={size} weight="bold" className="text-[var(--accent-chili)]" aria-hidden="true" />;
    case 'info':
      return <Info size={size} weight="bold" className="text-[var(--forest-ink)]" aria-hidden="true" />;
    default:
      return <MapPin size={size} weight="bold" className="text-[var(--text-primary)]" aria-hidden="true" />;
  }
}

