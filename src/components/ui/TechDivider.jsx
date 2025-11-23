import React from 'react';

const TechDivider = () => {
  return (
    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="w-2 h-2 rotate-45 bg-purple-500/20 border border-purple-500/50" />
    </div>
  );
};

export default TechDivider;
