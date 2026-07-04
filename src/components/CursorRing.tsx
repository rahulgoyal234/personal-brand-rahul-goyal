import React, { useEffect, useRef } from 'react';

export default function CursorRing() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Completely disable custom cursor on touch/mobile devices to avoid physical tap conflicts or hijacking
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 
                          'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    let currentDotScale = 1;
    let targetDotScale = 1;
    let currentRingScale = 1;
    let targetRingScale = 1;

    let isVisible = false;
    let isCursorActive = false;
    let isMouseDown = false;
    let animationFrameId: number;
    let lastInputTime = 0;
    let isTouch = false;

    const enableCustomCursor = () => {
      if (isCursorActive) return;
      isCursorActive = true;
      document.body.classList.add('has-custom-cursor');
      dot.style.display = 'block';
      ring.style.display = 'block';
    };

    const showCursor = () => {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const hideCursor = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const updateCoordinates = (x: number, y: number) => {
      mouseX = x;
      mouseY = y;

      if (!isVisible) {
        showCursor();
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      // Prevent mouse coordinates if we recently got a touch event (to avoid duplicate handling)
      if (Date.now() - lastInputTime < 1000 && isTouch) return;
      
      isTouch = false;
      enableCustomCursor();
      updateCoordinates(e.clientX, e.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      isTouch = true;
      lastInputTime = Date.now();
      enableCustomCursor();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCoordinates(touch.clientX, touch.clientY);
        checkInteractiveElement(touch.clientX, touch.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      isTouch = true;
      lastInputTime = Date.now();
      enableCustomCursor();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCoordinates(touch.clientX, touch.clientY);
        checkInteractiveElement(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = () => {
      isTouch = true;
      lastInputTime = Date.now();
      targetRingScale = 1.0;
      targetDotScale = 1.0;
      ring.style.borderColor = 'rgba(255, 255, 255, 0.45)';
      ring.style.backgroundColor = 'transparent';
      hideCursor();
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = (e: MouseEvent) => {
      isMouseDown = false;
      if (isCursorActive) {
        checkInteractiveElement(e.clientX, e.clientY);
      }
    };

    const animate = () => {
      if (isCursorActive && isVisible) {
        // Snappy follow for the main dot indicator
        dotX += (mouseX - dotX) * 0.45;
        dotY += (mouseY - dotY) * 0.45;

        // Beautiful smooth trailing for the outer ring follower
        const rx = mouseX - ringX;
        const ry = mouseY - ringY;
        ringX += rx * 0.18;
        ringY += ry * 0.18;

        // Dynamic scale modifications based on mouse click state
        let currentTargetRingScale = targetRingScale;
        let currentTargetDotScale = targetDotScale;

        if (isMouseDown) {
          currentTargetRingScale = 0.55;
          currentTargetDotScale = 1.5;
        }

        // Smooth spring interpolation for scale
        currentDotScale += (currentTargetDotScale - currentDotScale) * 0.25;
        currentRingScale += (currentTargetRingScale - currentRingScale) * 0.25;

        // Calculate velocity-based stretching for a fluid organic feel
        const distance = Math.sqrt(rx * rx + ry * ry);
        const maxStretch = 0.45;
        // Skip stretch when clicked so it feels completely solid and snappy
        const stretch = isMouseDown ? 0 : Math.min(distance * 0.006, maxStretch);
        const angle = Math.atan2(ry, rx);

        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${currentDotScale})`;
        
        if (stretch > 0.01) {
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${currentRingScale + stretch}, ${currentRingScale - stretch * 0.35})`;
        } else {
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${currentRingScale})`;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const checkInteractiveElement = (x: number, y: number) => {
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return;
      try {
        const target = document.elementFromPoint(x, y) as HTMLElement | null;
        if (!target) return;

        const interactive = target.closest(
          'a, button, select, input, textarea, [role="button"], .cursor-pointer, [data-cursor-hover]'
        );

        if (interactive) {
          targetRingScale = 1.6;
          targetDotScale = 0.3; // Shrink inner dot to let the outer framing ring serve as the interactive target lens
          ring.style.borderColor = 'rgba(255, 255, 255, 0.9)';
          ring.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        } else {
          targetRingScale = 1.0;
          targetDotScale = 1.0;
          ring.style.borderColor = 'rgba(255, 255, 255, 0.45)';
          ring.style.backgroundColor = 'transparent';
        }
      } catch (err) {
        // Safe fallback
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      if (!isCursorActive) return;
      checkInteractiveElement(e.clientX, e.clientY);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!isCursorActive) return;
      const target = e.relatedTarget as HTMLElement | null;
      if (target) {
        checkInteractiveElement(e.clientX, e.clientY);
      } else {
        targetRingScale = 1.0;
        targetDotScale = 1.0;
        ring.style.borderColor = 'rgba(255, 255, 255, 0.45)';
        ring.style.backgroundColor = 'transparent';
      }
    };

    const onMouseLeaveWindow = () => {
      hideCursor();
    };

    const onMouseEnterWindow = () => {
      if (!isCursorActive) return;
      showCursor();
    };

    // Event listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    animationFrameId = requestAnimationFrame(animate);

    // Style injection to hide the default browser cursor, strictly scoped to devices where custom cursor is active
    const style = document.createElement('style');
    style.innerHTML = `
      @media (hover: hover) {
        .has-custom-cursor,
        .has-custom-cursor a,
        .has-custom-cursor button,
        .has-custom-cursor select,
        .has-custom-cursor input,
        .has-custom-cursor textarea,
        .has-custom-cursor [role="button"],
        .has-custom-cursor .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Initial state: hidden until interaction is detected
    dot.style.display = 'none';
    ring.style.display = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      cancelAnimationFrame(animationFrameId);
      
      document.body.classList.remove('has-custom-cursor');
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference opacity-0 transition-opacity duration-300 ease-out"
        style={{
          transform: 'translate3d(0,0,0) translate(-50%, -50%) scale(1)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference opacity-0 transition-[opacity,background-color,border-color] duration-300 ease-out"
        style={{
          width: '32px',
          height: '32px',
          borderColor: 'rgba(255, 255, 255, 0.45)',
          transform: 'translate3d(0,0,0) translate(-50%, -50%) scale(1)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
