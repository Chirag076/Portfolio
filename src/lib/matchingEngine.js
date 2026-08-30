/* A real price-time-priority limit order book.
   Nothing here is decorative: every number the UI shows is produced by this
   file actually matching orders. */

export class OrderBook {
  constructor(mid = 100) {
    this.bids = []; // sorted desc by price
    this.asks = []; // sorted asc by price
    this.last = mid;
    this.trades = 0;
    this.matchedQty = 0;
    this.seq = 0;
  }

  reset(mid = 100) {
    this.bids.length = 0;
    this.asks.length = 0;
    this.last = mid;
    this.trades = 0;
    this.matchedQty = 0;
    this.seq = 0;
  }

  _idx(arr, price, desc) {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      const cmp = desc ? arr[m].price > price : arr[m].price < price;
      if (cmp) lo = m + 1;
      else hi = m;
    }
    return lo;
  }

  submit(side, price, qty) {
    this.seq++;
    let remaining = qty;
    let fills = 0;

    if (side === "buy") {
      while (remaining > 0 && this.asks.length && this.asks[0].price <= price) {
        const top = this.asks[0];
        const take = Math.min(remaining, top.qty);
        top.qty -= take;
        remaining -= take;
        this.last = top.price;
        this.matchedQty += take;
        this.trades++;
        fills++;
        if (top.qty === 0) this.asks.shift();
      }
      if (remaining > 0) {
        this.bids.splice(this._idx(this.bids, price, true), 0, {
          price, qty: remaining, seq: this.seq,
        });
      }
    } else {
      while (remaining > 0 && this.bids.length && this.bids[0].price >= price) {
        const top = this.bids[0];
        const take = Math.min(remaining, top.qty);
        top.qty -= take;
        remaining -= take;
        this.last = top.price;
        this.matchedQty += take;
        this.trades++;
        fills++;
        if (top.qty === 0) this.bids.shift();
      }
      if (remaining > 0) {
        this.asks.splice(this._idx(this.asks, price, false), 0, {
          price, qty: remaining, seq: this.seq,
        });
      }
    }

    if (this.bids.length > 600) this.bids.length = 400;
    if (this.asks.length > 600) this.asks.length = 400;
    return fills;
  }

  depth(levels = 7) {
    const roll = (arr) => {
      const out = [];
      let i = 0;
      while (out.length < levels && i < arr.length) {
        const price = arr[i].price;
        let qty = 0;
        while (i < arr.length && arr[i].price === price) qty += arr[i++].qty;
        out.push({ price, qty });
      }
      return out;
    };
    return { bids: roll(this.bids), asks: roll(this.asks) };
  }
}

export function makeOrder(book, rnd) {
  const mid = book.last;
  const side = rnd() < 0.5 ? "buy" : "sell";
  const aggressive = rnd() < 0.56;
  const drift = (rnd() - 0.5) * 0.6;
  const offset = aggressive ? -(rnd() * 0.35) : rnd() * 0.9;
  const price =
    Math.round((mid + drift + (side === "buy" ? offset : -offset)) * 100) / 100;
  const qty = 1 + Math.floor(rnd() * 40);
  return { side, price, qty };
}

export function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
