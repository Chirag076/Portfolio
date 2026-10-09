import React, { useEffect, useMemo, useState } from "react";
import { OrderBook, makeOrder, mulberry32 } from "../lib/matchingEngine";

/* The engine from Market-Exchange, actually running in the browser. Every
   figure is measured from real work — nothing here is a timer pretending to
   be throughput. Loaded only when someone asks for it. */

const fmt = (n, d = 0) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

const Ladder = ({ rows, side, max }) => (
  <div className="flex flex-col gap-[3px]">
    {rows.map((r, i) => (
      <div
        key={i}
        className="relative flex h-[22px] items-center px-2 text-[11px]"
      >
        <div
          className={`bar ${side === "bid" ? "bar-bid" : "bar-ask"}`}
          style={{ width: `${Math.min(100, (r.qty / max) * 100)}%` }}
        />
        <span
          className={`relative z-10 w-full font-mono tabular-nums ${side === "bid" ? "text-right text-up-text" : "text-left text-down-text"}`}
        >
          {r.price.toFixed(2)}
          <span className="ml-3 text-ink-3">{r.qty}</span>
        </span>
      </div>
    ))}
    {rows.length === 0 && (
      <div className="h-[22px] px-2 font-mono text-[11px] text-ink-3">—</div>
    )}
  </div>
);

const Readout = ({ label, value, unit }) => (
  <div>
    <div className="t-mono-xs text-ink-3">{label}</div>
    <div className="mt-1.5 font-mono text-[22px] leading-none tabular-nums text-ink">
      {value}
      {unit && <span className="ml-1 text-[12px] text-ink-3">{unit}</span>}
    </div>
  </div>
);

const EnginePanel = () => {
  const book = useMemo(() => new OrderBook(100), []);
  const rnd = useMemo(() => mulberry32(20260829), []);

  const [depth, setDepth] = useState({ bids: [], asks: [] });
  const [live, setLive] = useState({ last: 100, trades: 0, rate: 0 });
  const [bench, setBench] = useState(null);
  const [running, setRunning] = useState(false);

  /* ambient flow so the book is alive while you read — real matching */
  useEffect(() => {
    if (running) return undefined;
    let raf;
    let lastT = performance.now();
    let acc = 0;
    let orders = 0;
    let win = performance.now();

    const loop = (t) => {
      const dt = t - lastT;
      lastT = t;
      acc += dt;
      const n = Math.min(240, Math.floor((acc / 1000) * 900));
      if (n > 0) {
        acc = 0;
        for (let i = 0; i < n; i++) {
          const o = makeOrder(book, rnd);
          book.submit(o.side, o.price, o.qty);
        }
        orders += n;
      }
      if (t - win > 320) {
        setDepth(book.depth(7));
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
  }, [running, book, rnd]);

  /* the real benchmark: N orders, wall-clock measured */
  const runBenchmark = () => {
    if (running) return;
    setRunning(true);
    setBench(null);

    setTimeout(() => {
      const N = 50000;
      const b = new OrderBook(100);
      const r = mulberry32(7);

      /* warm the JIT so we measure steady state, not compilation */
      for (let i = 0; i < 8000; i++) {
        const o = makeOrder(b, r);
        b.submit(o.side, o.price, o.qty);
      }
      b.reset(100);

      const t0 = performance.now();
      for (let i = 0; i < N; i++) {
        const o = makeOrder(b, r);
        b.submit(o.side, o.price, o.qty);
      }
      const elapsed = performance.now() - t0;

      setBench({
        orders: N,
        ms: elapsed,
        perSec: Math.round(N / (elapsed / 1000)),
        trades: b.trades,
        nsPerOrder: (elapsed * 1e6) / N,
        fillRate: (b.trades / N) * 100,
      });
      setRunning(false);
    }, 60);
  };

  const maxQty = Math.max(
    1,
    ...depth.bids.map((d) => d.qty),
    ...depth.asks.map((d) => d.qty),
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="t-mono-xs flex items-center gap-3 text-ink-3">
          <span className="dot" aria-hidden="true" />
          Running live in this window · price-time priority · in memory
        </div>
        <button
          type="button"
          onClick={runBenchmark}
          disabled={running}
          className="btn btn-primary t-mono disabled:opacity-60"
        >
          {running ? "Matching…" : "Benchmark it"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border hairline bg-surface p-5">
          <div className="t-mono-xs mb-4 flex items-center justify-between text-ink-3">
            <span>Order book</span>
            <span>{fmt(live.rate)} ord/s</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="t-mono-xs mb-2 px-2 text-up-text">Bids</div>
              <Ladder rows={depth.bids} side="bid" max={maxQty} />
            </div>
            <div>
              <div className="t-mono-xs mb-2 px-2 text-down-text">Asks</div>
              <Ladder rows={depth.asks} side="ask" max={maxQty} />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t hairline pt-4">
            <Readout label="Last" value={live.last.toFixed(2)} />
            <Readout label="Fills" value={fmt(live.trades)} />
            <Readout
              label="Spread"
              value={
                depth.asks[0] && depth.bids[0]
                  ? (depth.asks[0].price - depth.bids[0].price).toFixed(2)
                  : "—"
              }
            />
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border hairline bg-surface p-5">
          <div className="t-mono-xs mb-5 text-ink-3">
            Benchmark · measured on your CPU
          </div>

          {!bench && !running && (
            <div className="flex flex-1 items-center">
              <p className="font-mono text-[12px] leading-relaxed text-ink-3">
                Warms the JIT with 8,000 orders, resets the book, then matches
                50,000 fresh ones against the wall clock.
                <br />
                <br />
                Nothing here is hardcoded.
              </p>
            </div>
          )}

          {running && (
            <div className="flex flex-1 items-center font-mono text-[12px] text-ink-2">
              <span className="dot mr-3" aria-hidden="true" />
              matching 50,000 orders…
            </div>
          )}

          {bench && (
            <div className="grid flex-1 grid-cols-2 content-center gap-x-6 gap-y-6">
              <Readout
                label="Throughput"
                value={fmt(bench.perSec)}
                unit="ord/s"
              />
              <Readout
                label="Wall clock"
                value={bench.ms.toFixed(0)}
                unit="ms"
              />
              <Readout
                label="Per order"
                value={bench.nsPerOrder.toFixed(0)}
                unit="ns"
              />
              <Readout
                label="Fill rate"
                value={bench.fillRate.toFixed(1)}
                unit="%"
              />
              <div className="col-span-2 border-t hairline pt-4">
                <Readout label="Fills produced" value={fmt(bench.trades)} />
                <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-ink-3">
                  Bare matcher only. The 5,000/s on my CV is the whole system
                  under simulated traffic — network, WebSocket fan-out and
                  snapshotting included.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnginePanel;
