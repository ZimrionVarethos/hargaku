'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PuntenMascotAvatar, type PuntenMood } from './PuntenMascotAvatar';
import { createPuntenMascotGroup } from './punten-mascot-geometry';
import {
  disposePuntenMascotTree,
  updatePuntenMascotFrame,
  updatePuntenMascotMood,
  type PuntenMascotRig,
} from './punten-mascot-animation';

interface Props {
  size?: number;
  mood?: PuntenMood;
  trackGlobalPointer?: boolean;
  className?: string;
}

export function PuntenMascot3D({
  size = 116,
  mood = 'normal',
  trackGlobalPointer = false,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<PuntenMascotRig | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef(false);
  const moodRef = useRef<PuntenMood>(mood);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    moodRef.current = mood;
    if (rigRef.current) {
      updatePuntenMascotMood(rigRef.current, mood);
    }
  }, [mood]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0.14, 4.95);
    camera.lookAt(0, 0.04, 0);

    const hemiLight = new THREE.HemisphereLight('#FFF8ED', '#1B4332', 1.55);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFFFFF', 1.65);
    keyLight.position.set(2.8, 3.6, 4.2);
    scene.add(keyLight);

    const warmRimLight = new THREE.DirectionalLight('#FDE68A', 0.85);
    warmRimLight.position.set(-3.2, -1.2, -2.5);
    scene.add(warmRimLight);

    const rig = createPuntenMascotGroup(moodRef.current);
    rigRef.current = rig;
    scene.add(rig.root);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let isVisible = true;
    let isHidden = document.hidden;
    let animId: number | null = null;
    const startMs = performance.now();

    const tick = (now: number) => {
      animId = null;
      if (!isVisible || isHidden) return;
      const elapsedSec = (now - startMs) * 0.001;
      updatePuntenMascotFrame(
        rig,
        elapsedSec,
        pointerRef.current.x,
        pointerRef.current.y,
        hoveredRef.current,
        moodRef.current,
        reducedMotion
      );
      renderer.render(scene, camera);
      if (!reducedMotion) {
        animId = requestAnimationFrame(tick);
      }
    };

    const startLoop = () => {
      if (animId !== null || !isVisible || isHidden) return;
      if (reducedMotion) {
        updatePuntenMascotFrame(rig, 0, 0, 0, false, moodRef.current, true);
        renderer.render(scene, camera);
        return;
      }
      animId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      isHidden = document.hidden;
      if (!isHidden) startLoop();
    };
    const handleMotion = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      startLoop();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startLoop();
      },
      { threshold: 0.05 }
    );
    observer.observe(container);
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleMotion);

    const handleGlobalMove = (e: PointerEvent) => {
      if (!trackGlobalPointer) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    };
    if (trackGlobalPointer) {
      window.addEventListener('pointermove', handleGlobalMove, { passive: true });
    }

    startLoop();

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotion);
      if (trackGlobalPointer) {
        window.removeEventListener('pointermove', handleGlobalMove);
      }
      disposePuntenMascotTree(rig.root);
      rigRef.current = null;
      renderer.dispose();
    };
  }, [size, trackGlobalPointer]);

  if (webglFailed) {
    return <PuntenMascotAvatar size={size} mood={mood} className={className} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      onPointerMove={(e) => {
        if (trackGlobalPointer) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        pointerRef.current = { x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) };
      }}
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
        if (!trackGlobalPointer) {
          pointerRef.current = { x: 0, y: 0 };
        }
      }}
      className={`select-none ${className}`}
    />
  );
}
