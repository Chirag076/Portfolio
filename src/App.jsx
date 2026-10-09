import React, { useEffect, Suspense, lazy } from "react";
import Landing from "./components/Landing";
import { usePortfolio } from "./context/PortfolioContext";

/* Four routes do not need a router library. Everything that is not the
   landing page is loaded only when visited, so the admin dashboard, its
   libraries and the résumé viewer never cost a visitor a byte. */
const AdminLogin = lazy(() => import("./components/AdminPage"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const NotFound = lazy(() => import("./components/NotFound"));
const Maintenance = lazy(() => import("./components/Maintenance"));
const ResumeViewer = lazy(() => import("./components/ResumeViewer"));

const Blank = () => (
  <div className="min-h-screen bg-canvas" aria-hidden="true" />
);

const pathname = () =>
  typeof window === "undefined"
    ? "/"
    : window.location.pathname.replace(/\/+$/, "") || "/";

/* `path` is passed by the build-time prerender; in the browser it comes from the URL */
const App = ({ path: forcedPath }) => {
  const { showResume, setShowResume, maintenanceMode, trackEvent } =
    usePortfolio();
  const path = forcedPath || pathname();
  const isAdminPath = path.startsWith("/admin");

  /* recruiter links carry ?ref=; one visit event per browser session */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref =
        params.get("ref") || params.get("source") || params.get("utm_source");
      const storedRef = sessionStorage.getItem("recruiter_ref");
      const visited = sessionStorage.getItem("portfolio_session_visited");
      if (ref && ref !== storedRef) {
        sessionStorage.setItem("recruiter_ref", ref);
        trackEvent("portfolio_visit", { ref });
        sessionStorage.setItem("portfolio_session_visited", "true");
      } else if (!visited) {
        trackEvent("portfolio_visit");
        sessionStorage.setItem("portfolio_session_visited", "true");
      }
    } catch (e) {
      /* storage blocked: skip analytics */
    }
  }, [trackEvent]);

  if (maintenanceMode && !isAdminPath) {
    return (
      <Suspense fallback={<Blank />}>
        <Maintenance />
      </Suspense>
    );
  }

  let page;
  if (path === "/") page = <Landing />;
  else if (path === "/admin") page = <AdminLogin />;
  else if (path === "/admin/dashboard") page = <AdminDashboard />;
  else page = <NotFound />;

  return (
    <>
      {showResume && (
        <Suspense fallback={null}>
          <ResumeViewer onClose={() => setShowResume(false)} />
        </Suspense>
      )}
      <Suspense fallback={<Blank />}>{page}</Suspense>
    </>
  );
};

export default App;
