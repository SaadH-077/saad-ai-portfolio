import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  Github, 
  Linkedin, 
  Mail, 
  FileText, 
  Cpu, 
  Code, 
  Briefcase, 
  Award, 
  Terminal,
  ExternalLink,
  Zap
} from 'lucide-react';
import cvFile from '../../assets/Muhammad Saad Haroon - EuroPassCV 12_10_2025.pdf';

const CommandPalette = ({ onRunDiagnostics }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation Actions
  const navigateTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const openLink = (url) => {
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const commands = [
    {
      category: "Navigation",
      items: [
        { icon: Cpu, label: "Go to Hero", action: () => navigateTo('home') },
        { icon: Code, label: "Go to Projects", action: () => navigateTo('projects') },
        { icon: Briefcase, label: "Go to Experience", action: () => navigateTo('experience') },
        { icon: Zap, label: "Go to Skills", action: () => navigateTo('skills') },
        { icon: Award, label: "Go to Awards", action: () => navigateTo('awards') },
        { icon: Mail, label: "Contact Me", action: () => navigateTo('contact') },
      ]
    },
    {
      category: "Socials & Links",
      items: [
        { icon: Github, label: "GitHub Profile", action: () => openLink('https://github.com/SaadH-077') },
        { icon: Linkedin, label: "LinkedIn Profile", action: () => openLink('https://www.linkedin.com/in/muhammad-saad-haroon-5b38a1241/') },
        { icon: FileText, label: "View Resume", action: () => openLink(cvFile) },
      ]
    },
    {
      category: "System",
      items: [
        { icon: Terminal, label: "Run Diagnostics", action: () => { 
          if (onRunDiagnostics) onRunDiagnostics();
          setIsOpen(false); 
        }},
      ]
    }
  ];

  // Filter commands based on query
  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  })).filter(group => group.items.length > 0);

  // Flatten for keyboard navigation
  const flatItems = filteredCommands.flatMap(group => group.items);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          flatItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[60vh]"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="text-slate-400 mr-3" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg font-sans"
              />
              <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 font-mono border border-white/10 px-2 py-1 rounded">
                <span className="text-[10px]">ESC</span>
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto py-2 custom-scrollbar">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500">
                  No results found.
                </div>
              ) : (
                filteredCommands.map((group, groupIdx) => (
                  <div key={groupIdx} className="mb-2">
                    <div className="px-4 py-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                      {group.category}
                    </div>
                    {group.items.map((item, itemIdx) => {
                      // Calculate global index for highlighting
                      const globalIndex = filteredCommands
                        .slice(0, groupIdx)
                        .reduce((acc, g) => acc + g.items.length, 0) + itemIdx;
                      
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={itemIdx}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${
                            isSelected ? 'bg-purple-500/20 text-white' : 'text-slate-400 hover:bg-white/5'
                          }`}
                        >
                          <item.icon size={18} className={isSelected ? 'text-purple-400' : 'text-slate-500'} />
                          <span className="flex-1 font-medium">{item.label}</span>
                          {item.label.includes("Go to") && <Command size={14} className="opacity-20" />}
                          {item.label.includes("Link") && <ExternalLink size={14} className="opacity-20" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <div className="flex gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
              <span>Agentic AI Portfolio v2.0</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
