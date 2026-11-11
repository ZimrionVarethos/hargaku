'use client';

import { useRef, useEffect, useMemo, useState, useCallback, type MouseEvent } from 'react';
import { Footprints, MagnifyingGlass } from '@phosphor-icons/react';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { LORONG_COMPARTMENT_SLOTS } from '@/lib/data/market-stalls';
import { ThreeMarketCorridorManager } from './three/three-scene-manager';
import { ThreeStallCompartment } from './three/three-stalls';
import { useTheme } from '@/lib/store/theme-store';

interface Props {
  walkProgress: number;
  walkMeters: number;
  isActive: boolean;
  highlightedLabel?: string | null;
  onSelectCommodity: (item: BogorCommodity) => void;
}

export function LorongThreeMarketAlley({
  walkProgress,
  walkMeters,
  isActive,
  highlightedLabel,
  onSelectCommodity,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const managerRef = useRef<ThreeMarketCorridorManager | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const lastRaycastRef = useRef<number>(0);
  const liveCommodities = useLiveBogorCommodities();

  const commodityById = useMemo(
    () => new Map(liveCommodities.map((b) => [b.id, b])),
    [liveCommodities]
  );

  const compartments: ThreeStallCompartment[] = useMemo(() => {
    return LORONG_COMPARTMENT_SLOTS.map((s) => {
      const item = commodityById.get(s.commodityId);
      const priceStr = item ? `Rp ${item.price.toLocaleString('id-ID')}` : 'Rp 0';
      return {
        ...s,
        name: item ? item.name : s.label,
        priceText: priceStr,
        unitText: item ? `/${item.unit}` : '/kg',
        category: item ? item.category : 'SAYURAN',
      };
    });
  }, [commodityById]);

  const compartmentById = useMemo(
    () => new Map(compartments.map((c) => [c.id, c])),
    [compartments]
  );

  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;
  const compartmentsRef = useRef(compartments);
  const lastTaggedRef = useRef<ThreeStallCompartment[] | null>(null);

  useEffect(() => {
    compartmentsRef.current = compartments;
    if (lastTaggedRef.current === compartments) return;
    lastTaggedRef.current = compartments;
    managerRef.current?.updatePriceTags(compartments);
  }, [compartments]);

  useEffect(() => {
    if (!canvasMountRef.current) return;
    const mountEl = canvasMountRef.current;
    const mgr = new ThreeMarketCorridorManager();
    lastTaggedRef.current = compartmentsRef.current;
    mgr.init(mountEl, isDarkRef.current, compartmentsRef.current);
    mgr.setActive(isActiveRef.current);
    managerRef.current = mgr;

    const handleResize = () => {
      if (!canvasMountRef.current || !managerRef.current) return;
      managerRef.current.handleResize(
        canvasMountRef.current.clientWidth,
        canvasMountRef.current.clientHeight
      );
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    resizeObserver?.observe(mountEl);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      mgr.destroy();
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    managerRef.current?.setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    managerRef.current?.setActive(isActive);
  }, [isActive]);

  useEffect(() => {
    managerRef.current?.updateWalk(walkProgress);
  }, [walkProgress]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!wrapperRef.current || !managerRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const hit = managerRef.current.raycastHit(e.clientX, e.clientY, rect);
      if (hit) {
        const item = commodityById.get(hit.commodityId);
        if (item) onSelectCommodity(item);
      }
    },
    [commodityById, onSelectCommodity]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const now = performance.now();
      if (now - lastRaycastRef.current < 35) return;
      lastRaycastRef.current = now;

      if (!wrapperRef.current || !managerRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const hit = managerRef.current.raycastHit(e.clientX, e.clientY, rect);

      if (hit) {
        const comp = compartmentById.get(hit.compartmentId);
        setHoveredName(comp ? `${comp.name} (${comp.priceText} ${comp.unitText})` : null);
      } else {
        setHoveredName(null);
      }
    },
    [compartmentById]
  );

  const activeBannerText = hoveredName
    ? `${hoveredName} (Klik untuk rincian)`
    : highlightedLabel || null;

  return (
    <div
      ref={wrapperRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredName(null)}
      className="relative w-full h-full overflow-hidden select-none bg-[#F9F3EE] dark:bg-[#140E0A] cursor-pointer"
    >
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {activeBannerText && (
        <div className="absolute top-[74px] sm:top-[64px] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-150 max-w-[92vw]">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#132E20]/95 text-[#FEF08A] text-xs font-bold shadow-md border border-white/20 inline-flex items-center gap-1.5 whitespace-nowrap">
            <MagnifyingGlass size={14} weight="bold" aria-hidden="true" />
            <span className="truncate">{activeBannerText}</span>
          </div>
        </div>
      )}

      <div
        className="hidden md:flex absolute bottom-[62px] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-200"
        style={{ opacity: walkProgress > 0.88 ? Math.max(0, 1 - (walkProgress - 0.88) * 8) : 1 }}
      >
        <div className="px-4 py-1.5 rounded-full bg-[#132E20]/88 backdrop-blur-md border border-[#F9F3EE]/25 text-[#F9F3EE] text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
          <Footprints size={14} weight="bold" className="text-amber-300" aria-hidden="true" />
          <span>Melangkah di Jalan Pasar 3D: {walkMeters} m / 100 m</span>
          <span className="text-amber-300 font-normal">
            &bull; Klik lapak 3D untuk rincian &bull; Scroll untuk melangkah
          </span>
        </div>
      </div>
    </div>
  );
}
