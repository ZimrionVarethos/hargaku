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

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
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

  const scrollToMarket = useCallback(() => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const totalScrollable = containerRef.current.clientHeight - window.innerHeight;
    window.scrollTo({ top: top + totalScrollable * 0.14, behavior: 'smooth' });
  }, []);

  const scrollToEntrance = useCallback(() => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const scrollToStall = useCallback((index: number) => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const totalScrollable = containerRef.current.clientHeight - window.innerHeight;
    const targetProgress = 0.14 + (index / 6) * 0.82;
    window.scrollTo({ top: top + totalScrollable * targetProgress, behavior: 'smooth' });
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

