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
    <section className="relative px-6 pt-0 pb-32 text-center flex flex-col items-center justify-start overflow-hidden w-full">
      {/* Heading */}
      <div >

        <h1
          className="text-[20vw] sm:text-[11vw] md:text-[11vw] lg:text-[11vw] xl:text-[12vw] leading-none font-extrabold z-1"
        >
          HI, I'M CHIRAG
        </h1>  {/* Heading */}
      </div>

      {/* Responsive Layout */}
      <div className="mt-10 z-1 w-full">

        {/* Desktop (3-column grid) */}
        <div className="lg:flex flex-row justify-center gap-10">
          {/* Left - Paragraph */}
          <div className="hidden lg:flex justify-center w-[24%] items-center">
            <p className="max-w-sm text-lg lg:text-xl text-gray-300">
              I'm a passionate developer with experience in building web
              applications. I focus on performance, accessibility, and clean UI.
            </p>
          </div>


          {/* Center - Image */}
          <div className="flex justify-center item-center lg:!w-[49%] w-full ">
            <AnimatedImage
              imageRef={imageRef}
              containerRef={containerRef}
              handleMouseMove={handleMouseMove}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          </div>

          <div className="flex lg:hidden justify-center w-full">
            <p className="max-w-xs text-base text-gray-300">
              I'm a dev who loves making clean and fast web apps.
            </p>
          </div>

          {/* Right - Button */}
          <div className="flex justify-center lg:!w-[24%] w-full items-center">
            <a
              href="#contact"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-md transition max-w-[10rem] max-h-[3rem]"
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
