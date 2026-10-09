import React from "react";
import { IDENTITY } from "../data/site";

const Maintenance = () => (
  <main className="wrap flex min-h-[100svh] flex-col justify-center py-24">
    <div className="t-mono-xs flex items-center gap-3 text-ink-3">
      <span className="dot" aria-hidden="true" /> Maintenance
    </div>
    <h1 className="t-display-xl mt-6 text-ink">
      Back <span className="serif-italic text-ink-2">shortly.</span>
    </h1>
    <p className="t-lede mt-6 max-w-[30em] text-ink-2">
      I am updating the site. In the meantime, the fastest way to reach me is
      email.
    </p>
    <div className="mt-8">
      <a href={`mailto:${IDENTITY.email}`} className="btn btn-primary t-mono">
        {IDENTITY.email}
      </a>
    </div>
  </main>
);

export default Maintenance;
