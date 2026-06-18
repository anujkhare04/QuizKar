import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { getLeaderboard } from "../api/analysis";

const Leaderboard = () => {
  const [page, setPage] = useState("Leaderboard");
  const [activeTab, setActiveTab] = useState("Global");
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  

  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user ?? user;
  const currentUserId = String(currentUser?._id || "").trim();

  const tabs = ["Global", "Weekly", "Monthly"];
  const tabToRange = useMemo(
    () => ({
      Global: "global",
      Weekly: "weekly",
      Monthly: "monthly",
    }),
    []
  );  


  

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const range = tabToRange[activeTab] || "global";
        const res = await getLeaderboard(range, 500);
        const rows = (res?.leaderboard || []).map((item) => {
          const itemId = String(item.id || "").trim();
          return ({
          id: itemId,
          rank: item.rank,
          name:
            item.username ||
            (itemId === currentUserId
              ? (currentUser?.username || "You")
              : `User-${String(itemId).slice(-6)}`),
          points: item.points ?? 0,
          accuracy: item.accuracy ?? 0,
          streak: item.streak ?? 0,
          bestStreak: item.bestStreak ?? 0,
          level: item.level ?? 1,
          avatar:
            item.avatar ||
            (itemId === currentUserId && currentUser?.img
              ? currentUser.img
              : "https://api.dicebear.com/7.x/adventurer/svg?seed=" + String(itemId).slice(-8)),
        })});

       

        const hasCurrentUser = rows.some((r) => r.id === currentUserId);
        if (!hasCurrentUser && currentUserId) {
          rows.push({
            id: currentUserId,
            rank: "-",
            name: currentUser?.username || "You",
            points: 0,
            accuracy: 0,
            streak: 0,
            bestStreak: 0,
            level: 1,
            avatar: currentUser?.img || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + String(currentUserId).slice(-8),
          });
        }
        setLeaderboardData(rows);
      } catch (error) {
        console.error("Leaderboard fetch failed:", error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab, currentUserId, currentUser?.username, tabToRange]);

    
  
  


  return (
    <div className="w-full bg-black overflow-y-auto pt-5 pb-6 min-h-screen">
     
      <div className="mt-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700 mb-10">
          <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#ECFEFF] to-gray-400 f3 tracking-tight drop-shadow-sm">
            {page}
          </h1>
        </div>
      </div>

      <div className="rounded-[40px] p-2 md:p-12">
   
        <div className="flex items-center gap-2 mb-10 border-b border-white/10 pb-4">
          <h2 className="f3 text-2xl md:text-3xl text-[#ECFEFF]">{activeTab}</h2>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="p-2 text-white hover:bg-white/10 rounded-full transition-all focus:outline-none">
              <i className="ri-arrow-drop-down-fill text-4xl text-[#2fc007]"></i>
            </MenuButton>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute left-0 mt-2 w-56 origin-top-left bg-[#121212] border border-white/10 rounded-2xl shadow-2xl z-50 p-2 focus:outline-none">
                {tabs.map((tab) => (
                  <MenuItem key={tab}>
                    {({ active }) => (
                      <button
                        onClick={() => setActiveTab(tab)}
                        className={`${active || activeTab === tab ? 'bg-linear-to-r from-[#2fc007]/20 to-[#4d127c]/20 text-[#ECFEFF]' : 'text-white/60'} group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold transition-colors`}
                      >
                        {tab}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
        </div>

      
        <div className="hidden md:grid grid-cols-6 p-6 px-10 mb-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
          <p className="font-black text-white/40 uppercase text-xs tracking-widest">Rank</p>
          <p className="font-black text-white/40 uppercase text-xs tracking-widest">User</p>
          <p className="font-black text-white/40 uppercase text-xs tracking-widest text-center">Level</p>
          <p className="font-black text-white/40 uppercase text-xs tracking-widest text-center">Points</p>
          <p className="font-black text-white/40 uppercase text-xs tracking-widest text-center">Accuracy</p>
          <p className="font-black text-white/40 uppercase text-xs tracking-widest text-center">Best Streak</p>
          </div>

      
        <div className="flex flex-col gap-3">
          {loading && (
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5 text-white/70 text-center">
              Loading leaderboard...
            </div>
          )}
          {!loading && leaderboardData.length === 0 && (
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5 text-white/70 text-center">
              No leaderboard data found for this range.
            </div>
          )}
          {leaderboardData.map((player) => (
            <div
              key={player.id}
              className={`grid grid-cols-3 md:grid-cols-6 items-center p-5 md:p-6 px-6 md:px-10 rounded-3xl border transition-all duration-300 ${
                player.id === currentUserId 
                  ? "bg-linear-to-r from-[#2fc007]/10 to-[#4d127c]/10 border-[#2fc007]/50 shadow-[0_0_20px_rgba(47,192,7,0.15)] scale-[1.02] z-10" 
                  : "bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
        
              <div className="flex items-center gap-4">
                <span className={`text-xl font-black ${typeof player.rank === "number" && player.rank <= 3 ? 'text-transparent bg-clip-text bg-linear-to-r from-[#2fc007] to-[#4d127c]' : 'text-white'}`}>
                   #{player.rank}
                </span>
              </div>

      

          
              <div className="flex items-center gap-3">
                <img src={player.avatar} alt="avatar" className="w-10 h-10 object-cover rounded-full border border-white/20" />
                <span className="font-bold text-white truncate max-w-[100px] md:max-w-none">
                  {player.name}
                  {player.id === currentUserId && <span className="block text-[10px] text-[#2fc007] uppercase tracking-tighter">You</span>}
                </span>
              </div>

              <div className="text-white/70 font-bold text-center hidden md:block">
                {player.level ?? 1}
              </div>

              <p className="text-white font-black text-center">{player.points} <span className="text-[10px] text-white/30 hidden md:inline">PTS</span></p>

              <p className="text-white/70 font-bold text-center hidden md:block">{player.accuracy}%</p>

             
              <div className="text-white font-black text-center hidden md:block">
                {player.bestStreak ?? 0}
              </div>

              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
