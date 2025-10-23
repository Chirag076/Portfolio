import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    name: "Manika Bhutani",
    text: "Chirag interned and worked with my small business on a project focused on building, integrating, and testing website during August and September 2025. Throughout this time, he demonstrated curiosity and a strong desire to contribute, offering various solutions. He possesses a good understanding of backend technologies,custom software and relevant industry knowledge.I endorse him for his practical skills and knowledge.Best of luck with all your future pursuits.",
    role: "Business Owner | Artist",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQFpV9temAXxOw/profile-displayphoto-crop_800_800/B56ZirM3CPG0Bg-/0/1755218933103?e=1762992000&v=beta&t=SgqzTIO_9nQvv4tK3kdIuyDd0bJko4wTdCh-zNiLw0M",
  },
  // {
  //   name: "Bob Smith",
  //   text: "Highly recommend Chirag! Delivered on time and exceeded our expectations.",
  //   role: "Project Manager, SoftSolutions",
  //   avatar: "/images/avatar2.png",
  // },
  // {
  //   name: "Clara Lee",
  //   text: "Working with Chirag was seamless. Excellent communication and clean code.",
  //   role: "CTO, InnovateX",
  //   avatar: "/images/avatar3.png",
  // },
];

const Reviews = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide reviews every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="customers"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden sm:scroll-mt-1 xl:scroll-mt-24"
    >
      {/* Heading */}
      <div className="relative inline-block mb-16 text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[9rem] xl:text-[13rem]"
          style={{ WebkitTextStroke: "2px white", color: "black" }}
        >
          REVIEWS
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          className="relative font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[14rem]"
          style={{
            backgroundImage:
              "linear-gradient(270deg, #ec4899, #8b5cf6, #f97316, #ec4899)",
            backgroundSize: "400% 400%",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          REVIEWS
        </motion.h1>
      </div>

      {/* Review Card */}
      <div className="relative w-full max-w-4xl z-10 flex justify-center px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center text-center md:text-left space-y-4 sm:space-y-6 md:space-y-0 md:space-x-6 lg:space-x-8
                       shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-transparent hover:border-pink-500 transition-all duration-500"
          >
            <motion.img
              src={reviews[current].avatar}
              alt={reviews[current].name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-4 border-pink-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="flex-1">
              <p className="text-sm sm:text-base md:text-lg text-gray-200 italic mb-2 sm:mb-4">
                "{reviews[current].text}"
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {reviews[current].name}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                {reviews[current].role}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 sm:mt-8 space-x-3 sm:space-x-4 z-10">
        {reviews.map((_, idx) => (
          <motion.span
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer ${current === idx ? "bg-pink-500" : "bg-gray-500/50"
              }`}
            whileHover={{ scale: 1.3 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </section>
  );
};

export default Reviews;
