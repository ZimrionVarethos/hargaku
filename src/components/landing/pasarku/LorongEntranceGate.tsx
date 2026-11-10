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
        className="absolute top-0 right-0 w-[62vw] sm:w-[54vw] md:w-[46vw] lg:w-[44vw] max-w-[660px] h-auto pointer-events-none z-10"
        viewBox="0 0 640 340"
        fill="none"
        preserveAspectRatio="xMaxYMin meet"
      >
        <path
          id="trWaveFill"
          d="M 80 -4 C 130 55, 220 35, 290 110 C 350 175, 410 175, 485 245 C 540 295, 595 295, 644 290 L 644 -4 Z"
          fill="rgba(239, 228, 212, 0.24)"
        />
        <path
          id="trWaveGold"
          d="M 65 -4 C 120 62, 212 42, 282 118 C 342 184, 404 184, 478 254 C 535 304, 592 302, 644 298"
          stroke="#B39C7A"
          strokeWidth="2.2"
          strokeOpacity="0.78"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
        <path
          id="trWaveDark"
          d="M 42 -4 C 98 72, 195 52, 266 130 C 328 196, 392 196, 466 268 C 526 318, 588 314, 644 310"
          stroke="#132E20"
          strokeWidth="2.8"
          strokeOpacity="0.86"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </svg>

      <div
        className="absolute bottom-0 left-0 w-[64%] sm:w-[52%] lg:w-[46%] max-w-[740px] z-0 transition-transform duration-100 ease-out"
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
        className="absolute bottom-0 right-0 w-[64%] sm:w-[52%] lg:w-[46%] max-w-[740px] z-0 transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoomFactor}) translate(${wingRightTranslateX}%, ${wingRightTranslateX * 0.15}%)`,
          transformOrigin: 'bottom right',
        }}
      >
        <div className="relative w-full animate-market-right">
          <Image
            src="/images/pasarku/market-wing-right-v2.webp"
            alt="Deretan kios beras pasar rakyat"
            width={829}
            height={362}
            priority
            className="w-full h-auto block select-none"
          />
          <div
            className="animate-lamp-glow absolute rounded-full pointer-events-none"
            style={{
              bottom: '34%',
              right: '14%',
              width: 70,
              height: 70,
              background: 'radial-gradient(circle, rgba(255,210,115,0.6) 0%, rgba(255,180,60,0) 72%)',
            }}
          />
        </div>
      </div>

      <div
        className="relative z-20 max-w-xl mx-auto text-center flex flex-col items-center px-4 pt-4 sm:pt-6 pb-2 transition-all duration-200"
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
