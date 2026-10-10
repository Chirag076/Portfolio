import React, { useEffect, Suspense, lazy } from "react";
import Landing from "./components/Landing";
import Cursor from "./components/Cursor";
import { usePortfolio } from "./context/PortfolioContext";
import { usePath } from "./lib/router";

/* A handful of routes do not need a router library. Everything that is not
   the landing page is loaded only when visited, so the admin dashboard, the
   case studies and the résumé viewer never cost a first visit a byte. */
const ProjectPage = lazy(() => import("./components/ProjectPage"));
const AdminLogin = lazy(() => import("./components/AdminPage"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const NotFound = lazy(() => import("./components/NotFound"));
const Maintenance = lazy(() => import("./components/Maintenance"));
const ResumeViewer = lazy(() => import("./components/ResumeViewer"));

const Blank = () => <div className="min-h-screen bg-canvas" aria-hidden="true" />;

/* `path` is passed by the build-time prerender; in the browser it comes from the URL */
const App = ({ path: forcedPath }) => {
  const { showResume, setShowResume, maintenanceMode, trackEvent } = usePortfolio();
  const path = usePath(forcedPath);
  const isAdminPath = path.startsWith("/admin");

  /* recruiter links carry ?ref=; one visit event per browser session */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || params.get("source") || params.get("utm_source");
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

  /* a direct load of a non-home URL is hidden by index.html until this renders */
  useEffect(() => {
    document.documentElement.classList.remove("not-home");
  }, [path]);

  if (maintenanceMode && !isAdminPath) {
    return (
      <Suspense fallback={<Blank />}>
        <Maintenance />
      </Suspense>
    );
  }

  const work = path.match(/^\/work\/([a-z0-9-]+)$/);
  let page;
  if (path === "/") page = <Landing />;
  else if (work) page = <ProjectPage slug={work[1]} />;
  else if (path === "/admin") page = <AdminLogin />;
  else if (path === "/admin/dashboard") page = <AdminDashboard />;
  else page = <NotFound />;

  return (
    <>
      <Cursor />
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
