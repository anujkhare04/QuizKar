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
    <div className=" w-full bg-linear-to-r from-orange-200 via-purple-500 to-pink-500     ">
      <h2 className="bg-linear-to-r  shadow-md from-orange-200 via-purple-500 to-pink-500  fixed  w-full  top-0  text-2xl  py-6 f2  text-black font-normal text-center">
        Create Quiz
      </h2>

      <div className="  px-20 bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 w-full mt-29 py-2 ">
        <h1 className="text-black f3   text-3xl ">
          Select Method To Create Quiz (Questions){" "}
        </h1>

        <div className="flex items-center  text-xl justify-evenly gap-10 w-50 ">
          <button
            onClick={() => setMode("custom")}
            className=" p-4 whitespace-nowrap mt-10 mb-10  bg-white text-black f3 py-2 rounded-sm active:scale-99  transition"
          >
            <i class="text-2xl ri-custom-size"></i> Custom
          </button>
          <button
            onClick={() => setMode("ai")}
            className=" p-4 whitespace-nowrap mt-10 mb-10  bg-white text-black f3  active:scale-99  py-2 rounded-sm transition"
          >
            <i class="text-2xl ri-chat-ai-3-fill"></i> Ai Assitance
          </button>
          <button
            onClick={() => setMode("image")}
            className=" p-4 whitespace-nowrap mt-10 mb-10  bg-white text-black f3  active:scale-99  py-2 rounded-sm transition"
          >
            <i class="text-2xl ri-image-2-fill"></i> Image and Documents
          </button>

          <button
            onClick={() => setMode("Speak")}
            className=" p-4 whitespace-nowrap mt-10 mb-10  bg-white text-black f3  active:scale-99  py-2 rounded-sm transition"
          >
            <i class="mr-2 ri-speak-ai-fill"></i>Mock test
          </button>
        </div>
      </div>

      {mode === "image" && (
        <div className="w-full  flex items-center justify-center px-30 gap-10 py-5 ">


          <div className="h-70 w-120 flex flex-col mb-10 items-center justify-center bg-white/20">

            <button className="rounded-xl mb-20 bg-black text-white f3 px-5 py-1">
              <i class=" text-2xl ri-link "></i> Upload (pdf/img)
            </button>
            <h4 className="mb-1 text-sm ">
              Note-{" "}
              <span className="f5 font-lightbold">Minimum size: 5mb</span>
            </h4>{" "}
          </div>
        </div>


      )}
       {mode === "Speak" && (
       naviagte('/mock')


      )}

      {mode === "ai" && (
        <div className="px-10 py-5  mb-10 space-y-10">
          <form
            onSubmit={handleSubmit(on2)}
            className=" px-5 rounded-lg  w-full  space-y-8"
          >
            <div>
              <label
                htmlFor="category"
                className="block text-black  font-semibold mb-2"
              >
                Category*
              </label>
              <input
                id="category"
                {...register("categories", {
                  required: "category is required",
                })}
                type="text"
                className="w-full  px-4 py-6 shadow-lg text-black border-none focus:outline-none rounded-md "
                placeholder="e.g., Science, History, Technology"
              />
            </div>

            <div>
              <label
                htmlFor="question"
                className="block text-black  font-semibold mb-2"
              >
                No of Questions*
              </label>
              <input
                id="question"
                {...register("question", {
                  required: "question is required",
                 
                  min: {
                    value: 1,
                    message: "Minimum value is 1",
                  },
                  max: {
                    value: 30,
                    message: "Maximum value is 30",
                  },
                })}
                className="w-full  px-4 py-6 shadow-lg text-black border-none focus:outline-none rounded-md "
                placeholder="e.g., 5, 10, 20...."
              />
              {errors.question && (
  <p className="mt-1 text-sm text-red-500">
    {errors.question.message}
  </p>
)}
            </div>

            <button
              type="submit"
              disabled={!isFormValid2 || isSubmitting}
              className={`ml-120 mt-10 mb-10 px-10 py-3 rounded-md font-semibold transition
    ${!isFormValid2 || isSubmitting
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-white text-black active:scale-96"
                }`}
            >
              {isSubmitting ? "Creating..." : "Create Quiz"}
            </button>
          </form>
        </div>
      )}

      {mode === "custom" && (
        <form
          onSubmit={handleSubmit(onsubmit)}
          disabled={!isFormValid || isSubmitting}
          className=" { rounded-lg   px-20 mt-10 w-full  space-y-8"
        >
          <div className="">
            <label
              htmlFor="title"
              className="block text-black  font-semibold mb-2"
            >
              Title*
            </label>
            <input
              id="title*"
              {...register("title", { required: "title is required" })}
              type="text"
              className="w-full px-4 text-black py-6 shadow-lg  rounded-md focus:outline-none "
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-black  font-semibold mb-2"
            >
              Category*
            </label>
            <input
              id="category"
              {...register("categories", { required: "category is required" })}
              type="text"
              className="w-full  px-4 py-6 shadow-lg text-black border-none focus:outline-none rounded-md "
              placeholder="e.g., Science, History, Technology"
            />
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 w-full  ">
              <label
                htmlFor="question"
                className="block text-black font-semibold mb-2"
              >
                Question {index + 1}*
              </label>
              <input
                id={`question-${index}`}
                type="text"
                {...register(`questions.${index}.question`, { required: true })}
                className="w-full  px-4 py-6 shadow-lg text-black border-none focus:outline-none rounded-md"
                placeholder="Enter question"
              />

              <div className=" flex items-center justify-start gap-10 space-y-3 pt-2">
                {[0, 1, 2, 3].map((option, i) => (
                  <div
                    key={i}
                    className="  flex items-center gap-2 w-60  mb-2 mt-4 "
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={i}
                      {...register(`questions.${index}.correctAnswer`, {
                        required: true,
                      })}
                      className="mr-2 "
                    />
                    <input
                      type="text"
                      {...register(`questions.${index}.options.${i}`, {
                        required: true,
                      })}
                      placeholder={`Option ${i + 1}`}
                      className="text-sm p-4 text-black shadow-md focus:outline-none rounded-xl "
                    />
                  </div>
                ))}
              </div>
              <div>
                {index === fields.length - 1 && (
                  <button
                    onClick={() =>
                      append({
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                      })
                    }
                    className=" mt-5 ml-3 py-2 mb-5 px-5 bg-purple-600 f3 hover:bg-purple-700 text-black active:scale-98 rounded-md transition"
                  >
                    Add question
                  </button>
                )}

                <button
                  onClick={() => {
                    if (fields.length > 1) remove(index);
                  }}
                  className=" mt-5 ml-3 py-2 mb-5 px-5 f3 bg-purple-600 hover:bg-purple-700 text-black active:scale-98 rounded-md transition"
                >
                  Remove question
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`ml-120 mt-10 mb-10 px-10 py-3 rounded-md font-semibold transition
    ${!isFormValid || isSubmitting
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-white text-black active:scale-96"
              }`}
          >
            {isSubmitting ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateQuizUI;
