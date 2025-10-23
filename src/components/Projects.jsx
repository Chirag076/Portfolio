import { motion } from "framer-motion";
import BlurText from "./BlurText";

const projects = [
  {
    id: "01",
    title: "🗨️ Talksy – Fullstack Chat App",
    description:
      "A real-time chat application built with React, Node.js, and MongoDB. Features secure authentication, responsive UI, and 1-to-1 messaging with Zustand state management.",
    image: "/images/talksy.png",
    link: "https://github.com/Chirag076/Talksy",
  },

  // {
  //   id: "02",
  //   title: "Discord Analytics Dashboard",
  //   description:
  //     "A dashboard to monitor Discord server metrics including engagement, toxicity detection, and content trends. Built with React, Node.js, PostgreSQL, and Chart.js.",
  //   image: "/images/project2.png",
  //   link: "https://github.com/Chirag076/discord-dashboard",
  // },
  // {
  //   id: "03",
  //   title: "Personal Portfolio",
  //   description:
  //     "A responsive portfolio website showcasing projects, skills, and resume. Built with Next.js, TailwindCSS, and Framer Motion for animations.",
  //   image: "/images/project3.png",
  //   link: "https://chirag-portfolio.vercel.app",
  // },
];

const Projects = () => {
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
          viewport={{ once: false, amount: 0.9 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem]"
          style={{ WebkitTextStroke: "2px white", color: "black" }}
        >
          PROJECTS
        </motion.h1>

        {/* Fill Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.9 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="relative font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ec4899, #8b5cf6, #f97316)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          PROJECTS
        </motion.h1>
      </div>


      {/* Project List */}
      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 w-[90%] max-w-6xl z-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
            whileHover={{
              scale: 1.03,
              y: -5,
              boxShadow: "0px 0px 80px rgba(255,255,255,0.25)",
              transition: { duration: 0.2, ease: "easeOut" }, // faster hover response
            }}

            className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 transition-all duration-500"
          >
            {/* Project Image */}
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full md:w-1/3 rounded-2xl object-cover border-2 sm:border-4 border-white/30"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            />

            {/* Project Content */}
            <motion.div className="md:w-2/3 text-left mt-4 md:mt-0">
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
                className="relative inline-block text-lg sm:text-xl font-extrabold uppercase text-white px-8 py-3 rounded-full
             -translate-y-1 transition-all duration-500 ease-out border-[4px] border-transparent overflow-hidden
             hover:-translate-x-[6px] hover:translate-y-[8px] hover:rotate-[-2deg]
             hover:shadow-[12px_12px_40px_rgba(190,100,255,0.8)] hover:border-white"
                whileHover={{ scale: 1.02 }} // optional small scale for extra pop
                whileTap={{ scale: 0.95 }}
              >
                {/* Gradient background */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
                {/* Overlay border */}
                <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
                {/* Button text */}
                <span className="relative z-10">View Project</span>
              </motion.a>

            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
