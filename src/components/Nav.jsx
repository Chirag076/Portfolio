import React, { useEffect, useState, useCallback } from "react";
import { IDENTITY, NAV } from "../data/site";
import { getTheme, toggleTheme } from "../lib/theme";
import { usePortfolio } from "../context/PortfolioContext";

const SunMoon = ({ dark }) =>
  dark ? (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ) : (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );

const Nav = () => {
  const { setShowResume } = usePortfolio();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setDark(getTheme() === "dark"), []);

  /* the bar steps out of the way while you read down, and comes back the
     moment you scroll up */
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > last && y > 160 && !open);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = useCallback((e, id) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const onToggleTheme = () => setDark(toggleTheme() === "dark");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-transform duration-500 ease-expo ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas t-mono"
      >
        Skip to content
      </a>
      <div
        className={`transition-colors duration-500 ${scrolled || open ? "bg-canvas/85 backdrop-blur-md border-b hairline" : "border-b border-transparent"}`}
      >
        <div className="wrap flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => go(e, "top")}
            className="group flex items-center gap-3 t-mono-xs text-ink"
          >
            <span className="dot" aria-hidden="true" />
            <span className="hidden sm:inline">
              {IDENTITY.name} · {IDENTITY.role} · {IDENTITY.tagline}
            </span>
            <span className="sm:hidden">{IDENTITY.name}</span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => go(e, l.id)}
                className="t-mono-xs rounded-full px-3 py-2 text-ink-2 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setShowResume(true)}
              className="t-mono-xs rounded-full px-3 py-2 text-ink-2 transition-colors hover:text-ink"
            >
              Résumé
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              className="ml-2 grid h-9 w-9 place-items-center rounded-full border hairline text-ink transition-colors hover:bg-surface"
            >
              <SunMoon dark={dark} />
            </button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              className="grid h-9 w-9 place-items-center rounded-full border hairline text-ink"
            >
              <SunMoon dark={dark} />
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="t-mono-xs flex h-9 items-center gap-2 rounded-full border hairline px-3 text-ink"
            >
              <span aria-hidden="true">{open ? "✕" : "☰"}</span>
              <span>{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="wrap border-t hairline pb-6 pt-2 md:hidden"
          >
            {NAV.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => go(e, l.id)}
                className="flex items-center justify-between border-b hairline py-4 text-ink"
              >
                <span className="t-display-sm">{l.label}</span>
                <span className="t-mono-xs text-ink-3">{"→"}</span>
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowResume(true);
              }}
              className="flex w-full items-center justify-between border-b hairline py-4 text-ink"
            >
              <span className="t-display-sm">Résumé</span>
              <span className="t-mono-xs text-ink-3">PDF</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Nav;
