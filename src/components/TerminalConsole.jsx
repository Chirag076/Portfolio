import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Terminal, CornerDownLeft } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Typewriter = ({ text, onComplete, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, onComplete, speed]);

  return <span>{displayedText}</span>;
};

const TerminalConsole = ({ onClose }) => {
  const { services } = usePortfolio();
  const [input, setInput] = useState('');
  const [repos, setRepos] = useState([]);
  const [isTyping, setIsTyping] = useState(true); // Start as typing for boot sequence
  const [history, setHistory] = useState([
    { id: 1, type: 'system', content: 'Last login: ' + new Date().toLocaleString() + ' on ttys001', animate: true },
    { id: 2, type: 'system', content: 'AVAILABLE: about, projects, contact, email, github, linkedin, skills, clear, exit', animate: true },
  ]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch real GitHub repos
  useEffect(() => {
    fetch('https://api.github.com/users/Chirag076/repos?sort=updated&per_page=5')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data);
          // Don't auto-add to history here, keep it clean for boot
        }
      });
  }, []);

  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const markComplete = useCallback((id) => {
    setHistory(prev => prev.map(line => line.id === id ? { ...line, animate: false } : line));
    // If it's the last line of boot, stop initial typing
    if (id === 2) setIsTyping(false);
  }, []);

  const commands = {
    help: () => 'AVAILABLE: about, projects, contact, email, github, linkedin, skills, clear, exit',
    about: () => 'Chirag • Full Stack Developer. Building high-end interactive web experiences.',
    projects: () => {
      if (repos.length === 0) return 'Fetching repos...';
      const list = repos.map(r => `• ${r.name}`).join('\n');
      return `RECENT REPOS:\n${list}\n\nType "open [name]" to view on GitHub.`;
    },
    open: (name) => {
      if (!name) return 'Error: Please specify a project name.';
      const repo = repos.find(r => r.name.toLowerCase().includes(name.toLowerCase()));
      if (repo) {
        window.open(repo.html_url, '_blank');
        return `Opening ${repo.name} in new tab...`;
      }
      return `Error: Project "${name}" not found.`;
    },
    contact: () => 'CONTACT INFO:\nEmail: chiragchhabrahmo@gmail.com\nGitHub: github.com/Chirag076\nLinkedIn: linkedin.com/in/chirag-chhabra07/',
    email: () => {
      window.location.href = "mailto:chiragchhabrahmo@gmail.com";
      return 'Opening mail client...';
    },
    github: () => {
      window.open("https://github.com/Chirag076", "_blank");
      return 'Opening GitHub profile...';
    },
    linkedin: () => {
      window.open("https://www.linkedin.com/in/chirag-chhabra07/", "_blank");
      return 'Opening LinkedIn profile...';
    },
    admin: () => {
      window.location.href = "/admin";
      return 'REDIRECTING TO ADMIN GATEWAY...';
    },
    skills: () => {
      const skillNames = services?.map(s => s.title).join(', ') || 'React, Node.js, MongoDB, Tailwind, Framer Motion';
      return `TECH STACK: ${skillNames}`;
    },
    clear: () => {
      setHistory([]);
      return null;
    },
    exit: () => {
      onClose();
      return null;
    }
  };

  const executeCommand = async (rawInput) => {
    const fullCmd = rawInput.trim();
    if (!fullCmd) return;
    if (isTyping) return;

    const [cmd, ...args] = fullCmd.toLowerCase().split(' ');
    const arg = args.join(' ');

    setHistory(prev => [...prev, { id: Math.random(), type: 'user', content: `chirag@macbook ~ % ${fullCmd}`, animate: false }]);
    
    if (commands[cmd]) {
      const result = await commands[cmd](arg);
      if (result) {
        setIsTyping(true);
        setHistory(prev => [...prev, { id: Math.random(), type: 'system', content: result, animate: true }]);
      }
    } else {
      setIsTyping(true);
      setHistory(prev => [...prev, { id: Math.random(), type: 'error', content: `zsh: command not found: ${cmd}`, animate: true }]);
    }

    setInput('');
  };

  const onSystemTypingComplete = (id) => {
    markComplete(id);
    setIsTyping(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-3xl bg-[#1e1e1e]/90 backdrop-blur-2xl border border-white/20 rounded-xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center relative border-b border-black/20">
          <div className="flex gap-2 z-10">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-90 transition-all flex items-center justify-center group">
              <span className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100 transition-opacity font-bold">×</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5 font-mono tracking-tight">
              <Terminal size={12} className="text-gray-500" /> chirag — zsh
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef} 
          data-lenis-prevent="true"
          className="h-[350px] overflow-y-auto p-6 font-mono text-sm md:text-base space-y-1 scrollbar-thin scrollbar-thumb-white/10"
        >
          {history.map((line) => (
            <div key={line.id} className={`${
              line.type === 'user' ? 'text-white font-medium' : 
              line.type === 'error' ? 'text-red-400' : 
              'text-gray-400'
            } whitespace-pre-wrap`}>
              {line.animate ? (
                <Typewriter 
                  text={line.content} 
                  onComplete={() => onSystemTypingComplete(line.id)} 
                  speed={line.id === 2 ? 5 : 10} 
                />
              ) : (
                line.content
              )}
            </div>
          ))}
          
          {/* Active Prompt */}
          {!isTyping && (
            <div className="flex items-center gap-2 mt-4 animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="text-[#32d74b] font-bold">chirag@macbook</span>
              <span className="text-gray-400">~ %</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeCommand(input)}
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-white caret-pink-500"
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] text-gray-500 uppercase font-bold mr-2">Quick Commands:</span>
            {['help', 'about', 'projects', 'skills', 'contact', 'admin'].map(cmd => (
              <button
                key={cmd}
                disabled={isTyping}
                onClick={() => executeCommand(cmd)}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[11px] text-gray-400 hover:text-white transition-all font-mono active:scale-95 disabled:opacity-50"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-tighter">
          <div className="flex gap-4">
            <span className="text-pink-500/60 animate-pulse">api: active</span>
            <span>secure shell</span>
          </div>
          <div className="flex items-center gap-1 font-mono uppercase text-[9px] opacity-50">
            <CornerDownLeft size={10} /> execute
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TerminalConsole;
