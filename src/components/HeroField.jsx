import React, { useEffect, useRef } from "react";

/* A field of ink points behind the hero. Every point is a tiny spring: it
   wants to sit on a slowly rolling wave, the pointer shoves it off with a
   force that grows with how fast you move, and it swings back with a little
   overshoot — so a flick of the mouse leaves a wake that settles over a
   second or so. A click drops a ripple. Points that are moving or near the
   pointer get brighter and bigger. One 2D canvas, drawn only while the hero
   is on screen and the tab is visible; a still frame on phones and for
   people who prefer reduced motion. Client-only, so the pre-rendered first
   paint never changes. */
const HeroField = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const hero = canvas.closest("section") || canvas.parentElement;
    const ctx = canvas.getContext("2d", { alpha: true });
    const fine = window.matchMedia("(pointer: fine)").matches;
    /* nothing at all on phones and tablets (the hero is one column there);
       a single still frame for people who prefer reduced motion */
    if (!window.matchMedia("(min-width: 1024px)").matches) return undefined;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0,
      h = 0,
      dpr = 1,
      floor = 0, // where the stats strip starts; the field stays above it
      ceil = 0; // the bottom of the nav; the field stays below it
    let pts = [];
    let ripples = [];
    let raf = 0;
    let running = false;
    let last = performance.now();
    const t0 = last;
    let mx = -1e4,
      my = -1e4,
      pmx = -1e4,
      pmy = -1e4,
      mvx = 0,
      mvy = 0,
      speed = 0;
    let inkColor = "#111";

    const readInk = () => {
      inkColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--ink")
          .trim() || "#111";
    };

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
      const dl = hero.querySelector("dl");
      floor = dl ? dl.getBoundingClientRect().top - r.top : h * 0.84;
      const rootStyle = getComputedStyle(document.documentElement);
      const navH = rootStyle.getPropertyValue("--nav-h").trim();
      ceil =
        (navH.endsWith("rem")
          ? parseFloat(navH) * parseFloat(rootStyle.fontSize)
          : parseFloat(navH)) || 72;
      const gap = w > 1400 ? 26 : 22;
      pts = [];
      for (let y = gap; y < h; y += gap) {
        for (let x = gap; x < w; x += gap) {
          pts.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            s: 0.85 + ((x * 7 + y * 13) % 11) / 10,
          });
        }
      }
    };

    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;
      const k = 7.5; // spring stiffness
      const damp = Math.exp(-dt * 5.2);
      const R = 240; // pointer reach
      const push = 60 + Math.min(220, speed * 0.35); // faster pointer, bigger shove
      /* the whole field leans a little toward the pointer */
      const lx = mx > -1e3 ? (mx / w - 0.5) * 14 : 0;
      const ly = my > -1e3 ? (my / h - 0.5) * 10 : 0;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        /* where the wave wants this point */
        const wave =
          Math.sin(p.ox * 0.012 + t * 0.9) * Math.cos(p.oy * 0.014 - t * 0.7);
        const tx = p.ox + wave * 9 + Math.sin(p.oy * 0.02 + t * 0.5) * 4 + lx;
        const ty = p.oy + Math.cos(p.ox * 0.009 + t * 0.8) * 8 + ly;
        /* spring back toward it */
        let ax = (tx - p.x) * k;
        let ay = (ty - p.y) * k;
        /* the pointer shoves, in the direction it is moving plus straight away */
        const dx = p.x - mx,
          dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        let near = 0;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          near = 1 - d / R;
          const f = near * near * push;
          ax += (dx / d) * f * 9 + mvx * near * 1.6;
          ay += (dy / d) * f * 9 + mvy * near * 1.6;
        }
        /* ripples from clicks: an expanding ring that shoves outward as it passes */
        for (let r = 0; r < ripples.length; r++) {
          const rp = ripples[r];
          const age = (now - rp.t) / 1000;
          const radius = age * 520;
          const rdx = p.x - rp.x,
            rdy = p.y - rp.y;
          const rd = Math.sqrt(rdx * rdx + rdy * rdy) || 1;
          const band = Math.abs(rd - radius);
          if (band < 60) {
            const f = (1 - band / 60) * (1 - Math.min(1, age / 1.4)) * 1400;
            ax += (rdx / rd) * f;
            ay += (rdy / rd) * f;
            near = Math.max(near, (1 - band / 60) * 0.6);
          }
        }
        p.vx = (p.vx + ax * dt) * damp;
        p.vy = (p.vy + ay * dt) * damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.near = near;
        p.wave = wave;
      }
      ripples = ripples.filter((rp) => now - rp.t < 1400);
      /* pointer velocity decays when it stops */
      mvx *= 0.82;
      mvy *= 0.82;
      speed *= 0.86;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = inkColor;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        /* brighter on the right, where there is room; quiet under the headline.
           Measured where the point is now, not where it rests, so a point
           shoved toward the stats strip or the nav fades out before it gets
           there and never sits on top of the numbers */
        const fx = Math.min(1, Math.max(0.06, (p.x / w - 0.28) * 1.5));
        const fy =
          Math.max(0, Math.min(1, (floor - 36 - p.y) / 90)) *
          Math.max(0, Math.min(1, (p.y - ceil) / 60));
        if (fy <= 0) continue;
        const v = Math.min(1, (Math.abs(p.vx) + Math.abs(p.vy)) / 260);
        const wave = p.wave || 0;
        const near = p.near || 0;
        /* the reaction to the pointer still shows under the text, just softer */
        const a = Math.min(
          0.95,
          ((0.1 + (wave + 1) * 0.2) * fx +
            (near * 0.55 + v * 0.35) * Math.max(fx, 0.3)) *
            fy,
        );
        const r = p.s * (0.9 + (wave + 1) * 0.45) + near * 2.2 + v * 1.2;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      step(now);
      draw();
      raf = running ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (running || still) return;
      running = true;
      last = performance.now();
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    readInk();
    layout();
    step(performance.now());
    draw();

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0.05 },
    );
    io.observe(hero);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => {
      layout();
      step(performance.now());
      draw();
    };
    window.addEventListener("resize", onResize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left,
        ny = e.clientY - r.top;
      if (pmx > -1e3) {
        mvx = (nx - pmx) * 18;
        mvy = (ny - pmy) * 18;
        speed = Math.min(2400, Math.hypot(nx - pmx, ny - pmy) * 60);
      }
      pmx = mx = nx;
      pmy = my = ny;
    };
    const onLeave = () => {
      mx = my = pmx = pmy = -1e4;
      mvx = mvy = speed = 0;
    };
    const onDown = (e) => {
      const r = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        t: performance.now(),
      });
      if (ripples.length > 4) ripples.shift();
    };
    if (fine && !still) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
      hero.addEventListener("pointerdown", onDown, { passive: true });
    }
    /* re-ink when the theme flips */
    const mo = new MutationObserver(() => {
      readInk();
      if (!running) draw();
    });
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
      hero.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
};

export default HeroField;
