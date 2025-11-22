import React from 'react';
import { motion, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';

const HoverCard = ({ children, className = "", onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  return (
    <div
      onMouseMove={onMouseMove}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#0a0a0c]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 group transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(189,0,255,0.1)] ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(189, 0, 255, 0.15), transparent 40%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HoverCard;
