import React, { useState } from 'react';
import { Terminal, Menu, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import profileImage from '../../assets/profile2.jpg';

const Navbar = ({ onOpenGuide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = ['About', 'Experience', 'Skills', 'Projects', 'Awards', 'Contact'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030305]/80 backdrop-blur-lg border-b border-white/5">
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-lg relative group">
            {/* <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-transparent transition-colors" /> */}
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-tight text-sm">MUHAMMAD SAAD HAROON</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest">Software Engineer - Machine Learning</span>
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6 text-xs font-medium text-slate-400 font-mono">
            {navLinks.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition-colors uppercase">
                {item}
              </a>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenGuide}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="System Manual"
            >
              <HelpCircle size={18} />
            </button>
            
            <a href="#contact" className="flex px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded border border-white/10 hover:border-purple-500/50 transition-all items-center gap-2">
              <Terminal size={14} /> CONTACT
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={onOpenGuide}
            className="text-slate-400 hover:text-white"
          >
            <HelpCircle size={20} />
          </button>
          <button 
            className="text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030305] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-mono text-slate-300 hover:text-purple-400 uppercase py-2 border-b border-white/5"
                >
                  {item}
                </a>
              ))}
              <a 
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-sm font-mono text-purple-400 font-bold mt-2"
              >
                <Terminal size={14} /> CONTACT ME
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
