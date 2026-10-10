import React, { useEffect, useState } from "react";

/* A router in twenty lines. Four routes do not need a library: the path is
   state, pushState changes it, popstate (the back button) changes it too. */

const EVENT = "app:navigate";

export const currentPath = () =>
  typeof window === "undefined" ? "/" : window.location.pathname.replace(/\/+$/, "") || "/";

export const navigate = (to, { replace = false } = {}) => {
  if (typeof window === "undefined") return;
  if (to === currentPath() + window.location.hash) return;
  window.history[replace ? "replaceState" : "pushState"](null, "", to);
  window.dispatchEvent(new Event(EVENT));
};

export const usePath = (forced) => {
  const [path, setPath] = useState(forced || currentPath());
  useEffect(() => {
    const update = () => setPath(currentPath());
    window.addEventListener(EVENT, update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  return forced || path;
};

/* An ordinary anchor that navigates in place on a plain left click, and
   behaves like a normal link for middle-click, cmd-click and crawlers. */
export const Link = ({ href, onClick, children, ...rest }) => {
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    e.preventDefault();
    navigate(href);
    const hash = href.split("#")[1];
    requestAnimationFrame(() => {
      const target = hash && document.getElementById(hash);
      if (target) target.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
};
