import React, { useState, useEffect, useRef } from 'react';
import { Mic, Activity, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceCommand = ({ 
  onOpenTerminal, 
  onOpenGame, 
  onOpenExplorer, 
  onOpenGuide, 
  onRunDiagnostics,
  onAudioLevel // New prop for passing audio level
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  
  // Audio Analysis Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
    return () => {
      stopAudioAnalysis();
    };
  }, []);

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const analyze = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for(let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedLevel = Math.min(average / 100, 1); // Normalize 0-1
        
        if (onAudioLevel) {
          onAudioLevel(normalizedLevel);
        }
        
        animationFrameRef.current = requestAnimationFrame(analyze);
      };
      
      analyze();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (onAudioLevel) {
      onAudioLevel(0);
    }
  };

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    try {
      startAudioAnalysis(); // Start analyzing audio for visuals

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setFeedback('Listening...');
      };

      recognitionRef.current.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setTranscript(command);
        processCommand(command);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        stopAudioAnalysis(); // Stop analysis when listening ends
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setFeedback('Error: ' + event.error);
        stopAudioAnalysis();
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
      stopAudioAnalysis();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      stopAudioAnalysis();
    }
  };

  const processCommand = (cmd) => {
    setFeedback(`Processing: "${cmd}"`);
    
    // Navigation Commands
    if (cmd.includes('home') || cmd.includes('top')) {
      scrollToSection('home');
    } else if (cmd.includes('about') || cmd.includes('profile')) {
      scrollToSection('about');
    } else if (cmd.includes('experience') || cmd.includes('timeline') || cmd.includes('history')) {
      scrollToSection('experience');
    } else if (cmd.includes('project') || cmd.includes('work')) {
      scrollToSection('projects');
    } else if (cmd.includes('skill') || cmd.includes('tech')) {
      scrollToSection('skills');
    } else if (cmd.includes('contact') || cmd.includes('email')) {
      scrollToSection('contact');
    } 
    // Feature Commands
    else if (cmd.includes('terminal') || cmd.includes('console')) {
      onOpenTerminal();
      setFeedback('Opening Terminal...');
    } else if (cmd.includes('game') || cmd.includes('play')) {
      onOpenGame();
      setFeedback('Launching Game...');
    } else if (cmd.includes('galaxy') || cmd.includes('explore')) {
      onOpenExplorer();
      setFeedback('Launching Galaxy Explorer...');
    } else if (cmd.includes('guide') || cmd.includes('help')) {
      onOpenGuide();
      setFeedback('Opening Guide...');
    } else if (cmd.includes('diagnostic') || cmd.includes('system') || cmd.includes('scan')) {
      onRunDiagnostics();
      setFeedback('Running Diagnostics...');
    } 
    // Extended Commands
    else if (cmd.includes('resume') || cmd.includes('cv') || cmd.includes('download')) {
      const link = document.querySelector('a[download]');
      if (link) {
        link.click();
        setFeedback('Downloading CV...');
      } else {
        scrollToSection('about');
        setFeedback('Navigating to CV...');
      }
    }
    else if (cmd.includes('github') || cmd.includes('git')) {
      window.open('https://github.com/SaadH-077', '_blank');
      setFeedback('Opening GitHub...');
    }
    else if (cmd.includes('linkedin')) {
      window.open('https://www.linkedin.com/in/muhammad-saad-haroon-5b38a1241/', '_blank');
      setFeedback('Opening LinkedIn...');
    }
    else if (cmd.includes('scroll down') || cmd.includes('down')) {
      window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
      setFeedback('Scrolling Down...');
    }
    else if (cmd.includes('scroll up') || cmd.includes('up')) {
      window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
      setFeedback('Scrolling Up...');
    }
    else if (cmd.includes('hello') || cmd.includes('hi') || cmd.includes('who are you')) {
      setFeedback('I am SAAD.AI, an Agentic Interface.');
    }
    else {
      setFeedback('Command not recognized.');
    }

    setTimeout(() => {
      setTranscript('');
      setFeedback('');
    }, 3000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setFeedback(`Navigating to ${id}...`);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-24 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {(transcript || feedback) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-black/80 border border-cyan-500/30 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-mono text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-2"
          >
            <div className="flex items-center gap-2">
               <Command size={12} />
               <span>{feedback || transcript}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleListening}
        className={`relative group p-3 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
            : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
        } border backdrop-blur-md`}
        title="Voice Command (Beta)"
      >
        {isListening ? (
          <>
            <span className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-50" />
            <Activity size={20} className="animate-pulse" />
          </>
        ) : (
          <Mic size={20} />
        )}
      </button>
    </div>
  );
};

export default VoiceCommand;
