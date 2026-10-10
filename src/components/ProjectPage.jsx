import React, { Suspense, lazy, useEffect, useState } from "react";
import { CASE_STUDIES, CASE_STUDY_ORDER } from "../data/caseStudies";
import { IDENTITY } from "../data/site";
import { usePortfolio } from "../context/PortfolioContext";
import { getTheme, toggleTheme } from "../lib/theme";
import { Link } from "../lib/router";
import useReveal from "../hooks/useReveal";
import ProjectArt, { ART_COLORS } from "./ProjectArt";
import { SunMoon } from "./Nav";
import { Ext, Tag } from "./ui";
import Footer from "./Footer";

const EnginePanel = lazy(() => import("./EnginePanel"));

const Diagram = ({ steps, p }) => (
  <ol className="my-8 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0" aria-label="Architecture">
    {steps.map((s, i) => (
      <li key={s.label} className="flex items-stretch md:flex-1">
        <div className="flex-1 rounded-2xl border hairline bg-surface p-4">
          <div className="t-mono-xs text-ink-3">{String(i + 1).padStart(2, "0")}</div>
          <div className="mt-2 text-[15px] text-ink">{s.label}</div>
          {s.sub && <div className="mt-1 text-[12.5px] leading-snug text-ink-3">{s.sub}</div>}
        </div>
        {i < steps.length - 1 && (
          <div className="flex items-center justify-center px-2 py-1 md:px-1" aria-hidden="true">
            <span className="t-mono-xs md:hidden" style={{ color: p }}>{"↓"}</span>
            <span className="t-mono-xs hidden md:inline" style={{ color: p }}>{"→"}</span>
          </div>
        )}
      </li>
    ))}
  </ol>
);

