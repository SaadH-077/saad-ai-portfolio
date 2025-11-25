import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Check, Brain, Zap, Server, Shield, Activity, AlertTriangle, Database, RefreshCw, Trophy, Cpu, Info, ArrowRight, BookOpen, Search, BatteryCharging, Eye } from 'lucide-react';

// --- GAME DATA & EDUCATIONAL CONTENT ---
const INITIAL_METRICS = { accuracy: 50, compute: 50, stability: 50 };
const INITIAL_RP = 2; // Start with 2 Research Points

const PHASES = {
  DATA: { title: "Phase 1: Data Engineering", desc: "Curate and preprocess datasets. Garbage in, garbage out." },
  ARCH: { title: "Phase 2: Architecture Search", desc: "Design the neural topology. Balance depth vs width." },
  TRAIN: { title: "Phase 3: Model Training", desc: "Optimize hyperparameters and manage resources." },
  DEPLOY: { title: "Phase 4: Deployment", desc: "Handle real-world inference and scaling." }
};

const SCENARIOS = [
  // --- PHASE 1: DATA ---
  {
    id: 'd1',
    phase: 'DATA',
    text: "Raw dataset contains 30% duplicate entries.",
    icon: Database,
    color: "blue",
    concept: "Data Leakage",
    explanation: "Duplicate data in train/test sets causes 'Data Leakage', giving false high accuracy scores.",
    left: { text: "Keep All", effects: { accuracy: +5, compute: -10, stability: -5 }, risk: 0.1 },
    right: { text: "Deduplicate", effects: { accuracy: -5, compute: +10, stability: +10 } }
  },
  {
    id: 'd2',
    phase: 'DATA',
    text: "Images are varying sizes and resolutions.",
    icon: Database,
    color: "cyan",
    concept: "Normalization",
    explanation: "Neural networks require fixed-size input vectors. Resizing and normalizing pixel values (0-1) is crucial.",
    left: { text: "Pad w/ Zeros", effects: { accuracy: -5, compute: +5, stability: +5 } },
    right: { text: "Resize/Crop", effects: { accuracy: +5, compute: -5, stability: +5 } }
  },
  {
    id: 'd3',
    phase: 'DATA',
    text: "Dataset is heavily biased towards one class.",
    icon: AlertTriangle,
    color: "orange",
    concept: "Class Imbalance",
    explanation: "Imbalanced data makes the model ignore minority classes. Techniques like SMOTE or class weighting fix this.",
    left: { text: "Train Anyway", effects: { accuracy: +10, compute: 0, stability: -20 }, risk: 0.4 }, // High risk
    right: { text: "Augment Data", effects: { accuracy: -5, compute: -10, stability: +15 } }
  },

  // --- PHASE 2: ARCHITECTURE ---
  {
    id: 'a1',
    phase: 'ARCH',
    text: "Model is underfitting the training data.",
    icon: Brain,
    color: "purple",
    concept: "Model Capacity",
    explanation: "Underfitting means the model is too simple to capture patterns. Increasing layers (depth) or neurons (width) helps.",
    left: { text: "Add Layers", effects: { accuracy: +15, compute: -15, stability: -5 } },
    right: { text: "Simplify", effects: { accuracy: -10, compute: +10, stability: +5 } }
  },
  {
    id: 'a2',
    phase: 'ARCH',
    text: "Gradients are vanishing in deep layers.",
    icon: Activity,
    color: "red",
    concept: "Vanishing Gradient",
    explanation: "In deep networks, gradients can shrink to zero, stopping learning. Skip Connections (ResNets) solve this.",
    left: { text: "Use Sigmoid", effects: { accuracy: -15, compute: 0, stability: -10 }, risk: 0.3 },
    right: { text: "Add Skip Conn.", effects: { accuracy: +10, compute: -5, stability: +15 } }
  },

  // --- PHASE 3: TRAINING ---
  {
    id: 't1',
    phase: 'TRAIN',
    text: "Validation loss is plateauing.",
    icon: Activity,
    color: "purple",
    concept: "Learning Rate Schedule",
    explanation: "When learning stalls, reducing the Learning Rate (LR Decay) allows the model to settle into a finer optimum.",
    left: { text: "Early Stop", effects: { accuracy: -5, compute: +15, stability: +10 } },
    right: { text: "Decay LR", effects: { accuracy: +10, compute: -5, stability: +5 } }
  },
  {
    id: 't2',
    phase: 'TRAIN',
    text: "Training accuracy 99%, Validation 60%.",
    icon: AlertTriangle,
    color: "yellow",
    concept: "Overfitting",
    explanation: "The model memorized the training data but can't generalize. Regularization (Dropout/L2) is needed.",
    left: { text: "Keep Training", effects: { accuracy: +5, compute: -10, stability: -25 }, risk: 0.6 }, // Very high risk
    right: { text: "Add Dropout", effects: { accuracy: -5, compute: +5, stability: +20 } }
  },

  // --- PHASE 4: DEPLOYMENT ---
  {
    id: 'dp1',
    phase: 'DEPLOY',
    text: "Inference latency is too high for users.",
    icon: Server,
    color: "green",
    concept: "Quantization",
    explanation: "Converting weights from Float32 to Int8 reduces model size and speeds up inference with minimal accuracy loss.",
    left: { text: "Buy GPUs", effects: { accuracy: 0, compute: -25, stability: +10 } },
    right: { text: "Quantize (Int8)", effects: { accuracy: -5, compute: +20, stability: +5 }, risk: 0.2 }
  },
  {
    id: 'dp2',
    phase: 'DEPLOY',
    text: "Model is hallucinating facts.",
    icon: Brain,
    color: "pink",
    concept: "Hallucination",
    explanation: "LLMs can generate confident but wrong answers. RAG (Retrieval Augmented Generation) grounds them in facts.",
    left: { text: "Add RAG", effects: { accuracy: +20, compute: -15, stability: +10 } },
    right: { text: "Prompt Eng.", effects: { accuracy: +5, compute: +5, stability: -5 } }
  }
];

