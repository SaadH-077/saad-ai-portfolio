import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ChevronDown, 
  ExternalLink,
  Code2, 
  Terminal, 
  Cpu, 
  Briefcase,
  GraduationCap,
  User,
  MapPin,
  Layers,
  Database,
  Brain,
  Eye,
  Layout,
  Server,
  Download,
  Zap,
  Activity,
  Globe,
  MousePointer2,
  Award,
  Cloud,
  Box,
  Bot,
  BarChart3,
  Wrench,
  MessageSquare,
  Trophy,
  Star,
  FileCode,
  Send,
  X,
  MessageCircle
} from 'lucide-react';

// --- GEMINI API INTEGRATION ---
const apiKey = ""; // API Key provided by environment

const RESUME_CONTEXT = `
You are the digital avatar of Muhammad Saad Haroon, an ML Focused Software Engineer and Agentic AI Developer based in Lahore, Pakistan.
Use the following resume data to answer questions. Be professional, concise, and technical.
- Current Role: Associate Software Engineer at GoSaaS, Inc. (Agentic AI Dept). Building "GoSaaS Financial AI" and Oracle Agent Studio bots.
- Education: BS Computer Science from LUMS (High Distinction, Dean's Honor List).
- Research: Research Assistant at CSALT Lab (NLP & GenAI). Co-authored "Kahaani" (multi-agent storytelling).
- Teaching: Head TA for Deep Learning (CS 437) at LUMS.
- Skills: Python, PyTorch, LangChain, RAG, Oracle Cloud, React.js, MERN, Computer Vision.
- Projects: Kahaani Agentic AI, SmartCourseAdvisor (RAG), EmployNet Portal, Vision3D Landmark Recon, Adaptive Entropy UDA.
- Tone: Futuristic, confident, engineering-focused.
`;

async function callGemini(prompt, systemInstruction = "") {
  if (!apiKey) {
    console.warn("API Key missing");
    return "System Error: Neural Link Offline (API Key Missing)";
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        }),
      }
    );

    if (!response.ok) throw new Error("Neural Link Failed");
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No signal received.";
  } catch (error) {
    console.error(error);
    return "Error: Connection Interrupted.";
  }
}

// --- 1. Global Background: Deep Space Gradient Starfield ---
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Galaxy Starfield
    const geometry = new THREE.BufferGeometry();
    const count = 4000;
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

// --- 2. HERO COMPONENT: The "Galaxy Neural Sphere" (Full Gradient) ---
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

// --- 3. NEW: HYPER-DIMENSIONAL MATRIX (Technical Arsenal) ---
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
    const cubeCount = 50;
    const instancedGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const instancedMat = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.5 });
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
    group.add(core);

    // Outer Rotating Rings
    const ringGeo = new THREE.TorusGeometry(5, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff00aa });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 2;
    group.add(ring1);
    group.add(ring2);

    const animate = () => {
      requestAnimationFrame(animate);
      
      group.rotation.y += 0.005;
      group.rotation.x += 0.002;
      
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

// --- 4. NEW: CYBER DNA HELIX (For About Section) ---
const CyberHelix = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 20;
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

    const particleCount = 200;
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
      helix.rotation.y += 0.02;
      helix.rotation.x = mouseRef.current.y * 0.2;
      helix.rotation.z = mouseRef.current.x * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateSize);
      if(mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full opacity-60" />;
};

// --- 5. INTERACTIVE 3D TIMELINE ---
const InteractiveTimeline = () => {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-30 md:left-1/2 md:-ml-[0.5px]">
        <motion.div 
            className="absolute top-0 left-0 w-full bg-white blur-sm"
            style={{ height: "20%" }} // Static glow for visual effect
            animate={{ top: ["0%", "80%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
    </div>
  );
};

// --- 6. HOLOGRAPHIC GLOBE (Contact) ---
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

// --- UI Helper Components ---

const TypewriterText = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink(!blink), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="font-mono text-cyan-300">
      {texts[index].substring(0, subIndex)}
      <span className={`text-white ml-1 ${blink ? "opacity-100" : "opacity-0"}`}>|</span>
    </span>
  );
};

