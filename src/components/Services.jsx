import { motion } from "framer-motion";
import BlurText from "./BlurText";

const services = [
  {
    id: "01",
    title: "Full-Stack Development",
    description:
      "I design and develop complete web solutions — from modern frontends to robust backends, ensuring seamless integration and performance.",
  },
  {
    id: "02",
    title: "App Development",
    description:
      "I build fast, responsive, and user-friendly mobile apps using React Native and modern APIs for a smooth cross-platform experience.",
  },
  {
    id: "03",
    title: "DevOps & Deployment",
    description:
      "I automate workflows, manage cloud deployments, and optimize CI/CD pipelines to keep applications reliable and scalable.",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="relative w-full bg-black text-white py-24 flex flex-col items-center overflow-hidden"
    >
      {/* Heading */}
      <div className="relative inline-block mb-20 z-10 text-center">
        {/* Stroke Layer */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.9 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 font-extrabold text-6xl sm:text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[13rem] text-white"
          style={{
            WebkitTextStroke: "2px white",
            color: "black",
          }}
        >
          SERVICES
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
          SERVICES
        </motion.h1>
      </div>


      {/* Service List */}
      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 w-[90%] max-w-6xl z-10">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
            whileHover={{
              scale: 1.03,
              y: -10,
              boxShadow: "0px 0px 80px rgba(255,255,255,0.25)",
            }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 md:gap-10 bg-white text-black rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500"
          >
            {/* Big Number */}
            <motion.div
              className="text-4xl sm:text-5xl md:text-[8rem] lg:text-[10rem] font-extrabold opacity-10 leading-none md:w-1/3 text-center select-none"
              whileHover={{ opacity: 0.2, scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              {service.id}
            </motion.div>

            {/* Content */}
            <motion.div
              className="md:w-2/3 text-left"
              whileHover={{ x: 5 }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <BlurText
                text={service.title}
                delay={100}
                animateBy="words"
                direction="top"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              />
              <motion.p
                className="text-base sm:text-lg md:text-2xl text-gray-700 leading-relaxed"
                whileHover={{ color: "#111", transition: { duration: 0.4 } }}
              >
                {service.description}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
