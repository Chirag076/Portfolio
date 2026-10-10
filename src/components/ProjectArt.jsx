import React from "react";
import { ART_MARKUP } from "../generated/art";

/* Illustrated covers for the project cards, drawn as SVG so they are crisp
   at any size, weigh nothing, and follow the light/dark theme. Each is a
   little scene in a soft, clay-like style: paper cards, one accent colour
   per project, long soft shadows. Replace any of them with a real render by
   setting `image` on the project in src/data/site.js. */

const MONO = "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "Geist, ui-sans-serif, system-ui, sans-serif";

const Defs = ({ id, p }) => (
  <defs>
    <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity="0.16" />
    </filter>
    <filter id={`${id}-near`} x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.14" />
    </filter>
    <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
      <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.12" />
    </linearGradient>
    <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.6">
      <stop offset="0" stopColor={p} stopOpacity="0.28" />
      <stop offset="1" stopColor={p} stopOpacity="0" />
    </radialGradient>
  </defs>
);

/* a paper card with a hairline and a long soft shadow */
const Card = ({ id, x, y, w, h, r = 22, near = false, transform, children }) => (
  <g transform={transform} filter={`url(#${id}-${near ? "near" : "soft"})`}>
    <rect x={x} y={y} width={w} height={h} rx={r} style={{ fill: "var(--art-card)", stroke: "var(--art-line)" }} strokeWidth="1" />
    {children}
  </g>
);

/* a solid clay shape: base colour plus a highlight gradient on top */
const Clay = ({ id, children, color }) => (
  <g>
    {React.cloneElement(children, { fill: color })}
    {React.cloneElement(children, { fill: `url(#${id}-clay)` })}
  </g>
);

const Lines = ({ x, y, widths, gap = 22, h = 8, color = "var(--art-line-2)" }) =>
  widths.map((w, i) => <rect key={i} x={x} y={y + i * gap} width={w} height={h} rx={h / 2} style={{ fill: color }} />);

const Chip = ({ x, y, w, text, p, id, dark = false }) => (
  <g filter={`url(#${id}-near)`}>
    <rect x={x} y={y} width={w} height="40" rx="20" style={{ fill: dark ? "var(--art-ink)" : "var(--art-card)", stroke: dark ? "none" : "var(--art-line)" }} />
    {p && <circle cx={x + 22} cy={y + 20} r="5" fill={p} />}
    <text x={p ? x + 36 : x + 18} y={y + 25} fontFamily={MONO} fontSize="12.5" letterSpacing="1.4" style={{ fill: dark ? "var(--art-canvas)" : "var(--art-ink)" }}>
      {text}
    </text>
  </g>
);

/* ------------------------------------------------------------------ salon */
const Bg = () => <rect width="1200" height="675" style={{ fill: "var(--art-bg)" }} />;

