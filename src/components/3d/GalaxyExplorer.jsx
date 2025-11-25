import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, X, MousePointer2, RotateCw, Play, Pause } from 'lucide-react';
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
    name: "RECURRENT NEURAL NETWORK (RNN)", 
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
  },
  {
    id: 4,
    name: "CONVOLUTIONAL NEURAL NETWORK (CNN)",
    desc: "Specialized for image processing. Uses convolutional filters to automatically learn spatial hierarchies of features.",
    color: "#f59e0b"
  },
  {
    id: 5,
    name: "AUTOENCODER",
    desc: "Unsupervised learning model that learns efficient data codings by training the network to ignore signal 'noise'.",
    color: "#6366f1"
  },
  {
    id: 6,
    name: "GENERATIVE ADVERSARIAL NETWORK (GAN)",
    desc: "Two neural networks contesting with each other: a Generator creating data and a Discriminator evaluating it.",
    color: "#ef4444"
  }
];

const createTextSprite = (text, color = 'white', scale = 1) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1024; // Higher res
  canvas.height = 256;
  ctx.fillStyle = color;
  ctx.font = 'bold 80px monospace'; // Larger font
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 10;
  ctx.fillText(text, 512, 128);
  
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true, 
    opacity: 1, 
    depthTest: false, // Always on top
    depthWrite: false 
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(8 * scale, 2 * scale, 1); 
  sprite.renderOrder = 9999; // Ensure it renders last (on top)
  return sprite;
};

const createLabelLine = (start, end, color) => {
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
  return new THREE.Line(geometry, material);
};

