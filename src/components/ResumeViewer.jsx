import React, { useEffect, useRef } from "react";
import { IDENTITY } from "../data/site";
import { usePortfolio } from "../context/PortfolioContext";

const ResumeViewer = ({ onClose }) => {
  const { trackEvent } = usePortfolio();
  const openedAt = useRef(Date.now());
  const closeBtn = useRef(null);

  useEffect(() => {
    trackEvent("resume_view");
    openedAt.current = Date.now();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      const seconds = Math.round((Date.now() - openedAt.current) / 1000);
      if (seconds >= 1)
        trackEvent("resume_view_duration", { duration: seconds });
    };
  }, [trackEvent, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Résumé"
      onClick={onClose}
    >
      <div
        className="fade-up flex h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border hairline bg-canvas"
        style={{ animationDuration: "0.5s" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b hairline px-5 py-3">
          <span className="t-mono-xs text-ink-2">{IDENTITY.name} · Résumé</span>
          <div className="flex items-center gap-4">
            <a
              href={IDENTITY.resumeView}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("resume_download")}
              className="t-mono-xs link-u text-ink"
            >
              Open in Drive {"↗"}
            </a>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close résumé"
              className="t-mono-xs grid h-8 w-8 place-items-center rounded-full border hairline text-ink"
            >
              {"✕"}
            </button>
          </div>
        </div>
        <iframe
          src={IDENTITY.resumePreview}
          title="Résumé preview"
          className="w-full flex-1 bg-white"
          allow="autoplay"
        />
      </div>
    </div>
  );
};

export default ResumeViewer;
