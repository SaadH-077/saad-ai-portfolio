import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Server, Globe, Brain, Layers, ArrowRight, Cpu, Code, FileCode, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ArchitectureView = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('blueprint'); // 'blueprint' or 'code'
  const [copied, setCopied] = useState(false);

  if (!project.architecture) return null;

  const { nodes, edges } = project.architecture;

  const handleCopy = () => {
    navigator.clipboard.writeText(project.codeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to get icon for node type
  const getNodeIcon = (type) => {
    switch (type) {
      case 'client': return Globe;
      case 'server': return Server;
      case 'database': return Database;
      case 'ai': return Brain;
      case 'service': return Cpu;
      case 'code': return Code;
      default: return Layers;
    }
  };

  // Helper to get color for node type
  const getNodeColor = (type) => {
    switch (type) {
      case 'client': return 'text-blue-400 border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
      case 'server': return 'text-green-400 border-green-500/50 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
      case 'database': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
      case 'ai': return 'text-purple-400 border-purple-500/50 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
      case 'service': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
      case 'code': return 'text-pink-400 border-pink-500/50 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.2)]';
      default: return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-[#0a0a0a] border-t md:border border-slate-800 rounded-t-2xl md:rounded-xl overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-auto md:max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-900/50 shrink-0">
            <div className="min-w-0 flex-1 mr-4">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 truncate">
                <Cpu className="text-cyan-400 shrink-0" size={20} />
                <span className="truncate">System Architecture</span>
              </h3>
              <p className="text-xs md:text-sm text-slate-400 font-mono mt-1 truncate">
                {project.title} // Technical Blueprint
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {/* Tabs */}
              <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setActiveTab('blueprint')}
                  className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-mono transition-all ${
                    activeTab === 'blueprint' 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  BLUEPRINT
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 md:px-4 py-1.5 rounded-md text-[10px] md:text-xs font-mono transition-all flex items-center gap-2 ${
                    activeTab === 'code' 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <FileCode size={12} /> <span className="hidden md:inline">SNIPPET</span>
                </button>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative flex-grow overflow-hidden bg-[#050505]">
            
            {activeTab === 'blueprint' ? (
              <div className="w-full h-full p-4 md:p-8 overflow-auto overscroll-contain pb-24 md:pb-8">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ 
                       backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
                       backgroundSize: '40px 40px' 
                     }} 
                />

                {/* Flow Container */}
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-4 w-full md:w-max md:min-w-full pb-8 mx-auto">
                  {['client', 'server', 'service', 'ai', 'database', 'code']
                    .filter(layer => nodes.some(n => n.type === layer))
                    .map((layer, layerIndex, array) => {
                    const layerNodes = nodes.filter(n => n.type === layer);
                    
                    return (
                      <React.Fragment key={layer}>
                        <div className="flex flex-col gap-6 items-center justify-start w-full md:w-64 shrink-0">
                          {/* Layer Label */}
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 border-b border-slate-800 pb-2 w-full justify-center">
                            {layer === 'ai' ? <Brain size={12} /> : 
                             layer === 'database' ? <Database size={12} /> :
                             layer === 'client' ? <Globe size={12} /> :
                             layer === 'server' ? <Server size={12} /> :
                             <Layers size={12} />
                            }
                            {layer === 'ai' ? 'AI Models' : layer}
                          </div>

                          {layerNodes.map((node, index) => {
                            const Icon = getNodeIcon(node.type);
                            return (
                              <motion.div
                                key={node.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: layerIndex * 0.1 + index * 0.1 }}
                                className={`relative group w-full p-4 rounded-xl border ${getNodeColor(node.type)} backdrop-blur-sm hover:scale-105 transition-all duration-300 flex flex-col gap-3`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="p-2 rounded-lg bg-white/5">
                                    <Icon size={18} />
                                  </div>
                                  <div className="text-[10px] font-mono opacity-50">#{node.id}</div>
                                </div>
                                
                                <div>
                                  <span className="font-bold text-sm block mb-1">{node.label}</span>
                                  <div className="text-[10px] opacity-70 font-mono leading-relaxed">
                                    {node.desc}
                                  </div>
                                </div>

                                {/* Connection Points */}
                                <div className="absolute top-1/2 -right-1 w-2 h-2 bg-current rounded-full opacity-0 group-hover:opacity-50 transition-opacity translate-x-1/2 hidden md:block" />
                                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-current rounded-full opacity-0 group-hover:opacity-50 transition-opacity -translate-x-1/2 hidden md:block" />
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Pipeline Connector */}
                        {layerIndex < array.length - 1 && (
                          <div className="flex md:flex-col items-center justify-center gap-2 text-slate-700 md:pt-20 shrink-0">
                            <div className="hidden md:flex w-8 h-[2px] bg-gradient-to-r from-slate-800 to-slate-700" />
                            <ArrowRight size={20} className="hidden md:block text-slate-600 animate-pulse" />
                            <div className="hidden md:flex w-8 h-[2px] bg-gradient-to-r from-slate-700 to-slate-800" />
                            
                            {/* Mobile Down Arrow */}
                            <div className="md:hidden flex flex-col items-center gap-1 h-12">
                              <div className="w-[2px] h-full bg-gradient-to-b from-slate-800 to-slate-700" />
                              <div className="w-2 h-2 rotate-45 border-b-2 border-r-2 border-slate-600" />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Legend / Tech Stack */}
                <div className="w-full flex flex-wrap justify-center gap-2 text-[10px] font-mono mt-8 z-20">
                   <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">Client</span>
                   <span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/30 text-green-400">Server</span>
                   <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">AI Model</span>
                   <span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">Database</span>
                   <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">Service</span>
                </div>

                {/* Mobile Close Button */}
                <div className="w-full flex justify-center mt-8 md:hidden pb-8 relative z-30">
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-800/80 border border-white/10 rounded-full text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-lg backdrop-blur-sm"
                  >
                    <X size={16} /> Close Blueprint
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full overflow-auto bg-[#0d0d0d] p-4 md:p-8 pb-20 flex items-center justify-center">
                {project.codeSnippet ? (
                  <div className="w-full max-w-4xl relative rounded-lg overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-2xl">
                    
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                        <FileCode size={12} />
                        <span>src/modules/{project.title.toLowerCase().replace(/\s+/g, '_')}.{project.codeSnippet.language === 'python' ? 'py' : project.codeSnippet.language === 'javascript' ? 'js' : 'ts'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                          onClick={handleCopy}
                          className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
                          title="Copy Code"
                        >
                          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="relative overflow-x-auto max-h-[60vh] custom-scrollbar">
                      <SyntaxHighlighter 
                        language={project.codeSnippet.language} 
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '14px', lineHeight: '1.6', background: '#1e1e1e', minWidth: '100%' }}
                        showLineNumbers={true}
                        wrapLines={true}
                        lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#6e7681', textAlign: 'right' }}
                      >
                        {project.codeSnippet.code}
                      </SyntaxHighlighter>
                    </div>

                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-4 py-1.5 bg-[#007acc] text-white text-[10px] font-mono">
                      <div className="flex items-center gap-4">
                        <span>main*</span>
                        <span>{project.codeSnippet.language.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Ln {project.codeSnippet.code.split('\n').length}, Col 1</span>
                        <span>UTF-8</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                    <Code size={48} className="opacity-20" />
                    <p className="font-mono text-sm">No code snippet available for this project.</p>
                  </div>
                )}

                {/* Mobile Close Button for Code View */}
                <div className="w-full flex justify-center mt-8 md:hidden pb-8 relative z-30">
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-800/80 border border-white/10 rounded-full text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-lg backdrop-blur-sm"
                  >
                    <X size={16} /> Close Snippet
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArchitectureView;
