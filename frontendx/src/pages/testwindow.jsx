import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getcategory, getAllCategories } from "../api/createApi";
// import useQuizSecurity from "../components/hooks";

const Testwindow = ({ quizData }) => {

  console.log(quizData);

  const location = useLocation();
  const saved = location.state?.quizData;
  const timeLimit = Number(saved.timeLimit * 60);
  const navigate = useNavigate();

  const [status, setstatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [answered, setAnswered] = useState(false);
  const { cat } = useParams();
  const [res, setRes] = useState([]);
  const [curindex, setcurindex] = useState(0);
  const [score, setscore] = useState(0);

  const handleRandomQuiz = async () => {
    try {
      const categories = await getAllCategories();
      if (!categories || categories.length === 0) {
        alert("No categories available!");
        return;
      }
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const modes = ["numberOfQuestions", "timed", "Stop on Incorrect"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      let quizSettings = { category: randomCat, type: randomMode };
      if (randomMode === "numberOfQuestions") {
        quizSettings.questionLimit = Math.floor(Math.random() * 6) + 5;
      } else if (randomMode === "timed") {
        quizSettings.timeLimit = Math.floor(Math.random() * 5) + 1;
      }
      navigate(`/categories/${randomCat}`, { state: { quizData: quizSettings } });
    } catch (error) {
      console.error("Failed to start random quiz:", error);
    }
  };
  
  useEffect(() => {
  setAnswered(false);
}, [curindex]);


  useEffect(() => {
    setstatus("idle");
    setcurindex(0);
    setscore(0);
    setRes([]);
    if (saved?.type === "timed") {
      setTimeLeft(Number(saved.timeLimit * 60));
    }
  }, [location.pathname, cat]);


  const [showExitPopup, setShowExitPopup] = useState(false);


  useEffect(() => {
    const handleBackButton = (e) => {
      if (status === "playing") {
        e.preventDefault();
        setShowExitPopup(true);
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (status === "playing") {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [status]);

  const handleEndTest = () => {
    setShowExitPopup(false);
    setstatus("score");
  };

  const handleContinueTest = () => {
    setShowExitPopup(false);
  };



  useEffect(() => {
    if (saved.type === "timed" && status === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setstatus("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [saved.type, status]);

  useEffect(() => {
    getapi();
  }, [cat]);



  const shuffle = (res) => {
    const arr = [...res];

    for (let i = res.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };

  console.log(saved.questionLimit);
  console.log(curindex);

  const getapi = async () => {
    try {
      const res = await getcategory(cat);
      setRes(shuffle(res[0].questions));

      console.log(res[0].questions);
    } catch (error) {
      console.log("Error in getting category", error);
    }
  };
  useEffect(() => {
    if (status === "idle") {
      setstatus("playing");
    }
  }, [status]);

  
const correct = (i) => {
  if (answered) return;

  setAnswered(true);

  const isCorrect =
    Number(res[curindex].correctAnswer) === i;

  if (isCorrect) {
    setscore(prev => prev + 1);
    setcurindex(prev => prev + 1);
  } else {
    setstatus("lost");
  }
};

const Qcorrect = (i) => {
  if (answered) return;

  setAnswered(true);

  const isCorrect =
    Number(res[curindex].correctAnswer) === i;

  console.log("IsCorrect:", isCorrect);

  setscore(prev => prev + (isCorrect ? 1 : -1));

  const nextIndex = curindex + 1;
  setcurindex(nextIndex);

  if (nextIndex >= saved.questionLimit) {
    setstatus("finished");
  }
};



  if (!saved) return <div>Loading quiz...</div>;

  return (
    <div className="min-h-screen w-full bg-linear-to-r from-red-200 via-purple-500 to-pink-500 relative flex flex-col">

      {showExitPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm  flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl md:text-3xl f3 font-bold text-gray-900 mb-4">Leave Test?</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">Your progress will be lost. Do you want to end the test or continue?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEndTest}
                className="bg-red-500 hover:bg-red-600 f3 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95"
              >
                End Test & See Score
              </button>
              <button
                onClick={handleContinueTest}
                className="bg-green-500 f3 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowExitPopup(false);
                  navigate("/");
                }}
                className="bg-gray-100 f3 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all active:scale-95"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}

     
      <div className="sticky top-0 left-0 w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-4 md:px-10 bg-white/10 backdrop-blur-xl border-b border-white/20 z-50">
        <h1 className="text-xl md:text-3xl font-black text-white f3 drop-shadow-md tracking-tight">
          {saved.category} <span className="opacity-70 font-light">Quiz</span>
        </h1>

        <div className="flex items-center gap-4">
          {saved.type === "Stop on Incorrect" && (
            <div className="bg-white/20 px-4 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <i className="ri-heart-fill text-red-500 animate-pulse"></i>
              <span className="text-white font-bold text-sm">Sudden Death</span>
            </div>
          )}

          {saved.type === "numberOfQuestions" && (
            <div className="bg-white/20 px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
              <span className="text-white/70 text-sm font-medium">Progress</span>
              <span className="text-white font-black text-lg">
                {curindex}/{saved.questionLimit}
              </span>
            </div>
          )}

          {saved.type === "timed" && (
            <div className="flex items-center gap-3">
              <div className={`px-6 py-2 rounded-full border flex items-center gap-2 transition-colors duration-500 ${timeLeft < 10 ? 'bg-red-500/40 border-red-500 animate-pulse' : 'bg-white/20 border-white/30'}`}>
                <span className="text-white font-black">
                  {timeLeft >= 60
                    ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                    : `${timeLeft}s`}
                </span>
              </div>

              <button
                onClick={() => setstatus("score")}
                className="bg-white/10 hover:bg-red-500 text-white px-5 py-2 rounded-full border border-white/20 transition-all font-bold text-sm active:scale-95"
              >
                Quit
              </button>
            </div>
          )}
        </div>
      </div>

      
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 max-w-5xl mx-auto w-full">
        {status === "playing" && (
          <div className="w-full animate-in slide-in-from-bottom-4 duration-500">
            {res[curindex] && (
              <div className="text-center mb-10 md:mb-16">
                <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
                  Question {curindex + 1}
                </span>
                <h1 className="text-2xl md:text-5xl font-bold text-white f3 leading-tight text-center">
                  {res[curindex].question}
                </h1>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
              {res[curindex]?.options?.map((item, i) => (
                <button
                  key={i}  disabled={answered}
                  onClick={() => saved.type === "Stop on Incorrect" ? correct(i) : Qcorrect(i)}
                  className="group relative bg-white/10 hover:bg-white text-white hover:text-purple-600 p-6 md:p-8 rounded-3xl border border-white/10 hover:border-white shadow-xl transition-all duration-300 flex items-center gap-6 text-left active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-white transition-colors duration-300"></div>
                  <div className="relative flex items-center gap-6 w-full">
                    <span className=" w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 group-hover:bg-purple-100 flex items-center justify-center font-black text-lg md:text-xl transition-colors">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-lg md:text-2xl font-bold flex-1 leading-tight">{item}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

   
      {(status === "lost" || status === "finished" || status === "score") && (
        <div className="fixed inset-0  flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className={`  w-full p-8 md:p-16 rounded-[40px] text-center shadow-2xl relative  ${status === "lost" ? "bg-red-500/90" : "bg-green-500/90"
            }`}>
            <div className="absolute -top-20 -left-20 w-64  h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <i className={`${status === "lost" ? "ri-close-circle-line" : "ri-checkbox-circle-line"
                } text-8xl md:text-[120px] text-white/30 block mb-6`}></i>

              <h2 className="f2 font-black text-5xl md:text-7xl text-white mb-8 tracking-tighter uppercase drop-shadow-2xl">
                {status === "lost" ? "Game Over" : status === "finished" ? "Mission Complete" : "Test Ended"}
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-12">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 min-w-[140px] border border-white/30">
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest block mb-2">Final Score</span>
                  <span className="text-white text-5xl md:text-6xl font-black">{score}</span>
                </div>
                {saved.type === "timed" && (
                  <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 min-w-[140px] border border-white/30">
                    <span className="text-white/60 text-xs font-black uppercase tracking-widest block mb-2">Attempts</span>
                    <span className="text-white text-5xl md:text-6xl font-black">{curindex}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (saved.type === "timed") setTimeLeft(timeLimit);
                    setstatus("playing");
                    setscore(0);
                    setcurindex(0);
                  }}
                  className="bg-white text-gray-900 rounded-2xl py-4 font-bold hover:shadow-xl transition-all active:scale-95"
                >
                  <i className="ri-refresh-line mr-2"></i> Try Again
                </button>
                <button
                  onClick={() => navigate("/qchose")}
                  className="bg-white/20 text-white rounded-2xl py-4 font-bold border border-white/30 hover:bg-white/30 transition-all active:scale-95"
                >
                  Switch Mode
                </button>
                <button
                  onClick={handleRandomQuiz}
                  className="bg-white/20 text-white rounded-2xl py-4 font-bold border border-white/30 hover:bg-white/30 transition-all active:scale-95"
                >
                  Random Quiz
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-white/20 text-white rounded-2xl py-4 font-bold border border-white/30 hover:bg-white/30 transition-all active:scale-95 col-span-2 md:col-span-1"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testwindow;
