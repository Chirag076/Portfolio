import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Magnetic from "./Magnetic";

const NotFound = () => {
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white overflow-hidden relative">
      {/* Background Glitch Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ec4899_0%,_transparent_70%)] animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center"
      >
        <motion.h1 
          animate={{ 
            x: [0, -5, 5, -2, 2, 0],
            textShadow: [
              "0 0 0px #fff",
              "2px 0 10px #ff00ff",
              "-2px 0 10px #00ffff",
              "0 0 0px #fff"
            ]
          }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          className="text-[15vw] font-black leading-none mb-8"
        >
          404
        </motion.h1>
        
        <p className="text-2xl md:text-3xl font-mono text-gray-400 mb-12">
          SYSTEM ERROR: PAGE_NOT_FOUND
        </p>

        <div className="flex justify-center">
          <Magnetic intensity={0.3}>
            <Link
              to="/"
              className="relative inline-block text-xl font-extrabold uppercase text-white px-10 py-4 rounded-full
                       border-[4px] border-transparent overflow-hidden transition-all duration-500
                       hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] bg-gradient-to-r from-pink-600 to-purple-600"
            >
              Back to Reality
            </Link>
          </Magnetic>
        </div>
      </motion.div>

      {/* Floating debris */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          drag
          dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          className="absolute w-12 h-12 border border-white/10 rounded bg-white/5 backdrop-blur-sm cursor-grab active:cursor-grabbing flex items-center justify-center font-mono text-xs text-white/20"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {["{ }", "[]", "< >", "/", "*", "#", "!", "0", "1"][i % 9]}
        </motion.div>
      ))}
    </div>
  );
};

export default NotFound;
