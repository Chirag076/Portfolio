import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Magnetic from "./Magnetic";

const NotFound = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="w-full h-screen bg-black flex flex-col items-center justify-center text-white overflow-hidden relative cursor-none"
    >
      {/* Spotlight Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 text-center"
      >
        <h1 className="text-[20vw] font-black tracking-tighter leading-none mb-4 text-white/90">
          404
        </h1>
        
        <p className="text-xl md:text-2xl font-light text-white/40 mb-12 tracking-[0.2em] uppercase">
          You are lost in the dark.
        </p>

        <div className="flex justify-center">
          <Magnetic intensity={0.2}>
            <Link
              to="/"
              className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300"
            >
              Find Home
            </Link>
          </Magnetic>
        </div>
      </motion.div>

      {/* Custom Cursor Dot */}
      <div 
        className="fixed w-4 h-4 bg-white rounded-full z-[100] pointer-events-none mix-difference"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};

export default NotFound;
