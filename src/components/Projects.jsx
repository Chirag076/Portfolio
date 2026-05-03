import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import BlurText from "./BlurText";
import { usePortfolio } from "../context/PortfolioContext";
import ScrambleText from "./ScrambleText";

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Faster, more responsive spring
  const springConfig = { damping: 20, stiffness: 400, mass: 0.1 };
  const rotateX = useSpring(useTransform(y, [-300, 300], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-300, 300], [-10, 10]), springConfig);

  // Parallax for the image
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Map mouse position over a wider range so it doesn't max out instantly
    const moveX = e.clientX - centerX;
    const moveY = e.clientY - centerY;
    x.set(moveX);
    y.set(moveY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, delay: index * 0.3 }}
      // Removed whileHover scale to prevent Framer Motion transform conflict
      // Removed backdrop-blur to prevent extreme GPU lag when rotating
      className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-10 bg-[#151515] hover:bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 transition-colors duration-500 border border-white/5 hover:border-white/10 hover:shadow-[0_0_80px_rgba(255,255,255,0.1)]"
    >
      {/* Project Image */}
      <div className="w-full md:w-1/3 rounded-2xl overflow-hidden border-2 sm:border-4 border-white/30">
        <motion.img
          src={project.image}
          alt={project.title}
          style={{
            transform: "translateZ(30px)",
            y: imageY,
            scale: 1.1
          }}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        />
      </div>

      {/* Project Content */}
      <motion.div
        style={{ transform: "translateZ(40px)" }} // Pops out slightly more
        className="md:w-2/3 text-left mt-4 md:mt-0"
      >
        <BlurText
          text={project.title}
          delay={100}
          animateBy="words"
          direction="top"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
        />
        <motion.p className="text-base sm:text-lg md:text-2xl text-gray-300 leading-relaxed mb-4">
          {project.description}
        </motion.p>

        {/* Shiny Gradient Button */}
        <motion.a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ transform: "translateZ(20px)" }}
          className="relative inline-block text-lg sm:text-xl font-extrabold uppercase text-white px-8 py-3 rounded-full
       -translate-y-1 transition-all duration-500 ease-out border-[4px] border-transparent overflow-hidden
       hover:-translate-x-[6px] hover:translate-y-[8px] hover:rotate-[-2deg]
       hover:shadow-[12px_12px_40px_rgba(190,100,255,0.8)] hover:border-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
          <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
          <span className="relative z-10">View Project</span>
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const { projects } = usePortfolio();

  return (
    <section
      id="projects"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden"
    >
      {/* Heading */}
      <div className="relative inline-block mb-12 z-10 text-center">
        {/* Stroke Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem]"
          style={{ WebkitTextStroke: "2px white", color: "black" }}
        >
          <ScrambleText text="PROJECTS" />
        </motion.h1>

        {/* Fill Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="relative font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ec4899, #8b5cf6, #f97316)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          <ScrambleText text="PROJECTS" delay={400} />
        </motion.h1>
      </div>

      {/* Project List */}
      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 w-[90%] max-w-6xl z-10" style={{ perspective: 1500 }}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
