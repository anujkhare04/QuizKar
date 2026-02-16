import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../api/createApi';

const Random = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startRandomQuiz = async () => {
      try {
        // Fetch available categories
        const categories = await getAllCategories();

        if (!categories || categories.length === 0) {
          alert("No categories available to play!");
          navigate("/");
          return;
        }

        // Randomly select one category
        const randomCat = categories[Math.floor(Math.random() * categories.length)];

        // Randomly select a mode
        const modes = ["numberOfQuestions", "timed", "Stop on Incorrect"];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];

        // Generate random settings based on mode
        let quizSettings = {
          category: randomCat,
          type: randomMode
        };

        if (randomMode === "numberOfQuestions") {
          // Random between 5 and 10 questions
          quizSettings.questionLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
        } else if (randomMode === "timed") {
          // Random between 1 and 5 minutes
          quizSettings.timeLimit = Math.floor(Math.random() * 5) + 1;
        }

        console.log("Starting Random Quiz:", quizSettings);

        // Navigate to the game window
        navigate(`/categories/${randomCat}`, {
          state: {
            quizData: quizSettings
          }
        });

      } catch (error) {
        console.error("Failed to start random quiz:", error);
        navigate("/");
      }
    };

    startRandomQuiz();
  }, [navigate]);

  return (
    <div className='bg-linear-to-r from-orange-200 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center'>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <h1 className='text-2xl font-bold text-white'>Loading Random Quiz...</h1>
      </div>
    </div>
  );
};

export default Random;
