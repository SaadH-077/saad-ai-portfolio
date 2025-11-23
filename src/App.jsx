import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ExternalLink, 
  MousePointer2, 
  User, 
  MapPin, 
  GraduationCap, 
  Download, 
  Cpu, 
  Award, 
  Github, 
  Mail, 
  Linkedin,
  Database,
  Brain,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Zap
} from 'lucide-react';

// Components
import NeuralBackground from './components/3d/NeuralBackground';
import HeroAgenticBrain from './components/3d/HeroAgenticBrain';
import HyperMatrix from './components/3d/HyperMatrix';
import CyberHelix from './components/3d/CyberHelix';
import HolographicGlobe from './components/3d/HolographicGlobe';
import InteractiveTimeline from './components/ui/InteractiveTimeline';
import Navbar from './components/ui/Navbar';
import HoverCard from './components/ui/HoverCard';
import TypewriterText from './components/ui/TypewriterText';
import CustomCursor from './components/ui/CustomCursor';
import TechDivider from './components/ui/TechDivider';
import Preloader from './components/ui/Preloader';
import ScrollToTop from './components/ui/ScrollToTop';
import { Section, SectionHeading } from './components/ui/Section';
import ChatWidget from './components/ui/ChatWidget';
import NeuralClassifierGame from './components/game/NeuralClassifierGame';
import CommandPalette from './components/ui/CommandPalette';
import ProjectCard from './components/ui/ProjectCard';
import ArchitectureView from './components/ui/ArchitectureView';
import TerminalMode from './components/ui/TerminalMode';
import SystemMonitor from './components/ui/SystemMonitor';
import UserGuide from './components/ui/UserGuide';

// Assets
import profileImage from './assets/profile2.jpg';
import cvFile from './assets/Muhammad Saad Haroon - EuroPassCV 12_10_2025.pdf';

// Data
import { projects, technicalSkills, awards, certifications, experience } from './data/portfolioData';

const getColorHex = (color) => {
  const colors = {
    purple: '#a855f7',
    cyan: '#06b6d4',
    blue: '#3b82f6',
    green: '#22c55e',
    pink: '#ec4899',
    orange: '#f97316',
    yellow: '#eab308',
    red: '#ef4444'
  };
  return colors[color] || colors.purple;
};

