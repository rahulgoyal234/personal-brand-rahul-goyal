import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function LexHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const updateSize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth || 300;
      const height = canvas.parentElement.clientHeight || 300;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Outer wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(1.9, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xb08d57,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const gem = new THREE.Mesh(geo, mat);
    scene.add(gem);

    // Inner wireframe icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xece6d6,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const innerGem = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerGem);

    updateSize();

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      gem.rotation.y += 0.0012;
      gem.rotation.x += 0.0005;
      innerGem.rotation.y -= 0.0008;
      innerGem.rotation.x += 0.0003;
      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(updateSize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Trigger reveal transition
    const timer = setTimeout(() => {
      setIsIn(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      geo.dispose();
      mat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full relative pointer-events-none select-none">
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isIn ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
