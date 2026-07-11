import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CursorRing() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Outer fluid trail spring (relaxed and organic)
  const outerSpringConfig = { damping: 30, stiffness: 180, mass: 0.8 };
  // Middle prompt spring (fast and crisp)
  const middleSpringConfig = { damping: 20, stiffness: 300, mass: 0.4 };

  const outerXSpring = useSpring(cursorX, outerSpringConfig);
  const outerYSpring = useSpring(cursorY, outerSpringConfig);

  const middleXSpring = useSpring(cursorX, middleSpringConfig);
  const middleYSpring = useSpring(cursorY, middleSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev, newRipple].slice(-4)); // keep last 4 ripples
    };

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-interactive="true"]'
      );
      
      const onMouseEnter = () => setIsHovered(true);
      const onMouseLeave = () => setIsHovered(false);

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    let cleanupHover = addHoverListeners();
    
    const observer = new MutationObserver(() => {
      cleanupHover();
      cleanupHover = addHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cleanupHover();
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  // Clean up finished ripples after animation duration
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => Date.now() - r.id < 800));
    }, 850);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Click Ripple / Expansion Waves */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed top-0 left-0 w-12 h-12 rounded-full border border-brass pointer-events-none z-50 pointer-events-none"
            style={{
              x: ripple.x,
              y: ripple.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Outer organic fluid ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-brass/35 pointer-events-none z-50 hidden sm:block"
        style={{
          x: outerXSpring,
          y: outerYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          borderColor: isHovered ? 'rgba(169, 128, 63, 0.8)' : 'rgba(169, 128, 63, 0.35)',
          borderWidth: isHovered ? '1.5px' : '1px',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.25 }}
      />

      {/* Middle targeted sharp reticle */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-ink/40 pointer-events-none z-50 mix-blend-difference hidden sm:block"
        style={{
          x: middleXSpring,
          y: middleYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.9 : 1,
          rotate: isHovered ? 90 : 0,
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.25)',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 120 }}
      >
        {/* Subtle crosshair ticks visible only on hover */}
        {isHovered && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-white/70" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-white/70" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-1.5 bg-white/70" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-1.5 bg-white/70" />
          </>
        )}
      </motion.div>

      {/* Center core dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-brass pointer-events-none z-50 hidden sm:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 0.3 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
      />
    </>
  );
}

