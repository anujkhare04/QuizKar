const mkQuizBadge = (id, name, target, icon = "ri-booklet-fill", color = "text-emerald-300") => ({
  id,
  name,
  icon,
  color,
  description: `Play ${target} quizzes.`,
  check: (m) => m.totalQuizzes >= target,
  progress: (m) => ({ current: m.totalQuizzes, target }),
});

const mkAccuracyBadge = (id, name, target, icon = "ri-focus-3-fill", color = "text-yellow-300") => ({
  id,
  name,
  icon,
  color,
  description: `Reach ${target}% overall accuracy.`,
  check: (m) => m.overallAccuracy >= target,
  progress: (m) => ({ current: m.overallAccuracy, target }),
});

const mkStreakBadge = (id, name, target, icon = "ri-fire-fill", color = "text-orange-300") => ({
  id,
  name,
  icon,
  color,
  description: `Build a ${target}-day streak.`,
  check: (m) => m.currentStreak >= target,
  progress: (m) => ({ current: m.currentStreak, target }),
});

const mkBestScoreBadge = (id, name, target, icon = "ri-medal-fill", color = "text-fuchsia-300") => ({
  id,
  name,
  icon,
  color,
  description: `Reach best score ${target}.`,
  check: (m) => m.bestscore >= target,
  progress: (m) => ({ current: m.bestscore, target }),
});

const mkSpeedBadge = (id, name, target, icon = "ri-timer-flash-fill", color = "text-blue-300") => ({
  id,
  name,
  icon,
  color,
  description: `Keep avg question time at or below ${target}s.`,
  check: (m) => m.avgTimePerQuestion > 0 && m.avgTimePerQuestion <= target,
  progress: (m) => ({ current: m.avgTimePerQuestion, target, reverse: true }),
});

const BADGE_DEFS = [
  mkQuizBadge("first_steps", "First Steps", 1, "ri-footprint-fill", "text-cyan-300"),
  mkQuizBadge("quiz_rookie", "Quiz Rookie", 10, "ri-star-s-fill", "text-cyan-300"),
  mkAccuracyBadge("accuracy_king", "Accuracy King", 80),
  mkStreakBadge("streak_builder", "Streak Builder", 3),
  mkSpeedBadge("speed_runner", "Speed Runner", 20),
  mkBestScoreBadge("century_club", "Century Club", 100),

  mkQuizBadge("quiz_pathfinder", "Pathfinder", 15, "ri-map-pin-2-fill", "text-sky-300"),
  mkQuizBadge("quiz_grinder", "Grinder", 20, "ri-hammer-fill", "text-orange-300"),
  mkQuizBadge("quiz_hunter", "Hunter", 25, "ri-compass-3-fill", "text-cyan-300"),
  mkQuizBadge("quiz_keeper", "Keeper", 30, "ri-shield-star-fill", "text-emerald-300"),
  mkQuizBadge("quiz_ranger", "Ranger", 40, "ri-tree-fill", "text-lime-300"),
  mkQuizBadge("quiz_scout", "Scout", 50, "ri-binoculars-fill", "text-violet-300"),
  mkQuizBadge("quiz_veteran", "Veteran", 60, "ri-medal-fill", "text-amber-300"),
  mkQuizBadge("quiz_knight", "Knight", 75, "ri-shield-fill", "text-slate-300"),
  mkQuizBadge("quiz_champion", "Champion", 90, "ri-trophy-fill", "text-yellow-300"),
  mkQuizBadge("quiz_titan", "Titan", 100, "ri-anchor-fill", "text-blue-300"),
  mkQuizBadge("quiz_mythic", "Mythic", 125, "ri-diamond-fill", "text-fuchsia-300"),
  mkQuizBadge("quiz_legend", "Legend", 150, "ri-vip-crown-fill", "text-amber-200"),
  mkQuizBadge("quiz_immortal", "Immortal", 200, "ri-flag-fill", "text-indigo-300"),

  mkAccuracyBadge("acc_60", "Steady Aim", 60),
  mkAccuracyBadge("acc_65", "Sharpshooter I", 65),
  mkAccuracyBadge("acc_70", "Sharpshooter II", 70),
  mkAccuracyBadge("acc_75", "Sharpshooter III", 75),
  mkAccuracyBadge("acc_82", "Precision Edge", 82),
  mkAccuracyBadge("acc_85", "Precision Core", 85),
  mkAccuracyBadge("acc_88", "Precision Elite", 88),
  mkAccuracyBadge("acc_90", "Ninety Club", 90),
  mkAccuracyBadge("acc_92", "Crown Accuracy", 92),
  mkAccuracyBadge("acc_95", "Perfect Instinct", 95),
  mkAccuracyBadge("acc_98", "Near Perfect", 98),

  mkStreakBadge("streak_5", "Heat Start", 5),
  mkStreakBadge("streak_7", "Week Warrior", 7),
  mkStreakBadge("streak_10", "Momentum", 10),
  mkStreakBadge("streak_14", "Fortnight Focus", 14),
  mkStreakBadge("streak_21", "Habit Forge", 21),
  mkStreakBadge("streak_30", "Monthly Flame", 30),
  mkStreakBadge("streak_45", "Burning Core", 45),
  mkStreakBadge("streak_60", "Unbroken", 60),

  mkBestScoreBadge("best_20", "Score 20", 20),
  mkBestScoreBadge("best_30", "Score 30", 30),
  mkBestScoreBadge("best_40", "Score 40", 40),
  mkBestScoreBadge("best_50", "Half Century", 50),
  mkBestScoreBadge("best_60", "Score 60", 60),
  mkBestScoreBadge("best_70", "Score 70", 70),
  mkBestScoreBadge("best_80", "Score 80", 80),
  mkBestScoreBadge("best_90", "Score 90", 90),
  mkBestScoreBadge("best_110", "Beyond 100", 110),
  mkBestScoreBadge("best_130", "Ultra Score", 130),
  mkBestScoreBadge("best_150", "Master Score", 150),

  mkSpeedBadge("speed_35", "Quick Hands I", 35),
  mkSpeedBadge("speed_30", "Quick Hands II", 30),
  mkSpeedBadge("speed_25", "Quick Hands III", 25),
  mkSpeedBadge("speed_18", "Fast Brain", 18),
  mkSpeedBadge("speed_15", "Lightning Solve", 15),
  mkSpeedBadge("speed_12", "Reflex Genius", 12),
  mkSpeedBadge("speed_10", "Blitz Mode", 10),

  {
    id: "balanced_pro",
    name: "Balanced Pro",
    icon: "ri-scales-3-fill",
    color: "text-lime-300",
    description: "Accuracy 80%+, streak 10+, and avg question <= 25s.",
    check: (m) => m.overallAccuracy >= 80 && m.currentStreak >= 10 && m.avgTimePerQuestion > 0 && m.avgTimePerQuestion <= 25,
    progress: (m) => {
      const a = Math.min(100, (m.overallAccuracy / 80) * 100);
      const s = Math.min(100, (m.currentStreak / 10) * 100);
      const t = m.avgTimePerQuestion > 0 ? Math.min(100, (25 / m.avgTimePerQuestion) * 100) : 0;
      return { current: Number(((a + s + t) / 3).toFixed(1)), target: 100 };
    },
  },
  {
    id: "hardcore_grind",
    name: "Hardcore Grind",
    icon: "ri-hammer-fill",
    color: "text-amber-300",
    description: "Play 120 quizzes with 75%+ accuracy.",
    check: (m) => m.totalQuizzes >= 120 && m.overallAccuracy >= 75,
    progress: (m) => {
      const q = Math.min(100, (m.totalQuizzes / 120) * 100);
      const a = Math.min(100, (m.overallAccuracy / 75) * 100);
      return { current: Number(((q + a) / 2).toFixed(1)), target: 100 };
    },
  },
  {
    id: "elite_discipline",
    name: "Elite Discipline",
    icon: "ri-vip-crown-2-fill",
    color: "text-purple-300",
    description: "Streak 21+, accuracy 85%+, avg question <= 20s.",
    check: (m) => m.currentStreak >= 21 && m.overallAccuracy >= 85 && m.avgTimePerQuestion > 0 && m.avgTimePerQuestion <= 20,
    progress: (m) => {
      const s = Math.min(100, (m.currentStreak / 21) * 100);
      const a = Math.min(100, (m.overallAccuracy / 85) * 100);
      const t = m.avgTimePerQuestion > 0 ? Math.min(100, (20 / m.avgTimePerQuestion) * 100) : 0;
      return { current: Number(((s + a + t) / 3).toFixed(1)), target: 100 };
    },
  },
];

