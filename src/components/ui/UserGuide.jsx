import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Command, Gamepad2, MousePointer2, X, HelpCircle, Cpu, Rocket, Activity, Mic, Settings, Code } from 'lucide-react';

const UserGuide = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="text-cyan-400" /> SYSTEM MANUAL
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">INTERACTIVE FEATURE GUIDE v2.1</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar">
              <Feature 
                icon={Terminal} 
                title="Terminal Mode" 
                shortcut="Press ~ or `"
                desc="Access the developer CLI to run system commands like 'skills', 'projects', or 'hire'."
                color="green"
              />
              <Feature 
                icon={Command} 
                title="Command Palette" 
                shortcut="CMD + K"
                desc="Quickly navigate to any section or external link using the global search."
                color="purple"
              />
              <Feature 
                icon={Rocket} 
                title="Galaxy Explorer" 
                shortcut="Click 'Explore Galaxy'"
                desc="Navigate a 3D visualization of 7 neural architectures (CNN, GAN, Transformers, etc.). Use Arrow Keys to navigate. Optimized for Mobile."
                color="orange"
              />
              <Feature 
                icon={Activity} 
                title="System Diagnostics" 
                shortcut="CMD + K -> Run Diagnostics"
                desc="Initiate a full system scan to verify neural pathways, rendering engine status, and security protocols via a visual overlay."
                color="blue"
              />
              <Feature 
                icon={Gamepad2} 
                title="Neural Training" 
                shortcut="Click 'Neural Architect'"
                desc="Test your reflexes in the Neural Classifier mini-game located in the Hero section."
                color="red"
              />
              <Feature 
                icon={Cpu} 
                title="System Blueprints" 
                shortcut="Click 'Blueprint'"
                desc="View the technical architecture and code snippets for each project."
                color="cyan"
              />
              <Feature 
                icon={Mic} 
                title="Voice Command" 
                shortcut="Click Mic Icon"
                desc="Navigate the site and control features using voice commands. Try saying 'Open Terminal' or 'Go to Projects'."
                color="pink"
              />
              <Feature 
                icon={Settings} 
                title="Dev Tools" 
                shortcut="CTRL + SHIFT + D"
                desc="Open the runtime configurator to tweak visuals, audio sensitivity, and system colors in real-time."
                color="yellow"
              />
              <Feature 
                icon={Code} 
                title="Matrix Mode" 
                shortcut="Toggle in DevTools"
                desc="Enter the Matrix. A complete visual overhaul transforming the interface into a retro-futuristic terminal."
                color="green"
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center shrink-0">
              <p className="text-[10px] text-slate-500 font-mono">
                * Features are optimized for both Desktop and Mobile experiences.
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-slate-200 transition-colors text-sm"
              >
                ACKNOWLEDGE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Feature = ({ icon: Icon, title, shortcut, desc, color }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
    <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-400 shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon size={20} />
    </div>
    <div>
      <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
      <div className="text-[10px] font-mono text-cyan-400 mb-2 border border-cyan-500/30 bg-cyan-500/10 inline-block px-2 py-0.5 rounded">
        {shortcut}
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default UserGuide;