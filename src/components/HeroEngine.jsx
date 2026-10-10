import React, { useEffect, useMemo, useState } from "react";
import { OrderBook, makeOrder, mulberry32 } from "../lib/matchingEngine";
import { Link } from "../lib/router";

/* Option C for the hero: the Market-Exchange matching engine, live, as a
   small instrument beside the headline. Real matching of a random order
   stream — the ladder, the fills and the rate are measured, not animated.
   Runs only while the hero is on screen and the tab is visible. */

const fmt = (n) => n.toLocaleString("en-US");

const HeroEngine = () => {
  const book = useMemo(() => new OrderBook(100), []);
  const rnd = useMemo(() => mulberry32(20261010), []);
  const [depth, setDepth] = useState({ bids: [], asks: [] });
  const [live, setLive] = useState({ last: 100, trades: 0, rate: 0 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = document.getElementById("hero-engine");
    if (!el) return undefined;
    const hero = el.closest("section") || el;
    const io = new IntersectionObserver(
      ([e]) => setOn(e.isIntersecting && !document.hidden),
      { threshold: 0.05 },
    );
    io.observe(hero);
    const onVis = () => setOn((v) => (document.hidden ? false : v || true));
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!on) return undefined;
    let raf;
    let lastT = performance.now();
    let acc = 0;
    let orders = 0;
    let win = performance.now();
    const loop = (t) => {
      acc += t - lastT;
      lastT = t;
      const n = Math.min(160, Math.floor((acc / 1000) * 600));
      if (n > 0) {
        acc = 0;
        for (let i = 0; i < n; i++) {
          const o = makeOrder(book, rnd);
          book.submit(o.side, o.price, o.qty);
        }
        orders += n;
      }
      if (t - win > 400) {
        setDepth(book.depth(5));
        setLive({
          last: book.last,
          trades: book.trades,
          rate: Math.round((orders / (t - win)) * 1000),
        });
        orders = 0;
        win = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on, book, rnd]);

  const maxQty = Math.max(
    1,
    ...depth.bids.map((d) => d.qty),
    ...depth.asks.map((d) => d.qty),
  );
  const spread =
    depth.asks[0] && depth.bids[0]
      ? (depth.asks[0].price - depth.bids[0].price).toFixed(2)
      : "—";

  return (
    <div id="hero-engine" className="hero-engine fade-up">
      <div className="rounded-2xl border hairline bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,.04),0_40px_80px_-36px_rgba(0,0,0,.45)]">
        <div className="t-mono-xs flex items-center justify-between gap-4 text-ink-3">
          <span className="flex items-center gap-2">
            <span className="dot" aria-hidden="true" /> Matching engine · live
            in this page
          </span>
          <span className="tabular-nums">{fmt(live.rate)} ord/s</span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-b hairline pb-4">
          <div>
            <div className="t-mono-xs text-ink-3">Last</div>
            <div className="t-display-sm mt-1 font-mono tabular-nums text-ink">
              {live.last.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="t-mono-xs text-ink-3">Fills</div>
            <div className="mt-1 font-mono text-[18px] tabular-nums text-ink">
              {fmt(live.trades)}
            </div>
          </div>
          <div className="text-right">
            <div className="t-mono-xs text-ink-3">Spread</div>
            <div className="mt-1 font-mono text-[18px] tabular-nums text-ink">
              {spread}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="t-mono-xs mb-2 text-up-text">Bids</div>
            {depth.bids.map((r, i) => (
              <div
                key={i}
                className="relative flex h-[22px] items-center px-2 font-mono text-[11px]"
              >
                <div
                  className="bar bar-bid"
                  style={{ width: `${Math.min(100, (r.qty / maxQty) * 100)}%` }}
                />
                <span className="relative z-10 w-full text-right tabular-nums text-up-text">
                  {r.price.toFixed(2)}
                  <span className="ml-3 text-ink-3">{r.qty}</span>
                </span>
              </div>
            ))}
            {depth.bids.length === 0 && <div className="h-[110px]" />}
          </div>
          <div>
            <div className="t-mono-xs mb-2 text-down-text">Asks</div>
            {depth.asks.map((r, i) => (
              <div
                key={i}
                className="relative flex h-[22px] items-center px-2 font-mono text-[11px]"
              >
                <div
                  className="bar bar-ask"
                  style={{ width: `${Math.min(100, (r.qty / maxQty) * 100)}%` }}
                />
                <span className="relative z-10 w-full text-left tabular-nums text-down-text">
                  {r.price.toFixed(2)}
                  <span className="ml-3 text-ink-3">{r.qty}</span>
                </span>
              </div>
            ))}
            {depth.asks.length === 0 && <div className="h-[110px]" />}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t hairline pt-4">
          <span className="t-mono-xs text-ink-3">
            Price-time priority · in memory
          </span>
          <Link
            href="/work/market-exchange"
            className="arrow-link t-mono-xs text-ink"
          >
            <span className="link-u">Case study</span>{" "}
            <span className="arr" aria-hidden="true">
              {"→"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroEngine;
