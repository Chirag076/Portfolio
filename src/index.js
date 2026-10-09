import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { PortfolioProvider } from "./context/PortfolioContext";
import "./index.css";

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </React.StrictMode>
);

/* The landing page is pre-rendered into index.html at build time, so on "/"
   React only hydrates. Every other path gets the same HTML shell, so it is
   cleared and rendered from scratch. */
if (
  container.hasChildNodes() &&
  window.location.pathname.replace(/\/+$/, "") === ""
) {
  hydrateRoot(container, app);
} else {
  container.innerHTML = "";
  createRoot(container).render(app);
}
