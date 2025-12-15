import React from "react";

const AnimatedImage = ({ imageRef, containerRef, handleMouseMove, handleMouseEnter, handleMouseLeave }) => {
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        relative w-full h-full
        mt-[-4rem] sm:mt-[-1rem] md:mt-[0rem] xl:mt-[-3rem] lg:mt-[-3rem]
        z-1
      "
    >
      <img
        ref={imageRef}
        src="./photo2.png"
        alt="Chirag"
        className="
          relative left-[46%] item-center
          mt-[5%] mb-[-16%] sm:mt-[-7%] 
          w-[190%] sm:w-[155%] md:w-[116%] lg:w-[200%] xl:w-[147%]
          max-w-[90rem]
          pointer-events-none
        "
        style={{
          transform: "translate(-50%, 0)",
          filter:
            "drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
          willChange: "transform, filter", // <-- GPU optimization
        }}
      />
    </div>
  );
};

export default AnimatedImage;
