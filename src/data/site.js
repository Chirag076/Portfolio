/* Everything written on the page lives here, in one place. Projects and
   experience can also be edited from the admin dashboard; this file is the
   source of truth for the rest. Keep every number one you can defend. */

export const IDENTITY = {
  name: "Chirag Chhabra",
  role: "Full-Stack Engineer",
  tagline: "AI Agents | Booking & Payments",
  location: "Delhi, India",
  timezone: "IST",
  email: "chiragchhabrahmo@gmail.com",
  phone: "+91 99287 08240",
  phoneHref: "tel:+919928708240",
  resumeView:
    "https://drive.google.com/file/d/1wr5XXvB0QLwPFoHrozOY1ukkuxSqBQhY/view?usp=drive_link",
  resumePreview:
    "https://drive.google.com/file/d/1wr5XXvB0QLwPFoHrozOY1ukkuxSqBQhY/preview",
  linkedin: "https://www.linkedin.com/in/chirag-chhabra07/",
  linkedinHandle: "in/chirag-chhabra07",
  github: "https://github.com/Chirag076",
  githubHandle: "@Chirag076",
};

export const NAV = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
];

export const HERO = {
  lead: "I build and ship",
  phrases: [
    "booking systems.",
    "AI booking agents.",
    "payment flows.",
    "matching engines.",
  ],
  bio: "Full-stack engineer in Delhi. At UnQue I shipped booking, payroll, attendance and access control for a salon SaaS of 40 businesses, where the booking bot I built grew bookings 3× to 10,000 a month. At Rocket Health I prototyped the in-house scheduler to replace Calendly. Now building LLM agents with tool-calling and RAG — and I like the boring parts of the stack: the constraint that stops the double-booking, the queue that keeps the hot path off the database.",
};

export const STATS = [
  {
    label: "orders matched a second",
    sub: "in-memory engine · local load test",
    value: "5,000",
  },
  {
    label: "appointments a month",
    sub: "UnQue · 40 businesses",
    value: "10,000",
  },
  {
    label: "growth in bookings",
    sub: "booking bot I shipped · five months",
    value: "3×",
  },
  {
    label: "faster releases",
    sub: "40 minutes down to 5 · Docker + AWS",
    value: "8×",
  },
];

/* Rich metadata for the work section, keyed by project title. The admin
   dashboard can still edit a project's description, image and link; what it
   cannot edit (headline, tags, extra links, the kind of visual) lives here. */
export const PROJECT_META = {
  "Salon Concierge": {
    kicker: "Applied AI",
    headline: "A Telegram concierge that books salon appointments, safely.",
    tags: ["Gemini tool-calling", "Telegram", "Python", "SQLite", "Evals"],
    visual: "chat",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Chirag076/salonConciergeBot",
      },
      {
        label: "Demo video",
        href: "https://drive.google.com/file/d/14jerL5v7q92tbmNTvLsdB3axggYMKE9h/view?usp=sharing",
      },
      { label: "@salonConciergeBot", href: "https://t.me/salonConciergeBot" },
    ],
  },
  "Market-Exchange": {
    kicker: "Trading infrastructure",
    headline:
      "A Binance-style exchange, with the matching engine running in this page.",
    tags: [
      "Next.js",
      "TypeScript",
      "Redis",
      "TimescaleDB",
      "WebSockets",
      "Docker",
    ],
    visual: "image",
    image: "/images/market-exchange.webp",
    imageSmall: "/images/market-exchange-800.webp",
    engine: true,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Chirag076/market-exchange-project",
      },
      {
        label: "Architecture",
        href: "https://github.com/Chirag076/market-exchange-project/blob/main/frontend/public/images/Architecture.png",
      },
      {
        label: "Demo video",
        href: "https://drive.google.com/file/d/1J85XPY4Rg0yfMa2dtCm4BLFw9kH5Vy0S/view?usp=sharing",
      },
    ],
  },
  AskDocs: {
    kicker: "RAG",
    headline:
      "Ask questions of your own documents, and get an answer that cites them.",
    tags: ["FastAPI", "ChromaDB", "Gemini", "RAG", "Docker", "Render"],
    visual: "json",
    links: [
      { label: "GitHub", href: "https://github.com/Chirag076/askdocs" },
      { label: "Live API", href: "https://askdocs-axen.onrender.com/docs" },
    ],
  },
  Talksy: {
    kicker: "Real-time",
    headline: "Messaging that re-renders one conversation, not the whole list.",
    tags: ["React", "Node.js", "Socket.IO", "MongoDB", "Zustand"],
    visual: "image",
    image: "/images/talksy.webp",
    imageSmall: "/images/talksy-800.webp",
    links: [{ label: "GitHub", href: "https://github.com/Chirag076/Talksy" }],
  },
};

/* the mock conversation drawn in the Salon Concierge card — real menu, real
   prices from the bot's system prompt, real guardrail behaviour */
export const CHAT_MOCK = [
  { from: "user", text: "Book a women's haircut for Riya on Saturday at 3 PM" },
  {
    from: "bot",
    text: "Done — Haircut (women), Rs 800, for Riya on Saturday at 3:00 PM. Your booking ID is 42.",
  },
  { from: "user", text: "Do you do tattoos?" },
  {
    from: "bot",
    text: "Sorry, we don't offer tattoos. I can help with haircuts, colour, facials, bridal makeup, manicures and pedicures.",
  },
];

