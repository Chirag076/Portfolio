import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* A live index of the page. Tracks the section you are in as you scroll,
   expands to name it, and jumps you there on click. */
const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "journey", label: "Path" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SectionRail = () => {
  const [active, setActive] = useState("top");
  const [hover, setHover] = useState(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.55);
      /* Pick the LAST section whose top has crossed the trigger line, in
         document order. Straddle-detection used to fall back to "Home"
         wherever nothing happened to span the line — the gaps between
         sections and the whole interior of the pinned scenes — which made
         the rail flick backwards. This is monotonic: it can only move
         forward as you scroll down. */
      const line = window.innerHeight * 0.45;
      let current = "top";
      for (const { id } of SECTIONS) {
        if (id === "top") continue;
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      /* back at the very top, it is Home again */
      if (window.scrollY < window.innerHeight * 0.5) current = "top";
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    if (id === "top") return window.scrollTo({ top: 0, behavior: "smooth" });
    const el = document.getElementById(id);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 96,
        behavior: "smooth",
      });
  };

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-5 top-1/2 z-[80] hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
        >
          {SECTIONS.map((s) => {
            const on = active === s.id;
            const lit = on || hover === s.id;
            return (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
                className="group flex items-center gap-3"
              >
                <AnimatePresence>
                  {lit && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/80"
                    >
                      {s.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.span
                  animate={{ width: on ? 30 : 14, opacity: on ? 1 : 0.32 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className={`h-[2px] rounded-full ${
                    on
                      ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"
                      : "bg-white group-hover:opacity-70"
                  }`}
                />
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionRail;
