import { createContext, useState } from "react";

// Create a box to store data
export const QuizContext = createContext();

// Create a provider to wrap components
export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null); // box stores this data

  return (
    <QuizContext.Provider value={{ quizData, setQuizData }}>
      {children} 
    </QuizContext.Provider>
  );
};
