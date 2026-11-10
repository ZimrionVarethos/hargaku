'use client';

import { useRef, useEffect, useMemo, useState, useCallback, type MouseEvent } from 'react';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { ThreeMarketCorridorManager } from './three/three-scene-manager';
import { ThreeStallCompartment } from './three/three-stalls';
import { useTheme } from '@/lib/store/theme-store';

interface Props {
  walkProgress: number;
  walkMeters: number;
  onSelectCommodity: (item: BogorCommodity) => void;
}

const COMPARTMENT_SLOTS: Array<{
  id: number;
  commodityId: number;
  label: string;
  zStart: number;
  zEnd: number;
  side: 'left' | 'right';
  produceType: string;
}> = [
  { id: 1, commodityId: 25, label: 'Kol Bulat', zStart: 1, zEnd: 7, side: 'left', produceType: 'kol' },
  { id: 2, commodityId: 30, label: 'Wortel', zStart: 7, zEnd: 13, side: 'left', produceType: 'wortel' },
  { id: 3, commodityId: 41, label: 'Tomat', zStart: 13, zEnd: 19, side: 'left', produceType: 'tomat' },
  { id: 4, commodityId: 16, label: 'Bwg Merah', zStart: 19, zEnd: 25, side: 'left', produceType: 'bawang-merah' },
  { id: 5, commodityId: 17, label: 'Bwg Putih', zStart: 25, zEnd: 31, side: 'left', produceType: 'bawang-putih' },
  { id: 6, commodityId: 19, label: 'Cabe Krtg', zStart: 31, zEnd: 37, side: 'left', produceType: 'cabe' },
  { id: 7, commodityId: 21, label: 'Cabe Rawit', zStart: 37, zEnd: 43, side: 'left', produceType: 'cabe' },
  { id: 8, commodityId: 53, label: 'Jeruk', zStart: 43, zEnd: 49, side: 'left', produceType: 'jeruk' },
  { id: 9, commodityId: 23, label: 'Bayam', zStart: 49, zEnd: 55, side: 'left', produceType: 'sayur' },
  { id: 10, commodityId: 43, label: 'Dg Sapi', zStart: 55, zEnd: 61, side: 'left', produceType: 'daging' },
  { id: 11, commodityId: 24, label: 'Kangkung', zStart: 1, zEnd: 8, side: 'right', produceType: 'sayur' },
  { id: 12, commodityId: 29, label: 'Kc Panjang', zStart: 8, zEnd: 15, side: 'right', produceType: 'sayur' },
  { id: 13, commodityId: 46, label: 'Telur Ayam', zStart: 15, zEnd: 22, side: 'right', produceType: 'telur' },
  { id: 14, commodityId: 2, label: 'Beras Med', zStart: 22, zEnd: 30, side: 'right', produceType: 'beras' },
  { id: 15, commodityId: 8, label: 'Minyak Grg', zStart: 30, zEnd: 38, side: 'right', produceType: 'minyak' },
  { id: 16, commodityId: 57, label: 'Ikan Kmbg', zStart: 38, zEnd: 46, side: 'right', produceType: 'ikan' },
  { id: 17, commodityId: 3, label: 'Beras Prem', zStart: 46, zEnd: 54, side: 'right', produceType: 'beras' },
  { id: 18, commodityId: 48, label: 'Gula Pasir', zStart: 54, zEnd: 61, side: 'right', produceType: 'gula' },
];

export function LorongThreeMarketAlley({
  walkProgress,
  walkMeters,
  onSelectCommodity,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const managerRef = useRef<ThreeMarketCorridorManager | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const liveCommodities = useLiveBogorCommodities();
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const lastRaycastRef = useRef<number>(0);

  const commodityById = useMemo(
    () => new Map(liveCommodities.map((b) => [b.id, b])),
    [liveCommodities]
  );

  const compartments: ThreeStallCompartment[] = useMemo(() => {
    return COMPARTMENT_SLOTS.map((s) => {
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
    const mgr = new ThreeMarketCorridorManager();
    lastTaggedRef.current = compartmentsRef.current;
    mgr.init(canvasMountRef.current, isDark, compartmentsRef.current);
    managerRef.current = mgr;

    const handleResize = () => {
      if (!canvasMountRef.current || !managerRef.current) return;
      managerRef.current.handleResize(
        canvasMountRef.current.clientWidth,
        canvasMountRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      mgr.destroy();
      managerRef.current = null;
    };
  }, [isDark]);

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

  return (
    <div
      ref={wrapperRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredName(null)}
      className="relative flex-1 w-full h-full overflow-hidden select-none bg-[#F9F3EE] dark:bg-[#140E0A] flex flex-col justify-between cursor-pointer"
      title="Klik pada lapak sayur/komoditas 3D untuk melihat rincian harga"
    >
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {hoveredName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-150">
          <div className="px-3.5 py-1.5 rounded-md bg-[#132E20]/95 text-[#FEF08A] text-xs font-bold shadow-md border border-white/20">
            🔍 {hoveredName} (Klik untuk rincian)
          </div>
        </div>
      )}

      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-200"
        style={{ opacity: walkProgress > 0.88 ? Math.max(0, 1 - (walkProgress - 0.88) * 8) : 1 }}
      >
        <div className="px-4 py-1.5 rounded-full bg-[#132E20]/90 backdrop-blur-md border border-[#F9F3EE]/25 text-[#F9F3EE] text-xs font-bold shadow-lg flex items-center gap-2">
          <span>👣</span>
          <span>Melangkah di Jalan Pasar 3D: {walkMeters} m / 100 m</span>
          <span className="hidden sm:inline text-amber-300 font-normal">
            &bull; Klik lapak 3D untuk rincian &bull; Scroll untuk terus melangkah
          </span>
        </div>
      </div>
    </div>
  );
}
