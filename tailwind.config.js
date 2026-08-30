/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Halfway between the original neon and a fully muted pass: keeps the
           punch, loses the vibration. Hues untouched. */
        pink:   { 400: "#EC7EAE", 500: "#E45496", 600: "#CF3979" },
        purple: { 400: "#A48FED", 500: "#8663E4", 600: "#7546D9" },
        orange: { 400: "#F5994F", 500: "#EF7B2D", 600: "#DC621E" },
      },
      borderRadius: { card: "18px", panel: "26px" },
      boxShadow: {
        e1: "0 1px 2px rgba(0,0,0,.55), 0 4px 12px -4px rgba(0,0,0,.5)",
        e2: "0 2px 4px rgba(0,0,0,.6), 0 12px 28px -10px rgba(0,0,0,.65), 0 40px 80px -40px rgba(0,0,0,.8)",
        e3: "0 4px 8px rgba(0,0,0,.65), 0 24px 50px -18px rgba(0,0,0,.7), 0 70px 120px -60px rgba(0,0,0,.9)",
      },
    },
  },
  plugins: [],
};
