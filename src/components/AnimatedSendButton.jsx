import { useState } from "react";
import { motion } from "framer-motion";

const AnimatedSendButton = ({ onClick }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending delay
    await new Promise((res) => setTimeout(res, 1500));

    setSending(false);
    setSent(true);

    if (onClick) onClick();
    setTimeout(() => setSent(false), 2000); // reset after 2s
  };

  return (
    <motion.button
      type="submit"
      onClick={handleClick}
      className="relative w-full py-3 sm:py-4 text-lg sm:text-xl font-extrabold uppercase text-white px-6 sm:px-8 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {!sending && !sent && <span className="relative z-10">Send Message ✉️</span>}

      {/* Sending animation */}
      {sending && (
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          <motion.span
            className="animate-bounce text-white text-lg sm:text-xl"
          >
            📤
          </motion.span>
        </motion.div>
      )}

      {/* Sent confirmation */}
      {sent && (
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          ✅ Sent!
        </motion.div>
      )}
    </motion.button>
  );
};

export default AnimatedSendButton;
