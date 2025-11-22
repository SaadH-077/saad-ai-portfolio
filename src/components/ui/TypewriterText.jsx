import React, { useState, useEffect } from 'react';

const TypewriterText = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink(!blink), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="font-mono tracking-wider">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 filter drop-shadow-[0_0_2px_rgba(6,182,212,0.5)]">
        {texts[index].substring(0, subIndex)}
      </span>
      <span className={`inline-block w-[3px] h-[1em] bg-purple-400 ml-1 align-middle shadow-[0_0_8px_#c084fc] ${blink ? "opacity-100" : "opacity-0"}`}></span>
    </span>
  );
};

export default TypewriterText;
