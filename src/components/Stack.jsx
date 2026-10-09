import React from "react";
import { STACK } from "../data/site";
import { SectionHeader } from "./ui";

const Stack = () => (
  <section
    id="stack"
    className="wrap scroll-mt-24 py-24 md:py-32"
    aria-labelledby="stack-title"
  >
    <SectionHeader
      id="stack-title"
      eyebrow="Stack · what I reach for"
      title="Tools I have used in production, not just in a tutorial."
      aside="Grouped by the job they do. Nothing here is on the list because it was fashionable; each one has shipped something that people use."
    />

    <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
      {STACK.map((g) => (
        <div key={g.group} className="border-t hairline pt-6 reveal">
          <h3 className="t-display-sm text-ink">{g.group}</h3>
          <p className="t-body mt-2 max-w-[28em] text-ink-2">{g.blurb}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {g.tools.map((t) => (
              <li key={t} className="pill">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default Stack;
