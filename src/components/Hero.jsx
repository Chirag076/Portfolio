import React, { Suspense, lazy, useEffect, useState } from "react";
import { HERO, IDENTITY, STATS } from "../data/site";
import { Button, Arrow } from "./ui";
import { usePortfolio } from "../context/PortfolioContext";

/* each hero option is its own chunk; only the chosen one is ever downloaded */
const HeroStack = lazy(() => import("./HeroStack"));
const HeroField = lazy(() => import("./HeroField"));
const HeroEngine = lazy(() => import("./HeroEngine"));

/* The right side of the hero is one of three things, chosen in
   src/data/site.js: "stack" (three project covers), "field" (a point field
   behind the whole hero) or "engine" (the live order book). All three are
   client-only, so the pre-rendered first paint is the same. */
const ClientOnly = ({ children }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? <Suspense fallback={null}>{children}</Suspense> : null;
};

const Hero = () => {
  const { setShowResume } = usePortfolio();
  const visual = HERO.visual || "stack";
  const phrases = [...HERO.phrases, HERO.phrases[0]]; // the loop lands back on the first without a jump

  const toWork = (e) => {
    e.preventDefault();
    document
      .getElementById("work")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end pt-[calc(var(--nav-h)+2.5rem)]"
    >
      {visual === "field" && (
        <ClientOnly>
          <HeroField />
        </ClientOnly>
      )}
      <div className="wrap relative z-10 pb-10 md:pb-14 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <h1 className="t-display-xl hero-title text-ink">
            <span className="line-mask">
              <span className="line-in">{HERO.lead}</span>
            </span>
            <span className="line-mask">
              <span className="line-in d1 serif-italic text-ink-2">
                <span className="rotator" aria-hidden="true">
                  <span className="rotator-track">
                    {phrases.map((p, i) => (
                      <span key={i}>{p}</span>
                    ))}
                  </span>
                </span>
                <span className="sr-only">{HERO.phrases.join(" ")}</span>
              </span>
            </span>
          </h1>

          <p className="fade-up d1 t-lede mt-8 max-w-[32em] text-ink-2">
            {HERO.bio}
          </p>

          <ul className="fade-up d2 t-mono-xs mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-2">
            <li>
              <a href={`mailto:${IDENTITY.email}`} className="link-u">
                {IDENTITY.email}
              </a>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <a href={IDENTITY.phoneHref} className="link-u">
                {IDENTITY.phone}
              </a>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <button
                type="button"
                onClick={() => setShowResume(true)}
                className="link-u t-mono-xs"
              >
                Résumé (PDF)
              </button>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <a
                href={IDENTITY.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-u"
              >
                LinkedIn {"↗"}
              </a>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <a
                href={IDENTITY.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-u"
              >
                GitHub {"↗"}
              </a>
            </li>
          </ul>

          <div className="fade-up d3 mt-8 flex flex-wrap gap-3">
            <Button href="#work" onClick={toWork}>
              Selected work <Arrow dir="down" />
            </Button>
            <Button href={`mailto:${IDENTITY.email}`} variant="secondary">
              Get in touch
            </Button>
          </div>
        </div>

        {/* the right column on wide screens */}
        {visual === "stack" && (
          <div className="hidden lg:col-span-5 lg:block">
            <ClientOnly>
              <HeroStack />
            </ClientOnly>
          </div>
        )}
        {visual === "engine" && (
          <div className="hidden lg:col-span-5 lg:block">
            <ClientOnly>
              <HeroEngine />
            </ClientOnly>
          </div>
        )}
      </div>

      {/* the numbers, each measured on the system that shipped */}
      <div className="wrap relative z-10">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`fade-up border-t hairline py-6 ${i % 2 === 1 ? "border-l pl-5 md:pl-6" : ""} ${i === 2 ? "md:border-l md:pl-6" : ""} ${i % 2 === 0 ? "pr-5" : "pr-2"} ${i >= 2 ? "md:pr-5" : ""}`}
              style={{ animationDelay: `${0.85 + i * 0.07}s` }}
            >
              <dt className="t-mono-xs text-ink-2">{s.label}</dt>
              <dd className="mt-1 text-[12px] leading-snug text-ink-3">
                {s.sub}
              </dd>
              <dd className="t-display-sm mt-3 tabular-nums text-ink">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Hero;
