import React, { useEffect, useRef, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { PROJECT_META } from "../data/site";
import { Link } from "../lib/router";
import ProjectArt, { ART_COLORS } from "./ProjectArt";

/* The right-hand side of the hero: three project covers fanned like cards.
   They are real links into the case studies, they tilt a little with the
   pointer, and they drift on a slow idle loop. Transform-only, so it costs
   nothing at load; hidden below the lg breakpoint where the hero is one
   column. */
const HeroStack = () => {
  const { projects } = usePortfolio();
  const ref = useRef(null);
  /* not part of the pre-rendered HTML: phones never download or parse it,
     and wide screens get it a moment after the text, fading in */
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const cards = projects
    .map((p) => ({ p, meta: PROJECT_META[p.title] }))
    .filter(({ meta }) => meta?.art && meta?.slug)
    .slice(0, 3);

  useEffect(() => {
    const el = ref.current;
    if (!wide || !el || !window.matchMedia("(pointer: fine)").matches)
      return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const hero = el.closest("section") || el;
    let raf = 0;
    let px = 0,
      py = 0;
    const apply = () => {
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
      raf = 0;
    };
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [wide]);

  if (!wide || cards.length === 0) return null;

  return (
    <div ref={ref} className="stack" aria-label="Selected work">
      {cards.map(({ p, meta }, i) => (
        <div key={p.id || p.title} className="stack-item" style={{ "--i": i }}>
          <Link
            href={`/work/${meta.slug}`}
            data-cursor="open"
            className="stack-card"
            aria-label={`${p.title} — open the case study`}
          >
            <ProjectArt kind={meta.art} color={ART_COLORS[meta.art]} />
          </Link>
          <span className="stack-label t-mono-xs" aria-hidden="true">
            <span className="text-ink-3">{String(i + 1).padStart(2, "0")}</span>{" "}
            {p.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default HeroStack;
