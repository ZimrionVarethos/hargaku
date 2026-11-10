'use client';

import { useEffect, useRef } from 'react';

export function useHeroAnimation(enabled = true) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const waveTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const trFill = document.getElementById('trWaveFill');
    const trGold = document.getElementById('trWaveGold');
    const trDark = document.getElementById('trWaveDark');

    let width = (canvas.width = canvas.parentElement?.clientWidth || 1440);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    const motes = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.8 + Math.random() * 2.8,
      speedY: 0.25 + Math.random() * 0.45,
      speedX: (Math.random() - 0.5) * 0.25,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      waveTimeRef.current += 0.014;
      const t = waveTimeRef.current;

      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.y -= m.speedY;
        m.x += m.speedX;
        m.phase += 0.02;
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        const alpha = 0.2 + 0.25 * Math.sin(m.phase);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 155, 65, ${alpha})`;
        ctx.fill();
      }

      const w1 = Math.sin(t) * 12;
      const w2 = Math.cos(t * 0.85) * 14;
      const w3 = Math.sin(t * 1.15 + 1.2) * 10;

      if (trFill) {
        trFill.setAttribute(
          'd',
          `M 80 -4 C ${130 + w1} ${55 + w2}, ${220 - w2} ${35 + w1}, ${290 + w3} ${110 + w2} C ${350 - w1} ${175 + w3}, ${410 + w2} ${175 - w1}, ${485 + w1} ${245 + w2} C ${540 - w2} ${295 + w1}, 595 295, 644 290 L 644 -4 Z`
        );
      }
      if (trGold) {
        trGold.setAttribute(
          'd',
          `M 65 -4 C ${120 + w1} ${62 + w2}, ${212 - w2} ${42 + w1}, ${282 + w3} ${118 + w2} C ${342 - w1} ${184 + w3}, ${404 + w2} ${184 - w1}, ${478 + w1} ${254 + w2} C ${535 - w2} ${304 + w1}, 592 302, 644 298`
        );
      }
      if (trDark) {
        trDark.setAttribute(
          'd',
          `M 42 -4 C ${98 + w1} ${72 + w2}, ${195 - w2} ${52 + w1}, ${266 + w3} ${130 + w2} C ${328 - w1} ${196 + w3}, ${392 + w2} ${196 - w1}, ${466 + w1} ${268 + w2} C ${526 - w2} ${318 + w1}, 588 314, 644 310`
        );
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [enabled]);

  return { canvasRef };
}

