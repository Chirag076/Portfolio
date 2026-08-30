import React from "react";
import { motion } from "framer-motion";

/* Slow-drifting gradient mesh. Gives the hero real depth behind the particles. */
const BLOBS = [
  { c: "rgba(228,84,150,0.30)", s: 720, x: "8%",  y: "6%",  d: 26, dx: 90,  dy: 60 },
  { c: "rgba(134,99,228,0.28)", s: 660, x: "62%", y: "0%",  d: 32, dx: -80, dy: 80 },
  { c: "rgba(239,123,45,0.22)", s: 560, x: "36%", y: "44%", d: 38, dx: 70,  dy: -70 },
  { c: "rgba(239,123,45,0.18)", s: 520, x: "78%", y: "40%", d: 30, dx: -60, dy: -50 },
];

const Aurora = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    {BLOBS.map((b, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: b.x,
          top: b.y,
          width: b.s,
          height: b.s,
          background: `radial-gradient(circle at 50% 50%, ${b.c}, transparent 62%)`,
          filter: "blur(46px)",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        /* Static. Animating a 40px-blurred, 700px layer forces the compositor
           to re-rasterise it every frame — four of them was the single biggest
           source of scroll jank. The hero's scroll parallax still moves the
           whole group, which reads the same but costs one transform. */
      />
    ))}
    {/* vignette so the type stays readable */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 35%, transparent 30%, rgba(0,0,0,0.72) 100%)",
      }}
    />
  </div>
);

export default Aurora;
