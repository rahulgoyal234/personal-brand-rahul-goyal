import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function EntranceCurtain() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [progress, setProgress] = useState(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Group references
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const ring3Ref = useRef<THREE.Mesh | null>(null);
  const coreGemRef = useRef<THREE.Mesh | null>(null);
  const scalesRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const lightPointRef = useRef<THREE.PointLight | null>(null);

  // Mouse tilt
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const handleEnter = useCallback(() => {
    if (isEntering || isDismissed) return;
    setIsEntering(true);

    // Zoom camera into 3D portal
    const startTime = performance.now();
    const duration = 800; // ms

    const animateZoom = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const ease = t * t * (3 - 2 * t); // smoothstep

      if (cameraRef.current) {
        cameraRef.current.position.z = THREE.MathUtils.lerp(18, -12, ease);
        cameraRef.current.fov = THREE.MathUtils.lerp(45, 90, ease);
        cameraRef.current.updateProjectionMatrix();
      }

      if (mainGroupRef.current) {
        mainGroupRef.current.rotation.z += 0.08;
        mainGroupRef.current.scale.setScalar(1 + ease * 3);
      }

      if (t < 1) {
        requestAnimationFrame(animateZoom);
      } else {
        setIsDismissed(true);
      }
    };

    requestAnimationFrame(animateZoom);
  }, [isEntering, isDismissed]);

  // Auto progression if user doesn't click
  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 3600; // 3.6s countdown

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        handleEnter();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [handleEnter]);

  // Mouse move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseRef.current.targetY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 3D Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0b09, 0.035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfaf8f5, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xd4af37, 2.5); // Golden brass
    dirLight1.position.set(5, 8, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 2.0); // Emerald fill
    dirLight2.position.set(-6, -6, 8);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfff3d6, 3, 25);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);
    lightPointRef.current = pointLight;

    // 5. Main 3D Seal Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Materials
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8a15a,
      metalness: 0.85,
      roughness: 0.22,
      wireframe: false,
    });

    const emeraldMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x047857,
      emissiveIntensity: 0.25,
      metalness: 0.65,
      roughness: 0.18,
      wireframe: false,
    });

    const goldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xecd08c,
      metalness: 0.95,
      roughness: 0.15,
    });

    // 3D Outer Beveled Roman Ring
    const outerRingGeo = new THREE.TorusGeometry(3.6, 0.09, 24, 100);
    const ring1 = new THREE.Mesh(outerRingGeo, brassMaterial);
    mainGroup.add(ring1);
    ring1Ref.current = ring1;

    // 3D Concentric Gimbal Ring 2
    const middleRingGeo = new THREE.TorusGeometry(3.0, 0.07, 20, 80);
    const ring2 = new THREE.Mesh(middleRingGeo, goldTrimMaterial);
    ring2.rotation.x = Math.PI / 4;
    mainGroup.add(ring2);
    ring2Ref.current = ring2;

    // 3D Inner Gimbal Ring 3
    const innerRingGeo = new THREE.TorusGeometry(2.4, 0.05, 16, 60);
    const ring3 = new THREE.Mesh(innerRingGeo, emeraldMaterial);
    ring3.rotation.y = Math.PI / 3;
    mainGroup.add(ring3);
    ring3Ref.current = ring3;

    // 3D Central Faceted Emerald Gemstone
    const gemGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const coreGem = new THREE.Mesh(gemGeo, emeraldMaterial);
    mainGroup.add(coreGem);
    coreGemRef.current = coreGem;

    // Wireframe Cage around gemstone
    const gemWireGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const gemWireMat = new THREE.MeshBasicMaterial({
      color: 0xe2c582,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const gemWireMesh = new THREE.Mesh(gemWireGeo, gemWireMat);
    coreGem.add(gemWireMesh);

    // 3D Balance Scales of Justice Geometry
    const scalesGroup = new THREE.Group();
    scalesGroup.position.set(0, 0, 0);

    // Center beam
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 16);
    const beamMesh = new THREE.Mesh(beamGeo, goldTrimMaterial);
    beamMesh.rotation.z = Math.PI / 2;
    beamMesh.position.y = 0.5;
    scalesGroup.add(beamMesh);

    // Vertical column
    const colGeo = new THREE.CylinderGeometry(0.05, 0.07, 1.8, 16);
    const colMesh = new THREE.Mesh(colGeo, brassMaterial);
    scalesGroup.add(colMesh);

    // Left pan
    const panGeo = new THREE.ConeGeometry(0.35, 0.12, 16, 1, true);
    const leftPan = new THREE.Mesh(panGeo, goldTrimMaterial);
    leftPan.rotation.x = Math.PI;
    leftPan.position.set(-1.3, -0.2, 0);
    scalesGroup.add(leftPan);

    // Right pan
    const rightPan = new THREE.Mesh(panGeo, goldTrimMaterial);
    rightPan.rotation.x = Math.PI;
    rightPan.position.set(1.3, -0.2, 0);
    scalesGroup.add(rightPan);

    mainGroup.add(scalesGroup);
    scalesRef.current = scalesGroup;

    // 6. 3D Swirling Particle Vortex
    const particleCount = 750;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorGold = new THREE.Color(0xd4af37);
    const colorEmerald = new THREE.Color(0x10b981);
    const colorCream = new THREE.Color(0xfff8ee);

    for (let i = 0; i < particleCount; i++) {
      // Golden logarithmic spiral distribution
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.pow(Math.random(), 1.5) * 12;
      const z = (Math.random() - 0.5) * 14;

      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = Math.sin(theta) * radius;
      particlePositions[i * 3 + 2] = z;

      // Interleaved luxury colors
      const rChoice = Math.random();
      const pColor = rChoice < 0.5 ? colorGold : rChoice < 0.85 ? colorEmerald : colorCream;
      particleColors[i * 3] = pColor.r;
      particleColors[i * 3 + 1] = pColor.g;
      particleColors[i * 3 + 2] = pColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Group 3D tilt
      if (mainGroup) {
        mainGroup.rotation.y = mouseRef.current.x * 0.45 + elapsed * 0.12;
        mainGroup.rotation.x = -mouseRef.current.y * 0.35 + Math.sin(elapsed * 0.6) * 0.08;
        mainGroup.position.y = Math.sin(elapsed * 1.2) * 0.15;
      }

      // Gimbal Rings rotation
      if (ring1) ring1.rotation.z += delta * 0.4;
      if (ring2) {
        ring2.rotation.x += delta * 0.6;
        ring2.rotation.y += delta * 0.3;
      }
      if (ring3) {
        ring3.rotation.y -= delta * 0.7;
        ring3.rotation.z += delta * 0.5;
      }

      // Core Gemstone rotation
      if (coreGem) {
        coreGem.rotation.x += delta * 0.8;
        coreGem.rotation.y += delta * 1.0;
      }

      // Scales oscillating gently
      if (scalesRef.current) {
        scalesRef.current.rotation.z = Math.sin(elapsed * 2.0) * 0.08;
      }

      // Particle Vortex rotation
      if (particles) {
        particles.rotation.z -= delta * 0.08;
        particles.rotation.y = Math.sin(elapsed * 0.3) * 0.1;
      }

      // Dynamic light tracking
      if (pointLight) {
        pointLight.position.x = mouseRef.current.x * 6;
        pointLight.position.y = mouseRef.current.y * 5;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (isDismissed) return null;

  return (
    <div
      id="welcome-3d-curtain"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#0e0b08] text-[#faf8f5] select-none transition-opacity duration-700 ${
        isEntering ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* Subtle Vignette & Glow Overlay */}
      <div className="absolute inset-0 z-[1] bg-radial from-transparent via-[#0e0b08]/30 to-[#0e0b08]/90 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#c8a15a]/40 bg-[#c8a15a]/10 flex items-center justify-center text-[#ecd08c]">
            <Sparkles className="w-4 h-4 text-[#c8a15a] animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#c8a15a] font-bold block">
              Digital Chambers
            </span>
            <span className="text-[12px] text-[#faf8f5]/70 font-sans tracking-wide">
              Supreme Court & High Court Counsel
            </span>
          </div>
        </div>

        {/* Skip direct button */}
        <button
          onClick={handleEnter}
          className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-widest px-4 py-2 rounded-[2px] border border-[#c8a15a]/30 text-[#ecd08c] hover:bg-[#c8a15a]/15 hover:border-[#c8a15a] transition-all duration-200 cursor-pointer flex items-center gap-2"
        >
          <span>Skip to Chambers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Center 3D Monogram & Title Deck */}
      <div className="relative z-10 text-center max-w-2xl px-6 my-auto flex flex-col items-center pointer-events-auto">
        
        {/* Monogram Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 relative"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#c8a15a]/50 bg-[#0e0b08]/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_35px_rgba(200,161,90,0.25)] mx-auto">
            <span className="font-serif text-3xl sm:text-4xl text-[#ecd08c] font-bold tracking-[0.15em] translate-x-0.5">
              RG
            </span>
          </div>
        </motion.div>

        {/* Main Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#faf8f5] mb-3 text-balance leading-tight"
        >
          Rahul Goyal
        </motion.h1>

        {/* Elegant Gold Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '80px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-[#c8a15a] to-transparent my-3 mx-auto"
        />

        {/* Subtitle / Fine Print */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-sm sm:text-base text-[#faf8f5]/80 font-normal max-w-lg mb-8 leading-relaxed"
        >
          A lawyer who reads fine print so you don’t have to.
        </motion.p>

        {/* Interactive 3D Enter CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          onClick={handleEnter}
          id="enter-chambers-3d-btn"
          className="group relative px-8 py-3.5 sm:px-10 sm:py-4 rounded-[2px] bg-gradient-to-r from-[#c8a15a] via-[#dfbe7b] to-[#c8a15a] text-[#0e0b08] font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(200,161,90,0.35)] hover:shadow-[0_0_45px_rgba(200,161,90,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out" />
          
          <span className="relative z-10">Enter Chambers</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200" />
        </motion.button>

      </div>

      {/* Bottom Progress Bar & Hint */}
      <footer className="relative z-10 w-full max-w-xl mx-auto px-6 pb-6 sm:pb-8 flex flex-col items-center space-y-2 text-center">
        {/* Progress Track */}
        <div className="w-full h-1 bg-[#faf8f5]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#10b981] via-[#c8a15a] to-[#ecd08c] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full font-mono text-[10px] text-[#faf8f5]/50 uppercase tracking-widest pt-1">
          <span>Interactive 3D Experience</span>
          <span>Click to Enter</span>
        </div>
      </footer>
    </div>
  );
}
