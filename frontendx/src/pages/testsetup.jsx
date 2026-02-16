import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getcategory } from "../api/createApi";
import Testwindow from "./testwindow";

const testsetup = ({ quizData }) => {
  if (!quizData) return null;

  console.log("test-", quizData);

  return (
    <div className="w-full overflow-x-hidden max-h-screen bg-linear-to-r from-orange-200 via-purple-500 to-pink-500">
      <div className="relative w-full shadow -md flex flex-col md:flex-row items-center justify-between py-10 px-8 mb-10">
        <div className="absolute inset-0 rounded-lg  bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 -z-10"></div>

        <h1 className="text-4xl  font-bold py-4 bg-clip-text text-transparent bg-linear-to-r from-black via-blue-900 to-blue-900 text-center md:text-left">
          {quizData.category} Quiz  
        </h1>
           
           
        <div className="flex items-center justify-center  gap-10">
          {quizData.type === "numberOfQuestions" && (
            <button className=" bg-purple-900 text-white px-7  py-4 text-xl f4 rounded-b-4xl ">
               Number of Question - {quizData.questionLimit}
            </button>
          )}

          {quizData.type === "timed" && (
            <button className=" bg-purple-900 text-white px-7 py-4 text-xl f4 rounded-b-4xl ">
               Time
            </button>
          )}

          {quizData.type === "Stop on Incorrect" && (
            <button className=" bg-purple-900 text-white px-7 py-4 text-xl f3 rounded-b-4xl ">
               Stop on Incorrect
            </button>
          )}
        </div>
      </div>

      <div className=" max-h-auto bg-linear-to-r from-orange-200 via-purple-500 to-pink-500   ">
        <div>
          <h1 className="f3 px-7   text-xl ">Rules for Test</h1>

          <div className="p-10 flex item-center justify-between mt-10 gap-10 w-screen  ">
            <div className="p-4 bg-orange-100 rounded-lg cursor-pointer hover:scale-105 transition duration-300">
              <h2 className="text-xl font-semibold mb-4">
                Number of Questions
              </h2>
              <p className="text-gray-700 mt-1">
                You can select how many questions you want in the quiz. The quiz
                will end after answering the set number of questions.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Score:</strong> +1 for each correct answer, -1 for each
                incorrect answer.
              </p>
            </div>

            <div className="p-4 bg-orange-100 rounded-lg cursor-pointer hover:scale-105 transition duration-300 ">
              <h2 className="text-xl font-semibold mb-4">Stop on Incorrect</h2>
              <p className="text-gray-700 mt-1">
                The quiz continues until you answer a question incorrectly. Once
                a wrong answer is given, the quiz ends immediately.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Score:</strong> +1 for each correct answer until the
                first incorrect answer. No negative points are given, but the
                quiz stops instantly on a wrong answer.
              </p>
            </div>
            <div className="p-4 bg-orange-100 rounded-lg cursor-pointer hover:scale-105 transition duration-300 ">
              <h2 className="text-xl font-semibold mb-4">Timed Mode</h2>
              <p className="text-gray-700 mt-1">
                You have a limited amount of time to complete the quiz. Answer
                as many questions as you can before time runs out.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Score:</strong> +1 for each correct answer, -1 for each
                incorrect answer. Unanswered questions do not affect your score.
              </p>
            </div>
          </div>
        </div>

        <Link to={`/categories/${quizData.category}`} state={{ quizData }}>
          <button   className="className=' mb-10 mt-20 f3 ml-150 px-1 w-40 py-3 bg-orange-100 rounded-sm active:scale-95">
            Start Test
          </button>
        </Link>
      </div>
    </div>
  );
};

export default testsetup;

// HERE prop drilling only passed to their children quiz chose and testsetup but when it goes to test window is undefined that why use link to passed data uselocation
//When you passed quizData as a prop to Testwindow inside testsetup, it worked only because Testwindow was rendered directly inside testsetup in the same component tree. But when you changed your app to use a React Router <Link> to navigate to a new route, the new page doesn’t receive props from the previous component.

// Props are only passed downward in the component tree, not across routes. When you navigate to a different URL, React mounts a new component tree for that route — your old quizData prop isn’t automatically carried over. That’s why saved was undefined.

// By using useLocation() and location.state, you’re essentially passing the data via navigation state, which survives the route change without relying on props.
