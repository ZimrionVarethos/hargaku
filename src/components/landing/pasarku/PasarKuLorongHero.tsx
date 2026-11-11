'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { ArrowDown } from '@phosphor-icons/react';
import { useHeroAnimation } from './useHeroAnimation';
import { useMarketWalk } from './useMarketWalk';
import {
  findCompartmentSlotByCommodityId,
  getMarketStalls,
  getZoneIndexForCommodity,
} from '@/lib/data/market-stalls';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { LorongEntranceGate } from './LorongEntranceGate';
import { LorongWalkHud } from './LorongWalkHud';
import { LorongThreeMarketAlley } from './LorongThreeMarketAlley';
import { LorongBottomBar } from './LorongBottomBar';
import { LorongCommodityDrawer } from './LorongCommodityDrawer';
import {
  CorridorAudioHandle,
  createCorridorAudioController,
} from './three/three-corridor-audio';
import { resolveCorridorKeyAction } from './three/three-corridor-math';

interface Props {
  onSelectCommodity: (item: BogorCommodity) => void;
}

export function PasarKuLorongHero({ onSelectCommodity }: Props) {
  const {
    containerRef,
    scrollProgress,
    walkProgress,
    walkMeters,
    activeStallIndex,
    isInsideMarket,
    scrollToMarket,
    scrollToEntrance,
    scrollToStall,
    scrollToZ,
    stepWalk,
  } = useMarketWalk();
  const { canvasRef } = useHeroAnimation(scrollProgress < 0.22);

  const [searchQuery, setSearchQuery] = useState('');
  const [drawerFilter, setDrawerFilter] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isAudioRunning, setIsAudioRunning] = useState(false);
  const [corridorAudio, setCorridorAudio] = useState<CorridorAudioHandle | null>(null);
  const corridorAudioRef = useRef<CorridorAudioHandle | null>(null);
  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveCommodities = useLiveBogorCommodities();
  const stalls = useMemo(() => getMarketStalls(liveCommodities), [liveCommodities]);

  useEffect(() => {
    const controller = createCorridorAudioController();
    let initialSound = true;
    try {
      if (window.localStorage.getItem('pasarku_corridor_sound') === 'off') {
        initialSound = false;
      }
    } catch {}
    setIsSoundEnabled(initialSound);
    controller.setMuted(!initialSound);
    controller.onStateChange((running) => setIsAudioRunning(running));
    corridorAudioRef.current = controller;
    setCorridorAudio(controller);
    return () => {
      controller.onStateChange(null);
      controller.dispose();
      corridorAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!corridorAudio) return;
    corridorAudio.setMuted(!isSoundEnabled);
  }, [corridorAudio, isSoundEnabled]);

  const zoomFactor = Math.min(3.5, 1 + scrollProgress * 14);
  const wingLeftTranslateX = Math.min(140, scrollProgress * 580);
  const wingRightTranslateX = Math.min(140, scrollProgress * 580);
  const heroTextOpacity = Math.max(0, 1 - scrollProgress * 12);
  const marketAlleyOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.05) * 18));

  const exitBloomOpacity = walkProgress > 0.85 ? Math.min(1, (walkProgress - 0.85) / 0.12) : 0;
  const hudOpacity = Math.max(0, 1 - exitBloomOpacity * 1.5);

  useEffect(() => {
    if (!corridorAudio) return;
    const syncVisibility = () => {
      const visible = typeof document === 'undefined' ? true : !document.hidden;
      corridorAudio.setActive(isInsideMarket && isInViewport && visible && exitBloomOpacity <= 0.85);
    };
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => document.removeEventListener('visibilitychange', syncVisibility);
  }, [corridorAudio, isInsideMarket, isInViewport, exitBloomOpacity]);

  const handleToggleSound = useCallback(async () => {
    const handle = corridorAudioRef.current ?? corridorAudio;
    if (!isSoundEnabled) {
      try {
        window.localStorage.setItem('pasarku_corridor_sound', 'on');
      } catch {}
      setIsSoundEnabled(true);
      handle?.setMuted(false);
      await handle?.unlock();
      return;
    }
    if (handle && !handle.isRunning()) {
      handle.setMuted(false);
      const unlocked = await handle.unlock();
      if (unlocked) return;
    }
    try {
      window.localStorage.setItem('pasarku_corridor_sound', 'off');
    } catch {}
    setIsSoundEnabled(false);
    handle?.setMuted(true);
  }, [corridorAudio, isSoundEnabled]);

  useEffect(() => {
    const handle = corridorAudioRef.current ?? corridorAudio;
    if (!handle || !isInsideMarket || !isSoundEnabled || isAudioRunning) return;
    const handleFirstGesture = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest?.('[data-sound-toggle="true"]')) return;
      void handle.unlock();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { capture: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture, true);
      window.removeEventListener('keydown', handleFirstGesture, true);
      window.removeEventListener('click', handleFirstGesture, true);
      window.removeEventListener('touchstart', handleFirstGesture, true);
    };
  }, [corridorAudio, isInsideMarket, isSoundEnabled, isAudioRunning]);

  const handleEnterMarket = useCallback(() => {
    const handle = corridorAudioRef.current ?? corridorAudio;
    if (isSoundEnabled) void handle?.unlock();
    scrollToMarket();
  }, [corridorAudio, isSoundEnabled, scrollToMarket]);

  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return liveCommodities.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [liveCommodities, searchQuery]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setIsInViewport(entries[0].isIntersecting);
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isInsideMarket) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }
      if (isDrawerOpen || document.querySelector('[role="dialog"]')) return;
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      const action = resolveCorridorKeyAction(e.key);
      if (action?.type === 'walk') {
        e.preventDefault();
        if (isSoundEnabled) void corridorAudio?.unlock();
        stepWalk(action.direction);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInsideMarket, isDrawerOpen, isSoundEnabled, corridorAudio, stepWalk]);

  const showHighlightBanner = useCallback((label: string) => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    setHighlightedLabel(label);
    highlightTimerRef.current = setTimeout(() => setHighlightedLabel(null), 3200);
  }, []);

  const handleSelectSearchMatch = useCallback(
    (item: BogorCommodity) => {
      const slot = findCompartmentSlotByCommodityId(item.id);
      if (slot) {
        scrollToZ(slot.zStart);
        showHighlightBanner(
          `Lapak #${String(slot.id).padStart(2, '0')} - ${item.name} (Rp ${item.price.toLocaleString('id-ID')}/${item.unit})`
        );
      } else {
        const zoneIdx = getZoneIndexForCommodity(item);
        scrollToStall(zoneIdx);
        setDrawerFilter(item.name);
        setIsDrawerOpen(true);
      }
    },
    [scrollToZ, scrollToStall, showHighlightBanner]
  );

  const handleOpenFilteredDrawer = useCallback(() => {
    setDrawerFilter(searchQuery);
    setIsDrawerOpen(true);
  }, [searchQuery]);

  const scrollToNextSection = () => {
    const el = document.getElementById('sorotanSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      id="heroSection"
      className="relative w-full min-h-[420vh] sm:min-h-[480vh] bg-[#F9F3EE]"
    >
      <div className="sticky top-[62px] sm:top-[66px] h-[calc(100dvh-62px)] sm:h-[calc(100dvh-66px)] w-full overflow-hidden">

        <div
          inert={isInsideMarket || undefined}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <LorongEntranceGate
            canvasRef={canvasRef}
            zoomFactor={zoomFactor}
            wingLeftTranslateX={wingLeftTranslateX}
            wingRightTranslateX={wingRightTranslateX}
            heroTextOpacity={heroTextOpacity}
            scrollProgress={scrollProgress}
            onEnterMarket={handleEnterMarket}
          />
        </div>

        <div
          inert={!isInsideMarket || undefined}
          className="absolute inset-0 z-20 w-full h-full transition-opacity duration-200"
          style={{
            opacity: marketAlleyOpacity,
            pointerEvents: isInsideMarket ? 'auto' : 'none',
          }}
        >
          <div className="absolute inset-0 w-full h-full">
            <LorongThreeMarketAlley
              walkProgress={walkProgress}
              walkMeters={walkMeters}
              isActive={isInsideMarket && isInViewport}
              audio={corridorAudio}
              isSoundEnabled={isSoundEnabled}
              highlightedLabel={highlightedLabel}
              onSelectCommodity={onSelectCommodity}
            />
          </div>

          <div
            className="absolute top-0 inset-x-0 z-30"
            style={{ opacity: hudOpacity, transition: 'opacity 0.2s' }}
          >
            <LorongWalkHud
              walkMeters={walkMeters}
              searchQuery={searchQuery}
              matches={searchMatches}
              isSoundEnabled={isSoundEnabled}
              isAudioRunning={isAudioRunning}
              onToggleSound={handleToggleSound}
              onSearchChange={setSearchQuery}
              onSelectMatch={handleSelectSearchMatch}
              onOpenFilteredDrawer={handleOpenFilteredDrawer}
              onExitToEntrance={scrollToEntrance}
            />
          </div>

          <div
            className="absolute bottom-0 inset-x-0 z-30"
            style={{ opacity: hudOpacity, transition: 'opacity 0.2s' }}
          >
            <LorongBottomBar
              stalls={stalls}
              activeStallIndex={activeStallIndex}
              onSelectStall={(idx) => {
                if (isSoundEnabled) void corridorAudio?.unlock();
                scrollToStall(idx);
              }}
              onToggleDrawer={() => {
                if (isSoundEnabled) void corridorAudio?.unlock();
                setDrawerFilter('');
                setIsDrawerOpen((prev) => !prev);
              }}
            />
          </div>

          <div
            inert={exitBloomOpacity <= 0.6 || undefined}
            className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center transition-opacity duration-300"
            style={{
              opacity: exitBloomOpacity,
              background: `radial-gradient(circle at center, rgba(255,255,245,0.98) 0%, rgba(249,243,238,0.95) 45%, rgba(249,243,238,0.85) 100%)`,
              pointerEvents: exitBloomOpacity > 0.6 ? 'auto' : 'none',
            }}
          >
            <div className="flex flex-col items-center text-center px-4 max-w-md animate-fadeIn">
          
              <span className="text-xs font-bold uppercase tracking-widest text-[#A92717] mb-1">
                Ujung Lorong Pasar Selesai
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#132E20] mb-2">
                Keluar ke Papan Harga &amp; Peta 3D
              </h2>
              <p className="text-xs text-[#263E30] mb-4 leading-relaxed">
                Kamu telah menyusuri 100 meter lorong lapak pasar rakyat. Terus scroll atau tekan tombol untuk melihat papan pokok dan peta 3D 13 unit pasar.
              </p>
              <button
                type="button"
                onClick={scrollToNextSection}
                className="market-btn-primary px-5 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Lanjut ke Papan Harga</span>
                <ArrowDown size={14} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

      </div>

      <LorongCommodityDrawer
        isOpen={isDrawerOpen}
        stalls={stalls}
        initialStallIdx={activeStallIndex}
        searchFilter={drawerFilter}
        onClearSearchFilter={() => setDrawerFilter('')}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCommodity={onSelectCommodity}
      />
    </div>
  );
}
