import React, { useEffect, Suspense, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminLogin from "./components/AdminPage";
import AdminDashboard from "./components/AdminDashboard";
import Landing from "./components/Landing";
import NotFound from "./components/NotFound";
import { Loader } from "lucide-react";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import ContextMenu from "./components/ContextMenu";
import SoundEngine from "./components/SoundEngine";
import SnakeGame from "./components/SnakeGame";
import SecretsGuide from "./components/SecretsGuide";
import TerminalConsole from "./components/TerminalConsole";
import ResumeViewer from "./components/ResumeViewer";
import Maintenance from "./components/Maintenance";
import { usePortfolio } from "./context/PortfolioContext";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

const App = () => {
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const { showSecrets, setShowSecrets, showResume, setShowResume, maintenanceMode, showTerminal, setShowTerminal, trackEvent } = usePortfolio();

  // Track initial recruiter visits and general session visits
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('source') || params.get('utm_source');
    const storedRef = sessionStorage.getItem('recruiter_ref');
    const sessionVisited = sessionStorage.getItem('portfolio_session_visited');

    if (ref && ref !== storedRef) {
      sessionStorage.setItem('recruiter_ref', ref);
      trackEvent('portfolio_visit', { ref });
      sessionStorage.setItem('portfolio_session_visited', 'true');
    } else if (!sessionVisited) {
      trackEvent('portfolio_visit');
      sessionStorage.setItem('portfolio_session_visited', 'true');
    }
  }, [trackEvent]);

  useEffect(() => {
    let originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "👀 Come back soon!";
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // EASTER EGG KEYBOARD LISTENER
    let typedStr = "";
    /* e.key is undefined for some synthetic keydowns — Chrome autofill and IME
       composition both fire them — which crashed both easter-egg listeners.
       And neither should be listening at all while someone is typing into a
       field: filling in the contact form was feeding the confetti trigger. */
    const isTyping = (e) => {
      const t = e.target;
      if (!t) return false;
      const tag = (t.tagName || "").toLowerCase();
      return tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable;
    };

    const handleKeyDown = (e) => {
      if (typeof e.key !== "string" || isTyping(e)) return;
      typedStr += e.key.toLowerCase();
      if (typedStr.includes("hireme") || typedStr.includes("magic")) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#E45496', '#8663E4', '#EF7B2D']
        });
        typedStr = ""; // reset
      }
      // Keep it short
      if (typedStr.length > 20) {
        typedStr = typedStr.slice(-10);
      }
    };
    const handleTerminal = (e) => {
      if (typeof e.key !== "string") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
    };

    // KONAMI CODE LISTENER
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKonami = (e) => {
      if (typeof e.key !== "string" || isTyping(e)) return;
      if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowSnakeGame(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleTerminal);
    window.addEventListener("keydown", handleKonami);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleTerminal);
      window.removeEventListener("keydown", handleKonami);
    };
  }, [setShowTerminal]);

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  if (maintenanceMode && !isAdminPath) {
    return <Maintenance />;
  }

  return (
    <SmoothScroll>
      <Preloader />
      <ContextMenu />
      <SoundEngine />
      
      <AnimatePresence>
        {showTerminal && <TerminalConsole onClose={() => setShowTerminal(false)} />}
        {showSnakeGame && <SnakeGame onClose={() => setShowSnakeGame(false)} />}
        {showSecrets && <SecretsGuide onClose={() => setShowSecrets(false)} />}
        {showResume && <ResumeViewer onClose={() => setShowResume(false)} />}
      </AnimatePresence>
      
      <CustomCursor />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center w-full h-screen bg-black">
                        <Loader className="w-12 h-12 animate-spin text-pink-500" />
                      </div>
                    }
                  >
                    <Landing />
                  </Suspense>
                </motion.div>
              }
            />

            <Route
              path="/admin"
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Suspense fallback={<div className="bg-black w-full h-screen"></div>}>
                    <AdminLogin />
                  </Suspense>
                </motion.div>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Suspense fallback={<div className="bg-black w-full h-screen"></div>}>
                    <AdminDashboard />
                  </Suspense>
                </motion.div>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
    </SmoothScroll>
  );
};
export default App;
