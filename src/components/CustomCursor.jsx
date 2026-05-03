import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === "A" ||
        e.target.tagName === "BUTTON" ||
        e.target.closest("button") ||
        e.target.closest("a") ||
        e.target.style.cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const trailConfig = { damping: 30, stiffness: 200, mass: 0.8 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  const { scrollYProgress } = useScroll();

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9999999]"
      style={{ opacity: 1 }}
    >
      {/* Outer Ring / Trail */}
      <motion.div
        className="absolute w-10 h-10 border border-pink-500/50 rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 1.5 : 1,
        }}
      />

      {/* Main Cursor Dot */}
      <motion.div
        className="absolute w-3 h-3 bg-white rounded-full mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 2 : 1,
        }}
      />

      {/* Scroll Progress Ring */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.circle
          cx="0"
          cy="0"
          r="22"
          fill="none"
          stroke="rgba(236, 72, 153, 0.5)"
          strokeWidth="2"
          style={{
            x: cursorX,
            y: cursorY,
            pathLength: scrollYProgress,
            rotate: -90,
          }}
        />
      </svg>
    </motion.div>
  );
};

export default CustomCursor;