export const PRINCIPLES = [
  {
    n: "01",
    title: "Correct under concurrency.",
    sub: "A constraint, not a code review, stops the double-booking.",
    body: "Two customers hit the same slot in the same second. The fix that held in production was a unique index on the slot, not a check in the handler.",
  },
  {
    n: "02",
    title: "Measure before you claim.",
    sub: "Every number on this page came out of a system that ran.",
    body: "5,000 orders a second is a local load test, and it says so. The 10/10 on the salon agent is an eval script in the repo you can run yourself.",
  },
  {
    n: "03",
    title: "Ship the whole thing.",
    sub: "Build, containerise, deploy, hand off.",
    body: "Releases went from 40 minutes to 5 because I owned the pipeline too — Docker, automated AWS deploys, and a runbook someone else could follow.",
  },
  {
    n: "04",
    title: "Ground the model.",
    sub: "An agent that cannot invent a price is worth more than one that sounds clever.",
    body: "System prompts, tool-calling and retrieval keep the LLM inside what is true: it books real slots, quotes real prices, and says “I don't know” when the documents don't cover it.",
  },
];

export const STACK = [
  {
    group: "Frontend",
    blurb:
      "Interfaces that stay correct while the data underneath them changes.",
    tools: [
      "TypeScript",
      "React",
      "Next.js",
      "React Native (Expo)",
      "Redux · Zustand",
      "TanStack Query",
      "Tailwind CSS",
    ],
  },
  {
    group: "Backend",
    blurb: "Boring, observable services with explicit contracts.",
    tools: [
      "Node.js",
      "NestJS · Express",
      "Prisma",
      "REST APIs",
      "WebSockets",
      "JWT auth",
      "Python · FastAPI",
    ],
  },
  {
    group: "Data",
    blurb: "The invariant lives in the database, not in the handler.",
    tools: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "TimescaleDB",
      "ChromaDB",
      "SQLite",
    ],
  },
  {
    group: "Applied AI",
    blurb: "Agents that take real actions and stay inside what is true.",
    tools: [
      "Gemini API",
      "Tool-calling agents",
      "RAG · vector search",
      "Prompt pipelines",
      "Structured output",
      "Eval harnesses · guardrails",
    ],
  },
  {
    group: "Cloud & DevOps",
    blurb: "If it is not in a pipeline, it has not shipped.",
    tools: [
      "AWS (EC2, S3, IAM, CodePipeline)",
      "Docker",
      "GitHub Actions CI/CD",
      "Render · Vercel",
      "Jest · Vitest",
    ],
  },
];

export const ABOUT = {
  heading: "Strongest on correctness under concurrency.",
  quote:
    "Anyone can make it work once. The engineering is in the second time — under load, at three in the morning, when nobody is watching.",
  paragraphs: [
    "I started with a BCA at GGSIPU in Delhi and a question that never went away: what happens when a hundred people press the same button at the same moment. Most of what I have built since is an answer to that — booking, payments, access control — the parts people only notice when they break.",
    "At UnQue I went from intern to leading a team of four, shipping booking, payroll, attendance and role-based access for a salon SaaS across 40 businesses. At Rocket Health I prototyped the scheduler to replace Calendly, with double-booking prevented by a database invariant. Along the way I rebuilt a release pipeline so a deploy took five minutes instead of forty.",
    "Lately the interesting problems sit where LLMs meet real systems: agents that take actions, retrieval that cites its sources, evals that catch regressions. I like the boring parts of the stack, so the product can be the exciting part.",
  ],
  now: [
    "Shipping Salon Concierge — a Telegram booking agent with an automated eval",
    "Running AskDocs, a RAG service with a tool-calling agent, on Render",
    "Looking for a full-stack or applied-AI team to join — immediately",
  ],
  status: "Available · immediate joiner",
};

/* appended after the roles that come from the admin dashboard */
export const EDUCATION = {
  id: "edu",
  when: "Sep 2023 — May 2026",
  org: "Guru Gobind Singh Indraprastha University",
  role: "Bachelor of Computer Applications · CGPA 8.4/10",
  where: "Delhi",
  description:
    "JIMS Vasant Kunj. Where the question about a hundred people pressing the same button started.",
  tech: [],
};

/* where each role happened; the admin dashboard does not store this */
export const ROLE_PLACES = {
  "Rocket Health": "Bengaluru · on-site",
  UnQue: "Remote",
  "OPM Corporation": "Remote",
};

export const RECOMMENDATIONS = [
  {
    name: "Krishna Vamsee",
    role: "Co-Founder, UnQue",
    meta: "Managed Chirag directly · August 2026",
    text: "I had the opportunity to manage Chirag during his time at UnQue, where he worked as part of our engineering team and contributed to several areas of our product and backend systems. During his time with us, he worked with technologies including Node.js, TypeScript, MongoDB, and APIs, and was involved in production workflows across bookings, payments, memberships, referrals, and other business-critical features. As his manager, I found Chirag to be a curious and dedicated developer who was willing to take ownership of tasks, investigate issues deeply, and work through complex problems in an evolving product environment. He consistently showed a strong willingness to learn, improve his technical understanding, and take on new challenges. I appreciate his contributions to the team and wish him the very best in his future career.",
  },
  {
    name: "Manika Bhutani",
    role: "Business Owner · Artist",
    meta: "Client · August – September 2025",
    text: "Chirag interned and worked with my small business on a project focused on building, integrating, and testing website during August and September 2025. Throughout this time, he demonstrated curiosity and a strong desire to contribute, offering various solutions. He possesses a good understanding of backend technologies, custom software and relevant industry knowledge. I endorse him for his practical skills and knowledge. Best of luck with all your future pursuits.",
  },
];

export const CONTACT = {
  heading: "Let's build something that survives real traffic.",
  body: "Open to full-stack and applied-AI roles — immediate joiner, open to relocate. Email is the fastest way to reach me, and I reply within a day.",
};
