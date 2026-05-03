import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const chars = "!@#$%^&*()_+{}:<>?|1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ScrambleText = ({ text, className, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      let iteration = 0;
      const startTime = Date.now() + delay;

      const interval = setInterval(() => {
        if (Date.now() < startTime) return;

        setDisplayValue(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 0.3; // Slower increment for stability
      }, 40); // 40ms instead of 30ms to reduce main-thread load

      return () => clearInterval(interval);
    }
  }, [isInView, text, delay]);

  return (
    <span ref={ref} className={className}>
      {displayValue || text}
    </span>
  );
};

export default ScrambleText;