const ExperienceCard = ({ exp }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <HoverCard onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{exp.title}</h3>
          <p className="text-sm text-slate-500 mb-2 font-mono">{exp.company}</p>
        </div>
        <div className={`text-${exp.color}-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside mt-4 pt-4 border-t border-white/10">
              {exp.points.map((point, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: point.replace(/"([^"]+)"/g, '<strong>"$1"</strong>') }} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <p className="text-xs text-slate-600 mt-2 italic">Click to view details...</p>
      )}
    </HoverCard>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      // Show guide on first visit after a short delay
      setTimeout(() => setIsGuideOpen(true), 1500);
      localStorage.setItem('hasVisited', 'true');
    }

    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      // Allow typing ` in chat if terminal is closed
      if ((e.key === '`' || e.key === '~') && isInput && !isTerminalOpen) {
        return;
      }

      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen]);

  const categories = ['All', 'ML/DL', 'GenAI / NLP', 'Computer Vision', 'Software Engineering'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-gradient-to-b from-[#050508] via-[#0b0b15] to-[#050508] text-slate-200 min-h-screen font-sans selection:bg-purple-500/30 selection:text-white overflow-x-hidden cursor-none">
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {isLoading && <Preloader setIsLoading={setIsLoading} />}
      </AnimatePresence>

      <CommandPalette />
      <TerminalMode isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <SystemMonitor />
      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <NeuralClassifierGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
      {selectedProject && (
        <ArchitectureView 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NeuralBackground />
          <Navbar onOpenGuide={() => setIsGuideOpen(true)} />
          <ScrollToTop />

          <main>
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen relative z-10 flex flex-col pt-24 lg:pt-0 overflow-hidden bg-[#050508]">
          
          {/* HUD / Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Left Grid */}
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
            
            {/* Floating Orbs */}
            <div className="absolute top-20 left-[10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            {/* Sci-Fi Rings (Left) */}
            <div className="absolute top-32 left-10 opacity-20 hidden lg:block">
              <div className="w-64 h-64 border border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite] border-t-transparent border-l-transparent" />
              <div className="w-48 h-48 border border-cyan-500/20 rounded-full absolute top-8 left-8 animate-[spin_15s_linear_infinite_reverse] border-b-transparent border-r-transparent" />
            </div>
          </div>

          <div className="flex-grow relative w-full h-full flex flex-col justify-end pb-12 lg:pb-20">
            
            {/* 3D Background Layer (Absolute & Centered) */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-full h-full relative flex items-center justify-center">
                
                {/* 3D Container */}
                <div className="relative w-full h-full z-10">
                   <HeroAgenticBrain />
                </div>

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
              </div>
            </div>

            {/* HUD Elements (Corners) */}
            <div className="absolute top-24 left-6 lg:left-12 flex flex-col gap-2 z-20 pointer-events-none mix-blend-difference">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-mono text-slate-400 tracking-widest">SYSTEM: ONLINE</span>
               </div>
               <span className="text-[10px] font-mono text-slate-600 tracking-widest">V.2.0.25</span>
            </div>

            <div className="absolute top-24 right-6 lg:right-12 flex flex-col items-end gap-2 z-20 pointer-events-none mix-blend-difference">
               <span className="text-[10px] font-mono text-slate-400 tracking-widest">[ LOC: 31.5°N, 74.3°E ]</span>
               <span className="text-[10px] font-mono text-slate-600 tracking-widest">LAHORE, PK</span>
               <div className="mt-2 px-2 py-1 border border-white/10 rounded bg-white/5 backdrop-blur-sm flex items-center gap-2">
                 <span className="text-[10px] font-mono text-slate-400">CMD + K</span>
               </div>
            </div>

            <div className="absolute bottom-12 left-6 lg:left-12 hidden lg:flex flex-col gap-6 z-20 pointer-events-auto">
               <a href="https://github.com/SaadH-077" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors"><Github size={20} /></a>
               <a href="https://www.linkedin.com/in/muhammad-saad-haroon-5b38a1241/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors"><Linkedin size={20} /></a>
               <a href="mailto:saadharoonjehangir@gmail.com" className="text-slate-500 hover:text-purple-400 transition-colors"><Mail size={20} /></a>
               <div className="w-[1px] h-12 bg-slate-800 mx-auto" />
            </div>

            <div className="absolute bottom-12 right-6 lg:right-12 hidden lg:flex flex-col items-center gap-4 z-20 pointer-events-none">
               <span className="text-[10px] font-mono text-slate-500 tracking-widest rotate-90 origin-right translate-x-2">SCROLL</span>
               <div className="w-[1px] h-12 bg-gradient-to-b from-slate-800 to-slate-500" />
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#050508] via-[#050508]/90 to-transparent z-0 pointer-events-none" />

            {/* Main Text Content (Centered & Minimal) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pointer-events-none mb-12"
            >
              <div className="pointer-events-auto w-full flex flex-col items-center">
                
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-6 relative z-20" style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(0,0,0,0.6))' }}>
                  SAAD<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 animate-gradient-x">.AI</span>
                </h1>
                
                <div className="flex items-center justify-center gap-4 text-lg md:text-xl font-light text-slate-300 mb-10 h-8 font-mono tracking-wide">
                  <span className="text-purple-500 font-bold">{'>'}</span>
                  <TypewriterText texts={["Agentic AI Architect", "Machine Learning Engineer", "Full Stack Developer"]} />
                  <span className="w-1.5 h-5 bg-purple-500 animate-blink ml-1" />
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <a href="#projects" className="group relative px-8 py-3 rounded-full backdrop-blur-md transition-all flex items-center gap-2 overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-sm font-bold font-mono text-white relative z-10 tracking-wide">EXPLORE WORK</span>
                  </a>
                  
                  <button 
                    onClick={() => setIsGameOpen(true)}
                    className="group relative px-8 py-3 bg-transparent border border-white/10 rounded-full backdrop-blur-md transition-all flex items-center gap-2 overflow-hidden hover:border-cyan-500/50"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Cpu size={18} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">NEURAL ARCHITECT</span>
                  </button>
                </div>

              </div>
            </motion.div>

          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 z-20"
          >
            {/* <span className="text-[10px] font-mono tracking-widest uppercase animate-pulse">Scroll to Scan</span> */}
            {/* <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" /> */}
          </motion.div>
        </section>

        <TechDivider />

        {/* ABOUT SECTION */}
        <Section id="about" className="relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
          <SectionHeading title="Developer Profile" subtitle="IDENTIFICATION" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            <div className="lg:col-span-5 relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative bg-[#0a0a0c]/90 border border-white/10 rounded-2xl p-6 overflow-hidden transform transition-transform group-hover:scale-[1.01] duration-500">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <span className="font-mono text-xs text-cyan-400">ID: SH-2025</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  </div>
                </div>

                <div className="w-full aspect-square bg-gradient-to-b from-slate-800 to-black rounded-xl mb-6 relative overflow-hidden group-inner border border-white/5">
                  <img 
                    src={profileImage} 
                    alt="Saad Haroon" 
                    className="w-full h-full object-cover object-[center_25%] opacity-100 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Name</span>
                    <p className="text-white font-bold tracking-wide">Muhammad Saad Haroon</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Role</span>
                    <p className="text-white font-bold tracking-wide">Software Engineer - ML</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Location</span>
                    <p className="text-slate-300 flex items-center gap-1"><MapPin size={12} className="text-cyan-500"/> Lahore, PK</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Education</span>
                    <p className="text-slate-300 flex items-center gap-1"><GraduationCap size={12} className="text-purple-500"/>LUMS</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="relative p-[1px] rounded-xl overflow-hidden group/oracle cursor-default">
                    {/* Animated Gradient Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 opacity-40 group-hover/oracle:opacity-100 transition-opacity duration-500 animate-gradient-xy" />
                    
                    <div className="relative bg-[#0a0a0c] rounded-xl p-4 flex items-center justify-between gap-4 h-full">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] group-hover/oracle:scale-110 transition-transform duration-300">
                          <Award className="text-white" size={24} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                            ORACLE CERTIFIED
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-gradient-to-r from-red-500 to-orange-500 text-white font-mono font-bold shadow-sm">PRO</span>
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-1 group-hover/oracle:text-slate-300 transition-colors">
                            Generative AI & Cloud Professional
                          </p>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-mono text-slate-300 tracking-wider">VERIFIED</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">ID: OCI-2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8 relative">
              <div className="absolute top-0 right-0 w-1/2 h-full -z-10 pointer-events-none">
                 <CyberHelix />
              </div>

              <h3 className="text-3xl font-bold text-white">Engineering Intelligent Systems</h3>
              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  I am a Software Engineer specializing in <strong className="text-white">Agentic AI</strong> and <strong className="text-white">Machine Learning</strong>, dedicated to building autonomous systems that solve complex enterprise challenges.
                </p>
                <p>
                  Graduating with <span className="text-cyan-400 font-medium">Distinction</span> from <strong>LUMS</strong> and recognized on the <strong>Dean's Honour List</strong> for three consecutive years, I combine rigorous academic foundations with practical engineering expertise. My work spans from co-authoring research on Generative AI storytelling at <strong>CSaLT</strong> to leading Deep Learning Education as a <strong>Head Teaching Assistant</strong>.
                </p>
                <p>
                  Currently, at <strong>GoSaaS</strong>, I lead the development of <strong>Oracle-based AI Agents</strong> in my capacity as a Software Engineer. I hold multiple <strong>Oracle Certifications</strong> in Generative AI and Cloud Infrastructure, leveraging this expertise to architect scalable, production-ready solutions that automate critical financial and operational workflows.
                </p>
              </div>
              
              <div className="flex gap-4">
                 <a 
                   href={cvFile} 
                   download="Muhammad_Saad_Haroon_CV.pdf"
                   className="group px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 border border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] rounded-lg text-white font-medium flex items-center gap-2 transition-all"
                 >
                   <Download size={18} className="text-purple-400 group-hover:text-white transition-colors" /> Download CV
                 </a>
              </div>
            </div>
          </div>
        </Section>

        <TechDivider />

        {/* EXPERIENCE SECTION */}
        <Section id="experience">
          <SectionHeading title="Professional Log" subtitle="TIMELINE" />

          <div className="relative space-y-16">
            <InteractiveTimeline />
            
            {experience.map((exp, index) => (
              exp.type === 'milestone' ? (
                <div key={index} className="relative flex justify-center items-center py-8 z-10">
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent absolute" />
                  <div className="bg-[#050508] border border-yellow-500/50 px-6 py-2 rounded-full text-yellow-400 text-sm font-mono flex items-center gap-3 shadow-[0_0_15px_rgba(234,179,8,0.2)] z-10">
                    <GraduationCap size={16} />
                    <span className="font-bold">{exp.title}</span>
                    <span className="w-1 h-1 rounded-full bg-yellow-500" />
                    <span className="text-xs text-yellow-200/70">{exp.company}</span>
                  </div>
                </div>
              ) : (
                <div key={index} className={`relative pl-12 md:pl-0 md:flex ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} md:justify-between items-center group`}>
                  <div 
                    className={`absolute left-[-9px] top-0 md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-[#050508] border-4 border-${exp.color}-500 z-10 group-hover:scale-125 transition-transform`}
                    style={{ boxShadow: `0 0 10px ${getColorHex(exp.color)}` }}
                  />
                  
                  <div className={`md:w-[45%] ${index % 2 !== 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'} mb-2 md:mb-0`}>
                    <span className={`font-mono text-${exp.color}-300 text-xs bg-${exp.color}-900/20 border border-${exp.color}-900/50 px-3 py-1 rounded`}>
                      {exp.date}
                    </span>
                  </div>

                  <div className={`md:w-[45%] ${index % 2 !== 0 ? 'md:pr-12 text-left' : 'md:pl-12 text-left'}`}>
                    <ExperienceCard exp={exp} />
                  </div>
                </div>
              )
            ))}

          </div>
        </Section>

        <TechDivider />

        {/* PROJECTS SECTION */}
        <Section id="projects" className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-purple-900/5 to-cyan-900/5 pointer-events-none" />
          <SectionHeading title="System Blueprints" subtitle="PROJECTS" />
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all border ${
                  activeCategory === cat 
                    ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard 
                    project={project} 
                    onViewArchitecture={setSelectedProject}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Section>

        <TechDivider />

        {/* NEW: SKILLS & CERTIFICATIONS SECTION */}
        <Section id="skills" className="relative">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
          <SectionHeading title="Technical Arsenal" subtitle="CAPABILITIES" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: 3D HyperMatrix */}
            <div className="lg:col-span-4 h-[400px] relative flex items-center justify-center">
               <HyperMatrix />
               {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                   <Cpu size={40} className="text-cyan-400 mx-auto mb-2 animate-pulse" />
                   <span className="text-xs font-mono text-cyan-500 tracking-widest">CORE_SYSTEMS</span>
                 </div>
               </div> */}
            </div>

            {/* Right: Categorized Skills Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {technicalSkills.map((skillGroup, idx) => (
                <HoverCard key={idx} className={`border-${skillGroup.color}-500/20 bg-${skillGroup.color}-900/5`}>
                  <div className={`flex items-center gap-3 mb-4 text-${skillGroup.color}-400`}>
                    <skillGroup.icon size={20} />
                    <h3 className="font-bold text-white">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map(s => (
                      <span key={s} className={`px-2 py-1 bg-${skillGroup.color}-900/20 border border-${skillGroup.color}-500/30 rounded text-xs text-${skillGroup.color}-300 hover:bg-${skillGroup.color}-500/20 transition-colors cursor-default`}>{s}</span>
                    ))}
                  </div>
                </HoverCard>
              ))}

              {/* Certifications - Full Width */}
              <div className="md:col-span-2">
                <HoverCard className="border-yellow-500/20 bg-yellow-900/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-yellow-400">
                      <Award size={20} />
                      <h3 className="font-bold text-white">Certifications</h3>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono animate-pulse flex items-center gap-1">
                      <MousePointer2 size={10} /> Click to Verify
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certifications.map((cert, idx) => (
                      <a 
                        key={idx} 
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-yellow-500/30 transition-all group/cert"
                      >
                        <div className="mt-1.5 min-w-[6px] h-1.5 rounded-full bg-yellow-500 group-hover/cert:shadow-[0_0_8px_rgba(234,179,8,0.6)] transition-shadow" />
                        <div>
                          <h4 className="text-sm font-medium text-slate-200 group-hover/cert:text-yellow-200 transition-colors leading-tight mb-1">
                            {cert.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>{cert.issuer}</span>
                            <span>•</span>
                            <span>{cert.date}</span>
                            <ExternalLink size={10} className="opacity-0 group-hover/cert:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </HoverCard>
              </div>

            </div>
          </div>
        </Section>

        <TechDivider />

        {/* NEW: HONORS & AWARDS SECTION */}
        <Section id="awards" className="relative">
          <SectionHeading title="Honors & Recognitions" subtitle="ACHIEVEMENTS" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, i) => (
              <HoverCard key={i} className={`border-${award.color}-500/20 bg-${award.color}-900/5 text-center group`}>
                <div className={`w-12 h-12 rounded-full bg-${award.color}-500/10 flex items-center justify-center mx-auto mb-4 text-${award.color}-400 group-hover:scale-110 transition-transform`}>
                  <award.icon size={24} />
                </div>
                <h3 className="font-bold text-white mb-2">{award.title}</h3>
                <p className="text-xs text-slate-400">{award.desc}</p>
              </HoverCard>
            ))}
          </div>
        </Section>

        <TechDivider />

        {/* CONTACT SECTION */}
        <Section id="contact">
          <div className="max-w-5xl mx-auto relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10 opacity-50 pointer-events-none">
                <HolographicGlobe />
             </div>
             <SectionHeading title="Initialize Uplink" subtitle="CONTACT" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 relative z-10">
              
              {/* Terminal Input Simulation */}
              <div className="bg-[#0a0a0c] border border-slate-800 rounded-xl p-6 font-mono text-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-2 text-slate-400">
                  <p><span className="text-green-500">➜</span> <span className="text-purple-400">~</span> initializing secure connection...</p>
                  <p><span className="text-green-500">➜</span> <span className="text-purple-400">~</span> resolving host: <span className="text-white">saad.ai</span></p>
                  <p><span className="text-green-500">➜</span> <span className="text-purple-400">~</span> status: <span className="text-green-400">online</span></p>
                  <p className="animate-pulse"><span className="text-green-500">➜</span> <span className="text-purple-400">~</span> awaiting input_</p>
                </div>
                
                <div className="mt-8 grid grid-cols-1 gap-4">
                  <a href="mailto:saadharoonjehangir@gmail.com" className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group/item">
                    <span className="flex items-center gap-2 text-slate-300"><Mail size={16} /> Send Email</span>
                    <span className="text-xs text-slate-500 group-hover/item:text-purple-400">SMTP: CONNECT</span>
                  </a>
                  <a href="https://www.linkedin.com/in/muhammad-saad-haroon-5b38a1241/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group/item">
                    <span className="flex items-center gap-2 text-slate-300"><Linkedin size={16} /> LinkedIn</span>
                    <span className="text-xs text-slate-500 group-hover/item:text-blue-400">NET: LINKED</span>
                  </a>
                  <a href="https://github.com/SaadH-077" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:border-slate-500/50 hover:bg-slate-500/10 transition-all group/item">
                    <span className="flex items-center gap-2 text-slate-300"><Github size={16} /> GitHub</span>
                    <span className="text-xs text-slate-500 group-hover/item:text-white">GIT: PUSH</span>
                  </a>
                </div>
              </div>

              {/* Quick Message Form / Info */}
              <div className="flex flex-col justify-between">
                <div className="bg-[#0a0a0c] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     <Activity className="text-cyan-400" /> Transmission Status
                   </h3>
                   <p className="text-slate-400 text-sm leading-relaxed mb-6">
                     I am currently available for freelance projects, research collaborations, and full-time engineering roles. 
                     Response time is typically under 24 hours.
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
                       <span className="text-[10px] text-cyan-400 uppercase tracking-wider">Location</span>
                       <p className="text-white font-mono text-sm">Lahore, PK</p>
                     </div>
                     <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                       <span className="text-[10px] text-purple-400 uppercase tracking-wider">Timezone</span>
                       <p className="text-white font-mono text-sm">GMT+5 (PKT)</p>
                     </div>
                   </div>
                </div>

                <div className="mt-auto pt-8 flex justify-between items-end text-xs text-slate-600 font-mono">
                  <div className="flex flex-col">
                    <span>SYSTEM ID: SH-2025</span>
                    <span>SECURE CHANNEL ESTABLISHED</span>
                  </div>
                  <span>© {new Date().getFullYear()} SAAD.AI</span>
                </div>
              </div>

            </div>
          </div>
        </Section>
      </main>

          <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </motion.div>
      )}
    </div>
  );
};

export default App;
