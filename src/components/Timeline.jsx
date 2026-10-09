import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { EDUCATION, ROLE_PLACES } from "../data/site";
import { SectionHeader, Tag } from "./ui";

/* "Aug 2026 – Present" → "AUG 2026 — PRESENT" */
const when = (s = "") => s.replace(/\s*[–-]\s*/g, " — ");

const Entry = ({ date, org, role, where, description, tech = [] }) => (
  <li className="grid grid-cols-1 gap-4 border-t hairline py-8 md:grid-cols-12 md:gap-8 md:py-10 reveal">
    <div className="md:col-span-4">
      <div className="t-mono-xs text-ink-3">{date}</div>
      <h3 className="t-display-sm mt-3 text-ink">{org}</h3>
      <div className="mt-1 text-[15px] text-ink-2">{role}</div>
      {where && <div className="t-mono-xs mt-2 text-ink-3">{where}</div>}
    </div>
    <div className="md:col-span-7 md:col-start-6">
      <p className="t-body max-w-[36em] text-ink-2">{description}</p>
      {tech.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
          {tech.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
      )}
    </div>
  </li>
);

const Timeline = () => {
  const { experience } = usePortfolio();
  const roles = [...experience].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

  return (
    <section
      id="timeline"
      className="wrap scroll-mt-24 py-24 md:py-32"
      aria-labelledby="timeline-title"
    >
      <SectionHeader
        id="timeline-title"
        eyebrow="Timeline"
        title="Three years, three teams, one thread."
        aside="From a first commit in a BCA lab to leading a team of four. The thread is the same every time: make it stay correct when real traffic shows up."
      />
      <ol className="mt-14">
        {roles.map((r) => (
          <Entry
            key={r.id ?? r.company}
            date={when(r.duration)}
            org={r.company}
            role={r.role}
            where={ROLE_PLACES[r.company]}
            description={r.description}
            tech={r.tech}
          />
        ))}
        <Entry
          date={when(EDUCATION.when)}
          org={EDUCATION.org}
          role={EDUCATION.role}
          where={EDUCATION.where}
          description={EDUCATION.description}
        />
      </ol>
    </section>
  );
};

export default Timeline;
