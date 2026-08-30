import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* A pinned scroll scene. The statement lights word by word as you scroll
   through it, the character rides along, and a rail tracks progress.
   Motion here is SCROLL-LINKED (scrubbed), not fire-once whileInView. */

const LINE =
  "Anyone can make it work once. The engineering is in the second time — under load, at three in the morning, when nobody is watching.";

const ACCENT = new Set(["under", "load,"]);

const Word = ({ word, index, total, progress, accent }) => {
  /* each word owns a slice of the scroll range */
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start * 0.82, end * 0.82], [0.12, 1]);
  const y = useTransform(progress, [start * 0.82, end * 0.82], [8, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block will-change-transform ${
        accent
          ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400"
          : "text-white"
      }`}
    >
      {word}&nbsp;
    </motion.span>
  );
};

const ScrollStory = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const words = LINE.split(" ");

  /* the character rides the scene */
  const figScale = useTransform(p, [0, 0.5, 1], [0.72, 1.02, 0.86]);
  const figY = useTransform(p, [0, 1], [70, -70]);
  const figOpacity = useTransform(p, [0, 0.12, 0.85, 1], [0, 0.5, 0.5, 0]);
  const figRotate = useTransform(p, [0, 1], [-6, 6]);
  const railScale = useTransform(p, [0, 1], [0, 1]);
  const glow = useTransform(p, [0, 0.5, 1], [0.15, 0.5, 0.2]);

  return (
    <section ref={ref} className="relative w-full bg-black" style={{ height: "340svh" }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center">
        {/* character riding the scroll, behind the type */}
        <motion.div
          style={{ scale: figScale, y: figY, opacity: figOpacity, rotate: figRotate }}
          className="pointer-events-none absolute right-[-6%] top-1/2 -translate-y-1/2 w-[46vw] max-w-[620px] will-change-transform"
        >
          <motion.div
            style={{ opacity: glow }}
            className="absolute inset-[12%] rounded-full blur-[70px] bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500"
          />
          <img src="./photo2.png" alt="" className="relative w-full select-none" />
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6">
          <div className="mb-10 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              How I think about it
            </span>
          </div>

          <p className="max-w-[19ch] text-[clamp(30px,5.2vw,74px)] font-extrabold leading-[1.06] tracking-tight">
            {words.map((w, i) => (
              <Word
                key={i}
                word={w}
                index={i}
                total={words.length}
                progress={p}
                accent={ACCENT.has(w.toLowerCase())}
              />
            ))}
          </p>

          {/* progress rail */}
          <div className="mt-14 h-px w-full max-w-[420px] bg-white/10">
            <motion.div
              style={{ scaleX: railScale, transformOrigin: "left" }}
              className="h-px w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStory;