const Section = ({ s, p }) => (
  <section id={`s-${s.n}`} className="scroll-mt-28 border-t hairline py-12 md:py-16" aria-labelledby={`h-${s.n}`}>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="md:col-span-4">
        <div className="t-mono-xs text-ink-3 reveal">{s.n} · {s.title}</div>
        {s.lead && (
          <h2 id={`h-${s.n}`} className="t-display-sm mt-4 max-w-[16em] text-ink reveal">{s.lead}</h2>
        )}
        {!s.lead && <h2 id={`h-${s.n}`} className="t-display-sm mt-4 text-ink reveal">{s.title}</h2>}
      </div>
      <div className="md:col-span-7 md:col-start-6">
        {s.diagram && <Diagram steps={s.diagram} p={p} />}
        {(s.body || []).map((para, i) => (
          <p key={i} className={`t-body max-w-[36em] text-ink-2 reveal ${i ? "mt-5" : ""}`}>{para}</p>
        ))}
        {s.list && (
          <ul className="mt-6 flex flex-col gap-2.5 reveal">
            {s.list.map((item) => (
              <li key={item} className="flex gap-4 text-[15px] leading-relaxed text-ink">
                <span className="t-mono-xs mt-[7px]" style={{ color: p }} aria-hidden="true">{"→"}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {s.code && (
          <pre className="mt-6 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border hairline bg-surface p-5 font-mono text-[12.5px] leading-relaxed text-ink-2 reveal">
            <code>{s.code}</code>
          </pre>
        )}
        {s.table && (
          <div className="mt-6 overflow-x-auto rounded-2xl border hairline bg-surface reveal">
            <table className="w-full border-collapse text-left text-[13.5px] text-ink-2">
              <thead>
                <tr className="t-mono-xs border-b hairline text-ink-3">
                  {s.table.head.map((h) => (
                    <th key={h} className="px-4 py-3 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.table.rows.map((row) => (
                  <tr key={row[0]} className="border-b hairline last:border-b-0">
                    {row.map((cell, i) => (
                      <td key={i} className={`px-4 py-3 align-top ${i === 0 ? "font-mono text-[12px] text-ink-3" : ""} ${i === row.length - 1 ? "font-mono text-[12px]" : ""}`} style={i === row.length - 1 ? { color: cell === "PASS" ? "var(--up-text)" : "var(--down-text)" } : undefined}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {s.engine && (
          <div className="mt-8 reveal">
            <Suspense fallback={<div className="t-mono-xs py-10 text-ink-3">Loading the matching engine…</div>}>
              <EnginePanel />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  </section>
);

const ProjectPage = ({ slug }) => {
  const cs = CASE_STUDIES[slug];
  const { setShowResume } = usePortfolio();
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(getTheme() === "dark"), []);
  useEffect(() => {
    if (cs) document.title = `${cs.title} — ${IDENTITY.name}`;
    return () => {
      document.title = `${IDENTITY.name} — ${IDENTITY.role} · ${IDENTITY.tagline}`;
    };
  }, [cs]);
  useReveal([slug]);

  if (!cs) {
    return (
      <main className="wrap flex min-h-[100svh] flex-col justify-center py-24">
        <div className="t-mono-xs text-ink-3">404 · No such case study</div>
        <h1 className="t-display-xl mt-6 text-ink">
          Nothing <span className="serif-italic text-ink-2">here.</span>
        </h1>
        <div className="mt-8">
          <Link href="/#work" className="btn btn-primary t-mono">{"\u2190"} All work</Link>
        </div>
      </main>
    );
  }

  const p = ART_COLORS[cs.art] || "var(--accent)";
  const index = CASE_STUDY_ORDER.indexOf(slug);
  const n = String(index + 1).padStart(2, "0");
  const nextSlug = CASE_STUDY_ORDER[(index + 1) % CASE_STUDY_ORDER.length];
  const next = CASE_STUDIES[nextSlug];
  const others = CASE_STUDY_ORDER.filter((s) => s !== slug).map((s) => CASE_STUDIES[s]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] border-b hairline bg-canvas/85 backdrop-blur-md">
        <div className="wrap flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Link href="/#work" className="t-mono-xs flex items-center gap-3 text-ink">
            <span className="arr" aria-hidden="true">{"←"}</span> All work
          </Link>
          <div className="t-mono-xs hidden items-center gap-3 text-ink-3 md:flex">
            <span className="dot" aria-hidden="true" />
            {IDENTITY.name} · Case study {n}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowResume(true)} className="t-mono-xs rounded-full px-3 py-2 text-ink-2 transition-colors hover:text-ink">
              Résumé
            </button>
            <button
              type="button"
              onClick={() => setDark(toggleTheme() === "dark")}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="grid h-9 w-9 place-items-center rounded-full border hairline text-ink transition-colors hover:bg-surface"
            >
              <SunMoon dark={dark} />
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="wrap pt-[calc(var(--nav-h)+3rem)]">
        {/* hero */}
        <div className="t-mono-xs flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-3">
          <span>{n}</span>
          <span className="h-px w-10 bg-line-2" aria-hidden="true" />
          <span>{cs.kicker}</span>
          {cs.facts.find(([k]) => k === "Timeline") && (
            <>
              <span aria-hidden="true">·</span>
              <span>{cs.facts.find(([k]) => k === "Timeline")[1]}</span>
            </>
          )}
        </div>
        <h1 className="t-display-xl mt-6 text-ink">
          {cs.title}
          <span className="serif-italic mt-3 block text-[clamp(1.6rem,3.4vw,3.2rem)] leading-[1.05] text-ink-2">{cs.headline}</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12">
          <p className="t-lede max-w-[32em] text-ink-2 md:col-span-7">{cs.intro}</p>
          <dl className="md:col-span-4 md:col-start-9">
            {cs.facts.map(([k, v]) => (
              <div key={k} className="border-t hairline py-3">
                <dt className="t-mono-xs text-ink-3">{k}</dt>
                <dd className="mt-1 text-[14px] leading-snug text-ink">{v}</dd>
              </div>
            ))}
            <div className="border-t hairline py-3">
              <dt className="t-mono-xs text-ink-3">Links</dt>
              <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {cs.links.map((l) => (
                  <Ext key={l.href} href={l.href}>{l.label}</Ext>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border hairline shadow-[0_1px_2px_rgba(0,0,0,.04),0_40px_80px_-40px_rgba(0,0,0,.35)]">
          <ProjectArt kind={cs.art} color={p} title={cs.title} />
        </div>

        {cs.metrics && (
          <dl className={`mt-12 grid grid-cols-2 ${cs.metrics.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {cs.metrics.map((m, i) => (
              <div key={m.label} className={`border-t hairline py-6 ${i % 2 === 1 ? "border-l pl-5 md:pl-6" : "pr-5"} ${i >= 2 ? "md:border-l md:pl-6" : ""}`}>
                <dt className="t-mono-xs text-ink-2">{m.label}</dt>
                <dd className="mt-1 text-[12px] leading-snug text-ink-3">{m.sub}</dd>
                <dd className="t-display-sm mt-3 tabular-nums text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* contents */}
        <nav aria-label="On this page" className="no-scrollbar mt-12 flex gap-3 overflow-x-auto border-y hairline py-4">
          {cs.sections.map((s) => (
            <a key={s.n} href={`#s-${s.n}`} className="pill t-mono-xs shrink-0">
              <span className="text-ink-3">{s.n}</span> {s.title}
            </a>
          ))}
        </nav>

        <div className="mt-4">
          {cs.sections.map((s) => (
            <Section key={s.n} s={s} p={p} />
          ))}
        </div>

        {/* outro */}
        <section className="border-t hairline py-16 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="t-mono-xs text-ink-3">Like what you see?</div>
              <h2 className="t-display-md mt-4 max-w-[12em] text-ink">
                Let's talk about what you're <span className="serif-italic text-ink-2">building.</span>
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${IDENTITY.email}`} className="btn btn-primary t-mono">{IDENTITY.email}</a>
                <button type="button" onClick={() => setShowResume(true)} className="btn btn-secondary t-mono">Résumé (PDF)</button>
              </div>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <div className="t-mono-xs text-ink-3">More work</div>
              <ul className="mt-4">
                {others.map((o) => (
                  <li key={o.slug} className="border-t hairline">
                    <Link href={`/work/${o.slug}`} className="group flex items-baseline gap-4 py-3">
                      <span className="t-mono-xs text-ink-3">{String(CASE_STUDY_ORDER.indexOf(o.slug) + 1).padStart(2, "0")}</span>
                      <span className="text-[15px] text-ink group-hover:underline">{o.title}</span>
                      <span className="arr t-mono-xs ml-auto text-ink-3" aria-hidden="true">{"→"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link href={`/work/${next.slug}`} data-cursor="open" className="group mt-16 block overflow-hidden rounded-3xl border hairline bg-surface">
            <div className="grid grid-cols-1 items-center md:grid-cols-12">
              <div className="p-7 md:col-span-5 md:p-10">
                <div className="t-mono-xs text-ink-3">Next case study · {String(CASE_STUDY_ORDER.indexOf(next.slug) + 1).padStart(2, "0")}</div>
                <div className="t-display-md mt-3 text-ink group-hover:underline">{next.title}</div>
                <p className="serif-italic mt-3 text-[1.4rem] leading-tight text-ink-2">{next.headline}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Tag>{next.kicker}</Tag>
                </div>
              </div>
              <div className="md:col-span-7">
                <ProjectArt kind={next.art} title={next.title} />
              </div>
            </div>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProjectPage;
