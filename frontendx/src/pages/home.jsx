import React, { useState } from 'react';

import Navbar from "../components/navbar";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const categories = [
  { name: "General Knowledge", color: "from-blue-400 to-blue-600" },
  { name: "Science", color: "from-green-400 to-green-600" },
  { name: "Geopolitics", color: "from-red-400 to-red-600" },
  { name: "Sports", color: "from-yellow-400 to-yellow-500" },
];


const Home = () => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();




  const handleClick = () => {

    setLoading(true);

    setTimeout(() => {
      navigate("/qchose"); // navigation happens AFTER loading
    }, 1500);



  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-20 flex flex-col justify-between text-gray-800 font-sans">

        <header className="px-6 md:px-20 py-12 md:py-24 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            <span className="text-4xl md:text-5xl font-light opacity-80">Welcome to</span>
            <div className="transform scale-125 md:scale-150 origin-left">
              <Logo />
            </div>
          </div>

          <p className="text-lg md:text-xl max-w-3xl mb-12 f3 leading-relaxed opacity-90">
            Your ultimate platform to create, take, and share quizzes. Challenge yourself or your friends with random quizzes or create your own customized quizzes!
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20">
            <h1 className="text-center f4 text-2xl md:text-3xl mb-8 text-white">Multiple Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`bg-linear-to-r ${cat.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 cursor-pointer border border-white/10`}
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-3">{cat.name}</h2>
                  <p className="text-sm f3 opacity-90">Explore quizzes in {cat.name} and test your knowledge!</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="px-6 md:px-20 mb-20">
          <button
            onClick={handleClick}
            className="f3 px-10 py-4 bg-white text-purple-600 font-bold rounded-full shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center gap-2 group"
          >
            <span>Get Started</span>
            <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>

        {loading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        <footer className="bg-black/10 backdrop-blur-md py-8 text-white/60 text-center text-sm border-t border-white/5">
          &copy; {new Date().getFullYear()} Quiz Website. All rights reserved.
        </footer>
      </div>

    </>
  );
};

export default Home;





