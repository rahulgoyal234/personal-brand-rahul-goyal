import React, { useEffect, useRef, useState } from 'react';

interface RibbonPoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  angleX: number;
  angleY: number;
  speedX: number;
  speedY: number;
  waveAmplitude: number;
  currentDisplacementX: number;
  currentDisplacementY: number;
}

interface Ribbon {
  points: RibbonPoint[];
  color: string;
  glowColor: string;
  width: number;
  phaseOffset: number;
  speed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  strength: number;
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse state tracking
    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      radius: 240,
    };

    // Active ripples generated on page clicks
    let ripples: Ripple[] = [];

    // Colors that mesh beautifully with both the brass (#A9803F) and soft paper backgrounds
    const colors = [
      { color: '169, 128, 63', glow: 'rgba(169, 128, 63, 0.4)' }, // Elegant Brass
      { color: '13, 148, 136', glow: 'rgba(13, 148, 136, 0.35)' }, // Deep Teal
      { color: '124, 58, 237', glow: 'rgba(124, 58, 237, 0.3)' },  // Electric Violet
      { color: '219, 39, 119', glow: 'rgba(219, 39, 119, 0.3)' },  // Sunset Rose
      { color: '6, 182, 212', glow: 'rgba(6, 182, 212, 0.4)' },    // Cyan Blue
      { color: '249, 115, 22', glow: 'rgba(249, 115, 22, 0.3)' },   // Warm Amber
    ];

    // Initialize Ribbons spanning horizontally across different heights
    let ribbons: Ribbon[] = [];
    const numRibbons = 5;
    const pointsPerRibbon = 18;

    const initRibbons = () => {
      ribbons = [];
      const segmentWidth = width / (pointsPerRibbon - 1);

      for (let r = 0; r < numRibbons; r++) {
        const points: RibbonPoint[] = [];
        const targetY = height * (0.15 + (r * 0.17)); // Space them nicely vertically
        const theme = colors[r % colors.length];

        for (let p = 0; p < pointsPerRibbon; p++) {
          const x = p * segmentWidth;
          points.push({
            x,
            y: targetY,
            baseX: x,
            baseY: targetY,
            angleX: p * 0.4 + r * 1.5,
            angleY: p * 0.5 + r * 2.1,
            speedX: 0.015 + Math.sin(r + p) * 0.005,
            speedY: 0.01 + Math.cos(r * p) * 0.005,
            waveAmplitude: 25 + Math.sin(r) * 15,
            currentDisplacementX: 0,
            currentDisplacementY: 0,
          });
        }

        ribbons.push({
          points,
          color: theme.color,
          glowColor: theme.glow,
          width: 0.55 + (r % 3) * 0.12, // Fine linings: ultra-thin precise paths
          phaseOffset: r * Math.PI * 0.3,
          speed: 0.8 + r * 0.1,
        });
      }
    };

    // Initialize decorative floating particles
    let particles: Particle[] = [];
    const numParticles = 35;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        const theme = colors[i % colors.length];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: 1.5 + Math.random() * 2,
          color: theme.color,
          glowColor: theme.glow,
          alpha: 0.15 + Math.random() * 0.35,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Seed data
    initRibbons();
    initParticles();

    // Event Listeners for Interaction
    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // Clicking spawns dynamic ripples
    const handlePointerDown = (e: PointerEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.65,
        speed: 7.5,
        strength: 55,
      });

      // Keep array size optimized
      if (ripples.length > 5) {
        ripples.shift();
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initRibbons();
      initParticles();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Tick
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and Draw active Click Ripples
      ripples.forEach((ripple, rIdx) => {
        ripple.radius += ripple.speed;
        
        // Draw very subtle expanding color rings for click feedback
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        const alpha = Math.max(0, 0.045 * (1 - ripple.radius / ripple.maxRadius));
        ctx.strokeStyle = `rgba(169, 128, 63, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (ripple.radius >= ripple.maxRadius) {
          ripples.splice(rIdx, 1);
        }
      });

      // Update Ribbon Points and physical simulation (Waving + Mouse Gravity + Ripple shockwaves)
      ribbons.forEach((ribbon) => {
        ribbon.points.forEach((point) => {
          // Update waving angles
          point.angleX += point.speedX;
          point.angleY += point.speedY;

          // Natural dynamic waving offsets
          const waveX = Math.sin(point.angleX) * (point.waveAmplitude * 0.25);
          const waveY = Math.cos(point.angleY) * point.waveAmplitude;

          // Calculate displacement from mouse attraction/gravity
          let mouseDispX = 0;
          let mouseDispY = 0;

          if (mouse.active) {
            const dx = mouse.x - point.baseX;
            const dy = mouse.y - point.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius; // 0 to 1
              // Smoothly attract lines, but bend them elegantly
              const strength = 60 * Math.sin(force * Math.PI * 0.5);
              mouseDispX = (dx / (dist || 1)) * strength;
              mouseDispY = (dy / (dist || 1)) * strength;
            }
          }

          // Calculate displacement from Click Ripples
          let rippleDispX = 0;
          let rippleDispY = 0;

          ripples.forEach((ripple) => {
            const dx = point.baseX - ripple.x;
            const dy = point.baseY - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // If close to the ripple ring edge
            const rippleWidth = 140;
            const distFromRing = Math.abs(dist - ripple.radius);

            if (distFromRing < rippleWidth) {
              const force = Math.sin((1 - distFromRing / rippleWidth) * Math.PI);
              const strength = ripple.strength * force * (1 - ripple.radius / ripple.maxRadius);
              rippleDispX += (dx / (dist || 1)) * strength;
              rippleDispY += (dy / (dist || 1)) * strength;
            }
          });

          // Target coordinate with all displacements added
          const targetX = point.baseX + waveX + mouseDispX + rippleDispX;
          const targetY = point.baseY + waveY + mouseDispY + rippleDispY;

          // Smooth elastic transition to target coordinates (tight spring interpolation)
          point.x += (targetX - point.x) * 0.085;
          point.y += (targetY - point.y) * 0.085;
        });

        // Draw Ribbon strands with smooth continuous Bezier curves
        ctx.beginPath();
        
        // Use double-pass lines to simulate complex glowing neon threads elegantly
        // 1. Draw glowing background shadow overlay
        ctx.lineWidth = ribbon.width * 2.8;
        ctx.strokeStyle = ribbon.glowColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.moveTo(ribbon.points[0].x, ribbon.points[0].y);
        for (let i = 0; i < ribbon.points.length - 1; i++) {
          const xc = (ribbon.points[i].x + ribbon.points[i + 1].x) / 2;
          const yc = (ribbon.points[i].y + ribbon.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(ribbon.points[i].x, ribbon.points[i].y, xc, yc);
        }
        ctx.stroke();

        // 2. Draw core sharp foreground line
        ctx.beginPath();
        ctx.lineWidth = ribbon.width;
        
        // Draw subtle brass-themed gradient transitions across the screen width
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${ribbon.color}, 0.05)`);
        gradient.addColorStop(0.3, `rgba(${ribbon.color}, 0.22)`);
        gradient.addColorStop(0.5, `rgba(${ribbon.color}, 0.28)`);
        gradient.addColorStop(0.7, `rgba(${ribbon.color}, 0.22)`);
        gradient.addColorStop(1, `rgba(${ribbon.color}, 0.05)`);

        ctx.strokeStyle = gradient;
        ctx.moveTo(ribbon.points[0].x, ribbon.points[0].y);
        
        for (let i = 0; i < ribbon.points.length - 1; i++) {
          const xc = (ribbon.points[i].x + ribbon.points[i + 1].x) / 2;
          const yc = (ribbon.points[i].y + ribbon.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(ribbon.points[i].x, ribbon.points[i].y, xc, yc);
        }
        ctx.stroke();
      });

      // Update and Draw floating energy particles with linking constellation lines
      particles.forEach((p, pIdx) => {
        // Apply wind drift / gentle float physics
        p.x += p.vx;
        p.y += p.vy;

        // Pulse the brightness organically over time
        p.pulsePhase += p.pulseSpeed;
        const pulseAlpha = p.alpha * (0.65 + Math.sin(p.pulsePhase) * 0.35);

        // Simple mouse repulsion for floating particles
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            p.x += (dx / (dist || 1)) * force * 1.5;
            p.y += (dy / (dist || 1)) * force * 1.5;
          }
        }

        // Boundary safety check with smooth warp wraps
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render delicate light dust
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${pulseAlpha})`;
        ctx.fill();

        // Constellation: Draw glowing web lines between nearby particles
        for (let j = pIdx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const webAlpha = (1 - dist / 100) * 0.08 * Math.min(pulseAlpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color}, ${webAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }

        // Connect particles to nearest ribbon strand point to merge elements beautifully
        ribbons.forEach((ribbon) => {
          ribbon.points.forEach((pt) => {
            const dx = p.x - pt.x;
            const dy = p.y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              const linkAlpha = (1 - dist / 85) * 0.045 * pulseAlpha;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pt.x, pt.y);
              ctx.strokeStyle = `rgba(${ribbon.color}, ${linkAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      });

      // Pointer Constellation: Connect pointer to nearest points for high tactility
      if (mouse.active) {
        ribbons.forEach((ribbon) => {
          ribbon.points.forEach((pt) => {
            const dx = mouse.x - pt.x;
            const dy = mouse.y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 135) {
              const activeWebAlpha = (1 - dist / 135) * 0.09;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(pt.x, pt.y);
              ctx.strokeStyle = `rgba(${ribbon.color}, ${activeWebAlpha})`;
              ctx.lineWidth = 0.65;
              ctx.stroke();
            }
          });
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Clean up
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        id="interactive-colorful-lines-bg"
        className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none print:hidden opacity-[0.7] dark:opacity-[0.55]"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
