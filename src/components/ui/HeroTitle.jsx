import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+[]{}|;:,.<>?";

const ROLES = [
  { t1: "AGENTIC AI", t2: "ARCHITECT", t3: "" },
  { t1: "MACHINE LEARNING", t2: "ENGINEER", t3: "" },
  { t1: "FULL-STACK", t2: "DEVELOPER", t3: "" },
  { t1: "SOFTWARE", t2: "ENGINEER", t3: "" }
];

const HeroTitle = () => {
  const [text1, setText1] = useState("SAAD");
  const [text2, setText2] = useState("HAROON");
  const [text3, setText3] = useState("");
  const [cycleState, setCycleState] = useState(0); // 0 = Name, 1 = Role 0, 2 = Name, 3 = Role 1...
  const intervalRef = useRef(null);

  const scramble = (targetText, setTextFn) => {
    let iteration = 0;
    // Note: We are not clearing a global interval here, but creating a new one per text field.
    // Ideally we should track intervals per field, but for this effect it's okay if they overlap slightly.
    
    const interval = setInterval(() => {
      setTextFn(prev => 
        targetText
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return targetText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if(iteration >= targetText.length) { 
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 30);
    
    return interval;
  };

  useEffect(() => {
    const loop = setInterval(() => {
      setCycleState(prev => (prev + 1) % (ROLES.length * 2));
    }, 4000);

    return () => clearInterval(loop);
  }, []);

  useEffect(() => {
    if (cycleState % 2 === 0) {
      // Even state: Show Name
      scramble("SAAD", setText1);
      setTimeout(() => scramble("HAROON", setText2), 100);
      setText3(""); // Clear 3rd line for name
    } else {
      // Odd state: Show Role
      const roleIndex = Math.floor(cycleState / 2);
      const role = ROLES[roleIndex];
      scramble(role.t1, setText1);
      setTimeout(() => scramble(role.t2, setText2), 100);
      if (role.t3) {
        setTimeout(() => scramble(role.t3, setText3), 200);
      } else {
        setText3("");
      }
    }
  }, [cycleState]);

  return (
    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-10 relative z-20 flex flex-col items-center gap-2 select-none min-h-[1.2em] text-center justify-center"
        style={{ filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(0,0,0,0.6))' }}>
      
      <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center justify-center flex-wrap">
        {/* First Word */}
        <motion.span 
          className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-white hover:from-purple-400 hover:to-cyan-400 transition-all duration-500"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {text1}
        </motion.span>

        {/* Second Word */}
        <motion.span 
          className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 animate-gradient-x"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {text2}
        </motion.span>

        {/* Third Word (Conditional) */}
        {text3 && (
          <motion.span 
            className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {text3}
          </motion.span>
        )}
      </div>
      
    </h1>
  );
};

export default HeroTitle;
