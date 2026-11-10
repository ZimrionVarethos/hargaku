export function CommoditySvg({
  kind,
  className = 'w-full h-full',
}: {
  kind?: string;
  className?: string;
}) {
  switch (kind) {
    case 'chili':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M44 12C48 9 53 11 55 15" stroke="#245034" strokeWidth="4" strokeLinecap="round"/>
        <path d="M39 16C45 14 49 19 46 25C41 38 27 51 11 53C7 53 6 48 10 45C22 36 31 26 35 18C36 16 38 16 39 16Z" fill="#A92717" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M35 22C31 30 23 39 14 45" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      );
    case 'greenChili':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M44 12C48 9 53 11 55 15" stroke="#132E20" strokeWidth="4" strokeLinecap="round"/>
        <path d="M39 16C45 14 49 19 46 25C41 38 27 51 11 53C7 53 6 48 10 45C22 36 31 26 35 18C36 16 38 16 39 16Z" fill="#245034" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M35 22C31 30 23 39 14 45" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      );
    case 'shallot':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M32 8V19M28 10L31 19M36 10L33 19" stroke="#245034" strokeWidth="3" strokeLinecap="round"/>
        <path d="M32 18C19 22 14 33 16 44C18 52 25 56 32 56C39 56 46 52 48 44C50 33 45 22 32 18Z" fill="#881337" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M25 24C20 32 20 43 26 51M39 24C44 32 44 43 38 51" stroke="#FBCFE8" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      );
    case 'garlic':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M32 10V20" stroke="#433A31" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M32 18C19 22 13 33 15 44C17 52 24 55 32 55C40 55 47 52 49 44C51 33 45 22 32 18Z" fill="#F9F3EE" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M25 22C20 30 20 44 26 53M39 22C44 30 44 44 38 53" stroke="#9C8F7A" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      );
    case 'carrot':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M44 18C48 10 54 10 56 12M44 18C46 9 42 7 39 9M44 18C52 16 56 20 53 24" stroke="#245034" strokeWidth="3.2" strokeLinecap="round"/>
        <path d="M36 16C41 14 48 21 46 26L18 53C14 56 10 52 13 48L36 16Z" fill="#D9531E" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M33 24L38 29M26 32L31 37M20 40L24 44" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      );
    case 'leafy':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M16 48C14 28 26 13 48 13C48 35 34 48 16 48Z" fill="#245034" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M14 52L40 24" stroke="#E2EFE6" strokeWidth="2.8" strokeLinecap="round"/>
        <path d="M25 39L23 29M33 31L41 29" stroke="#E2EFE6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      );
    case 'tomato':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <circle cx="32" cy="36" r="19" fill="#A92717" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M24 16L32 22L40 16M32 12V22M20 20L30 22M44 20L34 22" stroke="#245034" strokeWidth="3.2" strokeLinecap="round"/>
        <path d="M21 30C19 35 21 42 25 45" stroke="#FECACA" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
      );
    case 'rice':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M16 24H48L52 52C52 55 49 56 46 56H18C15 56 12 55 12 52L16 24Z" fill="#B47B38" stroke="#132E20" strokeWidth="2.2"/>
        <ellipse cx="32" cy="24" rx="16" ry="6" fill="#F9F3EE" stroke="#132E20" strokeWidth="2"/>
        <rect x="22" y="34" width="20" height="12" rx="2" fill="#EFE4D4" stroke="#132E20" strokeWidth="1.5"/>
      </svg>
      );
    case 'meat':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M14 30C14 18 28 14 42 18C52 21 54 34 48 44C42 52 24 54 16 44C13 40 14 34 14 30Z" fill="#9F1239" stroke="#132E20" strokeWidth="2.2"/>
        <circle cx="38" cy="30" r="5.5" fill="#F9F3EE" stroke="#132E20" strokeWidth="2"/>
        <path d="M20 34C24 38 30 42 40 40" stroke="#FECDD3" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
      );
    case 'egg':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M32 10C21 10 14 26 14 39C14 50 22 56 32 56C42 56 50 50 50 39C50 26 43 10 32 10Z" fill="#D97706" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M23 22C19 28 19 36 21 42" stroke="#FDE68A" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
      );
    case 'fish':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <path d="M10 32C18 20 36 18 48 28L58 20V44L48 36C36 46 18 44 10 32Z" fill="#1D4ED8" stroke="#132E20" strokeWidth="2.2"/>
        <circle cx="20" cy="30" r="2.5" fill="#F9F3EE"/>
        <path d="M28 26C31 30 31 34 28 38" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      );
    case 'oil':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <rect x="26" y="8" width="12" height="6" rx="1" fill="#D97706" stroke="#132E20" strokeWidth="1.8"/>
        <path d="M22 20C22 16 26 14 32 14C38 14 42 16 42 20L46 52C46 55 43 56 40 56H24C21 56 18 55 18 52L22 20Z" fill="#EAB308" stroke="#132E20" strokeWidth="2.2"/>
        <rect x="23" y="30" width="18" height="14" rx="1.5" fill="#F9F3EE" stroke="#132E20" strokeWidth="1.5"/>
      </svg>
      );
    case 'fruit':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
        <circle cx="32" cy="36" r="18" fill="#EA580C" stroke="#132E20" strokeWidth="2.2"/>
        <path d="M32 17C34 11 40 10 44 13C40 17 36 18 32 17Z" fill="#245034" stroke="#132E20" strokeWidth="1.5"/>
      </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
          <circle cx="32" cy="32" r="22" fill="#E2EFE6" stroke="#132E20" strokeWidth={2.2} />
          <path d="M24 32H40M32 24V40" stroke="#245034" strokeWidth={3} strokeLinecap="round" />
        </svg>
      );
  }
}
