import React, { useEffect, useRef } from 'react';

export default function CursorRing() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  // Motion positions tracked in refs for ultimate 120Hz/60Hz sub-pixel fluidity
  const mouseCoords = useRef({ x: -100, y: -100 });
  const ringCoords = useRef({ x: -100, y: -100 });

  // Semantic interaction states
  const isHoveredRef = useRef(false);
  const isClickingRef = useRef(false);
  const isTouchRef = useRef(false);
  const isVisibleRef = useRef(false);

  // JS-driven animated scales
  const scaleRef = useRef(1);
  const targetScaleRef = useRef(1);

  const dotScaleRef = useRef(1);
  const targetDotScaleRef = useRef(1);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;

    // Apply color and aesthetic styling based on visual states
    const updateVisualStyles = () => {
      const isHovered = isHoveredRef.current;
      const isClicking = isClickingRef.current;
      const isTouch = isTouchRef.current;
      const isDark = document.documentElement.classList.contains('dark');

      if (ring) {
        if (isHovered) {
          ring.style.borderColor = 'rgba(169, 128, 63, 0.9)'; // Rich Brass
          ring.style.backgroundColor = 'rgba(169, 128, 63, 0.12)'; // Light brass tint
          ring.style.borderWidth = '1px';
        } else if (isClicking) {
          ring.style.borderColor = 'rgba(169, 128, 63, 0.95)';
          ring.style.backgroundColor = 'rgba(169, 128, 63, 0.25)'; // Denser tint
          ring.style.borderWidth = '1.5px';
        } else {
          ring.style.borderColor = isTouch 
            ? 'rgba(169, 128, 63, 0.75)' 
            : 'rgba(169, 128, 63, 0.5)';
          ring.style.backgroundColor = 'rgba(169, 128, 63, 0.05)';
          ring.style.borderWidth = '1px';
        }
      }

      if (dot) {
        if (isHovered) {
          dot.style.backgroundColor = 'rgba(169, 128, 63, 0.95)';
        } else if (isClicking) {
          dot.style.backgroundColor = 'rgba(169, 128, 63, 1)';
        } else {
          if (isTouch) {
            dot.style.backgroundColor = 'rgba(169, 128, 63, 0.85)';
          } else {
            dot.style.backgroundColor = isDark ? '#f5f5f4' : '#12213A';
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

    // Scans element hierarchies on pointer / touch
    const scanActiveElement = (target: HTMLElement | null) => {
      if (!target) {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          targetScaleRef.current = 1.0;
          targetDotScaleRef.current = 1.0;
          updateVisualStyles();
        }
        return;
      }

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

        if (isInteractive) {
          targetScaleRef.current = 1.5;
          targetDotScaleRef.current = 1.35;
        } else {
          targetScaleRef.current = isClickingRef.current ? 0.85 : 1.0;
          targetDotScaleRef.current = isClickingRef.current ? 0.8 : 1.0;
        }

        updateVisualStyles();
      }
    };

    let touchFadeTimeout: number | null = null;

    // Helper to process input location across mouse, pen, or touch
    const handleLocation = (x: number, y: number, isTouchType: boolean, targetElement?: HTMLElement | null) => {
      isTouchRef.current = isTouchType;

      // Snap ring coordinates if offscreen/first interaction to avoid sliding from corner
      if (mouseCoords.current.x < 0 || ringCoords.current.x < 0) {
        ringCoords.current.x = x;
        ringCoords.current.y = y;
      }

      mouseCoords.current.x = x;
      mouseCoords.current.y = y;

      showCursor();
      updateVisualStyles();

      if (targetElement) {
        scanActiveElement(targetElement);
      } else {
        const el = document.elementFromPoint(x, y);
        scanActiveElement(el as HTMLElement);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const isTouch = e.pointerType === 'touch';
      handleLocation(e.clientX, e.clientY, isTouch, e.target as HTMLElement);
    };

    const onPointerDown = (e: PointerEvent) => {
      const isTouch = e.pointerType === 'touch';
      isTouchRef.current = isTouch;
      isClickingRef.current = true;

      if (touchFadeTimeout) {
        clearTimeout(touchFadeTimeout);
        touchFadeTimeout = null;
      }

      handleLocation(e.clientX, e.clientY, isTouch, e.target as HTMLElement);

      targetScaleRef.current = 0.75;
      targetDotScaleRef.current = 0.7;
      updateVisualStyles();
    };

    const onPointerUp = (e: PointerEvent) => {
      const isTouch = e.pointerType === 'touch';
      isClickingRef.current = false;
      
      if (isHoveredRef.current) {
        targetScaleRef.current = 1.5;
        targetDotScaleRef.current = 1.35;
      } else {
        targetScaleRef.current = 1.0;
        targetDotScaleRef.current = 1.0;
      }

      updateVisualStyles();

      if (isTouch) {
        touchFadeTimeout = window.setTimeout(() => {
          if (!isClickingRef.current) {
            hideCursor();
          }
        }, 750);
      }
    };

    const onPointerCancel = () => {
      isClickingRef.current = false;
      hideCursor();
    };

    const onPointerLeaveWindow = () => {
      if (!isTouchRef.current) {
        hideCursor();
      }
    };

    const onPointerEnterWindow = (e: PointerEvent) => {
      const isTouch = e.pointerType === 'touch';
      if (!isTouch) {
        isTouchRef.current = false;
        showCursor();
      }
    };

    // Touch event handlers for seamless touch/drag on mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        isTouchRef.current = true;
        isClickingRef.current = true;

        if (touchFadeTimeout) {
          clearTimeout(touchFadeTimeout);
          touchFadeTimeout = null;
        }

        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        handleLocation(touch.clientX, touch.clientY, true, el as HTMLElement);

        targetScaleRef.current = 1.35;
        targetDotScaleRef.current = 0.85;
        updateVisualStyles();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        handleLocation(touch.clientX, touch.clientY, true, el as HTMLElement);
      }
    };

    const onTouchEnd = () => {
      isClickingRef.current = false;
      targetScaleRef.current = 1.0;
      targetDotScaleRef.current = 1.0;
      updateVisualStyles();

      if (touchFadeTimeout) clearTimeout(touchFadeTimeout);
      touchFadeTimeout = window.setTimeout(() => {
        if (!isClickingRef.current) {
          hideCursor();
        }
      }, 750);
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
      // Snappier lag-easing value on touch to track finger without lagging far behind
      const ease = isTouchRef.current 
        ? 0.45 
        : (isHoveredRef.current ? 0.35 : 0.22);

      const targetX = mouseCoords.current.x;
      const targetY = mouseCoords.current.y;

      if (targetX >= 0 && targetY >= 0) {
        ringCoords.current.x += (targetX - ringCoords.current.x) * ease;
        ringCoords.current.y += (targetY - ringCoords.current.y) * ease;

        // Smooth step scaling
        scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.25;
        dotScaleRef.current += (targetDotScaleRef.current - dotScaleRef.current) * 0.25;

        // Absolute hardware-accelerated positioning via translate3d
        if (ring) {
          ring.style.transform = `translate3d(${ringCoords.current.x}px, ${ringCoords.current.y}px, 0) translate(-50%, -50%) scale(${scaleRef.current})`;
        }
        if (dot) {
          dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${dotScaleRef.current})`;
        }
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    // Attach passive events for maximum performance & 60-120fps mobile scrolling
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });
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
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
      document.removeEventListener('pointerleave', onPointerLeaveWindow);
      document.removeEventListener('pointerenter', onPointerEnterWindow);
      if (touchFadeTimeout) clearTimeout(touchFadeTimeout);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Outer Easing Trailing Ring */}
      <div
        ref={ringRef}
        id="custom-cursor-ring"
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-[1px] border-brass/50 bg-transparent pointer-events-none z-[9999] will-change-transform"
        style={{
          opacity: 0,
          transition: 'opacity 0.25s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out, border-width 0.2s ease-out',
        }}
      />

      {/* Precise Core Center Dot */}
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] bg-ink dark:bg-stone-100 will-change-transform"
        style={{
          opacity: 0,
          transition: 'opacity 0.2s ease-out, background-color 0.15s ease-out',
        }}
      />
    </>
  );
}

