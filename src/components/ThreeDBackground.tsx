import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Eye, Rotate3d, Sparkles, Sliders, Box, Layers, Palette, RefreshCw, X } from 'lucide-react';

// Palette definitions for 3D materials
export const THEMES_3D = {
  brass: {
    name: 'Imperial Brass & Gold',
    mainColor: 0x9e7b3b,
    accentColor: 0xd4af37,
    ambientColor: 0xfaf8f5,
    lightColor: 0xffe8b3,
    particleColor: 0xc5a566,
    bgTint: '#FAF8F5',
    wireframeColor: 0x9e7b3b,
    fogColor: 0xfaf8f5,
  },
  cyber: {
    name: 'Obsidian & Cyan',
    mainColor: 0x06b6d4,
    accentColor: 0x0ea5e9,
    ambientColor: 0x0f172a,
    lightColor: 0x38bdf8,
    particleColor: 0x22d3ee,
    bgTint: '#F0FDFA',
    wireframeColor: 0x0891b2,
    fogColor: 0xf0fdfa,
  },
  sunset: {
    name: 'Rose Gold & Amethyst',
    mainColor: 0xd97706,
    accentColor: 0xe11d48,
    ambientColor: 0xfff1f2,
    lightColor: 0xfbbf24,
    particleColor: 0xf43f5e,
    bgTint: '#FFF1F2',
    wireframeColor: 0xbe123c,
    fogColor: 0xfff1f2,
  },
  emerald: {
    name: 'Emerald & Platinum',
    mainColor: 0x059669,
    accentColor: 0x10b981,
    ambientColor: 0xf0fdf4,
    lightColor: 0x6ee7b7,
    particleColor: 0x34d399,
    bgTint: '#F0FDF4',
    wireframeColor: 0x047857,
    fogColor: 0xf0fdf4,
  },
};

export type ThemeKey = keyof typeof THEMES_3D;

