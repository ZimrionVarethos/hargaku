'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useMarketWalk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [walkMeters, setWalkMeters] = useState(0);
  const [walkProgress, setWalkProgress] = useState(0);
  const [activeStallIndex, setActiveStallIndex] = useState(0);
  const [isInsideMarket, setIsInsideMarket] = useState(false);

  useEffect(() => {
    let animId: number;

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
        const idx = Math.min(5, Math.floor(wp * 6));
        setActiveStallIndex(idx);
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

  const getMetrics = () => {
    if (!containerRef.current) return null;
    const stickyEl = containerRef.current.firstElementChild as HTMLElement | null;
    const stickyTop = stickyEl ? parseFloat(getComputedStyle(stickyEl).top) || 0 : 0;
    const top = Math.max(0, containerRef.current.offsetTop - stickyTop);
    const totalScrollable = containerRef.current.clientHeight - (window.innerHeight - stickyTop);
    return { top, totalScrollable };
  };

  const scrollToMarket = useCallback(() => {
    const m = getMetrics();
    if (!m) return;
    window.scrollTo({ top: m.top + m.totalScrollable * 0.14, behavior: 'smooth' });
  }, []);

  const scrollToEntrance = useCallback(() => {
    const m = getMetrics();
    if (!m) return;
    window.scrollTo({ top: m.top, behavior: 'smooth' });
  }, []);

  const scrollToStall = useCallback((index: number) => {
    const m = getMetrics();
    if (!m) return;
    const targetProgress = 0.14 + (index / 6) * 0.82;
    window.scrollTo({ top: m.top + m.totalScrollable * targetProgress, behavior: 'smooth' });
  }, []);

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
  };
}

