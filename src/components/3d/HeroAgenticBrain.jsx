import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroAgenticBrain = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const explosionFactor = useRef(0); 
  const isExploding = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 22; 

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

    // --- OBJECTS ---

    const particleCount = 1800; 
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleBasePos = new Float32Array(particleCount * 3); 
    const particleExplodeDir = new Float32Array(particleCount * 3); 
    const particleVel = [];

    const c1 = new THREE.Color(0x00f3ff); // Cyan (Top)
    const c2 = new THREE.Color(0x9d00ff); // Purple (Middle)
    const c3 = new THREE.Color(0xff0055); // Hot Pink (Bottom)

    for(let i=0; i<particleCount; i++) {
      const r = 6.5 + Math.random() * 2; 
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      particlePos[i*3] = x;
      particlePos[i*3+1] = y;
      particlePos[i*3+2] = z;

      particleBasePos[i*3] = x;
      particleBasePos[i*3+1] = y;
      particleBasePos[i*3+2] = z;

      const normalizedY = (y / r + 1) / 2; 
      
      let finalColor = new THREE.Color();
      if (normalizedY > 0.5) {
        finalColor = c2.clone().lerp(c1, (normalizedY - 0.5) * 2); 
      } else {
        finalColor = c3.clone().lerp(c2, normalizedY * 2); 
      }

      particleColors[i*3] = finalColor.r;
      particleColors[i*3+1] = finalColor.g;
      particleColors[i*3+2] = finalColor.b;

      particleExplodeDir[i*3] = x; 
      particleExplodeDir[i*3+1] = y;
      particleExplodeDir[i*3+2] = z;
      
      particleVel.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const coreParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(coreParticles);

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15, 
      blending: THREE.AdditiveBlending
    });
    const lineGeo = new THREE.BufferGeometry();
    const synapses = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(synapses);

    // --- INTERACTION ---
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = () => {
      isExploding.current = true;
      setTimeout(() => {
        isExploding.current = false;
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateSize);
    mountRef.current.addEventListener('click', handleClick);

    // --- ANIMATION LOOP ---
    const animate = () => {
      requestAnimationFrame(animate);
      
      const positions = coreParticles.geometry.attributes.position.array;
      const pColors = coreParticles.geometry.attributes.color.array;
      
      const linesPositions = [];
      const linesColors = [];

      const targetExplosion = isExploding.current ? 4 : 0; 
      explosionFactor.current += (targetExplosion - explosionFactor.current) * 0.05;

      for(let i=0; i<particleCount; i++) {
        const ix = i*3;
        const iy = i*3+1;
        const iz = i*3+2;

        let currX = particleBasePos[ix] + particleVel[i].x * 50; 
        let currY = particleBasePos[iy] + particleVel[i].y * 50;
        let currZ = particleBasePos[iz] + particleVel[i].z * 50;

        const dirX = particleExplodeDir[ix];
        const dirY = particleExplodeDir[iy];
        const dirZ = particleExplodeDir[iz];
        
        positions[ix] = currX + dirX * explosionFactor.current;
        positions[iy] = currY + dirY * explosionFactor.current;
        positions[iz] = currZ + dirZ * explosionFactor.current;

        if (explosionFactor.current < 0.5) {
           if (i % 2 === 0) { 
             for(let j=i+1; j<particleCount; j+=8) { 
               const jx = j*3;
               const jy = j*3+1;
               const jz = j*3+2;
               const dx = positions[ix] - positions[jx];
               const dy = positions[iy] - positions[jy];
               const dz = positions[iz] - positions[jz];
               const dist = dx*dx + dy*dy + dz*dz;

               if(dist < 20) { 
                 linesPositions.push(
                   positions[ix], positions[iy], positions[iz],
                   positions[jx], positions[jy], positions[jz]
                 );
                 linesColors.push(
                   pColors[ix], pColors[iy], pColors[iz],
                   pColors[jx], pColors[jy], pColors[jz]
                 );
               }
             }
           }
        }
      }
      
      coreParticles.geometry.attributes.position.needsUpdate = true;
      
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linesPositions, 3));
      lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(linesColors, 3));

      const targetRotX = mouseRef.current.y * 0.2;
      const targetRotY = mouseRef.current.x * 0.2;
      
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;

      coreParticles.rotation.y += 0.002;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateSize);
      if(mountRef.current) {
        mountRef.current.removeEventListener('click', handleClick);
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full cursor-pointer" title="Click to Scatter" />;
};

export default HeroAgenticBrain;
