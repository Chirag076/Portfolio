import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const ITEMS = [
  { to: 5000, fmt: "comma", suffix: "/s", label: "Orders matched", note: "in-memory engine, sub-5ms" },
  { to: 10000, fmt: "comma", label: "Appointments / month", note: "across 40 businesses" },
  { to: 8, suffix: "×", label: "Faster releases", note: "40 minutes down to 5" },
  { to: 450, prefix: "−", label: "Lines removed", note: "while the features grew" },
];

const Counter = ({ item, start }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const D = 1800;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / D);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(item.to * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, item.to]);
  const shown = item.fmt === "comma" ? v.toLocaleString("en-US") : String(v);
  return (
    <span className="tabular-nums">
      {item.prefix || ""}
      {shown}
      {item.suffix || ""}
    </span>
  );
};

const Stats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section ref={ref} className="relative w-full bg-black border-y border-white/[0.07] py-16 sm:py-20">
      <div className="mx-auto max-w-[1180px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-[62ch]"
        >
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Measured, not claimed
            </span>
          </div>
          <h2 className="mt-6 text-[clamp(26px,3.6vw,46px)] font-extrabold leading-[1.1] tracking-tight text-white">
            Numbers that came out of{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              real production
            </span>
            .
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-gray-400">
            Not benchmarks on a laptop. These came out of a matching engine under
            simulated load, a booking platform serving live salons, and a deploy
            pipeline I rebuilt — each one measured on the system that shipped.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative ${
                i === 0
                  ? "md:col-span-6"
                  : i === 1
                  ? "md:col-span-6"
                  : "md:col-span-4 md:col-start-auto"
              }`}
            >
              <div className="mb-4 h-px w-full bg-white/[0.09]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.1, delay: 0.2 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="h-px w-full bg-gradient-to-r from-pink-500/70 via-purple-500/50 to-transparent"
                />
              </div>
              <div className={`font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 ${i < 2 ? "text-[clamp(44px,6.4vw,86px)]" : "text-[clamp(28px,3vw,42px)]"}`}>
                <Counter item={it} start={inView} />
              </div>
              <div className={`font-semibold text-gray-300 ${i < 2 ? "mt-4 text-[15px]" : "mt-3 text-[13px]"}`}>{it.label}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-gray-500">{it.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
