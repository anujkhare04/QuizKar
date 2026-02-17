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



  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setIsOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleRandomQuiz = async () => {
    setIsOpen(false);
    try {
      const categories = await getAllCategories();
      if (!categories || categories.length === 0) {
        alert("No categories available to play!");
        return;
      }
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const modes = ["numberOfQuestions", "timed", "Stop on Incorrect"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      let quizSettings = {
        category: randomCat,
        type: randomMode
      };
      if (randomMode === "numberOfQuestions") {
        quizSettings.questionLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
      } else if (randomMode === "timed") {
        quizSettings.timeLimit = Math.floor(Math.random() * 5) + 1;
      }
      navigate(`/categories/${randomCat}`, {
        state: { quizData: quizSettings }
      });
    } catch (error) {
      console.error("Failed to start random quiz:", error);
    }
  };

  return (
    <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-xl z-50 fixed top-0 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" onClick={handleClick} className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20">
              Home
            </Link>
            <Link to="/create-quiz" className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20">
              Create Quiz
            </Link>

            {user ? (
              <>
                <button onClick={() => navigate("/profile")} className="rounded-full border-2 border-white/20 text-white/90 active:scale-95 px-3 py-1.5">
                  <i className="ri-user-fill"></i>
                </button>
                <button
                  onClick={async () => {
                    await logoutUser();
                    dispatch(removeuser());
                    navigate("/login");
                  }}
                  className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20">
                Login
              </Link>
            )}

            <button
              onClick={handleRandomQuiz}
              className="px-4 py-2 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 border border-white/20"
            >
              Random Quiz
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white/80 p-2"
            >
              <i className={isOpen ? "ri-close-line text-2xl" : "ri-menu-line text-2xl"}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-black/60 backdrop-blur-lg border-t border-white/10`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={handleClick}
            className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            Home
          </Link>
          <Link
            to="/create-quiz"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            Create Quiz
          </Link>
          <button
            onClick={handleRandomQuiz}
            className="w-full text-left px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10 mt-2"
          >
            Random Quiz
          </button>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
              >
                Profile
              </Link>
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await logoutUser();
                  dispatch(removeuser());
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
