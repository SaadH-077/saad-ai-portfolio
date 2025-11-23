import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Check, Brain, Zap, Server, Shield, Activity, AlertTriangle, Database, RefreshCw, Trophy, Cpu } from 'lucide-react';

// --- GAME CONFIGURATION ---
const INITIAL_METRICS = { accuracy: 50, compute: 50, stability: 50 };

const SCENARIOS = [
  {
    id: 1,
    text: "Validation loss is plateauing.",
    icon: Activity,
    color: "purple",
    left: { text: "Early Stop", effects: { accuracy: -5, compute: +15, stability: +10 } },
    right: { text: "Boost LR", effects: { accuracy: +15, compute: -10, stability: -20 } }
  },
  {
    id: 2,
    text: "New massive dataset available.",
    icon: Database,
    color: "cyan",
    left: { text: "Ignore (Noise)", effects: { accuracy: -5, compute: +5, stability: +5 } },
    right: { text: "Ingest All", effects: { accuracy: +10, compute: -25, stability: -10 } }
  },
  {
    id: 3,
    text: "GPU temperatures critical.",
    icon: Server,
    color: "red",
    left: { text: "Throttle", effects: { accuracy: -10, compute: +20, stability: +10 } },
    right: { text: "Ignore", effects: { accuracy: +5, compute: -30, stability: -15 } }
  },
  {
    id: 4,
    text: "Model is hallucinating facts.",
    icon: Brain,
    color: "pink",
    left: { text: "Add RLHF", effects: { accuracy: +20, compute: -15, stability: +5 } },
    right: { text: "Prompt Eng.", effects: { accuracy: +5, compute: +5, stability: -5 } }
  },
  {
    id: 5,
    text: "Competitor released a better model.",
    icon: Zap,
    color: "yellow",
    left: { text: "Rush Release", effects: { accuracy: -15, compute: -10, stability: -25 } },
    right: { text: "Analyze", effects: { accuracy: +5, compute: -5, stability: +5 } }
  },
  {
    id: 6,
    text: "Security vulnerability found.",
    icon: Shield,
    color: "green",
    left: { text: "Patch Now", effects: { accuracy: -5, compute: -10, stability: +25 } },
    right: { text: "Delay", effects: { accuracy: +5, compute: +5, stability: -30 } }
  },
  {
    id: 7,
    text: "Batch size causing OOM errors.",
    icon: AlertTriangle,
    color: "orange",
    left: { text: "Reduce Batch", effects: { accuracy: -5, compute: +15, stability: +10 } },
    right: { text: "Gradient Chkpt", effects: { accuracy: 0, compute: -20, stability: +5 } }
  },
  {
    id: 8,
    text: "Stakeholders demand features.",
    icon: Trophy,
    color: "blue",
    left: { text: "Ship It", effects: { accuracy: -10, compute: +10, stability: -15 } },
    right: { text: "Refine", effects: { accuracy: +10, compute: -10, stability: +5 } }
  }
];