const Salon = ({ id, p }) => (
  <>
    <Bg />
    <Defs id={id} p={p} />
    <ellipse cx="420" cy="380" rx="420" ry="300" fill={`url(#${id}-glow)`} />

    {/* the phone */}
    <Card id={id} x={300} y={70} w={300} h={560} r={38} transform="rotate(-6 450 350)">
      <rect x="318" y="88" width="264" height="524" rx="26" style={{ fill: "var(--art-screen)" }} />
      <rect x="410" y="100" width="80" height="8" rx="4" style={{ fill: "var(--art-line-2)" }} />
      <circle cx="350" cy="146" r="14" fill={p} />
      <text x="372" y="151" fontFamily={SANS} fontSize="14" fontWeight="500" style={{ fill: "var(--art-ink)" }}>Glow Salon</text>
      <text x="372" y="167" fontFamily={MONO} fontSize="9.5" letterSpacing="1" style={{ fill: "var(--art-mute)" }}>CONCIERGE · ONLINE</text>
      {/* user bubble */}
      <rect x="392" y="196" width="178" height="58" rx="18" style={{ fill: "var(--art-ink)" }} />
      <Lines x={408} y={212} widths={[146, 96]} gap={16} h={7} color="var(--art-canvas)" />
      {/* bot bubble */}
      <rect x="330" y="268" width="196" height="74" rx="18" style={{ fill: "var(--art-bubble)" }} />
      <Lines x={346} y={284} widths={[164, 140, 92]} gap={16} h={7} color="var(--art-line-3)" />
      {/* user bubble */}
      <rect x="430" y="356" width="140" height="42" rx="18" style={{ fill: "var(--art-ink)" }} />
      <Lines x={446} y={372} widths={[108]} gap={16} h={7} color="var(--art-canvas)" />
      {/* bot confirms */}
      <rect x="330" y="412" width="212" height="58" rx="18" style={{ fill: "var(--art-bubble)" }} />
      <circle cx="352" cy="441" r="9" fill={p} />
      <path d="M347 441 l4 4 l7 -8" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Lines x={368} y={430} widths={[152, 110]} gap={16} h={7} color="var(--art-line-3)" />
      {/* input */}
      <rect x="330" y="556" width="240" height="36" rx="18" style={{ fill: "var(--art-card)", stroke: "var(--art-line)" }} />
      <circle cx="552" cy="574" r="12" fill={p} />
    </Card>

    {/* the robot */}
    <g filter={`url(#${id}-soft)`}>
      <Clay id={id} color={p}>
        <circle cx="820" cy="190" r="74" />
      </Clay>
      <ellipse cx="800" cy="168" rx="34" ry="20" fill="#fff" opacity="0.22" />
      <rect x="770" y="176" width="100" height="44" rx="22" style={{ fill: "var(--art-ink)" }} />
      <circle cx="800" cy="198" r="7" fill="#fff" />
      <circle cx="840" cy="198" r="7" fill="#fff" />
      <rect x="814" y="104" width="12" height="22" rx="6" fill={p} />
      <circle cx="820" cy="100" r="9" style={{ fill: "var(--art-ink)" }} />
    </g>

    {/* the booking */}
    <Card id={id} x={680} y={320} w={330} h={210} r={26} transform="rotate(4 845 425)">
      <text x="708" y="356" fontFamily={MONO} fontSize="11" letterSpacing="1.8" style={{ fill: "var(--art-mute)" }}>BOOKING · #42</text>
      <text x="708" y="402" fontFamily={SANS} fontSize="30" fontWeight="500" letterSpacing="-0.8" style={{ fill: "var(--art-ink)" }}>Sat · 3:00 PM</text>
      <text x="708" y="430" fontFamily={SANS} fontSize="15" style={{ fill: "var(--art-mute)" }}>Haircut (women) · Rs 800 · Riya</text>
      <rect x="708" y="458" width="150" height="40" rx="20" fill={p} />
      <text x="732" y="483" fontFamily={MONO} fontSize="12" letterSpacing="1.6" fill="#fff">CONFIRMED</text>
      <path d="M872 471 l6 6 l12 -13" stroke={p} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Card>

    <Chip id={id} x={120} y={520} w={250} text="book_appointment()" p={p} />
    <Chip id={id} x={120} y={110} w={236} text="never invents a price" dark />
  </>
);

/* --------------------------------------------------------------- exchange */
const CANDLES = [
  [100, 118, 92, 112], [112, 126, 106, 108], [108, 110, 86, 90], [90, 104, 84, 100], [100, 122, 98, 118],
  [118, 124, 102, 106], [106, 116, 100, 114], [114, 134, 110, 130], [130, 136, 112, 116], [116, 128, 108, 126],
  [126, 142, 122, 140], [140, 146, 128, 132],
];
const BOOK = [
  [98.06, 1], [98.32, 9], [98.33, 38], [98.34, 34], [98.35, 65], [98.36, 18],
];

