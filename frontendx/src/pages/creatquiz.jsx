import React, { useState, useEffect } from "react";
import { useForm, useFormState, useFieldArray } from "react-hook-form";
import { Createquiz, Aiques, AiquesFromFile } from "../api/createApi";
import { useNavigate } from "react-router-dom";
import Mocktest from "./MockTest";


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

  const [mode, setMode] = useState("custom");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadQuestionCount, setUploadQuestionCount] = useState(5);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem("aiApiKey") || "");









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

  const formatAIErrorMessage = (error) => {
    const apiMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to generate AI quiz.";
    if (/expired|invalid api key|unauthorized|auth/i.test(apiMessage)) {
      return "AI API key invalid or expired. Please enter a valid API key.";
    }
    return apiMessage;
  };

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
        noques: data.question,
        apiKey: customApiKey.trim() || undefined,
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
      toast.error(formatAIErrorMessage(error));
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

  const handleFileQuizGenerate = async () => {
    if (!uploadFile) {
      toast.error("Please upload an image or PDF file");
      return;
    }
    if (!uploadCategory.trim()) {
      toast.error("Please enter a category");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("noques", String(uploadQuestionCount));
      if (customApiKey.trim()) {
        formData.append("apiKey", customApiKey.trim());
      }

      const res = await AiquesFromFile(formData);
      const normalizedQuiz = {
        title: "AI Generated Quiz (From File)",
        category: uploadCategory.trim(),
        questions: res.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: Number(q.correctAnswer),
        })),
      };

      await Createquiz(normalizedQuiz);
      toast.success("Quiz created from uploaded file!");
      setUploadFile(null);
      setUploadCategory("");
      setUploadQuestionCount(5);
      naviagte("/qchose");
    } catch (error) {
      console.log("Error in file-based generation:", error);
      toast.error(formatAIErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-full ">
      <div className="  max-w-10xl mt-30  mx-auto ">
        <div className=" bg-black fixed w-full top-0 z-10">
            <button onClick={()=>naviagte("/")} className=" bg-white  absolute top-0 left-3 z-200 mt-5 rounded-2xl px-5 py-1 active:scale-99 text-black f3">Back</button>
       
          <h2 className="  py-2   text-xl md:text-6xl font-bold text-white  text-center f3">
          Create Quiz 
        </h2>
        </div>
            <div className=" ">
          
          </div>
          <div className="flex flex-col lg:flex-row item-center justify-start gap-4 lg:gap-20">
        <div className="w-full lg:w-1/4 h-auto backdrop-blur-md p-6 md:p-10 shadow-2xl border mb-8">
          <h1 className="text-white f3 text-xl md:text-2xl mb-8 text-center lg:text-left">
            Select Method To Create Quiz  
          </h1>

          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-4">
            <button
              onClick={() => setMode("custom")}
              className={`gap-3 p-2 rounded-sm transition-all duration-300 ${mode === "custom"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}

                
            >
              <i className="text-xl ri-edit-2-line ">   </i>              
                 <span className="f3">Custom</span>
            </button>
            <button
              onClick={() => setMode("ai")}
              className={` gap-3 p-2 rounded-sm transition-all duration-300 ${mode === "ai"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <i className="text-xl ri-chat-ai-3-line">  </i>
              <span className="f3">AI Agent</span>
            </button>
            <button
              onClick={() => setMode("image")}
              className={`p-2 rounded-sm transition-all duration-300 ${mode === "image"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <i className="text-xl ri-image-2-line">   </i>
              <span className="f3">Image/PDF</span>
            </button>
             
             {/* <div className="">
              <h1 className="text-white f3 text-xl border-b-2 p-2 md:text-2xl mb-8 text-center md:text-left">
            Other Feature 
          </h1>
            <button 
              onClick={() => setMode("Mock")}
              className={`px-10 py-2 flex item-center rounded-sm transition-all duration-300 ${mode === "Mock"
                ? "bg-white text-purple-600 shadow-xl scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
                }`}
            >
              <i className="text ri-mic-line whitespace-nowrap">    </i>
                <span className="f3">Ai Mock Test <h5 className="text-xs"></h5></span>  
            </button>
             </div>
             */}
          </div>
        </div>
         
         <div className="w-full lg:w-3/4 mb-10">

         <div className=" ">
           {mode==="Mock"  && 
         
              <Mocktest/>
        }
         </div>
        {mode === "image" && (
          <div className="bg-white/10 mt-10  backdrop-blur-md rounded-3xl p-10 shadow-2xl border  text-center">
            <div className="max-w-full mx-auto">
              <div className="border-2 border-dashed border-white/30 rounded-3xl p-12 mb-6">
                <i className="ri-upload-cloud-2-line text-6xl text-white/50 mb-6 block"></i>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="quiz-file-upload"
                />
                <label
                  htmlFor="quiz-file-upload"
                  className="inline-block cursor-pointer bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all"
                >
                  Upload (PDF/IMG)
                </label>
                {uploadFile && (
                  <p className="mt-4 text-sm text-white/80">
                    Selected: <span className="font-bold">{uploadFile.name}</span>
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div>
                  <label className="block text-white font-medium mb-2 ml-1">Category*</label>
                  <input
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    placeholder="e.g., Biology, History"
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 ml-1">Questions*</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={uploadQuestionCount}
                    onChange={(e) => setUploadQuestionCount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  />
                </div>
              </div>
              <div className="mb-6 text-left">
                <label className="block text-white font-medium mb-2 ml-1">Custom AI API Key</label>
                <input
                  value={customApiKey}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomApiKey(value);
                    localStorage.setItem("aiApiKey", value);
                  }}
                  placeholder="Optional: Enter your Gemini API key"
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                />
                <p className="mt-2 text-xs text-white/60">Use this if the default backend AI key is expired.</p>
              </div>
              <button
                type="button"
                onClick={handleFileQuizGenerate}
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-purple-600 font-bold rounded-sm shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Generating from file..." : "Generate Quiz from File"}
              </button>
            </div>
          </div>
        )}

        {mode === "ai" && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border ">
            <form onSubmit={handleSubmit(on2)} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2 ml-1">Category*</label>
                <input
                  {...register("categories", { required: "Category is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
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
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="Enter 1-30"
                />
                {errors.question && <p className="mt-2 text-sm text-red-300 ml-1">{errors.question.message}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2 ml-1">Custom AI API Key</label>
                <input
                  value={customApiKey}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomApiKey(value);
                    localStorage.setItem("aiApiKey", value);
                  }}
                  placeholder="Optional: Enter your Gemini API key"
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                />
                <p className="mt-2 text-xs text-white/60">Enter this if the backend AI key is expired or invalid.</p>
              </div>

              <button
                type="submit"
                disabled={!isFormValid2 || isSubmitting}
                className="w-full py-4 bg-white text-purple-600 font-bold rounded-sm shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 mt-4"
              >
                {isSubmitting ? "Generating Exam..." : "Generate AI Quiz"}
              </button>
            </form>
          </div>
        )}

        

        {mode === "custom" && (
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border  space-y-6">
              <div>
                <label className="block text-white font-medium mb-2 ml-1">Quiz Title*</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2 ml-1">Category*</label>
                <input
                  {...register("categories", { required: "Category is required" })}
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="e.g., General Knowledge"
                />
              </div>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border  space-y-6 relative group">
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
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/30"
                  placeholder="Enter your question here"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-sm group-within:border-white/30 transition-all">
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
                className="flex-1 py-4 bg-white/10 text-white font-bold rounded-sm border  hover:bg-white/20 transition-all active:scale-95"
              >
                <i className="ri-add-line mr-2"></i> Add Question
              </button>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-2 py-4 bg-white text-purple-600 font-bold rounded-sm shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving Quiz..." : "Publish Quiz"}
              </button>
            </div>
          </form>
        )}
        </div>

        </div>
      </div>
    </div>
  );
};

export default CreateQuizUI;
