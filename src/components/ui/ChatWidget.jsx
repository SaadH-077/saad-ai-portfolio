import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle } from 'lucide-react';
import { projects, technicalSkills, experience, awards, certifications } from '../../data/portfolioData';

// --- HUGGING FACE API INTEGRATION ---
// The API Key is now handled securely on the server side (Vercel Functions)

const generateSystemContext = () => {
  const skillsStr = technicalSkills.map(s => `[${s.category}]: ${s.items.join(', ')}`).join('\n');
  const projectsStr = projects.map(p => `• ${p.title}: ${p.desc} [Tech: ${p.tags.join(', ')}]`).join('\n');
  const expStr = experience.map(e => `• ${e.title} @ ${e.company} (${e.date})\n  - ${e.points.join('\n  - ')}`).join('\n');
  const awardsStr = awards.map(a => `• ${a.title}: ${a.desc}`).join('\n');
  const certsStr = certifications.map(c => `• ${c.title} (${c.issuer}, ${c.date})`).join('\n');

  return `
You are the AI Assistant for Muhammad Saad Haroon's portfolio. 
Your goal is to answer questions about Saad's professional background, skills, and projects using ONLY the context below.
Keep answers concise (under 3 sentences if possible), professional, and engaging.

--- CONTEXT START ---
[TECHNICAL SKILLS]
${skillsStr}

[PROJECTS]
${projectsStr}

[EXPERIENCE]
${expStr}

[AWARDS]
${awardsStr}

[CERTIFICATIONS]
${certsStr}
--- CONTEXT END ---

If the answer is not in the context, say "I don't have that information in my records, but you can contact Saad directly!"
`;
};

async function callHuggingFace(userQuery) {
  const systemPrompt = generateSystemContext();
  const fullPrompt = `<s>[INST] <<SYS>>\n${systemPrompt}\n<</SYS>>\n\nUser Question: ${userQuery} [/INST]`;

  try {
    // Call our own Vercel Serverless Function
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: fullPrompt }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API Error Details:", response.status, errText);
      // Throw a more specific error to be caught below
      throw new Error(`Server Error (${response.status}): ${errText || 'Unknown error'}`);
    }

    const data = await response.json();
    // Mistral Instruct usually returns an array with 'generated_text'
    let botResponse = data[0]?.generated_text || "No response generated.";
    
    // Cleanup if the model returns the prompt (sometimes happens with different inference endpoints)
    if (botResponse.includes("[/INST]")) {
      botResponse = botResponse.split("[/INST]").pop().trim();
    }
    
    return botResponse;
  } catch (error) {
    console.error(error);
    return `⚠️ Error: ${error.message || "Connection failed"}. (If on localhost, use 'vercel dev')`;
  }
}

const ChatWidget = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm Saad's AI Assistant. Ask me about his projects, skills, or experience." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const responseText = await callHuggingFace(input);
    
    setMessages(prev => [...prev, { role: "ai", text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-sm font-bold text-white">Muhammad Saad Haroon</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                 <div className="flex justify-start">
                   <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                   </div>
                 </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-[#050508]">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about projects..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input}
                  className="p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white shadow-lg shadow-purple-500/25 hover:scale-110 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;
