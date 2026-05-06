import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import { RotateCcw } from "lucide-react";
import ScrambleText from "./ScrambleText";

const ServiceCard = ({ service, index, isMobile, handleClose }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--sx", `${e.clientX - left}px`);
    cardRef.current.style.setProperty("--sy", `${e.clientY - top}px`);
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      onMouseMove={handleMouseMove}
      drag={!isMobile}
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.2}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, boxShadow: "0px 20px 80px rgba(0,0,0,0.5)", zIndex: 50 }}
      style={{
        background: `radial-gradient(400px circle at var(--sx, 50%) var(--sy, 50%), rgba(255,255,255,0.06), transparent 80%)`
      }}
      className="flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.05)] cursor-grab active:cursor-grabbing transition-colors duration-300 hover:border-pink-500/30"
    >
      {/* macOS Window Header */}
      <div className="w-full bg-black/40 border-b border-white/10 px-4 py-3 flex items-center gap-2">
        <button 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={() => handleClose(service.id)} 
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"
        ></button>
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
        <span className="ml-4 text-xs font-mono text-gray-400">service_{service.id}.exe</span>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 md:p-10 lg:p-12 pointer-events-none">
        {/* Big Number */}
        <motion.div
          className="text-4xl sm:text-5xl md:text-[6rem] lg:text-[8rem] font-extrabold opacity-20 leading-none md:w-1/3 text-center select-none text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500"
        >
          {service.id}
        </motion.div>

        <div className="md:w-2/3 text-left">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-md">
            {service.title}
          </h3>
          <p className="text-base sm:text-lg md:text-2xl text-gray-300 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const { services } = usePortfolio();
  const [closedIds, setClosedIds] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClose = (id) => {
    setClosedIds((prev) => [...prev, id]);
  };

  const handleRestore = () => {
    setClosedIds([]);
  };

  return (
    <section
      id="services"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden"
    >
      {/* Heading */}
      <div className="relative inline-block mb-10 md:mb-20 z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem] text-white"
          style={{ WebkitTextStroke: "2px white", color: "black" }}
        >
          <ScrambleText text="SERVICES" />
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="relative font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem]"
          style={{
            backgroundImage: "linear-gradient(to right, #ec4899, #8b5cf6, #f97316)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          <ScrambleText text="SERVICES" delay={400} />
        </motion.h1>
      </div>

      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 w-[90%] max-w-6xl z-10">
        <AnimatePresence>
          {services
            .filter((service) => !closedIds.includes(service.id))
            .map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index} 
                isMobile={isMobile} 
                handleClose={handleClose} 
              />
            ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {closedIds.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleRestore}
            className="mt-12 flex items-center gap-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 px-6 py-2 rounded-full text-pink-400 font-bold transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] z-10"
          >
            <RotateCcw size={18} />
            RESTORE CLOSED WINDOWS
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
