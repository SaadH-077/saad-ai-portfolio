import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ setIsLoading }) => {
  const [lines, setLines] = useState([]);
  
  const bootSequence = [
    { text: "INITIALIZING KERNEL...", delay: 0 },
    { text: "LOADING NEURAL MODULES...", delay: 400 },
    { text: "OPTIMIZING GPU THREADS...", delay: 800 },
    { text: "CONNECTING TO SATELLITE UPLINK...", delay: 1200 },
    { text: "DECRYPTING SECURE DATA...", delay: 1600 },
    { text: "ACCESS GRANTED.", delay: 2200, color: "text-green-400" }
  ];

  useEffect(() => {
    let timeouts = [];
    
    bootSequence.forEach(({ text, delay, color }, index) => {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, { text, color }]);
        
        // If it's the last line, finish loading after a brief pause
        if (index === bootSequence.length - 1) {
          setTimeout(() => setIsLoading(false), 800);
        }
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [setIsLoading]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#030305] flex flex-col items-center justify-center font-mono"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-80 md:w-96 p-6 border border-white/10 rounded-lg bg-black/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
          <span className="text-[10px] text-slate-500">BOOT_SEQUENCE_V2.0</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>

        {/* Terminal Output */}
        <div className="space-y-2 h-40 flex flex-col justify-end">
          {lines.map((line, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xs md:text-sm ${line.color || 'text-cyan-500/80'}`}
            >
              <span className="mr-2 opacity-50">{`>`}</span>
              {line.text}
            </motion.div>
          ))}
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-cyan-500/50"
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