// --- COMPONENTS ---

const MetricBar = ({ label, value, color, previewChange, isHidden }) => {
  let previewWidth = 0;
  let previewColor = 'bg-white';
  
  if (previewChange !== 0 && !isHidden) {
    previewWidth = Math.abs(previewChange);
    previewColor = previewChange > 0 ? 'bg-green-400' : 'bg-red-500';
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div 
          className={`absolute top-0 left-0 h-full bg-${color}-500`}
          initial={{ width: `${value}%` }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        {previewChange !== 0 && !isHidden && (
          <motion.div 
            className={`absolute top-0 h-full ${previewColor} opacity-70`}
            style={{ 
              left: previewChange > 0 ? `${value}%` : `${value + previewChange}%`,
              width: `${previewWidth}%` 
            }}
          />
        )}
        {/* Hidden Indicator */}
        {isHidden && previewChange !== 0 && (
           <div className="absolute top-0 right-0 h-full w-full flex items-center justify-center bg-white/5">
             <span className="text-[8px] text-slate-400">?</span>
           </div>
        )}
      </div>
    </div>
  );
};

const BrainSurgeLoader = ({ onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let startTime = Date.now();
    const duration = 3000; // 3 seconds load time

    // Brain Nodes
    const nodes = [];
    const nodeCount = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for(let i=0; i<nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100;
      // Elliptical shape for brain
      nodes.push({
        x: centerX + Math.cos(angle) * radius * 1.2,
        y: centerY + Math.sin(angle) * radius * 0.9,
        active: false,
        activationTime: Math.random() * 2000
      });
    }

    const connections = [];
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 60) {
            connections.push({ from: node, to: other, active: false });
          }
        }
      });
    });

    const render = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Connections
      ctx.lineWidth = 1;
      connections.forEach(conn => {
        const surge = progress * 3000; // Surge moves through time
        const isActive = elapsed > conn.from.activationTime;
        
        if (isActive) {
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 + progress * 0.5})`; // Purple surge
          ctx.beginPath();
          ctx.moveTo(conn.from.x, conn.from.y);
          ctx.lineTo(conn.to.x, conn.to.y);
          ctx.stroke();
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        if (elapsed > node.activationTime) {
          ctx.fillStyle = '#22d3ee'; // Cyan
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2 + progress * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Glow
          ctx.shadowBlur = 10 * progress;
          ctx.shadowColor = '#22d3ee';
        }
      });
      ctx.shadowBlur = 0;

      // Text
      if (progress > 0.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(progress - 0.5) * 2})`;
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText("INITIALIZING NEURAL PATHWAYS...", centerX, centerY + 140);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <canvas ref={canvasRef} width={400} height={400} className="mb-4" />
    </div>
  );
};

