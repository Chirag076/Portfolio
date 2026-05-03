import React, { useState, useEffect } from 'react';

const LocalTime = () => {
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("Locating...");

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if(data.city && data.country_code) {
           setLocation(`${data.city}, ${data.country_code}`);
        } else {
           setLocation("Unknown");
        }
      })
      .catch(() => setLocation("Earth"));

    const updateTime = () => {
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setTime(new Date().toLocaleTimeString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden xl:flex items-center gap-2 text-sm font-bold text-gray-300 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-default">
      <span>📍 {location}</span>
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2 mr-1"></span>
      <span className="text-white tracking-widest w-[100px] text-center">{time}</span>
    </div>
  );
};

export default LocalTime;
