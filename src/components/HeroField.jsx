import React, { useEffect, useRef } from "react";

/* Option B for the hero: a field of ink points across the whole hero that
   breathes like a slow swell and parts around the pointer. Drawn on one 2D
   canvas, only while the hero is on screen and the tab is visible; a static
   frame for people who prefer reduced motion. Client-only, so it never
   touches the pre-rendered HTML or the first paint. */
const HeroField = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const hero = canvas.closest("section") || canvas.parentElement;
    const ctx = canvas.getContext("2d", { alpha: true });
    /* animate only on wide screens without a reduced-motion preference;
       phones get one still frame, which costs nothing afterwards */
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(min-width: 1024px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let w = 0,
      h = 0,
      dpr = 1;
    let pts = [];
    let raf = 0;
    let running = false;
    let t0 = performance.now();
    let mx = -1e4,
      my = -1e4;

    const ink = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim() || "#111";

    const layout = () => {
      const r = hero.getBoundingClientRect();
      w = Math.round(r.width);
      h = Math.round(r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w > 1100 ? 24 : 22;
      pts = [];
      for (let y = gap; y < h; y += gap) {
        for (let x = gap; x < w; x += gap) {
          pts.push({
            x,
            y,
            ox: x,
            oy: y,
            s: 0.9 + ((x * 7 + y * 13) % 11) / 10,
          });
        }
      }
    };

    const draw = (now) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        /* two slow waves crossing; the right side of the hero is brighter so
           the field reads as a shape beside the headline, not a texture under it */
        const wave =
          Math.sin(p.ox * 0.011 + t * 0.6) * Math.cos(p.oy * 0.013 - t * 0.45);
        const fade = Math.min(1, Math.max(0.08, (p.ox / w - 0.3) * 1.6));
        let x = p.ox + wave * 6;
        let y = p.oy + Math.cos(p.ox * 0.008 + t * 0.5) * 5;
        /* the pointer pushes nearby points away */
        const dx = x - mx,
          dy = y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 160 * 160) {
          const d = Math.sqrt(d2) || 1;
          const k = (1 - d / 160) * 26;
          x += (dx / d) * k;
          y += (dy / d) * k;
        }
        const a = (0.1 + (wave + 1) * 0.22) * fade;
        const r = p.s * (0.9 + (wave + 1) * 0.5);
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      draw(now);
      raf = running ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    layout();
    draw(performance.now());

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0.05 },
    );
    io.observe(hero);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => {
      layout();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -1e4;
      my = -1e4;
    };
    if (fine) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
    }
    /* re-ink when the theme flips */
    const mo = new MutationObserver(() => draw(performance.now()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      stop();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
};

export default HeroField;
