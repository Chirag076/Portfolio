import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setVisible(true);
      // Ensure the menu doesn't flow off the bottom/right edges
      const x = Math.min(e.clientX, window.innerWidth - 220);
      const y = Math.min(e.clientY, window.innerHeight - 200);
      setPosition({ x, y });
    };

    const handleClick = () => {
      setVisible(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("chirag@example.com"); // Will be updated by user
    alert("Email copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{ top: position.y, left: position.x }}
          className="fixed z-[99999] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 min-w-[200px] shadow-[0_10px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="flex flex-col gap-1">
            <button onClick={copyEmail} className="text-left px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              ✉️ Copy Email
            </button>
            <a href="https://github.com/Chirag076" target="_blank" rel="noreferrer" className="text-left px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
              💻 View GitHub
            </a>
            <div className="h-[1px] w-full bg-white/10 my-1"></div>
            <button className="text-left px-4 py-3 text-sm font-semibold text-pink-500 hover:bg-pink-500/20 hover:text-pink-400 rounded-xl transition-all" onClick={() => alert('Nice try! 😈')}>
              💀 Hack Website
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
