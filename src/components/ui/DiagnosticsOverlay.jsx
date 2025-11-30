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
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center font-mono p-4"
    >
      <div className="w-full max-w-2xl bg-[#0a0a0c] border border-slate-800 rounded-xl p-8 relative overflow-hidden shadow-2xl">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Terminal size={20} className="text-cyan-400" /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              SYSTEM DIAGNOSTICS
            </span>
          </h2>
          <span className="animate-pulse text-xs text-cyan-500 font-bold">RUNNING_CHECKS...</span>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">CPU_LOAD</span>
              <span className="font-bold text-cyan-400">{Math.floor(Math.random() * 30 + 10)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: "10%" }}
                animate={{ width: ["10%", "40%", "20%", "60%"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">MEMORY_ALLOC</span>
              <span className="font-bold text-purple-400">{Math.floor(Math.random() * 20 + 40)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: "40%" }}
                animate={{ width: ["40%", "45%", "42%", "48%"] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <StatusItem icon={Cpu} label="CORE" status="OK" color="cyan" />
             <StatusItem icon={Database} label="DATA" status="OK" color="purple" />
             <StatusItem icon={Shield} label="SECURE" status="TRUE" color="green" />
             <StatusItem icon={Activity} label="PING" status="12ms" color="yellow" />
          </div>
        </div>

        {/* Terminal Output */}
        <div className="bg-[#050508] border border-slate-800 rounded-lg p-4 h-48 overflow-hidden font-mono text-xs mb-6 flex flex-col justify-end relative z-10 shadow-inner">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-1 flex gap-2"
            >
              <span className="text-slate-500">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
              <span className="text-cyan-400">➜</span>
              <span className="text-slate-300">{log.split('] ')[1] || log}</span>
            </motion.div>
          ))}
          <div className="animate-pulse text-cyan-500">_</div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1 z-10">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className={`text-xs font-bold inline-block py-1 px-2 rounded-full ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                {isComplete ? "COMPLETE" : "IN PROGRESS"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold inline-block text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-800">
            <motion.div 
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300"
            />
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md z-20"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">SYSTEM OPTIMAL</h3>
              <p className="text-slate-400">All systems functioning within normal parameters.</p>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

const StatusItem = ({ icon: Icon, label, status, color }) => {
  const colorStyles = {
    cyan: {
      bg: "bg-cyan-500/5",
      border: "border-cyan-500/20",
      icon: "text-cyan-500",
      label: "text-cyan-400/60",
      status: "text-cyan-400"
    },
    purple: {
      bg: "bg-purple-500/5",
      border: "border-purple-500/20",
      icon: "text-purple-500",
      label: "text-purple-400/60",
      status: "text-purple-400"
    },
    green: {
      bg: "bg-green-500/5",
      border: "border-green-500/20",
      icon: "text-green-500",
      label: "text-green-400/60",
      status: "text-green-400"
    },
    yellow: {
      bg: "bg-yellow-500/5",
      border: "border-yellow-500/20",
      icon: "text-yellow-500",
      label: "text-yellow-400/60",
      status: "text-yellow-400"
    }
  };

  const styles = colorStyles[color] || colorStyles.cyan;

  return (
    <div className={`flex items-center gap-2 ${styles.bg} p-2 rounded border ${styles.border}`}>
      <Icon size={14} className={styles.icon} />
      <div>
        <div className={`text-[10px] ${styles.label}`}>{label}</div>
        <div className={`text-xs font-bold ${styles.status}`}>{status}</div>
      </div>
    </div>
  );
};

export default DiagnosticsOverlay;
