interface CacingWaveDividerProps {
  topColor?: string;
  bottomColor?: string;
  flip?: boolean;
  className?: string;
}

export function CacingWaveDivider({
  topColor = 'var(--bg-paper)',
  bottomColor = 'var(--bg-muted)',
  flip = false,
  className = '',
}: CacingWaveDividerProps) {
  const goldStroke = flip
    ? 'M0,18 C240,5 480,33 720,18 C960,4 1200,33 1440,17'
    : 'M0,15 C240,32 480,4 720,19 C960,34 1200,5 1440,21';

  const darkStroke = flip
    ? 'M0,25 C240,12 480,40 720,25 C960,11 1200,40 1440,24'
    : 'M0,22 C240,39 480,11 720,26 C960,41 1200,12 1440,28';

  const isTransparentBottom = bottomColor === 'transparent';

  const maskPath = isTransparentBottom
    ? `${darkStroke} L1440,0 L0,0 Z`
    : flip
      ? 'M0,22 C240,9 480,37 720,22 C960,8 1200,37 1440,21 L1440,46 L0,46 Z'
      : 'M0,19 C240,36 480,8 720,23 C960,38 1200,9 1440,25 L1440,46 L0,46 Z';

  return (
    <div
      aria-hidden="true"
      className={`w-full h-[34px] sm:h-[46px] overflow-hidden select-none pointer-events-none leading-none ${className}`}
      style={{ backgroundColor: isTransparentBottom ? 'transparent' : topColor }}
    >
      <svg viewBox="0 0 1440 46" preserveAspectRatio="none" className="w-full h-full block">
        <path d={maskPath} fill={isTransparentBottom ? topColor : bottomColor} />
        <path
          d={goldStroke}
          fill="none"
          stroke="var(--wave-line-gold)"
          strokeWidth="2"
          strokeOpacity="0.88"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={darkStroke}
          fill="none"
          stroke="var(--border-ink)"
          strokeWidth="1.6"
          strokeOpacity="0.75"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
