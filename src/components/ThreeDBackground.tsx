import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

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
    name: 'Emerald & Jade',
    mainColor: 0x059669,
    accentColor: 0x10b981,
    ambientColor: 0xfaf8f5,
    lightColor: 0x34d399,
    particleColor: 0x059669,
    bgTint: '#FAF8F5',
    wireframeColor: 0x047857,
    fogColor: 0xfaf8f5,
  },
};

export type ThemeKey = keyof typeof THEMES_3D;

export default function ThreeDBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // 3D Scene Controls State - Set to Emerald at Highest Speed
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('emerald');
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(3.0);
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

    // 1. 3D DYNAMIC PARAMETRIC WAVE RIBBON
    const waveWidth = 52;
    const waveHeight = 52;
    const waveSegmentsW = 44;
    const waveSegmentsH = 44;
    const waveGeo = new THREE.PlaneGeometry(waveWidth, waveHeight, waveSegmentsW, waveSegmentsH);
    waveGeo.rotateX(-Math.PI / 2.3);
    waveGeo.translate(0, -6, -8);

    const waveMat = new THREE.MeshStandardMaterial({
      color: currentTheme.mainColor,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      roughness: 0.4,
      metalness: 0.6,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    masterGroup.add(waveMesh);

    const waveBasePositions = waveGeo.attributes.position.array.slice();

    // 2. 3D PARTICLE CONSTELLATION NEBULA
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
      if (waveMat.color.getHex() !== theme.mainColor) {
        waveMat.color.setHex(theme.mainColor);
        particleMat.color.setHex(theme.particleColor);
        cursorPointLight.color.setHex(theme.accentColor);
        dirLight1.color.setHex(theme.lightColor);
        ambientLight.color.setHex(theme.ambientColor);
        scene.fog = new THREE.FogExp2(theme.fogColor, 0.022);
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
    </>
  );
}
