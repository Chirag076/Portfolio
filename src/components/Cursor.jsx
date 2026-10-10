import React, { useEffect, useRef } from "react";

/* A custom cursor, only where it makes sense: a mouse or trackpad, no
   reduced-motion preference. It is a small ink dot with a ring that lags a
   little behind, grows over links and buttons, turns into a labelled disc
   over anything marked data-cursor="open", and becomes a thin bar over text
   fields. Everything is a transform on a fixed element, so it never causes
   layout or paint work. The native cursor is hidden only while this one is
   visible, and touch devices never see any of it. */

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const root = document.documentElement;
    if (!dot || !ring) return undefined;

    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    let visible = false;
    let mode = "";

    const setMode = (next, text = "") => {
      if (next === mode && label.textContent === text) return;
      mode = next;
      root.dataset.cursorMode = next;
      label.textContent = text;
    };

    const frame = () => {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) raf = requestAnimationFrame(frame);
      else raf = 0;
    };

    const show = () => {
      if (visible) return;
      visible = true;
      root.classList.add("cursor-on");
    };
    const hide = () => {
      visible = false;
      root.classList.remove("cursor-on");
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      show();
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const open = t.closest("[data-cursor]");
      if (open) return setMode("open", open.dataset.cursor === "open" ? "Open" : open.dataset.cursor);
      if (t.closest("input, textarea, [contenteditable]")) return setMode("text");
      if (t.closest("a, button, label, [role=button], summary")) return setMode("link");
      setMode("");
    };

    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeave = (e) => {
      if (!e.relatedTarget && !e.toElement) hide();
    };

    /* the page under a still pointer can change (a click navigated); reset */
    const onNavigate = () => setMode("");
    window.addEventListener("app:navigate", onNavigate);
    window.addEventListener("popstate", onNavigate);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onLeave);
    document.addEventListener("mouseenter", show);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(raf);
      hide();
      delete root.dataset.cursorMode;
      window.removeEventListener("app:navigate", onNavigate);
      window.removeEventListener("popstate", onNavigate);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("mouseenter", show);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label t-mono-xs" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};

export default Cursor;
