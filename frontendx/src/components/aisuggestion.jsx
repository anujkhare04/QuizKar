import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getperformance } from "../api/analysis";

const AISuggestionDashboard = () => {
  const [range, setRange] = useState("yearly");
  const [Pdata, setPdata] = useState({});
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user ?? user;
  const userId = currentUser?._id;

  useEffect(() => {
    const loadPerformance = async () => {
      if (!userId) {
        setPdata({});
        return;
      }

      try {
        const res = await getperformance(userId, range);
        setPdata(res || {});
      } catch (error) {
        console.error("Error fetching AI suggestion performance:", error);
      }
    };

    loadPerformance();
  }, [userId, range]);

  const summary = Pdata?.summary || {};
  const improvement = Pdata?.improvement || {};
  const weaknesses = Pdata?.weaknessDetection || [];
  const distribution = Pdata?.distribution || {};

  const accuracy = Number(summary?.overallAccuracy || 0);
  const avgQuizTime = Number(summary?.avgTimePerQuiz || 0);
  const avgQuestionTime = Number(summary?.avgTimePerQuestion || 0);
  const currentStreak = Number(summary?.currentStreak || 0);
  const totalQuizzes = Number(summary?.totalQuizzes || 0);

  const cognitiveIndex = useMemo(() => {
    const speedScore = Math.max(0, 100 - Math.min(avgQuestionTime, 120) * 0.6);
    const streakScore = Math.min(currentStreak * 6, 30);
    const volumeScore = Math.min(totalQuizzes, 20);
    const index = accuracy * 0.6 + speedScore * 0.25 + streakScore * 0.1 + volumeScore * 0.05;
    return Number(Math.max(0, Math.min(100, index)).toFixed(1));
  }, [accuracy, avgQuestionTime, currentStreak, totalQuizzes]);

  const suggestions = useMemo(() => {
    const tips = [];

    if (totalQuizzes === 0) {
      tips.push("Start with 2 short quizzes today so the AI can learn your pattern and personalize guidance.");
      tips.push("Pick one mode and repeat it for 3 attempts to build a baseline.");
      return tips;
    }

    if (accuracy < 60) {
      tips.push("Focus on accuracy first: slow down and target 70%+ before increasing quiz volume.");
    } else if (accuracy < 80) {
      tips.push("You are close to top performance; review incorrect answers after each quiz to push past 80% accuracy.");
    } else {
      tips.push("Strong accuracy detected. Shift focus to speed and consistency to improve leaderboard rank.");
    }

    if (avgQuestionTime > 45) {
      tips.push("Your response time is high. Use timed mode and set a 35-45 second target per question.");
    } else if (avgQuestionTime < 15) {
      tips.push("You are very fast. Double-check final answers to avoid avoidable mistakes.");
    } else {
      tips.push("Your pace is healthy. Maintain this tempo while improving weak topics.");
    }

    if (currentStreak < 3) {
      tips.push("Build a 3-day streak with one daily quiz. Consistency will lift your trend quickly.");
    } else {
      tips.push(`Great streak (${currentStreak} days). Keep daily attempts to preserve momentum.`);
    }

    if (improvement?.status === "Declining") {
      tips.push("Recent trend is declining. Revisit last 10 wrong questions before your next session.");
    } else if (improvement?.status === "Improving") {
      tips.push("Positive trend detected. Increase challenge level slightly to keep improving.");
    }

    if (weaknesses.length > 0) {
      tips.push(`Weakest mode: ${weaknesses[0].area}. Run 2 focused practice sets in this mode this week.`);
    }

    const lowBucket = Number(distribution?.low || 0);
    const mediumBucket = Number(distribution?.medium || 0);
    if (lowBucket > mediumBucket) {
      tips.push("Low-score attempts are dominant. Use easier question sets for 2 days to rebuild confidence and accuracy.");
    }

    return tips.slice(0, 5);
  }, [totalQuizzes, accuracy, avgQuestionTime, currentStreak, improvement, weaknesses, distribution]);

  const focusLabel = accuracy >= 80 ? "Superior" : accuracy >= 60 ? "Stable" : "Needs Work";
  const memoryLabel = improvement?.status === "Improving" ? "Improving" : improvement?.status === "Declining" ? "Falling" : "Steady";
  const levelLabel = cognitiveIndex >= 80 ? "Elite" : cognitiveIndex >= 65 ? "Strong" : cognitiveIndex >= 45 ? "Developing" : "Starter";
  const confidence = Math.min(98, Math.max(35, Math.round(40 + totalQuizzes * 2)));

  const progressScore = useMemo(() => {
    if (totalQuizzes === 0) return 0;
    const accuracyScore = accuracy;
    const streakScore = Math.min(currentStreak * 8, 24);
    const volumeScore = Math.min(totalQuizzes * 4, 16);
    return Math.round(Math.min(100, accuracyScore * 0.6 + streakScore * 0.2 + volumeScore * 0.2));
  }, [accuracy, currentStreak, totalQuizzes]);

  const progressLabel = useMemo(() => {
    if (progressScore >= 80) return "On Track";
    if (progressScore >= 60) return "Rising";
    if (progressScore >= 40) return "Needs Momentum";
    return "Start Strong";
  }, [progressScore]);

  const strengths = useMemo(() => {
    const list = [];
    if (accuracy >= 75) list.push(`Good accuracy control (${accuracy}%).`);
    if (avgQuestionTime > 0 && avgQuestionTime <= 35) list.push(`Healthy solving speed (${avgQuestionTime.toFixed(1)}s/question).`);
    if (currentStreak >= 3) list.push(`Strong consistency with a ${currentStreak}-day streak.`);
    if (improvement?.status === "Improving") list.push("Trend is moving upward.");
    return list.length ? list : ["You are building your baseline. Consistency now will compound fast."];
  }, [accuracy, avgQuestionTime, currentStreak, improvement]);

  const risks = useMemo(() => {
    const list = [];
    if (accuracy < 60) list.push("Low accuracy is the main blocker.");
    if (avgQuestionTime > 45) list.push("Time pressure may be reducing decision quality.");
    if (improvement?.status === "Declining") list.push("Recent trend dipped, so revision is needed.");
    if (weaknesses.length > 0) list.push(`Weakest area right now: ${weaknesses[0].area}.`);
    return list.length ? list : ["No major risk detected. Keep maintaining your routine."];
  }, [accuracy, avgQuestionTime, improvement, weaknesses]);

  const nextSessionPlan = useMemo(() => {
    if (totalQuizzes === 0) {
      return [
        "Attempt 2 short quizzes (10 questions each).",
        "Spend 10 minutes reviewing every wrong answer.",
        "Repeat tomorrow at the same time to start your streak.",
      ];
    }
    return [
      `Warm-up: 1 quiz in ${weaknesses[0]?.area || "your weakest mode"} mode.`,
      `Core: target ${accuracy < 70 ? "70%+" : "80%+"} accuracy with a steady pace.`,
      "Cooldown: review top 5 mistakes and write one correction rule per mistake.",
    ];
  }, [totalQuizzes, weaknesses, accuracy]);

  return (
    <div className="w-full bg-black overflow-y-auto pt-5 pb-6 min-h-screen">
      <div className="mt-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-700 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#ECFEFF] to-gray-400 f3 tracking-tight drop-shadow-sm">AI Suggestions</h2>
          <div className="flex items-center gap-2">
            { ["weekly", "monthly", "yearly"].map((option) => (
              <button
                key={option}
                onClick={() => setRange(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  range === option ? "bg-[#2fc007] text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {option}
              </button>
            )) }
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase text-white/50 tracking-widest mb-2">Progress Score ({range})</p>
            <p className="text-4xl font-black text-[#2fc007]">{progressScore}%</p>
            <p className="text-sm text-white/60 mt-2">{progressLabel}</p>
            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-linear-to-r from-[#2fc007] to-[#4d127c]" style={{ width: `${progressScore}%` }} />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase text-white/50 tracking-widest mb-2">Quiz Volume</p>
            <p className="text-4xl font-black text-white">{totalQuizzes}</p>
            <p className="text-sm text-white/60 mt-2">Attempts in selected range</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase text-white/50 tracking-widest mb-2">Trend</p>
            <p className="text-4xl font-black text-white">{improvement?.status || "No Data"}</p>
            <p className="text-sm text-white/60 mt-2">Change: {improvement?.change ?? 0}%</p>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black text-[#2fc007] uppercase tracking-[3px]">Performance AI ({range})</p>
              <h3 className="text-2xl font-black text-[#ECFEFF]">Adaptive Coach</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Cognitive Index</p>
              <p className="text-3xl font-black text-white">{cognitiveIndex}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Focus Score</p>
              <p className="text-lg font-bold text-[#2fc007]">{focusLabel}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Retention Trend</p>
              <p className="text-lg font-bold text-blue-300">{memoryLabel}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#2fc007]/10 border border-[#2fc007]/20 mb-4">
            <p className="text-[10px] font-black text-[#ECFEFF] uppercase tracking-widest mb-2">Priority Insight</p>
            <p className="text-sm text-white/80">
              {suggestions[0] || "Complete a few quizzes to unlock personalized AI insights."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-4">
              <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-2">What You Are Doing Well</p>
              <div className="flex flex-col gap-2">
                {strengths.map((item, idx) => (
                  <p key={`${item}-${idx}`} className="text-sm text-white/80">{idx + 1}. {item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/5 p-4">
              <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-2">Watchouts</p>
              <div className="flex flex-col gap-2">
                {risks.map((item, idx) => (
                  <p key={`${item}-${idx}`} className="text-sm text-white/80">{idx + 1}. {item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-sky-300/20 bg-sky-300/5 p-4">
              <p className="text-[10px] font-black text-sky-200 uppercase tracking-widest mb-2">Next Session Plan</p>
              <div className="flex flex-col gap-2">
                {nextSessionPlan.map((item, idx) => (
                  <p key={`${item}-${idx}`} className="text-sm text-white/80">{idx + 1}. {item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Coach Notes</p>
            <div className="flex flex-col gap-2">
              {suggestions.slice(1).map((tip, idx) => (
                <p key={`${tip}-${idx}`} className="text-sm text-white/70">
                  {idx + 1}. {tip}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-[10px] uppercase text-white/50 tracking-wider">Player Level</p>
              <p className="text-white font-bold">{levelLabel}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-[10px] uppercase text-white/50 tracking-wider">AI Confidence</p>
              <p className="text-white font-bold">{confidence}%</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-[10px] uppercase text-white/50 tracking-wider">Based On</p>
              <p className="text-white font-bold text-sm">Acc {accuracy}% | {avgQuestionTime.toFixed(1)}s/Q | Streak {currentStreak}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionDashboard;
