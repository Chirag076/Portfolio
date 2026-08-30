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
    <div className="hidden xl:flex items-center gap-2.5 whitespace-nowrap text-[12.5px] font-medium tracking-wide text-gray-400 bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md cursor-default">
      <span>{location}</span>
      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
      <span className="text-gray-200 tabular-nums">{time}</span>
    </div>
  );
};

export default LocalTime;
