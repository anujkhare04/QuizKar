import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Testsetup from "./testsetup";
import { getAllCategories } from "../api/createApi";



const quizchose = ({ setQuizData }) => {

  const [formdata, setformdata] = useState('')
  const [categories, setCategories] = useState([]);




  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      type: "",
      questionLimit: 5,
      timeLimit: 1,

    },
  });





  const watchType = watch("type");
  const selectedCategory = watch("category");



  const onsubmit = (data) => {



    if (data.type !== "numberOfQuestions") {
      delete data.questionLimit;
    }

    setformdata(data);


    const finalData = { ...data, category: data.category };

    setQuizData(finalData);






  };

  useEffect(() => {

    console.log("formData updated:", formdata);
  }, [formdata]);

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories()


        const mappedCategories = data.map((cat) => ({
          name: cat,

        }));

        setCategories(mappedCategories);

      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-12 f3 drop-shadow-md">
          Choose Your <span className="font-light">Challenge</span>
        </h1>

        <form onSubmit={handleSubmit(onsubmit)} className="space-y-12">
          <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-6 md:p-10 shadow-2xl border border-white/20">
            <h2 className="f3 text-xl md:text-2xl text-white mb-8 ml-2 flex items-center gap-3">
              <i className="ri-layout-grid-fill text-yellow-400"></i>
              Select Category
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <label
                  key={cat.name}
                  className={`group relative rounded-3xl p-8 shadow-xl cursor-pointer overflow-hidden transition-all duration-300 border-2
                    ${selectedCategory === cat.name
                      ? "bg-white border-yellow-400 scale-105"
                      : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  <input
                    type="radio"
                    value={cat.name}
                    {...register("category", { required: true })}
                    className="absolute opacity-0"
                  />
                  <div className="relative z-10">
                    <h3 className={`text-xl md:text-2xl font-black mb-3 transition-colors ${selectedCategory === cat.name ? "text-purple-600" : "text-white"}`}>
                      {cat.name}
                    </h3>
                    <p className={`text-sm font-medium leading-relaxed opacity-70 ${selectedCategory === cat.name ? "text-purple-800" : "text-white/80"}`}>
                      Test your expertise in {cat.name} and climb the leaderboard!
                    </p>
                  </div>
                  {selectedCategory === cat.name && (
                    <div className="absolute top-4 right-4 text-yellow-500 animate-bounce">
                      <i className="ri-checkbox-circle-fill text-3xl"></i>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto w-full bg-white/10 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20">
            <h2 className="f3 text-xl md:text-2xl text-white mb-8 flex items-center gap-3">
              <i className="ri-settings-4-fill text-blue-400 font-normal"></i>
              Quiz Settings
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-4 ml-1">
                  Game Mode
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {["timed", "Stop on Incorrect", "numberOfQuestions"].map((mode) => (
                    <label key={mode} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${watchType === mode ? "bg-white border-yellow-400" : "bg-white/5 border-white/10 hover:bg-white/10"}`}>
                      <input
                        type="radio"
                        value={mode}
                        {...register("type", { required: true })}
                        className="w-5 h-5 accent-purple-500"
                      />
                      <span className={`font-bold capitalize ${watchType === mode ? "text-purple-600" : "text-white"}`}>
                        {mode === "timed" ? "⏱️ Timed Trial" : mode === "Stop on Incorrect" ? "💀 Sudden Death" : "📝 Practice Mode"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {watchType === "numberOfQuestions" && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-4 ml-1">Total Questions</label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    {...register("questionLimit", { required: true, min: 5, max: 30 })}
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-xl"
                    placeholder="Enter 5-30"
                  />
                </div>
              )}

              {watchType === "timed" && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-4 ml-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    {...register("timeLimit", { required: true, min: 1, max: 60 })}
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-xl"
                    placeholder="Enter minutes"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-5 bg-white text-purple-600 font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all mt-6 uppercase tracking-wider"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default quizchose;
