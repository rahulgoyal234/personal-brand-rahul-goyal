import React, { useEffect, useRef, useState } from 'react';

export default function CursorRing() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only run if the device supports hover (mouse/desktop users)
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) {
        setIsVisible(true);
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    // Apply cursor: none to body and interactive elements
    const style = document.createElement('style');
    style.innerHTML = `
      @media (hover: hover) {
        body, a, button, select, input, textarea, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Handle hovering on interactive elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const updateHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, [role="button"], .cursor-pointer');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Run initially
    updateHoverListeners();

    // Use a mutation observer to attach listeners to dynamically added elements
    const observer = new MutationObserver(() => {
      updateHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle mouse leaving/entering the window
    const onMouseLeaveWindow = () => {
      setIsVisible(false);
    };
    const onMouseEnterWindow = () => {
      setIsVisible(true);
    };

    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      observer.disconnect();
      
      const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, [role="button"], .cursor-pointer');
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-brand-900 rounded-full pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 border border-brand-900 rounded-full pointer-events-none z-[9999] transition-all duration-200 ease-out"
        style={{
          width: isHovering ? '56px' : '36px',
          height: isHovering ? '56px' : '36px',
          opacity: isVisible ? 0.6 : 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
