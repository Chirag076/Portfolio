import React from "react";
import AnimatedImage from "./AnimatedImage";

const Hero = ({
  imageRef,
  containerRef,
  handleMouseMove,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <section className="relative px-6 pt-0 pb-32 text-center flex flex-col items-center justify-center overflow-hidden">
      {/* Heading */}
      <h1
        className="
          text-[20vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] xl:text-[12vw]
          leading-none font-extrabold z-10
        "
      >
        HI, I'M CHIRAG
      </h1>

      {/* Animated Image */}
      <AnimatedImage
        imageRef={imageRef}
        containerRef={containerRef}
        handleMouseMove={handleMouseMove}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />

      {/* Paragraph */}
      <div
        className="
          -mt-32 sm:-mt-20 md:-mt-32 lg:-mt-20
          max-w-xl 
          text-sm sm:text-base md:text-lg lg:text-xl 
          text-gray-300 z-10
        "
      >
        <p>
          I'm a passionate developer with experience in building web
          applications. I focus on performance, accessibility, and clean UI.
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
  );
};

export default Hero;
