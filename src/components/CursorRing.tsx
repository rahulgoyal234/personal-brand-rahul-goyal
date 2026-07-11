import React, { useEffect, useRef, useState } from 'react';

export default function CursorRing() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Use refs to store mutable values without triggering re-renders
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const isTouchActiveRef = useRef(false);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;

    const onPointerMove = (e: PointerEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        // Seed the initial position immediately to prevent jumping from (0,0)
        ringCoords.current.x = e.clientX;
        ringCoords.current.y = e.clientY;
      }

      // Position the precise center dot instantly
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        // If it's touch, only show if currently active/pressing
        if (e.pointerType !== 'touch' || isTouchActiveRef.current) {
          dot.style.opacity = '1';
        }
      }
      if (ring) {
        if (e.pointerType !== 'touch' || isTouchActiveRef.current) {
          ring.style.opacity = '1';
        }
      }
    };

    // Smooth lerping animation loop for the trailing outer ring
    let animationFrameId: number;
    const updatePosition = () => {
      // Linear interpolation (lerp) for trailing effect: 0.15 is highly responsive but organic
      const ease = 0.15;
      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;

      ringCoords.current.x += (targetX - ringCoords.current.x) * ease;
      ringCoords.current.y += (targetY - ringCoords.current.y) * ease;

      if (ring && hasMovedRef.current) {
        ring.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const onPointerDown = (e: PointerEvent) => {
      setIsClicking(true);
      if (e.pointerType === 'touch') {
        isTouchActiveRef.current = true;
        // Update coordinates to touch position immediately
        mouseCoords.current.x = e.clientX;
        mouseCoords.current.y = e.clientY;
        ringCoords.current.x = e.clientX;
        ringCoords.current.y = e.clientY;
        hasMovedRef.current = true;

        if (dot) {
          dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
          dot.style.opacity = '1';
        }
        if (ring) {
          ring.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
          ring.style.opacity = '1';
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      setIsClicking(false);
      if (e.pointerType === 'touch') {
        isTouchActiveRef.current = false;
        // Fade out on touch release
        if (ring) ring.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
      }
    };

    const onPointerCancel = (e: PointerEvent) => {
      setIsClicking(false);
      if (e.pointerType === 'touch') {
        isTouchActiveRef.current = false;
        if (ring) ring.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
      }
    };

    // Optimized hover listeners for interactive elements
    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovered(!!isInteractive);
    };

    const onPointerLeaveWindow = () => {
      if (ring) ring.style.opacity = '0';
      if (dot) dot.style.opacity = '0';
    };

    const onPointerEnterWindow = (e: PointerEvent) => {
      if (hasMovedRef.current && e.pointerType !== 'touch') {
        if (ring) ring.style.opacity = '1';
        if (dot) dot.style.opacity = '1';
      }
    };

    // Add pointer listeners
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerleave', onPointerLeaveWindow, { passive: true });
    document.addEventListener('pointerenter', onPointerEnterWindow, { passive: true });

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerleave', onPointerLeaveWindow);
      document.removeEventListener('pointerenter', onPointerEnterWindow);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Outer Easing Trailing Ring */}
      <div
        ref={ringRef}
        id="custom-cursor-ring"
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border pointer-events-none z-[9999] transition-all duration-300 ease-out will-change-transform ${
          isHovered
            ? 'border-brass bg-brass/15 scale-150'
            : isClicking
            ? 'border-brass bg-brass/35 scale-90'
            : 'border-brass/80 bg-transparent'
        }`}
        style={{
          opacity: 0,
          transitionProperty: 'width, height, background-color, border-color, transform, opacity',
        }}
      />

      {/* Precise Core Center Dot */}
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full pointer-events-none z-[9999] transition-all duration-75 will-change-transform ${
          isHovered ? 'bg-brass scale-125' : 'bg-ink'
        }`}
        style={{
          opacity: 0,
          transitionProperty: 'transform, opacity, background-color',
        }}
      />
    </>
  );
}
