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

  // const handleViolation = () => {
  //   setstatus("finished");
  //   document.exitFullscreen();
  // };

  // const { enableFullScreen } = useQuizSecurity(handleViolation, 1);

  // const startQuiz = () => {
  //   enableFullScreen();
  //   setstatus("playing");
  // };

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
      setRes(res[0].questions);
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

  useEffect(() => {
    if (curindex >= res.length && res.length > 0) {
      setstatus("finished");
    }
  }, [curindex, res.length]);

  useEffect(() => {
    if (res.length > 0) {
      setRes(shuffle(res));
    }
  }, [res.length]);

  const correct = (i) => {
    //  console.log((res[curindex].correctAnswer));
    //  console.log(res[curindex].options[i]);

    if (res[curindex].correctAnswer === res[curindex].options[i]) {
      setscore((prev) => prev + 1);
      setcurindex((prev) => prev + 1);
    } else {
      setstatus("lost");
    }
  };

  const Qcorrect = (i) => {
    if (curindex + 1 >= saved.questionLimit) {
      setstatus("finished");
      return; // yeh actual stop hai
    }

    if (res[curindex].correctAnswer === res[curindex].options[i]) {
      setscore(prev => prev + 1);
    } else {
      setscore(prev => prev - 1);
    }

    setcurindex(prev => prev + 1);
  };


  if (!saved) return <div>Loading quiz...</div>;

  return (
    <div className="min-h-screen w-full bg-white relative">


      {showExitPopup && (
        <div className="fixed inset-0 bg-black/50 mt-10  flex items-center justify-center">
          <div className=" bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <h2 className="text-3xl  f3 font-bold text-gray-900 mb-4">Leave Test?</h2>
            <p className="text-gray-600 mb-6">Do you want to end the test or see your current score?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEndTest}
                className="bg-red-600 hover:bg-red-700 f3 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                End Test & See Score
              </button>
              <button
                onClick={handleContinueTest}
                className="bg-green-600 f3 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowExitPopup(false);
                  navigate("/");
                }}
                className="bg-gray-600 f3 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {status === "idle" && (
        <button
          onClick={startQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Start Quiz
        </button>
      )} */}

      {status === "started" && <p>Quiz is running…</p>}

      {status === "finished" && <p>Quiz ended due to rule violation!</p>}
      <div className="fixed top-0 left-0 w-full flex flex-col md:flex-row items-center justify-between py-4 px-8 bg-linear-to-r from-red-200 via-purple-500 to-pink-500 z-50">
        <h1 className="text-4xl font-bold py-4 bg-clip-text text-transparent bg-linear-to-r from-blue-900 via-blue-800 to-blue-900 text-center md:text-left">
          {saved.category} Quiz
        </h1>

        {saved.type === "Stop on Incorrect" && (
          <div className="flex items-center space-x-2 text-xl md:text-2xl drop-shadow-lg">
            <button className="p-3 gap-2 rounded-b-full bg-orange-100">
              <i className="ri-heart-fill text-3xl rounded-lg"></i>
            </button>
          </div>
        )}

        {saved.type === "numberOfQuestions" && (
          <div className="flex items-center space-x-2 text-xl md:text-2xl drop-shadow-lg">
            <button className="flex items-center justify-between gap-2 p-4 rounded-b-full bg-orange-100">
              <h1 className="f3">
                {curindex}/{saved.questionLimit}
              </h1>
            </button>
          </div>
        )}

        {saved.type === "timed" && (
          <div className="flex items-center justify-center gap-10 space-x-2 text-xl md:text-2xl drop-shadow-lg">
            <button className="flex items-center justify-between gap-2 px-5 py-2 rounded-2xl bg-orange-100">
              <h1>
                ⏰ Time Left:{" "}
                {timeLeft >= 60
                  ? `${Math.floor(timeLeft / 60)} min ${timeLeft % 60}s`
                  : `${timeLeft}s`}
              </h1>
            </button>

            <button
              onClick={() => setstatus("finished")}
              className="bg-red-500 f5 px-6 py-2 rounded-2xl shadow-md text-black active:scale-99"
            >
              End test
            </button>
          </div>
        )}
      </div>

      {/* stop on incorrect */}

      {saved.type === "Stop on Incorrect" && status === "playing" && (
        <div className="pt-[140px] px-8 min-h-screen bg-linear-to-r from-red-200 via-purple-500 to-pink-500">
          {res[curindex] && (
            <h1 className="w-full text-center p-2 f3 text-4xl py-10 text-black border-none focus:outline-none">
              Q{curindex + 1}. {res[curindex].question}
            </h1>
          )}

          <div className="flex flex-col  ">
            {res[curindex]?.options?.map((item, i) => (
              <button
                key={i}
                onClick={() => correct(i)}
                className="px-10 flex  py-7 w-90 h-20 rounded-3xl shadow-md active:scale-98 text-black text-2xl"
              >
                <div className="flex items-center gap-10">
                  <h1>{String.fromCharCode(65 + i)}.</h1>
                  {item}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "lost" && (
        <div className="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center bg-black/80 z-50">
          <div className="rounded-2xl  p-10 bg-red-700  w-full h-full flex flex-col items-center justify-center text-center shadow-lg ">
            <h2 className="f2 font-bold text-8xl mb-9 p-10">
              {status === "lost" ? "You Lost !!" : status === "finished" && saved.type === "Stop on Incorrect" ? "You Won !!" : "Your Result !!"}
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className=" items-center  h-40 w-40 rounded-full bg-white text-red-700 font-bold">
                <h1 className="text-xl f4 mt-10"> Final Score</h1>
                <h1 className="text-6xl">{score}</h1>
              </div>
            </div>
            <p className="text-lg  text-white">
              You clicked the wrong option.
              <br />
              Better luck next time!
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <button
                onClick={() => {
                  setstatus("playing");
                  setscore(0);
                  setcurindex(0);
                }}
                className="bg-white text-red-700 rounded-2xl mt-10 px-10 py-4 font-semibold"
              >
                Retry
              </button>
              <button onClick={() => navigate("/qchose")} className="bg-white text-black rounded-2xl active:scale-98 mt-10 px-10 py-4 font-semibold">Change Test Mode</button>
              <button onClick={handleRandomQuiz} className="bg-white text-black rounded-2xl mt-10 px-10 active:scale-98 py-4 font-semibold">Random Quiz</button>
              <button onClick={() => navigate("/")} className=" bg-white text-black rounded-2xl mt-10 active:scale-98 px-10 py-4 font-semibold">Home</button>
            </div>
          </div>
        </div>
      )}

      {saved.type === "Stop on Incorrect" && status === "finished" && (
        <div className="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center bg-black z-50">
          <div className="rounded-2xl p-10 bg-green-600 w-full h-full flex flex-col items-center justify-center  text-center shadow-lg border border-gray-600">
            <h2 className="f2 font-bold text-8xl mb-9 p-10">
              You Won !!
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="flex flex-col space-y-5  items-center justify-center h-50 w-50 rounded-full bg-white text-green-600 font-bold">
                <h1 className="text-3xl f4">FinalScore</h1>
                <h1 className="text-5xl">{score}</h1>
              </div>


            </div>
            <p className="text-lg text-white mb-6">
              Congratulations! You answered all questions correctly.
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <button
                onClick={() => {
                  setstatus("playing");
                  setscore(1);
                  setcurindex(0);
                }}
                className="bg-white text-black rounded-2xl mt-11 px-10 py-4 font-semibold"
              >
                Retry
              </button>
              <button onClick={() => navigate("/qchose")} className="bg-white text-black rounded-2xl active:scale-98 mt-10 px-10 py-4 font-semibold">Change Test Mode</button>
              <button onClick={handleRandomQuiz} className="bg-white text-black rounded-2xl mt-10 px-10 active:scale-98 py-4 font-semibold">Random Quiz</button>
              <button onClick={() => navigate("/")} className=" bg-white text-black rounded-2xl mt-10 active:scale-98 px-10 py-4 font-semibold">Home</button>
            </div>
          </div>
        </div>
      )}
      {/* stop on incorrect */}

      {/*  numberOfQuestions */}

      {saved.type === "numberOfQuestions" && status === "playing" && (
        <div className="pt-[140px] px-8 min-h-screen bg-linear-to-r from-red-200 via-purple-500 to-pink-500">
          {res[curindex] && (
            <h1 className="w-full text-center  p-2 f3 text-4xl rounded-2xl py-10 text-black border-none focus:outline-none">
              Q{curindex + 1}. {res[curindex].question}
            </h1>
          )}

          <div className="flex flex-col  ">
            {res[curindex]?.options?.map((item, i) => (
              <button
                key={i}
                onClick={() => Qcorrect(i)}
                className="px-10 flex  py-7 w-90 h-20 rounded-3xl shadow-md active:scale-98 text-black text-2xl"
              >
                <div className="flex items-center gap-10">
                  <h1>{String.fromCharCode(65 + i)}.</h1>
                  {item}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {saved.type === "numberOfQuestions" && status === "finished" && (
        <div className="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center bg-black z-50">
          <div className="rounded-2xl p-10 bg-green-600 w-full h-full flex flex-col items-center justify-center  text-center shadow-lg border border-gray-600">
            <h2 className="f2 font-bold text-8xl mb-9 p-10">
              Your Result !!
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="flex flex-col space-y-5  items-center justify-center h-50 w-50 rounded-full bg-white text-green-600 font-bold">
                <h1 className="text-3xl f4">FinalScore</h1>
                <h1 className="text-5xl">{score}</h1>
              </div>
            </div>
            <p className="text-lg text-white mb-6">

            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <button
                onClick={() => {
                  setstatus("playing");
                  setscore(1);
                  setcurindex(0);
                }}
                className="bg-white text-black font-semibold rounded-2xl mt-11 px-10 py-4"
              >
                Retry
              </button>
              <button onClick={() => navigate("/qchose")} className="bg-white text-black rounded-2xl active:scale-98 mt-10 px-10 py-4 font-semibold">Change Test Mode</button>
              <button onClick={handleRandomQuiz} className="bg-white text-black rounded-2xl mt-10 px-10 active:scale-98 py-4 font-semibold">Random Quiz</button>
              <button onClick={() => navigate("/")} className=" bg-white text-black rounded-2xl mt-10 active:scale-98 px-10 py-4 font-semibold">Home</button>
            </div>
          </div>
        </div>
      )}
      {/* numberOfQuestions */}

      {/* timed */}

      {saved.type === "timed" && status === "playing" && (
        <div className="pt-[140px] px-8 min-h-screen bg-linear-to-r from-red-200 via-purple-500 to-pink-500">
          {res[curindex] && (
            <h1 className="w-full text-center  p-2 f3 text-4xl rounded-2xl py-10 text-black border-none focus:outline-none">
              Q{curindex + 1}. {res[curindex].question}
            </h1>
          )}

          <div className="flex flex-col  ">
            {res[curindex]?.options?.map((item, i) => (
              <button
                key={i}
                onClick={() => Qcorrect(i)}
                className="px-10 flex  py-7 w-90 h-20 rounded-3xl shadow-md active:scale-98 text-black text-2xl"
              >
                <div className="flex items-center gap-10">
                  <h1>{String.fromCharCode(65 + i)}.</h1>
                  {item}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {saved.type === "timed" && status === "finished" && (
        <div className="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center bg-black z-50">
          <div className="rounded-2xl p-10 bg-green-600 w-full h-full flex flex-col items-center justify-center  text-center shadow-lg border border-gray-600">
            <h2 className="f2 font-bold text-8xl mb-9 p-10">
              Your Result !!
            </h2>
            <div className="flex items-center justify-center gap-10 ">
              <div className="flex flex-col space-y-5  items-center justify-center h-50 w-50 rounded-full bg-white text-green-600 font-bold">
                <h1 className="text-3xl f4">FinalScore</h1>
                <h1 className="text-5xl">{score}</h1>
              </div>
              <div className="flex flex-col space-y-5  items-center justify-center h-50 w-50 rounded-full bg-white text-green-600 font-bold">
                <h1 className="text-3xl f4 ">Question <br></br>
                  ( Attempt )</h1>
                <h1 className="text-5xl">{curindex}</h1>
              </div>
            </div>
            <p className="text-lg text-white mb-6"></p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <button
                onClick={() => {
                  setTimeLeft(timeLimit);
                  setstatus("playing");
                  setscore(0);
                  setcurindex(0);
                }}
                className="bg-white text-black rounded-2xl mt-11 px-10 py-4 font-semibold"
              >
                Retry
              </button>
              <button onClick={() => navigate("/qchose")} className="bg-white text-black rounded-2xl active:scale-98 mt-10 px-10 py-4 font-semibold">Change Test Mode</button>
              <button onClick={handleRandomQuiz} className="bg-white text-black rounded-2xl mt-10 px-10 active:scale-98 py-4 font-semibold">Random Quiz</button>
              <button onClick={() => navigate("/")} className=" bg-white text-black rounded-2xl mt-10 active:scale-98 px-10 py-4 font-semibold">Home</button>
            </div>
          </div>
        </div>
      )}
      {/* timeds */}

      {status === "score" && (
        <div className="absolute top-0 left-0 h-screen w-screen flex flex-col items-center justify-center bg-black z-50">
          <div className="rounded-2xl p-10 bg-green-600 w-full h-full flex flex-col items-center justify-center  text-center shadow-lg border border-gray-600">
            <h2 className="f2 font-bold text-8xl mb-9 p-10">
              No Result
            </h2>
            <div className="flex items-center justify-center mb-6">
              <div className="flex flex-col space-y-5  items-center justify-center h-50 w-50 rounded-full bg-white text-green-600 font-bold">
                <h1 className="text-3xl f4">FinalScore</h1>
                <h1 className="text-5xl">{score}</h1>
              </div>


            </div>
            <p className="text-lg text-white mb-6">

            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <button
                onClick={() => {
                  setstatus("playing");
                  setscore(1);
                  setcurindex(0);
                }}
                className="bg-white text-black rounded-2xl mt-11 px-10 py-4 font-semibold"
              >
                Retry
              </button>
              <button onClick={() => navigate("/qchose")} className="bg-white text-black rounded-2xl active:scale-98 mt-10 px-10 py-4 font-semibold">Change Test Mode</button>
              <button onClick={handleRandomQuiz} className="bg-white text-black rounded-2xl mt-10 px-10 active:scale-98 py-4 font-semibold">Random Quiz</button>
              <button onClick={() => navigate("/")} className=" bg-white text-black rounded-2xl mt-10 active:scale-98 px-10 py-4 font-semibold">Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testwindow;
