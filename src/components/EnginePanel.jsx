import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { OrderBook, makeOrder, mulberry32 } from "../lib/matchingEngine";

/* The engine from Market-Exchange, actually running in the browser.
   Every figure is measured from real work — nothing here is a timer
   pretending to be throughput. */

const fmt = (n, d = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const Ladder = ({ rows, side, max }) => (
  <div className="flex flex-col gap-[3px]">
    {rows.map((r, i) => (
      <div key={i} className="relative flex h-[22px] items-center px-2 text-[11px]">
        <div
          className={`absolute inset-y-0 ${side === "bid" ? "right-0" : "left-0"} rounded-[2px]`}
          style={{
            width: `${Math.min(100, (r.qty / max) * 100)}%`,
            background:
              side === "bid"
                ? "linear-gradient(90deg, rgba(34,197,94,0.03), rgba(34,197,94,0.20))"
                : "linear-gradient(90deg, rgba(228,84,150,0.20), rgba(228,84,150,0.03))",
          }}
        />
        <span
          className={`relative z-10 w-full font-mono tabular-nums ${
            side === "bid" ? "text-right text-emerald-300/90" : "text-left text-pink-300/90"
          }`}
        >
          {r.price.toFixed(2)}
          <span className="ml-3 text-gray-500">{r.qty}</span>
        </span>
      </div>
    ))}
    {rows.length === 0 && (
      <div className="h-[22px] px-2 font-mono text-[11px] text-gray-600">—</div>
    )}
  </div>
);

const Readout = ({ label, value, unit, accent }) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
      {label}
    </div>
    <div
      className={`mt-1.5 font-mono text-[22px] leading-none tabular-nums ${
        accent
          ? "bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent"
          : "text-white"
      }`}
    >
      {value}
      {unit && <span className="ml-1 text-[12px] text-gray-500">{unit}</span>}
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
    ...depth.asks.map((d) => d.qty)
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
            Running live in this window
          </span>
        </div>
        <button
          onClick={runBenchmark}
          disabled={running}
          className="group relative shrink-0 overflow-hidden rounded-full px-7 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-transform duration-300 hover:-translate-y-[2px] disabled:opacity-60"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500" />
          <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 ease-out group-hover:translate-y-0" />
          <span className="relative z-10">{running ? "Matching…" : "Benchmark it"}</span>
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="light-catch rounded-panel border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
            <span>Order book</span>
            <span>{fmt(live.rate)} ord/s</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-500/70">
                Bids
              </div>
              <Ladder rows={depth.bids} side="bid" max={maxQty} />
            </div>
            <div>
              <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-pink-500/70">
                Asks
              </div>
              <Ladder rows={depth.asks} side="ask" max={maxQty} />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <Readout label="Last" value={live.last.toFixed(2)} accent />
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

        <div className="light-catch flex flex-col rounded-panel border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
            Benchmark · measured on your CPU
          </div>

          {!bench && !running && (
            <div className="flex flex-1 items-center">
              <p className="font-mono text-[12px] leading-relaxed text-gray-600">
                Warms the JIT with 8,000 orders, resets the book, then matches
                50,000 fresh ones against the wall clock.
                <br />
                <br />
                Nothing here is hardcoded.
              </p>
            </div>
          )}

          {running && (
            <div className="flex flex-1 items-center font-mono text-[12px] text-gray-400">
              <span className="mr-3 inline-block h-2 w-2 animate-ping rounded-full bg-pink-500" />
              matching 50,000 orders…
            </div>
          )}

          {bench && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid flex-1 grid-cols-2 content-center gap-x-6 gap-y-6"
            >
              <Readout label="Throughput" value={fmt(bench.perSec)} unit="ord/s" accent />
              <Readout label="Wall clock" value={bench.ms.toFixed(0)} unit="ms" />
              <Readout label="Per order" value={bench.nsPerOrder.toFixed(0)} unit="ns" />
              <Readout label="Fill rate" value={bench.fillRate.toFixed(1)} unit="%" />
              <div className="col-span-2 border-t border-white/[0.07] pt-4">
                <Readout label="Fills produced" value={fmt(bench.trades)} />
                <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-gray-600">
                  Bare matcher only. The 5,000/s on my CV is the whole system
                  under simulated traffic — network, WebSocket fan-out and
                  snapshotting included.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnginePanel;
