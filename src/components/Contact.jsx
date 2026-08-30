import React, { useRef, useState } from "react";
import Parallax from "./Parallax";
import { motion, useScroll, useTransform } from "framer-motion";
import emailjs from "emailjs-com";
import ContactCard from "./ContactCard";
import ScrambleText from "./ScrambleText";
import Magnetic from "./Magnetic";

const Contact = () => {
  const form = useRef();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  /* idle | sending | sent | error */
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const formData = new FormData(form.current);
    const data = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      message: (formData.get("message") || "").toString().trim(),
    };

    if (!data.name || !data.email || !data.message) {
      setStatus("error");
      setError("Please fill in all three fields.");
      return;
    }

    setStatus("sending");
    setError("");

    /* Two independent channels. The message counts as delivered if EITHER
       lands, so a Mongo outage doesn't silently swallow someone's message. */
    const saved = fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (r) => {
        if (r.ok) return true;
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `save failed (${r.status})`);
      })
      .catch((err) => {
        console.error("save:", err.message);
        return false;
      });

    const mailed = emailjs
      .sendForm(
        "service_ryfoaqn",
        "template_vw4a6gu",
        form.current,
        "7q-uiXHo9f6scXtuS"
      )
      .then(() => true)
      .catch((err) => {
        console.error("emailjs:", err?.text || err);
        return false;
      });

    const [didSave, didMail] = await Promise.all([saved, mailed]);

    if (didSave || didMail) {
      setStatus("sent");
      form.current.reset();
      setTimeout(() => setStatus("idle"), 6000);
    } else {
      setStatus("error");
      setError("Couldn't send that. Email me directly at chiragchhabrahmo@gmail.com.");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden scroll-mt-1"
    >
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(228,84,150,0.15),_transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(134,99,228,0.15),_transparent_40%)]"
      ></motion.div>

      {/* Pulsing color rings with Parallax */}
      <motion.div
        style={{ y: y1, willChange: "transform" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 blur-[150px] sm:blur-[180px] md:blur-[200px] opacity-40 top-[-10%] left-[-10%]"
      />
      <motion.div
        style={{ y: y2, willChange: "transform" }}
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] rounded-full bg-gradient-to-r from-purple-600 via-orange-400 to-pink-600 blur-[200px] sm:blur-[220px] md:blur-[250px] opacity-30 bottom-[-10%] right-[-10%]"
      />

      {/* Heading */}
      <Parallax y={[54, -54]} x={[-26, 26]}>
      <div className="relative inline-block mb-10 sm:mb-2 z-10 text-center px-4">
        {/* Stroke Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem]"
          style={{ WebkitTextStroke: "2px white", color: "black" }}
        >
          <ScrambleText text="CONTACT" />
        </motion.h1>

        {/* Fill Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          className="relative font-extrabold text-5xl sm:text-6xl md:text-[8rem] lg:text-[11rem] xl:text-[14rem]"
          style={{
            backgroundImage:
              "linear-gradient(270deg, #E45496, #8663E4, #EF7B2D, #E45496)",
            backgroundSize: "400% 400%",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          <ScrambleText text="CONTACT" delay={400} />
        </motion.h1>
      </div>
      </Parallax>


      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-[95%] max-w-7xl gap-12 mt-12">
        {/* 3D Contact Card */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <ContactCard />
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full lg:w-1/2 rounded-panel p-6 sm:p-8 md:p-10 bg-white/[0.04] border border-white/[0.08] shadow-e3 hover:border-white/[0.16] transition-colors duration-500"
        >
          <form ref={form} onSubmit={sendEmail} className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <label className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-400">Your Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full mt-2.5 px-4 py-3 text-[15px] text-white rounded-card border border-white/[0.09] bg-white/[0.03] placeholder:text-gray-600 focus:border-pink-500/70 focus:bg-white/[0.05] focus:ring-0 outline-none transition-all duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <label className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-400">Your Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full mt-2.5 px-4 py-3 text-[15px] text-white rounded-card border border-white/[0.09] bg-white/[0.03] placeholder:text-gray-600 focus:border-purple-500/70 focus:bg-white/[0.05] focus:ring-0 outline-none transition-all duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <label className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-400">Message</label>
              <textarea
                name="message"
                rows="4"
                required
                className="w-full mt-2.5 px-4 py-3 text-[15px] text-white rounded-card border border-white/[0.09] bg-white/[0.03] placeholder:text-gray-600 focus:border-orange-500/70 focus:bg-white/[0.05] focus:ring-0 outline-none transition-all duration-300"
              ></textarea>
            </motion.div>

            <Magnetic intensity={0.2}>
              <motion.button
                whileHover={{
                  scale: 1.015,
                  transition: { duration: 0.35, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === "sending"}
                className="relative w-full py-3.5 text-[13px] font-bold uppercase tracking-[0.16em] text-white px-6 rounded-full overflow-hidden transition-all duration-500"
              >
                {/* Gradient background */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-pink-600 via-purple-600 to-orange-500"></span>
                {/* Overlay border */}
                
                {/* Button text */}
                <span className="relative z-10">
                  {status === "sending"
                    ? "Sending\u2026"
                    : status === "sent"
                    ? "Message sent \u2713"
                    : "Send message"}
                </span>
              </motion.button>
            </Magnetic>

            {(status === "error" || status === "sent") && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[13px] leading-relaxed ${
                  status === "error" ? "text-pink-400" : "text-emerald-400"
                }`}
              >
                {status === "error"
                  ? error
                  : "Thanks \u2014 that reached me. I'll reply from chiragchhabrahmo@gmail.com."}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        className="mt-12 text-gray-400 text-sm sm:text-base z-10 tracking-wide px-4 text-center"
      >
        © 2026 Chirag Chhabra — Bengaluru, India
      </motion.p>
    </section>
  );
};

export default Contact;
