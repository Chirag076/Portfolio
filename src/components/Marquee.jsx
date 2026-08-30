import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import { useState, useEffect } from "react";

/* No emoji. Emoji used as iconography is one of the fastest tells that a
   page was generated rather than designed. */
const skills = [
  { name: "TYPESCRIPT", note: "since 2024" },
  { name: "NODE.JS", note: "APIs, workers" },
  { name: "NESTJS", note: "Rocket Health" },
  { name: "REACT", note: "web + native" },
  { name: "POSTGRESQL", note: "Prisma" },
  { name: "REDIS", note: "queues, replay" },
  { name: "DOCKER", note: "40min to 5" },
];

/* keeps the strip looping seamlessly no matter how far it is pushed */
const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

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

  /* Constant slow drift, deliberately NOT coupled to scroll velocity — that
     read as the strip lurching every time the page moved. Frame-time based so
     it is the same speed on any refresh rate. 0.85%/s ≈ one full loop a minute. */
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((t, delta) => {
    baseX.set(baseX.get() - 0.85 * (Math.min(delta, 50) / 1000));
  });

  return (
    <div className="relative w-full overflow-hidden flex whitespace-nowrap border-y border-white/[0.08] bg-white/[0.015] py-9 my-20 z-20 group">
      
      {/* Hovering a skill says where it is actually used, not a floating emoji */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full border border-white/12 bg-[#0C0C0E]/95 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-300 shadow-e2 backdrop-blur-md"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-160%" }}
        animate={{ opacity: hoveredSkill ? 1 : 0, y: hoveredSkill ? 0 : 8 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {hoveredSkill?.note}
      </motion.div>

      <motion.div className="flex will-change-transform" style={{ x }}>
        {repeatedSkills.map((skill, idx) => (
          <div 
            key={idx} 
            className="flex items-center px-4"
            onMouseEnter={() => setHoveredSkill(skill)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <span className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white/25 transition-colors duration-500 hover:text-white cursor-default">
              {skill.name}
            </span>
            <span className="mx-6 text-4xl text-white/12 sm:text-5xl md:text-6xl">/</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
