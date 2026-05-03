import React, { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Web Audio API Synthesizer
const createAmbientEngine = () => {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  
  const ctx = new AudioContext();
  let oscillator = null;
  let gainNode = null;

  return {
    play: () => {
      if (ctx.state === "suspended") ctx.resume();
      oscillator = ctx.createOscillator();
      gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 55; // Deep hum
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2); // Fade in to very quiet

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
    },
    stop: () => {
      if (gainNode) {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => {
          if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
          }
        }, 1000);
      }
    },
    click: () => {
      if (ctx.state === "suspended") ctx.resume();
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = "square";
      clickOsc.frequency.setValueAtTime(800, ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      clickGain.gain.setValueAtTime(0.1, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start();
      clickOsc.stop(ctx.currentTime + 0.1);
    }
  };
};

const SoundEngine = () => {
  const [isMuted, setIsMuted] = useState(true);
  const engineRef = useRef(null);

  useEffect(() => {
    engineRef.current = createAmbientEngine();
    
    // Add click listeners to all buttons/links
    const handleInteraction = (e) => {
      if (!isMuted && engineRef.current && e.target.closest("a, button")) {
        engineRef.current.click();
      }
    };
    
    window.addEventListener("mousedown", handleInteraction);
    return () => {
      window.removeEventListener("mousedown", handleInteraction);
      if (engineRef.current) engineRef.current.stop();
    };
  }, [isMuted]);

  useEffect(() => {
    if (!isMuted && engineRef.current) {
      engineRef.current.play();
    } else if (isMuted && engineRef.current) {
      engineRef.current.stop();
    }
  }, [isMuted]);

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-24 left-6 md:bottom-6 md:left-6 z-[99999] p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all shadow-lg flex items-center justify-center group"
      title="Toggle Ambient Audio"
    >
      {isMuted ? <VolumeX size={22} className="group-hover:scale-110 transition-transform" /> : <Volume2 size={22} className="text-pink-400 group-hover:scale-110 transition-transform animate-pulse" />}
    </button>
  );
};

export default SoundEngine;
