import React, { Suspense, lazy, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { PROJECT_META } from "../data/site";
import { Link } from "../lib/router";
import ProjectArt, { ART_COLORS } from "./ProjectArt";
import { SectionHeader, Tag, Ext } from "./ui";

const EnginePanel = lazy(() => import("./EnginePanel"));

/* a project card: index, kicker, title, serif headline, blurb, tags, links
   and an illustrated cover. Title and cover open the case study. */
const Card = ({ project, index }) => {
  const meta = PROJECT_META[project.title] || {
    kicker: "Project",
    headline: "",
    tags: [],
    links: [],
  };
  const [engineOpen, setEngineOpen] = useState(false);
  const n = String(index + 1).padStart(2, "0");
  const flip = index % 2 === 1;
  const href = meta.slug ? `/work/${meta.slug}` : null;
  const p = ART_COLORS[meta.art] || "var(--accent)";
  const links = meta.links?.length
    ? meta.links
    : project.link
      ? [{ label: "GitHub", href: project.link }]
      : [];

  let cover = null;
  if (project.image && project.image !== "" && !meta.art) {
    cover = (
      <img
        src={project.image}
        alt={`${project.title} screenshot`}
        width="1200"
        height="675"
        loading="lazy"
        decoding="async"
        className="aspect-[16/9] w-full object-cover"
      />
    );
  } else if (meta.art) {
    cover = <ProjectArt kind={meta.art} color={p} title={project.title} />;
  }

  const Title = href ? Link : "span";

  return (
    <article
      className="border-t hairline py-12 md:py-16"
      aria-labelledby={`project-${n}`}
      style={{ "--p": p }}
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div
          className={`min-w-0 md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}
        >
          <div className="t-mono-xs flex items-center gap-4 text-ink-3 reveal">
            <span>{n}</span>
            <span className="h-px w-10 bg-line-2" aria-hidden="true" />
            <span>{meta.kicker}</span>
            {href && (
              <>
                <span className="ml-auto hidden sm:inline">Case study</span>
                <span className="arr hidden sm:inline" aria-hidden="true">
                  {"→"}
                </span>
              </>
            )}
          </div>
          <h3 id={`project-${n}`} className="t-display-lg mt-6 text-ink reveal">
            <Title
              {...(href ? { href } : {})}
              className="transition-colors duration-500 hover:text-[color:var(--p)] hover:underline hover:decoration-[color:var(--p)] hover:decoration-[0.04em] hover:underline-offset-[0.12em]"
            >
              {project.title}
            </Title>
          </h3>
          {meta.headline && (
            <p className="serif-italic mt-3 text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.05] text-ink-2 reveal reveal-d1">
              {meta.headline}
            </p>
          )}
          <p className="t-body mt-6 max-w-[30em] text-ink-2 reveal reveal-d1">
            {project.description}
          </p>
          {meta.tags?.length > 0 && (
            <ul
              className="mt-6 flex flex-wrap gap-2 reveal reveal-d2"
              aria-label="Built with"
            >
              {meta.tags.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 reveal reveal-d2">
            {href && (
              <Link href={href} className="arrow-link t-mono text-ink">
                <span className="link-u">Read the case study</span>
                <span className="arr" aria-hidden="true">
                  {"→"}
                </span>
              </Link>
            )}
            {links.map((l) => (
              <Ext key={l.href} href={l.href}>
                {l.label}
              </Ext>
            ))}
            {meta.engine && (
              <button
                type="button"
                onClick={() => setEngineOpen((o) => !o)}
                aria-expanded={engineOpen}
                aria-controls={`engine-${n}`}
                className="arrow-link t-mono text-ink"
              >
                <span className="link-u">
                  {engineOpen ? "Hide the engine" : "Run the engine live"}
                </span>
                <span className="arr" aria-hidden="true">
                  {engineOpen ? "↑" : "↓"}
                </span>
              </button>
            )}
          </div>
        </div>

        {cover && (
          <div
            className={`min-w-0 md:col-span-7 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-6"} reveal reveal-d1`}
          >
            {href ? (
              <div className="group relative overflow-hidden rounded-2xl border hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_60px_-30px_rgba(0,0,0,.35)] transition-transform duration-700 ease-expo hover:-translate-y-1">
                <div className="transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.03]">
                  {cover}
                </div>
                {/* a plain overlay link, so the art's labels are not its text */}
                <Link
                  href={href}
                  data-cursor="open"
                  aria-label={`Open the ${project.title} case study`}
                  className="absolute inset-0"
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_60px_-30px_rgba(0,0,0,.35)]">
                {cover}
              </div>
            )}
          </div>
        )}
      </div>

      {meta.engine && engineOpen && (
        <div id={`engine-${n}`} className="mt-10 border-t hairline pt-8">
          <Suspense
            fallback={
              <div className="t-mono-xs py-10 text-ink-3">
                Loading the matching engine…
              </div>
            }
          >
            <EnginePanel />
          </Suspense>
        </div>
      )}
    </article>
  );
};

const Work = () => {
  const { projects } = usePortfolio();
  const count = String(projects.length).padStart(2, "0");

  return (
    <section id="work" className="wrap scroll-mt-24 pb-10 pt-24 md:pt-32">
      <SectionHeader
        eyebrow={`Selected work · 01–${count}`}
        title="Four builds, each with a number I can defend."
        aside="Each one is a full case study: the problem, what I built, the architecture, the hard parts, and the proof. The exchange's matching engine runs right here, on your CPU."
      />

      <nav
        aria-label="Projects"
        className="no-scrollbar mt-10 flex gap-3 overflow-x-auto py-2"
      >
        {projects.map((p, i) => (
          <a
            key={p.id || p.title}
            href={`#project-${String(i + 1).padStart(2, "0")}`}
            className="pill t-mono-xs shrink-0"
          >
            <span className="text-ink-3">{String(i + 1).padStart(2, "0")}</span>{" "}
            {p.title}
          </a>
        ))}
      </nav>

      <div className="mt-8">
        {projects.map((p, i) => (
          <Card key={p.id || p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Work;
