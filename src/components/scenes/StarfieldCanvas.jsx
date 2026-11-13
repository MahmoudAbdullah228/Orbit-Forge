'use client';

import React, { useEffect, useRef } from 'react';

/**
 * StarfieldCanvas - Retro stepped starfield with 2-frame twinkle and parallax
 */
export default function StarfieldCanvas({ speed = 1, density = 70, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const stars = Array.from({ length: density }).map(() => ({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      size: Math.random() > 0.8 ? 3 : Math.random() > 0.4 ? 2 : 1,
      speed: (Math.random() * 0.4 + 0.1) * speed,
      color: Math.random() > 0.85 ? '#FFE45C' : Math.random() > 0.7 ? '#2EE6A8' : '#FFFFFF',
      twinkleFrame: Math.floor(Math.random() * 60)
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        // Move star down slowly
        star.y = (star.y + star.speed) % height;

        // Twinkle: toggle visibility slightly
        const isBlinking = (frame + star.twinkleFrame) % 40 < 5;
        if (!isBlinking) {
          ctx.fillStyle = star.color;
          ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
