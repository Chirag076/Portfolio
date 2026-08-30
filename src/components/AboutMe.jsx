import { motion, useInView } from "framer-motion";
import Parallax from "./Parallax";
import { useState, useEffect, useRef } from "react";
import GithubStats from "./GithubStats";
import ScrambleText from "./ScrambleText";
import { usePortfolio } from "../context/PortfolioContext";

/* A real shell, not a scripted typewriter. It boots with a short intro and
   then hands you the prompt — type, get answers, `help` lists them. */

const BIO =
  "Full-stack developer in Bengaluru. I work on the parts of a product that have to stay correct once real traffic shows up — booking, payments, access control.";

const About = () => {
  const { setShowResume, setShowTerminal } = usePortfolio();
  const [boot, setBoot] = useState("");
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState([]);
  const [recallAt, setRecallAt] = useState(-1);

  const ref = useRef(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  /* boot line types once, then the prompt is yours */
  useEffect(() => {
    if (!isInView) return undefined;
    let i = 0;
    const id = setInterval(() => {
      if (i <= BIO.length) {
        setBoot(BIO.slice(0, i));
        i++;
      } else {
        clearInterval(id);
        setBooted(true);
      }
    }, 18);
    return () => clearInterval(id);
  }, [isInView]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const COMMANDS = {
    help: () => [
      "available commands",
      "",
      "  whoami      who I am, in one line",
      "  now         what I'm working on today",
      "  experience  where I've worked",
      "  stack       what I build with",
      "  projects    selected work",
      "  numbers     things I can prove",
      "  stats       live GitHub stats",
      "  resume      open the résumé",
      "  contact     how to reach me",
      "  clear       clear this shell",
    ],
    whoami: () => ["Chirag Chhabra — full-stack developer, Bengaluru."],
    now: () => [
      "Rocket Health · Full Stack Engineering Intern · Aug 2026 —",
      "Currently: NestJS + Prisma on the API, React Native on the client.",
    ],
    experience: () => [
      "2026 —      Rocket Health      Full Stack Engineering Intern",
      "2025 — 2026 UnQue              Software Developer",
      "2025        OPM Corporation    Software Developer Intern",
    ],
    stack: () => [
      "languages   TypeScript · JavaScript · Python · SQL",
      "frontend    React · Next.js · React Native · TanStack Query · Tailwind",
      "backend     Node.js · NestJS · Prisma · REST · WebSockets",
      "data        PostgreSQL · MongoDB · Redis · TimescaleDB",
      "ops         Docker · AWS · GitHub Actions · Jest",
    ],
    projects: () => [
      "market-exchange   Binance-style matching engine, snapshots + Redis replay",
      "talksy            real-time messaging, presence, persistent history",
      "",
      "scroll to Projects and open one — the exchange runs live in its window.",
    ],
    numbers: () => [
      "5,000/s   orders matched in memory, sub-5ms",
      "10,000    appointments a month, 40 businesses",
      "8x        faster releases — 40 minutes down to 5",
      "-450      lines removed while the features grew",
    ],
    contact: () => [
      "email      chiragchhabrahmo@gmail.com",
      "github     github.com/Chirag076",
      "linkedin   linkedin.com/in/chirag-chhabra07",
    ],
  };

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setRecall((r) => [cmd, ...r].slice(0, 30));
    setRecallAt(-1);

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const next = [{ kind: "cmd", value: raw.trim() }];

    if (cmd === "resume") {
      next.push({ kind: "out", value: ["opening résumé…"] });
      setShowResume(true);
    } else if (cmd === "stats") {
      next.push({ kind: "stats" });
    } else if (COMMANDS[cmd]) {
      next.push({ kind: "out", value: COMMANDS[cmd]() });
    } else {
      next.push({
        kind: "err",
        value: [`command not found: ${cmd}`, "type `help` to see what works"],
      });
    }

    setHistory((h) => [...h, ...next]);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      run(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const at = Math.min(recall.length - 1, recallAt + 1);
      if (at >= 0) {
        setRecallAt(at);
        setInput(recall[at]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const at = recallAt - 1;
      setRecallAt(at);
      setInput(at >= 0 ? recall[at] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const all = [...Object.keys(COMMANDS), "resume", "stats", "clear"];
      const hit = all.find((c) => c.startsWith(input.trim().toLowerCase()));
      if (hit) setInput(hit);
    }
  };

  return (
    <section
      id="about"
      className="relative w-full bg-black text-white py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden"
    >
      <Parallax y={[54, -54]} x={[-26, 26]}>
        <div className="relative inline-block mb-12 z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ duration: 1.4 }}
            className="absolute inset-0 font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem]"
            style={{ WebkitTextStroke: "2px rgba(255,255,255,0.55)", color: "transparent" }}
          >
            <ScrambleText text="ABOUT" />
          </motion.h1>

          {/* solid, not gradient — the gradient is saved for the work and the CTA */}
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="relative font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem] text-[#EDEAE4]"
          >
            <ScrambleText text="ABOUT" delay={400} />
          </motion.h1>
        </div>
      </Parallax>

      <div className="max-w-4xl w-full relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => inputRef.current?.focus()}
          className="cursor-text overflow-hidden rounded-card border border-white/[0.09] bg-[#0B0E12] shadow-e3"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <div className="h-3 w-3 rounded-full bg-[#28C840]" />
            <span className="ml-3 font-mono text-[11px] text-gray-500">chirag@macbook-pro : ~</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-gray-600">
              type <span className="text-emerald-400">help</span>
            </span>
          </div>

          <div
            ref={bodyRef}
            className="max-h-[440px] overflow-y-auto p-6 font-mono text-[13px] leading-relaxed sm:p-7 sm:text-[14px]"
          >
            <div className="mb-1 text-emerald-400">$ whoami</div>
            <div className="mb-5 text-gray-300">
              Chirag Chhabra — full-stack developer, Bengaluru
            </div>

            <div className="mb-1 text-emerald-400">$ cat bio.txt</div>
            <div className="mb-5 whitespace-pre-line text-gray-400">
              {boot}
              {!booted && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                  className="ml-1 inline-block h-4 w-2 translate-y-[2px] bg-emerald-400"
                />
              )}
            </div>

            {history.map((h, i) => {
              if (h.kind === "cmd")
                return (
                  <div key={i} className="mt-4 text-emerald-400">
                    $ {h.value}
                  </div>
                );
              if (h.kind === "stats")
                return (
                  <div key={i} className="mt-2">
                    <GithubStats />
                  </div>
                );
              return (
                <div
                  key={i}
                  className={`mt-1 whitespace-pre-wrap ${
                    h.kind === "err" ? "text-pink-400/90" : "text-gray-400"
                  }`}
                >
                  {h.value.join("\n")}
                </div>
              );
            })}

            {/* the live prompt */}
            {booted && (
              <div className="mt-4 flex items-center">
                <span className="mr-2 text-emerald-400">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck="false"
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 border-none bg-transparent font-mono text-[13px] text-gray-200 outline-none placeholder:text-gray-700 sm:text-[14px]"
                  placeholder="help"
                />
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["help", "now", "numbers", "stack", "projects", "stats"].map((c) => (
            <button
              key={c}
              onClick={() => run(c)}
              className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-gray-400 transition-colors duration-300 hover:border-white/25 hover:text-white"
            >
              {c}
            </button>
          ))}
          <button
            onClick={() => setShowTerminal(true)}
            className="rounded-full border border-emerald-500/25 bg-emerald-500/[0.07] px-3.5 py-1.5 font-mono text-[11px] text-emerald-400 transition-colors duration-300 hover:border-emerald-400/60"
          >
            ⌘K full terminal
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