const MetricBar = ({ label, value, color, previewChange }) => {
  // Calculate preview width and color
  let previewWidth = 0;
  let previewColor = 'bg-white';
  
  if (previewChange !== 0) {
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
        {/* Base Value */}
        <motion.div 
          className={`absolute top-0 left-0 h-full bg-${color}-500`}
          initial={{ width: `${value}%` }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        
        {/* Preview Indicator */}
        {previewChange !== 0 && (
          <motion.div 
            className={`absolute top-0 h-full ${previewColor} opacity-70`}
            style={{ 
              left: previewChange > 0 ? `${value}%` : `${value + previewChange}%`,
              width: `${previewWidth}%` 
            }}
          />
        )}
      </div>
    </div>
  );
};

const NeuralArchitectGame = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [epoch, setEpoch] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [gameState, setGameState] = useState('start'); // start, playing, gameover
  const [highScore, setHighScore] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0); // -1 left, 0 center, 1 right

  // Card Animation Values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // Detect swipe direction for preview
  useEffect(() => {
    const unsubscribe = x.onChange(v => {
      if (v < -50) setSwipeDirection(-1);
      else if (v > 50) setSwipeDirection(1);
      else setSwipeDirection(0);
    });
    return unsubscribe;
  }, [x]);

  const generateScenario = useCallback(() => {
    const random = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setCurrentScenario({ ...random, uid: Math.random() });
    x.set(0);
    setSwipeDirection(0);
  }, [x]);

  const startGame = () => {
    setMetrics(INITIAL_METRICS);
    setEpoch(0);
    setGameState('playing');
    generateScenario();
  };

  const handleChoice = (direction) => {
    if (!currentScenario) return;

    const choice = direction === 'left' ? currentScenario.left : currentScenario.right;
    const effects = choice.effects;

    setMetrics(prev => {
      const newMetrics = {
        accuracy: Math.min(100, Math.max(0, prev.accuracy + effects.accuracy)),
        compute: Math.min(100, Math.max(0, prev.compute + effects.compute)),
        stability: Math.min(100, Math.max(0, prev.stability + effects.stability))
      };

      // Check Game Over conditions
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
      setEpoch(e => e + 1);
      generateScenario();
    }
  };

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || gameState !== 'playing') return;
      if (e.key === 'ArrowLeft') handleChoice('left');
      if (e.key === 'ArrowRight') handleChoice('right');
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 font-sans"
    >
      <div className="w-full max-w-md relative h-full max-h-[800px] flex flex-col py-4">
        
        {/* Header / Metrics */}
        <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl p-4 mb-4 shadow-xl relative z-30 shrink-0">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-purple-400" />
              <span className="text-xs font-bold text-white tracking-wider">NEURAL ARCHITECT</span>
            </div>
            <div className="text-xs font-mono text-slate-400">EPOCH: <span className="text-white font-bold">{epoch}</span></div>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={16} /></button>
          </div>

          <div className="space-y-3">
            <MetricBar 
              label="ACCURACY" 
              value={metrics.accuracy} 
              color="cyan" 
              previewChange={swipeDirection === -1 ? currentScenario?.left.effects.accuracy : swipeDirection === 1 ? currentScenario?.right.effects.accuracy : 0}
            />
            <MetricBar 
              label="COMPUTE" 
              value={metrics.compute} 
              color="purple" 
              previewChange={swipeDirection === -1 ? currentScenario?.left.effects.compute : swipeDirection === 1 ? currentScenario?.right.effects.compute : 0}
            />
            <MetricBar 
              label="STABILITY" 
              value={metrics.stability} 
              color="green" 
              previewChange={swipeDirection === -1 ? currentScenario?.left.effects.stability : swipeDirection === 1 ? currentScenario?.right.effects.stability : 0}
            />
          </div>
        </div>

        {/* Game Area */}
        <div className="relative flex-grow flex items-center justify-center perspective-1000 min-h-0 my-4">
          
          {/* Start Screen */}
          {gameState === 'start' && (
            <div className="text-center space-y-6 z-30 bg-black/80 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto animate-pulse border border-purple-500/50">
                <Brain size={40} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">SYSTEM OPTIMIZATION</h2>
                <p className="text-slate-400 text-sm max-w-[250px] mx-auto leading-relaxed">
                  Balance Accuracy, Compute, and Stability. Don't let any metric hit 0%.
                </p>
              </div>
              <button 
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white font-bold tracking-wide shadow-lg hover:scale-105 transition-transform"
              >
                START TRAINING
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="text-center space-y-6 z-30 bg-black/80 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-red-500 font-mono text-4xl font-bold mb-2">MODEL COLLAPSE</div>
              <p className="text-slate-400 text-sm">Optimization failed due to resource exhaustion or instability.</p>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 my-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Epochs Survived</div>
                <div className="text-4xl font-bold text-white">{epoch}</div>
                {epoch >= highScore && epoch > 0 && (
                  <div className="text-xs text-yellow-400 mt-2 flex items-center justify-center gap-1">
                    <Trophy size={12} /> NEW RECORD
                  </div>
                )}
              </div>

              <button 
                onClick={startGame}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white font-bold tracking-wide transition-all flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={16} /> RESTART
              </button>
            </div>
          )}

          {/* Playing State - The Card */}
          {gameState === 'playing' && currentScenario && (
            <>
              {/* Choice Indicators (Behind Card) */}
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
                className="absolute w-full max-w-[300px] aspect-[3/4] max-h-[450px] bg-[#1a1a1d] border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 cursor-grab active:cursor-grabbing z-20"
              >
                {/* Card Content */}
                <div className={`w-20 h-20 rounded-full bg-${currentScenario.color}-500/10 flex items-center justify-center mb-6 ring-1 ring-${currentScenario.color}-500/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0`}>
                  <currentScenario.icon size={40} className={`text-${currentScenario.color}-400`} />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-4 text-center leading-tight">{currentScenario.text}</h3>
                
                <div className="mt-auto w-full">
                   <div className="h-[1px] w-full bg-white/5 mb-4" />
                   <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>ID: {currentScenario.uid.toString().substr(2, 6)}</span>
                      <span>PRIORITY: HIGH</span>
                   </div>
                </div>
              </motion.div>
            </>
          )}

        </div>

        {/* Mobile Controls */}
        {gameState === 'playing' && (
          <div className="flex justify-center gap-12 mt-2 pb-2 shrink-0 relative z-30">
             <button 
               onClick={() => handleChoice('left')}
               className="flex flex-col items-center gap-2 group"
             >
               <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                 <X size={24} className="text-slate-400 group-hover:text-white" />
               </div>
               <span className="text-[10px] font-mono text-slate-500">REJECT</span>
             </button>

             <button 
               onClick={() => handleChoice('right')}
               className="flex flex-col items-center gap-2 group"
             >
               <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                 <Check size={24} className="text-slate-400 group-hover:text-white" />
               </div>
               <span className="text-[10px] font-mono text-slate-500">ACCEPT</span>
             </button>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default NeuralArchitectGame;