import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";

/* The path. A scroll-scrubbed journey: the line draws itself, a light travels
   along it, milestones ignite as it reaches them, and the chapter beside it
   changes. Everything here is tied to scroll position, not to a timer. */

const STOPS = [
  {
    t: 0.02,
    year: "2023",
    when: "Delhi · GGSIPU",
    role: "The first commit",
    company: "Bachelor of Computer Applications",
    body:
      "Where it started. The interesting part was never the syntax — it was what happens when a hundred people press the same button at the same moment.",
    tags: ["C++", "JAVASCRIPT", "DSA"],
  },
  {
    t: 0.33,
    year: "2025",
    when: "Jul — Oct 2025",
    role: "Software Developer Intern",
    company: "OPM Corporation",
    body:
      "Three flows taken end to end from Figma — authentication, profile and reporting — and the habit of pulling shared pieces into components the team reused on everything after.",
    tags: ["REACT", "TYPESCRIPT", "TAILWIND"],
  },
  {
    t: 0.64,
    year: "2025",
    when: "Jul 2025 — Aug 2026",
    role: "Software Developer",
    company: "UnQue",
    body:
      "Booking, referrals, attendance and role-based access for 40 salons running 10,000 appointments a month. Closed a double-booking race with a unique constraint, and took releases from a manual forty minutes to five.",
    tags: ["NODE.JS", "MONGODB", "DOCKER", "AWS"],
  },
  {
    t: 0.95,
    year: "2026",
    when: "Aug 2026 — now",
    role: "Full Stack Engineering Intern",
    company: "Rocket Health",
    body:
      "Six per-product API calls collapsed into one endpoint, 450 lines lighter. A slot-expiry countdown that stops people paying for reservations that already lapsed.",
    tags: ["NESTJS", "PRISMA", "REACT NATIVE"],
  },
];

const D =
  "M 62 40 C 62 150, 352 160, 352 250 S 62 340, 62 430 S 262 505, 330 540";

const JourneyPath = () => {
  const ref = useRef(null);
  const lineRef = useRef(null);
  const [len, setLen] = useState(1);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (lineRef.current) setLen(lineRef.current.getTotalLength());
  }, []);

  const dashOffset = useTransform(p, (v) => len * (1 - v));

  /* traveller position along the path */
  const [pt, setPt] = useState({ x: 62, y: 40 });
  useMotionValueEvent(p, "change", (v) => {
    if (!lineRef.current || !len) return;
    const q = lineRef.current.getPointAtLength(len * Math.min(Math.max(v, 0), 1));
    setPt({ x: q.x, y: q.y });
    let idx = 0;
    STOPS.forEach((s, i) => {
      if (v >= s.t - 0.02) idx = i;
    });
    setActive(idx);
  });

  const railScale = useTransform(p, [0, 1], [0, 1]);
  const stop = STOPS[active];

  return (
    <section
      ref={ref}
      id="journey"
      className="relative w-full bg-black"
      style={{ height: "460svh" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center">
        {/* faint year sitting behind everything */}
        <motion.div
          key={stop.year}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 0.045, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[34vw] font-extrabold leading-none tracking-tighter text-white">
            {stop.year}
          </span>
        </motion.div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* the path */}
          <div className="order-2 lg:order-1">
            <svg
              viewBox="0 0 420 580"
              className="h-[42vh] w-full lg:h-[64vh]"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="jp-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E45496" />
                  <stop offset="50%" stopColor="#8663E4" />
                  <stop offset="100%" stopColor="#EF7B2D" />
                </linearGradient>
                <filter id="jp-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="7" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* unlit track */}
              <path d={D} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />

              {/* the drawn line */}
              <motion.path
                ref={lineRef}
                d={D}
                fill="none"
                stroke="url(#jp-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ strokeDasharray: len, strokeDashoffset: dashOffset }}
              />

              {/* milestones */}
              {STOPS.map((s, i) => {
                const on = active >= i;
                const pos = lineRef.current
                  ? lineRef.current.getPointAtLength(len * s.t)
                  : { x: 62, y: 40 };
                return (
                  <g key={s.role}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="8"
                      fill="#0A0A0B"
                      stroke={on ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.16)"}
                      strokeWidth="1.4"
                      style={{ transition: "stroke .5s ease" }}
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="3.2"
                      fill="url(#jp-grad)"
                      style={{
                        transform: on ? "scale(1)" : "scale(0)",
                        transformOrigin: `${pos.x}px ${pos.y}px`,
                        transition: "transform .45s cubic-bezier(.22,1,.36,1)",
                      }}
                    />
                  </g>
                );
              })}

              {/* the travelling light */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5.5"
                fill="#fff"
                filter="url(#jp-glow)"
                opacity="0.95"
              />
            </svg>
          </div>

          {/* the chapter */}
          <div className="order-1 lg:order-2">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                The path so far
              </span>
            </div>

            <div className="relative min-h-[300px]">
              {STOPS.map((s, i) => (
                <motion.div
                  key={s.role}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    y: active === i ? 0 : 18,
                    filter: active === i ? "blur(0px)" : "blur(6px)",
                  }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  style={{ pointerEvents: active === i ? "auto" : "none" }}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    {s.when}
                  </div>
                  <h3 className="mt-3 text-[clamp(26px,3.6vw,46px)] font-extrabold leading-[1.05] tracking-tight text-white">
                    {s.role}
                  </h3>
                  <div className="mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-[15px] font-semibold text-transparent">
                    {s.company}
                  </div>
                  <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.7] text-gray-400">
                    {s.body}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10.5px] font-medium tracking-[0.12em] text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* rail */}
            <div className="mt-10 h-px w-full max-w-[460px] bg-white/10">
              <motion.div
                style={{ scaleX: railScale, transformOrigin: "left" }}
                className="h-px w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"
              />
            </div>
            <div className="mt-4 flex max-w-[460px] justify-between">
              {STOPS.map((s, i) => (
                <span
                  key={s.company}
                  className={`text-[10px] font-medium tracking-[0.14em] transition-colors duration-500 ${
                    active >= i ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {s.year}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyPath;
