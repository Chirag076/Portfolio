import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";

const Experience = () => {
  const ref = useRef(null);
  const { experience: experiences } = usePortfolio();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section
      ref={ref}
      id="experience"
      className="relative py-24 px-6 md:px-10 text-white bg-black overflow-hidden"
    >
      {/* Background gradient blur */}
      <motion.div style={{ y: y1, willChange: "transform" }} className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/30 blur-[200px] rounded-full -z-10 animate-pulse"></motion.div>
      <motion.div style={{ y: y2, willChange: "transform" }} className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/20 blur-[200px] rounded-full -z-10 animate-pulse"></motion.div>

      {/* Heading */}
      <div className="flex justify-center items-center mb-20 text-center relative z-10">
  <div className="relative inline-block">
    {/* Stroke Layer */}
    <motion.h1
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: 1.4 }}
      className="absolute inset-0 font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem]"
      style={{
        WebkitTextStroke: "2px rgba(255,255,255,0.5)",
        color: "transparent",
      }}
    >
      EXPERIENCE
    </motion.h1>

    {/* Fill Layer */}
    <motion.h1
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: 1.4, delay: 0.4 }}
      className="relative font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem]"
      style={{ color: "#EDEAE4" }}
    >
      EXPERIENCE
    </motion.h1>
  </div>
</div>


      {/* Experience Cards */}
      <div className="max-w-6xl mx-auto grid gap-12 md:gap-16">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-[2px] rounded-panel hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] transition-all duration-500"
          >
            <div className="bg-black rounded-panel p-8 md:p-10 h-full">
              {/* Gradient border glow */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r ${exp.glow} blur-[60px] rounded-panel -z-10`}
              ></div>

              <motion.h3
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400"
              >
                {exp.role}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
                className="text-lg font-semibold text-gray-300 mb-1"
              >
                {exp.company}
              </motion.p>

              <p className="text-sm text-gray-400 mb-4">{exp.duration}</p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-gray-400 leading-relaxed mb-6"
              >
                {exp.description}
              </motion.p>

              <div className="flex flex-wrap gap-3">
                {exp.tech.map((tech, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-1.5 text-sm font-medium rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-all"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
