import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HyperMatrix = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 12;
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

    const group = new THREE.Group();
    scene.add(group);

    // Create a matrix of floating cubes
    const cubeCount = 100;
    const instancedGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const instancedMat = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.7 });
    const mesh = new THREE.InstancedMesh(instancedGeo, instancedMat, cubeCount);
    
    const dummy = new THREE.Object3D();
    
    // Randomly position cubes in a sphere shape
    for(let i=0; i<cubeCount; i++) {
       const r = 4;
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.acos(2 * Math.random() - 1);
       
       dummy.position.set(
         r * Math.sin(phi) * Math.cos(theta),
         r * Math.sin(phi) * Math.sin(theta),
         r * Math.cos(phi)
       );
       dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
       dummy.updateMatrix();
       mesh.setMatrixAt(i, dummy.matrix);
    }
    group.add(mesh);

    // Center Core (Energy Source)
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.4 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    // group.add(core);

    // Outer Rotating Rings
    const ringGeo = new THREE.TorusGeometry(5, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff00aa });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 2;
    // group.add(ring1);
    // group.add(ring2);

    const animate = () => {
      requestAnimationFrame(animate);
      
      group.rotation.y += 0.007;
      group.rotation.x += 0.005;
      
      core.rotation.y -= 0.01;
      core.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.1);

      // Rotate rings independently
      ring1.rotation.x += 0.01;
      ring2.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if(mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full opacity-90" />;
};

export default HyperMatrix;
