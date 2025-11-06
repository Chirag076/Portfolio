import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlurText from "./BlurText";

const About = () => {
  const [showShapes, setShowShapes] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowShapes(true);
      } else {
        setShowShapes(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMobile = window.innerWidth < 768;

  const shapes = isMobile
    ? [
      { x: -10, y: 60, size: 250, src: "/images/heart.png", delay: 0 },  // smaller and lower for mobile
      { x: 65, y: -10, size: 250, src: "/images/flower.png", delay: 0.2 },
    ]
    : [
      { x: -5, y: 50, size: 400, src: "/images/heart.png", delay: 0 },
      { x: 80, y: -3, size: 400, src: "/images/flower.png", delay: 0.2 },
    ];



  return (
    <section
      id="about"
      className="relative px-6 py-6 text-center flex flex-col items-center justify-center w-full bg-black text-white overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 -z-9">
        {shapes.map((shape, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              showShapes
                ? { opacity: 1, scale: [1.2, 1] }
                : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
            }}
          >
            <img
              src={shape.src}
              alt="shape"
              style={{
                width: shape.size,
                height: shape.size,
                objectFit: "contain",
              }}
            />
          </motion.div>
        ))}
      </div>


      {/* HEADING */}
      <div className="relative inline-block mb-14 z-10">
        {/* Stroke Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.9 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem] text-white"
          style={{
            WebkitTextStroke: "2px white",
            color: "black",
          }}
        >
          ABOUT ME
        </motion.h1>

        {/* Fill Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.9 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="relative font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem]"
          style={{
            backgroundImage: "linear-gradient(to right, #ec4899, #8b5cf6, #f97316)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          ABOUT ME
        </motion.h1>
      </div>


      {/* PARAGRAPH */}
      <BlurText
        text="Hi, I'm Chirag! I'm a full-stack developer passionate about building fast, scalable, and visually clean web and mobile apps. I focus on performance, accessibility, and seamless DevOps integration to create smooth digital experiences."
        delay={150}
        animateBy="words"
        direction="top"
        className="max-w-3xl text-xl sm:text-xl md:text-5xl leading-relaxed text-gray-300 z-10"
      />


      {/* Contact Me Button */}
      {/* Desktop Button */}
      <div className="hidden lg:flex flex-none justify-center items-center mt-14 z-10 space-x-8">
        {/* Contact Me Button */}
        <a
          href="#contact"
          className="relative inline-block xl:text-2xl lg:text-2xl font-extrabold uppercase text-white xl:px-14 xl:py-6 lg:px-10 lg:py-4 rounded-full
             -translate-y-1 transition-all duration-500 ease-out border-[4px] border-transparent overflow-hidden
             hover:-translate-x-[6px] hover:translate-y-[8px] hover:rotate-[-2deg]
             hover:shadow-[12px_12px_40px_rgba(190,100,255,0.8)] hover:border-white"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
          <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
          <span className="relative z-10 font-extrabold">Contact Me</span>
        </a>

        {/* View Resume Button (opposite gradient) */}
        <a
          href="https://drive.google.com/file/d/13XVKIrolKCgkoNNQpibAfYAoYyP4EudW/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block xl:text-2xl lg:text-2xl font-extrabold uppercase text-white xl:px-14 xl:py-6 lg:px-10 lg:py-4 rounded-full
             -translate-y-1 transition-all duration-500 ease-out border-[4px] border-transparent overflow-hidden
             hover:-translate-x-[6px] hover:translate-y-[8px] hover:rotate-[2deg]
             hover:shadow-[12px_12px_40px_rgba(255,150,100,0.8)] hover:border-white"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-purple-600 via-pink-600 to-black"></span>
          <span className="absolute inset-0 rounded-full border-[2px] border-orange-300 pointer-events-none"></span>
          <span className="relative z-10 font-extrabold">View Resume</span>
        </a>
      </div>


      {/* Mobile Button */}
      {/* Mobile Button */}
      <div className="flex lg:hidden justify-center items-center w-full mt-8 z-10 space-x-4">
        {/* Contact Me Button */}
        <a
          href="#contact"
          className="relative inline-block text-base font-extrabold uppercase text-white px-6 py-3 rounded-full
             -translate-y-1 transition-all duration-500 ease-out border-[3px] border-transparent overflow-hidden
             hover:-translate-x-[4px] hover:translate-y-[6px] hover:rotate-[-2deg]
             hover:shadow-[8px_8px_25px_rgba(190,100,255,0.8)] hover:border-white"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
          <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
          <span className="relative z-10 font-extrabold">Contact Me</span>
        </a>

        {/* View Resume Button */}
        <a
          href="https://drive.google.com/file/d/13XVKIrolKCgkoNNQpibAfYAoYyP4EudW/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block text-base font-extrabold uppercase text-white px-6 py-3 rounded-full
             -translate-y-1 transition-all duration-500 ease-out border-[3px] border-transparent overflow-hidden
             hover:-translate-x-[4px] hover:translate-y-[6px] hover:rotate-[2deg]
             hover:shadow-[8px_8px_25px_rgba(255,150,100,0.8)] hover:border-white"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-purple-600 via-pink-600 to-black"></span>
          <span className="absolute inset-0 rounded-full border-[2px] border-orange-300 pointer-events-none"></span>
          <span className="relative z-10 font-extrabold">View Resume</span>
        </a>
      </div>


    </section>
  );
};

export default About;