const Exchange = ({ id, p }) => {
  const up = "var(--up)";
  const down = "var(--down)";
  const y0 = 150;
  const scale = 3.3;
  const Y = (v) => y0 + (150 - v) * scale;
  return (
    <>
      <Bg />
      <Defs id={id} p={p} />
      <ellipse cx="560" cy="360" rx="520" ry="300" fill={`url(#${id}-glow)`} />

      {/* the chart */}
      <Card id={id} x={110} y={90} w={640} h={470} r={28}>
        <text x="140" y="128" fontFamily={MONO} fontSize="11" letterSpacing="1.8" style={{ fill: "var(--art-mute)" }}>SOL / USDC · 1M</text>
        <text x="140" y="166" fontFamily={SANS} fontSize="30" fontWeight="500" letterSpacing="-0.8" style={{ fill: "var(--art-ink)" }}>134.38</text>
        <text x="260" y="166" fontFamily={MONO} fontSize="12" letterSpacing="1" fill={up}>+3.33%</text>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="140" x2="720" y1={200 + i * 90} y2={200 + i * 90} style={{ stroke: "var(--art-line)" }} strokeWidth="1" />
        ))}
        {CANDLES.map(([o, h, l, c], i) => {
          const x = 160 + i * 47;
          const bull = c >= o;
          const top = Y(Math.max(o, c));
          const bot = Y(Math.min(o, c));
          return (
            <g key={i}>
              <line x1={x + 12} x2={x + 12} y1={Y(h)} y2={Y(l)} stroke={bull ? up : down} strokeWidth="2" strokeLinecap="round" />
              <rect x={x} y={top} width="24" height={Math.max(6, bot - top)} rx="5" fill={bull ? up : down} />
              <rect x={x} y={top} width="24" height={Math.max(6, bot - top)} rx="5" fill={`url(#${id}-clay)`} />
            </g>
          );
        })}
      </Card>

      {/* the order book */}
      <Card id={id} x={790} y={150} w={300} h={400} r={26} transform="rotate(3 940 350)">
        <text x="816" y="186" fontFamily={MONO} fontSize="11" letterSpacing="1.8" style={{ fill: "var(--art-mute)" }}>ORDER BOOK</text>
        {BOOK.map(([price, qty], i) => {
          const y = 206 + i * 28;
          const ask = i < 3;
          const w = Math.max(14, (qty / 65) * 200);
          return (
            <g key={i}>
              <rect x={ask ? 816 : 1064 - w} y={y} width={w} height="22" rx="6" fill={ask ? down : up} opacity="0.22" />
              <text x={ask ? 826 : 1054} y={y + 15.5} textAnchor={ask ? "start" : "end"} fontFamily={MONO} fontSize="12" fill={ask ? down : up}>{price.toFixed(2)}</text>
              <text x={ask ? 1054 : 826} y={y + 15.5} textAnchor={ask ? "end" : "start"} fontFamily={MONO} fontSize="12" style={{ fill: "var(--art-mute)" }}>{qty}</text>
            </g>
          );
        })}
        <line x1="816" x2="1064" y1="384" y2="384" style={{ stroke: "var(--art-line)" }} />
        <text x="816" y="412" fontFamily={MONO} fontSize="11" letterSpacing="1.4" style={{ fill: "var(--art-mute)" }}>SPREAD</text>
        <text x="1064" y="412" textAnchor="end" fontFamily={MONO} fontSize="12" style={{ fill: "var(--art-ink)" }}>0.02</text>
        <text x="816" y="440" fontFamily={MONO} fontSize="11" letterSpacing="1.4" style={{ fill: "var(--art-mute)" }}>MATCHED</text>
        <text x="1064" y="440" textAnchor="end" fontFamily={MONO} fontSize="12" style={{ fill: "var(--art-ink)" }}>5,000 / s</text>
        <circle cx="816" cy="500" r="6" fill={p} />
        <text x="832" y="504" fontFamily={MONO} fontSize="11" letterSpacing="1.4" style={{ fill: "var(--art-ink)" }}>IN MEMORY · SNAPSHOT 3S</text>
      </Card>

      <Chip id={id} x={60} y={560} w={232} text="price-time priority" p={p} />
      <Chip id={id} x={640} y={50} w={222} text="redis · replay queue" dark />
    </>
  );
};

