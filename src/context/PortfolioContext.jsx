import React, { createContext, useState, useEffect, useContext } from 'react';

const defaultProjects = [
  {
    id: "01",
    title: "Market-Exchange",
    description:
      "A trading exchange modelled on the Binance API, serving mock local pairs alongside live pairs proxied from Backpack. Orders match in a single-node in-memory engine \u2014 5,000 a second at sub-5ms \u2014 while durability stays off the hot path through 3-second snapshots and a Redis replay queue.",
    image: "/images/market-exchange.png",
    link: "https://github.com/Chirag076/market-exchange-project",
  },
  {
    id: "02",
    title: "Talksy",
    description:
      "Real-time messaging with instant delivery, typing indicators, presence and persistent history. The interesting work was the state layer \u2014 restructured so an incoming message re-renders the conversation you are reading, not the entire list behind it.",
    image: "/images/talksy.png",
    link: "https://github.com/Chirag076/Talksy",
  },
];

const defaultServices = [
  {
    id: "01",
    title: "Full-Stack Development",
    description: "I design and develop complete web solutions — from modern frontends to robust backends, ensuring seamless integration and performance.",
  },
  {
    id: "02",
    title: "App Development",
    description: "I build fast, responsive, and user-friendly mobile apps using React Native and modern APIs for a smooth cross-platform experience.",
  },
  {
    id: "03",
    title: "DevOps & Deployment",
    description: "I automate workflows, manage cloud deployments, and optimize CI/CD pipelines to keep applications reliable and scalable.",
  },
];

const defaultExperience = [
  {
    id: 1,
    role: "Full Stack Engineering Intern",
    company: "Rocket Health",
    duration: "Aug 2026 \u2013 Present",
    description:
      "Replaced 6 per-product API calls and 7 client transformers with a single endpoint, cutting 450 lines and a manual per-environment step that left new environments rendering blank. Built a slot-expiry countdown with auto-cancellation in the React Native checkout, covered by Jest unit tests.",
    tech: ["NestJS", "Prisma", "PostgreSQL", "React Native", "TanStack Query"],
    glow: "from-pink-500 via-purple-500 to-orange-400",
  },
  {
    id: 2,
    role: "Software Developer",
    company: "UnQue",
    duration: "Jul 2025 \u2013 Aug 2026",
    description:
      "Shipped booking, referrals, attendance tracking, analytics and role-based access for a salon platform serving 40 businesses and 10,000 appointments a month. Eliminated a double-booking race with a unique database constraint, and cut releases from a manual 40 minutes to 5 with Docker and automated AWS deploys.",
    tech: ["Node.js", "MongoDB", "React", "Docker", "AWS"],
    glow: "from-purple-500 via-pink-500 to-orange-400",
  },
  {
    id: 3,
    role: "Software Developer Intern",
    company: "OPM Corporation",
    duration: "Jul 2025 \u2013 Oct 2025",
    description:
      "Delivered three flows end to end from Figma designs \u2014 authentication, profile management and reporting \u2014 as responsive React interfaces, and extracted shared UI into reusable components adopted across later features.",
    tech: ["React", "TypeScript", "TailwindCSS"],
    glow: "from-orange-400 via-pink-500 to-purple-500",
  },
];

const defaultSocialLinks = {
  github: "https://github.com/Chirag076",
  linkedin: "https://linkedin.com/in/chirag-parmar-b2713824b/",
  twitter: "https://twitter.com/",
  instagram: "https://instagram.com/",
  email: "mailto:chiragchhabrahmo@gmail.com"
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
    telegramChatId: ""
  });

  // FETCH FROM MONGODB API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        if (data.projects) setProjects(data.projects);
        if (data.services) setServices(data.services);
        if (data.experience) setExperience(data.experience);
        if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
        if (data.visitorCount !== undefined) setVisitorCount(data.visitorCount);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
        if (data.has2FA !== undefined) setHas2FA(data.has2FA);
        if (data.notifications) setNotifications(data.notifications);
      } catch (err) {
        console.error("Failed to fetch from DB, using defaults.", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [showSecrets, setShowSecrets] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const trackEvent = async (event, metadata = {}) => {
    try {
      const sessionRef = sessionStorage.getItem('recruiter_ref');
      const finalMetadata = {
        ref: sessionRef || undefined,
        ...metadata
      };

      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, metadata: finalMetadata })
      });
    } catch (err) {
      console.error("Failed to log tracking event:", err);
    }
  };

  return (
    <PortfolioContext.Provider value={{
      projects, setProjects,
      services, setServices,
      experience, setExperience,
      maintenanceMode, setMaintenanceMode,
      visitorCount, setVisitorCount,
      socialLinks, setSocialLinks,
      has2FA,
      isLoading,
      showSecrets, setShowSecrets,
      showResume, setShowResume,
      showTerminal, setShowTerminal,
      notifications, setNotifications,
      trackEvent
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
