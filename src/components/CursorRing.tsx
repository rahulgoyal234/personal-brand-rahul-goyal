import React, { useEffect, useRef } from 'react';

export default function CursorRing() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  // Use refs to store mutable values without triggering React state re-renders
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const isTouchActiveRef = useRef(false);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;

    // Helper to update visual styling directly via the DOM
    const updateVisualStyles = () => {
      const isHovered = isHoveredRef.current;
      const isClicking = isClickingRef.current;

      if (ring) {
        if (isHovered) {
          ring.className = 'fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 rounded-full border border-brass bg-brass/10 pointer-events-none z-[9999] will-change-transform';
          ring.style.scale = '1.4';
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
          dot.className = 'fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full pointer-events-none z-[9999] bg-brass will-change-transform';
          dot.style.scale = '1.2';
        } else {
          dot.className = 'fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full pointer-events-none z-[9999] bg-ink will-change-transform';
          dot.style.scale = '1';
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        // Seed the initial position immediately to prevent jumping from (0,0)
        ringCoords.current.x = e.clientX;
        ringCoords.current.y = e.clientY;
      }

      const isTouch = e.pointerType === 'touch';
      const shouldBeVisible = !isTouch || isTouchActiveRef.current;

      if (shouldBeVisible) {
        if (dot) dot.style.opacity = '1';
        if (ring) ring.style.opacity = '1';
      }

      // Proactively detect interactive targets on move to keep hover synced flawlessly
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

    // Smooth lerping animation loop for the trailing outer ring
    let animationFrameId: number;
    const updatePosition = () => {
      // Use a stable, ultra-smooth constant easing factor so the movement never jitters or scatters.
      // 0.32 provides a highly responsive, tight follow while maintaining a premium, organic fluid feel.
      const ease = 0.32;
      
      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;

      ringCoords.current.x += (targetX - ringCoords.current.x) * ease;
      ringCoords.current.y += (targetY - ringCoords.current.y) * ease;

      if (hasMovedRef.current) {
        if (ring) {
          ring.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0)`;
        }
        if (dot) {
          dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const onPointerDown = (e: PointerEvent) => {
      isClickingRef.current = true;
      
      if (e.pointerType === 'touch') {
        isTouchActiveRef.current = true;
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
      
      updateVisualStyles();
    };

    const onPointerUp = (e: PointerEvent) => {
      isClickingRef.current = false;
      
      if (e.pointerType === 'touch') {
        isTouchActiveRef.current = false;
        if (ring) ring.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
      }
      
      updateVisualStyles();
    };

    const onPointerCancel = (e: PointerEvent) => {
      isClickingRef.current = false;
      
      if (e.pointerType === 'touch') {
        isTouchActiveRef.current = false;
        if (ring) ring.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
      }
      
      updateVisualStyles();
    };

    // Optimized hover listeners for interactive elements
    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

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
    };

    const onPointerLeaveWindow = () => {
      // Don't fade out touch cursors immediately if a pointer leave occurs on parent layout elements during swipe
      if (!isTouchActiveRef.current) {
        if (ring) ring.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
      }
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
        className="fixed top-0 left-0 w-6 h-6 -ml-3 -mt-3 rounded-full border border-brass/60 bg-transparent pointer-events-none z-[9999] will-change-transform"
        style={{
          opacity: 0,
          scale: 1,
          transition: 'opacity 0.2s ease-out, scale 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out',
        }}
      />

      {/* Precise Core Center Dot */}
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full pointer-events-none z-[9999] bg-ink will-change-transform"
        style={{
          opacity: 0,
          scale: 1,
          transition: 'opacity 0.1s ease-out, scale 0.1s ease-out, background-color 0.1s ease-out',
        }}
      />
    </>
  );
}
