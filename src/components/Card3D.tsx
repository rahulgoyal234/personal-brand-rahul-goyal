import React, { useRef, useState, useCallback } from 'react';

interface Card3DProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  id?: string;
  intensity?: number;
  glareOpacity?: number;
  depth?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card3D({
  children,
  className = '',
  id,
  intensity = 15,
  glareOpacity = 0.15,
  depth = 20,
  onClick,
  style = {},
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotX = ((y - centerY) / centerY) * -intensity;
    const rotY = ((x - centerX) / centerX) * intensity;
    
    setRotateX(rotX);
    setRotateY(rotY);
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: glareOpacity });
  }, [intensity, glareOpacity]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${depth}px)`
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        ...style,
      }}
    >
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
        
        {/* Dynamic 3D Specular Glare Reflection */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-30"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45), rgba(158, 123, 59, 0.15) 40%, transparent 80%)`,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
    </div>
  );
}
