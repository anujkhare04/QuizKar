const ScoreModel=require('../model/Score')

const MAX_SECONDS_PER_QUESTION = 600;
const MAX_SECONDS_PER_QUIZ = 3600;
const MIN_SECONDS_PER_QUESTION = 1;
const KNOWN_MODES = ["timed", "numberOfQuestions", "Stop on Incorrect"];


const getUserPerformance=async(userId, range )=>{
   
    const attempted=await ScoreModel.find({userId}).sort({attemptedAt:1})
    if (!attempted.length) {
  return {
    summary: {
      totalQuizzes: 0,
      overallAccuracy: 0,
      bestscore: 0,
      avgTimePerQuiz: 0,
      avgTimePerQuestion: 0,
      currentStreak: 0,
      bestStreak: 0
    },
    scoreTrend: [],
    accuracyTrend: [],
    distribution: {
      high: 0,
      medium: 0,
      low: 0
    },
    improvement: {
      firstAvg: 0,
      secondAvg: 0,
      change: 0,
      status: "No Data"
    }
  };
}

    return calculatePerformance(attempted, range )
}


 const calculatePerformance=(attempted, range)=>{

   
     

  const now = new Date();
  let filteredAttempts = attempted;

  if (range === "weekly") {
    const last7 = new Date();
    last7.setDate(now.getDate() - 7);
    filteredAttempts = attempted.filter(a =>
      new Date(a.attemptedAt) >= last7
    );
  }

  if (range === "monthly") {
    const last30 = new Date();
    last30.setDate(now.getDate() - 30);
    filteredAttempts = attempted.filter(a =>
      new Date(a.attemptedAt) >= last30
    );
  }

  if (range === "yearly") {
    const last365 = new Date();
    last365.setDate(now.getDate() - 365);
    filteredAttempts = attempted.filter(a =>
      new Date(a.attemptedAt) >= last365
    );
  } 


  if (!filteredAttempts.length) {
  return {
    summary: {
      totalQuizzes: 0,
      overallAccuracy: 0,
      bestscore: 0,
      avgTimePerQuiz: 0,
      avgTimePerQuestion: 0,
      currentStreak: 0,
      bestStreak: 0
    },
    scoreTrend: [],
    accuracyTrend: [],
    distribution: {
      high: 0,
      medium: 0,
      low: 0
    },
    improvement: {
      firstAvg: 0,
      secondAvg: 0,
      change: 0,
      status: "No Data"
    }
  };
}


        let totalcorrect=0;
        let Totalattempted=0;
        let Totaltime=0;
        let bestscore=0;

  const scoreTrend = [];
  const accuracyTrend = [];
  const timeTrend = [];
  const modeAccumulator = {};
  KNOWN_MODES.forEach((m) => {
    modeAccumulator[m] = {
      attempts: 0,
      correct: 0,
      attempted: 0,
      totalTime: 0,
    };
  });

  let high = 0, medium = 0, low = 0;
  
     filteredAttempts.forEach(quiz=> {
        const totalquestion=quiz.answers.length;
        const Qattempted=quiz.answers.filter(a=>a.selectedOption!==null).length;
        const correct=quiz.answers.filter(a=>a.isCorrect).length;

         


        totalcorrect +=  correct;
        Totalattempted += Qattempted;
        
        const rawTime = Number(quiz.timeTaken) || 0;
        const minLogicalForAttempt = Math.max(
          MIN_SECONDS_PER_QUESTION,
          Math.max(Qattempted, 1) * MIN_SECONDS_PER_QUESTION
        );
        const normalizedTime = Math.min(
          MAX_SECONDS_PER_QUIZ,
          Math.max(minLogicalForAttempt, rawTime)
        );

        Totaltime += normalizedTime;

        const modeKey = KNOWN_MODES.includes(quiz.mode) ? quiz.mode : "timed";
        modeAccumulator[modeKey].attempts += 1;
        modeAccumulator[modeKey].correct += correct;
        modeAccumulator[modeKey].attempted += Qattempted;
        modeAccumulator[modeKey].totalTime += normalizedTime;

        if(correct>bestscore){
            bestscore=correct;
        }
        
        const accuracy=Qattempted === 0 ? 0: (correct/ Qattempted)*100;

        scoreTrend.push({
           date: quiz.attemptedAt.toISOString().split("T")[0],
            score:correct
        })
        accuracyTrend.push({
           date: quiz.attemptedAt.toISOString().split("T")[0],
            accuracy:Number(accuracy.toFixed(1))       // tofixed returm string convt number 
        })

        const avgQTimeForAttemptRaw = Qattempted === 0 ? 0 : rawTime / Qattempted;
        const avgQTimeForAttempt = Math.min(MAX_SECONDS_PER_QUESTION, Math.max(0, avgQTimeForAttemptRaw));
        timeTrend.push({
          date: quiz.attemptedAt.toISOString().split("T")[0],
          avgTimePerQuestion: Number(avgQTimeForAttempt.toFixed(1)),
          timeTaken: Number(normalizedTime.toFixed(1)),
        });
          
        if (accuracy >= 80) high++;
    else if (accuracy >= 60) medium++;
    else low++;
  });
      
   const overallAccuracy =
    Totalattempted === 0 ? 0 : (totalcorrect / Totalattempted) * 100;

  const avgTimePerQuiz = Totaltime / filteredAttempts.length;

  const avgTimePerQuestion =
    Totalattempted === 0 ? 0 : Totaltime / Totalattempted;

  const { currentStreak, bestStreak } = calculateStreak(filteredAttempts);

  const improvement = calculateImprovement(accuracyTrend);
  const modePerformance = KNOWN_MODES.map((mode) => {
    const m = modeAccumulator[mode];
    const accuracy = m.attempted === 0 ? 0 : (m.correct / m.attempted) * 100;
    const avgTimePerQuizMode = m.attempts === 0 ? 0 : m.totalTime / m.attempts;
    return {
      mode,
      attempts: m.attempts,
      accuracy: Number(accuracy.toFixed(1)),
      avgTimePerQuiz: Number(avgTimePerQuizMode.toFixed(1)),
    };
  });

  const weaknessDetection = modePerformance
    .filter((m) => m.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map((m) => ({
      area: m.mode,
      accuracy: m.accuracy,
      attempts: m.attempts,
      severity: m.accuracy < 60 ? "high" : m.accuracy < 75 ? "medium" : "low",
    }));


   return {
    summary: {
      totalQuizzes: filteredAttempts.length,
      overallAccuracy: Number(overallAccuracy.toFixed(1)),
      bestscore,
      avgTimePerQuiz: Number(avgTimePerQuiz.toFixed(1)),
      avgTimePerQuestion: Number(avgTimePerQuestion.toFixed(1)),
      currentStreak,
      bestStreak
    },
    scoreTrend,
    accuracyTrend,
    timeTrend,
    modePerformance,
    distribution: { high, medium, low },
    improvement,
    weaknessDetection,
  };
}

function calculateStreak(filteredAttempts) {
  const uniqueDays = [
    ...new Set(
      filteredAttempts.map(a =>
        new Date(a.attemptedAt).toDateString()
      )
    )
  ].sort((a, b) => new Date(a) - new Date(b));

  let bestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) tempStreak++;
    else tempStreak = 1;

    if (tempStreak > bestStreak)
      bestStreak = tempStreak;
  }

 
  let currentStreak = 0;
  let checkDate = new Date();

  while (true) {
    const dayStr = checkDate.toDateString();
    if (uniqueDays.includes(dayStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else break;
  }

  return { currentStreak, bestStreak };
}

function calculateImprovement(accuracyTrend) {
  if (accuracyTrend.length < 4)
    return { status: "Not enough data" };

  const midpoint = Math.floor(accuracyTrend.length / 2);

  const firstHalf = accuracyTrend.slice(0, midpoint);
  const secondHalf = accuracyTrend.slice(midpoint);

  const avg = arr =>
    arr.reduce((sum, q) => sum + q.accuracy, 0) / arr.length;

  const firstAvg = avg(firstHalf);
  const secondAvg = avg(secondHalf);

  const change = secondAvg - firstAvg;

  let status = "Stable";

  if (change > 5) status = "Improving";
  if (change < -5) status = "Declining";

  return {
    firstAvg: Number(firstAvg.toFixed(1)),
    secondAvg: Number(secondAvg.toFixed(1)),
    change: Number(change.toFixed(1)),
    status
  };
}

module.exports = { getUserPerformance };

