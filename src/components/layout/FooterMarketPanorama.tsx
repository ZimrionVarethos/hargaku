import Image from 'next/image';

export function FooterMarketPanorama() {
  return (
    <div className="w-full overflow-hidden select-none leading-none" aria-hidden="true">
      <div className="w-full h-4 sm:h-5 border-b border-[var(--border-ink)] bg-[var(--ochre-surface)]">
        <svg className="w-full h-full block">
          <defs>
            <pattern id="pasarkuKawungTop" width="36" height="20" patternUnits="userSpaceOnUse">
              <rect width="36" height="20" fill="var(--ochre-surface)" />
              <ellipse cx="9" cy="5" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <ellipse cx="27" cy="5" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <ellipse cx="9" cy="15" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <ellipse cx="27" cy="15" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <path
                d="M18 3 L22 10 L18 17 L14 10 Z"
                fill="var(--accent-chili)"
                stroke="var(--border-ink)"
                strokeWidth="0.9"
              />
              <circle cx="0" cy="10" r="2" fill="var(--border-ink)" />
              <circle cx="36" cy="10" r="2" fill="var(--border-ink)" />
              <circle cx="18" cy="10" r="1.4" fill="#F6ECE1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pasarkuKawungTop)" />
        </svg>
      </div>

      <div className="relative w-full h-[176px] sm:h-[225px] md:h-[260px] lg:h-[285px] bg-[var(--bg-muted)]">
        <svg className="absolute inset-0 w-full h-full block opacity-35">
          <defs>
            <pattern id="pasarkuBatikMesh" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
              <circle cx="0" cy="0" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
              <circle cx="48" cy="0" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
              <circle cx="0" cy="48" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
              <circle cx="48" cy="48" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
              <path d="M24 14 L29 24 L24 34 L19 24 Z" fill="none" stroke="var(--earth-ochre)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pasarkuBatikMesh)" />
        </svg>

        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1440 285"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 132 Q 150 56 320 112 T 560 76"
            fill="none"
            stroke="var(--wave-line-gold)"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <path
            d="M 0 156 Q 170 78 340 136"
            fill="none"
            stroke="var(--border-ink)"
            strokeWidth="1.8"
            strokeOpacity="0.45"
          />
          <path
            d="M 1440 132 Q 1290 56 1120 112 T 880 76"
            fill="none"
            stroke="var(--wave-line-gold)"
            strokeWidth="2"
            strokeOpacity="0.6"
          />
          <path
            d="M 1440 156 Q 1270 78 1100 136"
            fill="none"
            stroke="var(--border-ink)"
            strokeWidth="1.8"
            strokeOpacity="0.45"
          />
        </svg>

        <div className="relative z-10 h-full w-full md:max-w-[920px] lg:max-w-[1020px] mx-auto bg-[var(--bg-muted)]">
          <div className="hidden md:block absolute inset-y-0 right-full w-24 lg:w-36 bg-gradient-to-l from-[var(--bg-muted)] via-[var(--bg-muted)]/75 to-transparent pointer-events-none" />
          <div className="hidden md:block absolute inset-y-0 left-full w-24 lg:w-36 bg-gradient-to-r from-[var(--bg-muted)] via-[var(--bg-muted)]/75 to-transparent pointer-events-none" />
          <div className="relative w-full h-full overflow-hidden footer-market-mask">
            <Image
              src="/images/pasarku/footer-market-real.jpg"
              alt="Panorama Pasar Rakyat Kota Bogor"
              fill
              sizes="(max-width: 768px) 100vw, 1020px"
              className="object-cover object-[50%_74%] footer-market-photo"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-3.5 sm:h-4 border-t-[1.5px] border-b-2 border-[var(--border-ink)] bg-[var(--ochre-surface)]">
        <svg className="w-full h-full block">
          <defs>
            <pattern id="tegelKunciBase" width="32" height="16" patternUnits="userSpaceOnUse">
              <rect width="32" height="16" fill="var(--ochre-surface)" />
              <rect
                x="0.5"
                y="0.5"
                width="31"
                height="15"
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="1"
              />
              <path d="M16 2 L24 8 L16 14 L8 8 Z" fill="none" stroke="var(--earth-ochre)" strokeWidth="1" />
              <circle cx="16" cy="8" r="1.5" fill="var(--accent-chili)" fillOpacity="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tegelKunciBase)" />
        </svg>
      </div>
    </div>
  );
}
