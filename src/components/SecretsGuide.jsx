import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Volume2, MousePointerClick, Keyboard } from "lucide-react";

const SecretsGuide = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.15)]"
      >
        {/* Header */}
        <div className="bg-[#161B22] border-b border-gray-800 px-6 py-4 flex items-center">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></button>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm font-mono text-gray-400">secrets_guide.exe</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]" data-lenis-prevent="true">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 mb-2">
            Hidden Features & Easter Eggs
          </h2>
          <p className="text-gray-400 mb-8 font-mono text-sm">
            You found the developer guide. Here are all the secrets hidden in this portfolio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Secret 1: Konami Code */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <Gamepad2 className="text-pink-500 w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">The Konami Code</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Type the legendary Konami code anywhere on the site to unlock a secret neon Snake minigame.
              </p>
              <div className="bg-black/50 p-3 rounded text-xs font-mono text-green-400 border border-gray-800 tracking-wider">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </div>
            </div>

            {/* Secret 2: Context Menu */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <MousePointerClick className="text-purple-500 w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Custom Right-Click</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                The native browser context menu is completely overridden. Right-click anywhere on the portfolio to access a custom glassmorphic utility menu.
              </p>
              <div className="bg-black/50 p-3 rounded text-xs font-mono text-green-400 border border-gray-800">
                Right Click (Mouse 2)
              </div>
            </div>

            {/* Secret 3: Confetti Typing */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <Keyboard className="text-orange-500 w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Magic Typing</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                A global key listener tracks your typing. Typing specific keywords triggers a physics-based confetti explosion across the screen.
              </p>
              <div className="bg-black/50 p-3 rounded text-xs font-mono text-green-400 border border-gray-800 tracking-widest uppercase">
                Type "hireme" or "magic"
              </div>
            </div>

            {/* Secret 4: Web Audio API */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <Volume2 className="text-blue-500 w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ambient Audio Engine</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Click the speaker icon in the bottom left corner to synthesize a deep sci-fi drone hum and UI interaction sounds using the native Web Audio API.
              </p>
              <div className="bg-black/50 p-3 rounded text-xs font-mono text-green-400 border border-gray-800 tracking-wider">
                Toggle bottom-left floating button
              </div>
            </div>

            {/* Secret 5: Command Palette */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">⌘</span> 
                Command Palette Terminal
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Access a professional-grade terminal console to navigate the portfolio with pure speed. Type commands like <span className="text-pink-400">projects</span>, <span className="text-pink-400">about</span>, or <span className="text-pink-400">skills</span> to control the UI via CLI.
              </p>
              <div className="bg-black/50 p-3 rounded text-xs font-mono text-indigo-400 border border-gray-800 tracking-wider flex items-center justify-between">
                <span>Shortcut Trigger:</span>
                <span className="font-bold border border-indigo-500/50 px-2 py-0.5 rounded">Ctrl + K</span>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecretsGuide;
