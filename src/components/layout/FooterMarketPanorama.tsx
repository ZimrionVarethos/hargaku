'use client';

import Image from 'next/image';
import { KawungBand } from '@/components/ornament/KawungBand';
import { BatikMeshBackground } from '@/components/ornament/BatikMeshBackground';
import { CacingWaveDivider } from '@/components/ornament/CacingWaveDivider';

export function FooterMarketPanorama() {
  return (
    <div className="w-full select-none leading-none" aria-hidden="true">
      <KawungBand size="md" variant="scallop" className="relative z-20 -mb-[7px] sm:-mb-[9px]" />

      <div className="relative z-10 w-full h-[205px] sm:h-[260px] md:h-[310px] lg:h-[340px] bg-[var(--bg-muted)] overflow-hidden">
        <BatikMeshBackground opacity={0.35} fadeEdges={false} adaptiveScale={false} />

        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1440 340"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 164 C 85 95, 165 205, 255 132 C 300 96, 338 112, 365 106"
            fill="none"
            stroke="var(--wave-line-gold)"
            strokeWidth="2"
            strokeOpacity="0.72"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 0 184 C 95 112, 175 222, 265 150 C 308 114, 344 128, 365 122"
            fill="none"
            stroke="var(--border-ink)"
            strokeWidth="1.5"
            strokeOpacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 1440 164 C 1355 95, 1275 205, 1185 132 C 1140 96, 1102 112, 1075 106"
            fill="none"
            stroke="var(--wave-line-gold)"
            strokeWidth="2"
            strokeOpacity="0.72"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 1440 184 C 1345 112, 1265 222, 1175 150 C 1132 114, 1096 128, 1075 122"
            fill="none"
            stroke="var(--border-ink)"
            strokeWidth="1.5"
            strokeOpacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative z-10 h-full w-full md:max-w-[720px] lg:max-w-[820px] mx-auto bg-[var(--bg-muted)]">
          <div className="hidden md:block absolute inset-y-0 right-full w-28 lg:w-40 bg-gradient-to-l from-[var(--bg-muted)] via-[var(--bg-muted)]/75 to-transparent pointer-events-none" />
          <div className="hidden md:block absolute inset-y-0 left-full w-28 lg:w-40 bg-gradient-to-r from-[var(--bg-muted)] via-[var(--bg-muted)]/75 to-transparent pointer-events-none" />
          <div className="relative w-full h-full overflow-hidden footer-market-mask">
            <div className="relative w-full h-full footer-market-vertical-mask">
              <Image
                src="/images/pasarku/footer-market-real.jpg"
                alt="Panorama Pasar Rakyat Kota Bogor"
                fill
                sizes="(max-width: 768px) 100vw, 820px"
                className="object-cover object-[50%_90%] footer-market-photo"
              />
            </div>
          </div>
        </div>
      </div>

      <CacingWaveDivider
        topColor="transparent"
        bottomColor="transparent"
        flip
        className="relative z-20 -mt-[18px] sm:-mt-[24px] -mb-[16px] sm:-mb-[22px]"
      />
    </div>
  );
}
