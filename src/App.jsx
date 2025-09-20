import React, { useRef, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const App = () => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const [menuOpen, setMenuOpen] = useState(false);

  const lerp = (start, end, factor) => start + (end - start) * factor;

  useEffect(() => {
    const animate = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.075);
      current.current.y = lerp(current.current.y, target.current.y, 0.075);

      if (imageRef.current) {
        imageRef.current.style.transform = `translate(-50%, 0) translate(${current.current.x}px, ${current.current.y}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 20;
    const moveY = ((y - centerY) / centerY) * 20;

    target.current = { x: moveX, y: moveY };
  };

  const handleMouseEnter = () => {
    if (imageRef.current) {
      imageRef.current.style.filter =
        "drop-shadow(0 0 30px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.6))";
    }
  };

  const handleMouseLeave = () => {
    target.current = { x: 0, y: 0 };

    if (imageRef.current) {
      imageRef.current.style.filter =
        "drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))";
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex flex-col bg-black text-white min-h-screen font-sans">
      <div className="realtive sticky top-0 bg-black z-[9]">
      <Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} closeMenu={closeMenu} />
      </div>
      <div className="relative flex justify-center items-center flex-1">
      <Hero
        imageRef={imageRef}
        containerRef={containerRef}
        handleMouseMove={handleMouseMove}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        />
        </div>
    </div>
  );
};

export default App;
