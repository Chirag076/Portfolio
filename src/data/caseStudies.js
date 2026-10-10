/* One case study per curated project, keyed by slug. Every number here is
   one that came out of the project itself (an eval run, a benchmark, a
   config value) — nothing is estimated. Sections render in order. */

export const CASE_STUDIES = {
  "salon-concierge": {
    slug: "salon-concierge",
    title: "Salon Concierge",
    kicker: "Applied AI",
    art: "salon",
    headline: "A Telegram concierge that books salon appointments, safely.",
    intro:
      "Customers of a salon message a bot on Telegram in plain language. The agent answers questions about services and hours, collects the details it needs, and then takes real actions — booking, rescheduling or cancelling — on a SQLite database through Gemini tool-calling. It is guardrailed so it never invents a price or a slot, and an automated eval checks that it stays that way.",
    facts: [
      ["Role", "Solo — design, build, eval"],
      ["Timeline", "October 2026"],
      ["Status", "Runs locally · live demo on request"],
      ["Stack", "Python · Gemini API · pyTelegramBotAPI · SQLite"],
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Chirag076/salonConciergeBot" },
      { label: "Demo video", href: "https://drive.google.com/file/d/14jerL5v7q92tbmNTvLsdB3axggYMKE9h/view?usp=sharing" },
      { label: "@salonConciergeBot", href: "https://t.me/salonConciergeBot" },
    ],
    metrics: [
      { value: "10/10", label: "eval scenarios passed", sub: "bookings · reschedule · cancel · guardrails" },
      { value: "3", label: "tools the agent can call", sub: "book · reschedule · cancel" },
      { value: "2", label: "guardrail tests in the eval", sub: "off-menu requests must be refused" },
      { value: "1", label: "conversation per customer", sub: "state kept per Telegram chat" },
    ],
    sections: [
      {
        n: "01",
        title: "Problem",
        lead: "Could a model take a booking end to end without making anything up?",
        body: [
          "At UnQue I watched bookings grow 3× once customers could book from a chat instead of a form. The obvious next step was to let a language model hold that conversation. The obvious risk was everything a model is bad at: quoting a price that does not exist, confirming a slot it never checked, and losing the thread halfway through a multi-step request.",
          "So the brief was narrow on purpose: one salon, a fixed menu, three actions, and a way to prove the agent stays inside the lines.",
        ],
      },
      {
        n: "02",
        title: "What I built",
        lead: "A concierge with a short menu, three tools and a memory per customer.",
        body: [
          "The bot runs on Telegram through pyTelegramBotAPI. Every customer gets their own Gemini chat session, created on first contact with a system prompt that holds the persona, the full service menu with prices, the opening hours, and the rules — collect the name, service, date and time before booking; never quote a service or price that is not on the menu.",
          "The agent has exactly three tools: book_appointment(name, service, date, time), reschedule_appointment(booking_id, new_date, new_time) and cancel_appointment(booking_id). They are plain Python functions that write to a SQLite table; Gemini's automatic function calling decides when to call them and the bot relays the result in plain language. A /bookings command lists what is in the database.",
        ],
        list: [
          "Natural-language chat — no forms, no button menus",
          "Answers about services, prices and hours from the system prompt",
          "Books, reschedules and cancels by booking ID through tool calls",
          "Remembers the conversation, so “book that for Saturday” works after a price question",
        ],
      },
      {
        n: "03",
        title: "Architecture",
        lead: "The model decides; the tools act; the database is the only thing that changes.",
        diagram: [
          { label: "Telegram", sub: "customer message" },
          { label: "Bot (polling)", sub: "one chat session per user" },
          { label: "Gemini", sub: "system prompt + 3 tools" },
          { label: "Tool call", sub: "book · reschedule · cancel" },
          { label: "SQLite", sub: "bookings table" },
        ],
        body: [
          "The important line is between the model and the database. The model never touches it directly — it can only ask for one of three named actions with typed arguments, and each of those functions makes exactly one well-defined change. That is what makes the guardrails real rather than a polite request in the prompt.",
        ],
      },
      {
        n: "04",
        title: "The hard parts",
        lead: "Grounding, memory, and the free tier.",
        body: [
          "Grounding. Without the menu in front of it, a model will happily invent a “Rs 500 hair spa”. The fix is structural: the menu lives in the system prompt as the single source of truth, the rules forbid anything off it, and because state only changes through the tools, a wrong answer can embarrass the bot but cannot corrupt a booking.",
          "Memory. A booking is a multi-turn exchange, so each customer keeps a Gemini chat session rather than a one-shot prompt. “Actually make it 5 PM” resolves against the booking just discussed.",
          "The free tier. Gemini's free quota is 5 requests a minute and 20 a day on the model I started with, and two models were deprecated while I was building. The eval pauses 12 seconds between calls to stay under the limit, and the chat model is gemini-3.5-flash-lite — chosen by listing what the API actually offered that day, not by what the docs said.",
        ],
      },
      {
        n: "05",
        title: "Proof",
        lead: "An eval that runs the real agent against the real database.",
        body: [
          "eval.py imports the bot, fires ten scenarios through fresh agent sessions and checks the SQLite table after each one: a booking must add exactly one row for the right customer, a reschedule must change the time of the right row, a cancel must delete it, and a request for something off the menu must leave the table untouched. It cleans up its own rows afterwards. The last run passed 10/10.",
        ],
        table: {
          head: ["#", "Scenario", "Expect", "Result"],
          rows: [
            ["01", "Book a women's haircut for Riya on Saturday at 3 PM", "+1 row · Riya", "PASS"],
            ["02", "Hair spa for Aman this Sunday at 5 PM", "+1 row · Aman", "PASS"],
            ["03", "Facial for Neha on Friday at 11 AM", "+1 row · Neha", "PASS"],
            ["04", "Bridal makeup for Priya on Saturday at noon", "+1 row · Priya", "PASS"],
            ["05", "Men's haircut for Karan, Tuesday 6 PM", "+1 row · Karan", "PASS"],
            ["06", "Manicure for Sana on Wednesday at 2 PM", "+1 row · Sana", "PASS"],
            ["07", "Book a pedicure, then reschedule it to Sunday 4 PM", "same row · time changed", "PASS"],
            ["08", "Book a hair colour, then cancel it", "row deleted", "PASS"],
            ["09", "“Do you do tattoos?”", "no row added", "PASS"],
            ["10", "Book a full body massage (not on the menu)", "no row added", "PASS"],
          ],
        },
      },
      {
        n: "06",
        title: "What I would do next",
        body: [
          "A check_availability tool so the agent cannot double-book a slot or book outside opening hours; lookup by phone number instead of booking ID; Postgres instead of SQLite; an always-on deployment; and WhatsApp, where the customers actually are.",
        ],
      },
    ],
  },

  "market-exchange": {
    slug: "market-exchange",
    title: "Market-Exchange",
    kicker: "Trading infrastructure",
    art: "exchange",
    headline: "A Binance-style exchange, with the matching engine running in this page.",
    intro:
      "A trading exchange modelled on the Binance API, serving mock local pairs alongside live pairs proxied from Backpack. Orders match in a single-node in-memory engine — about 5,000 a second at sub-5 ms in a local load test — while durability stays off the hot path through 3-second state snapshots and a Redis replay queue. The engine is below; it runs on your CPU.",
    facts: [
      ["Role", "Solo — engine, API, WebSocket service, UI"],
      ["Status", "Runs locally with Docker · demo video"],
      ["Stack", "Next.js · TypeScript · Redis · TimescaleDB · WebSockets · Docker"],
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Chirag076/market-exchange-project" },
      { label: "Architecture", href: "https://github.com/Chirag076/market-exchange-project/blob/main/frontend/public/images/Architecture.png" },
      { label: "Demo video", href: "https://drive.google.com/file/d/1J85XPY4Rg0yfMa2dtCm4BLFw9kH5Vy0S/view?usp=sharing" },
    ],
    metrics: [
      { value: "5,000", label: "orders a second", sub: "whole system · local load test" },
      { value: "<5 ms", label: "to match an order", sub: "in-memory, price-time priority" },
      { value: "3 s", label: "between state snapshots", sub: "book + balances, restored on restart" },
      { value: "0", label: "database writes on the hot path", sub: "durability runs beside it, not in it" },
    ],
    sections: [
      {
        n: "01",
        title: "Problem",
        lead: "An exchange has to match faster than it can write, and still never lose a trade.",
        body: [
          "A matching engine that waits for a database round-trip on every order is capped by the database. One that does not wait can lose orders when it crashes. The whole design question is how to be fast on the hot path and still durable, on one node, with tools I could run on a laptop.",
        ],
      },
      {
        n: "02",
        title: "What I built",
        lead: "An in-memory engine with everything else arranged around it.",
        body: [
          "The engine keeps one order book per pair in memory and matches with price-time priority: limit orders, partial fills, and locked-balance accounting so a user's quote balance is reserved at placement and cannot be spent twice. It is a single process by design — no locks, no coordination, every order handled in arrival order.",
          "The API never calls the engine directly. Orders go in through a Redis list queue and results come back out through another, which decouples the HTTP layer from the matching loop. Depth and trade updates fan out over Redis pub/sub to a WebSocket service that streams ticker, candlestick and depth channels with Binance-compatible message shapes, so standard client code works against it. A market-maker service places and cancels orders continuously to keep the book alive, and TimescaleDB keeps the trade and candle history.",
        ],
        list: [
          "Limit orders, partial fills, locked-balance accounting",
          "Redis list queues in and out of the engine; pub/sub fan-out to WebSockets",
          "Ticker, candlestick and depth streams with per-socket subscribe and unsubscribe",
          "Mock local pairs plus live pairs proxied from Backpack",
        ],
      },
      {
        n: "03",
        title: "Architecture",
        lead: "One hot loop, with queues on both sides and a snapshot beside it.",
        diagram: [
          { label: "API", sub: "Next.js routes" },
          { label: "Redis queue", sub: "orders in" },
          { label: "Engine", sub: "in-memory book · snapshot every 3 s" },
          { label: "Redis pub/sub", sub: "depth · trades · ticker" },
          { label: "WebSocket service", sub: "Binance-shaped messages" },
        ],
        body: [
          "Durability is a side process: every three seconds the engine checkpoints its full state — order books and user balances — and on restart it restores the last checkpoint and replays whatever the queue received after it. That is how the hot path gets to skip the database entirely without the system forgetting anything on a crash.",
        ],
      },
      {
        n: "04",
        title: "The hard parts",
        lead: "Correctness under concurrency, with no database to lean on.",
        body: [
          "Balances. The easy bug is letting two orders spend the same money because both were accepted before either filled. Locking the balance at placement — and unlocking exactly the unfilled remainder on cancel — is simple to state and easy to get wrong in the partial-fill cases, which is where most of the careful work went.",
          "Recovery. A snapshot plus a replay queue sounds complete until you ask what happens to an order that arrived during the snapshot. The answer is to treat the queue as the source of truth: restore the last snapshot, then replay everything that arrived after it, so nothing that reached the queue is lost.",
        ],
      },
      {
        n: "05",
        title: "Proof",
        lead: "The matcher itself, running in your browser.",
        body: [
          "This is the same order-book algorithm, ported to JavaScript and matching a stream of random orders while you read. “Benchmark it” warms the JIT with 8,000 orders, resets the book, then times 50,000 fresh ones on your machine. It is the bare matcher only — the 5,000 a second above is the whole system under simulated traffic, with the network, WebSocket fan-out and snapshotting included.",
        ],
        engine: true,
      },
      {
        n: "06",
        title: "What I would do next",
        body: [
          "Market and stop orders; a second engine node that takes over from the replay queue; a proper account and auth layer; and the load test moved from one laptop to something that looks like production.",
        ],
      },
    ],
  },

  askdocs: {
    slug: "askdocs",
    title: "AskDocs",
    kicker: "RAG",
    art: "askdocs",
    headline: "Ask questions of your own documents, and get an answer that cites them.",
    intro:
      "Upload PDFs or text and a FastAPI service chunks and embeds them into ChromaDB. Ask a question and the service retrieves the closest passages, answers from them, and says “I don't know” when they do not cover it. A second mode hands the retrieval to a Gemini agent that decides for itself when to search. Dockerised and deployed on Render.",
    facts: [
      ["Role", "Solo"],
      ["Timeline", "October 2026"],
      ["Status", "Live on Render's free tier — the first request after idle can take about 50 s to wake"],
      ["Stack", "Python · FastAPI · ChromaDB · Gemini (gemini-embedding-001, gemini-3.5-flash-lite) · pypdf · Docker"],
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Chirag076/askdocs" },
      { label: "Live API docs", href: "https://askdocs-axen.onrender.com/docs" },
    ],
    metrics: [
      { value: "7", label: "endpoints", sub: "chat · ingest · ingest-file · search · ask · agent · reset" },
      { value: "1", label: "vector store", sub: "ChromaDB, cosine similarity" },
      { value: "2", label: "tools in the agent", sub: "search_documents · get_today_date" },
      { value: "~50 s", label: "cold start on the free tier", sub: "then normal speed" },
    ],
    sections: [
      {
        n: "01",
        title: "Problem",
        lead: "Models answer confidently about documents they have never seen.",
        body: [
          "Ask a model about your contract and it will answer — from training data, from pattern-matching, from nowhere. Retrieval-augmented generation fixes that by giving the model the actual passages and telling it to stay inside them. I wanted to build the whole pipeline by hand, not through a framework, so I understood every step that can go wrong.",
        ],
      },
      {
        n: "02",
        title: "What I built",
        lead: "Ingest, search, ask — and an agent that chooses when to search.",
        body: [
          "Ingest accepts raw text or a PDF (read with pypdf), splits it into chunks, embeds each chunk with gemini-embedding-001 and stores the vectors and text in a persistent ChromaDB collection. Search embeds the question the same way and returns the nearest chunks with their similarity scores. Ask does the retrieval, builds a prompt from the passages, and answers with one rule: if the passages do not contain the answer, say “I don't know”.",
          "Agent is the interesting one. Instead of always retrieving, the model gets search_documents and get_today_date as tools and decides whether to call them — so a greeting gets a greeting, and a question about the uploaded files gets a search first. Chat is a plain model call with no retrieval, kept so the difference is easy to show.",
        ],
        list: [
          "POST /ingest and /ingest-file — chunk, embed, store",
          "POST /search — nearest passages with scores",
          "POST /ask — grounded answer, or “I don't know”",
          "POST /agent — tool-calling: the model decides when to search",
        ],
      },
      {
        n: "03",
        title: "Architecture",
        lead: "Two paths through one small service.",
        diagram: [
          { label: "Client", sub: "text or PDF" },
          { label: "FastAPI", sub: "chunk · validate" },
          { label: "Gemini embeddings", sub: "gemini-embedding-001" },
          { label: "ChromaDB", sub: "persistent collection" },
          { label: "Gemini", sub: "answer from passages" },
        ],
        body: [
          "On ingest the data flows left to right and stops at the store. On a question the same embedding model turns the question into a vector, ChromaDB returns the closest chunks, and only then does the chat model see anything — with the passages in its prompt and the instruction to refuse when they are not enough.",
        ],
      },
      {
        n: "04",
        title: "The hard parts",
        lead: "Quotas, deprecations and a disk that forgets.",
        body: [
          "The Gemini free tier allows 5 requests a minute and 20 a day on the first model I used, and the model names moved under me twice during the build — one was retired, one was closed to new users. The fix was unglamorous: list the models the key can actually reach, pick the cheapest chat model that works, and keep the embedding model separate so a chat-model change never invalidates the index.",
          "Gemini's automatic function calling warns when you use it through a one-shot generate call, so the agent runs in a chat session instead. And Render's free tier has an ephemeral disk: the ChromaDB index lives in the container, so a redeploy or a restart starts empty. That is fine for a demo and documented in the README, and it is the first thing a paid tier would fix.",
        ],
      },
      {
        n: "05",
        title: "Proof",
        lead: "Search returns the passage; ask refuses when it should.",
        code: `POST /search   { "query": "What was my role at UnQue?" }
→ [{ "text": "Software Developer, UnQue … booking, referrals …", "score": 0.606 }]

POST /ask      { "question": "Who won the 2022 World Cup?" }
→ { "answer": "I don't know." }     // nothing in the documents covers it`,
        body: [
          "The 0.606 above is a cosine score against an uploaded résumé; the refusal is the rule in the prompt doing its job. Both are reproducible against the live API once it has woken up.",
        ],
      },
      {
        n: "06",
        title: "What I would do next",
        body: [
          "A password on the write endpoints; hybrid retrieval (BM25 plus vectors) with a reranker; streaming answers; and a persistent disk so the index survives a redeploy.",
        ],
      },
    ],
  },

  talksy: {
    slug: "talksy",
    title: "Talksy",
    kicker: "Real-time",
    art: "talksy",
    headline: "Messaging that re-renders one conversation, not the whole list.",
    intro:
      "Real-time one-to-one messaging with instant delivery, typing indicators, online presence and persistent history. The interesting work was the state layer: it was restructured so an incoming message re-renders the conversation you are reading, not the entire list behind it.",
    facts: [
      ["Role", "Solo"],
      ["Status", "Runs locally"],
      ["Stack", "React · Node.js · Socket.IO · MongoDB · Zustand"],
    ],
    links: [{ label: "GitHub", href: "https://github.com/Chirag076/Talksy" }],
    metrics: [
      { value: "1:1", label: "messaging", sub: "with persistent history" },
      { value: "3", label: "live signals", sub: "delivery · typing · presence" },
      { value: "1", label: "re-render per message", sub: "the open conversation only" },
    ],
    sections: [
      {
        n: "01",
        title: "Problem",
        lead: "Chat interfaces get slower the more conversations you have.",
        body: [
          "The naive version keeps every conversation in one big state object. Every incoming message touches that object, and every component that reads it re-renders — the list, the open thread, the unread badges, all of it. With a handful of chats it is invisible; with a few hundred messages it is a visible stutter on every keystroke of the person you are talking to.",
        ],
      },
      {
        n: "02",
        title: "What I built",
        lead: "Socket events in, one slice of state per conversation out.",
        body: [
          "A Node and Socket.IO server handles authentication, message delivery, typing events and presence, with MongoDB keeping the history so a reload shows the full thread. The React client uses Zustand with state split per conversation, so a message event updates only the slice for its thread; the list re-renders only when its summary (last message, unread count) actually changes.",
        ],
        list: [
          "Instant delivery over Socket.IO with persistent history in MongoDB",
          "Typing indicators and online presence",
          "Per-conversation state slices — the open thread re-renders, the list does not",
          "Authentication and a responsive one-to-one layout",
        ],
      },
      {
        n: "03",
        title: "Architecture",
        diagram: [
          { label: "React client", sub: "Zustand · one slice per thread" },
          { label: "Socket.IO", sub: "message · typing · presence" },
          { label: "Node server", sub: "auth · rooms" },
          { label: "MongoDB", sub: "message history" },
        ],
      },
      {
        n: "04",
        title: "The hard parts",
        lead: "Deciding what a message is allowed to touch.",
        body: [
          "The fix is less about Zustand than about discipline. The rule I settled on: a message event may change exactly two things — its own thread's messages, and that thread's row in the list summary. Everything else reads through selectors that return the same reference unless their slice changed. Once that rule held, the stutter went away without any memoisation tricks.",
        ],
      },
      {
        n: "05",
        title: "What I would do next",
        body: ["Group conversations, read receipts, and message search over the MongoDB history."],
      },
    ],
  },
};

export const CASE_STUDY_ORDER = ["salon-concierge", "market-exchange", "askdocs", "talksy"];

export const slugFor = (title = "") =>
  ({
    "salon concierge": "salon-concierge",
    "market-exchange": "market-exchange",
    "market exchange": "market-exchange",
    askdocs: "askdocs",
    talksy: "talksy",
  })[title.trim().toLowerCase()] || null;
