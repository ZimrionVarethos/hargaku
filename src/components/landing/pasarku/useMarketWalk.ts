'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { STALL_ZONE_META, getZoneIndexByWalkProgress } from '@/lib/data/market-stalls';

export function useMarketWalk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [walkMeters, setWalkMeters] = useState(0);
  const [walkProgress, setWalkProgress] = useState(0);
  const [activeStallIndex, setActiveStallIndex] = useState(0);
  const [isInsideMarket, setIsInsideMarket] = useState(false);

  useEffect(() => {
    let animId = 0;

    const getStickyTop = () => {
      const stickyEl = containerRef.current?.firstElementChild as HTMLElement | null;
      return stickyEl ? parseFloat(getComputedStyle(stickyEl).top) || 0 : 0;
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const stickyTop = getStickyTop();
      const totalScrollable = rect.height - (window.innerHeight - stickyTop);

      if (totalScrollable <= 0) return;

      const scrolled = stickyTop - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      setScrollProgress(progress);
      setIsInsideMarket(progress > 0.11);

      if (progress > 0.11) {
        const wp = Math.max(0, Math.min(1, (progress - 0.11) / 0.86));
        setWalkProgress(wp);
        setWalkMeters(Math.min(100, Math.round(wp * 100)));
        setActiveStallIndex(getZoneIndexByWalkProgress(wp));
      } else {
        setWalkProgress(0);
        setWalkMeters(0);
        setActiveStallIndex(0);
      }
    };

    const onScrollThrottled = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
      cancelAnimationFrame(animId);
    };
  }, []);

  const getMetrics = useCallback(() => {
    if (!containerRef.current) return null;
    const stickyEl = containerRef.current.firstElementChild as HTMLElement | null;
    const stickyTop = stickyEl ? parseFloat(getComputedStyle(stickyEl).top) || 0 : 0;
    const top = Math.max(0, containerRef.current.offsetTop - stickyTop);
    const totalScrollable = containerRef.current.clientHeight - (window.innerHeight - stickyTop);
    return { top, totalScrollable };
  }, []);

  const scrollToMarket = useCallback(() => {
    const m = getMetrics();
    if (!m) return;
    window.scrollTo({ top: m.top + m.totalScrollable * 0.132, behavior: 'smooth' });
  }, [getMetrics]);

  const scrollToEntrance = useCallback(() => {
    const m = getMetrics();
    if (!m) return;
    window.scrollTo({ top: m.top, behavior: 'smooth' });
  }, [getMetrics]);

  const scrollToStall = useCallback((index: number) => {
    const m = getMetrics();
    if (!m) return;
    const clampedIdx = Math.max(0, Math.min(STALL_ZONE_META.length - 1, index));
    const wp = STALL_ZONE_META[clampedIdx].targetWalkProgress;
    const targetProgress = 0.11 + wp * 0.86;
    window.scrollTo({ top: m.top + m.totalScrollable * targetProgress, behavior: 'smooth' });
  }, [getMetrics]);

  const scrollToZ = useCallback((zStart: number) => {
    const m = getMetrics();
    if (!m) return;
    const targetCurZ = Math.max(0, Math.min(48, zStart - 1.5));
    const wp = Math.max(0.02, Math.min(0.8, targetCurZ / 60));
    const targetProgress = 0.11 + wp * 0.86;
    window.scrollTo({ top: m.top + m.totalScrollable * targetProgress, behavior: 'smooth' });
  }, [getMetrics]);

  return {
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
  };
}
