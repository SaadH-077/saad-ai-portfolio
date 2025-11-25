import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Cpu, Activity, Shield, Database, Terminal } from 'lucide-react';

const DiagnosticsOverlay = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);

  const tasks = [
    "Checking core system integrity...",
    "Verifying neural pathways...",
    "Optimizing 3D rendering engine...",
    "Calibrating mobile responsiveness...",
    "Scanning for security vulnerabilities...",
    "Syncing with GitHub repository...",
    "Analyzing portfolio data structures...",
    "Establishing secure uplink...",
    "System diagnostics complete."
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep >= tasks.length) {
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(onClose, 2000); // Close after 2 seconds of completion
        return;
      }

      const task = tasks[currentStep];
      setCurrentTask(task);
      
      // Add random log lines
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
      setLogs(prev => [...prev.slice(-6), `[${timestamp}] ${task}`]);
      
      setProgress(((currentStep + 1) / tasks.length) * 100);
      currentStep++;

    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center font-mono text-green-500 p-4"
    >
      <div className="w-full max-w-2xl border border-green-500/30 bg-black/50 rounded-lg p-8 relative overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none" />
        
        <div className="flex justify-between items-center mb-8 border-b border-green-500/30 pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Terminal size={20} /> SYSTEM DIAGNOSTICS
          </h2>
          <span className="animate-pulse text-xs">RUNNING_CHECKS...</span>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400/70">CPU_LOAD</span>
              <span className="font-bold">{Math.floor(Math.random() * 30 + 10)}%</span>
            </div>
            <div className="w-full bg-green-900/20 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-500"
                initial={{ width: "10%" }}
                animate={{ width: ["10%", "40%", "20%", "60%"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400/70">MEMORY_ALLOC</span>
              <span className="font-bold">{Math.floor(Math.random() * 20 + 40)}%</span>
            </div>
            <div className="w-full bg-green-900/20 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-500"
                initial={{ width: "40%" }}
                animate={{ width: ["40%", "45%", "42%", "48%"] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <StatusItem icon={Cpu} label="CORE" status="OK" />
             <StatusItem icon={Database} label="DATA" status="OK" />
             <StatusItem icon={Shield} label="SECURE" status="TRUE" />
             <StatusItem icon={Activity} label="PING" status="12ms" />
          </div>
        </div>

        {/* Terminal Output */}
        <div className="bg-black/80 border border-green-500/20 rounded p-4 h-48 overflow-hidden font-mono text-xs mb-6 flex flex-col justify-end">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-green-400/80 mb-1"
            >
              <span className="text-green-600 mr-2">➜</span>
              {log}
            </motion.div>
          ))}
          <div className="animate-pulse text-green-500">_</div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                {isComplete ? "COMPLETE" : "IN PROGRESS"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-green-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-900/20">
            <motion.div 
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-300"
            />
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">SYSTEM OPTIMAL</h3>
              <p className="text-green-400">All systems functioning within normal parameters.</p>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

const StatusItem = ({ icon: Icon, label, status }) => (
  <div className="flex items-center gap-2 bg-green-900/10 p-2 rounded border border-green-500/20">
    <Icon size={14} className="text-green-500" />
    <div>
      <div className="text-[10px] text-green-400/60">{label}</div>
      <div className="text-xs font-bold text-green-400">{status}</div>
    </div>
  </div>
);

export default DiagnosticsOverlay;
