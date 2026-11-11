'use client';

import { useId } from 'react';

interface KawungBandProps {
  size?: 'sm' | 'md';
  variant?: 'scallop' | 'flat';
  className?: string;
}

function ScallopKawungSvg({ patternId, scale }: { patternId: string; scale: number }) {
  return (
    <svg className="w-full h-full block">
      <defs>
        <pattern
          id={patternId}
          width="36"
          height="30"
          patternUnits="userSpaceOnUse"
          patternTransform={scale !== 1 ? `scale(${scale})` : undefined}
        >
          <path
            d="M0,20.5 C4.5,28.5 13.5,28.5 18,20.5 C22.5,28.5 31.5,28.5 36,20.5 L36,0 L0,0 Z"
            fill="var(--ochre-surface)"
          />
          <line x1="0" y1="0.8" x2="36" y2="0.8" stroke="var(--border-ink)" strokeWidth="1.4" />
          <ellipse
            cx="9"
            cy="6.2"
            rx="6.5"
            ry="3.6"
            fill="var(--earth-ochre)"
            fillOpacity="0.22"
            stroke="var(--border-ink)"
            strokeWidth="1"
            strokeOpacity="0.55"
          />
          <ellipse
            cx="27"
            cy="6.2"
            rx="6.5"
            ry="3.6"
            fill="var(--earth-ochre)"
            fillOpacity="0.22"
            stroke="var(--border-ink)"
            strokeWidth="1"
            strokeOpacity="0.55"
          />
          <ellipse
            cx="9"
            cy="15.8"
            rx="6.5"
            ry="3.6"
            fill="var(--earth-ochre)"
            fillOpacity="0.22"
            stroke="var(--border-ink)"
            strokeWidth="1"
            strokeOpacity="0.55"
          />
          <ellipse
            cx="27"
            cy="15.8"
            rx="6.5"
            ry="3.6"
            fill="var(--earth-ochre)"
            fillOpacity="0.22"
            stroke="var(--border-ink)"
            strokeWidth="1"
            strokeOpacity="0.55"
          />
          <path
            d="M18 3.2 L22.4 11 L18 18.8 L13.6 11 Z"
            fill="var(--accent-chili)"
            stroke="var(--border-ink)"
            strokeWidth="1"
          />
          <circle cx="18" cy="11" r="1.4" fill="#F6ECE1" />
          <circle cx="0" cy="11" r="2.1" fill="var(--border-ink)" />
          <circle cx="36" cy="11" r="2.1" fill="var(--border-ink)" />
          <path
            d="M0,20.5 C4.5,28.5 13.5,28.5 18,20.5 C22.5,28.5 31.5,28.5 36,20.5"
            fill="none"
            stroke="var(--border-ink)"
            strokeWidth="1.4"
          />
          <circle cx="9" cy="23.2" r="1.15" fill="var(--accent-chili)" />
          <circle cx="27" cy="23.2" r="1.15" fill="var(--accent-chili)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

function FlatKawungSvg({ patternId, scale }: { patternId: string; scale: number }) {
  return (
    <svg className="w-full h-full block">
      <defs>
        <pattern
          id={patternId}
          width="36"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform={scale !== 1 ? `scale(${scale})` : undefined}
        >
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
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function KawungBand({ size = 'md', variant = 'scallop', className = '' }: KawungBandProps) {
  const rawId = useId();
  const baseId = `pasarku-kawung-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const isSmall = size === 'sm';

  if (variant === 'flat') {
    return (
      <div
        aria-hidden="true"
        className={`w-full border-y border-[var(--border-ink)] bg-[var(--ochre-surface)] overflow-hidden select-none pointer-events-none leading-none ${className}`}
      >
        <div className={`sm:hidden w-full ${isSmall ? 'h-2.5' : 'h-4'}`}>
          <FlatKawungSvg patternId={`${baseId}-fm`} scale={isSmall ? 0.5 : 0.8} />
        </div>
        <div className={`hidden sm:block w-full ${isSmall ? 'h-3' : 'h-5'}`}>
          <FlatKawungSvg patternId={`${baseId}-fd`} scale={isSmall ? 0.6 : 1} />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`w-full bg-transparent overflow-hidden select-none pointer-events-none leading-none ${className}`}
    >
      <div className={`sm:hidden w-full ${isSmall ? 'h-[18px]' : 'h-[24px]'}`}>
        <ScallopKawungSvg patternId={`${baseId}-sm`} scale={isSmall ? 0.6 : 0.8} />
      </div>
      <div className={`hidden sm:block w-full ${isSmall ? 'h-[21px]' : 'h-[30px]'}`}>
        <ScallopKawungSvg patternId={`${baseId}-sd`} scale={isSmall ? 0.7 : 1} />
      </div>
    </div>
  );
}
