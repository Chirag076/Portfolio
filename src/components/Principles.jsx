import React from "react";
import { PRINCIPLES } from "../data/site";
import { SectionHeader } from "./ui";

const Principles = () => (
  <section
    id="principles"
    className="bg-canvas-2 py-24 md:py-32"
    aria-labelledby="principles-title"
  >
    <div className="wrap">
      <SectionHeader
        id="principles-title"
        eyebrow="How I work"
        title="Four rules I keep, because each one cost me something once."
      />

      <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border hairline bg-line md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <li key={p.n} className="bg-canvas-2 p-7 md:p-9 reveal">
            <div className="t-mono-xs text-ink-3">{p.n}</div>
            <h3 className="t-display-sm mt-3 text-ink">{p.title}</h3>
            <p className="serif-italic mt-2 text-[1.35rem] leading-tight text-ink-2">
              {p.sub}
            </p>
            <p className="t-body mt-5 max-w-[34em] text-ink-2">{p.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Principles;
