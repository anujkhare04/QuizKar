import React from "react";
import Logo from "./Logo";
import { adduser, removeuser } from "../feature/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategories } from "../api/createApi";
import { logoutUser } from "../api/authapi";
import { useState } from "react";



const Navbar = () => {
  const { islogged, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      window.location.reload();
    }, 1500);

  };

  const handleRandomQuiz = async () => {
    try {
      // 1. Fetch available categories
      const categories = await getAllCategories();

      if (!categories || categories.length === 0) {
        alert("No categories available to play!");
        return;
      }

      // 2. Randomly select one category
      const randomCat = categories[Math.floor(Math.random() * categories.length)];

      // 3. Randomly select a mode
      const modes = ["numberOfQuestions", "timed", "Stop on Incorrect"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];

      // 4. Generate random settings based on mode
      let quizSettings = {
        category: randomCat,
        type: randomMode
      };

      if (randomMode === "numberOfQuestions") {
        // Random between 5 and 10 questions
        quizSettings.questionLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
      } else if (randomMode === "timed") {
        // Random between 1 and 5 minutes
        quizSettings.timeLimit = Math.floor(Math.random() * 5) + 1;
      }

      // 5. Navigate to the game window
      navigate(`/categories/${randomCat}`, {
        state: {
          quizData: quizSettings
        }
      });

    } catch (error) {
      console.error("Failed to start random quiz:", error);
    }
  };

  console.log(user);
  console.log(islogged);


  return (
    <div className="backdrop-blur-md bg-white/10 border-b border-white/20 overflow-hidden shadow-xl z-50 fixed top-0 w-full flex items-center justify-between px-12 py-5 transition-all duration-300">
      <div>
        <Logo />
      </div>

      <div className="f3 text-md flex items-center justify-between gap-10">
        <Link to="/">
          <button
            onClick={handleClick}
            disabled={loading}
            className="px-6 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20 disabled:opacity-50"
          >
            Home
          </button>






        </Link>
        <Link to="/create-quiz" className="px-6 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20 disabled:opacity-50"
        >
          Create Quiz
        </Link>

        

        {
          user ? (
            <button onClick={() => navigate("/profile")} className="rounded-full border-2 border-white/20 border-full  text-md text-white/90 active:scale-93 px-2 py-1"><i class="ri-user-fill"></i></button>

          ) : (
            <Link to="/login">
              <button className="px-6 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20 disabled:opacity-50"
              > Login
              </button>
            </Link>
          )}

        {user ? (
          <>
            <button
              onClick={async () => {
                await logoutUser();
                dispatch(removeuser());
                navigate("/login");
              }}
              className="px-6 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20 disabled:opacity-50"
            >
              Logout
            </button>
          </>
        ) : null}



        {" "}
        <button
          onClick={handleRandomQuiz}
          className="px-6 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20 disabled:opacity-50"
        >
          Random Quiz
        </button>

      </div>
    </div>
  );
};

export default Navbar;
