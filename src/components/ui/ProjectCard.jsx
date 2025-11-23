import React, { useState, useEffect } from 'react';
import { Star, GitFork, Github, ExternalLink, Cpu } from 'lucide-react';
import HoverCard from './HoverCard';

const ProjectCard = ({ project, onViewArchitecture }) => {
  const [stats, setStats] = useState({ stars: null, forks: null, loading: true });

  useEffect(() => {
    const fetchStats = async () => {
      if (!project.link || !project.link.includes('github.com')) {
        setStats({ loading: false });
        return;
      }

      try {
        // Extract owner/repo from URL
        // Example: https://github.com/SaadH-077/Repo-Name
        const repoPath = project.link.split('github.com/')[1];
        if (!repoPath) return;

        // Check local storage cache (1 hour expiry) to prevent rate limiting
        const cacheKey = `gh-stats-${repoPath}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 3600000) { // 1 hour
            setStats({ ...data, loading: false });
            return;
          }
        }

        const response = await fetch(`https://api.github.com/repos/${repoPath}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const newStats = { stars: data.stargazers_count, forks: data.forks_count };
        
        setStats({ ...newStats, loading: false });
        localStorage.setItem(cacheKey, JSON.stringify({ data: newStats, timestamp: Date.now() }));
        
      } catch (error) {
        // Fail silently and show no stats on error
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [project.link]);

  const getTagColor = (tag) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'cyan', 'pink', 'yellow', 'red'];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <HoverCard className="h-full group relative overflow-hidden">
      <div className="flex flex-col h-full">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${project.color}-500/10 text-${project.color}-400 ring-1 ring-${project.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
            <project.icon size={20} />
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <span className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded text-slate-500 uppercase bg-black/20 backdrop-blur-sm">
              {project.category}
            </span>

             {/* Live Stats Badge */}
             {!stats.loading && (stats.stars !== null || stats.forks !== null) && (
               <div className="flex items-center gap-3 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 animate-in fade-in duration-500">
                 <div className="flex items-center gap-1" title="GitHub Stars">
                   <Star size={10} className="text-yellow-500 fill-yellow-500" />
                   <span>{stats.stars || 0}</span>
                 </div>
                 <div className="flex items-center gap-1" title="GitHub Forks">
                   <GitFork size={10} className="text-slate-500" />
                   <span>{stats.forks || 0}</span>
                 </div>
               </div>
             )}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {project.desc}
          </p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
          {project.tags.map(tag => {
            const color = getTagColor(tag);
            return (
              <span key={tag} className={`text-[10px] font-mono text-${color}-400 bg-${color}-500/10 px-2 py-1 rounded border border-${color}-500/20 hover:border-${color}-500/50 transition-colors`}>
                {tag}
              </span>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-3 relative z-10 pt-4 border-t border-white/5">
          {project.architecture && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onViewArchitecture(project);
              }}
              className="flex-1 py-2.5 border border-purple-500/30 bg-purple-500/5 rounded-lg flex items-center justify-center gap-2 text-sm text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all font-bold group/arch"
            >
              <Cpu size={16} className="group-hover/arch:rotate-90 transition-transform" />
              <span>Blueprint</span>
            </button>
          )}

          <a 
            href={project.link} 
            target="_blank"
            rel="noreferrer"
            className={`py-2.5 border border-slate-700/50 rounded-lg flex items-center justify-center gap-2 text-sm text-slate-300 hover:bg-white hover:text-black transition-all font-bold group/btn relative overflow-hidden ${project.architecture ? 'flex-1' : 'w-full'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <Github size={16} className="group-hover/btn:text-black transition-colors" /> 
            <span>Source</span>
            <ExternalLink size={12} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </HoverCard>
  );
};

export default ProjectCard;
