import React, { useRef, useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

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
        'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.6))';
    }
  };

  const handleMouseLeave = () => {
    target.current = { x: 0, y: 0 };

    if (imageRef.current) {
      imageRef.current.style.filter =
        'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))';
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 relative z-50">
        {/* Logo */}
        <div>
          <img
            src="./logo2.png"
            alt="Logo"
            className="h-12 sm:h-16 md:h-20 w-auto transition-all duration-300"
          />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-24 text-2xl font-extrabold tracking-wider">
          <a href="#about" className="hover:text-blue-400 transition">About</a>
          <a href="#customers" className="hover:text-blue-400 transition">Customers</a>
          <a href="#projects" className="hover:text-blue-400 transition">Projects</a>
          <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
        </div>

        {/* Mobile Menu Icon */}
        <div
          className={`md:hidden text-3xl cursor-pointer transition-transform duration-300 transform ${
            menuOpen ? 'rotate-90 scale-110 text-blue-400' : 'rotate-0'
          }`}
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-black flex flex-col items-center space-y-6 py-6 text-2xl font-extrabold tracking-wider md:hidden z-50">
            <a href="#about" onClick={closeMenu} className="hover:text-blue-400 transition">About</a>
            <a href="#customers" onClick={closeMenu} className="hover:text-blue-400 transition">Customers</a>
            <a href="#projects" onClick={closeMenu} className="hover:text-blue-400 transition">Projects</a>
            <a href="#contact" onClick={closeMenu} className="hover:text-blue-400 transition">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-0 pb-32 text-center flex flex-col items-center justify-center overflow-hidden">
        <h1 className="text-[13vw] leading-none font-extrabold z-10">
          HI, I'M CHIRAG
        </h1>

        {/* Image Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="
            relative w-full 
            h-[24rem] sm:h-[32rem] md:h-[44rem] lg:h-[52rem] xl:h-[60rem] 
            mt-[-2rem] sm:mt-[-3rem] md:mt-[-4rem] 
            z-20
          "
        >
          <img
            ref={imageRef}
            src="./photo2.png"
            alt="Chirag"
            className="
              absolute left-1/2 
              top-[10%] sm:top-[0%] md:top-[-4%] 
              w-[44rem] sm:w-[52rem] md:w-[64rem] lg:w-[72rem] xl:w-[86rem] 
              pointer-events-none 
              transition-filter duration-300
            "
            style={{
              transform: 'translate(-50%, 0)',
              filter:
                'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
            }}
          />
        </div>

        {/* Paragraph */}
       {/* Paragraph */}
<div className="-mt-32 sm:-mt-28 md:-mt-56 max-w-2xl text-base sm:text-lg text-gray-300 z-10">
  <p>
    I'm a passionate developer with experience in building web applications.
    I focus on performance, accessibility, and clean UI.
  </p>
</div>



        {/* Contact Button */}
        <div className="mt-8 z-10">
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-md transition"
          >
            Contact Me
          </a>
        </div>
      </section>
    </div>
  );
};

export default App;
