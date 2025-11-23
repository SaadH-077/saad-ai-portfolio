import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon } from 'lucide-react';

const TerminalMode = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'SAAD.AI TERMINAL [Version 2.0.25]' },
    { type: 'system', content: '(c) 2025 Muhammad Saad Haroon. All rights reserved.' },
    { type: 'info', content: 'Type "help" to see available commands.' }
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'user', content: cmd }];

    switch (cleanCmd) {
      case 'help':
        newHistory.push({ 
          type: 'response', 
          content: [
            'Available commands:',
            '  about     - Display developer profile',
            '  skills    - List technical capabilities',
            '  projects  - Show key projects',
            '  contact   - Display contact info',
            '  hire      - Initiate recruitment protocol',
            '  clear     - Clear terminal history',
            '  exit      - Close terminal session'
          ]
        });
        break;
      case 'about':
        newHistory.push({ 
          type: 'response', 
          content: 'Muhammad Saad Haroon | Software Engineer - Machine Learning & Full Stack Developer. Specializing in Agentic AI, RAG Systems, and Computer Vision.' 
        });
        break;
      case 'skills':
        newHistory.push({ 
          type: 'response', 
          content: 'Python, PyTorch, TensorFlow, React, Node.js, Oracle Cloud, LangChain, Docker, MongoDB, PostgreSQL.' 
        });
        break;
      case 'projects':
        newHistory.push({ 
          type: 'response', 
          content: '1. Adaptive Entropy UDA\n2. SmartCourseAdvisor (RAG)\n3. EmployNet Portal\n4. Road Damage Detection' 
        });
        break;
      case 'contact':
        newHistory.push({ 
          type: 'response', 
          content: 'Email: saadharoonjehangir@gmail.com\nGitHub: github.com/SaadH-077\nLinkedIn: linkedin.com/in/muhammad-saad-haroon' 
        });
        break;
      case 'hire':
        newHistory.push({
          type: 'response',
          content: [
            'INITIATING RECRUITMENT PROTOCOL...',
            '-----------------------------------',
            'Candidate: Muhammad Saad Haroon',
            'Status: Available for Hire',
            'Match Score: 99.9%',
            '-----------------------------------',
            'Action: Opening mail client...'
          ]
        });
        setTimeout(() => {
          window.location.href = "mailto:saadharoonjehangir@gmail.com?subject=Interview Request&body=Hi Saad, I was impressed by your portfolio...";
        }, 1500);
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        return;
      case '':
        break;
      default:
        newHistory.push({ type: 'error', content: `Command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-4 md:p-10 font-mono text-sm md:text-base overflow-hidden flex flex-col"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-green-500">
              <TerminalIcon size={20} />
              <span className="font-bold">TERMINAL_MODE</span>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Terminal Output */}
          <div className="flex-grow overflow-y-auto space-y-2 mb-4 scrollbar-hide">
            {history.map((entry, i) => (
              <div key={i} className={`${
                entry.type === 'user' ? 'text-white mt-4' : 
                entry.type === 'error' ? 'text-red-400' : 
                entry.type === 'system' ? 'text-slate-500' : 
                'text-green-400'
              }`}>
                {entry.type === 'user' && <span className="text-purple-500 mr-2">➜ ~</span>}
                {Array.isArray(entry.content) ? (
                  <div className="flex flex-col gap-1 pl-4">
                    {entry.content.map((line, j) => <span key={j}>{line}</span>)}
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{entry.content}</span>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 text-white border-t border-white/10 pt-4">
            <span className="text-purple-500">➜</span>
            <span className="text-cyan-500">~</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-grow font-mono text-white placeholder-slate-600"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalMode;
