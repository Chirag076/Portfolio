import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SpotlightSection = () => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [glitchActive, setGlitchActive] = useState(false);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 250); // Glitch for 250ms
    }, 3000); // Every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-32 sm:py-48 bg-black flex items-center justify-center overflow-hidden border-t border-b border-white/5"
    >
      {/* SVG Filter for Cyberpunk Glitch */}
      <svg className="absolute w-0 h-0">
        <filter id="cyber-glitch">
          <feTurbulence type="fractalNoise" baseFrequency={glitchActive ? "0.2 0.8" : "0 0"} numOctaves="2" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="noise" result="coloredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={glitchActive ? "30" : "0"} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {/* Dynamic Glow that follows mouse */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none z-0"></div>
      
      <div className="relative z-10 text-center px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "url(#cyber-glitch)" }}
          className="text-6xl sm:text-7xl md:text-[9rem] lg:text-[11rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white tracking-tighter leading-none drop-shadow-2xl hover:text-pink-400 transition-colors duration-500"
        >
          I BUILD IDEAS.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold mt-6 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"
        >
          LET'S CREATE MAGIC.
        </motion.p>
      </div>
    </section>
  );
};

export default SpotlightSection;
