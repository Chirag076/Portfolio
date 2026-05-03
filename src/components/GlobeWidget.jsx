import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

const GlobeWidget = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0, 0, 0], // Pitch black water makes continents (white) stand out perfectly
      markerColor: [1, 0.2, 0.6],
      glowColor: [0.1, 0.05, 0.15],
      markers: [
        { location: [28.6139, 77.2090], size: 0.1 },
        { location: [37.7749, -122.4194], size: 0.08 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [35.6762, 139.6503], size: 0.08 },
        { location: [-33.8688, 151.2093], size: 0.08 }
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.015; // Visibly much faster spin
      }
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div className="absolute top-4 z-10 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-bounce pointer-events-none tracking-widest uppercase">
        Drag to Spin 🌍
      </div>
      <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          style={{ width: 500, height: 500, maxWidth: "100%", aspectRatio: 1 }}
        />
        {/* Subtle overlay glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(0,0,0,0.8)_100%)] pointer-events-none rounded-full"></div>
      </div>
    </div>
  );
};

export default GlobeWidget;
