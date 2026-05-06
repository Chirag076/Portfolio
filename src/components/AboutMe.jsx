import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import GithubStats from "./GithubStats";
import ScrambleText from "./ScrambleText";

const About = () => {
  const [text, setText] = useState("");
  const fullText = "I'm a full-stack developer passionate about crafting fast, accessible, and visually clean web and app experiences. \n\nI build seamless digital experiences, architect robust backends, and optimize cloud deployments. Always learning, always building.";

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20); // Typing speed
    return () => clearInterval(typingInterval);
  }, [isInView]);

  return (
    <section id="about" className="relative w-full bg-black text-white py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden">
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
          <ScrambleText text="ABOUT" />
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
              "linear-gradient(to right, #22c55e, #10b981, #34d399)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          <ScrambleText text="ABOUT" delay={400} />
        </motion.h1>
      </div>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10" ref={ref}>

        {/* Fake Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="bg-[#0D1117] border border-gray-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)]"
        >
          {/* Terminal Header */}
          <div className="bg-[#161B22] border-b border-gray-800 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs font-mono text-gray-400">chirag@macbook-pro:~</span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-8 font-mono text-sm sm:text-base md:text-lg">
            <div className="text-green-400 mb-4">$ whoami</div>
            <div className="text-gray-300 mb-8">Chirag Chhabra — Full-Stack Developer & Tech Enthusiast</div>

            <div className="text-green-400 mb-4">$ cat bio.txt</div>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line min-h-[140px] md:min-h-[100px]">
              {text}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2.5 h-5 bg-green-500 ml-1 align-middle"
              ></motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: text.length > 50 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-green-400 mt-8 mb-4">$ fetch stats --user=Chirag076</div>
              <GithubStats />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
