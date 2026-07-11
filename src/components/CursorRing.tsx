import React, { useEffect, useRef, useState } from 'react';

export default function CursorRing() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;

    // Mouse coordinates
    let mouseX = 0;
    let mouseY = 0;

    // Current cursor coordinates (for lerped easing)
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!hasMoved) {
        setHasMoved(true);
      }

      // Instantly position the center dot
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        dot.style.opacity = '1';
      }
      if (ring) {
        ring.style.opacity = '1';
      }
    };

    // Smooth animation loop for the outer ring
    let animationFrameId: number;
    const updatePosition = () => {
      // Linear interpolation (lerp) for smooth lag/trailing effect
      const ease = 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Dynamic hover listeners for interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (isInteractive) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeaveWindow = () => {
      if (ring) ring.style.opacity = '0';
      if (dot) dot.style.opacity = '0';
    };

    const onMouseEnterWindow = () => {
      if (hasMoved) {
        if (ring) ring.style.opacity = '1';
        if (dot) dot.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasMoved]);

  return (
    <>
      {/* Outer Easing Ring */}
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

      {/* Precise Center Dot */}
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
