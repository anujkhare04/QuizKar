import React, { useState, useEffect } from 'react';
import { generateMockTestTopic, evaluateMockTest } from '../api/createApi';
import { useNavigate } from 'react-router-dom';

const MockTest = () => {



  return (
    <div className="min-h-screen  pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white f3 tracking-tight mb-4">
              AI <span className="font-light opacity-70">Mock Test</span>
            </h1>
            <p className="text-white/60 font-medium">Challenge yourself with AI-generated interview topics.</p>
          </div>

          <form className="space-y-10">
            <div className="space-y-4">
              <label className="block text-white text-sm font-bold uppercase tracking-widest ml-1 opacity-80" htmlFor="topic">
                Target Topic <span className="font-normal opacity-50">(Optional)</span>
              </label>

              <div className="relative group">
                <input
                  id="topic"
                  placeholder="e.g. React hooks, System Design, Node.js"
                  className="w-full bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-xl placeholder:text-white/20"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-400 transition-colors">
                  <i className="ri-search-2-line text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button className="flex-1 py-5 bg-white text-purple-600 font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all uppercase tracking-wider">
                Generate Test
              </button>
              <button className="flex-1 py-5 bg-white/10 text-white border border-white/10 font-bold text-xl rounded-2xl shadow-xl hover:bg-white/20 active:scale-95 transition-all uppercase tracking-wider">
                <i className="ri-shuffle-line mr-2"></i> Random Topic
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
