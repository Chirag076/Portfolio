import React, { useRef, useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AboutMe from "./AboutMe";
import Services from "./Services";
import Contact from "./Contact";
import Reviews from "./Reviews";
import Projects from "./Projects";
import Experience from "./Experience";

const Landing = () => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const [menuOpen, setMenuOpen] = useState(false);

  const lerp = (start, end, factor) => start + (end - start) * factor;

  // Smooth animation loop
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.075);
      current.current.y = lerp(current.current.y, target.current.y, 0.075);

      if (imageRef.current) {
        imageRef.current.style.transform = `translate(-50%, 0) translate(${current.current.x}px, ${current.current.y}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handlers memoized for performance
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    target.current = {
      x: ((x - centerX) / centerX) * 20,
      y: ((y - centerY) / centerY) * 20,
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.style.filter =
        "drop-shadow(0 0 30px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.6))";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
    if (imageRef.current) {
      imageRef.current.style.filter =
        "drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))";
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex flex-col bg-black text-white min-h-screen font-sans">
      <div className="sticky top-0 bg-black z-20">
        <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} closeMenu={closeMenu} />
      </div>
      <div className="relative flex flex-1">
        <Hero
          imageRef={imageRef}
          containerRef={containerRef}
          handleMouseMove={handleMouseMove}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      </div>
      <AboutMe />
      <Services />
      <Experience />
      <Projects />
      <Reviews />
      <Contact />
    </div>
  );
};

export default Landing;
