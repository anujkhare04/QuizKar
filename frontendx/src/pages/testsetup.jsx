import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getcategory } from "../api/createApi";
import Testwindow from "./testwindow";

const testsetup = ({ quizData }) => {
  if (!quizData) return null;

  console.log("test-", quizData);

  return (
    <div className="min-h-screen bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-10">

       
        <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 md:p-12 mb-10 border border-white/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="text-center md:text-left">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest mb-4">
              Quiz Confirmation
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white f3 tracking-tight drop-shadow-lg">
              {quizData.category}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {quizData.type === "numberOfQuestions" && (
              <div className="bg-purple-900/40 backdrop-blur-md border border-purple-400/30 text-white px-8 py-4 text-xl font-bold rounded-2xl shadow-xl">
                <i className="ri-questionnaire-line mr-2"></i> {quizData.questionLimit} Questions
              </div>
            )}

            {quizData.type === "timed" && (
              <div className="bg-purple-900/40 backdrop-blur-md border border-purple-400/30 text-white px-8 py-4 text-xl font-bold rounded-2xl shadow-xl">
                <i className="ri-time-line mr-2"></i> {quizData.timeLimit} Minutes
              </div>
            )}

            {quizData.type === "Stop on Incorrect" && (
              <div className="bg-red-500/40 backdrop-blur-md border border-red-400/30 text-white px-8 py-4 text-xl font-bold rounded-2xl shadow-xl">
                <i className="ri-skull-line mr-2"></i> Sudden Death
              </div>
            )}
          </div>
        </div>

        
        <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="f3 text-2xl md:text-3xl text-white mb-10 border-b border-white/10 pb-4">
            Master the Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           
            <div className="p-8 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-orange-400/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="ri-list-check-2 text-orange-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-black text-white mb-4">Practice Mode</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Select your preferred question count. The quiz concludes once you've tackled the set limit.
              </p>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Scoring</p>
                <p className="text-white font-bold text-sm">+1 Correct | -1 Incorrect</p>
              </div>
            </div>

            <div className="p-8 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-red-400/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="ri-flashlight-line text-red-100 text-2xl"></i>
              </div>
              <h3 className="text-xl font-black text-white mb-4">Sudden Death</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                High stakes! One wrong move and it's game over. How long can you survive the heat?
              </p>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Scoring</p>
                <p className="text-white font-bold text-sm">+1 Point until error</p>
              </div>
            </div>

            <div className="p-8 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-400/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className="ri-alarm-line text-blue-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-black text-white mb-4">Timed Trial</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Race against the clock. Answer as many as you can before the timer hits zero!
              </p>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Scoring</p>
                <p className="text-white font-bold text-sm">+1 Correct | -1 Incorrect</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link to={`/categories/${quizData.category}`} state={{ quizData }} className="w-full md:w-auto">
              <button className="w-full md:px-20 py-5 bg-white text-purple-600 font-black text-2xl rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all uppercase tracking-[0.2em]">
                Ignite Quiz
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default testsetup;

