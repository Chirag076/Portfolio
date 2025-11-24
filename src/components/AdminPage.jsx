import { motion } from "framer-motion";
import { useState } from "react";

const AdminLogin = () => {
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    // SIMPLE DEMO LOGIN (replace with backend or Firebase later)
    if (username === "admin" && password === "1234") {
      localStorage.setItem("admin-auth", "true");
      window.location.href = "/admin/dashboard";
    } else {
      setError("Invalid credentials ❌");
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex justify-center items-center overflow-hidden">

      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.2),_transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.2),_transparent_45%)]"
      />

      {/* Pulse Rings */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[350px] h-[350px] bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 blur-[150px] rounded-full opacity-40 top-[10%] left-[5%]"
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute w-[450px] h-[450px] bg-gradient-to-r from-indigo-500 via-orange-400 to-pink-600 blur-[200px] rounded-full opacity-30 bottom-[10%] right-[5%]"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-md bg-white text-black rounded-3xl p-10 shadow-[0_0_30px_rgba(255,255,255,0.3)] backdrop-blur-md"
      >
        
        <h1 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <label className="text-lg font-bold text-gray-800">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full mt-2 p-3 text-lg rounded-xl border-2 border-gray-300 bg-white/90 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-500"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <label className="text-lg font-bold text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full mt-2 p-3 text-lg rounded-xl border-2 border-gray-300 bg-white/90 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 transition-all duration-500"
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileHover={{
              scale: 1.03,
              translateX: -6,
              translateY: 8,
              rotate: -1,
              boxShadow: "15px 15px 40px rgba(190,100,255,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="relative w-full py-4 text-xl font-extrabold uppercase text-white rounded-full overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-black via-purple-600 to-pink-500"></span>
            <span className="relative z-10">Login 🔐</span>
          </motion.button>
        </form>
      </motion.div>

    </section>
  );
};

export default AdminLogin;
