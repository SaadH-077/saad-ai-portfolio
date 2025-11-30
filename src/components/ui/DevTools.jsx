import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, RefreshCw, Monitor, Volume2, Palette, Code } from 'lucide-react';

const DevTools = ({ isOpen, onClose, config, setConfig }) => {
  const [activeTab, setActiveTab] = useState('visuals');

  const handleReset = () => {
    setConfig({
      primaryColor: '#06b6d4',
      secondaryColor: '#a855f7',
      rotationSpeed: 1,
      particleSize: 1,
      audioSensitivity: 1.5,
      wireframe: false,
      matrixMode: false,
      showFps: false
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-24 left-6 z-50 w-80 bg-[#0a0a0c]/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden font-mono text-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-900/50">
        <div className="flex items-center gap-2 text-slate-200">
          <Settings size={16} className="animate-spin-slow" />
          <span className="font-bold tracking-wide">DEV_TOOLS_V1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors" title="Reset Defaults">
            <RefreshCw size={14} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('visuals')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'visuals' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Monitor size={12} /> VISUALS
        </button>
        <button 
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'audio' ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Volume2 size={12} /> AUDIO
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === 'system' ? 'bg-slate-800 text-green-400 border-b-2 border-green-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Code size={12} /> SYSTEM
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
        
        {activeTab === 'visuals' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center justify-between text-slate-400 text-xs">
                <span>Rotation Speed</span>
                <span className="text-cyan-400">{config.rotationSpeed.toFixed(1)}x</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.1" 
                value={config.rotationSpeed}
                onChange={(e) => setConfig({...config, rotationSpeed: parseFloat(e.target.value)})}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-slate-400 text-xs">
                <span>Particle Size</span>
                <span className="text-cyan-400">{config.particleSize.toFixed(1)}x</span>
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1" 
                value={config.particleSize}
                onChange={(e) => setConfig({...config, particleSize: parseFloat(e.target.value)})}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Wireframe Mode</span>
              <button 
                onClick={() => setConfig({...config, wireframe: !config.wireframe})}
                className={`w-10 h-5 rounded-full relative transition-colors ${config.wireframe ? 'bg-cyan-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.wireframe ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Matrix Mode</span>
              <button 
                onClick={() => setConfig({...config, matrixMode: !config.matrixMode})}
                className={`w-10 h-5 rounded-full relative transition-colors ${config.matrixMode ? 'bg-green-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.matrixMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center justify-between text-slate-400 text-xs">
                <span>Audio Sensitivity</span>
                <span className="text-purple-400">{config.audioSensitivity.toFixed(1)}x</span>
              </label>
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1" 
                value={config.audioSensitivity}
                onChange={(e) => setConfig({...config, audioSensitivity: parseFloat(e.target.value)})}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Adjusts how much the neural sphere reacts to microphone input.
            </p>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-slate-400 text-xs block mb-2">Primary Accent</label>
              <div className="flex gap-2">
                {['#06b6d4', '#a855f7', '#22c55e', '#ef4444', '#eab308'].map(color => (
                  <button
                    key={color}
                    onClick={() => setConfig({...config, primaryColor: color})}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${config.primaryColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="bg-black/50 p-3 rounded font-mono text-[10px] text-slate-400 overflow-hidden">
                <div className="flex justify-between mb-1">
                  <span>CONFIG_DUMP:</span>
                  <span className="text-green-500">OK</span>
                </div>
                <pre className="whitespace-pre-wrap break-all text-slate-500">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default DevTools;
