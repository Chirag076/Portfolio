import React, { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedImage from "./AnimatedImage";
import BlurText from "./BlurText";
import Magnetic from "./Magnetic";
import CanvasParticles from "./CanvasParticles";
import Aurora from "./Aurora";
import KineticHeading from "./KineticHeading";
import { usePortfolio } from "../context/PortfolioContext";

// Memoized to prevent unnecessary re-renders
const Hero = memo(() => {
  const { setShowResume } = usePortfolio();

  /* scroll-linked departure: the hero recedes rather than simply scrolling off,
     and the layers move at different rates so it reads as depth */
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const headY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const headScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bodyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const bodyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative px-6 pt-28 md:pt-32 pb-24 text-center flex flex-col items-center justify-start overflow-hidden w-full bg-black min-h-screen">
      <motion.div style={{ y: auroraY }} className="absolute inset-0 z-0">
        <Aurora />
      </motion.div>
      <CanvasParticles />
      {/* Heading */}
      <motion.div style={{ y: headY, scale: headScale, opacity: headOpacity }} className="z-10 mt-20 md:mt-0 will-change-transform">
        <KineticHeading
          text="HI, I'M CHIRAG"
          delay={0.15}
          stagger={0.045}
          className="text-[15vw] sm:text-[11vw] md:text-[11vw] lg:text-[11vw] xl:text-[12vw] leading-[0.92] font-extrabold z-0 tracking-tight"
        />
      </motion.div>

      {/* Responsive Layout */}
      <motion.div style={{ y: bodyY, opacity: bodyOpacity }} className="mt-10 relative z-20 w-full pointer-events-none will-change-transform">
        <div className="lg:flex flex-row justify-center gap-10 items-center pointer-events-auto">
          {/* Left - Paragraph */}
          <div className="hidden lg:flex justify-center flex-grow w-[38%] items-center xl:-translate-y-29 xl:translate-x-24 lg:translate-x-12 lg:-translate-y-12">
            <BlurText
              text="I build the parts people only notice when they break. Booking, payments, access control. Right now at Rocket Health; before that, forty salons running ten thousand appointments a month at UnQue."
              delay={120}
              animateBy="words"
              direction="top"
              className="text-gray-300/90 font-medium text-[15px] xl:text-[17px] leading-relaxed text-center max-w-[34ch]"
            />
          </div>

          {/* Center - Image */}
          <div className="flex justify-center items-center w-full relative z-20">
            <AnimatedImage />
          </div>

          {/* Mobile paragraph */}
          <div className="flex lg:hidden justify-center w-full mt-6">
            <BlurText
              text="I build the parts people only notice when they break. Booking, payments, access control."
              delay={120}
              animateBy="words"
              direction="top"
              className="font-bold text-gray-300 text-base text-center max-w-xs"
            />
          </div>

          {/* Right - Buttons */}
          {/* Desktop Buttons */}
          <div className="hidden lg:flex flex-none flex-col gap-4 justify-center items-center xl:-translate-y-24 xl:-translate-x-24 lg:-translate-y-14 lg:-translate-x-12">
            <Magnetic intensity={0.2}>
              <a
                href="#contact"
                className="group relative inline-block text-[15px] tracking-[0.14em] font-bold uppercase text-white px-12 py-5 rounded-full
                         overflow-hidden transition-all duration-500 ease-out hover:-translate-y-0.5
                         shadow-[0_18px_40px_-18px_rgba(239,123,45,0.65)]"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
                <span className="absolute inset-0 translate-y-full rounded-full bg-white/15 transition-transform duration-500 ease-out group-hover:translate-y-0"></span>
                <span className="relative z-10 font-bold">Contact me</span>
              </a>
            </Magnetic>

              <Magnetic intensity={0.2}>
                <button
                  onClick={() => setShowResume(true)}
                  className="relative inline-block text-[14px] tracking-[0.14em] font-semibold uppercase text-gray-100 px-10 py-[18px] rounded-full
                         border border-white/20 bg-white/[0.05] transition-all duration-300
                         hover:bg-white hover:text-black hover:border-white"
                >
                  <span className="relative z-10">View resume</span>
                </button>
              </Magnetic>
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden flex-col gap-4 justify-center w-full mt-6">
            <Magnetic intensity={0.2}>
              <a
                href="#contact"
                className="relative inline-block text-lg font-extrabold uppercase text-white px-8 py-3 rounded-full
                   -translate-y-1 transition-all duration-500 ease-out border-[4px] border-transparent overflow-hidden
                   hover:-translate-x-[6px] hover:translate-y-[8px] hover:rotate-[-2deg]
                   hover:shadow-[12px_12px_40px_rgba(239,123,45,0.8)] hover:border-white"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
                <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
                <span className="relative z-10 font-extrabold">Contact Me</span>
              </a>
            </Magnetic>

            <Magnetic intensity={0.2}>
              <button
                onClick={() => setShowResume(true)}
                className="relative inline-block text-base font-bold uppercase text-white px-6 py-2.5 rounded-full
                 border border-white/30 transition-all duration-300 hover:bg-white hover:text-black"
              >
                <span className="relative z-10">View Resume</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
);

export default Hero;
