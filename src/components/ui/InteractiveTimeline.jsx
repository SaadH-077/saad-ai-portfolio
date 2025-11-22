import React from 'react';
import { motion } from 'framer-motion';

const InteractiveTimeline = () => {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-30 md:left-1/2 md:-ml-[0.5px]">
        <motion.div 
            className="absolute top-0 left-0 w-full bg-white blur-sm"
            style={{ height: "20%" }} // Static glow for visual effect
            animate={{ top: ["0%", "80%", "0%"], opacity: [0, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
    </div>
  );
};

export default InteractiveTimeline;
