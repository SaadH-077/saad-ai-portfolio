import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NeuralBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050508', 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Optimize for mobile
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    
    mountRef.current.appendChild(renderer.domElement);

    // Galaxy Starfield
    const geometry = new THREE.BufferGeometry();
    const count = isMobile ? 1500 : 4000; // Reduced count for mobile
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color1 = new THREE.Color(0x00ffff); // Cyan
    const color2 = new THREE.Color(0xff00ff); // Pink
    const color3 = new THREE.Color(0x4422ff); // Deep Blue

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

      const rand = Math.random();
      const color = rand < 0.33 ? color1 : rand < 0.66 ? color2 : color3;
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    
    const starfield = new THREE.Points(geometry, material);
    scene.add(starfield);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      starfield.rotation.y += 0.0002;
      starfield.rotation.x += 0.0001;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default NeuralBackground;