const NeuralArchitectGame = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [researchPoints, setResearchPoints] = useState(INITIAL_RP);
  const [epoch, setEpoch] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [gameState, setGameState] = useState('loading'); // loading, tutorial, playing, gameover
  const [highScore, setHighScore] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('DATA');
  const [scanActive, setScanActive] = useState(false); // Ability: Deep Scan

  // Card Animation Values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  useEffect(() => {
    const unsubscribe = x.onChange(v => {
      if (v < -50) setSwipeDirection(-1);
      else if (v > 50) setSwipeDirection(1);
      else setSwipeDirection(0);
    });
    return unsubscribe;
  }, [x]);

  // Reset game state when opened
  useEffect(() => {
    if (isOpen) {
      setGameState('loading');
      setMetrics(INITIAL_METRICS);
      setResearchPoints(INITIAL_RP);
      setEpoch(0);
    }
  }, [isOpen]);

  const generateScenario = useCallback(() => {
    // Filter scenarios by current phase or random if mixed
    let phaseScenarios = SCENARIOS.filter(s => s.phase === currentPhase);
    
    // If we ran out of phase scenarios, pick random or advance phase
    if (phaseScenarios.length === 0 || Math.random() > 0.7) {
       phaseScenarios = SCENARIOS;
    }

    const random = phaseScenarios[Math.floor(Math.random() * phaseScenarios.length)];
    setCurrentScenario({ ...random, uid: Math.random() });
    x.set(0);
    setSwipeDirection(0);
    setShowInfo(false);
    setScanActive(false); // Reset scan
  }, [x, currentPhase]);

  const startGame = () => {
    setMetrics(INITIAL_METRICS);
    setResearchPoints(INITIAL_RP);
    setEpoch(0);
    setCurrentPhase('DATA');
    setGameState('playing');
    generateScenario();
  };

  const useAbility = (ability) => {
    if (ability === 'scan' && researchPoints >= 2) {
      setResearchPoints(prev => prev - 2);
      setScanActive(true);
    } else if (ability === 'stabilize' && researchPoints >= 3) {
      setResearchPoints(prev => prev - 3);
      setMetrics(prev => ({ ...prev, stability: Math.min(100, prev.stability + 15) }));
    } else if (ability === 'overclock' && researchPoints >= 3) {
      setResearchPoints(prev => prev - 3);
      setMetrics(prev => ({ ...prev, compute: Math.min(100, prev.compute + 15) }));
    }
  };

  const handleChoice = (direction) => {
    if (!currentScenario) return;

    const choice = direction === 'left' ? currentScenario.left : currentScenario.right;
    let effects = { ...choice.effects };

    // Risk Calculation
    if (choice.risk && Math.random() < choice.risk) {
      // Critical Failure!
      effects.accuracy = (effects.accuracy || 0) - 15;
      effects.stability = (effects.stability || 0) - 20;
    }

    setMetrics(prev => {
      const ENTROPY = 1.5; // Constant system decay
      const newMetrics = {
        accuracy: Math.min(100, Math.max(0, prev.accuracy + (effects.accuracy || 0) - ENTROPY)),
        compute: Math.min(100, Math.max(0, prev.compute + (effects.compute || 0) - ENTROPY)),
        stability: Math.min(100, Math.max(0, prev.stability + (effects.stability || 0) - ENTROPY))
      };

      if (
        newMetrics.accuracy <= 0 || 
        newMetrics.compute <= 0 || 
        newMetrics.stability <= 0
      ) {
        setGameState('gameover');
        if (epoch + 1 > highScore) setHighScore(epoch + 1);
      }

      return newMetrics;
    });

    if (gameState !== 'gameover') {
      setResearchPoints(prev => prev + 1); // Gain 1 RP per turn
      setEpoch(e => {
        const newEpoch = e + 1;
        // Advance phases based on epoch
        if (newEpoch === 5) setCurrentPhase('ARCH');
        if (newEpoch === 10) setCurrentPhase('TRAIN');
        if (newEpoch === 15) setCurrentPhase('DEPLOY');
        return newEpoch;
      });
      generateScenario();
    }
  };

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || gameState !== 'playing') return;
      if (e.key === 'ArrowLeft') handleChoice('left');
      if (e.key === 'ArrowRight') handleChoice('right');
      if (e.key === ' ' || e.key === 'i') setShowInfo(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, gameState, currentScenario]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 font-sans"
    >
      <div className="w-full max-w-md relative h-full max-h-[800px] flex flex-col py-4">
        
        {/* LOADING STATE */}
        {gameState === 'loading' && (
          <BrainSurgeLoader onComplete={() => setGameState('tutorial')} />
        )}

        {/* TUTORIAL STATE */}
        {gameState === 'tutorial' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <Brain size={48} className="text-purple-400" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Neural Architect v2.0</h2>
              <p className="text-slate-400 leading-relaxed">
                You are the lead AI Architect. Balance metrics, manage Research Points (RP), and mitigate risks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full text-left">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <Activity className="text-cyan-400 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-bold text-sm">System Entropy</h4>
                  <p className="text-xs text-slate-400 mt-1">Metrics decay constantly. You must make positive trade-offs to survive.</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <Eye className="text-purple-400 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-bold text-sm">Hidden Metrics</h4>
                  <p className="text-xs text-slate-400 mt-1">Outcomes are hidden by default. Use <strong>SCAN</strong> (2 RP) to reveal the exact impact of your choices.</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <Search className="text-yellow-400 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-bold text-sm">Research Points</h4>
                  <p className="text-xs text-slate-400 mt-1">Earn RP each turn. Spend on abilities to Scan, Stabilize, or Boost.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold tracking-wide shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              INITIALIZE SYSTEM <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* PLAYING & GAMEOVER STATES */}
        {(gameState === 'playing' || gameState === 'gameover') && (
          <>
            {/* Header / Metrics */}
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-4 mb-4 shadow-xl relative z-30 shrink-0">
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-purple-400" />
                  <span className="text-xs font-bold text-white tracking-wider">NEURAL ARCHITECT</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 font-mono text-xs">
                      <Search size={12} />
                      <span>RP: {researchPoints}</span>
                   </div>
                   <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={16} /></button>
                </div>
              </div>

              <div className="space-y-3">
                <MetricBar 
                  label="ACCURACY" 
                  value={metrics.accuracy} 
                  color="cyan" 
                  isHidden={!scanActive}
                  previewChange={swipeDirection === -1 ? currentScenario?.left.effects.accuracy : swipeDirection === 1 ? currentScenario?.right.effects.accuracy : 0}
                />
                <MetricBar 
                  label="COMPUTE" 
                  value={metrics.compute} 
                  color="purple" 
                  isHidden={!scanActive}
                  previewChange={swipeDirection === -1 ? currentScenario?.left.effects.compute : swipeDirection === 1 ? currentScenario?.right.effects.compute : 0}
                />
                <MetricBar 
                  label="STABILITY" 
                  value={metrics.stability} 
                  color="green" 
                  isHidden={!scanActive}
                  previewChange={swipeDirection === -1 ? currentScenario?.left.effects.stability : swipeDirection === 1 ? currentScenario?.right.effects.stability : 0}
                />
              </div>
            </div>

            {/* Game Area */}
            <div className="relative flex-grow flex items-center justify-center perspective-1000 min-h-0 my-4">
              
              {/* Game Over Screen */}
              {gameState === 'gameover' && (
                <div className="text-center space-y-6 z-30 bg-black/90 p-8 rounded-2xl backdrop-blur-md border border-red-500/30 w-full h-full flex flex-col justify-center items-center absolute inset-0">
                  <AlertTriangle size={48} className="text-red-500 animate-pulse" />
                  <div>
                    <div className="text-red-500 font-mono text-3xl font-bold mb-2">SYSTEM FAILURE</div>
                    <p className="text-slate-400 text-sm">Critical metric depletion detected.</p>
                  </div>
                  
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 w-full">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Epochs Survived</div>
                    <div className="text-5xl font-bold text-white mb-2">{epoch}</div>
                    <div className="text-xs text-purple-400 font-mono">Rank: {epoch > 15 ? "SENIOR ARCHITECT" : epoch > 10 ? "ML ENGINEER" : "JUNIOR DEV"}</div>
                  </div>

                  <button 
                    onClick={startGame}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white font-bold tracking-wide transition-all flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> REBOOT SYSTEM
                  </button>
                </div>
              )}

              {/* Playing State - The Card */}
              {gameState === 'playing' && currentScenario && (
                <>
                  {/* Choice Indicators */}
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-right transition-opacity duration-300 ${swipeDirection === -1 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-2xl font-bold text-white mb-1">{currentScenario.left.text}</div>
                    <div className="text-xs text-slate-400 font-mono">SWIPE LEFT</div>
                  </div>
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-left transition-opacity duration-300 ${swipeDirection === 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-2xl font-bold text-white mb-1">{currentScenario.right.text}</div>
                    <div className="text-xs text-slate-400 font-mono">SWIPE RIGHT</div>
                  </div>

                  <motion.div
                    style={{ x, rotate, opacity }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = offset.x;
                      if (swipe > 100) handleChoice('right');
                      else if (swipe < -100) handleChoice('left');
                    }}
                    className="absolute w-full max-w-[320px] aspect-[3/4.5] bg-[#1a1a1d] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-grab active:cursor-grabbing z-20"
                  >
                    {/* Card Front */}
                    <div className={`h-full w-full p-6 flex flex-col items-center relative ${showInfo ? 'blur-sm opacity-20' : 'opacity-100'} transition-all duration-300`}>
                      <div className={`w-24 h-24 rounded-full bg-${currentScenario.color}-500/10 flex items-center justify-center mb-8 ring-1 ring-${currentScenario.color}-500/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0`}>
                        <currentScenario.icon size={48} className={`text-${currentScenario.color}-400`} />
                      </div>
                      
                      <div className="text-center space-y-2 mb-8">
                        <span className={`text-[10px] font-mono px-2 py-1 rounded bg-${currentScenario.color}-500/20 text-${currentScenario.color}-300 border border-${currentScenario.color}-500/30`}>
                          {currentScenario.concept}
                        </span>
                        <h3 className="text-xl font-bold text-white leading-tight">{currentScenario.text}</h3>
                      </div>
                      
                      <div className="mt-auto w-full space-y-4">
                         <div className="flex justify-between text-xs font-mono text-slate-500 border-t border-white/5 pt-4">
                            <span>ID: {currentScenario.uid.toString().substr(2, 6)}</span>
                            <span>EPOCH: {epoch}</span>
                         </div>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
                           className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors"
                         >
                           <Info size={14} /> View Concept Details
                         </button>
                      </div>
                    </div>

                    {/* Info Overlay (Back of Card effect) */}
                    <div className={`absolute inset-0 bg-[#1a1a1d] p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${showInfo ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                       <BookOpen size={32} className={`text-${currentScenario.color}-400 mb-4`} />
                       <h4 className="text-lg font-bold text-white mb-2">{currentScenario.concept}</h4>
                       <p className="text-sm text-slate-400 leading-relaxed mb-6">
                         {currentScenario.explanation}
                       </p>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setShowInfo(false); }}
                         className="px-6 py-2 bg-white/10 rounded-full text-sm text-white hover:bg-white/20"
                       >
                         Resume
                       </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>

            {/* Abilities Bar */}
            {gameState === 'playing' && (
              <div className="flex justify-center gap-4 mb-4 relative z-30">
                <button 
                  onClick={() => useAbility('scan')}
                  disabled={researchPoints < 2 || scanActive}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${researchPoints >= 2 && !scanActive ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20' : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'}`}
                >
                  <Eye size={18} />
                  <span className="text-[8px] font-mono">SCAN (2RP)</span>
                </button>
                <button 
                  onClick={() => useAbility('stabilize')}
                  disabled={researchPoints < 3}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${researchPoints >= 3 ? 'bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20' : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'}`}
                >
                  <Shield size={18} />
                  <span className="text-[8px] font-mono">STABILIZE (3RP)</span>
                </button>
                <button 
                  onClick={() => useAbility('overclock')}
                  disabled={researchPoints < 3}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${researchPoints >= 3 ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 hover:bg-purple-500/20' : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed'}`}
                >
                  <BatteryCharging size={18} />
                  <span className="text-[8px] font-mono">BOOST (3RP)</span>
                </button>
              </div>
            )}

            {/* Mobile Controls */}
            {gameState === 'playing' && (
              <div className="flex justify-center gap-4 pb-2 shrink-0 relative z-30 w-full px-4">
                 <button 
                   onClick={() => handleChoice('left')}
                   className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1 group hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                 >
                   <div className="flex items-center gap-2">
                     <X size={18} className="text-slate-400 group-hover:text-red-400" />
                     <span className="text-xs font-mono text-slate-400 group-hover:text-white truncate max-w-[120px]">
                       {currentScenario?.left.text}
                     </span>
                   </div>
                   {scanActive && (
                     <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                        {currentScenario?.left.effects.accuracy && <span className={currentScenario.left.effects.accuracy > 0 ? 'text-green-400' : 'text-red-400'}>A:{currentScenario.left.effects.accuracy}</span>}
                        {currentScenario?.left.effects.compute && <span className={currentScenario.left.effects.compute > 0 ? 'text-green-400' : 'text-red-400'}>C:{currentScenario.left.effects.compute}</span>}
                        {currentScenario?.left.effects.stability && <span className={currentScenario.left.effects.stability > 0 ? 'text-green-400' : 'text-red-400'}>S:{currentScenario.left.effects.stability}</span>}
                     </div>
                   )}
                 </button>

                 <button 
                   onClick={() => handleChoice('right')}
                   className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1 group hover:bg-green-500/10 hover:border-green-500/30 transition-all"
                 >
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-mono text-slate-400 group-hover:text-white truncate max-w-[120px]">
                       {currentScenario?.right.text}
                     </span>
                     <Check size={18} className="text-slate-400 group-hover:text-green-400" />
                   </div>
                   {scanActive && (
                     <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                        {currentScenario?.right.effects.accuracy && <span className={currentScenario.right.effects.accuracy > 0 ? 'text-green-400' : 'text-red-400'}>A:{currentScenario.right.effects.accuracy}</span>}
                        {currentScenario?.right.effects.compute && <span className={currentScenario.right.effects.compute > 0 ? 'text-green-400' : 'text-red-400'}>C:{currentScenario.right.effects.compute}</span>}
                        {currentScenario?.right.effects.stability && <span className={currentScenario.right.effects.stability > 0 ? 'text-green-400' : 'text-red-400'}>S:{currentScenario.right.effects.stability}</span>}
                     </div>
                   )}
                 </button>
              </div>
            )}
          </>
        )}

      </div>
    </motion.div>
  );
};

export default NeuralArchitectGame;