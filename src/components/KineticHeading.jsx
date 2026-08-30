import React from "react";
import { motion } from "framer-motion";

/* Per-character mask reveal. Characters are grouped into words so a line can
   only ever break at a space — splitting every character loose lets the
   browser break mid-word ("CHIRA / G"). */
const KineticHeading = ({ text, className = "", delay = 0, stagger = 0.035 }) => {
  const words = text.split(" ");
  let i = 0;

  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, w) => {
        const chars = Array.from(word);
        const node = (
          <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
            {chars.map((ch, c) => {
              const idx = i++;
              return (
                <span
                  key={c}
                  className="inline-block overflow-hidden align-bottom"
                  style={{ paddingBottom: "0.08em" }}
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.05,
                      delay: delay + idx * stagger,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {ch}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
        i++; /* the space counts toward the stagger so rhythm stays even */
        return (
          <React.Fragment key={`f${w}`}>
            {node}
            {w < words.length - 1 && <span aria-hidden="true"> </span>}
          </React.Fragment>
        );
      })}
    </h1>
  );
};

export default KineticHeading;
