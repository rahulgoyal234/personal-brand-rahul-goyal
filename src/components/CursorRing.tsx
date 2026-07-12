import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  glowColor: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  type: 'spark' | 'trail';
}

export default function CursorRing() {
  const [supportsHover, setSupportsHover] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(hover: hover)').matches;
    }
    return false;
  });

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use refs to store mutable coordinates without triggering React state updates
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });
  const lastEmitCoords = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const isPointerInsideWindowRef = useRef(false);

  // Color palette for interactive sparks
  const sparkColors = [
    { color: '169, 128, 63', glow: 'rgba(169, 128, 63, 0.45)' }, // Elegant Brass
    { color: '13, 148, 136', glow: 'rgba(13, 148, 136, 0.4)' },  // Deep Teal
    { color: '124, 58, 237', glow: 'rgba(124, 58, 237, 0.35)' }, // Electric Violet
    { color: '219, 39, 119', glow: 'rgba(219, 39, 119, 0.4)' },  // Sunset Rose
    { color: '6, 182, 212', glow: 'rgba(6, 182, 212, 0.45)' },   // Cyan Blue
  ];

  useEffect(() => {
    // Media query to detect hover pointer capabilities
    const mediaQuery = window.matchMedia('(hover: hover)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setSupportsHover(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    } else {
      mediaQuery.addListener(handleMediaQueryChange);
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: Particle[] = [];

    // Helper to spawn a splash of celebratory sparks on mouse clicks or finger taps
    const spawnSparksBurst = (cx: number, cy: number) => {
      const numSparks = 14 + Math.floor(Math.random() * 8); // Rich dense bursts

      for (let i = 0; i < numSparks; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 5.5;
        const colorObj = sparkColors[Math.floor(Math.random() * sparkColors.length)];

        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.2 + Math.random() * 3.2,
          color: colorObj.color,
          glowColor: colorObj.glow,
          alpha: 0.95 + Math.random() * 0.05,
          decay: 0.016 + Math.random() * 0.024,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          type: 'spark',
        });
      }
    };

    // Helper to update DOM cursor styling based on state
    const updateVisualStyles = () => {
      if (!mediaQuery.matches) return; // Keep cursor hidden on non-hover screens

      const isHovered = isHoveredRef.current;
      const isClicking = isClickingRef.current;

      if (ring) {
        if (isHovered) {
          ring.className = 'fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-brass bg-brass/10 pointer-events-none z-[9999] will-change-transform';
          ring.style.scale = '1.35';
        } else if (isClicking) {
          ring.className = 'fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 rounded-full border border-brass bg-brass/25 pointer-events-none z-[9999] will-change-transform';
          ring.style.scale = '0.85';
        } else {
          ring.className = 'fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 rounded-full border border-brass/60 bg-transparent pointer-events-none z-[9999] will-change-transform';
          ring.style.scale = '1';
        }
      }

      if (dot) {
        if (isHovered) {
          dot.className = 'fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full pointer-events-none z-[9999] bg-brass shadow-sm will-change-transform';
          dot.style.scale = '1.25';
        } else {
          dot.className = 'fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full pointer-events-none z-[9999] bg-ink will-change-transform';
          dot.style.scale = '1';
        }
      }
    };

    // Unified pointer events handling
    const onPointerMove = (e: PointerEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      isPointerInsideWindowRef.current = true;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        ringCoords.current.x = e.clientX;
        ringCoords.current.y = e.clientY;
        lastEmitCoords.current.x = e.clientX;
        lastEmitCoords.current.y = e.clientY;
      }

      const isTouch = e.pointerType === 'touch';

      // Keep visual cursor showing on desktop
      if (!isTouch && mediaQuery.matches) {
        if (dot) dot.style.opacity = '1';
        if (ring) ring.style.opacity = '1';

        // Emit delicate trailing dust sparks on desktop move
        const dx = e.clientX - lastEmitCoords.current.x;
        const dy = e.clientY - lastEmitCoords.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 14) { // Only emit when mouse has swept enough distance (throttling)
          const colorObj = sparkColors[Math.floor(Math.random() * sparkColors.length)];
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 + 0.3, // Subtle downward drift (gravity feel)
            size: 1.2 + Math.random() * 1.6,
            color: colorObj.color,
            glowColor: colorObj.glow,
            alpha: 0.7,
            decay: 0.02 + Math.random() * 0.02,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            type: 'trail',
          });
          lastEmitCoords.current.x = e.clientX;
          lastEmitCoords.current.y = e.clientY;
        }
      }

      // Proactive interactive target scanning
      const target = e.target as HTMLElement;
      if (target) {
        const isInteractive = 
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          !!target.closest('button') ||
          !!target.closest('a') ||
          !!target.closest('[role="button"]') ||
          !!target.closest('[role="link"]') ||
          !!target.closest('.cursor-pointer');

        if (isHoveredRef.current !== isInteractive) {
          isHoveredRef.current = isInteractive;
          updateVisualStyles();
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isClickingRef.current = true;
      spawnSparksBurst(e.clientX, e.clientY);
      updateVisualStyles();
    };

    const onPointerUp = () => {
      isClickingRef.current = false;
      updateVisualStyles();
    };

    const onPointerCancel = () => {
      isClickingRef.current = false;
      updateVisualStyles();
    };

    const onPointerLeaveWindow = () => {
      isPointerInsideWindowRef.current = false;
      if (ring) ring.style.opacity = '0';
      if (dot) dot.style.opacity = '0';
    };

    const onPointerEnterWindow = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        isPointerInsideWindowRef.current = true;
        if (ring) ring.style.opacity = '1';
        if (dot) dot.style.opacity = '1';
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Single Animation Frame Tick handling physics and visual rendering
    let animationFrameId: number;
    const updateLoop = () => {
      // 1. Desktop custom cursor easing tracking (Lag Ring follow)
      if (mediaQuery.matches && hasMovedRef.current) {
        const ease = 0.3; // Responsive tight-binding trailing
        const targetX = mouseCoords.current.x;
        const targetY = mouseCoords.current.y;

        ringCoords.current.x += (targetX - ringCoords.current.x) * ease;
        ringCoords.current.y += (targetY - ringCoords.current.y) * ease;

        if (ring) {
          ring.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0)`;
        }
        if (dot) {
          dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        }
      }

      // 2. High-performance canvas clearing & particle rendering
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Physics update
        p.x += p.vx;
        p.y += p.vy;

        // Apply friction and atmospheric resistance
        if (p.type === 'spark') {
          p.vx *= 0.94; // Deceleration
          p.vy *= 0.94;
          p.vy += 0.08; // Gentle spark gravity
        } else {
          p.vx *= 0.97;
          p.vy *= 0.97;
        }

        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        // Erase dead particles
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Render Particle on canvas
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Soft outer glow shadows
        ctx.shadowBlur = p.type === 'spark' ? 10 : 4;
        ctx.shadowColor = p.glowColor;

        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;

        if (p.type === 'spark') {
          // Draw geometric diamond spark star
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size * 0.4, -p.size * 0.4);
          ctx.lineTo(p.size * 1.5, 0);
          ctx.lineTo(p.size * 0.4, p.size * 0.4);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size * 0.4, p.size * 0.4);
          ctx.lineTo(-p.size * 1.5, 0);
          ctx.lineTo(-p.size * 0.4, -p.size * 0.4);
          ctx.closePath();
          ctx.fill();
        } else {
          // Soft rounded trail dust particle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    // Attach listeners
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });
    document.addEventListener('pointerleave', onPointerLeaveWindow, { passive: true });
    document.addEventListener('pointerenter', onPointerEnterWindow, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initiate loop
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('pointerleave', onPointerLeaveWindow);
      document.removeEventListener('pointerenter', onPointerEnterWindow);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      } else {
        mediaQuery.removeListener(handleMediaQueryChange);
      }
    };
  }, [supportsHover]);

  return (
    <>
      {/* High-Performance Particle Canvas Overlay across ALL devices */}
      <canvas
        ref={canvasRef}
        id="cursor-particle-canvas"
        className="fixed inset-0 w-full h-full pointer-events-none z-[9999] select-none print:hidden"
      />

      {/* Outer Easing Trailing Ring - Desktop Only */}
      {supportsHover && (
        <div
          ref={ringRef}
          id="custom-cursor-ring"
          className="fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 rounded-full border border-brass/60 bg-transparent pointer-events-none z-[9999] will-change-transform hidden md:block"
          style={{
            opacity: 0,
            scale: 1,
            transition: 'opacity 0.2s ease-out, scale 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out',
          }}
        />
      )}

      {/* Precise Core Center Dot - Desktop Only */}
      {supportsHover && (
        <div
          ref={dotRef}
          id="custom-cursor-dot"
          className="fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full pointer-events-none z-[9999] bg-ink will-change-transform hidden md:block"
          style={{
            opacity: 0,
            scale: 1,
            transition: 'opacity 0.1s ease-out, scale 0.1s ease-out, background-color 0.1s ease-out',
          }}
        />
      )}
    </>
  );
}
