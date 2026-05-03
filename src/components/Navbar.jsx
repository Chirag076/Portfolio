import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Magnetic from "./Magnetic";
import LocalTime from "./LocalTime";
import { usePortfolio } from "../context/PortfolioContext";

const Navbar = ({ menuOpen, toggleMenu, closeMenu }) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { setShowSecrets, setShowResume } = usePortfolio();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    // User requested to ONLY hide when scrolling UP.
    if (latest < previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setAtTop(latest < 50);
  });

  const handleNavClick = (e, link) => {
    if (link.id === "resume") {
      e.preventDefault();
      setShowResume(true);
      if (closeMenu) closeMenu();
      return;
    }
    
    if (link.external) return; // Let default anchor behavior handle it
    
    e.preventDefault();
    const section = document.getElementById(link.id);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top - 80, // 80px offset for the fixed navbar
        behavior: "smooth"
      });
    }
    if (closeMenu) closeMenu();
  };

  const links = [
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
    { id: "resume", label: "Resume" },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 flex justify-between items-center px-6 sm:px-8 py-3 sm:py-2 z-[90] transition-colors duration-300 ${atTop ? "bg-transparent" : "bg-black/40 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10"
        }`}
    >
      {/* Logo */}
      <Magnetic intensity={0.1}>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img
            src="./logo2.png"
            alt="Logo"
            className="h-16 sm:h-14 md:h-16 lg:h-20 w-auto transition-all duration-300"
          />
        </button>
      </Magnetic>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-10 text-xs lg:text-sm font-bold tracking-widest uppercase text-gray-400">
        {links.map(link => (
          <Magnetic intensity={0.2} key={link.id}>
            <a
              href={link.external ? link.url : `#${link.id}`}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
              className="hover:text-white transition-colors cursor-pointer relative group"
              onClick={(e) => handleNavClick(e, link)}
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </Magnetic>
        ))}
        <div className="w-px h-5 bg-white/10 mx-2"></div>
        <Magnetic intensity={0.2}>
          <button
            onClick={() => setShowSecrets(true)}
            className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 hover:border-pink-400 hover:bg-pink-500/20 text-pink-400 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-[0_0_10px_rgba(236,72,153,0.1)]"
          >
            <span className="animate-pulse">✨</span> SECRETS
          </button>
        </Magnetic>
      </div>

      {/* Local Time Widget */}
      <LocalTime />

      {/* Mobile Menu Icon */}
      <div
        className={`
          md:hidden 
          text-2xl sm:text-3xl 
          cursor-pointer transition-transform duration-300 transform
          ${menuOpen ? "rotate-90 scale-110 text-blue-400" : "rotate-0"}
        `}
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="
            absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl 
            flex flex-col items-center space-y-8 py-10 
            text-3xl font-extrabold tracking-wider 
            md:hidden z-50 border-b border-white/10
          "
        >
          {links.map(link => (
            <a
              key={link.id}
              href={link.external ? link.url : `#${link.id}`}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
              onClick={(e) => handleNavClick(e, link)}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          {/* Secrets hidden on mobile per user request */}
        </div>
      )}

    </motion.nav>
  );
};

export default React.memo(Navbar);