/* ---------------------------------------------------------------- askdocs */
const AskDocs = ({ id, p }) => (
  <>
    <Bg />
    <Defs id={id} p={p} />
    <ellipse cx="520" cy="360" rx="480" ry="300" fill={`url(#${id}-glow)`} />

    {/* three documents */}
    <Card id={id} x={260} y={150} w={360} h={440} r={20} transform="rotate(-8 440 370)">
      <Lines x={300} y={200} widths={[200, 280, 240, 260, 180]} />
    </Card>
    <Card id={id} x={300} y={120} w={360} h={440} r={20} transform="rotate(-3 480 340)">
      <Lines x={340} y={170} widths={[220, 280, 250, 270, 200, 280, 160]} />
    </Card>
    <Card id={id} x={340} y={90} w={360} h={440} r={20}>
      <text x="376" y="132" fontFamily={MONO} fontSize="11" letterSpacing="1.8" style={{ fill: "var(--art-mute)" }}>CONTRACT.PDF · CHUNK 14</text>
      <Lines x={376} y={160} widths={[230, 290, 250]} />
      <rect x="368" y="222" width="300" height="56" rx="12" fill={p} opacity="0.16" />
      <Lines x={376} y={236} widths={[280, 200]} color={p} />
      <Lines x={376} y={300} widths={[260, 290, 180, 270, 220, 150]} />
    </Card>

    {/* the lens */}
    <g filter={`url(#${id}-soft)`}>
      <circle cx="712" cy="268" r="92" style={{ fill: "var(--art-canvas)" }} fillOpacity="0.55" stroke={p} strokeWidth="12" />
      <circle cx="712" cy="268" r="92" fill={`url(#${id}-clay)`} />
      <Clay id={id} color={p}>
        <rect x="770" y="330" width="34" height="120" rx="17" transform="rotate(-45 787 390)" />
      </Clay>
      <ellipse cx="680" cy="236" rx="28" ry="16" fill="#fff" opacity="0.5" />
    </g>

    {/* the answer */}
    <Card id={id} x={700} y={400} w={360} h={170} r={24} transform="rotate(3 880 485)">
      <text x="728" y="436" fontFamily={MONO} fontSize="11" letterSpacing="1.8" style={{ fill: "var(--art-mute)" }}>ANSWER · WITH SOURCE</text>
      <text x="728" y="474" fontFamily={SANS} fontSize="20" fontWeight="500" letterSpacing="-0.4" style={{ fill: "var(--art-ink)" }}>30 days' written notice.</text>
      <rect x="728" y="498" width="130" height="34" rx="17" style={{ fill: "var(--art-card)", stroke: "var(--art-line)" }} />
      <circle cx="746" cy="515" r="5" fill={p} />
      <text x="758" y="519.5" fontFamily={MONO} fontSize="11" letterSpacing="1" style={{ fill: "var(--art-ink)" }}>clause 7.2</text>
      <text x="876" y="519.5" fontFamily={MONO} fontSize="11" letterSpacing="1" style={{ fill: "var(--art-mute)" }}>score 0.81</text>
    </Card>

    <Chip id={id} x={90} y={560} w={300} text="chunk → embed → retrieve" p={p} />
    <Chip id={id} x={130} y={90} w={176} text={'"I don\'t know."'} dark />
  </>
);

