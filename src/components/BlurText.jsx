import { motion } from "framer-motion";

const BlurText = ({ text, delay = 0, direction = "top", className }) => {
  const words = text.split(" ");

  const variants = {
    hidden: { opacity: 0, y: direction === "top" ? 20 : -20, filter: "blur(4px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.05 + delay / 1000, duration: 0.5 },
    }),
  };

  return (
    <p className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.8 }}
          variants={variants}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