const GalaxyExplorer = ({ onClose }) => {
  const mountRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const isSimulatingRef = useRef(false);
  const carouselRef = useRef(null);
  const targetRotationRef = useRef(0);
  const modelsRef = useRef([]);
  const particlesRef = useRef([]); // Store simulation particles

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    // Lighter fog to prevent "dullness" on mobile where camera is far
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Add Camera Light for better visibility
    const camLight = new THREE.PointLight(0xffffff, 1.5, 100);
    camera.add(camLight);
    scene.add(camera);

    // Initial Camera Position (Responsive)
    const updateCameraPos = () => {
      const isMobile = window.innerWidth < 768;
      // Increased Z distance for mobile to prevent cutting off
      camera.position.set(0, isMobile ? 0 : 2, isMobile ? 42 : 28); 
    };
    updateCameraPos();
    
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const carousel = new THREE.Group();
    carouselRef.current = carousel;
    scene.add(carousel);

    const RADIUS = 16;

    // --- 1. MLP (Feedforward) ---
    const createMLP = () => {
      const group = new THREE.Group();
      group.userData = { type: 'MLP', layers: [], connections: [] };
      
      const layers = [4, 5, 5, 3];
      const layerDist = 3.5;
      const nodeDist = 1.2;
      const nodes = [];

      // Labels
      const l1 = createTextSprite("Input Layer", "#22c55e"); l1.position.set(-5.5, 4, 0); group.add(l1);
      const l2 = createTextSprite("Hidden Layers", "#22c55e"); l2.position.set(0, 5, 0); group.add(l2);
      const l3 = createTextSprite("Output", "#22c55e"); l3.position.set(5.5, 4, 0); group.add(l3);

      // Specific Labels
      const neuronLabel = createTextSprite("Neuron (Activation)", "#ffffff", 0.7);
      neuronLabel.position.set(-2, -4, 0);
      group.add(neuronLabel);
      // Line to a node
      group.add(createLabelLine(new THREE.Vector3(-2, -3.5, 0), new THREE.Vector3(-1.75, -1.5, 0), 0xffffff));


      layers.forEach((count, lIndex) => {
        const layerNodes = [];
        const layerGroup = new THREE.Group(); 
        group.add(layerGroup);
        group.userData.layers.push(layerGroup);

        for(let i=0; i<count; i++) {
          const y = (i - (count-1)/2) * nodeDist;
          const x = (lIndex - (layers.length-1)/2) * layerDist;
          
          const geo = new THREE.SphereGeometry(0.35, 16, 16);
          const mat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, y, 0);
          layerGroup.add(mesh);
          layerNodes.push(mesh);
        }
        nodes.push(layerNodes);
      });

      const lineMat = new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.1 });
      for(let l=0; l<layers.length-1; l++) {
        nodes[l].forEach(n1 => {
          nodes[l+1].forEach(n2 => {
            const pts = [n1.position, n2.position];
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const line = new THREE.Line(geo, lineMat);
            group.add(line);
            group.userData.connections.push({ start: n1.position, end: n2.position });
          });
        });
      }
      return group;
    };

    // --- 2. RNN ---
    const createRNN = () => {
      const group = new THREE.Group();
      group.userData = { type: 'RNN', steps: [], connections: [] };
      
      const timeSteps = 5;
      const stepDist = 3;
      
      const hiddens = [];

      // Labels
      const timeLabel = createTextSprite("Time Steps (t)", "#06b6d4"); timeLabel.position.set(0, -4.5, 0); group.add(timeLabel);
      const memLabel = createTextSprite("Hidden State (Memory)", "#06b6d4"); memLabel.position.set(0, 4.5, 0); group.add(memLabel);

      // Detailed Labels
      const inputLabel = createTextSprite("Input Vector (x)", "#ffffff", 0.6);
      inputLabel.position.set(-4.5, -2.5, 0);
      group.add(inputLabel);
      
      const outputLabel = createTextSprite("Output Vector (y)", "#ffffff", 0.6);
      outputLabel.position.set(-4.5, 2.5, 0);
      group.add(outputLabel);

      const recLabel = createTextSprite("Recurrent Weight", "#ffffff", 0.5);
      recLabel.position.set(2, 1.5, 0);
      group.add(recLabel);

      for(let t=0; t<timeSteps; t++) {
        const stepGroup = new THREE.Group();
        group.add(stepGroup);
        group.userData.steps.push(stepGroup);

        const x = (t - (timeSteps-1)/2) * stepDist;
        
        // Input
        const input = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true }));
        input.position.set(x, -2.5, 0);
        stepGroup.add(input);

        // Hidden
        const hidden = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
        hidden.position.set(x, 0, 0);
        stepGroup.add(hidden);
        hiddens.push(hidden);

        // Output
        const output = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        output.position.set(x, 2.5, 0);
        stepGroup.add(output);

        // Vertical Lines
        const lineGeo = new THREE.BufferGeometry().setFromPoints([input.position, hidden.position, output.position]);
        stepGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x06b6d4, opacity: 0.4, transparent: true })));
        
        // Store for simulation
        group.userData.connections.push({ type: 'vertical', input: input.position, hidden: hidden.position, output: output.position });
      }

      // Recurrent Connections
      const recMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, opacity: 0.8, transparent: true });
      for(let t=0; t<timeSteps-1; t++) {
        const pts = [hiddens[t].position, hiddens[t+1].position];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        group.add(new THREE.Line(geo, recMat));
        
        // Arrow
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 8), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
        cone.position.set(hiddens[t].position.x + stepDist/2, 0, 0);
        cone.rotation.z = -Math.PI / 2;
        group.add(cone);

        group.userData.connections.push({ type: 'recurrent', start: hiddens[t].position, end: hiddens[t+1].position });
      }

      return group;
    };

    // --- 3. LSTM ---
    const createLSTM = () => {
      const group = new THREE.Group();
      group.userData = { type: 'LSTM', cells: [], gates: [] };
      
      const cells = 3;
      const dist = 4;

      // Labels
      const cellLabel = createTextSprite("LSTM Cell", "#a855f7");
      cellLabel.position.set(0, 3.5, 0);
      group.add(cellLabel);

      // Detailed Gate Labels (on the first cell)
      const firstCellX = -4;
      
      const fGate = createTextSprite("Forget Gate", "#ff5555", 0.5);
      fGate.position.set(firstCellX - 1.5, 1.5, 0);
      group.add(fGate);
      group.add(createLabelLine(new THREE.Vector3(firstCellX - 1.5, 1.2, 0), new THREE.Vector3(firstCellX - 0.8, 0.5, 0), 0xff5555));

      const iGate = createTextSprite("Input Gate", "#55ff55", 0.5);
      iGate.position.set(firstCellX, 1.5, 0);
      group.add(iGate);
      group.add(createLabelLine(new THREE.Vector3(firstCellX, 1.2, 0), new THREE.Vector3(firstCellX, 0.5, 0), 0x55ff55));

      const oGate = createTextSprite("Output Gate", "#5555ff", 0.5);
      oGate.position.set(firstCellX + 1.5, 1.5, 0);
      group.add(oGate);
      group.add(createLabelLine(new THREE.Vector3(firstCellX + 1.5, 1.2, 0), new THREE.Vector3(firstCellX + 0.8, 0.5, 0), 0x5555ff));

      const stateLabel = createTextSprite("Cell State Highway", "#ffffff", 0.6);
      stateLabel.position.set(0, 1.5, 0); 
      group.add(stateLabel);

      for(let i=0; i<cells; i++) {
        const cellGroup = new THREE.Group();
        group.add(cellGroup);
        group.userData.cells.push(cellGroup);

        const x = (i - (cells-1)/2) * dist;
        
        // Cell Block
        const cellGeo = new THREE.BoxGeometry(2.5, 1.5, 1);
        const cellMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.2, wireframe: true });
        const cell = new THREE.Mesh(cellGeo, cellMat);
        cell.position.set(x, 0, 0);
        cellGroup.add(cell);

        // Gates (Sigmoid/Tanh)
        const gateGeo = new THREE.CircleGeometry(0.3, 16);
        const gateMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide });
        
        const g1 = new THREE.Mesh(gateGeo, gateMat.clone()); g1.position.set(x - 0.8, 0.3, 0); g1.material.color.setHex(0xff5555);
        const g2 = new THREE.Mesh(gateGeo, gateMat.clone()); g2.position.set(x, 0.3, 0); g2.material.color.setHex(0x55ff55);
        const g3 = new THREE.Mesh(gateGeo, gateMat.clone()); g3.position.set(x + 0.8, 0.3, 0); g3.material.color.setHex(0x5555ff);
        const g4 = new THREE.Mesh(gateGeo, gateMat.clone()); g4.position.set(x - 0.4, -0.3, 0); // Tanh
        
        cellGroup.add(g1, g2, g3, g4);
        // Store gates for simulation (just store the first cell's gates for simplicity or all)
        if (i === 0) group.userData.gates = [g1, g2, g3]; // Store first cell gates for reference

        // Cell State Line (Top)
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x - 1.5, 0.5, 0),
          new THREE.Vector3(x + 1.5, 0.5, 0)
        ]);
        cellGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff })));
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
      group.userData = { type: 'ViT', parts: {} };
      
      const gridSize = 3;
      const patchSize = 1.5;
      const gap = 0.3;
      
      const patchesGroup = new THREE.Group();
      group.add(patchesGroup);
      group.userData.parts.patches = patchesGroup;

      // Labels
      const pLabel = createTextSprite("Patch Embeddings", "#ec4899"); pLabel.position.set(0, -4.5, 0); group.add(pLabel);
      const eLabel = createTextSprite("Transformer Encoder", "#ec4899"); eLabel.position.set(0, 4.5, 0); group.add(eLabel);
      const saLabel = createTextSprite("Self-Attention", "#ffffff", 0.6); saLabel.position.set(4, 1.5, 0); group.add(saLabel);
      group.add(createLabelLine(new THREE.Vector3(4, 1.5, 0), new THREE.Vector3(2.5, 1.5, 0), 0xffffff));

      // Detailed Labels
      const tokenLabel = createTextSprite("Class Token", "#ffffff", 0.6);
      tokenLabel.position.set(-5.5, -2, 0);
      group.add(tokenLabel);
      group.add(createLabelLine(new THREE.Vector3(-5.5, -2.3, 0), new THREE.Vector3(-4, -3, 0), 0xffffff));

      const posLabel = createTextSprite("Positional Embeddings", "#ffffff", 0.5);
      posLabel.position.set(4, -3, 0);
      group.add(posLabel);
      group.add(createLabelLine(new THREE.Vector3(4, -3, 0), new THREE.Vector3(2, -3, 0), 0xffffff));

      // Patches
      for(let r=0; r<gridSize; r++) {
        for(let c=0; c<gridSize; c++) {
          const x = (c - 1) * (patchSize + gap);
          const y = (r - 1) * (patchSize + gap) - 3; 
          
          const geo = new THREE.PlaneGeometry(patchSize, patchSize);
          const mat = new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, y, 0);
          patchesGroup.add(mesh);
        }
      }

      // Encoder Blocks
      const blocksGroup = new THREE.Group();
      group.add(blocksGroup);
      group.userData.parts.blocks = blocksGroup;

      const blockGeo = new THREE.BoxGeometry(6, 0.6, 3);
      const blockMat = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true });
      
      [0.5, 1.5, 2.5].forEach(y => {
        const b = new THREE.Mesh(blockGeo, blockMat);
        b.position.set(0, y, 0);
        blocksGroup.add(b);
      });

      // Class Token
      const token = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      token.position.set(-4, -3, 0);
      group.add(token);
      group.userData.parts.token = token;
      
      // Token Line
      group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([token.position, new THREE.Vector3(-3, 0.5, 0)]),
        new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
      ));

      return group;
    };

    // --- 5. CNN ---
    const createCNN = () => {
      const group = new THREE.Group();
      group.userData = { type: 'CNN', layers: [] };
      
      // Compact Layout
      const inputX = -4;
      const convX = [-2, 0, 2];
      const fcX = 4;

      // Labels
      const inputLabel = createTextSprite("Input", "#f59e0b"); inputLabel.position.set(inputX, -3.5, 0); group.add(inputLabel);
      const convLabel = createTextSprite("Conv Layers", "#f59e0b"); convLabel.position.set(0, 4, 0); group.add(convLabel);
      const fcLabel = createTextSprite("Fully Connected", "#f59e0b"); fcLabel.position.set(fcX, 3, 0); group.add(fcLabel);

      // 1. Input Image
      const inputGeo = new THREE.BoxGeometry(0.1, 4, 4);
      const inputMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
      const input = new THREE.Mesh(inputGeo, inputMat);
      input.position.set(inputX, 0, 0);
      group.add(input);
      group.userData.layers.push(input);

      // 2. Conv Layers (Shrinking planes)
      const convConfigs = [
        { x: convX[0], size: 3.5, count: 3, color: 0xf59e0b },
        { x: convX[1], size: 2.5, count: 5, color: 0xf59e0b },
        { x: convX[2], size: 1.5, count: 8, color: 0xf59e0b }
      ];

      convConfigs.forEach(conf => {
        const layerGroup = new THREE.Group();
        group.add(layerGroup);
        group.userData.layers.push(layerGroup);
        
        for(let i=0; i<conf.count; i++) {
          const offset = (i - (conf.count-1)/2) * 0.2;
          const geo = new THREE.BoxGeometry(0.1, conf.size, conf.size);
          const mat = new THREE.MeshBasicMaterial({ color: conf.color, transparent: true, opacity: 0.4, wireframe: true });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(conf.x + offset, 0, 0);
          layerGroup.add(mesh);
        }
      });

      // 3. FC Layers (Spheres)
      const fcGroup = new THREE.Group();
      group.add(fcGroup);
      group.userData.layers.push(fcGroup);
      
      for(let i=0; i<5; i++) {
        const y = (i - 2) * 0.8;
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        sphere.position.set(fcX, y, 0);
        fcGroup.add(sphere);
      }

      // Connections (Conv -> FC)
      const lineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, opacity: 0.2, transparent: true });
      const lastConvX = convX[2];
      for(let i=0; i<5; i++) {
        const y = (i - 2) * 0.8;
        const pts = [new THREE.Vector3(lastConvX, 0, 0), new THREE.Vector3(fcX, y, 0)];
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
      }

      return group;
    };

    // --- 6. AutoEncoder ---
    const createAutoEncoder = () => {
      const group = new THREE.Group();
      group.userData = { type: 'AutoEncoder', layers: [] };

      // Labels
      const encLabel = createTextSprite("Encoder", "#6366f1"); encLabel.position.set(-3, 4, 0); group.add(encLabel);
      const latLabel = createTextSprite("Latent Space", "#ffffff", 0.7); latLabel.position.set(0, -2.5, 0); group.add(latLabel);
      const decLabel = createTextSprite("Decoder", "#6366f1"); decLabel.position.set(3, 4, 0); group.add(decLabel);

      const layerSizes = [5, 3, 1, 3, 5]; // Hourglass
      const xSpacing = 2.5;
      const ySpacing = 1.2;

      const layers = [];

      layerSizes.forEach((size, lIndex) => {
        const layerGroup = new THREE.Group();
        group.add(layerGroup);
        layers.push(layerGroup);
        group.userData.layers.push(layerGroup);

        const x = (lIndex - 2) * xSpacing;
        
        for(let i=0; i<size; i++) {
          const y = (i - (size-1)/2) * ySpacing;
          const isBottleneck = size === 1;
          
          const geo = isBottleneck ? new THREE.BoxGeometry(0.8, 0.8, 0.8) : new THREE.SphereGeometry(0.4, 16, 16);
          const color = isBottleneck ? 0xffffff : 0x6366f1;
          const mat = new THREE.MeshBasicMaterial({ color: color });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, y, 0);
          layerGroup.add(mesh);
        }
      });

      // Connections
      const lineMat = new THREE.LineBasicMaterial({ color: 0x6366f1, opacity: 0.15, transparent: true });
      for(let l=0; l<layers.length-1; l++) {
        layers[l].children.forEach(n1 => {
          layers[l+1].children.forEach(n2 => {
            const pts = [n1.position, n2.position];
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
          });
        });
      }

      return group;
    };

    // --- 7. GAN ---
    const createGAN = () => {
      const group = new THREE.Group();
      group.userData = { type: 'GAN', parts: {} };

      // Labels
      const genLabel = createTextSprite("Generator", "#ef4444"); genLabel.position.set(-5, 4.5, 0); group.add(genLabel);
      const discLabel = createTextSprite("Discriminator", "#ef4444"); discLabel.position.set(5, 4.5, 0); group.add(discLabel);
      
      // Generator Side
      const noise = new THREE.Group();
      for(let i=0; i<8; i++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xaaaaaa }));
        m.position.set((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5));
        noise.add(m);
      }
      noise.position.set(-7, 0, 0);
      group.add(noise);
      group.add(createTextSprite("Noise", "#aaaaaa", 0.5).translateY(-1.5).translateX(-7));

      const genNet = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.5, 3, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, side: THREE.DoubleSide }));
      genNet.rotation.z = -Math.PI / 2;
      genNet.position.set(-4, 0, 0);
      group.add(genNet);

      // Fake Image
      const fakeImg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide }));
      fakeImg.position.set(-1, 0, 0);
      group.add(fakeImg);
      group.userData.parts.fakeImg = fakeImg;
      group.add(createTextSprite("Generated", "#ffffff", 0.5).translateY(1.5).translateX(-1));

      // Real Image
      const realImg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide }));
      realImg.position.set(1, -2.5, 0); // Below
      group.add(realImg);
      group.add(createTextSprite("Real Data", "#22c55e", 0.5).translateY(-4).translateX(1));

      // Discriminator Side
      const discNet = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1.5, 3, 8, 1, true), new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, side: THREE.DoubleSide }));
      discNet.rotation.z = -Math.PI / 2;
      discNet.position.set(4, 0, 0);
      group.add(discNet);

      // Decision
      const decision = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x555555 }));
      decision.position.set(6.5, 0, 0);
      group.add(decision);
      group.userData.parts.decision = decision;
      group.add(createTextSprite("Real/Fake?", "#ffffff", 0.5).translateY(1.5).translateX(6.5));

      // Connections
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2 });
      // Noise -> Gen
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-6.5,0,0), new THREE.Vector3(-5.5,0,0)]), lineMat));
      // Gen -> Fake
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.5,0,0), new THREE.Vector3(-1,0,0)]), lineMat));
      // Fake -> Disc
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(2.5,0,0)]), lineMat));
      // Real -> Disc
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(1,-1.5,0), new THREE.Vector3(2.5,-0.5,0)]), lineMat));

      return group;
    };

    // --- PLACE ARCHITECTURES ---
    const models = [createMLP(), createRNN(), createLSTM(), createViT(), createCNN(), createAutoEncoder(), createGAN()];
    modelsRef.current = models;
    const angleStep = (Math.PI * 2) / models.length;

    models.forEach((model, i) => {
      const angle = i * angleStep;
      model.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
      model.lookAt(0, 0, 0);
      model.rotation.y += Math.PI; 
      
      // --- BACKDROP (Card) ---
      // Provides contrast and blocks stars/background for this specific model
      const bgGeo = new THREE.PlaneGeometry(18, 12);
      const bgMat = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        transparent: true, 
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const bg = new THREE.Mesh(bgGeo, bgMat);
      bg.position.z = -1; // Slightly behind the model
      bg.renderOrder = 0; // Render first
      model.add(bg);

      // Add simulation group to each model
      const simGroup = new THREE.Group();
      simGroup.visible = false;
      model.add(simGroup);
      model.userData.simGroup = simGroup;

      carousel.add(model);
    });

    // --- CENTRAL OCCLUDER (The Void) ---
    // Blocks the view of architectures on the far side of the ring
    const voidGeo = new THREE.SphereGeometry(11, 32, 32);
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const theVoid = new THREE.Mesh(voidGeo, voidMat);
    scene.add(theVoid);

    // --- STARS ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 100;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(starGeo, starMat));

    // --- ANIMATION LOOP ---
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.015;

      // Smooth Rotation
      carousel.rotation.y += (targetRotationRef.current - carousel.rotation.y) * 0.05;

      // --- FOCUS LOGIC (Blur/Fade others) ---
      models.forEach((model) => {
        const worldPos = new THREE.Vector3();
        model.getWorldPosition(worldPos);
        
        // Isolation Logic: Only show if roughly centered in front
        // This prevents seeing neighbors on the far sides
        const isVisible = worldPos.z > 5 && Math.abs(worldPos.x) < 12;
        model.visible = isVisible;

        if (isVisible) {
            // Fade logic for smooth entry/exit
            const dist = Math.abs(worldPos.x);
            const opacity = Math.max(0, 1 - (dist / 12));
            
            model.traverse((child) => {
                if (child.material && !child.userData.isParticle) {
                     if (!child.userData.originalOpacity) child.userData.originalOpacity = child.material.opacity;
                     child.material.opacity = child.userData.originalOpacity * opacity;
                     
                     // Hide labels earlier to prevent overlap/cutoff
                     if (child.isSprite) {
                         child.visible = dist < 8; 
                         child.material.opacity = opacity;
                     }
                }
            });
        }
      });

      // --- SIMULATION LOGIC ---
      if (isSimulatingRef.current) {
        models.forEach(model => {
          // Only simulate if visible/front
          const worldPos = new THREE.Vector3();
          model.getWorldPosition(worldPos);
          if (worldPos.z < 10) return; // Skip if back

          const simGroup = model.userData.simGroup;
          simGroup.visible = true;

          // Clear old particles occasionally or manage lifecycle
          // For simplicity, we'll just move a fixed set of particles or create/destroy
          
          // --- MLP SIMULATION ---
          if (model.userData.type === 'MLP') {
            // Spawn particles moving along connections
            if (Math.random() < 0.1) {
              const conn = model.userData.connections[Math.floor(Math.random() * model.userData.connections.length)];
              const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
              p.position.copy(conn.start);
              p.userData = { isParticle: true, start: conn.start, end: conn.end, progress: 0 };
              simGroup.add(p);
            }
            // Update particles
            for (let i = simGroup.children.length - 1; i >= 0; i--) {
              const p = simGroup.children[i];
              p.userData.progress += 0.05;
              p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
              if (p.userData.progress >= 1) {
                simGroup.remove(p);
                p.geometry.dispose();
              }
            }
          }

          // --- RNN SIMULATION ---
          else if (model.userData.type === 'RNN') {
             // 1. Vertical Flow (Input -> Hidden -> Output)
             if (Math.random() < 0.05) {
                const stepIdx = Math.floor(Math.random() * model.userData.steps.length);
                const step = model.userData.steps[stepIdx];
                // We need positions relative to model group
                // The step children are: 0:Input, 1:Hidden, 2:Output
                const inputPos = step.children[0].position.clone().add(step.position);
                const hiddenPos = step.children[1].position.clone().add(step.position);
                const outputPos = step.children[2].position.clone().add(step.position);
                
                // Particle 1: Input -> Hidden
                const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                p1.position.copy(inputPos);
                p1.userData = { isParticle: true, start: inputPos, end: hiddenPos, progress: 0, next: outputPos };
                simGroup.add(p1);
             }

             // 2. Recurrent Flow (Hidden t -> Hidden t+1)
             if (Math.random() < 0.05) {
                const conns = model.userData.connections.filter(c => c.type === 'recurrent');
                if (conns.length > 0) {
                  const c = conns[Math.floor(Math.random() * conns.length)];
                  const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
                  p.position.copy(c.start);
                  p.userData = { isParticle: true, start: c.start, end: c.end, progress: 0 };
                  simGroup.add(p);
                }
             }

             // Update
             for (let i = simGroup.children.length - 1; i >= 0; i--) {
               const p = simGroup.children[i];
               p.userData.progress += 0.04;
               p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
               
               if (p.userData.progress >= 1) {
                 if (p.userData.next) {
                   // Move to next stage
                   p.userData.start = p.userData.end;
                   p.userData.end = p.userData.next;
                   p.userData.progress = 0;
                   p.userData.next = null;
                 } else {
                   simGroup.remove(p);
                   p.geometry.dispose();
                 }
               }
             }
          }

          // --- LSTM SIMULATION ---
          else if (model.userData.type === 'LSTM') {
             // Flow through the 3 cells
             if (Math.random() < 0.05) {
                const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                p.position.set(-6, 0, 0); 
                p.userData = { isParticle: true, progress: 0 };
                simGroup.add(p);
             }

             for (let i = simGroup.children.length - 1; i >= 0; i--) {
               const p = simGroup.children[i];
               p.userData.progress += 0.015;
               p.position.x = THREE.MathUtils.lerp(-6, 6, p.userData.progress);
               
               // Pulse when passing near cell centers (-4, 0, 4)
               const distToCell = Math.min(
                 Math.abs(p.position.x - (-4)),
                 Math.abs(p.position.x - 0),
                 Math.abs(p.position.x - 4)
               );
               
               if (distToCell < 0.8) {
                 p.scale.setScalar(1.5);
                 p.material.color.setHex(0xa855f7);
               } else {
                 p.scale.setScalar(1);
                 p.material.color.setHex(0xffffff);
               }

               if (p.userData.progress >= 1) {
                 simGroup.remove(p);
                 p.geometry.dispose();
               }
             }
          }

          // --- ViT SIMULATION ---
          else if (model.userData.type === 'ViT') {
             // Highlight patches -> Move to Encoder -> Highlight Token
             const t = (time * 0.5) % 4;
             
             // 1. Patches light up
             model.userData.parts.patches.children.forEach((patch, idx) => {
               if (patch.isMesh) {
                 const active = t < 1 && Math.floor(t * 9) === idx;
                 patch.material.opacity = active ? 1 : 0.3;
                 patch.material.color.setHex(active ? 0xffffff : 0xec4899);
               }
             });

             // 2. Particles move up to encoder
             if (t > 1 && t < 2 && Math.random() < 0.2) {
                const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                p.position.set((Math.random()-0.5)*3, -3, 0);
                p.userData = { isParticle: true, start: p.position.clone(), end: new THREE.Vector3(0, 0.5, 0), progress: 0 };
                simGroup.add(p);
             }

             // Update particles
             for (let i = simGroup.children.length - 1; i >= 0; i--) {
               const p = simGroup.children[i];
               p.userData.progress += 0.05;
               p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
               if (p.userData.progress >= 1) {
                 simGroup.remove(p);
                 p.geometry.dispose();
               }
             }
          }

          // --- CNN SIMULATION ---
          else if (model.userData.type === 'CNN') {
             // Flow: Input -> Conv Layers -> FC
             if (Math.random() < 0.1) {
                const p = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
                p.position.set(-4, 0, 0);
                p.userData = { isParticle: true, progress: 0 };
                simGroup.add(p);
             }

             for (let i = simGroup.children.length - 1; i >= 0; i--) {
               const p = simGroup.children[i];
               p.userData.progress += 0.02;
               p.position.x = THREE.MathUtils.lerp(-4, 4, p.userData.progress);
               
               // Shrink as it goes through conv layers
               const scale = 1 - (p.userData.progress * 0.8);
               p.scale.setScalar(Math.max(0.2, scale));
               
               if (p.userData.progress >= 1) {
                 simGroup.remove(p);
                 p.geometry.dispose();
               }
             }
          }

          // --- AUTOENCODER SIMULATION ---
          else if (model.userData.type === 'AutoEncoder') {
             // Flow: Left -> Center (Compress) -> Right (Expand)
             if (Math.random() < 0.05) {
                const p = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                p.position.set(-5, 0, 0);
                p.userData = { isParticle: true, progress: 0 };
                simGroup.add(p);
             }

             for (let i = simGroup.children.length - 1; i >= 0; i--) {
               const p = simGroup.children[i];
               p.userData.progress += 0.02;
               p.position.x = THREE.MathUtils.lerp(-5, 5, p.userData.progress);
               
               // Color change at bottleneck (x=0)
               const distToCenter = Math.abs(p.position.x);
               if (distToCenter < 0.5) {
                 p.material.color.setHex(0xff0000); // Compressed
                 p.scale.setScalar(0.5);
               } else {
                 p.material.color.setHex(0xffffff);
                 p.scale.setScalar(1);
               }

               if (p.userData.progress >= 1) {
                 simGroup.remove(p);
                 p.geometry.dispose();
               }
             }
          }

          // --- GAN SIMULATION ---
          else if (model.userData.type === 'GAN') {
             // 1. Noise -> Gen -> Fake
             if (Math.random() < 0.05) {
                const p = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0xaaaaaa }));
                p.position.set(-7, 0, 0); // Noise source
                p.userData = { isParticle: true, start: new THREE.Vector3(-7,0,0), end: new THREE.Vector3(-4,0,0), stage: 0, progress: 0 };
                simGroup.add(p);
             }
             
             // 2. Real -> Disc
             if (Math.random() < 0.05) {
                const p = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide }));
                p.position.set(1, -2.5, 0);
                p.userData = { isParticle: true, start: new THREE.Vector3(1,-2.5,0), end: new THREE.Vector3(4,0,0), stage: 2, progress: 0 }; // Direct to disc
                simGroup.add(p);
             }

             for (let i = simGroup.children.length - 1; i >= 0; i--) {
               const p = simGroup.children[i];
               p.userData.progress += 0.03;
               
               if (p.userData.stage === 0) { // Noise -> Gen
                  p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
                  if (p.userData.progress >= 1) {
                    p.userData.stage = 1;
                    p.userData.start = new THREE.Vector3(-4,0,0);
                    p.userData.end = new THREE.Vector3(-1,0,0); // Gen -> Fake
                    p.userData.progress = 0;
                    p.geometry.dispose();
                    p.geometry = new THREE.PlaneGeometry(0.3, 0.3); // Become "image"
                    p.material.color.setHex(0xffffff); 
                  }
               } else if (p.userData.stage === 1) { // Gen -> Fake -> Disc
                  p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
                  if (p.userData.progress >= 1) {
                    // Flash Fake Image
                    model.userData.parts.fakeImg.material.color.setHex(0xffffff);
                    setTimeout(() => { if(model.userData.parts.fakeImg) model.userData.parts.fakeImg.material.color.setHex(0x333333); }, 100);
                    
                    p.userData.stage = 2;
                    p.userData.start = new THREE.Vector3(-1,0,0);
                    p.userData.end = new THREE.Vector3(4,0,0); // Fake -> Disc
                    p.userData.progress = 0;
                  }
               } else if (p.userData.stage === 2) { // To Disc -> Decision
                  p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
                  if (p.userData.progress >= 1) {
                    p.userData.stage = 3;
                    p.userData.start = new THREE.Vector3(4,0,0);
                    p.userData.end = new THREE.Vector3(6.5,0,0);
                    p.userData.progress = 0;
                  }
               } else if (p.userData.stage === 3) { // Inside Disc
                  p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.progress);
                  if (p.userData.progress >= 1) {
                    // Flash Decision
                    const isReal = p.material.color.getHex() === 0x22c55e;
                    model.userData.parts.decision.material.color.setHex(isReal ? 0x22c55e : 0xff0000);
                    setTimeout(() => { if(model.userData.parts.decision) model.userData.parts.decision.material.color.setHex(0x555555); }, 100);
                    
                    simGroup.remove(p);
                    p.geometry.dispose();
                  }
               }
             }
          }

        });
      } else {
        // Clear particles if stopped
        models.forEach(m => {
          const sg = m.userData.simGroup;
          if (sg) {
            while(sg.children.length > 0){ 
              const c = sg.children[0];
              sg.remove(c);
              if(c.geometry) c.geometry.dispose();
            }
            sg.visible = false;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- RESIZE ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateCameraPos(); // Keep camera responsive
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if(mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]); // Re-bind when index changes to keep state fresh (or use functional update in navigate)

  // Handle Navigation
  const navigate = (direction) => {
    setCurrentIndex(prev => {
      const newIndex = prev + direction;
      // Calculate rotation inside setter to ensure we use latest index if needed, 
      // but here we need side effect. Better to use useEffect on currentIndex change for rotation?
      // For now, let's just update rotation here based on the calculated newIndex
      const angleStep = (Math.PI * 2) / ARCHITECTURES.length;
      targetRotationRef.current = -newIndex * angleStep;
      return newIndex;
    });
  };

  const toggleSimulation = () => {
    const newState = !isSimulating;
    setIsSimulating(newState);
    isSimulatingRef.current = newState;
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
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col max-w-[70%]">
            <h2 className="text-lg md:text-2xl font-bold text-white tracking-widest truncate">NEURAL EXPLORER</h2>
            <span className="text-[10px] md:text-xs font-mono text-slate-400 break-words">ARCH: {currentArch.name}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Info - Bottom Left (Hidden on Simulation) */}
        <div className={`absolute bottom-24 left-4 md:bottom-32 md:left-8 max-w-[90%] md:max-w-md text-left transition-all duration-500 ${isSimulating ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
           <AnimatePresence mode='wait'>
             <motion.div
               key={dataIndex}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
               <h1 className="text-2xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 select-none mb-2 md:mb-4 break-words leading-tight">
                 {currentArch.name}
               </h1>
               <p className="text-slate-300 font-mono text-xs md:text-base leading-relaxed bg-black/60 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/10 shadow-2xl">
                 {currentArch.desc}
               </p>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Simulation Button - Bottom Center (Always Visible) */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto z-50 w-full flex justify-center">
             <button 
               onClick={toggleSimulation}
               className={`px-6 py-2 md:px-8 md:py-3 rounded-full font-bold tracking-wide flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 text-sm md:text-base ${isSimulating ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
             >
               {isSimulating ? <Pause size={16} className="md:w-5 md:h-5" /> : <Play size={16} className="md:w-5 md:h-5" />}
               {isSimulating ? 'STOP' : 'RUN SIMULATION'}
             </button>
        </div>

        {/* Controls - Sides */}
        <div className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 pointer-events-auto">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 md:p-4 rounded-full border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:scale-110 group"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-cyan-400 transition-colors" />
          </button>
        </div>

        <div className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 pointer-events-auto">
          <button 
            onClick={() => navigate(1)}
            className="p-2 md:p-4 rounded-full border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:scale-110 group"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-purple-400 transition-colors" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
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