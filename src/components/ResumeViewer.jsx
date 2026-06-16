import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const ResumeViewer = ({ onClose }) => {
  const { trackEvent } = usePortfolio();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    trackEvent('resume_view');
    startTimeRef.current = Date.now();

    return () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      // Only track if they stayed for at least 1 second
      if (duration >= 1) {
        trackEvent('resume_view_duration', { duration });
      }
    };
  }, [trackEvent]);

  const handleDownloadClick = () => {
    trackEvent('resume_download');
  };

  return (
    <div className="fixed inset-0 z-[9999999] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-gray-900 w-full max-w-5xl h-[90vh] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#161B22] border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="text-pink-500">📄</span> My Resume
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Iframe Content */}
        <div className="flex-1 w-full bg-white relative">
          <iframe
            src="https://drive.google.com/file/d/1wr5XXvB0QLwPFoHrozOY1ukkuxSqBQhY/preview"
            className="w-full h-full border-none"
            allow="autoplay"
            title="Resume Preview"
          ></iframe>
          
          {/* Loading Overlay (hidden after iframe loads, but good for visual) */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gray-900">
             <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="bg-[#161B22] border-t border-white/10 px-6 py-3 flex justify-end">
            <a 
              href="https://drive.google.com/file/d/1wr5XXvB0QLwPFoHrozOY1ukkuxSqBQhY/view?usp=drive_link" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleDownloadClick}
              className="text-xs text-gray-400 hover:text-pink-400 transition-colors underline"
            >
              Open in Google Drive ↗
            </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeViewer;
