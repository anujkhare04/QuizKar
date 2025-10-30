import React, { useState } from "react";
import { useForm, useFormState, useFieldArray } from "react-hook-form";
import { Createquiz } from "../api/createApi";

const CreateQuizUI = () => {
  const {
    register,
    handleSubmit,
    control,
    reset
    // formState: { errors },
  } = useForm({
    defaultValues: {
      questions: [
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onsubmit = async (data) => {
    try {
      console.log("Form data submitted:", data);

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

    } catch (error) {
      console.log("Error :", error);

    }

    reset();
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-orange-200 via-purple-500 to-pink-500  shadow-md    flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className=" p-8 rounded-lg  w-full  space-y-6"
      >
        <h2 className="text-2xl  f2  text-black font-normal text-center">
          Create Quiz
        </h2>

        <div>
          <label
            htmlFor="title"
            className="block text-black font-semibold mb-2"
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

             { index === fields.length-1 && (
              <button 
               onClick={() => append({ question: "", options: ["", "", "", ""], correctAnswer: "" })}
              className=" mt-5 ml-3 py-2 mb-5 px-5 bg-purple-600 hover:bg-purple-700 text-black active:scale-98 rounded-md transition">
                Add question
              </button>
             )}

              <button
                onClick={() => {
                  if (fields.length > 1) remove(index);
                }}
                className=" mt-5 ml-3 py-2 mb-5 px-5 bg-purple-600 hover:bg-purple-700 text-black active:scale-98 rounded-md transition"
              >
                Remove question
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className=" ml-190 px-10 bg-purple-600 hover:bg-purple-700 text-black font-semibold py-3 active:scale-98 rounded-md transition"
        >
          Create Quiz
        </button>
      </form>
    </div>
    
  );
};

export default CreateQuizUI;
