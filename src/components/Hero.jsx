import React from "react";
import AnimatedImage from "./AnimatedImage";
import BlurText from "./BlurText";
const Hero = ({
  imageRef,
  containerRef,
  handleMouseMove,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  return (
    <section className="relative px-6 pt-0 pb-24 text-center flex flex-col items-center justify-start overflow-hidden w-full">
      {/* Heading */}
      <div>
        <h1 className="text-[20vw] sm:text-[11vw] md:text-[11vw] lg:text-[11vw] xl:text-[12vw] leading-none font-extrabold z-0">
          HI, I'M CHIRAG
        </h1>
      </div>

      {/* Responsive Layout */}
      <div className="mt-10 z-0 w-full">
        {/* Desktop (3-column grid) */}
        <div className="lg:flex flex-row justify-center gap-10 items-center">
          {/* Left - Paragraph */}
          <div className="hidden lg:flex justify-center flex-grow w-[29%] items-center xl:-translate-y-29 xl:translate-x-24 lg:translate-x-12 lg:-translate-y-12">
            <BlurText
              text="I'm a full-stack developer passionate about crafting fast, accessible, and visually clean web and app experiences — from frontend to backend and DevOps."
              delay={120}
              animateBy="words"
              direction="top"
              className="font-bold text-gray-300 lg:text-2xl xl:text-2xl lg:text-1xl text-center"
            />
          </div>


          {/* Center - Image */}
          <div className="flex justify-center items-center w-full">
            <AnimatedImage
              imageRef={imageRef}
              containerRef={containerRef}
              handleMouseMove={handleMouseMove}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          </div>

          {/* Mobile paragraph */}
          <div className="flex lg:hidden justify-center w-full mt-6">
            <BlurText
              text="Full-stack dev skilled in web, app, and DevOps — building fast, clean, and seamless digital experiences."
              delay={120}
              animateBy="words"
              direction="top"
              className="font-bold text-gray-300 text-base text-center max-w-xs"
            />
          </div>

          {/* Right - Button */}
          {/* Desktop Button */}
          <div className="hidden lg:flex flex-none justify-center items-center xl:-translate-y-24 xl:-translate-x-24 lg:-translate-y-14 lg:-translate-x-12">
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
          </div>

          {/* Mobile Button */}
          <div className="flex lg:hidden justify-center w-full mt-6">
            <a
              href="#contact"
              className="relative inline-block text-lg font-extrabold uppercase text-white px-8 py-3 rounded-full
               -translate-y-1 transition-all duration-500 ease-out border-[4px] border-transparent overflow-hidden
               hover:-translate-x-[6px] hover:translate-y-[8px] hover:rotate-[-2deg]
               hover:shadow-[12px_12px_40px_rgba(190,100,255,0.8)] hover:border-white"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
              <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
              <span className="relative z-10 font-extrabold">Contact Me</span>
            </a>
          </div>

        </div>
      </div>
    </section>

  );
};

export default Hero;
