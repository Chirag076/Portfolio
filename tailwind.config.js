/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      /* Every colour is a CSS variable so the light and dark themes are one
         stylesheet and a class flip — no second palette to keep in sync. */
      colors: {
        canvas: "var(--canvas)",
        "canvas-2": "var(--canvas-2)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        up: "var(--up)",
        down: "var(--down)",
        "up-text": "var(--up-text)",
        "down-text": "var(--down-text)",
      },
      fontFamily: {
        sans: ["Geist", "Geist Fallback", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "Geist Mono Fallback", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        serif: ["Instrument Serif", "Instrument Serif Fallback", "Iowan Old Style", "Times New Roman", "serif"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(.16, 1, .3, 1)",
      },
      maxWidth: {
        wrap: "1680px",
      },
    },
  },
  plugins: [],
};
