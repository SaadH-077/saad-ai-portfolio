import React from 'react';
import { motion } from 'framer-motion';

export const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-24 px-6 relative z-10 ${className}`}>
    <div className="max-w-6xl mx-auto">{children}</div>
  </section>
);

export const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-16">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-2 text-purple-500 font-mono text-xs tracking-widest mb-2 uppercase"
    >
      <span className="w-12 h-[1px] bg-purple-500/50"></span>
      {subtitle}
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold text-white"
    >
      {title}
    </motion.h2>
  </div>
);
