import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import EnginePanel from "./EnginePanel";

/* A project opens into its own window rather than bouncing you to GitHub.
   For Market-Exchange that window contains the engine itself, running. */

const DETAIL = {
  "Market-Exchange": {
    tag: "Trading infrastructure",
    stack: ["Next.js", "TypeScript", "Redis", "TimescaleDB", "WebSockets", "Docker"],
    points: [
      "Price-time-priority limit order book matching in a single-node in-memory engine, so the hot path never touches the database.",
      "Durability handled off the hot path: 3-second state snapshots plus a Redis event queue that replays every order placed since the last one.",
      "Pub-sub WebSocket service streaming ticker, candlestick and depth updates, with per-socket subscribe and unsubscribe teardown.",
      "A market-maker service that places and cancels orders continuously to emulate live order-book traffic.",
    ],
    live: true,
  },
  Talksy: {
    tag: "Real-time messaging",
    stack: ["React", "Node.js", "MongoDB", "Socket.IO", "Zustand"],
    points: [
      "Instant delivery, typing indicators, online presence and persistent chat history.",
      "State layer restructured so an incoming message re-renders the conversation you are reading, not the entire list behind it.",
      "Secure authentication with a responsive interface built for one-to-one messaging.",
    ],
    live: false,
  },
};

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const d = (project && DETAIL[project.title]) || {
    tag: "Project",
    stack: [],
    points: [],
    live: false,
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-xl sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="light-catch relative my-4 w-full max-w-[1080px] rounded-panel border border-white/10 bg-[#0B0B0D] p-6 shadow-e3 sm:p-9"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-gray-400 transition-all duration-300 hover:border-white/25 hover:text-white"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
              {d.tag}
            </div>
            <h3 className="mt-4 text-[clamp(28px,4.2vw,54px)] font-extrabold leading-[1.04] tracking-tight text-white">
              {project.title}
            </h3>

            <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div className="overflow-hidden rounded-card border border-white/10 shadow-e2">
                <img src={project.image} alt={project.title} className="w-full" />
              </div>
              <div>
                <p className="text-[15px] leading-[1.75] text-gray-400">
                  {project.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {d.points.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.15 + i * 0.07 }}
                      className="flex gap-3 text-[14px] leading-[1.65] text-gray-400"
                    >
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
                      {p}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-2">
                  {d.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10.5px] tracking-[0.1em] text-gray-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[12.5px] font-bold uppercase tracking-[0.13em] text-white transition-transform duration-300 hover:-translate-y-[2px]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500" />
                    <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                    <Github size={15} className="relative z-10" />
                    <span className="relative z-10">Open repository</span>
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-[12.5px] font-semibold uppercase tracking-[0.13em] text-gray-200 transition-all duration-300 hover:border-white/35 hover:text-white"
                  >
                    <ExternalLink size={15} />
                    Live
                  </a>
                </div>
              </div>
            </div>

            {d.live && (
              <div className="mt-10 border-t border-white/[0.08] pt-8">
                <EnginePanel />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
