import React, { useState } from "react";
import QuizChose from "./quizchose";
import Testsetup from "./testsetup";


const QuizParent = () => {
  const [quizData, setQuizData] = useState(null);
 
 
  
  return (
    <div>
      {!quizData ? (
        
        <QuizChose setQuizData={setQuizData} />
        
      ) : (
       
        <Testsetup quizData={quizData} />
      )}
    </div>
  );
};

export default QuizParent;
