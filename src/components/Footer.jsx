import React, { useEffect, useState } from "react";
import { IDENTITY } from "../data/site";
import { useIST } from "./About";

const Footer = () => {
  const time = useIST();
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  const top = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="wrap mt-16 border-t hairline py-8">
      <div className="t-mono-xs flex flex-col gap-4 text-ink-3 md:flex-row md:items-center md:justify-between">
        <div>
          © {year} {IDENTITY.name} · {IDENTITY.location} ·{" "}
          <span className="tabular-nums">
            {time} {IDENTITY.timezone}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span>Built with React · Tailwind · self-hosted type</span>
          <a href="#top" onClick={top} className="link-u text-ink">
            {"↑"} Top
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
