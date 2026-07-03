import React, { useEffect, useRef, useState } from 'react';

export default function CursorRing() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on devices that support hover/fine pointer
    const mediaQuery = window.matchMedia('(hover: hover)');
    setHasHover(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setHasHover(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!hasHover) return;

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
    let isMouseActive = false;
    let animationFrameId: number;

    const enableCustomCursor = () => {
      if (isMouseActive) return;
      isMouseActive = true;
      document.body.classList.add('has-custom-cursor');
      dot.style.display = 'block';
      ring.style.display = 'block';
    };

    const disableCustomCursor = () => {
      if (!isMouseActive) return;
      isMouseActive = false;
      document.body.classList.remove('has-custom-cursor');
      dot.style.display = 'none';
      ring.style.display = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      enableCustomCursor();

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        dot.style.opacity = '1';
        ring.style.opacity = '0.5';
      }
    };

    // Ease the ring and dot toward the coordinates smoothly, fully hardware-accelerated via scale transform
    const animate = () => {
      if (isMouseActive) {
        // Snappy follow for the main dot indicator
        dotX += (mouseX - dotX) * 0.45;
        dotY += (mouseY - dotY) * 0.45;

        // Beautiful smooth trailing for the outer ring follower
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        // Smooth spring interpolation for scale
        currentDotScale += (targetDotScale - currentDotScale) * 0.2;
        currentRingScale += (targetRingScale - currentRingScale) * 0.2;

        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${currentDotScale})`;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${currentRingScale})`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const checkInteractiveElement = (x: number, y: number) => {
      const target = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, select, input, textarea, [role="button"], .cursor-pointer, [data-cursor-hover]'
      );

      if (interactive) {
        targetRingScale = 1.55; // Scales default 36px to ~56px
        targetDotScale = 1.5;
        ring.style.borderColor = 'rgba(17, 17, 17, 0.8)';
        ring.style.backgroundColor = 'rgba(17, 17, 17, 0.05)';
      } else {
        targetRingScale = 1.0;  // Scales to standard 36px
        targetDotScale = 1.0;
        ring.style.borderColor = 'rgba(17, 17, 17, 0.3)';
        ring.style.backgroundColor = 'transparent';
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      if (!isMouseActive) return;
      checkInteractiveElement(e.clientX, e.clientY);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!isMouseActive) return;
      const target = e.relatedTarget as HTMLElement | null;
      if (target) {
        checkInteractiveElement(e.clientX, e.clientY);
      } else {
        targetRingScale = 1.0;
        targetDotScale = 1.0;
        ring.style.borderColor = 'rgba(17, 17, 17, 0.3)';
        ring.style.backgroundColor = 'transparent';
      }
    };

    const onMouseLeaveWindow = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onMouseEnterWindow = () => {
      if (!isMouseActive) return;
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '0.5';
    };

    // Event listeners
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    animationFrameId = requestAnimationFrame(animate);

    // Style injection to hide the default browser cursor, strictly scoped to fine-pointer hover devices when active
    const style = document.createElement('style');
    style.innerHTML = `
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
    `;
    document.head.appendChild(style);

    // Initial state: hidden until real mouse activity is detected
    dot.style.display = 'none';
    ring.style.display = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      cancelAnimationFrame(animationFrameId);
      
      document.body.classList.remove('has-custom-cursor');
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [hasHover]);

  if (!hasHover) return null;

  return (
    <>
      {/* Outer wrapper elements with low overhead styles */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#111111] rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 ease-out"
        style={{
          transform: 'translate3d(0,0,0) translate(-50%, -50%) scale(1)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 border border-[#111111] rounded-full pointer-events-none z-[9999] opacity-0 transition-[opacity,background-color,border-color] duration-300 ease-out"
        style={{
          width: '36px',
          height: '36px',
          borderColor: 'rgba(17, 17, 17, 0.3)',
          transform: 'translate3d(0,0,0) translate(-50%, -50%) scale(1)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
