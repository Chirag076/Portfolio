import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Terminal, Sparkles } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, useSpring, AnimatePresence } from "framer-motion";
import Magnetic from "./Magnetic";
import LocalTime from "./LocalTime";
import { usePortfolio } from "../context/PortfolioContext";

const LINKS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const Navbar = ({ menuOpen, toggleMenu, closeMenu }) => {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const { setShowSecrets, setShowResume, setShowTerminal } = usePortfolio();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  /* which section is under the top third of the viewport */
  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const onScroll = () => {
      let current = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.35 && r.bottom >= window.innerHeight * 0.35) {
          current = id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, link) => {
    e.preventDefault();
    const section = document.getElementById(link.id);
    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - 96,
        behavior: "smooth",
      });
    }
    if (closeMenu) closeMenu();
  };

  return (
    <div className="fixed top-0 inset-x-0 z-[90] px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="pointer-events-auto mx-auto w-full max-w-[1180px]"
      >
        <motion.div
          animate={{
            backgroundColor: scrolled ? "rgba(8,8,10,0.72)" : "rgba(255,255,255,0.03)",
            borderColor: scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.07)",
            paddingTop: scrolled ? 10 : 14,
            paddingBottom: scrolled ? 10 : 14,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-between gap-3 rounded-full border px-3 sm:px-4 backdrop-blur-2xl overflow-hidden"
          style={{ boxShadow: "0 20px 50px -24px rgba(0,0,0,0.9)" }}
        >
          {/* top hairline highlight */}
          <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* reading progress, hugging the capsule */}
          <motion.span
            style={{ scaleX: progress }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 opacity-70"
          />

          {/* wordmark */}
          <Magnetic intensity={0.15}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 pl-3 pr-1 text-[18px] font-bold tracking-[-0.02em] text-white"
            >
              Chirag
              <span className="h-[7px] w-[7px] rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
            </button>
          </Magnetic>

          {/* centre links with sliding indicator */}
          <div className="hidden md:flex items-center gap-0.5">
            {LINKS.map((link) => {
              const on = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => go(e, link)}
                  className={`relative rounded-full px-3.5 lg:px-4 py-2 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-300 ${
                    on ? "text-white" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/10"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden xl:block"><LocalTime /></div>

            <button
              onClick={() => setShowTerminal(true)}
              title="Terminal (⌘K)"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition-all duration-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08]"
            >
              <Terminal size={16} />
            </button>

            <button
              onClick={() => setShowSecrets(true)}
              title="Secrets"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full border border-pink-500/25 bg-pink-500/[0.08] text-pink-400 transition-all duration-300 hover:border-pink-400/60 hover:bg-pink-500/15"
            >
              <Sparkles size={16} className="animate-pulse" />
            </button>

            <Magnetic intensity={0.15}>
              <button
                onClick={() => setShowResume(true)}
                className="group relative overflow-hidden rounded-full px-6 sm:px-7 py-2.5 text-[13.5px] font-bold tracking-[0.01em] text-white shadow-e2 transition-transform duration-300 hover:-translate-y-[2px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500" />
                <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10">Resume</span>
              </button>
            </Magnetic>

            <button
              className="md:hidden grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white"
              onClick={toggleMenu}
            >
              {menuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>
        </motion.div>

        {/* mobile sheet */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mt-2 rounded-3xl border border-white/10 bg-black/85 backdrop-blur-2xl p-3"
            >
              {LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => go(e, link)}
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
