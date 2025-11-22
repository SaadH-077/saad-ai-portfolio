import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HolographicGlobe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 15;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
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

    const geometry = new THREE.IcosahedronGeometry(5, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4488ff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const pGeo = new THREE.IcosahedronGeometry(5, 3);
    const pMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05, transparent: true, opacity: 0.4 });
    const points = new THREE.Points(pGeo, pMat); 
    scene.add(points);

    window.addEventListener('resize', updateSize);

    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      points.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      if(mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default HolographicGlobe;
