import React, { useEffect, useState } from "react";

const GithubStats = () => {
  const [stats, setStats] = useState({ repos: 0, followers: 0, following: 0 });

  useEffect(() => {
    fetch("https://api.github.com/users/Chirag076")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          repos: data.public_repos || 0,
          followers: data.followers || 0,
          following: data.following || 0,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <div className="bg-black/50 border border-green-500/30 p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px] hover:border-green-400 transition-colors">
        <span className="text-3xl font-bold text-green-400">{stats.repos}</span>
        <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Repos</span>
      </div>
      <div className="bg-black/50 border border-green-500/30 p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px] hover:border-green-400 transition-colors">
        <span className="text-3xl font-bold text-green-400">{stats.followers}</span>
        <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Followers</span>
      </div>
      <div className="bg-black/50 border border-green-500/30 p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px] hover:border-green-400 transition-colors">
        <span className="text-3xl font-bold text-green-400">99%</span>
        <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Uptime</span>
      </div>
    </div>
  );
};

export default GithubStats;
