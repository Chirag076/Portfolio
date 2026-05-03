import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const AnimatedImage = () => {
  const containerRef = useRef(null);

  // Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for buttery smooth interaction
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const transformString = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `translate(calc(-50% + ${x}px), ${y}px)`
  );

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Direct translation offset values (adjust 20 for intensity)
    mouseX.set(((x - centerX) / centerX) * 20);
    mouseY.set(((y - centerY) / centerY) * 20);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="
        relative w-full h-full
        mt-[-4rem] sm:mt-[-1rem] md:mt-[0rem] xl:mt-[-3rem] lg:mt-[-3rem]
        z-1
      "
    >
      <motion.img
        src="./photo2.png"
        alt="Chirag"
        className="
          relative left-[46%] item-center
          mt-[5%] mb-[-16%] sm:mt-[-7%] 
          w-[190%] sm:w-[155%] md:w-[116%] lg:w-[200%] xl:w-[147%]
          max-w-[90rem]
          pointer-events-none
        "
        style={{
          transform: transformString,
          filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
          willChange: "transform, filter",
        }}
        whileHover={{
          filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.6))",
        }}
      />
    </div>
  );
};

export default AnimatedImage;
