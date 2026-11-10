function renderStripedAwning(
  keyPrefix: string,
  xStart: number,
  yTop: number,
  totalWidth: number,
  height: number,
  stripeCount: number,
  skewX = 6,
) {
  const stripeW = totalWidth / stripeCount;
  const r = stripeW / 2;
  const yBot = yTop + height;

  return Array.from({ length: stripeCount }, (_, idx) => {
    const x0 = xStart + idx * stripeW;
    const x1 = x0 + stripeW;
    const leftOffset = ((idx / stripeCount) - 0.5) * skewX;
    const rightOffset = (((idx + 1) / stripeCount) - 0.5) * skewX;
    const tx0 = x0 + leftOffset;
    const tx1 = x1 + rightOffset;
    const isChili = idx % 2 === 0;
    const d = `M ${tx0.toFixed(1)} ${yTop} L ${tx1.toFixed(1)} ${yTop} L ${x1.toFixed(1)} ${yBot} A ${r.toFixed(1)} ${(r * 0.72).toFixed(1)} 0 0 1 ${x0.toFixed(1)} ${yBot} Z`;

    return (
      <path
        key={`${keyPrefix}-${idx}`}
        d={d}
        fill={isChili ? 'var(--accent-chili)' : '#F6ECE1'}
        stroke="var(--border-ink)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    );
  });
}

function renderPennantString(
  keyPrefix: string,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  sag: number,
  count: number,
) {
  const flags = Array.from({ length: count }, (_, idx) => {
    const t = (idx + 0.5) / count;
    const cx = x0 + (x1 - x0) * t;
    const cy = y0 + (y1 - y0) * t + 4 * sag * t * (1 - t);
    const fill =
      idx % 3 === 0 ? 'var(--accent-chili)' : idx % 3 === 1 ? '#F6ECE1' : 'var(--earth-ochre)';
    return (
      <polygon
        key={`${keyPrefix}-${idx}`}
        points={`${(cx - 5).toFixed(1)},${cy.toFixed(1)} ${(cx + 5).toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${(cy + 9).toFixed(1)}`}
        fill={fill}
        stroke="var(--border-ink)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    );
  });

  const midX = (x0 + x1) / 2;
  const ctrlY = (y0 + y1) / 2 + sag * 2;
  return (
    <g>
      <path
        d={`M ${x0} ${y0} Q ${midX} ${ctrlY} ${x1} ${y1}`}
        fill="none"
        stroke="var(--border-ink)"
        strokeWidth="1.2"
      />
      {flags}
    </g>
  );
}

const LAMP_POSITIONS = [
  { id: 'l1', x: 205, y: 103, cord: 10 },
  { id: 'l2', x: 420, y: 97, cord: 10 },
  { id: 'l3', x: 512, y: 97, cord: 10 },
  { id: 'l4', x: 720, y: 94, cord: 11 },
  { id: 'l5', x: 928, y: 97, cord: 10 },
  { id: 'l6', x: 1020, y: 97, cord: 10 },
  { id: 'l7', x: 1235, y: 103, cord: 10 },
];

export function FooterMarketPanorama() {
  return (
    <div className="w-full overflow-hidden select-none leading-none" aria-hidden="true">
      <div className="w-full h-4 sm:h-5 border-t-2 border-b border-[var(--border-ink)] bg-[var(--ochre-surface)]">
        <svg className="w-full h-full block">
          <defs>
            <pattern id="pasarkuKawungBand" width="36" height="20" patternUnits="userSpaceOnUse">
              <rect width="36" height="20" fill="var(--ochre-surface)" />
              <ellipse cx="9" cy="5" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <ellipse cx="27" cy="5" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <ellipse cx="9" cy="15" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <ellipse cx="27" cy="15" rx="6.5" ry="3.8" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" />
              <path d="M18 3 L22 10 L18 17 L14 10 Z" fill="var(--accent-chili)" stroke="var(--border-ink)" strokeWidth="0.9" />
              <circle cx="0" cy="10" r="2" fill="var(--border-ink)" />
              <circle cx="36" cy="10" r="2" fill="var(--border-ink)" />
              <circle cx="18" cy="10" r="1.4" fill="#F6ECE1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pasarkuKawungBand)" />
        </svg>
      </div>

      <svg
        className="w-full h-[114px] sm:h-[138px] lg:h-[160px] xl:h-auto xl:aspect-[1440/176] block"
        viewBox="0 0 1440 176"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="footerLampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.82" />
            <stop offset="48%" stopColor="#FFB43C" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FFB43C" stopOpacity="0" />
          </radialGradient>
          <pattern id="tegelKunciFloor" width="32" height="16" patternUnits="userSpaceOnUse">
            <rect width="32" height="16" fill="var(--ochre-surface)" />
            <rect x="0.5" y="0.5" width="31" height="15" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            <path d="M16 2 L24 8 L16 14 L8 8 Z" fill="none" stroke="var(--earth-ochre)" strokeWidth="1" />
            <circle cx="16" cy="8" r="1.5" fill="var(--accent-chili)" fillOpacity="0.7" />
          </pattern>
          <pattern id="anyamTrellis" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="var(--bg-card)" />
            <path d="M0 8 L8 0 L16 8 L8 16 Z" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            <circle cx="8" cy="8" r="1.4" fill="var(--earth-ochre)" />
          </pattern>
        </defs>

        <path
          d="M 0 94 Q 180 54 360 88 T 720 68 T 1080 90 T 1440 82 L 1440 160 L 0 160 Z"
          fill="var(--bg-paper)"
          fillOpacity="0.58"
        />
        <path
          d="M 0 82 Q 190 36 390 80"
          fill="none"
          stroke="var(--wave-line-gold)"
          strokeWidth="1.8"
          strokeOpacity="0.6"
        />
        <path
          d="M 1050 82 Q 1250 38 1440 76"
          fill="none"
          stroke="var(--wave-line-gold)"
          strokeWidth="1.8"
          strokeOpacity="0.6"
        />

        <g opacity="0.9">
          <path d="M 152 160 L 157 88 L 163 88 L 168 160 Z" fill="var(--border-subtle)" stroke="var(--border-ink)" strokeWidth="1.2" />
          <path d="M 158 88 L 160 52 L 164 68 L 156 76 L 161 88 Z" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.1" />
          <circle cx="62" cy="118" r="24" fill="var(--forest-surface)" stroke="var(--border-subtle)" strokeWidth="1.4" />
          <circle cx="94" cy="108" r="28" fill="var(--forest-surface)" stroke="var(--border-subtle)" strokeWidth="1.4" />
          <circle cx="1346" cy="108" r="28" fill="var(--forest-surface)" stroke="var(--border-subtle)" strokeWidth="1.4" />
          <circle cx="1378" cy="120" r="22" fill="var(--forest-surface)" stroke="var(--border-subtle)" strokeWidth="1.4" />
          <path d="M 1296 160 Q 1298 118 1280 94 M 1296 160 Q 1300 116 1318 96 M 1296 112 Q 1278 104 1266 110 M 1298 108 Q 1316 100 1326 108" fill="none" stroke="var(--forest-ink)" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.65" />
        </g>

        <g>
          <rect x="46" y="136" width="66" height="24" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <rect x="1328" y="136" width="66" height="24" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <circle cx="46" cy="133" r="4.5" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.3" />
          <circle cx="1394" cy="133" r="4.5" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.3" />
        </g>

        <g>
          <rect x="122" y="88" width="166" height="72" fill="var(--bg-card)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <path d="M 112 88 L 132 68 L 278 68 L 298 88 Z" fill="#183826" stroke="var(--border-ink)" strokeWidth="1.6" />
          {renderStripedAwning('leftWingAwning', 118, 86, 174, 15, 6, 8)}
          <rect x="134" y="128" width="142" height="32" rx="2" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <rect x="142" y="134" width="126" height="20" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.1" />
          <circle cx="158" cy="124" r="6" fill="#D9531E" stroke="var(--border-ink)" strokeWidth="1.2" />
          <circle cx="170" cy="123" r="6.5" fill="#EA580C" stroke="var(--border-ink)" strokeWidth="1.2" />
          <circle cx="182" cy="124" r="6" fill="#D9531E" stroke="var(--border-ink)" strokeWidth="1.2" />
          <path d="M 218 128 C 218 117 242 117 242 128 Z" fill="#245034" stroke="var(--border-ink)" strokeWidth="1.2" />
          <circle cx="256" cy="123" r="5.5" fill="var(--accent-chili)" stroke="var(--border-ink)" strokeWidth="1.2" />
          <circle cx="265" cy="124" r="5" fill="#D97706" stroke="var(--border-ink)" strokeWidth="1.2" />
        </g>

        <g>
          <rect x="1152" y="88" width="166" height="72" fill="var(--bg-card)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <path d="M 1142 88 L 1162 68 L 1308 68 L 1328 88 Z" fill="#183826" stroke="var(--border-ink)" strokeWidth="1.6" />
          {renderStripedAwning('rightWingAwning', 1148, 86, 174, 15, 6, 8)}
          <rect x="1164" y="128" width="142" height="32" rx="2" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <rect x="1172" y="134" width="126" height="20" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.1" />
          <rect x="1182" y="114" width="10" height="14" rx="2" fill="#EAB308" stroke="var(--border-ink)" strokeWidth="1.1" />
          <rect x="1195" y="112" width="10" height="16" rx="2" fill="#D97706" stroke="var(--border-ink)" strokeWidth="1.1" />
          <rect x="1208" y="114" width="10" height="14" rx="2" fill="#EAB308" stroke="var(--border-ink)" strokeWidth="1.1" />
          <path d="M 1244 128 L 1247 115 Q 1258 112 1269 115 L 1272 128 Z" fill="#B47B38" stroke="var(--border-ink)" strokeWidth="1.2" />
          <ellipse cx="1258" cy="115" rx="10" ry="3.5" fill="#F6ECE1" stroke="var(--border-ink)" strokeWidth="1.1" />
          <rect x="1280" y="110" width="16" height="18" rx="1.5" fill="#183826" stroke="var(--border-ink)" strokeWidth="1.1" />
        </g>

        <g>
          <rect x="358" y="76" width="212" height="84" fill="var(--bg-card)" stroke="var(--border-ink)" strokeWidth="1.7" />
          <path d="M 348 78 L 368 58 L 570 58 L 570 78 Z" fill="#183826" stroke="var(--border-ink)" strokeWidth="1.6" />
          {renderStripedAwning('leftStallAwning', 356, 76, 208, 18, 8, 8)}
          <rect x="372" y="124" width="178" height="36" rx="2" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.5" />
          <rect x="380" y="131" width="162" height="23" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.1" />
          <path d="M 382 124 Q 402 106 424 124 Z" fill="var(--accent-chili)" stroke="var(--border-ink)" strokeWidth="1.3" />
          <path d="M 426 124 C 428 109 448 107 458 114 C 466 119 468 124 468 124 Z" fill="#245034" stroke="var(--border-ink)" strokeWidth="1.3" />
          <path d="M 472 124 Q 492 108 512 124 Z" fill="#D9531E" stroke="var(--border-ink)" strokeWidth="1.3" />
          <circle cx="526" cy="119" r="5" fill="#881337" stroke="var(--border-ink)" strokeWidth="1.1" />
          <circle cx="536" cy="118" r="5.5" fill="#A92717" stroke="var(--border-ink)" strokeWidth="1.1" />
          <circle cx="464" cy="100" r="3.5" fill="#F6ECE1" stroke="var(--border-ink)" strokeWidth="1" />
          <circle cx="468" cy="105" r="3.5" fill="#F6ECE1" stroke="var(--border-ink)" strokeWidth="1" />
          <circle cx="460" cy="105" r="3.5" fill="#F6ECE1" stroke="var(--border-ink)" strokeWidth="1" />
        </g>

        <g>
          <rect x="870" y="76" width="212" height="84" fill="var(--bg-card)" stroke="var(--border-ink)" strokeWidth="1.7" />
          <path d="M 870 78 L 870 58 L 1072 58 L 1092 78 Z" fill="#183826" stroke="var(--border-ink)" strokeWidth="1.6" />
          {renderStripedAwning('rightStallAwning', 876, 76, 208, 18, 8, 8)}
          <rect x="890" y="124" width="178" height="36" rx="2" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.5" />
          <rect x="898" y="131" width="162" height="23" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.1" />
          <path d="M 902 124 L 906 105 L 934 105 L 938 124 Z" fill="#B47B38" stroke="var(--border-ink)" strokeWidth="1.3" />
          <ellipse cx="920" cy="105" rx="14" ry="4.5" fill="#F6ECE1" stroke="var(--border-ink)" strokeWidth="1.2" />
          <path d="M 946 124 L 950 107 L 976 107 L 980 124 Z" fill="#B47B38" stroke="var(--border-ink)" strokeWidth="1.3" />
          <ellipse cx="963" cy="107" rx="13" ry="4.2" fill="#F6ECE1" stroke="var(--border-ink)" strokeWidth="1.2" />
          <rect x="988" y="114" width="38" height="10" rx="2" fill="#1D4ED8" stroke="var(--border-ink)" strokeWidth="1.2" />
          <path d="M 994 114 Q 1007 107 1020 114 Z" fill="#CBD5E1" stroke="var(--border-ink)" strokeWidth="1.1" />
          <ellipse cx="1048" cy="119" rx="12" ry="6" fill="#D97706" stroke="var(--border-ink)" strokeWidth="1.2" />
        </g>

        <g>
          <rect x="572" y="64" width="296" height="96" fill="var(--bg-card)" stroke="var(--border-ink)" strokeWidth="1.8" />
          <rect x="580" y="72" width="36" height="88" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <rect x="824" y="72" width="36" height="88" fill="url(#anyamTrellis)" stroke="var(--border-ink)" strokeWidth="1.4" />

          <path d="M 672 160 L 672 110 Q 720 82 768 110 L 768 160 Z" fill="var(--bg-stage)" stroke="var(--border-ink)" strokeWidth="1.8" />
          <path d="M 684 160 L 684 116 Q 720 94 756 116 L 756 160 Z" fill="none" stroke="var(--earth-ochre)" strokeWidth="1.2" strokeDasharray="3 2" />

          <line x1="720" y1="100" x2="720" y2="122" stroke="var(--earth-ochre)" strokeWidth="1.4" />
          <path d="M 706 122 H 734 M 706 122 L 700 134 H 712 Z M 734 122 L 728 134 H 740 Z" fill="var(--earth-ochre)" stroke="var(--earth-ochre)" strokeWidth="1.2" strokeLinejoin="round" />

          <path d="M 544 74 Q 635 56 720 46 Q 805 56 896 74 Z" fill="#183826" stroke="var(--border-ink)" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M 558 72 L 882 72" stroke="var(--earth-ochre)" strokeWidth="1.5" />
          <rect x="652" y="38" width="136" height="12" fill="var(--ochre-surface)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <path d="M 640 39 Q 682 28 720 11 Q 758 28 800 39 Z" fill="#183826" stroke="var(--border-ink)" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M 720 3 L 724 11 L 720 18 L 716 11 Z" fill="var(--accent-chili)" stroke="var(--border-ink)" strokeWidth="1.3" />
          <circle cx="544" cy="74" r="3" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.1" />
          <circle cx="896" cy="74" r="3" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.1" />

          <rect x="646" y="64" width="148" height="20" rx="4" fill="var(--ochre-surface)" stroke="var(--border-ink)" strokeWidth="1.6" />
          <circle cx="656" cy="74" r="2.2" fill="var(--accent-chili)" />
          <circle cx="784" cy="74" r="2.2" fill="var(--accent-chili)" />
          <text
            x="720"
            y="77.5"
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="1.6"
          >
            PASAR PAKUAN
          </text>

          <path d="M 624 160 L 627 140 H 655 L 658 160 Z" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <path d="M 782 160 L 785 140 H 813 L 816 160 Z" fill="var(--earth-ochre)" stroke="var(--border-ink)" strokeWidth="1.4" />
          <path d="M 632 140 Q 641 128 650 140 Z" fill="#245034" stroke="var(--border-ink)" strokeWidth="1.1" />
          <path d="M 790 140 Q 799 128 808 140 Z" fill="var(--accent-chili)" stroke="var(--border-ink)" strokeWidth="1.1" />
        </g>

        {renderPennantString('pennLeft', 288, 76, 368, 76, 7, 5)}
        {renderPennantString('pennCenterLeft', 554, 72, 646, 74, 8, 6)}
        {renderPennantString('pennCenterRight', 794, 74, 886, 72, 8, 6)}
        {renderPennantString('pennRight', 1072, 76, 1152, 76, 7, 5)}

        {LAMP_POSITIONS.map((lamp) => (
          <g key={lamp.id}>
            <circle cx={lamp.x} cy={lamp.y + lamp.cord + 3} r="22" fill="url(#footerLampGlow)" className="animate-lamp-glow" />
            <line x1={lamp.x} y1={lamp.y} x2={lamp.x} y2={lamp.y + lamp.cord} stroke="var(--border-ink)" strokeWidth="1.3" />
            <path
              d={`M ${lamp.x - 8} ${lamp.y + lamp.cord + 4} Q ${lamp.x} ${lamp.y + lamp.cord - 3} ${lamp.x + 8} ${lamp.y + lamp.cord + 4} Z`}
              fill="var(--earth-ochre)"
              stroke="var(--border-ink)"
              strokeWidth="1.2"
            />
            <circle cx={lamp.x} cy={lamp.y + lamp.cord + 5.5} r="2.8" fill="#FDE68A" stroke="var(--border-ink)" strokeWidth="0.9" />
          </g>
        ))}

        <rect x="0" y="160" width="1440" height="16" fill="url(#tegelKunciFloor)" />
        <line x1="0" y1="160" x2="1440" y2="160" stroke="var(--border-ink)" strokeWidth="1.8" />
      </svg>
    </div>
  );
}
