import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate 3D points
    const points: Point3D[] = [];
    const numPoints = 85;
    const range = 280;

    for (let i = 0; i < numPoints; i++) {
      const x = (Math.random() - 0.5) * range * 2.2;
      const y = (Math.random() - 0.5) * range * 1.8;
      const z = (Math.random() - 0.5) * range * 2;
      
      // Some nodes are warm brass/gold, others are deep ink
      const isBrass = Math.random() > 0.4;
      const color = isBrass ? '169, 128, 63' : '18, 33, 58';
      const size = Math.random() * 2 + 1.2;

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color,
        size,
      });
    }

    const focalLength = 350;
    let angleX = 0.0006; // Slow constant rotation
    let angleY = 0.0008;

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse positions to [-0.5, 0.5]
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    // Track scroll position for vertical translation
    const handleScroll = () => {
      scrollRef.current.target = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      // Clear with a very slight trailing transparency for elegant motion blur
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate mouse target values
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Smoothly interpolate scroll
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.08;

      // Calculate dynamic rotation based on constant drift + mouse control
      const currentAngleY = angleY + mouseRef.current.x * 0.012;
      const currentAngleX = angleX + mouseRef.current.y * 0.012;

      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);

      // Project and draw connections first (behind nodes)
      const projected: { sx: number; sy: number; sz: number; color: string; size: number; zDepth: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // 3D Rotation on Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // 3D Rotation on X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Update the point position dynamically so rotation accumulates
        p.x = x1;
        p.y = y2;
        p.z = z2;

        // Perspective projection calculation
        const zDepth = z2 + focalLength;
        if (zDepth > 0) {
          const scale = focalLength / zDepth;
          // Apply mouse perspective shift and scroll parallax offset
          const scrollParallax = -scrollRef.current.current * 0.12 * scale;
          const sx = x1 * scale + width / 2 + mouseRef.current.x * 40 * scale;
          const sy = y2 * scale + height / 2 + scrollParallax + mouseRef.current.y * 40 * scale;

          projected.push({
            sx,
            sy,
            sz: z2,
            color: p.color,
            size: p.size * scale,
            zDepth,
          });
        } else {
          projected.push({ sx: -9999, sy: -9999, sz: 0, color: p.color, size: 0, zDepth: 0 });
        }
      }

      // Draw Connections (Geometric Web Lattice)
      ctx.lineWidth = 0.55;
      const maxDistance = 145; // Maximum pixel distance in 2D to link nodes

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.sx === -9999) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (p2.sx === -9999) continue;

          // Compute distance in 2D space
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Farther lines are thinner/more transparent
            const alpha = (1 - dist / maxDistance) * 0.13 * (Math.min(p1.zDepth, p2.zDepth) / focalLength);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            
            // Link color uses a blend of ink and brass based on depth
            const lineColor = p1.color === '169, 128, 63' ? '169, 128, 63' : '18, 33, 58';
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (p.sx === -9999) continue;

        // Alpha based on depth z depth to create deep 3D stereoscopic feel
        const alpha = Math.max(0.15, Math.min(0.9, (p.sz + range) / (range * 2)));
        
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();

        // Draw dynamic accent glow on select brass nodes
        if (p.color === '169, 128, 63' && i % 4 === 0) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.18})`;
          ctx.fill();
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none print:hidden"
      style={{ opacity: 0.85 }}
    />
  );
}
