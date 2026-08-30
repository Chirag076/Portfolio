import React, { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import SectionRail from "./SectionRail";
import ScrollStory from "./ScrollStory";
import JourneyPath from "./JourneyPath";
import AboutMe from "./AboutMe";
import Services from "./Services";
import Contact from "./Contact";
import Reviews from "./Reviews";
import Projects from "./Projects";
import Experience from "./Experience";
import Marquee from "./Marquee";
import SpotlightSection from "./SpotlightSection";
import { motion } from "framer-motion";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex flex-col text-white min-h-screen font-sans bg-transparent relative z-0">
      <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} closeMenu={closeMenu} />
      <SectionRail />
      <div className="bg-black relative z-10">
        <div className="relative flex flex-1">
          <Hero />
        </div>
        <Stats />
        <AboutMe />
        <Services />
        <ScrollStory />
        <Marquee />
        <JourneyPath />
        <Experience />
        <SpotlightSection />
        <Projects />
        <Reviews />
      </div>
      
      {/* Contact Section acting as the final solid block */}
      <div className="bg-black relative z-10 rounded-b-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] pb-10">
        <Contact />
      </div>

      {/* Footer Spacer */}
      <div className="h-[60vh] w-full bg-transparent"></div>

      {/* Footer Reveal (Fixed Behind) */}
      <footer className="fixed bottom-0 left-0 w-full h-[60vh] -z-10 bg-[#0a0a0a] flex flex-col justify-center items-center overflow-hidden">
        <motion.h1 
          className="text-[14vw] font-extrabold text-transparent bg-clip-text bg-gradient-to-t from-pink-600 via-purple-600 to-orange-500 opacity-90 tracking-tighter"
          initial={{ y: 100, scale: 0.9 }}
          whileInView={{ y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          LET'S TALK
        </motion.h1>
      </footer>
    </div>
  );
};

export default Landing;
