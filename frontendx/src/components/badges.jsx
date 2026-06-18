import React, { useContext, useMemo } from "react";
import { PerContext } from "../context/context";
import { useSelector } from "react-redux";
import { getBadgesFromStats, getLevelFromStats } from "../utils/badges";

const BadgesPage = () => {
  const { Pdata = {} } = useContext(PerContext) || {};
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user ?? user;
  const summary = Pdata?.summary || {};

  const level = useMemo(() => getLevelFromStats(summary), [summary]);
  const badges = useMemo(() => getBadgesFromStats(summary), [summary]);
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="w-full bg-black overflow-y-auto pt-5 pb-12 min-h-screen">
      <div className="mt-20 px-4 md:px-12 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#ECFEFF] to-gray-400 f3 tracking-tight drop-shadow-sm">
            Badges & Level
          </h2>
        </div>

        {/* Level Card - Premium Glassmorphism */}
        <div className="relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 mb-12 shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden group">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4d127c] rounded-full mix-blend-screen filter blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2fc007] rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[#ECFEFF]/60 text-sm font-semibold tracking-widest uppercase mb-2">
                {currentUser?.username || "Player"}
              </p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#2fc007] to-[#4d127c] drop-shadow-md">
                  Level {level.level}
                </h3>
                <span className="text-[#ECFEFF]/90 text-xl md:text-3xl font-bold">
                  ({level.title})
                </span>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <p className="text-[#ECFEFF]/90 font-bold text-lg md:text-xl">
                {earnedCount} <span className="text-[#ECFEFF]/50 text-sm font-normal">/ {badges.length} Badges</span>
              </p>
              <p className="text-[#ECFEFF]/90 font-bold text-lg md:text-xl mt-1">
                {level.xp} <span className="text-[#ECFEFF]/50 text-sm font-normal">/ {level.nextLevelXp} XP</span>
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <div className="flex justify-between text-xs font-bold text-[#ECFEFF]/60 mb-3 uppercase tracking-wider">
              <span>Current Progress</span>
              <span>{level.levelProgress}% to Next Level</span>
            </div>
            <div className="w-full h-4 rounded-full bg-black/50 overflow-hidden border border-white/10 p-[2px] shadow-inner">
              <div 
                className="h-full rounded-full bg-linear-to-r from-[#2fc007] to-[#4d127c] relative"
                style={{ width: `${level.levelProgress}%` }}
              >
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`relative rounded-3xl border p-6 transition-all duration-500 overflow-hidden group hover:-translate-y-1 ${
                badge.earned 
                  ? "border-[#ECFEFF]/30 bg-linear-to-b from-white/10 to-white/5 hover:shadow-[0_15px_30px_rgba(47,192,7,0.15)]" 
                  : "border-white/5 bg-[#0a0a0a] hover:bg-[#111] opacity-80 hover:opacity-100 grayscale-[0.3]"
              }`}
            >
              {/* Card background effect for earned */}
              {badge.earned && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2fc007] rounded-full mix-blend-screen filter blur-[70px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              )}

              <div className="relative z-10 flex items-start justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 ${
                  badge.earned 
                    ? "bg-linear-to-br from-white/20 to-white/5 border border-white/20 shadow-[0_0_15px_rgba(236,254,255,0.1)]" 
                    : "bg-[#161616] border border-white/5"
                }`}>
                  <i className={`${badge.icon} text-2xl drop-shadow-md ${badge.earned ? badge.color : "text-white/20"}`}></i>
                </div>
                
                <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest ${
                  badge.earned 
                    ? "bg-[#2fc007]/20 text-[#2fc007] border border-[#2fc007]/30 shadow-[0_0_10px_rgba(47,192,7,0.2)]" 
                    : "bg-white/5 text-white/30 border border-white/5"
                }`}>
                  {badge.earned ? "Earned" : "Locked"}
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className={`text-xl font-black mb-2 ${badge.earned ? "text-[#ECFEFF]" : "text-white/60"}`}>
                  {badge.name}
                </h3>
                <p className="text-[#ECFEFF]/60 text-sm leading-relaxed min-h-[40px]">
                  {badge.description}
                </p>
                
                <div className="mt-6">
                  <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5 mb-2">
                    <div 
                      className={`h-full rounded-full ${badge.earned ? "bg-linear-to-r from-[#2fc007] to-[#4d127c]" : "bg-white/10"}`} 
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[#ECFEFF]/40 text-xs font-bold uppercase tracking-widest text-right">
                    {badge.current} / {badge.target}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BadgesPage;
