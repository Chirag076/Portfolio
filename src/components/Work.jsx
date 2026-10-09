import React, { Suspense, lazy, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { PROJECT_META, CHAT_MOCK } from "../data/site";
import { SectionHeader, Tag, Ext } from "./ui";

const EnginePanel = lazy(() => import("./EnginePanel"));

/* ---- visuals ----------------------------------------------------------- */

const Frame = ({ children, label }) => (
  <div className="relative overflow-hidden rounded-2xl border hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_60px_-30px_rgba(0,0,0,.35)]">
    {label && (
      <div className="flex items-center justify-between border-b hairline px-4 py-2.5">
        <span className="t-mono-xs text-ink-3">{label}</span>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
          <span className="h-2 w-2 rounded-full bg-line-2" />
        </span>
      </div>
    )}
    {children}
  </div>
);

const ChatMock = () => (
  <Frame label="Telegram · @salonConciergeBot">
    <ul
      className="flex flex-col gap-3 p-4 sm:p-5"
      aria-label="Example conversation with the booking agent"
    >
      {CHAT_MOCK.map((m, i) => (
        <li
          key={i}
          className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-snug ${
              m.from === "user"
                ? "rounded-br-sm bg-ink text-canvas"
                : "rounded-bl-sm bg-canvas-2 text-ink"
            }`}
          >
            {m.text}
          </div>
        </li>
      ))}
      <li className="mt-1 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.04em] text-ink-3">
        <span className="dot" aria-hidden="true" /> book_appointment(name,
        service, date, time) → id 42
      </li>
    </ul>
  </Frame>
);

const JsonMock = () => (
  <Frame label="POST /ask · askdocs-axen.onrender.com">
    <pre className="whitespace-pre-wrap break-words p-4 font-mono text-[12.5px] leading-relaxed text-ink-2 sm:p-5">
      <code>{`{
  "question": "What notice period does the contract require?",
  "answer": "30 days' written notice by either party (clause 7.2).",
  "sources": [
    { "file": "contract.pdf", "chunk": 14, "score": 0.81 }
  ]
}

// off-topic question → "I don't know." — never a guess`}</code>
    </pre>
    <div className="t-mono-xs flex items-center gap-2 border-t hairline px-4 py-2.5 text-ink-3">
      <span className="dot" aria-hidden="true" /> chunk → embed → ChromaDB →
      retrieve → answer
    </div>
  </Frame>
);

/* images live in /public/images as <name>.webp (1200 wide) with an optional
   <name>-800.webp for phones; the admin dashboard can upload new ones */
const ImageVisual = ({ src, small, alt }) => (
  <Frame>
    <img
      src={src}
      srcSet={small ? `${small} 800w, ${src} 1200w` : undefined}
      sizes="(min-width: 768px) 56vw, 100vw"
      alt={alt}
      width="1200"
      height="675"
      loading="lazy"
      decoding="async"
      className="aspect-[16/9] w-full object-cover"
    />
  </Frame>
);

/* ---- a card ------------------------------------------------------------ */

const Card = ({ project, index }) => {
  const meta = PROJECT_META[project.title] || {
    kicker: "Project",
    headline: "",
    tags: [],
    visual: project.image ? "image" : "none",
    links: [],
  };
  const [engineOpen, setEngineOpen] = useState(false);
  const n = String(index + 1).padStart(2, "0");
  const flip = index % 2 === 1;

  let visual = null;
  if (meta.visual === "chat") visual = <ChatMock />;
  else if (meta.visual === "json") visual = <JsonMock />;
  else if (meta.visual === "image" && project.image)
    visual = (
      <ImageVisual
        src={project.image}
        small={project.image === meta.image ? meta.imageSmall : undefined}
        alt={`${project.title} screenshot`}
      />
    );

  const links = meta.links.length
    ? meta.links
    : project.link
      ? [{ label: "GitHub", href: project.link }]
      : [];

  return (
    <article
      className="border-t hairline py-12 md:py-16"
      aria-labelledby={`project-${n}`}
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div
          className={`min-w-0 md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}
        >
          <div className="t-mono-xs flex items-center gap-4 text-ink-3 reveal">
            <span>{n}</span>
            <span className="h-px w-10 bg-line-2" aria-hidden="true" />
            <span>{meta.kicker}</span>
          </div>
          <h3 id={`project-${n}`} className="t-display-lg mt-6 text-ink reveal">
            {project.title}
          </h3>
          {meta.headline && (
            <p className="serif-italic mt-3 text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.05] text-ink-2 reveal reveal-d1">
              {meta.headline}
            </p>
          )}
          <p className="t-body mt-6 max-w-[30em] text-ink-2 reveal reveal-d1">
            {project.description}
          </p>
          {meta.tags.length > 0 && (
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
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 reveal reveal-d2">
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

        {visual && (
          <div
            className={`min-w-0 md:col-span-7 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-6"} reveal reveal-d1`}
          >
            {visual}
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

/* ---- the section ------------------------------------------------------- */

const Work = () => {
  const { projects } = usePortfolio();
  const count = String(projects.length).padStart(2, "0");

  return (
    <section id="work" className="wrap scroll-mt-24 pb-10 pt-24 md:pt-32">
      <SectionHeader
        eyebrow={`Selected work · 01–${count}`}
        title="Four builds, each with a number I can defend."
        aside="Every one has a repo you can run and a demo on request. The exchange's matching engine runs right here, on your CPU."
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