const HoverCard = ({ children, className = "", onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  return (
    <div
      onMouseMove={onMouseMove}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#0a0a0c]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 group transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(189,0,255,0.1)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(189, 0, 255, 0.15), transparent 40%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030305]/80 backdrop-blur-lg border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse">
          SH
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold tracking-tight text-sm">SAAD HAROON</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-widest">ML FOCUSED SE</span>
        </div>
      </div>
      
      <div className="hidden md:flex gap-8 text-xs font-medium text-slate-400 font-mono">
        {['About', 'Experience', 'Skills', 'Projects', 'Awards', 'Contact'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition-colors uppercase">
            {item}
          </a>
        ))}
      </div>

      <a href="#contact" className="hidden sm:flex px-5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded border border-white/10 hover:border-purple-500/50 transition-all items-center gap-2">
        <Terminal size={14} /> CONTACT
      </a>
    </div>
  </nav>
);

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-24 px-6 relative z-10 ${className}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-16">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-2 text-purple-500 font-mono text-xs tracking-widest mb-2 uppercase"
    >
      <span className="w-12 h-[1px] bg-purple-500/50"></span>
      {subtitle}
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold text-white"
    >
      {title}
    </motion.h2>
  </div>
);

// --- NEW FEATURE 2: Holo-Comm Link (Chatbot) ---
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello. I am Saad's digital twin. Ask me about his experience with Agentic AI or his projects." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const prompt = `User asked: "${input}". Answer based on Saad's resume context provided.`;
    const responseText = await callGemini(prompt, RESUME_CONTEXT);
    
    setMessages(prev => [...prev, { role: "ai", text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-sm font-bold text-white">Holo-Comm Link</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                 <div className="flex justify-start">
                   <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                   </div>
                 </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-[#050508]">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about projects..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input}
                  className="p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white shadow-lg shadow-purple-500/25 hover:scale-110 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

// --- 6. Main App ---

const App = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'AI/ML', 'NLP', 'Computer Vision', 'Software Engineering'];

  const projects = [
    {
      title: "Kahaani Agentic AI",
      desc: "Multi-agent Generative AI framework orchestrating LLMs, TTS, and TTV models to generate culturally relevant Urdu stories with automated content safety.",
      tags: ["Python", "LangChain", "GenAI", "Research"],
      category: "NLP",
      icon: Brain,
      color: "purple",
      link: "https://github.com/SaadH-077"
    },
    {
      title: "SmartCourseAdvisor",
      desc: "RAG-based academic advisor using Mistral-7B and ChromaDB. Provides personalized university course recommendations based on student history.",
      tags: ["RAG", "Mistral-7B", "ChromaDB", "Gradio"],
      category: "AI/ML",
      icon: Database,
      color: "pink",
      link: "https://github.com/SaadH-077/SmartCourseAdvisor-RAG"
    },
    {
      title: "EmployNet Portal",
      desc: "Full-stack HR management system enabling companies to automate payroll, attendance, and benefits. Features role-based access control.",
      tags: ["MERN Stack", "React.js", "Node.js", "MongoDB"],
      category: "Software Engineering",
      icon: Layout,
      color: "cyan",
      link: "https://github.com/SaadH-077/EmployNet"
    },
    {
      title: "Vision3D Landmark Recon",
      desc: "3D reconstruction pipeline using SIFT features and triangulation to generate 3D point clouds from 2D multi-view images.",
      tags: ["Computer Vision", "Python", "OpenCV", "3D"],
      category: "Computer Vision",
      icon: Eye,
      color: "green",
      link: "https://github.com/SaadH-077/Vision3D-Landmark-Recon"
    },
    {
      title: "Adaptive Entropy UDA",
      desc: "Novel Domain Adaptation framework using entropy-guided pseudo-labeling to improve model performance on unseen data distributions.",
      tags: ["PyTorch", "Deep Learning", "Research"],
      category: "AI/ML",
      icon: Layers,
      color: "purple",
      link: "https://github.com/SaadH-077/Adaptive-Entropy-Guided-Universal-Domain-Adaptation"
    }
  ];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => {
        if (activeCategory === 'AI/ML') return ['AI/ML', 'NLP', 'Computer Vision'].includes(p.category);
        return p.category === activeCategory;
      });

  const technicalSkills = [
    { 
      category: "Programming Languages", 
      items: ["Python", "C/C++", "SQL", "HTML/CSS", "JavaScript"], 
      icon: Code2, 
      color: "cyan" 
    },
    { 
      category: "Machine Learning & Deep Learning", 
      items: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "FastAI", "OpenCV"], 
      icon: Brain, 
      color: "purple" 
    },
    { 
      category: "Natural Language Processing (NLP)", 
      items: ["LLMs", "Sentiment Analysis", "Prompt Engineering", "Transformers"], 
      icon: MessageSquare, 
      color: "pink" 
    },
    { 
      category: "Multimodal AI", 
      items: ["RAG", "LangChain", "Mistral", "Whisper", "TTS", "TTV"], 
      icon: Zap, 
      color: "blue" 
    },
    { 
      category: "Computer Vision", 
      items: ["Vision Transformers (ViTs)", "GANs", "CycleGANs", "GNNs", "Object Detection", "Semantic Segmentation"], 
      icon: Eye, 
      color: "green" 
    },
    { 
      category: "Data Analysis & Visualization", 
      items: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Tableau", "Power BI"], 
      icon: BarChart3, 
      color: "yellow" 
    },
    { 
      category: "Development Tools & Frameworks", 
      items: ["Gradio", "Flask", "Streamlit", "React.js", "MERN", "MongoDB", "CI/CD", "n8n", "Microsoft Azure"], 
      icon: Wrench, 
      color: "orange" 
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#050508] via-[#0b0b15] to-[#050508] text-slate-200 min-h-screen font-sans selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
      <NeuralBackground />
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen relative z-10 flex flex-col pt-24 lg:pt-0 overflow-hidden bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full h-full relative items-center">
            
            {/* Left: Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center px-6 z-20 pointer-events-none lg:pointer-events-auto"
            >
              <div className="flex items-center gap-4 mb-8 opacity-70">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-purple-500" />
                <div className="text-[10px] font-mono text-purple-400 tracking-[0.2em] uppercase">
                  System: Online
                </div>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-purple-500 to-transparent max-w-[100px]" />
              </div>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded border border-purple-500/30 bg-purple-900/20 text-purple-300 text-xs font-mono mb-8 w-fit backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Activity size={12} className="animate-pulse text-purple-400" />
                <span>OPEN FOR COLLABORATION</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                SAAD<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">.AI</span> <br />
                <span className="text-2xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 tracking-normal block mt-2">
                  PERSONAL PORTFOLIO SYSTEM
                </span>
              </h1>
              
              <div className="flex items-center gap-4 text-xl md:text-2xl font-light text-slate-300 mb-8 h-10 font-mono">
                <span className="text-purple-500">{'>'}</span>
                <TypewriterText texts={["Architecting Agents...", "Optimizing Models...", "Building Systems..."]} />
              </div>

              <p className="text-lg text-slate-400 leading-relaxed max-w-lg mb-10 border-l-4 border-purple-500/50 pl-6 bg-gradient-to-r from-purple-900/10 to-transparent py-4 rounded-r-xl">
                I am <strong className="text-white">Muhammad Saad Haroon</strong>. 
                I bridge the gap between AI research and scalable production, engineering 
                <strong> Autonomous Systems</strong> that think, plan, and execute.
              </p>

              <div className="flex flex-wrap gap-4 pointer-events-auto">
                <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2">
                  Explore Systems <ExternalLink size={18} />
                </a>
                <a href="#contact" className="px-8 py-4 border border-slate-700 text-white font-medium rounded hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center gap-2 backdrop-blur-md">
                   Initialize Chat
                </a>
              </div>
            </motion.div>

            {/* Right: 3D Interactive */}
            <div className="absolute inset-0 lg:static lg:flex lg:items-center lg:justify-center z-10 pointer-events-auto">
              <div className="w-full h-full lg:h-[800px] relative flex items-center justify-center">
                <div className="w-full h-[500px] md:h-[700px]">
                   <HeroAgenticBrain />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent lg:hidden pointer-events-none" />
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute bottom-10 right-10 text-xs font-mono text-purple-500/70 flex items-center gap-2 bg-black/50 px-3 py-1 rounded border border-purple-900/50 backdrop-blur-sm"
                >
                  <MousePointer2 size={14} />
                  CLICK CORE TO SCATTER
                </motion.div>
              </div>
            </div>

          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 z-20"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Scan</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" />
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <Section id="about" className="relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
          <SectionHeading title="Developer Profile" subtitle="IDENTIFICATION" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            <div className="lg:col-span-5 relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative bg-[#0a0a0c]/90 border border-white/10 rounded-2xl p-6 overflow-hidden transform transition-transform group-hover:scale-[1.01] duration-500">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <span className="font-mono text-xs text-cyan-400">ID: SH-2025</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  </div>
                </div>

                <div className="w-full aspect-square bg-gradient-to-b from-slate-800 to-black rounded-xl mb-6 relative overflow-hidden group-inner border border-white/5">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col">
                    <User size={64} className="mb-2 opacity-50" />
                    <span className="text-xs font-mono text-slate-500">IMG_SOURCE_NOT_FOUND</span>
                    <span className="text-[10px] mt-1 text-slate-700">src/assets/profile.jpg</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-4 w-full animate-scan" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Name</span>
                    <p className="text-white font-bold tracking-wide">Saad Haroon</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Role</span>
                    <p className="text-white font-bold tracking-wide">ML Focused SE</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Location</span>
                    <p className="text-slate-300 flex items-center gap-1"><MapPin size={12} className="text-cyan-500"/> Lahore, PK</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Education</span>
                    <p className="text-slate-300 flex items-center gap-1"><GraduationCap size={12} className="text-purple-500"/> LUMS</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8 relative">
              <div className="absolute top-0 right-0 w-1/2 h-full -z-10 pointer-events-none">
                 <CyberHelix />
              </div>

              <h3 className="text-3xl font-bold text-white">Engineering Intelligent Systems</h3>
              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  I am a passionate software engineer with a deep focus on bridging the gap between theoretical Machine Learning and production-grade Software Engineering.
                </p>
                <p>
                  Graduating with <span className="text-cyan-400 font-medium">High Distinction</span> from <strong>LUMS</strong>, I have spent the last few years architecting multi-agent systems, optimizing deep learning pipelines, and teaching advanced AI concepts.
                </p>
                <p>
                  Currently, I engineer enterprise-grade financial agents that automate complex workflows, saving thousands of operational hours.
                </p>
              </div>
              
              <div className="flex gap-4">
                 <a href="/cv.pdf" className="group px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-white font-medium flex items-center gap-2 transition-all hover:border-purple-500/50">
                   <Download size={18} className="group-hover:text-purple-400 transition-colors" /> Download CV
                 </a>
              </div>
            </div>
          </div>
        </Section>

        {/* EXPERIENCE SECTION */}
        <Section id="experience">
          <SectionHeading title="Professional Log" subtitle="TIMELINE" />

          <div className="relative space-y-16">
            <InteractiveTimeline />
            
            <div className="relative pl-12 md:pl-0 md:flex md:justify-between items-center group">
              <div className="absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-[#050508] border-4 border-cyan-500 z-10 shadow-[0_0_10px_cyan] group-hover:scale-125 transition-transform" />
              <div className="md:w-[45%] md:text-right mb-2 md:mb-0 md:pr-12">
                <span className="font-mono text-cyan-300 text-xs bg-cyan-900/20 border border-cyan-900/50 px-3 py-1 rounded">JUL 2025 - PRESENT</span>
              </div>
              <div className="md:w-[45%] md:pl-12">
                <HoverCard>
                  <h3 className="text-lg font-bold text-white">Associate Software Engineer</h3>
                  <p className="text-sm text-slate-500 mb-4 font-mono">GoSaaS, Inc. | Agentic AI Dept</p>
                  <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
                    <li>Architecting <strong>"GoSaaS Financial AI"</strong> using Oracle Agent Studio.</li>
                    <li>Automating quarterly MD&A reports, reducing latency by 40%.</li>
                    <li>Designing predictive dashboards in Oracle Analytics Cloud.</li>
                  </ul>
                </HoverCard>
              </div>
            </div>

            <div className="relative pl-12 md:pl-0 md:flex md:flex-row-reverse md:justify-between items-center group">
              <div className="absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-[#050508] border-4 border-purple-500 z-10 shadow-[0_0_10px_purple] group-hover:scale-125 transition-transform" />
              <div className="md:w-[45%] md:text-left mb-2 md:mb-0 md:pl-12">
                <span className="font-mono text-purple-300 text-xs bg-purple-900/20 border border-purple-900/50 px-3 py-1 rounded">JAN 2025 - JUN 2025</span>
              </div>
              <div className="md:w-[45%] md:pr-12 text-left md:text-right">
                <HoverCard>
                  <h3 className="text-lg font-bold text-white">Head Teaching Assistant</h3>
                  <p className="text-sm text-slate-500 mb-4 font-mono">LUMS | Deep Learning (CS 437)</p>
                  <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
                    <li>Managed 160+ students & graduate TA team.</li>
                    <li>Designed modules on <strong>ViTs, GANs, Neural Compression</strong>.</li>
                    <li>Mentored 40+ capstone AI projects.</li>
                  </ul>
                </HoverCard>
              </div>
            </div>

            <div className="relative pl-12 md:pl-0 md:flex md:justify-between items-center group">
              <div className="absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-[#050508] border-4 border-pink-500 z-10 shadow-[0_0_10px_pink] group-hover:scale-125 transition-transform" />
              <div className="md:w-[45%] md:text-right mb-2 md:mb-0 md:pr-12">
                <span className="font-mono text-pink-300 text-xs bg-pink-900/20 border border-pink-900/50 px-3 py-1 rounded">SEP 2022 - JUN 2025</span>
              </div>
              <div className="md:w-[45%] md:pl-12">
                <HoverCard>
                  <h3 className="text-lg font-bold text-white">Research Assistant</h3>
                  <p className="text-sm text-slate-500 mb-4 font-mono">CSALT Lab | NLP & GenAI</p>
                  <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
                    <li>Co-authored <strong>"Kahaani"</strong> multi-agent framework.</li>
                    <li>Integrated LLMs, TTS, and TTV for Urdu narrative generation.</li>
                    <li>Implemented child-safety guardrails.</li>
                  </ul>
                </HoverCard>
              </div>
            </div>

          </div>
        </Section>

        {/* NEW: SKILLS & CERTIFICATIONS SECTION */}
        <Section id="skills" className="relative">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
          <SectionHeading title="Technical Arsenal" subtitle="CAPABILITIES" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: 3D HyperMatrix */}
            <div className="lg:col-span-4 h-[400px] relative flex items-center justify-center">
               <HyperMatrix />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                   <Cpu size={40} className="text-cyan-400 mx-auto mb-2 animate-pulse" />
                   <span className="text-xs font-mono text-cyan-500 tracking-widest">CORE_SYSTEMS</span>
                 </div>
               </div>
            </div>

            {/* Right: Categorized Skills Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {technicalSkills.map((skillGroup, idx) => (
                <HoverCard key={idx} className={`border-${skillGroup.color}-500/20 bg-${skillGroup.color}-900/5`}>
                  <div className={`flex items-center gap-3 mb-4 text-${skillGroup.color}-400`}>
                    <skillGroup.icon size={20} />
                    <h3 className="font-bold text-white">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map(s => (
                      <span key={s} className={`px-2 py-1 bg-${skillGroup.color}-900/20 border border-${skillGroup.color}-500/30 rounded text-xs text-${skillGroup.color}-300 hover:bg-${skillGroup.color}-500/20 transition-colors cursor-default`}>{s}</span>
                    ))}
                  </div>
                </HoverCard>
              ))}

              {/* Certifications - Full Width */}
              <div className="md:col-span-2">
                <HoverCard className="border-yellow-500/20 bg-yellow-900/5">
                  <div className="flex items-center gap-3 mb-4 text-yellow-400">
                    <Award size={20} />
                    <h3 className="font-bold text-white">Certifications</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Oracle Fusion AI Agent Studio Associate',
                      'Oracle Analytics Cloud 2025 Professional',
                      'Oracle Cloud Infrastructure GenAI Professional',
                      'Supervised Machine Learning: Regression'
                    ].map(c => (
                      <div key={c} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        {c}
                      </div>
                    ))}
                  </div>
                </HoverCard>
              </div>

            </div>
          </div>
        </Section>

        {/* NEW: HONORS & AWARDS SECTION */}
        <Section id="awards" className="relative">
          <SectionHeading title="Honors & Recognitions" subtitle="ACHIEVEMENTS" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Dean's Honor List", desc: "2021-22, 2022-23", icon: Star, color: "yellow" },
              { title: "Runner Up", desc: "Pakistan Young Physicist's Tournament (PYPT)", icon: Trophy, color: "purple" },
              { title: "Winner", desc: "Punjab Young Physicist's Tournament (PuYPT)", icon: Trophy, color: "cyan" },
              { title: "Full Merit Scholarship", desc: "100% A-Levels Scholarship", icon: Award, color: "green" }
            ].map((award, i) => (
              <HoverCard key={i} className={`border-${award.color}-500/20 bg-${award.color}-900/5 text-center group`}>
                <div className={`w-12 h-12 rounded-full bg-${award.color}-500/10 flex items-center justify-center mx-auto mb-4 text-${award.color}-400 group-hover:scale-110 transition-transform`}>
                  <award.icon size={24} />
                </div>
                <h3 className="font-bold text-white mb-2">{award.title}</h3>
                <p className="text-xs text-slate-400">{award.desc}</p>
              </HoverCard>
            ))}
          </div>
        </Section>

        {/* PROJECTS SECTION */}
        <Section id="projects" className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-purple-900/5 to-cyan-900/5 pointer-events-none" />
          <SectionHeading title="System Blueprints" subtitle="PROJECTS" />
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all border ${
                  activeCategory === cat 
                    ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <HoverCard className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${project.color}-500/10 text-${project.color}-400`}>
                        <project.icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded text-slate-500 uppercase">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                      {project.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a 
                      href={project.link} 
                      target="_blank"
                      className="mt-auto w-full py-2 border border-slate-700 rounded flex items-center justify-center gap-2 text-sm text-white hover:bg-white hover:text-black transition-all font-bold group/btn"
                    >
                      <Github size={16} className="group-hover/btn:text-black transition-colors" /> View Code
                    </a>
                  </HoverCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Section>

        {/* CONTACT SECTION */}
        <Section id="contact">
          <div className="max-w-4xl mx-auto text-center relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10 opacity-50 pointer-events-none">
                <HolographicGlobe />
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
             <SectionHeading title="Let's Build the Future" subtitle="CONTACT" />
            
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              I am open to discussing technical collaborations, AI research, or complex engineering challenges.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
              <a 
                href="mailto:saadharoonjehangir@gmail.com"
                className="group px-8 py-5 bg-[#0a0a0c] border border-slate-700 rounded-xl hover:border-purple-500 transition-all hover:scale-105 flex items-center gap-3 text-white font-bold text-lg justify-center"
              >
                <Mail className="text-purple-400 group-hover:text-purple-300 transition-colors" /> Send Email
              </a>
              
              <a 
                href="https://www.linkedin.com/in/muhammad-saad-haroon-5b38a1241/"
                target="_blank"
                className="group px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/30 flex items-center gap-3 text-white font-bold text-lg justify-center"
              >
                <Linkedin className="text-white" /> LinkedIn
              </a>
            </div>

            <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-mono">
              <span>LAHORE, PAKISTAN</span>
              <span>© {new Date().getFullYear()} MUHAMMAD SAAD HAROON</span>
            </div>
          </div>
        </Section>
      </main>

      <ChatWidget />
    </div>
  );
};

export default App;