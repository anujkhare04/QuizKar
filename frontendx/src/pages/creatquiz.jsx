import React, { useState, useEffect } from "react";
import { useForm, useFormState, useFieldArray } from "react-hook-form";
import { Createquiz, Aiques } from "../api/createApi";
import { useNavigate } from "react-router-dom";


import { toast } from 'react-toastify';


const CreateQuizUI = () => {

  const naviagte = useNavigate();


  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      questions: [
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    },
  });

  const [mode, setMode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);









  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const title = watch("title");
  const questions = watch("questions");

  const category2 = watch("categories");
  const noques = watch("question");

  const isFormValid =
    title?.trim().length > 0 &&
    questions?.length > 0;

  const isFormValid2 =
    category2?.trim().length > 0 &&
    Number(noques) > 0;


  const on2 = async (data) => {
    try {
      console.log("Form data submitted:", data);

      if (!isFormValid2 || isSubmitting) return;

      setIsSubmitting(true);

      const quiz = {
        topic: data.categories,
        noques: data.question
      };

      console.log(quiz);

      const res = await Aiques(quiz);




      console.log(res);

      const normalizedQuiz = {
        title: "AI Generated Quiz",
        category: data.categories,
        questions: res.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: Number(q.correctAnswer),
        })),
      };

      await Createquiz(normalizedQuiz);

      toast.success("Quiz created successfully!");



      reset();

      naviagte("/qchose");


    } catch (error) {
      console.log("Error :", error);
    }
    finally {
      setIsSubmitting(false);
    }


  };




  const onsubmit = async (data) => {
    try {



      console.log("Form data submitted:", data);

      if (!isFormValid || isSubmitting) return;

      setIsSubmitting(true);

      const quiz = {
        title: data.title,
        category: data.categories,
        questions: data.questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      };

      console.log(quiz);

      const res = await Createquiz(quiz);

      console.log(res);

      toast.success("Quiz created successfully!");

      reset();

      naviagte("/qchose");

    } catch (error) {
      console.log("Error :", error);

    }
    finally {
      setIsSubmitting(false);
    }


  };


  return (
    <div className="w-full min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center f3">
          Create Quiz
        </h2>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20 mb-8">
          <h1 className="text-white f3 text-xl md:text-2xl mb-8 text-center md:text-left">
            Select Method To Create Quiz
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setMode("custom")}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 ${mode === "custom"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <i className="text-3xl ri-edit-2-line"></i>
              <span className="font-medium">Custom</span>
            </button>
            <button
              onClick={() => setMode("ai")}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 ${mode === "ai"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <i className="text-3xl ri-chat-ai-3-line"></i>
              <span className="font-medium">AI Agent</span>
            </button>
            <button
              onClick={() => setMode("image")}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 ${mode === "image"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <i className="text-3xl ri-image-2-line"></i>
              <span className="font-medium">Image/PDF</span>
            </button>
            <button
              onClick={() => setMode("Speak")}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 ${mode === "Speak"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <i className="text-3xl ri-mic-line"></i>
              <span className="font-medium">Mock Test</span>
            </button>
          </div>
        </div>

        {mode === "image" && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/20 text-center">
            <div className="max-w-md mx-auto">
              <div className="border-2 border-dashed border-white/30 rounded-3xl p-12 mb-6">
                <i className="ri-upload-cloud-2-line text-6xl text-white/50 mb-6 block"></i>
                <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all">
                  Upload (PDF/IMG)
                </button>
              </div>
              <p className="text-white/70 text-sm">
                Minimum file size: <span className="text-white font-bold">5MB</span> recommand
              </p>
            </div>
          </div>
        )}

        {mode === "ai" && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit(on2)} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2 ml-1">Category*</label>
                <input
                  {...register("categories", { required: "Category is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="e.g., Science, History, Technology"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2 ml-1">Number of Questions*</label>
                <input
                  type="number"
                  {...register("question", {
                    required: "Required",
                    min: { value: 1, message: "Min 1" },
                    max: { value: 30, message: "Max 30" },
                  })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="Enter 1-30"
                />
                {errors.question && <p className="mt-2 text-sm text-red-300 ml-1">{errors.question.message}</p>}
              </div>

              <button
                type="submit"
                disabled={!isFormValid2 || isSubmitting}
                className="w-full py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 mt-4"
              >
                {isSubmitting ? "Generating Exam..." : "Generate AI Quiz"}
              </button>
            </form>
          </div>
        )}

        {mode === "custom" && (
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20 space-y-6">
              <div>
                <label className="block text-white font-medium mb-2 ml-1">Quiz Title*</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2 ml-1">Category*</label>
                <input
                  {...register("categories", { required: "Category is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="e.g., General Knowledge"
                />
              </div>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20 space-y-6 relative group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-lg">Question {index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-300 hover:text-red-400 p-2 transition-colors"
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  )}
                </div>

                <input
                  {...register(`questions.${index}.question`, { required: true })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="Enter your question here"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl group-within:border-white/30 transition-all">
                      <input
                        type="radio"
                        value={i}
                        {...register(`questions.${index}.correctAnswer`, { required: true })}
                        className="w-5 h-5 accent-purple-500 cursor-pointer"
                      />
                      <input
                        {...register(`questions.${index}.options.${i}`, { required: true })}
                        placeholder={`Option ${i + 1}`}
                        className="w-full bg-transparent text-white focus:outline-none placeholder:text-white/20"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => append({ question: "", options: ["", "", "", ""], correctAnswer: "" })}
                className="flex-1 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all active:scale-95"
              >
                <i className="ri-add-line mr-2"></i> Add Question
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-[2] py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving Quiz..." : "Publish Quiz"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateQuizUI;
