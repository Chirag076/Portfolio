import React, { useEffect, useState } from "react";
import { ABOUT, IDENTITY } from "../data/site";
import { SectionHeader } from "./ui";

/* a clock in my timezone, so a recruiter abroad knows when a reply will come */
export const useIST = () => {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return t;
};

const Row = ({ label, children }) => (
  <div className="border-t hairline py-4">
    <div className="t-mono-xs text-ink-3">{label}</div>
    <div className="mt-1.5 text-[15px] text-ink">{children}</div>
  </div>
);

const About = () => {
  const time = useIST();
  return (
    <section
      id="about"
      className="wrap scroll-mt-24 py-24 md:py-32"
      aria-labelledby="about-title"
    >
      <SectionHeader id="about-title" eyebrow="About" title={ABOUT.heading} />

      <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <aside className="md:col-span-4 reveal">
          <div className="rounded-2xl border hairline bg-surface p-6 md:p-7">
            <div className="t-mono-xs flex items-center justify-between text-ink-3">
              <span>A note to myself</span>
              <span className="tabular-nums">
                {time} {IDENTITY.timezone}
              </span>
            </div>
            <blockquote className="serif-italic mt-5 text-[1.5rem] leading-[1.2] text-ink">
              “{ABOUT.quote}”
            </blockquote>
            <div className="mt-8">
              <Row label="Based in">{IDENTITY.location} · open to relocate</Row>
              <Row label="Status">
                <span className="inline-flex items-center gap-2">
                  <span className="dot" aria-hidden="true" />
                  {ABOUT.status}
                </span>
              </Row>
              <Row label="Reply time">Within a day, usually faster</Row>
            </div>
          </div>
        </aside>

        <div className="md:col-span-7 md:col-start-6">
          {ABOUT.paragraphs.map((p, i) => (
            <p
              key={i}
              className={`t-lede max-w-[32em] text-ink-2 reveal ${i ? "mt-6" : ""}`}
            >
              {p}
            </p>
          ))}

          <div className="mt-12 border-t hairline pt-8 reveal">
            <div className="t-mono-xs text-ink-3">Now</div>
            <ul className="mt-4 flex flex-col gap-3">
              {ABOUT.now.map((n) => (
                <li
                  key={n}
                  className="flex gap-4 text-[16px] leading-relaxed text-ink"
                >
                  <span
                    className="t-mono-xs mt-[7px] text-ink-3"
                    aria-hidden="true"
                  >
                    {"→"}
                  </span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
