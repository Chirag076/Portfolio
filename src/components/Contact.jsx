import { useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_ryfoaqn", // replace
        "template_vw4a6gu", // replace
        form.current,
        "7q-uiXHo9f6scXtuS" // replace
      )
      .then(
        () => {
          alert("Message sent successfully 🚀");
          e.target.reset();
        },
        () => {
          alert("Failed to send ❌");
        }
      );
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden scroll-mt-1"
    >
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.15),_transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.15),_transparent_40%)]"
      ></motion.div>

      {/* Pulsing color rings */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 blur-[150px] sm:blur-[180px] md:blur-[200px] opacity-40 top-[-10%] left-[-10%]"
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] rounded-full bg-gradient-to-r from-purple-600 via-orange-400 to-pink-600 blur-[200px] sm:blur-[220px] md:blur-[250px] opacity-30 bottom-[-10%] right-[-10%]"
      />

      {/* Heading */}
      <div className="relative inline-block mb-10 sm:mb-2 z-10 text-center px-4">
        {/* Stroke Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.9 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem]"
          style={{ WebkitTextStroke: "2px white", color: "black" }}
        >
          CONTACT
        </motion.h1>

        {/* Fill Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.9 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          className="relative font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem]"
          style={{
            backgroundImage:
              "linear-gradient(270deg, #ec4899, #8b5cf6, #f97316, #ec4899)",
            backgroundSize: "400% 400%",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          CONTACT
        </motion.h1>
      </div>


      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 150, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        viewport={{ once: false, amount: 0.5 }}
        className="relative z-10 w-[90%] sm:w-[85%] max-w-xl md:max-w-2xl bg-white text-black rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-700 backdrop-blur-md"
      >
        <form ref={form} onSubmit={sendEmail} className="space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <label className="text-lg sm:text-xl font-bold text-gray-800">Your Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full mt-2 p-3 text-base sm:text-lg rounded-xl border-2 border-gray-300 bg-white/90 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 outline-none transition-all duration-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <label className="text-lg sm:text-xl font-bold text-gray-800">Your Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-2 p-3 text-base sm:text-lg rounded-xl border-2 border-gray-300 bg-white/90 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none transition-all duration-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <label className="text-lg sm:text-xl font-bold text-gray-800">Message</label>
            <textarea
              name="message"
              rows="4"
              required
              className="w-full mt-2 p-3 text-base sm:text-lg rounded-xl border-2 border-gray-300 bg-white/90 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 outline-none transition-all duration-500"
            ></textarea>
          </motion.div>

          <motion.button
            whileHover={{
              scale: 1.02,
              translateX: -6,
              translateY: 8,
              rotate: -2,
              boxShadow: "12px 12px 40px rgba(190,100,255,0.8)",
              transition: { duration: 0.5, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="relative w-full py-3 sm:py-4 text-lg sm:text-xl font-extrabold uppercase text-white px-6 sm:px-8 rounded-full
             -translate-y-1 border-[4px] border-transparent overflow-hidden transition-all duration-500 easeOut"
          >
            {/* Gradient background */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
            {/* Overlay border */}
            <span className="absolute inset-0 rounded-full border-[2px] border-purple-300 pointer-events-none"></span>
            {/* Button text */}
            <span className="relative z-10">Send Message ✉️</span>
          </motion.button>

        </form>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        className="mt-12 text-gray-400 text-sm sm:text-base z-10 tracking-wide px-4 text-center"
      >
        © 2025 Chirag Chhabra — Let’s Build Something Beautiful 🌈
      </motion.p>
    </section>
  );
};

export default Contact;
