import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate 3D points once with a stable seed to ensure consistency on resize
    const points: Point3D[] = [];
    const numPoints = 85;
    const range = 280;

    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < numPoints; i++) {
      const x = (random() - 0.5) * range * 2.2;
      const y = (random() - 0.5) * range * 1.8;
      const z = (random() - 0.5) * range * 2;
      
      const isBrass = random() > 0.4;
      const color = isBrass ? '169, 128, 63' : '18, 33, 58';
      const size = random() * 2 + 1.2;

      points.push({ x, y, z, color, size });
    }

    const draw = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      ctx.clearRect(0, 0, width, height);

      const focalLength = 350;
      const projected: { sx: number; sy: number; sz: number; color: string; size: number; zDepth: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Apply a static rotation so it looks nice and dimensional
        const staticAngleY = 0.4;
        const staticAngleX = 0.2;
        const cosY = Math.cos(staticAngleY);
        const sinY = Math.sin(staticAngleY);
        const cosX = Math.cos(staticAngleX);
        const sinX = Math.sin(staticAngleX);

        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        const zDepth = z2 + focalLength;
        if (zDepth > 0) {
          const scale = focalLength / zDepth;
          const sx = x1 * scale + width / 2;
          const sy = y2 * scale + height / 2;

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
      const maxDistance = 145;

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.sx === -9999) continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (p2.sx === -9999) continue;

          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.13 * (Math.min(p1.zDepth, p2.zDepth) / focalLength);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            
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

        const alpha = Math.max(0.15, Math.min(0.9, (p.sz + range) / (range * 2)));
        
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();

        if (p.color === '169, 128, 63' && i % 4 === 0) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.18})`;
          ctx.fill();
        }
      }
    };

    draw();

    window.addEventListener('resize', draw);
    return () => {
      window.removeEventListener('resize', draw);
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
