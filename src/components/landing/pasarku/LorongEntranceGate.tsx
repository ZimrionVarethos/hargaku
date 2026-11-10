'use client';

import type { RefObject } from 'react';
import Image from 'next/image';

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  zoomFactor: number;
  wingLeftTranslateX: number;
  wingRightTranslateX: number;
  heroTextOpacity: number;
  scrollProgress: number;
  onEnterMarket: () => void;
}

export function LorongEntranceGate({
  canvasRef,
  zoomFactor,
  wingLeftTranslateX,
  wingRightTranslateX,
  heroTextOpacity,
  scrollProgress,
  onEnterMarket,
}: Props) {
  const gateOpacity = scrollProgress > 0.08 ? Math.max(0, 1 - (scrollProgress - 0.08) * 8) : 1;

  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden transition-opacity duration-200"
      style={{ opacity: gateOpacity }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 1440 720"
        fill="none"
        preserveAspectRatio="none"
      >
        <path id="trWaveFill" d="M 880 0 C 930 55, 1020 35, 1090 110 L 1440 290 L 1440 0 Z" fill="rgba(239, 228, 212, 0.18)" />
        <path id="trWaveGold" d="M 865 0 C 920 62, 1012 42, 1082 118" stroke="#B39C7A" strokeWidth="2.2" strokeOpacity="0.7" fill="none" />
        <path id="trWaveDark" d="M 842 0 C 898 72, 995 52, 1066 130" stroke="#132E20" strokeWidth="2.8" strokeOpacity="0.82" fill="none" />
      </svg>

      <div
        className="absolute bottom-0 left-0 w-[62%] sm:w-[52%] lg:w-[46%] max-w-[760px] z-0 transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoomFactor}) translate(-${wingLeftTranslateX}%, ${wingLeftTranslateX * 0.15}%)`,
          transformOrigin: 'bottom left',
        }}
      >
        <div className="relative w-full animate-market-left">
          <Image
            src="/images/pasarku/market-wing-left.webp"
            alt="Lorong sayuran pasar tradisional"
            width={990}
            height={487}
            priority
            className="w-full h-auto block select-none"
          />
          <div
            className="animate-lamp-glow absolute rounded-full pointer-events-none"
            style={{
              top: '36%',
              left: '6%',
              width: 90,
              height: 90,
              background: 'radial-gradient(circle, rgba(255,210,115,0.65) 0%, rgba(255,180,60,0) 72%)',
            }}
          />
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 w-[60%] sm:w-[50%] lg:w-[44%] max-w-[730px] z-0 transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoomFactor}) translate(${wingRightTranslateX}%, ${wingRightTranslateX * 0.15}%)`,
          transformOrigin: 'bottom right',
        }}
      >
        <div className="relative w-full animate-market-right">
          <Image
            src="/images/pasarku/market-wing-right.webp"
            alt="Deretan kios beras pasar rakyat"
            width={829}
            height={732}
            priority
            className="w-full h-auto block select-none"
          />
          <div
            className="animate-lamp-glow absolute rounded-full pointer-events-none"
            style={{
              bottom: '16%',
              right: '14%',
              width: 70,
              height: 70,
              background: 'radial-gradient(circle, rgba(255,210,115,0.6) 0%, rgba(255,180,60,0) 72%)',
            }}
          />
        </div>
      </div>

      <div
        className="relative z-20 max-w-xl mx-auto text-center flex flex-col items-center px-4 pt-8 sm:pt-12 pb-4 transition-all duration-200"
        style={{
          opacity: heroTextOpacity,
          transform: `translateY(-${(1 - heroTextOpacity) * 70}px)`,
          pointerEvents: heroTextOpacity > 0.3 ? 'auto' : 'none',
        }}
      >
        <div className="animate-logo-float mb-4">
          <Image
            src="/images/pasarku/logo-hero.webp"
            alt="PasarKu"
            width={400}
            height={173}
            unoptimized
            priority
            className="w-44 sm:w-56 lg:w-60 h-auto mx-auto drop-shadow-xs"
          />
        </div>

        <h1 className="font-bold text-3xl sm:text-5xl lg:text-[48px] tracking-tight text-[#132E20] leading-[1.14] mb-3">
          Harga Pasar, Lebih Dekat
        </h1>

        <p className="text-sm sm:text-lg text-[#263E30] font-normal leading-relaxed max-w-md mb-6">
          Jelajahi harga 53 komoditas pasar rakyat secara langsung di lorong pasar Kota Bogor.
        </p>

        <button
          type="button"
          onClick={onEnterMarket}
          className="pasarku-cta-btn inline-flex items-center justify-center gap-3 px-9 sm:px-11 py-3.5 text-base sm:text-lg font-bold"
        >
          <span>Mulai</span>
          <span className="text-xl animate-bounce">&darr;</span>
        </button>

        <div className="mt-4 text-xs font-semibold text-[#566B5D]">
          Scroll untuk melangkah masuk ke dalam pasar
        </div>
      </div>
    </div>
  );
}
