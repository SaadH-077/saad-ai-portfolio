import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, X, MousePointer2, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ARCHITECTURES = [
  { 
    id: 0, 
    name: "NEURAL NETWORK (MLP)", 
    desc: "The foundation of Deep Learning. Densely connected layers of neurons transform inputs into outputs through learned weights.", 
    color: "#22c55e" 
  },
  { 
    id: 1, 
    name: "RECURRENT NET (RNN)", 
    desc: "Designed for sequential data. Hidden states act as memory, allowing information to persist across time steps.", 
    color: "#06b6d4" 
  },
  { 
    id: 2, 
    name: "LSTM NETWORK", 
    desc: "Long Short-Term Memory. Specialized gated cells regulate information flow to solve the vanishing gradient problem.", 
    color: "#a855f7" 
  },
  { 
    id: 3, 
    name: "VISION TRANSFORMER", 
    desc: "Revolutionary architecture using Self-Attention mechanisms on image patches, replacing traditional CNNs.", 
    color: "#ec4899" 
  }
];

const GalaxyExplorer = ({ onClose }) => {
  const mountRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const targetRotationRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 25); // Back up to see the carousel
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- CAROUSEL GROUP ---
    const carousel = new THREE.Group();
    carouselRef.current = carousel;
    scene.add(carousel);

    const RADIUS = 15;

    // --- 1. MLP (Feedforward) ---
    const createMLP = () => {
      const group = new THREE.Group();
      const layers = [4, 5, 5, 3];
      const layerDist = 3;
      const nodeDist = 1.2;
      const nodes = [];

      layers.forEach((count, lIndex) => {
        const layerNodes = [];
        for(let i=0; i<count; i++) {
          const y = (i - (count-1)/2) * nodeDist;
          const x = (lIndex - (layers.length-1)/2) * layerDist;
          
          const geo = new THREE.SphereGeometry(0.3, 16, 16);
          const mat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, y, 0);
          group.add(mesh);
          layerNodes.push(mesh);

          // Pulse animation data
          mesh.userData = { originalScale: 1, phase: Math.random() * Math.PI * 2 };
        }
        nodes.push(layerNodes);
      });

      const lineMat = new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.15 });
      for(let l=0; l<layers.length-1; l++) {
        nodes[l].forEach(n1 => {
          nodes[l+1].forEach(n2 => {
            const pts = [n1.position, n2.position];
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const line = new THREE.Line(geo, lineMat);
            group.add(line);
          });
        });
      }
      return group;
    };

    // --- 2. RNN ---
    const createRNN = () => {
      const group = new THREE.Group();
      const timeSteps = 5;
      const stepDist = 2.5;
      
      const inputs = [];
      const hiddens = [];
      const outputs = [];

      for(let t=0; t<timeSteps; t++) {
        const x = (t - (timeSteps-1)/2) * stepDist;
        
        // Input
        const iGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const iMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
        const input = new THREE.Mesh(iGeo, iMat);
        input.position.set(x, -2, 0);
        group.add(input);
        inputs.push(input);

        // Hidden
        const hGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const hMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        const hidden = new THREE.Mesh(hGeo, hMat);
        hidden.position.set(x, 0, 0);
        group.add(hidden);
        hiddens.push(hidden);

        // Output
        const oGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const oMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const output = new THREE.Mesh(oGeo, oMat);
        output.position.set(x, 2, 0);
        group.add(output);
        outputs.push(output);

        // Vertical Lines
        const lineGeo = new THREE.BufferGeometry().setFromPoints([input.position, hidden.position, output.position]);
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x06b6d4, opacity: 0.5, transparent: true }));
        group.add(line);
      }

      // Horizontal Recurrent Connections
      const recMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, opacity: 0.8, transparent: true });
      for(let t=0; t<timeSteps-1; t++) {
        const pts = [hiddens[t].position, hiddens[t+1].position];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, recMat);
        group.add(line);
        
        // Arrow effect (cone)
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
        cone.position.set(hiddens[t].position.x + stepDist/2, 0, 0);
        cone.rotation.z = -Math.PI / 2;
        group.add(cone);
      }

      return group;
    };

    // --- 3. LSTM ---
    const createLSTM = () => {
      const group = new THREE.Group();
      const cells = 3;
      const dist = 4;

      for(let i=0; i<cells; i++) {
        const x = (i - (cells-1)/2) * dist;
        
        // Cell Block
        const cellGeo = new THREE.BoxGeometry(2.5, 1.5, 1);
        const cellMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.2, wireframe: true });
        const cell = new THREE.Mesh(cellGeo, cellMat);
        cell.position.set(x, 0, 0);
        group.add(cell);

        // Gates (Sigmoid/Tanh)
        const gateGeo = new THREE.CircleGeometry(0.3, 16);
        const gateMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide });
        
        const g1 = new THREE.Mesh(gateGeo, gateMat); g1.position.set(x - 0.8, 0.3, 0);
        const g2 = new THREE.Mesh(gateGeo, gateMat); g2.position.set(x, 0.3, 0);
        const g3 = new THREE.Mesh(gateGeo, gateMat); g3.position.set(x + 0.8, 0.3, 0);
        const g4 = new THREE.Mesh(gateGeo, gateMat); g4.position.set(x - 0.4, -0.3, 0); // Tanh
        
        group.add(g1, g2, g3, g4);

        // Cell State Line (Top)
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x - 1.5, 0.5, 0),
          new THREE.Vector3(x + 1.5, 0.5, 0)
        ]);
        group.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff })));
      }

      // Connecting Lines
      const connGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-dist * 1.5, 0, 0),
        new THREE.Vector3(dist * 1.5, 0, 0)
      ]);
      group.add(new THREE.Line(connGeo, new THREE.LineBasicMaterial({ color: 0xa855f7, opacity: 0.5, transparent: true })));

      return group;
    };

    // --- 4. Vision Transformer ---
    const createViT = () => {
      const group = new THREE.Group();
      
      // Image Patches (Grid)
      const gridSize = 3;
      const patchSize = 1.2;
      const gap = 0.2;
      
      for(let r=0; r<gridSize; r++) {
        for(let c=0; c<gridSize; c++) {
          const x = (c - 1) * (patchSize + gap);
          const y = (r - 1) * (patchSize + gap) - 3; // Bottom
          
          const geo = new THREE.PlaneGeometry(patchSize, patchSize);
          const mat = new THREE.MeshBasicMaterial({ 
            color: 0xec4899, 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: 0.6 
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, y, 0);
          group.add(mesh);

          // Projection Lines
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, 0),
            new THREE.Vector3(x * 0.5, 0, 0) // Converge slightly
          ]);
          const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xec4899, opacity: 0.2, transparent: true }));
          group.add(line);
        }
      }

      // Transformer Encoder Blocks
      const blockGeo = new THREE.BoxGeometry(5, 0.5, 3);
      const blockMat = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true });
      
      const b1 = new THREE.Mesh(blockGeo, blockMat); b1.position.set(0, 0.5, 0);
      const b2 = new THREE.Mesh(blockGeo, blockMat); b2.position.set(0, 1.5, 0);
      const b3 = new THREE.Mesh(blockGeo, blockMat); b3.position.set(0, 2.5, 0);
      
      group.add(b1, b2, b3);

      // Class Token
      const token = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      token.position.set(-3, -3, 0);
      group.add(token);
      
      // Token Line
      const tLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([token.position, new THREE.Vector3(-2.5, 0.5, 0)]),
        new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
      );
      group.add(tLine);

      return group;
    };

    // --- PLACE ARCHITECTURES IN CIRCLE ---
    const models = [createMLP(), createRNN(), createLSTM(), createViT()];
    const angleStep = (Math.PI * 2) / models.length;

    models.forEach((model, i) => {
      const angle = i * angleStep;
      // Position in circle
      model.position.set(
        Math.sin(angle) * RADIUS,
        0,
        Math.cos(angle) * RADIUS
      );
      // Rotate to face OUTWARDS from center
      model.lookAt(0, 0, 0);
      model.rotation.y += Math.PI; // Flip to face center? No, face camera which is outside?
      // Actually, let's make them face the center (0,0,0) so when we rotate the group, the one at Z=Radius faces the camera at Z=CameraZ
      
      carousel.add(model);
    });

    // --- STARS BACKGROUND ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 100;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(starGeo, starMat));

    // --- ANIMATION LOOP ---
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth Rotation
      carousel.rotation.y += (targetRotationRef.current - carousel.rotation.y) * 0.05;

      // Rotate individual models slightly
      models.forEach(m => {
        m.rotation.y += 0.002;
      });

      renderer.render(scene, camera);
    };
    animate();

    // --- RESIZE ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if(mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Handle Navigation
  const navigate = (direction) => {
    const newIndex = currentIndex + direction;
    setCurrentIndex(newIndex);
    
    // Calculate rotation: 
    // 4 items = 90 degrees (PI/2) per item.
    // If we go RIGHT (index increases), we rotate LEFT (negative Y).
    const angleStep = (Math.PI * 2) / ARCHITECTURES.length;
    targetRotationRef.current = -newIndex * angleStep;
  };

  // Get actual data index (modulo)
  const dataIndex = ((currentIndex % ARCHITECTURES.length) + ARCHITECTURES.length) % ARCHITECTURES.length;
  const currentArch = ARCHITECTURES[dataIndex];

  // Swipe Handling
  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) { 
      if (diff > 0) navigate(1); 
      else navigate(-1); 
    }
    touchStart.current = null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={mountRef} className="w-full h-full" />

      {/* UI OVERLAY */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-white tracking-widest">NEURAL EXPLORER</h2>
            <span className="text-xs font-mono text-slate-400">ARCH: {currentArch.name}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Center Info */}
        <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full px-4">
           <AnimatePresence mode='wait'>
             <motion.div
               key={dataIndex}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.3 }}
             >
               <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 select-none mb-2">
                 {currentArch.name}
               </h1>
               <p className="text-slate-400 font-mono text-sm md:text-base max-w-xl mx-auto leading-relaxed bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                 {currentArch.desc}
               </p>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pointer-events-auto w-full max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="p-4 rounded-full border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:scale-110 group"
          >
            <ChevronLeft size={32} className="text-white group-hover:text-cyan-400 transition-colors" />
          </button>

          <div className="flex flex-col items-center gap-2 animate-pulse">
             <RotateCw size={16} className="text-slate-500" />
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Rotate to Explore</span>
          </div>

          <button 
            onClick={() => navigate(1)}
            className="p-4 rounded-full border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:scale-110 group"
          >
            <ChevronRight size={32} className="text-white group-hover:text-purple-400 transition-colors" />
          </button>
        </div>

        {/* Progress Bar (Circular Logic) */}
        <div className="w-full max-w-md mx-auto h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((dataIndex + 1) / ARCHITECTURES.length) * 100}%` }}
          />
        </div>

      </div>
    </motion.div>
  );
};

export default GalaxyExplorer;