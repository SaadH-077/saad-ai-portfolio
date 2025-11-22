import React, { useState } from 'react';
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
  Linkedin 
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
import { Section, SectionHeading } from './components/ui/Section';
// import ChatWidget from './components/ui/ChatWidget';

// Assets
import profileImage from './assets/profile.jpg';
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

const App = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  // const [isChatOpen, setIsChatOpen] = useState(false);
  const categories = ['All', 'ML/DL', 'GenAI / NLP', 'Computer Vision', 'Software Engineering'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-gradient-to-b from-[#050508] via-[#0b0b15] to-[#050508] text-slate-200 min-h-screen font-sans selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
      <NeuralBackground />
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen relative z-10 flex flex-col pt-24 lg:pt-0 overflow-hidden bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full h-full relative items-center">
            
            {/* Left: Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center px-6 z-20"
            >
              <div className="flex items-center gap-4 mb-8 opacity-70">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-purple-500" />
                <div className="text-[10px] font-mono text-purple-400 tracking-[0.2em] uppercase">
                  System: Online
                </div>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-purple-500 to-transparent max-w-[100px]" />
              </div>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded border border-purple-500/30 bg-purple-900/20 text-purple-300 text-xs font-mono mb-8 w-fit backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Activity size={12} className="animate-pulse text-purple-400" />
                <span>OPEN FOR COLLABORATION</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                SAAD<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">.AI</span> <br />
                <span className="text-2xl md:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 tracking-normal block mt-2">
                  PERSONAL PORTFOLIO WEBSITE
                </span>
              </h1>
              
              <div className="flex items-center gap-4 text-xl md:text-2xl font-light text-slate-300 mb-8 h-12 font-mono">
                <span className="text-white-500 font-bold animate-pulse">{'>>>>>'}</span>
                <TypewriterText texts={["Agentic AI Developer", "Machine Learning Engineer", "Software Engineer"]} />
                <span className="text-white-500 font-bold animate-pulse">{'<<<<<'}</span>
              </div>

              <div className="relative max-w-lg mb-10 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative border-l-4 border-purple-500 pl-6 bg-[#0a0a0c]/80 backdrop-blur-sm py-6 pr-6 rounded-r-xl border-y border-r border-white/5">
                  <p className="text-lg text-slate-300 leading-relaxed">
                    Hello, I am <strong className="text-white font-semibold">Muhammad Saad Haroon</strong>. 
                    I architect <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Intelligent Agentic Systems</span>. 
                    My work bridges the gap between cutting-edge AI research and enterprise-grade production, creating autonomous agents that don't just predict—they reason, plan, and execute.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pointer-events-auto">
                <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2">
                  Explore Projects <ExternalLink size={18} />
                </a>
                {/* <button onClick={() => setIsChatOpen(true)} className="px-8 py-4 border border-slate-700 text-white font-medium rounded hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer">
                   Chat with Me <Mail size={18} />
                </button> */}
              </div>
            </motion.div>

            {/* Right: 3D Interactive */}
            <div className="relative h-[450px] lg:h-auto lg:static lg:flex lg:items-center lg:justify-center z-10 pointer-events-auto">
              <div className="w-full h-full lg:h-[800px] relative flex items-center justify-center">
                <div className="w-full h-full md:h-[700px]">
                   <HeroAgenticBrain />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent lg:hidden pointer-events-none" />
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute bottom-10 right-10 text-xs font-mono text-purple-500/70 flex items-center gap-2 bg-black/50 px-3 py-1 rounded border border-purple-900/50 backdrop-blur-sm"
                >
                  <MousePointer2 size={14} />
                  CLICK CORE TO SCATTER
                </motion.div>
              </div>
            </div>

          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 z-20"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Scan</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" />
          </motion.div>
        </section>

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
                  Graduating with <span className="text-cyan-400 font-medium">High Distinction</span> from <strong>LUMS</strong> and recognized on the <strong>Dean's Honour List</strong> for three consecutive years, I combine rigorous academic foundations with practical engineering expertise. My work spans from co-authoring research on Generative AI storytelling at <strong>CSaLT</strong> to leading Deep Learning instruction as a <strong>Head Teaching Assistant</strong>.
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
                    <HoverCard>
                      <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                      <p className="text-sm text-slate-500 mb-4 font-mono">{exp.company}</p>
                      <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
                        {exp.points.map((point, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: point.replace(/"([^"]+)"/g, '<strong>"$1"</strong>') }} />
                        ))}
                      </ul>
                    </HoverCard>
                  </div>
                </div>
              )
            ))}

          </div>
        </Section>

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
                  <div className="flex items-center gap-3 mb-4 text-yellow-400">
                    <Award size={20} />
                    <h3 className="font-bold text-white">Certifications</h3>
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
                  <HoverCard className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${project.color}-500/10 text-${project.color}-400`}>
                        <project.icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded text-slate-500 uppercase">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                      {project.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a 
                      href={project.link} 
                      target="_blank"
                      className="mt-auto w-full py-2 border border-slate-700 rounded flex items-center justify-center gap-2 text-sm text-white hover:bg-white hover:text-black transition-all font-bold group/btn"
                    >
                      <Github size={16} className="group-hover/btn:text-black transition-colors" /> View Code
                    </a>
                  </HoverCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Section>

        {/* CONTACT SECTION */}
        <Section id="contact">
          <div className="max-w-4xl mx-auto text-center relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10 opacity-50 pointer-events-none">
                <HolographicGlobe />
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
             <SectionHeading title="Let's Build the Future" subtitle="CONTACT" />
            
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              I am open to discussing technical collaborations, AI research, or complex engineering challenges.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
              <a 
                href="mailto:saadharoonjehangir@gmail.com"
                className="group px-8 py-5 bg-[#0a0a0c] border border-slate-700 rounded-xl hover:border-purple-500 transition-all hover:scale-105 flex items-center gap-3 text-white font-bold text-lg justify-center"
              >
                <Mail className="text-purple-400 group-hover:text-purple-300 transition-colors" /> Send Email
              </a>
              
              <a 
                href="https://www.linkedin.com/in/muhammad-saad-haroon-5b38a1241/"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-5 bg-[#0077b5] rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-3 text-white font-bold text-lg justify-center"
              >
                <Linkedin className="text-white" /> LinkedIn
              </a>

              <a 
                href="https://github.com/SaadH-077"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-5 bg-[#24292e] rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-slate-500/30 flex items-center gap-3 text-white font-bold text-lg justify-center"
              >
                <Github className="text-white" /> GitHub
              </a>
            </div>

            <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-mono">
              <span>LAHORE, PAKISTAN</span>
              <span>© {new Date().getFullYear()} MUHAMMAD SAAD HAROON</span>
            </div>
          </div>
        </Section>
      </main>

      {/* <ChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} /> */}
    </div>
  );
};

export default App;
