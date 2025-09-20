import React, { useRef, useEffect } from "react";

const AnimatedImage = ({ imageRef, containerRef, handleMouseMove, handleMouseEnter, handleMouseLeave }) => {
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        relative w-full 
        h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] 
        mt-[-2rem] sm:mt-[-3rem] md:mt-[-4rem] 
        z-100
      "
    >
      <img
        ref={imageRef}
        src="./photo2.png"
        alt="Chirag"
        className="
          absolute left-[46%]
          top-[5%] sm:top-[-5%] 
          w-[160vw] sm:w-[70vw] md:w-[60vw] lg:w-[55vw] xl:w-[160vw] 
          max-w-[90rem]
          pointer-events-none 
          transition-filter duration-300
        "
        style={{
          transform: "translate(-50%, 0)",
          filter:
            "drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
        }}
      />
    </div>
  );
};

export default AnimatedImage;