export const getLevelFromStats = (summary = {}) => {
  const totalQuizzes = Number(summary.totalQuizzes || 0);
  const overallAccuracy = Number(summary.overallAccuracy || 0);
  const currentStreak = Number(summary.currentStreak || 0);
  const bestscore = Number(summary.bestscore || 0);

  const xp = totalQuizzes * 8 + overallAccuracy * 4 + currentStreak * 20 + bestscore * 0.5;
  const level = Math.max(1, Math.floor(xp / 120) + 1);
  const currentLevelXpStart = (level - 1) * 120;
  const nextLevelXp = level * 120;
  const levelProgress = Math.min(100, Math.max(0, ((xp - currentLevelXpStart) / 120) * 100));

  return {
    xp: Number(xp.toFixed(1)),
    level,
    nextLevelXp,
    levelProgress: Number(levelProgress.toFixed(1)),
    title: level >= 25 ? "Mythic" : level >= 18 ? "Grandmaster" : level >= 12 ? "Expert" : level >= 7 ? "Challenger" : "Starter",
  };
};

export const getBadgesFromStats = (summary = {}) => {
  const metrics = {
    totalQuizzes: Number(summary.totalQuizzes || 0),
    overallAccuracy: Number(summary.overallAccuracy || 0),
    avgTimePerQuestion: Number(summary.avgTimePerQuestion || 0),
    currentStreak: Number(summary.currentStreak || 0),
    bestscore: Number(summary.bestscore || 0),
  };

  return BADGE_DEFS.map((badge) => {
    const earned = badge.check(metrics);
    const p = badge.progress(metrics);
    const base = p.target <= 0 ? 0 : (p.current / p.target) * 100;
    const reverseBase = p.target <= 0 ? 0 : ((p.target - p.current) / p.target) * 100;
    const progress = p.reverse ? 100 - Math.min(100, Math.max(0, reverseBase)) : Math.min(100, Math.max(0, base));

    return {
      ...badge,
      earned,
      progress: Number(progress.toFixed(1)),
      current: Number(Number(p.current || 0).toFixed(1)),
      target: p.target,
    };
  });
};