export default function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // 3D Scene Controls State
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('brass');
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [interactiveOrbit, setInteractiveOrbit] = useState<boolean>(false);
  const [particleDensity, setParticleDensity] = useState<number>(450);
  const [isControlsOpen, setIsControlsOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Sync refs for high-frequency 60fps render loop
  const sceneStateRef = useRef({
    themeKey: activeTheme,
    wireframe: wireframeMode,
    speed: rotationSpeed,
    orbit: interactiveOrbit,
    particleCount: particleDensity,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    orbitAngles: { theta: 0, phi: 0 },
    targetOrbitAngles: { theta: 0, phi: 0 },
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    scrollRatio: 0,
    shockwaves: [] as { x: number; y: number; z: number; radius: number; maxRadius: number; age: number }[],
  });

  // Keep state synced
  useEffect(() => {
    sceneStateRef.current.themeKey = activeTheme;
    sceneStateRef.current.wireframe = wireframeMode;
    sceneStateRef.current.speed = rotationSpeed;
    sceneStateRef.current.orbit = interactiveOrbit;
    sceneStateRef.current.particleCount = particleDensity;
  }, [activeTheme, wireframeMode, rotationSpeed, interactiveOrbit, particleDensity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    const currentTheme = THEMES_3D[activeTheme];
    scene.fog = new THREE.FogExp2(currentTheme.fogColor, 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(currentTheme.ambientColor, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(currentTheme.lightColor, 2.5);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    // Dynamic 3D Cursor Light with golden glow
    const cursorPointLight = new THREE.PointLight(currentTheme.accentColor, 4, 30);
    cursorPointLight.position.set(0, 0, 10);
    scene.add(cursorPointLight);

    // --- 3D OBJECT GROUPS ---
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. HERO MONUMENT: 3D Golden Armillary & Icosahedron Seal (Top Zone)
    const monumentGroup = new THREE.Group();
    monumentGroup.position.set(6, 2, -2);
    masterGroup.add(monumentGroup);

    // Central Multi-faceted Icosahedron Gem
    const gemGeo = new THREE.IcosahedronGeometry(2.4, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: currentTheme.mainColor,
      emissive: currentTheme.mainColor,
      emissiveIntensity: 0.15,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      wireframe: wireframeMode,
      transparent: true,
      opacity: 0.92,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    monumentGroup.add(gemMesh);

    // Outer Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(3.1, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: currentTheme.wireframeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    monumentGroup.add(cageMesh);

    // Rotating Brass Torus Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: currentTheme.accentColor,
      metalness: 0.9,
      roughness: 0.3,
      wireframe: wireframeMode,
    });
    
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.06, 16, 100), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.05, 16, 100), ringMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.04, 16, 100), ringMat);
    
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.z = Math.PI / 6;
    
    monumentGroup.add(ring1);
    monumentGroup.add(ring2);
    monumentGroup.add(ring3);

    // 2. MIDDLE ZONE: 3D Floating Polyhedral Nodes & Torus Knot (Portfolio depth zone)
    const middleGroup = new THREE.Group();
    middleGroup.position.set(-6, -18, -4);
    masterGroup.add(middleGroup);

    const knotGeo = new THREE.TorusKnotGeometry(2.0, 0.35, 100, 16);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: currentTheme.mainColor,
      metalness: 0.88,
      roughness: 0.28,
      wireframe: wireframeMode,
      transparent: true,
      opacity: 0.88,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    middleGroup.add(knotMesh);

    // Surrounding floating octahedra
    const floatingNodes: THREE.Mesh[] = [];
    const octaGeo = new THREE.OctahedronGeometry(0.7, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: currentTheme.accentColor,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: wireframeMode,
    });

    for (let i = 0; i < 8; i++) {
      const node = new THREE.Mesh(octaGeo, octaMat);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 5.2 + (i % 2) * 1.5;
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 1.8,
        Math.sin(angle) * radius
      );
      middleGroup.add(node);
      floatingNodes.push(node);
    }

    // 3. BOTTOM ZONE: 3D Consultation Seal & Compass (Contact depth zone)
    const bottomGroup = new THREE.Group();
    bottomGroup.position.set(4, -36, -3);
    masterGroup.add(bottomGroup);

    const compassGeo = new THREE.DodecahedronGeometry(2.2, 0);
    const compassMat = new THREE.MeshPhysicalMaterial({
      color: currentTheme.accentColor,
      metalness: 0.92,
      roughness: 0.25,
      wireframe: wireframeMode,
    });
    const compassMesh = new THREE.Mesh(compassGeo, compassMat);
    bottomGroup.add(compassMesh);

    const compassRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.08, 16, 80),
      ringMat
    );
    bottomGroup.add(compassRing);

    // 4. 3D DYNAMIC PARAMETRIC WAVE RIBBON
    const waveWidth = 48;
    const waveHeight = 48;
    const waveSegmentsW = 40;
    const waveSegmentsH = 40;
    const waveGeo = new THREE.PlaneGeometry(waveWidth, waveHeight, waveSegmentsW, waveSegmentsH);
    waveGeo.rotateX(-Math.PI / 2.3);
    waveGeo.translate(0, -6, -8);

    const waveMat = new THREE.MeshStandardMaterial({
      color: currentTheme.mainColor,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      roughness: 0.4,
      metalness: 0.6,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    masterGroup.add(waveMesh);

    const waveBasePositions = waveGeo.attributes.position.array.slice();

    // 5. 3D PARTICLE CONSTELLATION NEBULA
    let particleGeo = new THREE.BufferGeometry();
    const updateParticles = (count: number) => {
      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);
      const phases = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 44;
        positions[i3 + 1] = (Math.random() - 0.5) * 65 - 12; // Span across scroll height
        positions[i3 + 2] = (Math.random() - 0.5) * 32 - 4;
        scales[i] = Math.random() * 0.8 + 0.3;
        phases[i] = Math.random() * Math.PI * 2;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
      particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    };

    updateParticles(particleDensity);

    // Create custom smooth circle particle canvas texture
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.7)');
        grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMat = new THREE.PointsMaterial({
      color: currentTheme.particleColor,
      size: 0.38,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // --- EVENT LISTENERS ---
    const handlePointerMove = (e: PointerEvent) => {
      const state = sceneStateRef.current;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      state.mouse.targetX = normX;
      state.mouse.targetY = normY;

      if (state.orbit && state.isDragging) {
        const deltaX = e.clientX - state.dragStart.x;
        const deltaY = e.clientY - state.dragStart.y;
        state.targetOrbitAngles.theta += deltaX * 0.006;
        state.targetOrbitAngles.phi += deltaY * 0.006;
        state.dragStart.x = e.clientX;
        state.dragStart.y = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('.controls-3d-panel') || target?.closest('.controls-3d-toggle')) {
        return;
      }

      const state = sceneStateRef.current;
      if (state.orbit) {
        state.isDragging = true;
        state.dragStart = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
      }

      // Add 3D Shockwave
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      const worldPos = new THREE.Vector3(normX * 12, normY * 8, 2);
      
      state.shockwaves.push({
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z,
        radius: 0.2,
        maxRadius: 18,
        age: 0,
      });

      if (state.shockwaves.length > 4) {
        state.shockwaves.shift();
      }
    };

    const handlePointerUp = () => {
      sceneStateRef.current.isDragging = false;
      setIsDragging(false);
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      sceneStateRef.current.scrollRatio = maxScroll > 0 ? currentScroll / maxScroll : 0;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial scroll setup
    handleScroll();

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const state = sceneStateRef.current;
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime() * state.speed;

      // Update theme materials if theme changed
      const theme = THEMES_3D[state.themeKey];
      if (gemMat.color.getHex() !== theme.mainColor) {
        gemMat.color.setHex(theme.mainColor);
        gemMat.emissive.setHex(theme.mainColor);
        cageMat.color.setHex(theme.wireframeColor);
        ringMat.color.setHex(theme.accentColor);
        knotMat.color.setHex(theme.mainColor);
        octaMat.color.setHex(theme.accentColor);
        compassMat.color.setHex(theme.accentColor);
        waveMat.color.setHex(theme.mainColor);
        particleMat.color.setHex(theme.particleColor);
        cursorPointLight.color.setHex(theme.accentColor);
        dirLight1.color.setHex(theme.lightColor);
        ambientLight.color.setHex(theme.ambientColor);
        scene.fog = new THREE.FogExp2(theme.fogColor, 0.022);
      }

      // Toggle wireframe mode dynamically
      if (gemMat.wireframe !== state.wireframe) {
        gemMat.wireframe = state.wireframe;
        knotMat.wireframe = state.wireframe;
        compassMat.wireframe = state.wireframe;
      }

      // Smooth mouse interpolation
      state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.06;
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.06;

      // Smooth 3D Cursor PointLight position
      cursorPointLight.position.x = state.mouse.x * 14;
      cursorPointLight.position.y = state.mouse.y * 10;
      cursorPointLight.position.z = 6 + Math.sin(elapsedTime * 2) * 1.5;

      // Smooth Orbit Angles damping
      state.orbitAngles.theta += (state.targetOrbitAngles.theta - state.orbitAngles.theta) * 0.1;
      state.orbitAngles.phi += (state.targetOrbitAngles.phi - state.orbitAngles.phi) * 0.1;

      // Calculate 3D Camera scroll trajectory through depth
      const scrollYTarget = -state.scrollRatio * 36;
      
      if (state.orbit) {
        // Free Orbit Mode
        masterGroup.rotation.y = state.orbitAngles.theta;
        masterGroup.rotation.x = state.orbitAngles.phi;
      } else {
        // Cinematic Camera Flight Mode
        camera.position.y += (scrollYTarget - camera.position.y) * 0.05;
        camera.position.x += (state.mouse.x * 2.5 - camera.position.x) * 0.04;
        camera.position.z = 24 + Math.sin(state.scrollRatio * Math.PI) * 4;
        
        masterGroup.rotation.y = state.mouse.x * 0.18 + Math.sin(elapsedTime * 0.25) * 0.08;
        masterGroup.rotation.x = -state.mouse.y * 0.14;
      }

      // Rotate Hero Monument meshes
      gemMesh.rotation.x = elapsedTime * 0.45;
      gemMesh.rotation.y = elapsedTime * 0.65;
      cageMesh.rotation.x = -elapsedTime * 0.25;
      cageMesh.rotation.y = -elapsedTime * 0.35;

      ring1.rotation.x += 0.008 * state.speed;
      ring1.rotation.y += 0.012 * state.speed;
      ring2.rotation.y += 0.010 * state.speed;
      ring2.rotation.z += 0.007 * state.speed;
      ring3.rotation.z += 0.009 * state.speed;
      ring3.rotation.x += 0.006 * state.speed;

      // Rotate Middle Knot & Nodes
      knotMesh.rotation.x = elapsedTime * 0.55;
      knotMesh.rotation.y = elapsedTime * 0.4;
      floatingNodes.forEach((node, idx) => {
        const speedMultiplier = (idx % 2 === 0 ? 1 : -1) * 0.4;
        node.rotation.x = elapsedTime * speedMultiplier;
        node.rotation.y = elapsedTime * speedMultiplier * 1.5;
        node.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.015;
      });

      // Rotate Bottom Compass
      compassMesh.rotation.y = elapsedTime * 0.5;
      compassMesh.rotation.z = Math.sin(elapsedTime * 0.8) * 0.3;
      compassRing.rotation.x = Math.PI / 2.5 + Math.sin(elapsedTime * 0.5) * 0.2;
      compassRing.rotation.z += 0.006;

      // Update 3D Parametric Wave Mesh Vertices
      const posAttr = waveGeo.attributes.position;
      const posArray = posAttr.array as Float32Array;
      
      for (let i = 0; i < posArray.length; i += 3) {
        const bx = waveBasePositions[i];
        const by = waveBasePositions[i + 1];
        const bz = waveBasePositions[i + 2];

        // Harmonic continuous 3D wave formula
        const distToCenter = Math.sqrt(bx * bx + by * by);
        const wave = Math.sin(distToCenter * 0.35 - elapsedTime * 1.2) * 1.4 +
                     Math.cos(bx * 0.25 + elapsedTime * 0.8) * 0.8;

        // Interactive ripple effect
        let shockwaveDisp = 0;
        state.shockwaves.forEach((shock) => {
          const distToShock = Math.sqrt((bx - shock.x) ** 2 + (by - shock.y) ** 2);
          const diff = Math.abs(distToShock - shock.radius);
          if (diff < 3.0) {
            shockwaveDisp += Math.sin((1 - diff / 3.0) * Math.PI) * 2.2 * (1 - shock.age / shock.maxRadius);
          }
        });

        posArray[i + 2] = bz + wave + shockwaveDisp;
      }
      posAttr.needsUpdate = true;

      // Update 3D Shockwaves physics
      for (let i = state.shockwaves.length - 1; i >= 0; i--) {
        const shock = state.shockwaves[i];
        shock.radius += 0.45;
        shock.age += 0.45;
        if (shock.radius >= shock.maxRadius) {
          state.shockwaves.splice(i, 1);
        }
      }

      // Update 3D Particles drift
      const particlePos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particlePos.length; i += 3) {
        particlePos[i + 1] += Math.sin(elapsedTime * 0.5 + i) * 0.012;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean memory deallocation
      gemGeo.dispose();
      gemMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ringMat.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      octaGeo.dispose();
      octaMat.dispose();
      compassGeo.dispose();
      compassMat.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeTheme, particleDensity]);

  const handleResetOrbit = useCallback(() => {
    sceneStateRef.current.targetOrbitAngles = { theta: 0, phi: 0 };
  }, []);

  return (
    <>
      {/* Three.js 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        id="three-js-webgl-container"
        className={`fixed inset-0 w-full h-full pointer-events-auto select-none z-0 overflow-hidden ${
          interactiveOrbit ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
        }`}
        style={{
          mixBlendMode: 'normal',
        }}
      />

      {/* Floating 3D Control Studio Toggle (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 print:hidden">
        <button
          id="toggle-3d-studio-btn"
          onClick={() => setIsControlsOpen(!isControlsOpen)}
          className={`px-3.5 py-2.5 rounded-[2px] font-mono text-[11px] font-bold uppercase tracking-wider border shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            isControlsOpen
              ? 'bg-ink text-paper border-ink'
              : 'bg-paper text-ink border-rule hover:border-ink hover:bg-paper-deep/80'
          }`}
          title="Toggle 3D Interactive Engine Controls"
        >
          <Rotate3d className="w-4 h-4 text-brass" />
          <span className="hidden sm:inline">3D Studio</span>
        </button>
      </div>

      {/* Floating 3D Control Studio Drawer Panel */}
      {isControlsOpen && (
        <div
          id="controls-3d-panel"
          className="controls-3d-panel fixed bottom-20 left-6 z-50 w-[300px] sm:w-[340px] bg-paper/95 backdrop-blur-md border border-ink/20 shadow-2xl rounded-[2px] p-5 font-sans space-y-4 animate-fadeIn select-none"
        >
          <div className="flex items-center justify-between border-b border-rule pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brass" />
              <h4 className="font-serif text-base font-bold text-ink">3D WebGL Engine</h4>
            </div>
            <button
              onClick={() => setIsControlsOpen(false)}
              className="p-1 hover:bg-paper-deep text-ink-soft hover:text-ink rounded-[2px] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive 3D Orbit Mode Toggle */}
          <div className="flex items-center justify-between bg-paper-deep/60 p-3 rounded-[2px] border border-rule/70">
            <div>
              <span className="font-mono text-xs font-bold text-ink block">3D Drag & Orbit Mode</span>
              <span className="text-[11px] text-ink-soft block">Drag mouse to spin 3D structures</span>
            </div>
            <button
              id="orbit-mode-toggle-btn"
              onClick={() => setInteractiveOrbit(!interactiveOrbit)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider rounded-[2px] border transition-colors cursor-pointer ${
                interactiveOrbit
                  ? 'bg-brass text-paper border-brass'
                  : 'bg-paper text-ink border-rule hover:border-ink'
              }`}
            >
              {interactiveOrbit ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* 3D Color Palette Switcher */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-brass" />
              <span>3D Material Palette</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEMES_3D) as ThemeKey[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setActiveTheme(themeKey)}
                  className={`p-2 text-left rounded-[2px] border font-sans text-xs transition-all cursor-pointer ${
                    activeTheme === themeKey
                      ? 'border-brass bg-brass/10 text-ink font-bold shadow-xs'
                      : 'border-rule bg-paper text-ink-soft hover:text-ink hover:border-ink/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: `#${THEMES_3D[themeKey].mainColor.toString(16).padStart(6, '0')}` }}
                    />
                    <span className="truncate">{THEMES_3D[themeKey].name.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Wireframe Toggle & Speed Controls */}
          <div className="space-y-3 pt-2 border-t border-rule">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink uppercase font-bold flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-brass" />
                <span>Wireframe Geometry</span>
              </span>
              <button
                onClick={() => setWireframeMode(!wireframeMode)}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase font-bold rounded-[2px] border cursor-pointer ${
                  wireframeMode
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper text-ink border-rule hover:border-ink'
                }`}
              >
                {wireframeMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* 3D Spin Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-ink-soft uppercase">
                <span>Animation Speed</span>
                <span className="text-brass font-bold">{rotationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full accent-brass cursor-pointer"
              />
            </div>
          </div>

          {/* Reset Orbit Button */}
          {interactiveOrbit && (
            <button
              onClick={handleResetOrbit}
              className="w-full py-2 font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-ink bg-paper border border-rule hover:border-ink rounded-[2px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset 3D Orientation</span>
            </button>
          )}

          <div className="text-[10px] font-mono text-ink-soft/70 text-center pt-1">
            Click anywhere on the screen to trigger a 3D shockwave
          </div>
        </div>
      )}
    </>
  );
}
