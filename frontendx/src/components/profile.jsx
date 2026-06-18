import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getperformance } from "../api/analysis";
import { logoutUser, updateProfileApi } from "../api/authapi";
import { adduser, removeuser } from "../feature/auth.slice";
import { useNavigate } from "react-router-dom";
import { getBadgesFromStats, getLevelFromStats } from "../utils/badges";

const Profile = () => {
  const [page] = useState("Profile");
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = user?.user ?? user;
  const currentFullName = currentUser?.fullname ?? currentUser?.fullName ?? {};

  const [yearlyStats, setYearlyStats] = useState(null);
  const [location, setLocation] = useState("Loading...");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [form, setForm] = useState({
    username: currentUser?.username || "",
    firstname: currentFullName?.firstname ?? currentFullName?.firstName ?? "",
    middlename: currentFullName?.middlename ?? currentFullName?.middleName ?? "",
    lastname: currentFullName?.lastname ?? currentFullName?.lastName ?? "",
  });

  useEffect(() => {
    setForm({
      username: currentUser?.username || "",
      firstname: currentFullName?.firstname ?? currentFullName?.firstName ?? "",
      middlename: currentFullName?.middlename ?? currentFullName?.middleName ?? "",
      lastname: currentFullName?.lastname ?? currentFullName?.lastName ?? "",
    });
  }, [currentUser?.username, currentFullName?.firstname, currentFullName?.firstName, currentFullName?.middlename, currentFullName?.middleName, currentFullName?.lastname, currentFullName?.lastName]);

  const dateObj = currentUser?.createdAt ? new Date(currentUser.createdAt) : null;
  const formattedDate = dateObj && !Number.isNaN(dateObj.getTime()) ? dateObj.toDateString().slice(4) : "N/A";
  const attempts = yearlyStats || {};
  const avatarSrc = avatarPreview || currentUser?.img || "";

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
          .then((response) => response.json())
          .then((data) => {
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || "Unknown City";
            setLocation(city + ", " + (addr.country || "India"));
          })
          .catch(() => setLocation("City name unavailable"));
      },
      () => setLocation("Permission Denied")
    );
  }, []);

  useEffect(() => {
    const fetchYearlyStats = async () => {
      if (!currentUser?._id) {
        setYearlyStats(null);
        return;
      }
      try {
        const res = await getperformance(currentUser._id, "yearly");
        setYearlyStats(res || null);
      } catch {
        setYearlyStats(null);
      }
    };

    fetchYearlyStats();
  }, [currentUser?._id]);

  const fullNameText = useMemo(() => {
    const first = currentFullName?.firstname ?? currentFullName?.firstName ?? "";
    const last = currentFullName?.lastname ?? currentFullName?.lastName ?? "";
    return `${first} ${last}`.trim();
  }, [currentFullName]);

  const levelData = useMemo(() => getLevelFromStats(attempts?.summary || {}), [attempts?.summary]);
  const badges = useMemo(() => getBadgesFromStats(attempts?.summary || {}), [attempts?.summary]);
  const earnedBadges = useMemo(() => badges.filter((b) => b.earned), [badges]);
  const bestBadges = useMemo(() => {
    if (!earnedBadges.length) return [];
    return [...earnedBadges].sort((a, b) => b.target - a.target).slice(0, 5);
  }, [earnedBadges]);

  function formatDuration(secondsValue) {
    const safeSeconds = Number(secondsValue);
    if (!Number.isFinite(safeSeconds) || safeSeconds <= 0) return "0s";
    const totalSeconds = Math.floor(safeSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("username", form.username);
      fd.append("firstname", form.firstname);
      fd.append("middlename", form.middlename);
      fd.append("lastname", form.lastname);
      if (avatarFile) fd.append("img", avatarFile);

      const updated = await updateProfileApi(fd);
      dispatch(adduser(updated));
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-black overflow-y-auto pt-5 pb-6">
      <div className="mt-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ECFEFF] to-gray-400 f3 tracking-tight drop-shadow-sm">{page}</h1>
        </div>
      </div>

      <div className="rounded-[40px] p-2 md:p-12">
        <div className="flex items-center justify-between mb-10 border-b border-[#ECFEFF]/20 pb-4">
          <h2 className="f3 text-2xl md:text-3xl text-[#ECFEFF]">Personal info & Summary</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl text-[#ECFEFF] border-2 border-[#ECFEFF]/50 hover:bg-[#171717]">
                Edit Profile
              </button>
            ) : ( 
              <>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-[#ECFEFF] border border-[#ECFEFF]/50 hover:bg-[#171717]">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl text-[#101010] bg-[#ECFEFF] font-bold disabled:opacity-60">
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}
            <button
              onClick={async () => {
                await logoutUser();
                dispatch(removeuser());
                navigate("/login");
              }}
              className="px-4 py-2 rounded-xl text-red-300 border-2 border-red-400/70 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
            <div className="mb-6">
              {avatarSrc ? (
                <img src={avatarSrc} alt="profile avatar" className="w-20 h-20 rounded-full object-cover border border-[#ECFEFF]/40 shadow-[0_0_0_2px_rgba(236,254,255,0.15)]" />
              ) : (
                <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#ECFEFF]/20">
                  <i className="ri-shield-user-fill text-[#ECFEFF] text-2xl"></i>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mb-4">
                <label className="block text-[#ECFEFF]/80 text-sm mb-2">Upload avatar</label>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-[#ECFEFF] cursor-pointer hover:bg-white/15">
                    <span className="text-sm font-semibold">Select image</span>
                    <span className="text-xs text-[#ECFEFF]/60">{avatarFile?.name || "No file selected"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-[#ECFEFF]/50">Choose a file to upload your avatar.</p>
                </div>
              </div>
            )}

            {!isEditing ? (
              <>
                <h3 className="text-xl font-black text-[#ECFEFF] mb-4">{fullNameText}</h3>
                <div className="flex flex-col gap-3">
                  <p className="text-[#ECFEFF]/80 text-sm leading-relaxed mb-4">{currentUser?.username}</p>
                  <div className="bg-black/40 border border-white/10 p-4 rounded-2xl shadow-inner">
                    <p className="text-sm text-[#ECFEFF]/60 uppercase tracking-widest mb-1">{currentUser?.email}</p>
                    <p className="text-[#ECFEFF] text-sm"><i className="ri-information-line"></i> Joined {formattedDate}</p>
                    <p className="text-[#ECFEFF] text-sm"><i className="ri-global-line"></i> {location}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className="bg-black/40 border border-white/10 rounded-xl p-3 text-[#ECFEFF] focus:outline-none focus:border-[#2fc007]/50" placeholder="Username" />
                <input value={form.firstname} onChange={(e) => setForm((p) => ({ ...p, firstname: e.target.value }))} className="bg-black/40 border border-white/10 rounded-xl p-3 text-[#ECFEFF] focus:outline-none focus:border-[#2fc007]/50" placeholder="First name" />
                <input value={form.middlename} onChange={(e) => setForm((p) => ({ ...p, middlename: e.target.value }))} className="bg-black/40 border border-white/10 rounded-xl p-3 text-[#ECFEFF] focus:outline-none focus:border-[#2fc007]/50" placeholder="Middle name" />
                <input value={form.lastname} onChange={(e) => setForm((p) => ({ ...p, lastname: e.target.value }))} className="bg-black/40 border border-white/10 rounded-xl p-3 text-[#ECFEFF] focus:outline-none focus:border-[#2fc007]/50" placeholder="Last name" />
              </div>
            )}
          </div>

          <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2fc007]/20 to-[#4d127c]/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-[#2fc007]/30">
              <i className="ri-book-2-fill text-[#ECFEFF] text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Quick Stats</h3>
            <div className="bg-black/40 border border-white/10 flex flex-col p-4 rounded-2xl shadow-inner">
              <p className="text-sm text-[#ECFEFF]/60 uppercase tracking-widest mb-1">Scoring</p>
              <p className="text-lg text-[#ECFEFF] flex items-center justify-between gap-5">Total Quizzes <span className="rounded-full px-2">{attempts?.summary?.totalQuizzes ?? 0}</span></p>
              <p className="text-lg text-[#ECFEFF] flex items-center justify-between gap-5">Accuracy % <span className="rounded-full px-2">{attempts?.summary?.overallAccuracy ?? 0}</span></p>
              <p className="text-lg text-[#ECFEFF] flex items-center justify-between gap-5">AvgTime/Quiz <span className="rounded-full px-2">{formatDuration(attempts?.summary?.avgTimePerQuiz)}</span></p>
              <p className="text-lg text-[#ECFEFF] flex items-center justify-between gap-5">AvgTime/Q <span className="rounded-full px-2">{formatDuration(attempts?.summary?.avgTimePerQuestion)}</span></p>
              <p className="text-lg text-[#ECFEFF] flex items-center justify-between gap-5">Best score <span className="rounded-full px-2">{attempts?.summary?.bestscore ?? 0}</span></p>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2fc007]/20 to-[#4d127c]/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-[#2fc007]/30">
              <i className="ri-medal-2-line text-[#ECFEFF] text-2xl"></i>
            </div>
            <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Achievements / Badges</h3>
            <div className="bg-black/40 border border-white/10 p-4 rounded-2xl shadow-inner">
              <p className="text-[#ECFEFF] text-sm mb-2">Level {levelData.level} ({levelData.title})</p>
              <p className="text-[#ECFEFF]/80 text-xs mb-3">Top Badges Earned</p>
              <div className="flex flex-wrap gap-2">
                {bestBadges.length > 0 ? (
                  bestBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-2 bg-[#ECFEFF]/10 px-3 py-1.5 rounded-xl border border-[#ECFEFF]/20 hover:bg-[#ECFEFF]/20 transition-all duration-300">
                      <i className={`${badge.icon} text-xl text-[#ECFEFF]`}></i>
                      <span className="text-xs font-semibold text-[#ECFEFF] tracking-wide">{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-[#ECFEFF]/50">No badges yet. Play quizzes to unlock.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
