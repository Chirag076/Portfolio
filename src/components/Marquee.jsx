import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

const skills = [
  { name: "REACT", icon: "⚛️" },
  { name: "NODE.JS", icon: "🟢" },
  { name: "TAILWIND", icon: "💨" },
  { name: "NEXT.JS", icon: "▲" },
  { name: "MONGODB", icon: "🍃" },
  { name: "TYPESCRIPT", icon: "📘" },
  { name: "POSTGRESQL", icon: "🐘" },
];

const Marquee = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const repeatedSkills = [...skills, ...skills, ...skills, ...skills, ...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative w-full bg-pink-600/10 py-8 overflow-hidden flex whitespace-nowrap border-y border-pink-500/20 -rotate-2 scale-110 my-16 z-20 shadow-[0_0_50px_rgba(236,72,153,0.1)] group">
      
      {/* Floating Icon */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] text-[8rem] drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-100%" }}
        animate={{ opacity: hoveredSkill ? 1 : 0, scale: hoveredSkill ? 1 : 0.5, rotate: hoveredSkill ? 10 : -10 }}
        transition={{ duration: 0.2 }}
      >
        {hoveredSkill?.icon}
      </motion.div>

      <motion.div
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {repeatedSkills.map((skill, idx) => (
          <div 
            key={idx} 
            className="flex items-center px-4"
            onMouseEnter={() => setHoveredSkill(skill)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:text-white transition-colors duration-300 cursor-default">
              {skill.name}
            </span>
            <span className="text-4xl sm:text-5xl md:text-6xl text-pink-500/50 mx-4">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
