import { motion } from "framer-motion";
import { useState } from "react";

const AdminLogin = () => {
  const [error, setError] = useState("");

  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username !== "admin") {
      setError("Invalid username ❌");
      return;
    }

    if (!password && !twoFactorCode) {
      setError("Please enter Password or 2FA Code 🔑");
      return;
    }

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password, 
          twoFactorCode,
          content: {} 
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("admin-auth", "true");
        if (password) localStorage.setItem("admin-password", password);
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.error || "Invalid credentials ❌");
      }
    } catch (err) {
      setError("Server error ❌ Check connection.");
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex justify-center items-center overflow-hidden">

      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(228,84,150,0.2),_transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(134,99,228,0.2),_transparent_45%)]"
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
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full mt-2 p-3 text-lg rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <span className="text-[10px] text-gray-400">OR Use 2FA Below</span>
            </div>
            <input
              type="password"
              name="password"
              className="w-full mt-2 p-3 text-lg rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all outline-none"
            />
          </motion.div>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* 2FA Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <label className="text-sm font-bold text-pink-600 uppercase tracking-widest flex items-center gap-2">
              <span>📱</span> 2FA Code
            </label>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              className="w-full mt-2 p-3 text-2xl tracking-[0.5em] text-center font-black rounded-xl border-2 border-pink-500 bg-pink-50 focus:ring-4 focus:ring-pink-100 transition-all outline-none"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileHover={{
              scale: 1.03,
              translateX: -6,
              translateY: 8,
              rotate: -1,
              boxShadow: "15px 15px 40px rgba(239,123,45,0.6)",
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
