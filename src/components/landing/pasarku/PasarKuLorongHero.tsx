'use client';

import { useState, useMemo, useEffect } from 'react';
import { useHeroAnimation } from './useHeroAnimation';
import { useMarketWalk } from './useMarketWalk';
import { getMarketStalls } from '@/lib/data/market-stalls';
import { BogorCommodity } from '@/lib/data/bogor-commodities';
import { useLiveBogorCommodities } from '@/lib/data/live-bogor-sync';
import { LorongEntranceGate } from './LorongEntranceGate';
import { LorongWalkHud } from './LorongWalkHud';
import { LorongThreeMarketAlley } from './LorongThreeMarketAlley';
import { LorongBottomBar } from './LorongBottomBar';
import { LorongCommodityDrawer } from './LorongCommodityDrawer';

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
  } = useMarketWalk();
  const { canvasRef } = useHeroAnimation(scrollProgress < 0.22);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const liveCommodities = useLiveBogorCommodities();
  const stalls = useMemo(() => getMarketStalls(liveCommodities), [liveCommodities]);

  useEffect(() => {
    if (!isInsideMarket) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToStall(Math.min(stalls.length - 1, activeStallIndex + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToStall(Math.max(0, activeStallIndex - 1));
      } else if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInsideMarket, activeStallIndex, stalls.length, scrollToStall, isDrawerOpen]);

  const zoomFactor = Math.min(3.5, 1 + scrollProgress * 14);
  const wingLeftTranslateX = Math.min(140, scrollProgress * 580);
  const wingRightTranslateX = Math.min(140, scrollProgress * 580);
  const heroTextOpacity = Math.max(0, 1 - scrollProgress * 7);
  const marketAlleyOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.08) * 8));

  const exitBloomOpacity = walkProgress > 0.85 ? Math.min(1, (walkProgress - 0.85) / 0.12) : 0;
  const hudOpacity = Math.max(0, 1 - exitBloomOpacity * 1.5);

  const scrollToNextSection = () => {
    const el = document.getElementById('sorotanSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      id="heroSection"
      className="relative w-full min-h-[420vh] sm:min-h-[480vh] bg-[#F9F3EE]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between border-b-2 border-[var(--border-ink)]">

        <LorongEntranceGate
          canvasRef={canvasRef}
          zoomFactor={zoomFactor}
          wingLeftTranslateX={wingLeftTranslateX}
          wingRightTranslateX={wingRightTranslateX}
          heroTextOpacity={heroTextOpacity}
          scrollProgress={scrollProgress}
          onEnterMarket={scrollToMarket}
        />

        <div
          className="relative z-20 w-full h-full flex flex-col justify-between transition-opacity duration-200"
          style={{
            opacity: marketAlleyOpacity,
            pointerEvents: isInsideMarket ? 'auto' : 'none',
          }}
        >
          <div style={{ opacity: hudOpacity, transition: 'opacity 0.2s' }}>
            <LorongWalkHud
              stalls={stalls}
              activeStallIndex={activeStallIndex}
              walkMeters={walkMeters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectStall={scrollToStall}
              onExitToEntrance={scrollToEntrance}
            />
          </div>

          <LorongThreeMarketAlley
            walkProgress={walkProgress}
            walkMeters={walkMeters}
            onSelectCommodity={onSelectCommodity}
          />

          <div style={{ opacity: hudOpacity, transition: 'opacity 0.2s' }}>
            <LorongBottomBar
              stalls={stalls}
              activeStallIndex={activeStallIndex}
              onSelectStall={scrollToStall}
              onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
            />
          </div>

          <div
            className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center transition-opacity duration-300"
            style={{
              opacity: exitBloomOpacity,
              background: `radial-gradient(circle at center, rgba(255,255,245,0.98) 0%, rgba(249,243,238,0.95) 45%, rgba(249,243,238,0.85) 100%)`,
              pointerEvents: exitBloomOpacity > 0.6 ? 'auto' : 'none',
            }}
          >
            <div className="flex flex-col items-center text-center px-4 max-w-md animate-fadeIn">
              <span className="text-3xl mb-2">✨</span>
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
                className="market-btn-primary px-5 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2"
              >
                <span>Lanjut ke Papan Harga</span>
                <span>&darr;</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      <LorongCommodityDrawer
        isOpen={isDrawerOpen}
        stalls={stalls}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCommodity={onSelectCommodity}
      />
    </div>
  );
}
