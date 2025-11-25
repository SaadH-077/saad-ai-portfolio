import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CyberHelix = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isInView = useRef(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      isInView.current = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(mountRef.current);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 20;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    
    const updateSize = () => {
      const parent = mountRef.current?.parentElement;
      if (parent) {
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    updateSize();
    mountRef.current.appendChild(renderer.domElement);

    const particleCount = isMobile ? 100 : 200; // Reduced for mobile
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const color1 = new THREE.Color(0x00f3ff);
    const color2 = new THREE.Color(0xff00aa);

    for(let i=0; i<particleCount; i++) {
      const t = i * 0.1;
      const x = Math.sin(t) * 3;
      const y = (i * 0.15) - 15; 
      const z = Math.cos(t) * 3;
      
      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;

      const color = i % 2 === 0 ? color1 : color2;
      colors[i*3] = color.r;
      colors[i*3+1] = color.g;
      colors[i*3+2] = color.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.2, vertexColors: true });
    const helix = new THREE.Points(geometry, material);
    scene.add(helix);

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateSize);

    const animate = () => {
      requestAnimationFrame(animate);
      if (!isInView.current) return;
      
      helix.rotation.y += 0.02;
      helix.rotation.x = mouseRef.current.y * 0.2;
      helix.rotation.z = mouseRef.current.x * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateSize);
      if(mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full opacity-100" />;
};

export default CyberHelix;
