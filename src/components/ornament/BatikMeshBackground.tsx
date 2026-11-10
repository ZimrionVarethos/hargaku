'use client';

import { useId } from 'react';

interface BatikMeshBackgroundProps {
  opacity?: number;
  fadeEdges?: boolean;
  adaptiveScale?: boolean;
  className?: string;
}

function MeshSvg({
  patternId,
  scale,
  className,
}: {
  patternId: string;
  scale: number;
  className: string;
}) {
  return (
    <svg className={className}>
      <defs>
        <pattern
          id={patternId}
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
          patternTransform={scale !== 1 ? `scale(${scale})` : undefined}
        >
          <circle cx="24" cy="24" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
          <circle cx="48" cy="0" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
          <circle cx="0" cy="48" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
          <circle cx="48" cy="48" r="16" fill="none" stroke="var(--border-subtle)" strokeWidth="1.1" />
          <path d="M24 14 L29 24 L24 34 L19 24 Z" fill="none" stroke="var(--earth-ochre)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function BatikMeshBackground({
  opacity,
  fadeEdges = true,
  adaptiveScale = true,
  className = '',
}: BatikMeshBackgroundProps) {
  const rawId = useId();
  const baseId = `pasarku-batik-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const classes = [
    'absolute inset-0 z-0 pointer-events-none select-none overflow-hidden',
    fadeEdges ? 'batik-mesh-fade-mask' : '',
    opacity === undefined ? 'batik-mesh-layer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      aria-hidden="true"
      className={classes}
      style={opacity !== undefined ? { opacity } : undefined}
    >
      {adaptiveScale ? (
        <>
          <MeshSvg patternId={`${baseId}-m`} scale={1.3333} className="sm:hidden w-full h-full block" />
          <MeshSvg patternId={`${baseId}-d`} scale={1} className="hidden sm:block w-full h-full" />
        </>
      ) : (
        <MeshSvg patternId={baseId} scale={1} className="w-full h-full block" />
      )}
    </div>
  );
}
