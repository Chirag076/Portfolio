import React, { createContext, useState, useEffect, useContext } from 'react';

const defaultProjects = [
  {
    id: "01",
    title: "🗨️ Talksy – Fullstack Chat App",
    description: "A real-time chat application built with React, Node.js, and MongoDB. Features secure authentication, responsive UI, and 1-to-1 messaging with Zustand state management.",
    image: "/images/talksy.png",
    link: "https://github.com/Chirag076/Talksy",
  }
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
    role: "Software Developer intern",
    company: "UnQue",
    duration: "Jul 2025 – Present",
    description: "Fixed bugs and implemented new APIs and features, ensuring smooth functionality and system reliability. Focused on deployment efficiency, code quality, and optimizing performance across applications.",
    tech: ["React", "TypeScript", "TailwindCSS", "Node.js", "MongoDB"],
    glow: "from-pink-500 via-purple-500 to-orange-400",
  },
  {
    id: 2,
    role: "Software Developer intern",
    company: "OPM Corporation",
    duration: "Jul 2025 – Oct 2025",
    description: "Built responsive and interactive user interfaces using React, TypeScript, and TailwindCSS. Focused on performance, accessibility, and delivering a consistent user experience across web platforms.",
    tech: ["React", "TypeScript", "TailwindCSS", "Node.js", "MongoDB"],
    glow: "from-orange-400 via-yellow-400 to-pink-500",
  }
];

const defaultSocialLinks = {
  github: "https://github.com/Chirag076",
  linkedin: "https://linkedin.com/in/chirag-parmar-b2713824b/",
  twitter: "https://twitter.com/",
  instagram: "https://instagram.com/",
  email: "mailto:chiragparmar076@gmail.com"
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
      showResume, setShowResume
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
