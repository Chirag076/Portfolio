import { useState, useEffect } from "react";
import Parallax from "./Parallax";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Krishna Vamsee",
    text: "I had the opportunity to manage Chirag during his time at UnQue, where he worked as part of our engineering team and contributed to several areas of our product and backend systems. During his time with us, he worked with technologies including Node.js, TypeScript, MongoDB, and APIs, and was involved in production workflows across bookings, payments, memberships, referrals, and other business-critical features. As his manager, I found Chirag to be a curious and dedicated developer who was willing to take ownership of tasks, investigate issues deeply, and work through complex problems in an evolving product environment. He consistently showed a strong willingness to learn, improve his technical understanding, and take on new challenges. I appreciate his contributions to the team and wish him the very best in his future career.",
    role: "Co-Founder, UnQue",
    meta: "Managed Chirag directly \u00b7 August 2026",
  },
  {
    name: "Manika Bhutani",
    text: "Chirag interned and worked with my small business on a project focused on building, integrating, and testing website during August and September 2025. Throughout this time, he demonstrated curiosity and a strong desire to contribute, offering various solutions. He possesses a good understanding of backend technologies,custom software and relevant industry knowledge.I endorse him for his practical skills and knowledge.Best of luck with all your future pursuits.",
    role: "Business Owner | Artist",
  },
  // {
  //   name: "Bob Smith",
  //   text: "Highly recommend Chirag! Delivered on time and exceeded our expectations.",
  //   role: "Project Manager, SoftSolutions",
  //   avatar: "/images/avatar2.png",
  // },
  // {
  //   name: "Clara Lee",
  //   text: "Working with Chirag was seamless. Excellent communication and clean code.",
  //   role: "CTO, InnovateX",
  //   avatar: "/images/avatar3.png",
  // },
];

/* Avatars used to come from a LinkedIn CDN URL with an expiry token, so they
   broke as soon as the token lapsed. Initials never expire. */
const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const Reviews = () => {
  const [current, setCurrent] = useState(0);
  /* which way the next card should travel, so prev and next feel different */
  const [dir, setDir] = useState(1);

  const go = (next) => {
    setDir(next > current || (current === reviews.length - 1 && next === 0) ? 1 : -1);
    setCurrent((next + reviews.length) % reviews.length);
  };
  const prev = () => { setDir(-1); setCurrent((c) => (c - 1 + reviews.length) % reviews.length); };
  const next = () => { setDir(1); setCurrent((c) => (c + 1) % reviews.length); };

  /* arrow keys work too, but only while the section is on screen */
  useEffect(() => {
    const onKey = (e) => {
      const el = document.getElementById("customers");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="customers"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden sm:scroll-mt-1 xl:scroll-mt-24"
    >
      {/* Heading */}
      <Parallax y={[54, -54]} x={[-26, 26]}>
      <div className="relative inline-block mb-16 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[9rem] xl:text-[13rem]"
          style={{ WebkitTextStroke: "2px rgba(255,255,255,0.5)", color: "transparent" }}
        >
          REVIEWS
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="relative font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[14rem]"
          style={{ color: "#EDEAE4" }}
        >
          REVIEWS
        </motion.h1>
      </div>
      </Parallax>

      {/* Review Card */}
      <div className="relative z-10 flex w-full max-w-4xl justify-center px-4 sm:px-6 md:min-h-[620px] lg:min-h-[560px] xl:min-h-[540px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -60, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:min-h-[620px] lg:min-h-[560px] xl:min-h-[540px] rounded-panel border border-white/[0.08] bg-white/[0.045] p-6 shadow-e2 sm:p-8 md:p-10 flex flex-col md:flex-row items-center text-center md:text-left space-y-4 sm:space-y-6 md:space-y-0 md:space-x-6 lg:space-x-8
                       transition-colors duration-500 hover:border-white/[0.16]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full sm:h-24 sm:w-24"
              aria-hidden="true"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500" />
              <span className="absolute inset-[2px] rounded-full bg-[#0B0B0D]" />
              <span className="relative z-10 text-[22px] font-bold tracking-tight text-white sm:text-[26px]">
                {initials(reviews[current].name)}
              </span>
            </motion.div>
            <div className="flex-1">
              <p className="text-sm sm:text-base md:text-lg text-gray-200 italic mb-2 sm:mb-4">
                "{reviews[current].text}"
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {reviews[current].name}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                {reviews[current].role}
              </p>
              {reviews[current].meta && (
                <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-gray-600">
                  {reviews[current].meta}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual controls — no auto-advance */}
      <div className="z-10 mt-8 flex items-center gap-6 sm:mt-10">
        <button
          onClick={prev}
          disabled={reviews.length < 2}
          aria-label="Previous review"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-gray-300 transition-all duration-300 hover:-translate-x-0.5 hover:border-white/30 hover:text-white disabled:opacity-30 disabled:hover:translate-x-0"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              aria-label={`Review ${idx + 1}`}
              className="group py-2"
            >
              <motion.span
                animate={{ width: current === idx ? 26 : 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className={`block h-2 rounded-full ${
                  current === idx
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"
                    : "bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={next}
          disabled={reviews.length < 2}
          aria-label="Next review"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-gray-300 transition-all duration-300 hover:translate-x-0.5 hover:border-white/30 hover:text-white disabled:opacity-30 disabled:hover:translate-x-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="z-10 mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-gray-600">
        {String(current + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
      </div>
    </section>
  );
};

export default Reviews;
