import React from "react";
import { IDENTITY } from "../data/site";

const NotFound = () => (
  <main className="wrap flex min-h-[100svh] flex-col justify-center py-24">
    <div className="t-mono-xs text-ink-3">404 · Not found</div>
    <h1 className="t-display-xl mt-6 text-ink">
      Nothing <span className="serif-italic text-ink-2">here.</span>
    </h1>
    <p className="t-lede mt-6 max-w-[30em] text-ink-2">
      That page does not exist, or it moved. The home page has everything, and{" "}
      {IDENTITY.email} has me.
    </p>
    <div className="mt-8">
      <a href="/" className="btn btn-primary t-mono">
        {"←"} Back to the site
      </a>
    </div>
  </main>
);

export default NotFound;
