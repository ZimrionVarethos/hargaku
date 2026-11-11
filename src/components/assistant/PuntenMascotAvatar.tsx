'use client';

import { useId } from 'react';

export type PuntenMood = 'normal' | 'happy' | 'curious' | 'thinking' | 'surprised';

interface Props {
  size?: number;
  mood?: PuntenMood;
  className?: string;
}

export function PuntenMascotAvatar({ size = 40, mood = 'normal', className = '' }: Props) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={`${uid}-head`} x1="60" y1="28" x2="60" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="68%" stopColor="#F8F2EB" />
          <stop offset="100%" stopColor="#D9C9B3" />
        </linearGradient>
        <linearGradient id={`${uid}-visor`} x1="60" y1="45" x2="60" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#184C37" />
          <stop offset="100%" stopColor="#0E2B20" />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="108" rx="28" ry="5" fill="#FDE68A" fillOpacity="0.45" />

      <circle cx="17" cy="64" r="13" fill="#123B2B" />
      <circle cx="15" cy="64" r="8.5" fill="#D9481E" />
      <circle cx="13.5" cy="62.5" r="3" fill="#F59E0B" fillOpacity="0.55" />

      <circle cx="103" cy="64" r="13" fill="#123B2B" />
      <circle cx="105" cy="64" r="8.5" fill="#D9481E" />
      <circle cx="106.5" cy="62.5" r="3" fill="#F59E0B" fillOpacity="0.55" />

      <rect
        x="22"
        y="34"
        width="76"
        height="64"
        rx="28"
        fill={`url(#${uid}-head)`}
        stroke="#123B2B"
        strokeWidth="4.5"
      />

      <rect
        x="30"
        y="46"
        width="60"
        height="36"
        rx="14"
        fill={`url(#${uid}-visor)`}
        stroke="#123B2B"
        strokeWidth="2.5"
      />

      {mood === 'happy' ? (
        <>
          <path d="M40 59L47 63L40 67" stroke="#6EE7A0" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M80 59L73 63L80 67" stroke="#6EE7A0" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : mood === 'curious' || mood === 'thinking' ? (
        <>
          <ellipse cx="47" cy="63" rx="4.5" ry="6.2" fill="#6EE7A0" />
          <ellipse cx="73" cy="63" rx="4.5" ry="6.2" fill="#6EE7A0" />
        </>
      ) : mood === 'surprised' ? (
        <>
          <circle cx="47" cy="63" r="5.5" stroke="#6EE7A0" strokeWidth="3.5" />
          <circle cx="73" cy="63" r="5.5" stroke="#6EE7A0" strokeWidth="3.5" />
        </>
      ) : (
        <>
          <path d="M41 65C43 59 51 59 53 65" stroke="#6EE7A0" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M67 65C69 59 77 59 79 65" stroke="#6EE7A0" strokeWidth="4.2" strokeLinecap="round" />
        </>
      )}

      <path d="M54 73C57 76 63 76 66 73" stroke="#6EE7A0" strokeWidth="2.8" strokeLinecap="round" />

      <path
        d="M104 71C103 88 86 95 66 95"
        stroke="#123B2B"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <rect x="57" y="90" width="12" height="8" rx="4" fill="#B52D19" stroke="#123B2B" strokeWidth="2.5" />

      <path
        d="M18 42C21 20 39 10 60 10C81 10 99 20 102 42Z"
        fill="#B52D19"
        stroke="#123B2B"
        strokeWidth="4.2"
        strokeLinejoin="round"
      />
      <path d="M40 41C41 24 48 13 54 11H66C72 13 79 24 80 41H40Z" fill="#F8F2EB" />
      <path d="M53 41C54 22 57 12 60 10C63 12 66 22 67 41H53Z" fill="#B52D19" />

      <path
        d="M17 41C17 47 26 49 31 44C34 49 43 49 46 44C50 49 58 49 60 44C62 49 70 49 74 44C77 49 86 49 89 44C94 49 103 47 103 41"
        fill="#123B2B"
      />
      <circle cx="25" cy="41" r="6" fill="#B52D19" stroke="#123B2B" strokeWidth="2.4" />
      <circle cx="39" cy="41.5" r="6.2" fill="#F8F2EB" stroke="#123B2B" strokeWidth="2.4" />
      <circle cx="53" cy="42" r="6.2" fill="#B52D19" stroke="#123B2B" strokeWidth="2.4" />
      <circle cx="67" cy="42" r="6.2" fill="#F8F2EB" stroke="#123B2B" strokeWidth="2.4" />
      <circle cx="81" cy="41.5" r="6.2" fill="#B52D19" stroke="#123B2B" strokeWidth="2.4" />
      <circle cx="95" cy="41" r="6" fill="#F8F2EB" stroke="#123B2B" strokeWidth="2.4" />
    </svg>
  );
}

