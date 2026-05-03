import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const ContactCard = () => {
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4" style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-sm aspect-[3/4] rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(236,72,153,0.2)] cursor-crosshair overflow-hidden hover:border-pink-500/50 transition-colors duration-500"
      >
        {/* Dynamic Glare */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,1) 0%, transparent 60%)",
            x: useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "100%"]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"]),
          }}
        />

        {/* Top Info */}
        <div className="relative z-10" style={{ transform: "translateZ(60px)" }}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 mb-6 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <span className="text-3xl font-extrabold text-white">C</span>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">Chirag Chhabra</h3>
          <p className="text-pink-400 font-mono mt-2 tracking-widest uppercase text-sm">Full-Stack Engineer</p>
        </div>

        {/* Bottom Socials */}
        <div className="relative z-10 flex flex-col gap-4" style={{ transform: "translateZ(40px)" }}>
          <a href="mailto:chiragchhabrahmo@gmail.com" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors bg-black/40 p-4 rounded-xl border border-white/10 hover:border-pink-500/50 backdrop-blur-md group">
            <Mail size={20} className="group-hover:scale-110 transition-transform text-pink-400" />
            <span className="font-mono text-sm">chiragchhabrahmo@gmail.com</span>
          </a>

          <div className="flex gap-4 mt-2">
            <a href="https://github.com/Chirag076" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all group">
              <Github size={20} className="text-gray-300 group-hover:text-white transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all group">
              <Linkedin size={20} className="text-gray-300 group-hover:text-white transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all group">
              <Twitter size={20} className="text-gray-300 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactCard;
