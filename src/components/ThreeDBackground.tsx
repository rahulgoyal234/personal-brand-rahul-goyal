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

// Preset color palettes that harmonize with the brand
const PALETTES = {
  brass: [
    { color: '169, 128, 63', glow: 'rgba(169, 128, 63, 0.45)' }, // Elegant Brass
    { color: '184, 134, 11', glow: 'rgba(184, 134, 11, 0.4)' },  // Dark Goldenrod
    { color: '205, 127, 50', glow: 'rgba(205, 127, 50, 0.35)' }, // Bronze
    { color: '139, 101, 8', glow: 'rgba(139, 101, 8, 0.45)' },   // Antique Gold
  ],
  cyber: [
    { color: '13, 148, 136', glow: 'rgba(13, 148, 136, 0.45)' }, // Deep Teal
    { color: '6, 182, 212', glow: 'rgba(6, 182, 212, 0.5)' },    // Cyan Blue
    { color: '20, 184, 166', glow: 'rgba(20, 184, 166, 0.4)' },   // Mint
    { color: '56, 189, 248', glow: 'rgba(56, 189, 248, 0.45)' },  // Sky
  ],
  sunset: [
    { color: '219, 39, 119', glow: 'rgba(219, 39, 119, 0.4)' },  // Sunset Rose
    { color: '124, 58, 237', glow: 'rgba(124, 58, 237, 0.35)' }, // Electric Violet
    { color: '249, 115, 22', glow: 'rgba(249, 115, 22, 0.4)' },   // Warm Amber
    { color: '236, 72, 153', glow: 'rgba(236, 72, 153, 0.4)' },  // Pink
  ],
  aurora: [
    { color: '34, 197, 94', glow: 'rgba(34, 197, 94, 0.4)' },    // Emerald Green
    { color: '20, 184, 166', glow: 'rgba(20, 184, 166, 0.45)' },  // Turquoise
    { color: '168, 85, 247', glow: 'rgba(168, 85, 247, 0.35)' },  // Purple
    { color: '234, 179, 8', glow: 'rgba(234, 179, 8, 0.35)' },    // Warm Yellow
  ],
  rainbow: [
    { color: '169, 128, 63', glow: 'rgba(169, 128, 63, 0.4)' },  // Brass
    { color: '13, 148, 136', glow: 'rgba(13, 148, 136, 0.35)' }, // Deep Teal
    { color: '124, 58, 237', glow: 'rgba(124, 58, 237, 0.3)' },  // Electric Violet
    { color: '219, 39, 119', glow: 'rgba(219, 39, 119, 0.35)' }, // Sunset Rose
    { color: '6, 182, 212', glow: 'rgba(6, 182, 212, 0.4)' },    // Cyan Blue
    { color: '249, 115, 22', glow: 'rgba(249, 115, 22, 0.3)' },   // Warm Amber
  ]
};

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Real-time custom settings State
  const [isOpen, setIsOpen] = useState(false);
  const [numRibbons, setNumRibbons] = useState(16);
  const [waveAmplitude, setWaveAmplitude] = useState(45);
  const [driftSpeed, setDriftSpeed] = useState(1.1);
  const [particleCount, setParticleCount] = useState(40);
  const [paletteKey, setPaletteKey] = useState<keyof typeof PALETTES>('brass');
  const [isGlowOn, setIsGlowOn] = useState(true);

  // Use configuration refs to sync instantly with high-performance draw loop without recreating event listeners
  const configRef = useRef({
    numRibbons,
    waveAmplitude,
    driftSpeed,
    particleCount,
    palette: PALETTES[paletteKey],
    isGlowOn
  });

  // Track if we need to regenerate arrays
  const reinitTrigger = useRef(false);
  // Manual scatter wave trigger
  const triggerScatter = useRef(false);

  // Keep configRef in absolute synchronization with state changes
  useEffect(() => {
    configRef.current = {
      numRibbons,
      waveAmplitude,
      driftSpeed,
      particleCount,
      palette: PALETTES[paletteKey],
      isGlowOn
    };
  }, [numRibbons, waveAmplitude, driftSpeed, particleCount, paletteKey, isGlowOn]);

  // Re-trigger ribbon/particle generation when count or colors change
  useEffect(() => {
    reinitTrigger.current = true;
  }, [numRibbons, particleCount, paletteKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse Tracking state
    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      radius: 250,
    };

    // Click Ripple shocks
    let ripples: Ripple[] = [];

    // Local data stores
    let ribbons: Ribbon[] = [];
    let particles: Particle[] = [];
    const pointsPerRibbon = 35;

    const initRibbons = () => {
      ribbons = [];
      const currentConfig = configRef.current;
      const segmentWidth = width / (pointsPerRibbon - 1);

      for (let r = 0; r < currentConfig.numRibbons; r++) {
        const points: RibbonPoint[] = [];
        const targetY = height * (0.12 + (r * (0.76 / Math.max(1, currentConfig.numRibbons - 1))));
        const theme = currentConfig.palette[r % currentConfig.palette.length];

        for (let p = 0; p < pointsPerRibbon; p++) {
          const x = p * segmentWidth;
          points.push({
            x,
            y: targetY,
            baseX: x,
            baseY: targetY,
            angleX: p * 0.42 + r * 1.6,
            angleY: p * 0.48 + r * 2.2,
            speedX: 0.012 + Math.sin(r + p) * 0.006,
            speedY: 0.008 + Math.cos(r * p) * 0.006,
            waveAmplitude: currentConfig.waveAmplitude * (0.6 + Math.sin(r) * 0.4),
          });
        }

        ribbons.push({
          points,
          color: theme.color,
          glowColor: theme.glow,
          width: 0.20 + (r % 3) * 0.05, // Thread-like super fine lines
          phaseOffset: r * Math.PI * 0.18,
          speed: 0.85 + r * 0.08,
        });
      }
    };

    const initParticles = () => {
      particles = [];
      const currentConfig = configRef.current;
      for (let i = 0; i < currentConfig.particleCount; i++) {
        const theme = currentConfig.palette[i % currentConfig.palette.length];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          radius: 1.2 + Math.random() * 1.8,
          color: theme.color,
          glowColor: theme.glow,
          alpha: 0.15 + Math.random() * 0.35,
          pulseSpeed: 0.008 + Math.random() * 0.016,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Initial setup
    initRibbons();
    initParticles();

    // Event handlers with physical velocity tracking
    let lastMouseX = -1;
    let lastMouseY = -1;
    let mouseVelocity = 0;
    let lastTime = Date.now();

    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastTime);
      
      if (lastMouseX !== -1 && lastMouseY !== -1) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const instantV = dist / dt;
        mouseVelocity += (instantV - mouseVelocity) * 0.15;
      }
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastTime = now;

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouseVelocity = 0;
      lastMouseX = -1;
      lastMouseY = -1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Prevent spawning shockwave if clicking settings panel
      const target = e.target as HTMLElement;
      if (target?.closest('.linings-engine-panel') || target?.closest('.linings-engine-toggle')) {
        return;
      }

      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.65,
        speed: 8.5,
        strength: 65,
      });

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

    // Main Draw Tick
    const tick = () => {
      const currentConfig = configRef.current;

      // Handle structural re-initialization requests
      if (reinitTrigger.current) {
        initRibbons();
        initParticles();
        reinitTrigger.current = false;
      }

      // Handle manual scatter shock wave request
      if (triggerScatter.current) {
        ripples.push({
          x: width / 2,
          y: height / 2,
          radius: 0,
          maxRadius: Math.max(width, height) * 0.75,
          speed: 12,
          strength: 120,
        });
        triggerScatter.current = false;
      }

      ctx.clearRect(0, 0, width, height);

      // Render expanding ripples
      ripples.forEach((ripple, rIdx) => {
        ripple.radius += ripple.speed;
        
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        const alpha = Math.max(0, 0.055 * (1 - ripple.radius / ripple.maxRadius));
        ctx.strokeStyle = `rgba(${currentConfig.palette[0].color}, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (ripple.radius >= ripple.maxRadius) {
          ripples.splice(rIdx, 1);
        }
      });

      // Update and Draw ribbons
      mouseVelocity *= 0.95; // slowly decay physical velocity

      ribbons.forEach((ribbon) => {
        ribbon.points.forEach((point) => {
          // Progress wave motion incorporating speed controller
          point.angleX += point.speedX * currentConfig.driftSpeed;
          point.angleY += point.speedY * currentConfig.driftSpeed;

          // Universal base state: The entire screen is a highly complex, tangled web of intersecting filaments
          let complexityFactor = 1.0;

          // When interactive (hover/pointer active), we resolve the complexity to make it "comprehensible"
          if (mouse.active) {
            const dx = mouse.x - point.baseX;
            const dy = mouse.y - point.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const interactiveRadius = 260; // broad zone of comprehensibility around the cursor
            if (dist < interactiveRadius) {
              const proximity = (interactiveRadius - dist) / interactiveRadius; // 0 (edge) to 1 (cursor)
              // Smooth easing function for fluid transition
              const smoothProximity = Math.sin(proximity * Math.PI * 0.5);
              complexityFactor = 1.0 - smoothProximity * 0.98; // reduce up to 98% of the complexity
            }
          }

          const activeChaos = complexityFactor;

          // Multi-harmonic high-frequency complex turbulent noise (creating a beautiful complex web)
          const complexNoiseX = Math.sin(point.angleY * 4.2 + point.angleX * 1.8) * (currentConfig.waveAmplitude * 0.42) + 
                                Math.cos(point.angleX * 7.5) * (currentConfig.waveAmplitude * 0.12);
          const complexNoiseY = Math.cos(point.angleX * 4.6 - point.angleY * 2.8) * (currentConfig.waveAmplitude * 0.65) + 
                                Math.sin(point.angleY * 6.0) * (currentConfig.waveAmplitude * 0.18);

          // Perfect, pristine, parallel waves (representing order and clarity)
          const cleanWaveX = Math.sin(point.angleX * 0.4) * (currentConfig.waveAmplitude * 0.08);
          const cleanWaveY = Math.cos(point.angleY * 0.3) * (currentConfig.waveAmplitude * 0.12);

          // Beautiful linear interpolation: cleanWave + chaos * (complexNoise - cleanWave)
          const waveX = cleanWaveX + (complexNoiseX - cleanWaveX) * activeChaos;
          const waveY = cleanWaveY + (complexNoiseY - cleanWaveY) * activeChaos;

          // Pointer magnetic gravity attraction and pluck vibration
          let mouseDispX = 0;
          let mouseDispY = 0;

          if (mouse.active) {
            const dx = mouse.x - point.baseX;
            const dy = mouse.y - point.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius; // scale 0 to 1
              const strength = 85 * Math.sin(force * Math.PI * 0.5);
              mouseDispX = (dx / (dist || 1)) * strength;
              mouseDispY = (dy / (dist || 1)) * strength;

              // Shivering string vibrations proportional to swipe speed
              if (mouseVelocity > 0.03) {
                const vibStrength = Math.min(30, mouseVelocity * 12) * force;
                const freq = 0.06;
                const vibPhase = Date.now() * freq + point.angleX * 1.5;
                mouseDispX += Math.sin(vibPhase) * vibStrength;
                mouseDispY += Math.cos(vibPhase) * vibStrength;
              }
            }
          }

          // Apply expanding Click Ripple displacement force
          let rippleDispX = 0;
          let rippleDispY = 0;

          ripples.forEach((ripple) => {
            const dx = point.baseX - ripple.x;
            const dy = point.baseY - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const rippleWidth = 150;
            const distFromRing = Math.abs(dist - ripple.radius);

            if (distFromRing < rippleWidth) {
              const force = Math.sin((1 - distFromRing / rippleWidth) * Math.PI);
              const strength = ripple.strength * force * (1 - ripple.radius / ripple.maxRadius);
              rippleDispX += (dx / (dist || 1)) * strength;
              rippleDispY += (dy / (dist || 1)) * strength;
            }
          });

          // Compute raw target coordinates
          const targetX = point.baseX + waveX + mouseDispX + rippleDispX;
          const targetY = point.baseY + waveY + mouseDispY + rippleDispY;

          // Smooth interpolation
          point.x += (targetX - point.x) * 0.082;
          point.y += (targetY - point.y) * 0.082;
        });

        // Pass 1: Wide Deep Neon glow pass
        if (currentConfig.isGlowOn) {
          ctx.beginPath();
          ctx.lineWidth = ribbon.width * 5.5; // broad atmospheric glow
          ctx.strokeStyle = ribbon.glowColor.replace(/[\d.]+\)$/, '0.12)'); // soft background glow
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.moveTo(ribbon.points[0].x, ribbon.points[0].y);
          for (let i = 0; i < ribbon.points.length - 1; i++) {
            const xc = (ribbon.points[i].x + ribbon.points[i + 1].x) / 2;
            const yc = (ribbon.points[i].y + ribbon.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(ribbon.points[i].x, ribbon.points[i].y, xc, yc);
          }
          ctx.stroke();

          // Pass 2: Medium Core Neon Glow
          ctx.beginPath();
          ctx.lineWidth = ribbon.width * 2.5; // tighter medium intensity glow
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
        }

        // Pass 3: Crisp Core Thread with moving pulse gradient
        ctx.beginPath();
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Horizontal fading gradient path with traveling pulse of light
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const t = (Date.now() * 0.0006 + ribbon.phaseOffset) % 2.0; // traveling wave phase
        const pulseX = t - 0.5; // moving focus point from -0.5 to 1.5
        
        const stop1 = Math.max(0, Math.min(1, pulseX - 0.2));
        const stop2 = Math.max(0, Math.min(1, pulseX));
        const stop3 = Math.max(0, Math.min(1, pulseX + 0.2));

        gradient.addColorStop(0, `rgba(${ribbon.color}, 0.08)`);
        if (stop1 > 0 && stop1 < 1) {
          gradient.addColorStop(stop1, `rgba(${ribbon.color}, 0.28)`);
        }
        if (stop2 > 0 && stop2 < 1) {
          gradient.addColorStop(stop2, `rgba(${ribbon.color}, 0.95)`); // Highly saturated, glowing center
        }
        if (stop3 > 0 && stop3 < 1) {
          gradient.addColorStop(stop3, `rgba(${ribbon.color}, 0.28)`);
        }
        gradient.addColorStop(1, `rgba(${ribbon.color}, 0.08)`);

        ctx.strokeStyle = gradient;
        ctx.moveTo(ribbon.points[0].x, ribbon.points[0].y);
        
        for (let i = 0; i < ribbon.points.length - 1; i++) {
          const xc = (ribbon.points[i].x + ribbon.points[i + 1].x) / 2;
          const yc = (ribbon.points[i].y + ribbon.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(ribbon.points[i].x, ribbon.points[i].y, xc, yc);
        }
        ctx.stroke();
      });

      // Update and Draw floating star energy dust
      particles.forEach((p, pIdx) => {
        p.x += p.vx * currentConfig.driftSpeed;
        p.y += p.vy * currentConfig.driftSpeed;

        p.pulsePhase += p.pulseSpeed * currentConfig.driftSpeed;
        const pulseAlpha = p.alpha * (0.6 + Math.sin(p.pulsePhase) * 0.4);

        // Repel from cursor
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            p.x += (dx / (dist || 1)) * force * 1.6;
            p.y += (dy / (dist || 1)) * force * 1.6;
          }
        }

        // Screen boundary loops
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${pulseAlpha})`;
        ctx.fill();

        // Constellation webs between particles
        for (let j = pIdx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const webAlpha = (1 - dist / 110) * 0.08 * Math.min(pulseAlpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color}, ${webAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Constellation ties linking dust to active fine linings
        ribbons.forEach((ribbon) => {
          ribbon.points.forEach((pt) => {
            const dx = p.x - pt.x;
            const dy = p.y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              const linkAlpha = (1 - dist / 90) * 0.045 * pulseAlpha;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pt.x, pt.y);
              ctx.strokeStyle = `rgba(${ribbon.color}, ${linkAlpha})`;
              ctx.lineWidth = 0.45;
              ctx.stroke();
            }
          });
        });
      });

      // Pointer magnetism constellation web
      if (mouse.active) {
        ribbons.forEach((ribbon) => {
          ribbon.points.forEach((pt) => {
            const dx = mouse.x - pt.x;
            const dy = mouse.y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              const activeWebAlpha = (1 - dist / 140) * 0.085;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(pt.x, pt.y);
              ctx.strokeStyle = `rgba(${ribbon.color}, ${activeWebAlpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          });
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          id="interactive-colorful-lines-bg"
          className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none print:hidden opacity-[0.68] dark:opacity-[0.52]"
          style={{
            mixBlendMode: 'multiply',
          }}
        />
      </div>
    </>
  );
}
