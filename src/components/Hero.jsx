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
      <div >

      <h1
        className="text-[20vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] xl:text-[12vw] leading-none font-extrabold z-10"
        >
        HI, I'M CHIRAG
      </h1>  {/* Heading */}
        </div>

      {/* Responsive Layout */}
      <div className="mt-10 z-10 w-full max-w-7xl">
        {/* Mobile (Image → Para → Button) */}
        <div className="flex flex-col items-center lg:hidden gap-8">
          {/* Image */}
          <AnimatedImage
            imageRef={imageRef}
            containerRef={containerRef}
            handleMouseMove={handleMouseMove}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />

          {/* Paragraph */}
          <p className="max-w-sm text-sm sm:text-base md:text-lg text-gray-300">
            I'm a passionate developer with experience in building web
            applications. I focus on performance, accessibility, and clean UI.
          </p>

          {/* Button */}
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-md transition"
          >
            Contact Me
          </a>
        </div>

        {/* Desktop (3-column grid) */}
        <div className="hidden lg:flex flex-row items-center justify-center gap-10">
          {/* Left - Paragraph */}
          <div className="flex justify-start w-[20%]">
            <p className="max-w-sm text-lg lg:text-xl text-gray-300">
              I'm a passionate developer with experience in building web
              applications. I focus on performance, accessibility, and clean UI.
            </p>
          </div>

          {/* Center - Image */}
          <div className="flex justify-center item-center w-[45%]">
            <AnimatedImage
              imageRef={imageRef}
              containerRef={containerRef}
              handleMouseMove={handleMouseMove}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          </div>

          {/* Right - Button */}
          <div className="flex justify-center w-[20%]">
            <a
              href="#contact"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-md transition"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
