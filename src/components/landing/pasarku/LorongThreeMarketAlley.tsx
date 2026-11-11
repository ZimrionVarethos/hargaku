'use client';

import {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type PointerEvent,
} from 'react';
import { Basket, Compass, Footprints, MagnifyingGlass } from '@phosphor-icons/react';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { LORONG_COMPARTMENT_SLOTS } from '@/lib/data/market-stalls';
import { ThreeMarketCorridorManager } from './three/three-scene-manager';
import { ThreeStallCompartment } from './three/three-stalls';
import {
  advanceFootstepAccumulator,
  isPointerDragGesture,
  resolveCorridorKeyAction,
} from './three/three-corridor-math';
import { CorridorAudioHandle } from './three/three-corridor-audio';
import { useTheme } from '@/lib/store/theme-store';

interface Props {
  walkProgress: number;
  walkMeters: number;
  isActive: boolean;
  audio?: CorridorAudioHandle | null;
  isSoundEnabled?: boolean;
  highlightedLabel?: string | null;
  onSelectCommodity: (item: BogorCommodity) => void;
}

interface DragTracker {
  active: boolean;
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  moved: boolean;
  captured: boolean;
}

interface BannerPrompt {
  text: string;
  kind: 'stall' | 'basket-item';
}

export function LorongThreeMarketAlley({
  walkProgress,
  walkMeters,
  isActive,
  audio = null,
  isSoundEnabled = true,
  highlightedLabel,
  onSelectCommodity,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const managerRef = useRef<ThreeMarketCorridorManager | null>(null);
  const dragRef = useRef<DragTracker | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoverPrompt, setHoverPrompt] = useState<BannerPrompt | null>(null);
  const [actionBanner, setActionBanner] = useState<BannerPrompt | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTurnedAway, setIsTurnedAway] = useState(false);
  const lastRaycastRef = useRef<number>(0);
  const prevWalkProgressRef = useRef<number>(walkProgress);
  const stepAccRef = useRef<number>(0);
  const lastStepMsRef = useRef<number>(0);
  const leftFootRef = useRef<boolean>(true);
  const liveCommodities = useLiveBogorCommodities();

  const audioRef = useRef<CorridorAudioHandle | null>(audio);
  audioRef.current = audio;
  const isSoundEnabledRef = useRef<boolean>(isSoundEnabled);
  isSoundEnabledRef.current = isSoundEnabled;

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
    mgr.setLookStateListener((turned) => setIsTurnedAway(turned));
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
    if (!isActive) {
      setActionBanner(null);
      setHoverPrompt(null);
      setIsDragging(false);
      dragRef.current = null;
    }
  }, [isActive]);

  useEffect(() => {
    managerRef.current?.updateWalk(walkProgress);
    const prev = prevWalkProgressRef.current;
    prevWalkProgressRef.current = walkProgress;
    if (!isActive) {
      stepAccRef.current = 0;
      return;
    }
    const stepRes = advanceFootstepAccumulator(
      prev,
      walkProgress,
      stepAccRef.current,
      performance.now(),
      lastStepMsRef.current
    );
    stepAccRef.current = stepRes.nextAccumulator;
    lastStepMsRef.current = stepRes.nextLastStepMs;
    if (stepRes.stepTriggered) {
      const leftFoot = leftFootRef.current;
      leftFootRef.current = !leftFoot;
      audioRef.current?.playFootstep(leftFoot);
    }
  }, [walkProgress, isActive]);

  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (document.querySelector('[role="dialog"]')) return;
      const action = resolveCorridorKeyAction(e.key);
      if (!action) return;
      if (action.type === 'look') {
        e.preventDefault();
        if (isSoundEnabledRef.current) void audioRef.current?.unlock();
        managerRef.current?.panLook(action.deltaYaw, 0);
      } else if (action.type === 'recenter') {
        if (isSoundEnabledRef.current) void audioRef.current?.unlock();
        audioRef.current?.playRecenter();
        managerRef.current?.resetLook();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (isSoundEnabledRef.current) {
      void audioRef.current?.unlock();
    }
    let captured = false;
    if (e.pointerType !== 'touch') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
        captured = true;
      } catch {
        captured = false;
      }
    }
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
      captured,
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag && drag.active && drag.pointerId === e.pointerId) {
        const dxStart = e.clientX - drag.startX;
        const dyStart = e.clientY - drag.startY;
        if (!drag.moved) {
          if (!isPointerDragGesture(dxStart, dyStart)) return;
          if (e.pointerType === 'touch' && Math.abs(dyStart) >= Math.abs(dxStart)) {
            drag.active = false;
            return;
          }
          drag.moved = true;
          setIsDragging(true);
          setHoverPrompt(null);
          if (!drag.captured) {
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.captured = true;
            } catch {
              drag.captured = false;
            }
          }
        }
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        managerRef.current?.panLook(
          dx * 0.0044,
          e.pointerType === 'touch' ? dy * 0.002 : dy * 0.0034
        );
        return;
      }

      if (e.pointerType === 'touch') return;
      const now = performance.now();
      if (now - lastRaycastRef.current < 35) return;
      lastRaycastRef.current = now;

      if (!wrapperRef.current || !managerRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const hit = managerRef.current.raycastHit(e.clientX, e.clientY, rect);

      if (!hit) {
        setHoverPrompt(null);
        return;
      }

      if (hit.kind === 'basket-item') {
        setHoverPrompt({
          text: `${hit.commodityName} di keranjang (Klik untuk keluarkan)`,
          kind: 'basket-item',
        });
        return;
      }

      const comp = compartmentById.get(hit.compartmentId);
      setHoverPrompt(
        comp
          ? {
              text: `${comp.name} (${comp.priceText} ${comp.unitText}) (Klik untuk ambil)`,
              kind: 'stall',
            }
          : null
      );
    },
    [compartmentById]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag && drag.pointerId === e.pointerId && drag.captured) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
      }
      const shouldPick =
        Boolean(drag?.active) &&
        !drag?.moved &&
        (e.pointerType !== 'mouse' || e.button === 0);
      dragRef.current = null;
      setIsDragging(false);

      if (!shouldPick || !wrapperRef.current || !managerRef.current) return;
      if (isSoundEnabledRef.current) {
        void audioRef.current?.unlock();
      }
      const rect = wrapperRef.current.getBoundingClientRect();
      const hit = managerRef.current.raycastHit(e.clientX, e.clientY, rect);
      if (!hit) return;

      if (hit.kind === 'basket-item') {
        setActionBanner({
          text: `Mengeluarkan ${hit.commodityName}...`,
          kind: 'basket-item',
        });
        const started = managerRef.current.triggerRemoveBasketItem(hit.basketItemId, {
          onPullOut: () => audioRef.current?.playBasketRemove(),
          onComplete: () => {
            setActionBanner(null);
            setHoverPrompt(null);
          },
        });
        if (!started) setActionBanner(null);
        return;
      }

      const item = commodityById.get(hit.commodityId);
      if (item) {
        setActionBanner({
          text: `Mengambil ${item.name}...`,
          kind: 'stall',
        });
        managerRef.current.triggerGrabCommodity(hit.produceType, item.name, hit.hitPoint, {
          onPickStart: () => audioRef.current?.playPickGrab(),
          onDropInBasket: () => audioRef.current?.playBasketDrop(),
          onComplete: () => {
            setActionBanner(null);
            onSelectCommodity(item);
          },
        });
      }
    },
    [commodityById, onSelectCommodity]
  );

  const handlePointerCancel = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag && drag.pointerId === e.pointerId && drag.captured) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const activeBanner: BannerPrompt | null =
    actionBanner ||
    hoverPrompt ||
    (highlightedLabel ? { text: highlightedLabel, kind: 'stall' } : null);

  const cursorClass = isDragging
    ? 'cursor-grabbing'
    : hoverPrompt
      ? 'cursor-pointer'
      : 'cursor-grab';

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={() => {
        setHoverPrompt(null);
        if (!dragRef.current?.captured) setIsDragging(false);
      }}
      style={{ touchAction: 'pan-y' }}
      className={`relative w-full h-full overflow-hidden select-none bg-[#F9F3EE] dark:bg-[#140E0A] ${cursorClass}`}
    >
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {activeBanner && (
        <div className="absolute top-[108px] sm:top-[64px] left-3 sm:left-1/2 sm:-translate-x-1/2 z-30 pointer-events-none transition-opacity duration-150 max-w-[calc(100vw-155px)] sm:max-w-[52vw]">
          <div
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md border inline-flex items-center gap-1.5 whitespace-nowrap max-w-full ${
              activeBanner.kind === 'basket-item'
                ? 'bg-[#A92717]/95 text-[#FEF08A] border-white/25'
                : 'bg-[#132E20]/95 text-[#FEF08A] border-white/20'
            }`}
          >
            {activeBanner.kind === 'basket-item' ? (
              <Basket size={14} weight="bold" className="shrink-0" aria-hidden="true" />
            ) : (
              <MagnifyingGlass size={14} weight="bold" className="shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{activeBanner.text}</span>
          </div>
        </div>
      )}

      {isTurnedAway && (
        <div className="absolute top-[108px] sm:top-[64px] right-3 sm:right-6 z-30">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              audioRef.current?.playRecenter();
              managerRef.current?.resetLook();
            }}
            aria-label="Kembalikan arah pandang ke depan lorong"
            className="px-3.5 py-1.5 rounded-full bg-[#A92717] hover:bg-[#8E1F12] text-white text-xs font-bold shadow-lg border border-white/25 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Compass size={14} weight="bold" aria-hidden="true" />
            <span>Hadap Depan</span>
          </button>
        </div>
      )}

      <div
        className="hidden md:flex absolute bottom-[62px] left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-200"
        style={{ opacity: walkProgress > 0.88 ? Math.max(0, 1 - (walkProgress - 0.88) * 8) : 1 }}
      >
        <div className="px-4 py-1.5 rounded-full bg-[#132E20]/88 backdrop-blur-md border border-[#F9F3EE]/25 text-[#F9F3EE] text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
          <Footprints size={14} weight="bold" className="text-amber-300" aria-hidden="true" />
          <span>Melangkah di Lorong 3D: {walkMeters} m / 100 m</span>
          <span className="text-amber-300 font-normal">
            &bull; Geser / &larr; &rarr; tengok 360&deg; &bull; &uarr; &darr; jalan &bull; Klik ambil / keluarkan
          </span>
        </div>
      </div>
    </div>
  );
}
