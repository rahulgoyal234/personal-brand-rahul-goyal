import React, { useEffect, useRef } from 'react';

export default function CursorRing() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isVisible = false;
    let isMouseActive = false;
    let lastTouchTime = 0;
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
      // Debounce touch-emulated mousemove events
      if (Date.now() - lastTouchTime < 1000) {
        return;
      }

      enableCustomCursor();

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '0.5';
      }

      // Directly update dot position using hardware-accelerated translate3d
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    // Ease the ring toward the dot position
    const animate = () => {
      if (isMouseActive) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Event delegation for interactive elements (handles dynamically loaded elements as well!)
    const onMouseOver = (e: MouseEvent) => {
      if (!isMouseActive) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, select, input, textarea, [role="button"], .cursor-pointer, [data-cursor-hover]'
      );

      if (interactive) {
        ring.style.width = '56px';
        ring.style.height = '56px';
        ring.style.borderColor = 'rgba(17, 17, 17, 0.8)'; // Brand color or high contrast
        ring.style.backgroundColor = 'rgba(17, 17, 17, 0.03)';
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1.5)`;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!isMouseActive) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, select, input, textarea, [role="button"], .cursor-pointer, [data-cursor-hover]'
      );

      if (interactive) {
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        if (!relatedTarget || !interactive.contains(relatedTarget)) {
          ring.style.width = '36px';
          ring.style.height = '36px';
          ring.style.borderColor = 'rgba(17, 17, 17, 0.3)';
          ring.style.backgroundColor = 'transparent';
          dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
        }
      }
    };

    // Safely hide cursors on touch screens (hybrid laptops, mobile devices)
    const onTouchStart = () => {
      lastTouchTime = Date.now();
      disableCustomCursor();
    };

    // Window visibility handlers
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
    window.addEventListener('touchstart', onTouchStart, { passive: true });
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
      window.removeEventListener('touchstart', onTouchStart);
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
      {/* Outer wrapper elements with low overhead styles */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#111111] rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 ease-out"
        style={{
          transform: 'translate3d(0,0,0) translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 border border-[#111111] rounded-full pointer-events-none z-[9999] opacity-0 transition-all duration-200 ease-out"
        style={{
          width: '36px',
          height: '36px',
          borderColor: 'rgba(17, 17, 17, 0.3)',
          transform: 'translate3d(0,0,0) translate(-50%, -50%)',
          willChange: 'transform, width, height',
        }}
      />
    </>
  );
}
