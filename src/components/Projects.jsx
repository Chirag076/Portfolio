import { useRef, useState } from "react";
import Parallax from "./Parallax";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import BlurText from "./BlurText";
import { usePortfolio } from "../context/PortfolioContext";
import ScrambleText from "./ScrambleText";
import ProjectModal from "./ProjectModal";

const ProjectCard = ({ project, index, total, onOpen }) => {
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

  // Scroll-linked recede: as the next card rides up over this one it settles
  // back rather than simply being covered.
  const { scrollYProgress: pinP } = useScroll({
    target: cardRef,
    offset: ["start 14%", "end 14%"],
  });
  const isLast = index === total - 1;
  const pinScale = useTransform(pinP, [0, 1], isLast ? [1, 1] : [1, 0.9]);
  const pinOpacity = useTransform(pinP, [0, 1], isLast ? [1, 1] : [1, 0.4]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    cardRef.current.style.setProperty("--x", `${xPos}px`);
    cardRef.current.style.setProperty("--y", `${yPos}px`);
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
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
        scale: pinScale,
        opacity: pinOpacity,
        position: "sticky",
        top: `calc(6rem + ${index * 14}px)`,
        zIndex: index + 1,
        transformStyle: "preserve-3d",
        perspective: 1000,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        background: `radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(228, 84, 150, 0.10), transparent 40%), linear-gradient(180deg, #16161A 0%, #101013 100%)`
      }}
      className="light-catch flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-10 rounded-panel p-6 sm:p-8 md:p-10 lg:p-14 transition-colors duration-500 border border-white/[0.07] hover:border-white/[0.14] shadow-e3"
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
        <motion.button
          onClick={() => onOpen(project)}
          style={{ transform: "translateZ(20px)" }}
          className="relative inline-block text-lg sm:text-xl font-extrabold uppercase text-white px-8 py-3 rounded-full
       -translate-y-1 transition-all duration-500 ease-out border-[4px] border-transparent overflow-hidden
       hover:-translate-x-[6px] hover:translate-y-[8px] hover:rotate-[-2deg]
       hover:shadow-[12px_12px_40px_rgba(239,123,45,0.8)] hover:border-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
          <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
          <span className="relative z-10">Open project</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [open, setOpen] = useState(null);
  const { projects } = usePortfolio();

  return (
    <section
      id="projects"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden"
    >
      {/* Heading */}
      <Parallax y={[54, -54]} x={[-26, 26]}>
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
              "linear-gradient(to right, #E45496, #8663E4, #EF7B2D)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          <ScrambleText text="PROJECTS" delay={400} />
        </motion.h1>
      </div>
      </Parallax>

      {/* Project List */}
      <div className="flex flex-col gap-8 sm:gap-10 w-[90%] max-w-6xl z-10 pb-[30vh]" style={{ perspective: 1500 }}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} total={projects.length} onOpen={setOpen} />
        ))}
      </div>
      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
};

export default Projects;
