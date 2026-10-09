import React from "react";
import { RECOMMENDATIONS } from "../data/site";
import { SectionHeader } from "./ui";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const Recommendations = () => (
  <section
    id="recommendations"
    className="bg-canvas-2 py-24 md:py-32"
    aria-labelledby="recs-title"
  >
    <div className="wrap">
      <SectionHeader
        id="recs-title"
        eyebrow="Recommendations"
        title="What the people I worked with say."
        aside="Both written on LinkedIn by people who saw the work up close: the co-founder who managed me at UnQue, and a client I built for."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {RECOMMENDATIONS.map((r) => (
          <figure
            key={r.name}
            className="flex flex-col rounded-2xl border hairline bg-surface p-7 md:p-9 reveal"
          >
            <blockquote className="t-body flex-1 text-ink-2">
              <span
                className="serif-italic block text-[2.4rem] leading-none text-ink-3"
                aria-hidden="true"
              >
                “
              </span>
              {r.text}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t hairline pt-6">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink font-mono text-[12px] text-canvas"
                aria-hidden="true"
              >
                {initials(r.name)}
              </span>
              <span>
                <span className="block text-[15px] text-ink">{r.name}</span>
                <span className="block text-[13px] text-ink-2">{r.role}</span>
                <span className="t-mono-xs mt-1 block text-ink-3">
                  {r.meta}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Recommendations;
