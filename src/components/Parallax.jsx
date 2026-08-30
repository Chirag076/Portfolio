import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* Scroll-scrubbed parallax. Wrap anything; it drifts as the page moves,
   so the section has depth instead of arriving once and sitting still. */
const Parallax = ({
  children,
  y = [70, -70],
  x = null,
  scale = null,
  opacity = null,
  className = "",
  stiff = 90,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: stiff, damping: 26, mass: 0.4 });

  const ty = useTransform(p, [0, 1], y);
  const tx = useTransform(p, [0, 1], x || [0, 0]);
  const ts = useTransform(p, [0, 0.5, 1], scale || [1, 1, 1]);
  const to = useTransform(p, [0, 0.5, 1], opacity || [1, 1, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y: ty, x: tx, scale: ts, opacity: to }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Parallax;