/* ----------------------------------------------------------------- talksy */
const Phone = ({ id, x, y, rot, p, mine }) => (
  <Card id={id} x={x} y={y} w={250} h={470} r={34} transform={`rotate(${rot} ${x + 125} ${y + 235})`}>
    <rect x={x + 15} y={y + 15} width={220} height={440} rx={24} style={{ fill: "var(--art-screen)" }} />
    <circle cx={x + 44} cy={y + 54} r="12" fill={p} />
    <circle cx={x + 53} cy={y + 63} r="4.5" style={{ fill: "var(--up)", stroke: "var(--art-screen)" }} strokeWidth="2" />
    <Lines x={x + 64} y={y + 46} widths={[80, 50]} gap={12} h={6} />
    <rect x={x + 32} y={y + 100} width={150} height={44} rx={16} style={{ fill: "var(--art-bubble)" }} />
    <Lines x={x + 46} y={y + 114} widths={[110, 70]} gap={14} h={6} color="var(--art-line-3)" />
    <rect x={x + 84} y={y + 160} width={132} height={44} rx={16} style={{ fill: "var(--art-ink)" }} />
    <Lines x={x + 98} y={y + 174} widths={[100, 60]} gap={14} h={6} color="var(--art-canvas)" />
    <rect x={x + 32} y={y + 220} width={120} height={44} rx={16} style={{ fill: "var(--art-bubble)" }} />
    <Lines x={x + 46} y={y + 234} widths={[90, 48]} gap={14} h={6} color="var(--art-line-3)" />
    {mine ? (
      <>
        <rect x={x + 32} y={y + 290} width={64} height={32} rx={16} style={{ fill: "var(--art-bubble)" }} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={x + 50 + i * 14} cy={y + 306} r="4" style={{ fill: "var(--art-mute)" }} opacity={0.5 + i * 0.25} />
        ))}
      </>
    ) : (
      <>
        <rect x={x + 64} y={y + 290} width={152} height={44} rx={16} style={{ fill: "var(--art-ink)" }} />
        <Lines x={x + 78} y={y + 304} widths={[120, 80]} gap={14} h={6} color="var(--art-canvas)" />
      </>
    )}
    <rect x={x + 32} y={y + 398} width={186} height={36} rx={18} style={{ fill: "var(--art-card)", stroke: "var(--art-line)" }} />
    <circle cx={x + 200} cy={y + 416} r="12" fill={p} />
  </Card>
);

const Talksy = ({ id, p }) => (
  <>
    <Bg />
    <Defs id={id} p={p} />
    <ellipse cx="600" cy="360" rx="520" ry="300" fill={`url(#${id}-glow)`} />
    <path d="M430 300 C 560 180, 640 180, 770 300" stroke={p} strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" fill="none" opacity="0.9" />
    <path d="M770 420 C 640 540, 560 540, 430 420" stroke={p} strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" fill="none" opacity="0.9" />
    <Phone id={id} x={190} y={110} rot={-7} p={p} mine />
    <Phone id={id} x={760} y={110} rot={7} p={p} />
    <g filter={`url(#${id}-soft)`}>
      <Clay id={id} color={p}>
        <circle cx="600" cy="360" r="58" />
      </Clay>
      <ellipse cx="582" cy="340" rx="24" ry="14" fill="#fff" opacity="0.28" />
      <path d="M575 362 l12 12 l24 -26" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <Chip id={id} x={450} y={560} w={300} text="delivered · typing · online" p={p} />
    <Chip id={id} x={520} y={90} w={160} text="socket.io" dark />
  </>
);

export const SCENES = { salon: Salon, exchange: Exchange, askdocs: AskDocs, talksy: Talksy };

export const ART_COLORS = { salon: "#12b981", exchange: "#4f7cff", askdocs: "#e8502a", talksy: "#8663e4" };

/* `kind` picks the scene. The scenes above are pre-rendered to markup by
   scripts/art.js (run by `npm start` and `npm run build`) and imported from
   src/generated/art.js, so React only places one <svg> and never walks the
   hundreds of nodes inside it. The JSX stays here as the source of truth
   for that script; it is not shipped to the browser. */
const ProjectArt = ({ kind, title, className = "" }) => {
  const html = ART_MARKUP[kind];
  if (!html) return null;
  return (
    <div
      className={`project-art ${className}`}
      style={{ "--p": ART_COLORS[kind] }}
      role="img"
      aria-label={title ? `${title} — illustration` : undefined}
    >
      <svg
        viewBox="0 0 1200 675"
        width="1200"
        height="675"
        className="block h-auto w-full"
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default ProjectArt;
