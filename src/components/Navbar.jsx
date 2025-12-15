import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ menuOpen, toggleMenu, closeMenu }) => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const links = [
    { id: "about", label: "About" },
    { id: "customers", label: "Customers" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <nav className="flex justify-between items-center px-6 sm:px-8 py-3 sm:py-2 relative z-3">
      {/* Logo */}
      <div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img
            src="./logo2.png"
            alt="Logo"
            className="h-16 sm:h-14 md:h-16 lg:h-24 w-auto transition-all duration-300"
          />
        </button>
      </div>

      {/* Desktop Nav */}
      <div
        className="
          hidden md:flex 
          space-x-8 sm:space-x-12 lg:space-x-12 xl:space-x-24 md:space-x-16
          text-base sm:text-lg md:text-xl lg:text-4xl 
          font-extrabold tracking-wider
        "
      >
        {links.map(link => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className="hover:text-blue-400 transition"
          >
            {link.label}
          </button>
        ))}
      </div>

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
            absolute top-full left-0 w-full bg-black 
            flex flex-col items-center space-y-8 sm:space-y-8 py-10 
            text-3xl sm:text-3xl font-extrabold tracking-wider 
            md:hidden z-50
          "
        >
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => { scrollToSection(link.id); closeMenu(); }}
              className="hover:text-blue-400 transition"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navbar);