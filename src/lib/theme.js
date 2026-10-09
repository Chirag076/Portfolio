/* Light is the default. The choice is remembered in localStorage and applied
   before first paint by the inline script in public/index.html. */
export const getTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

export const setTheme = (theme) => {
  const dark = theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0a0a0b" : "#f3f0e8");
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* private mode: the toggle still works for this visit */
  }
};

export const toggleTheme = () => {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
};
