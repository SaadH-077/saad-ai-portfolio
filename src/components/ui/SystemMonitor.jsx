import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Cpu, HardDrive } from 'lucide-react';

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState({
    cpu: 12,
    memory: 45,
    latency: 24,
    uptime: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(20, prev.memory + (Math.random() * 5 - 2.5))),
        latency: Math.max(10, prev.latency + (Math.random() * 10 - 5)),
        uptime: prev.uptime + 1
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-6 z-40 hidden lg:flex flex-col gap-2 pointer-events-none mix-blend-difference">
      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-green-500" />
          <span className="hidden xl:inline">SYS_STATUS:</span>
          <span className="text-green-500 font-bold">ONLINE</span>
        </div>
        <div className="w-[1px] h-3 bg-slate-800" />
        <div className="flex items-center gap-2">
          <Wifi size={12} className={metrics.latency > 100 ? "text-yellow-500" : "text-green-500"} />
          <span>{Math.floor(metrics.latency)}ms</span>
        </div>
        <div className="w-[1px] h-3 bg-slate-800" />
        <div className="flex items-center gap-2">
          <Cpu size={12} className="text-purple-500" />
          <span>CPU: {Math.floor(metrics.cpu)}%</span>
        </div>
        <div className="w-[1px] h-3 bg-slate-800" />
        <div className="flex items-center gap-2">
          <HardDrive size={12} className="text-cyan-500" />
          <span>MEM: {Math.floor(metrics.memory)}%</span>
        </div>
        <div className="w-[1px] h-3 bg-slate-800" />
        <div className="pl-1">
           <span className="opacity-50">UP:</span> {formatTime(metrics.uptime)}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;