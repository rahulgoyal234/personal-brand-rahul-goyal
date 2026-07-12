import React, { useEffect, useRef, useState } from 'react';

export default function CursorRing() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  // Motion positions tracked in refs for ultimate 120Hz/60Hz sub-pixel fluidity
  const mouseCoords = useRef({ x: 0, y: 0 });
  const ringCoords = useRef({ x: 0, y: 0 });

  // Semantic interaction states
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const isTouchRef = useRef(false);
  const isVisibleRef = useRef(false);

  // JS-driven animated scales (resolves CSS-transform conflicts & browser translation lag)
  const scaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  const dotScaleRef = useRef(1);
  const targetDotScaleRef = useRef(1);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;

    // Apply color and aesthetic styling based on visual states without modifying transforms/sizes
    const updateVisualStyles = () => {
      const isHovered = isHoveredRef.current;
      const isClicking = isClickingRef.current;
      const isTouch = isTouchRef.current;
      const isDark = document.documentElement.classList.contains('dark');

      if (ring) {
        if (isHovered) {
          ring.style.borderColor = 'rgba(169, 128, 63, 0.9)'; // Rich Brass
          ring.style.backgroundColor = 'rgba(169, 128, 63, 0.08)'; // Light brass tint
          ring.style.borderWidth = '0.5px';
        } else if (isClicking) {
          ring.style.borderColor = 'rgba(169, 128, 63, 0.95)';
          ring.style.backgroundColor = 'rgba(169, 128, 63, 0.22)'; // Denser tint
          ring.style.borderWidth = '0.75px';
        } else {
          ring.style.borderColor = isTouch 
            ? 'rgba(169, 128, 63, 0.55)' 
            : 'rgba(169, 128, 63, 0.45)';
          ring.style.backgroundColor = 'transparent';
          ring.style.borderWidth = '0.5px';
        }
      }

      if (dot) {
        if (isHovered) {
          dot.style.backgroundColor = 'rgba(169, 128, 63, 0.95)';
        } else if (isClicking) {
          dot.style.backgroundColor = 'rgba(169, 128, 63, 1)';
        } else {
          if (isTouch) {
            dot.style.backgroundColor = 'rgba(169, 128, 63, 0.65)';
          } else {
            // Elegant Ink color depending on active dark theme
            dot.style.backgroundColor = isDark ? '#f5f5f4' : '#1c1917';
          }
        }
      }
    };

    const showCursor = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (ring) ring.style.opacity = '1';
        if (dot) dot.style.opacity = '1';
      }
    };

    const hideCursor = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        if (ring) ring.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
      }
    };

    // Scans element hierarchies on pointer events
    const scanActiveElement = (target: HTMLElement | null) => {
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

        // Dynamic targets for JS animated scales
        if (isInteractive) {
          targetScaleRef.current = 1.5;
          targetDotScaleRef.current = 1.35;
        } else {
          targetScaleRef.current = 1.0;
          targetDotScaleRef.current = 1.0;
        }

        updateVisualStyles();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;

      const isTouch = e.pointerType === 'touch';
      isTouchRef.current = isTouch;

      // Instantly snap starting frame coords on first movement to avoid slide-in from (0,0)
      if (ringCoords.current.x === 0 && ringCoords.current.y === 0) {
        ringCoords.current.x = e.clientX;
        ringCoords.current.y = e.clientY;
      }

      showCursor();
      updateVisualStyles();
      scanActiveElement(e.target as HTMLElement);
    };

    const onPointerDown = (e: PointerEvent) => {
      isClickingRef.current = true;
      const isTouch = e.pointerType === 'touch';
      isTouchRef.current = isTouch;

      targetScaleRef.current = 0.75;
      targetDotScaleRef.current = 0.7;

      if (isTouch) {
        mouseCoords.current.x = e.clientX;
        mouseCoords.current.y = e.clientY;
        ringCoords.current.x = e.clientX;
        ringCoords.current.y = e.clientY;
      }

      showCursor();
      updateVisualStyles();
    };

    const onPointerUp = () => {
      isClickingRef.current = false;
      
      if (isHoveredRef.current) {
        targetScaleRef.current = 1.5;
        targetDotScaleRef.current = 1.35;
      } else {
        targetScaleRef.current = 1.0;
        targetDotScaleRef.current = 1.0;
      }

      updateVisualStyles();

      if (isTouchRef.current) {
        // Soft fade on touch devices
        setTimeout(() => {
          hideCursor();
        }, 150);
      }
    };

    const onPointerCancel = () => {
      isClickingRef.current = false;
      hideCursor();
    };

    const onPointerOver = (e: PointerEvent) => {
      scanActiveElement(e.target as HTMLElement);
    };

    const onPointerLeaveWindow = () => {
      if (!isTouchRef.current) {
        hideCursor();
      }
    };

    const onPointerEnterWindow = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        showCursor();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      isTouchRef.current = true;
      isClickingRef.current = true;
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        mouseCoords.current.x = touch.clientX;
        mouseCoords.current.y = touch.clientY;

        if (ringCoords.current.x === 0 && ringCoords.current.y === 0) {
          ringCoords.current.x = touch.clientX;
          ringCoords.current.y = touch.clientY;
        } else {
          ringCoords.current.x += (touch.clientX - ringCoords.current.x) * 0.45;
          ringCoords.current.y += (touch.clientY - ringCoords.current.y) * 0.45;
        }
      }
      targetScaleRef.current = 0.85;
      targetDotScaleRef.current = 0.75;
      showCursor();
      updateVisualStyles();
    };

    const onTouchMove = (e: TouchEvent) => {
      isTouchRef.current = true;
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        mouseCoords.current.x = touch.clientX;
        mouseCoords.current.y = touch.clientY;
        showCursor();
        updateVisualStyles();

        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        scanActiveElement(element as HTMLElement);
      }
    };

    const onTouchEnd = () => {
      isClickingRef.current = false;
      targetScaleRef.current = 1.0;
      targetDotScaleRef.current = 1.0;
      updateVisualStyles();

      setTimeout(() => {
        hideCursor();
      }, 250);
    };

    const onTouchCancel = () => {
      isClickingRef.current = false;
      hideCursor();
    };

    // Keep state updated when themes toggled manually
    const observer = new MutationObserver(() => {
      updateVisualStyles();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Smooth update animation frame loop
    let animationFrameId: number;
    const updateLoop = () => {
      // Lag-easing values:
      // Touch is snappier; Hover has faster response so it adheres perfectly to targeted elements
      const ease = isTouchRef.current 
        ? 0.35 
        : (isHoveredRef.current ? 0.32 : 0.18);

      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;

      ringCoords.current.x += (targetX - ringCoords.current.x) * ease;
      ringCoords.current.y += (targetY - ringCoords.current.y) * ease;

      // Smooth step scaling
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.22;
      dotScaleRef.current += (targetDotScaleRef.current - dotScaleRef.current) * 0.22;

      // Absolute positioning via centering translates
      if (ring) {
        ring.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0) translate(-50%, -50%) scale(${scaleRef.current})`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${dotScaleRef.current})`;
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    // Attach passive events for maximum performance
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });
    document.addEventListener('pointerleave', onPointerLeaveWindow, { passive: true });
    document.addEventListener('pointerenter', onPointerEnterWindow, { passive: true });

    // Spawn draw loop
    animationFrameId = requestAnimationFrame(updateLoop);
    updateVisualStyles();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
      document.removeEventListener('pointerleave', onPointerLeaveWindow);
      document.removeEventListener('pointerenter', onPointerEnterWindow);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Outer Easing Trailing Ring - Rendered across all devices */}
      <div
        ref={ringRef}
        id="custom-cursor-ring"
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-[0.5px] border-brass/45 bg-transparent pointer-events-none z-[9999] will-change-transform"
        style={{
          opacity: 0,
          borderWidth: '0.5px',
          transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease-out, background-color 0.2s ease-out, border-width 0.2s ease-out',
        }}
      />

      {/* Precise Core Center Dot - Rendered across all devices */}
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] bg-stone-900 dark:bg-stone-100 will-change-transform"
        style={{
          opacity: 0,
          transition: 'opacity 0.15s ease-out, background-color 0.15s ease-out',
        }}
      />
    </>
  );
}
