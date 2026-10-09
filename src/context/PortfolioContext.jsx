import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

/* The curated list. The admin dashboard can edit any of these (matched by
   title) and add more; it cannot make one of them disappear, because the
   page is designed around them. */
const defaultProjects = [
  {
    id: "01",
    title: "Salon Concierge",
    description:
      "An agent on Telegram that books, reschedules and cancels salon appointments through plain chat, taking real actions on a SQLite database via Gemini tool-calling. Guardrailed so it never invents a price or a slot, with per-user state for multi-step flows — verified by an automated eval passing 10/10 scenarios.",
    image: "",
    link: "https://github.com/Chirag076/salonConciergeBot",
  },
  {
    id: "02",
    title: "Market-Exchange",
    description:
      "A trading exchange modelled on the Binance API, serving mock local pairs alongside live pairs proxied from Backpack. Orders match in a single-node in-memory engine — 5,000 a second at sub-5ms — while durability stays off the hot path through 3-second snapshots and a Redis replay queue.",
    image: "/images/market-exchange.webp",
    link: "https://github.com/Chirag076/market-exchange-project",
  },
  {
    id: "03",
    title: "AskDocs",
    description:
      "Upload PDFs or text and a FastAPI service chunks and embeds them into ChromaDB. A Gemini agent decides when to search, answers from the retrieved passages, and says “I don't know” when they don't cover the question. Dockerised and deployed on Render.",
    image: "",
    link: "https://github.com/Chirag076/askdocs",
  },
  {
    id: "04",
    title: "Talksy",
    description:
      "Real-time messaging with instant delivery, typing indicators, presence and persistent history. The interesting work was the state layer — restructured so an incoming message re-renders the conversation you are reading, not the entire list behind it.",
    image: "/images/talksy.webp",
    link: "https://github.com/Chirag076/Talksy",
  },
];

const defaultServices = [
  {
    id: "01",
    title: "Full-Stack Development",
    description:
      "Complete web products — from the interface to the API to the database — built to stay correct once real traffic shows up.",
  },
  {
    id: "02",
    title: "App Development",
    description:
      "Fast, responsive mobile apps with React Native and modern APIs for a smooth cross-platform experience.",
  },
  {
    id: "03",
    title: "DevOps & Deployment",
    description:
      "Containerised builds, automated cloud deploys and CI/CD pipelines that keep releases boring.",
  },
];

const defaultExperience = [
  {
    id: 1,
    role: "Full Stack Engineering Intern",
    company: "Rocket Health",
    duration: "Aug 2026 – Sep 2026",
    description:
      "Prototyped the in-house scheduler to replace Calendly — availability engine, round-robin assignment and Google Calendar integration, with double-booking prevented by a database invariant. Closed two revenue leaks in the React Native checkout (a coupon redeemable more than once, payments against lapsed reservations) with redemption validation and a slot-expiry countdown, covered by Jest. Cut product-bundle loading from 6 API calls to 1 with a single NestJS and Prisma endpoint.",
    tech: ["NestJS", "Prisma", "PostgreSQL", "React Native", "TanStack Query"],
  },
  {
    id: 2,
    role: "Software Developer",
    company: "UnQue",
    duration: "Jul 2025 – Aug 2026",
    description:
      "Grew from intern to leading a team of four. Shipped booking, payroll, attendance and role-based access for a salon SaaS of 40 businesses, where the booking bot I shipped grew bookings 3× to 10,000 a month over five months. Eliminated a production double-booking race with a unique database constraint, and cut releases from 40 minutes to 5 by containerising with Docker and automating AWS deploys.",
    tech: ["Node.js", "MongoDB", "React", "Docker", "AWS"],
  },
  {
    id: 3,
    role: "Software Developer Intern",
    company: "OPM Corporation",
    duration: "Jul 2025 – Oct 2025",
    description:
      "Delivered three flows end to end from Figma designs — authentication, profile management and reporting — as responsive React interfaces, and extracted shared UI into reusable components adopted across later features.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
  },
];

const defaultSocialLinks = {
  github: "https://github.com/Chirag076",
  linkedin: "https://www.linkedin.com/in/chirag-chhabra07/",
  twitter: "",
  instagram: "https://www.instagram.com/chirag_chhabra07/",
  email: "mailto:chiragchhabrahmo@gmail.com",
};

/* old PNG paths saved in the database point at files that no longer exist */
const fixImage = (src = "") => src.replace(/\.png$/i, ".webp");

const mergeProjects = (defaults, saved) => {
  if (!Array.isArray(saved) || saved.length === 0) return defaults;
  const byTitle = new Map(
    saved.map((p) => [
      String(p.title || "")
        .trim()
        .toLowerCase(),
      p,
    ]),
  );
  const merged = defaults.map((d) => {
    const s = byTitle.get(d.title.toLowerCase());
    if (!s) return d;
    byTitle.delete(d.title.toLowerCase());
    return {
      ...d,
      ...s,
      image: fixImage(s.image || d.image),
      link: s.link || d.link,
    };
  });
  for (const extra of byTitle.values())
    merged.push({ ...extra, image: fixImage(extra.image) });
  return merged;
};

export const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [projects, setProjects] = useState(defaultProjects);
  const [services, setServices] = useState(defaultServices);
  const [experience, setExperience] = useState(defaultExperience);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [has2FA, setHas2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    discordWebhookUrl: "",
    telegramBotToken: "",
    telegramChatId: "",
  });
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/content");
        const data = await res.json();
        if (data.projects)
          setProjects(mergeProjects(defaultProjects, data.projects));
        if (data.services) setServices(data.services);
        if (Array.isArray(data.experience) && data.experience.length)
          setExperience(data.experience);
        if (data.maintenanceMode !== undefined)
          setMaintenanceMode(data.maintenanceMode);
        if (data.visitorCount !== undefined) setVisitorCount(data.visitorCount);
        if (data.socialLinks)
          setSocialLinks({ ...defaultSocialLinks, ...data.socialLinks });
        if (data.has2FA !== undefined) setHas2FA(data.has2FA);
        if (data.notifications) setNotifications(data.notifications);
      } catch (err) {
        /* no database reachable (local dev, or an outage): the defaults above are the page */
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const trackEvent = useCallback(async (event, metadata = {}) => {
    try {
      const sessionRef = sessionStorage.getItem("recruiter_ref");
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          metadata: { ref: sessionRef || undefined, ...metadata },
        }),
      });
    } catch (err) {
      /* analytics must never break the page */
    }
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        setProjects,
        services,
        setServices,
        experience,
        setExperience,
        maintenanceMode,
        setMaintenanceMode,
        visitorCount,
        setVisitorCount,
        socialLinks,
        setSocialLinks,
        has2FA,
        isLoading,
        showResume,
        setShowResume,
        notifications,
        setNotifications,
        trackEvent,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
